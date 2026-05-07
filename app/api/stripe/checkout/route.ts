import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServerClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' })

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO!,
  agency: process.env.STRIPE_PRICE_AGENCY!,
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json()
  if (!PRICE_IDS[plan]) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { user_id: session.user.id, plan },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
