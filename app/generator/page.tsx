'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Zap, Copy, Check, BookmarkPlus, TrendingUp, Eye, Film, ChevronDown, Globe, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { VideoIdea, GenerateRequest } from '@/types'
import { contentTypeEmoji, viewsPotentialColor } from '@/lib/utils'

const goals = [
  { value: 'educate', label: 'Educate', emoji: '🎓' },
  { value: 'entertain', label: 'Entertain', emoji: '🎭' },
  { value: 'sell', label: 'Sell', emoji: '💰' },
]

function IdeaCard({ idea, index }: { idea: VideoIdea; index: number }) {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const potentialColors: Record<string, string> = {
    low: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    high: 'bg-green-500/10 text-green-400 border-green-500/20',
  }

  return (
    <div className="idea-card rounded-2xl border border-white/8 bg-white/3 p-6 animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-3xl text-white/10 tracking-wider">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${potentialColors[idea.estimated_views_potential]}`}>
              <TrendingUp className="w-3 h-3" />
              {idea.estimated_views_potential} potential
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/50">
          <span>{contentTypeEmoji[idea.content_type]}</span>
          {idea.content_type}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-white/30 uppercase tracking-wider font-mono">Title</label>
          <button onClick={() => copy(idea.title, 'title')} className="flex items-center gap-1 text-xs text-white/30 hover:text-white transition-colors">
            {copied === 'title' ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
        </div>
        <h3 className="text-white font-semibold text-lg leading-snug">{idea.title}</h3>
      </div>

      {/* Hook */}
      <div className="mb-4 p-4 rounded-xl bg-[#FF0000]/5 border border-[#FF0000]/10">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-[#FF0000]/70 uppercase tracking-wider font-mono flex items-center gap-1">
            <Film className="w-3 h-3" /> Hook (0-15s)
          </label>
          <button onClick={() => copy(idea.hook, 'hook')} className="text-xs text-[#FF0000]/50 hover:text-[#FF0000] transition-colors flex items-center gap-1">
            {copied === 'hook' ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
        </div>
        <p className="text-white/70 text-sm leading-relaxed italic">"{idea.hook}"</p>
      </div>

      {/* Thumbnail concept */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-white/30 uppercase tracking-wider font-mono flex items-center gap-1">
            <Eye className="w-3 h-3" /> Thumbnail
          </label>
          <button onClick={() => copy(idea.thumbnail_concept, 'thumb')} className="text-xs text-white/30 hover:text-white transition-colors flex items-center gap-1">
            {copied === 'thumb' ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
        </div>
        <p className="text-white/50 text-sm">{idea.thumbnail_concept}</p>
      </div>
    </div>
  )
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-6" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="shimmer-loading h-8 w-12 rounded" />
        <div className="shimmer-loading h-5 w-24 rounded-full" />
      </div>
      <div className="shimmer-loading h-4 w-20 rounded mb-2" />
      <div className="shimmer-loading h-6 w-full rounded mb-1" />
      <div className="shimmer-loading h-6 w-3/4 rounded mb-4" />
      <div className="shimmer-loading h-20 w-full rounded-xl mb-4" />
      <div className="shimmer-loading h-4 w-full rounded mb-1" />
      <div className="shimmer-loading h-4 w-2/3 rounded" />
    </div>
  )
}

export default function GeneratorPage() {
  const [form, setForm] = useState<GenerateRequest>({
    niche: '',
    audience: '',
    goal: 'educate',
    language: 'english',
  })
  const [ideas, setIdeas] = useState<VideoIdea[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = async () => {
    if (!form.niche.trim()) { setError('Please enter your niche'); return }
    setLoading(true)
    setError(null)
    setIdeas([])

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setIdeas(data.ideas)
      setGenerated(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const isRTL = form.language === 'arabic'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF0000] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="font-display text-lg tracking-wider">IDEASPARK</span>
        </div>
        <Link href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors">Dashboard</Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[380px,1fr] gap-10">
          {/* Form Panel */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-4xl tracking-wider mb-1">GENERATE</h1>
              <p className="text-white/40 text-sm">Fill in your details to get AI-powered ideas</p>
            </div>

            {/* Niche */}
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider font-mono mb-2">Your Niche *</label>
              <input
                value={form.niche}
                onChange={e => setForm(p => ({ ...p, niche: e.target.value }))}
                placeholder="e.g. Personal Finance, Gaming, Cooking..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#FF0000]/50 focus:bg-[#FF0000]/3 transition-all text-sm"
              />
            </div>

            {/* Audience */}
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider font-mono mb-2">Target Audience</label>
              <input
                value={form.audience}
                onChange={e => setForm(p => ({ ...p, audience: e.target.value }))}
                placeholder="e.g. 18-35 year olds interested in investing..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#FF0000]/50 transition-all text-sm"
              />
            </div>

            {/* Goal */}
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider font-mono mb-2">Content Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {goals.map(g => (
                  <button
                    key={g.value}
                    onClick={() => setForm(p => ({ ...p, goal: g.value as any }))}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                      form.goal === g.value
                        ? 'border-[#FF0000]/50 bg-[#FF0000]/10 text-white'
                        : 'border-white/8 text-white/40 hover:border-white/15 hover:text-white/70'
                    }`}
                  >
                    <span>{g.emoji}</span>
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider font-mono mb-2">
                <Globe className="w-3 h-3 inline mr-1" />
                Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['english', 'arabic'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setForm(p => ({ ...p, language: lang }))}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                      form.language === lang
                        ? 'border-[#FF0000]/50 bg-[#FF0000]/10 text-white'
                        : 'border-white/8 text-white/40 hover:border-white/15'
                    }`}
                  >
                    {lang === 'english' ? '🇬🇧 English' : '🇸🇦 العربية'}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#FF0000] hover:bg-[#cc0000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg transition-all flex items-center justify-center gap-3 glow-red"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
              ) : (
                <><Zap className="w-5 h-5 fill-white" /> Generate 10 Ideas</>
              )}
            </button>

            <p className="text-center text-xs text-white/25">5 free generations/month • No credit card needed</p>
          </div>

          {/* Results Panel */}
          <div>
            {!generated && !loading && (
              <div className="h-full flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-[#FF0000]/10 border border-[#FF0000]/20 flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-[#FF0000]" />
                  </div>
                  <h2 className="font-display text-3xl tracking-wider mb-2">READY TO SPARK</h2>
                  <p className="text-white/30 text-sm">Fill in the form and hit generate</p>
                </div>
              </div>
            )}

            {loading && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Loader2 className="w-5 h-5 text-[#FF0000] animate-spin" />
                  <span className="text-white/50 text-sm">Claude AI is crafting your ideas...</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
                </div>
              </div>
            )}

            {ideas.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-2xl tracking-wider">YOUR IDEAS</h2>
                    <p className="text-white/30 text-xs mt-0.5">{ideas.length} ideas for "{form.niche}"</p>
                  </div>
                  <Link href="/auth" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#FF0000]/30 text-[#FF0000] text-sm hover:bg-[#FF0000]/10 transition-all">
                    <BookmarkPlus className="w-4 h-4" />
                    Save All
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
                  {ideas.map((idea, i) => <IdeaCard key={i} idea={idea} index={i} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
