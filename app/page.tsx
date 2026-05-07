'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Zap, TrendingUp, Globe, Star, Check, ArrowRight, Play, Sparkles, Youtube } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for trying out',
    features: ['5 generations/month', '10 ideas per generation', 'English & Arabic support', 'Copy ideas to clipboard'],
    cta: 'Start Free',
    href: '/auth',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 9,
    period: 'month',
    description: 'For serious creators',
    features: ['Unlimited generations', '10 ideas per generation', 'Save ideas to library', 'Export to CSV', 'Scripts + titles', 'Trending analysis'],
    cta: 'Go Pro',
    href: '/auth?plan=pro',
    highlight: true,
  },
  {
    name: 'Agency',
    price: 29,
    period: 'month',
    description: 'For teams & agencies',
    features: ['Everything in Pro', '5 YouTube accounts', 'Weekly reports', 'API access', 'Priority support', 'Bulk export'],
    cta: 'Go Agency',
    href: '/auth?plan=agency',
    highlight: false,
  },
]

const niches = ['Cooking', 'Finance', 'Gaming', 'Fitness', 'Tech Reviews', 'Travel', 'Self-Help', 'Business']
const stats = [{ value: '50K+', label: 'Ideas Generated' }, { value: '2.3K', label: 'Creators' }, { value: '10s', label: 'Per Generation' }, { value: '4.9★', label: 'Rating' }]

export default function LandingPage() {
  const [activeNiche, setActiveNiche] = useState(0)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-md bg-[#0a0a0a]/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display text-xl tracking-wider">IDEASPARK</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth" className="text-sm text-white/70 hover:text-white transition-colors">Sign in</Link>
          <Link href="/auth" className="text-sm px-4 py-2 rounded-lg bg-[#FF0000] hover:bg-[#cc0000] text-white font-medium transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 text-center grid-bg">
        {/* Red orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FF0000]/5 blur-[120px] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 text-[#FF0000] text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Claude AI
          </div>

          <h1 className="font-display text-7xl md:text-9xl tracking-wider leading-none mb-6 animate-fade-in">
            GENERATE
            <br />
            <span className="gradient-text glow-red-text">30 YOUTUBE</span>
            <br />
            IDEAS IN
            <br />
            <span className="text-white/20">10 SECONDS</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 font-body leading-relaxed animate-fade-in">
            Stop staring at a blank page. Enter your niche, audience, and goal —
            get scroll-stopping video ideas with hooks, thumbnails, and view potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link href="/generator" className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-[#FF0000] hover:bg-[#cc0000] text-white font-semibold text-lg transition-all duration-200 glow-red">
              <Zap className="w-5 h-5 fill-white" />
              Generate Free Ideas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#how" className="flex items-center gap-2 px-6 py-4 rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium transition-all">
              <Play className="w-4 h-4" />
              See how it works
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-4xl tracking-wider text-[#FF0000]">{stat.value}</div>
                <div className="text-white/40 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Niche showcase */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-5xl md:text-6xl tracking-wider mb-4">
              ANY NICHE. <span className="gradient-text">INSTANTLY.</span>
            </h2>
            <p className="text-white/50">Works for every type of YouTube channel</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {niches.map((niche, i) => (
              <button
                key={i}
                onClick={() => setActiveNiche(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeNiche === i
                    ? 'bg-[#FF0000] text-white'
                    : 'border border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                }`}
              >
                {niche}
              </button>
            ))}
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'AI-Powered Titles', desc: 'Clickbait-optimized titles that get clicks without being misleading', color: 'text-[#FF0000]' },
              { icon: Play, title: 'Hook Scripts', desc: 'First 15-second scripts designed to retain viewers and reduce drop-off', color: 'text-blue-400' },
              { icon: TrendingUp, title: 'Trending Analysis', desc: 'Ideas ranked by view potential based on current YouTube trends', color: 'text-green-400' },
              { icon: Globe, title: 'Arabic & English', desc: 'Full RTL support for Arabic content creators', color: 'text-purple-400' },
              { icon: Star, title: 'Save & Organize', desc: 'Build your idea library and never lose a great concept', color: 'text-yellow-400' },
              { icon: Youtube, title: 'Thumbnail Concepts', desc: 'Visual descriptions to brief your designer or create yourself', color: 'text-orange-400' },
            ].map((f, i) => (
              <div key={i} className="idea-card p-6 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5">
                <f.icon className={`w-8 h-8 ${f.color} mb-4`} />
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-6xl tracking-wider mb-4">
            HOW IT <span className="gradient-text">WORKS</span>
          </h2>
          <p className="text-white/50 mb-16">Three steps to your next viral video</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enter Your Niche', desc: 'Tell us your channel topic, target audience, and content goal' },
              { step: '02', title: 'AI Generates Ideas', desc: 'Claude AI crafts 10 unique ideas with titles, hooks & thumbnail concepts' },
              { step: '03', title: 'Copy & Create', desc: 'Save ideas to your library, export to CSV, or start filming immediately' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="font-display text-8xl tracking-wider text-white/5 mb-4">{item.step}</div>
                <h3 className="font-semibold text-white text-lg mb-2 -mt-8">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 right-0 w-1/2 h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-5xl md:text-6xl tracking-wider mb-4">
              SIMPLE <span className="gradient-text">PRICING</span>
            </h2>
            <p className="text-white/50">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-6 border transition-all ${
                plan.highlight
                  ? 'border-[#FF0000]/50 bg-[#FF0000]/5 glow-red'
                  : 'border-white/8 bg-white/3'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF0000] text-white text-xs font-semibold">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-display text-2xl tracking-wider text-white">{plan.name}</h3>
                  <p className="text-white/40 text-sm mt-1">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="font-display text-5xl tracking-wider text-white">${plan.price}</span>
                    {plan.price > 0 && <span className="text-white/40">/{plan.period}</span>}
                    {plan.price === 0 && <span className="text-white/40">/{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-[#FF0000] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight
                    ? 'bg-[#FF0000] hover:bg-[#cc0000] text-white'
                    : 'border border-white/15 hover:border-white/25 text-white hover:bg-white/5'
                }`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-6xl md:text-8xl tracking-wider mb-6">
            START
            <br />
            <span className="gradient-text">TODAY</span>
          </h2>
          <p className="text-white/50 mb-8 text-lg">5 free generations. No credit card needed.</p>
          <Link href="/generator" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[#FF0000] hover:bg-[#cc0000] text-white font-bold text-xl transition-all glow-red">
            <Zap className="w-6 h-6 fill-white" />
            Generate Your First Ideas
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center text-white/30 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded bg-[#FF0000] flex items-center justify-center">
            <Zap className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="font-display tracking-wider">IDEASPARK</span>
        </div>
        <p>© {new Date().getFullYear()} IdeaSpark. Powered by Claude AI.</p>
      </footer>
    </div>
  )
}
