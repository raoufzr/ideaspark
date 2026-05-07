'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Check, ArrowLeft, Loader2, Crown } from 'lucide-react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['5 generations/month', '10 ideas per generation', 'English & Arabic', 'Copy to clipboard'],
    cta: 'Start Free',
    action: 'signup',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    features: ['Unlimited generations', '10 ideas per generation', 'Save to library', 'Export CSV', 'Scripts + hooks', 'Trending analysis', 'Priority support'],
    cta: 'Upgrade to Pro',
    action: 'stripe',
    popular: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 29,
    features: ['Everything in Pro', '5 YouTube channels', 'Weekly trend reports', 'API access', 'Bulk export', 'Dedicated support'],
    cta: 'Go Agency',
    action: 'stripe',
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handlePlan = async (plan: typeof plans[0]) => {
    if (plan.action === 'signup') { router.push('/auth'); return }
    setLoading(plan.id)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: plan.id })
    })
    const data = await res.json()
    if (data.url) { window.location.href = data.url }
    else { router.push('/auth?plan=' + plan.id) }
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="text-center mb-12">
          <h1 className="font-display text-6xl tracking-wider mb-4">PRICING</h1>
          <p className="text-white/40">Start free. No credit card required.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`relative rounded-2xl p-7 border ${plan.popular ? 'border-[#FF0000]/40 bg-[#FF0000]/5' : 'border-white/8 bg-white/3'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full bg-[#FF0000] text-white text-xs font-bold">
                  <Crown className="w-3 h-3" /> MOST POPULAR
                </div>
              )}
              <h2 className="font-display text-3xl tracking-wider mb-1">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-6xl tracking-wider">${plan.price}</span>
                {plan.price > 0 && <span className="text-white/40">/month</span>}
                {plan.price === 0 && <span className="text-white/40">forever</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-[#FF0000] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlan(plan)}
                disabled={loading === plan.id}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.popular ? 'bg-[#FF0000] hover:bg-[#cc0000] text-white' : 'border border-white/15 hover:border-white/25 text-white hover:bg-white/5'
                }`}
              >
                {loading === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
