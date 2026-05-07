import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeKey || stripeKey.includes('placeholder')) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(stripeKey, { apiVersion: '2024-10-28.acacia' as any })

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const { user_id, plan } = session.metadata
      await supabaseAdmin.from('users').update({ plan }).eq('id', user_id)
      await supabaseAdmin.from('subscriptions').upsert({
        user_id,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        plan,
        status: 'active',
      }, { onConflict: 'user_id' })
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object
      const { data: subscriptionRecord } = await supabaseAdmin
        .from('subscriptions').select('user_id')
        .eq('stripe_subscription_id', sub.id).single()
      if (subscriptionRecord) {
        const status = sub.status === 'active' ? 'active' : sub.status === 'canceled' ? 'canceled' : 'past_due'
        await supabaseAdmin.from('subscriptions')
          .update({ status, current_period_end: new Date(sub.current_period_end * 1000).toISOString() })
          .eq('stripe_subscription_id', sub.id)
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object
      const { data: subscriptionRecord } = await supabaseAdmin
        .from('subscriptions').select('user_id')
        .eq('stripe_subscription_id', sub.id).single()
      if (subscriptionRecord) {
        await supabaseAdmin.from('users').update({ plan: 'free' }).eq('id', subscriptionRecord.user_id)
        await supabaseAdmin.from('subscriptions')
          .update({ plan: 'free', status: 'canceled' })
          .eq('stripe_subscription_id', sub.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
