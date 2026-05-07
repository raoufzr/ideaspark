'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Zap, Search, Download, Trash2, Copy, Check, TrendingUp, Film,
  Eye, LogOut, Settings, Plus, BarChart3, BookOpen, Crown, ChevronDown
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { IdeaRecord, VideoIdea, UserProfile } from '@/types'
import { formatDate, contentTypeEmoji } from '@/lib/utils'

const PLAN_COLORS = { free: 'text-white/50', pro: 'text-blue-400', agency: 'text-yellow-400' }
const PLAN_ICONS = { free: null, pro: Crown, agency: Crown }

function IdeaMiniCard({ idea, index }: { idea: VideoIdea; index: number }) {
  const [copied, setCopied] = useState(false)
  const potentialBg = { low: 'bg-yellow-500/10 text-yellow-400', medium: 'bg-blue-500/10 text-blue-400', high: 'bg-green-500/10 text-green-400' }

  return (
    <div className="p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${potentialBg[idea.estimated_views_potential]}`}>
          {idea.estimated_views_potential}
        </span>
        <span className="text-xs text-white/30">{contentTypeEmoji[idea.content_type]} {idea.content_type}</span>
      </div>
      <p className="text-white/80 text-sm font-medium leading-snug mb-2">{idea.title}</p>
      <p className="text-white/30 text-xs line-clamp-2 mb-3">{idea.hook}</p>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(`${idea.title}\n\nHook: ${idea.hook}\n\nThumbnail: ${idea.thumbnail_concept}`)
          setCopied(true); setTimeout(() => setCopied(false), 2000)
        }}
        className="flex items-center gap-1 text-xs text-white/25 hover:text-white/70 transition-colors"
      >
        {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy idea</>}
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [ideas, setIdeas] = useState<IdeaRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterNiche, setFilterNiche] = useState('all')
  const [niches, setNiches] = useState<string[]>([])
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }

      const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single()
      setUser(profile)

      await fetchIdeas()
      setLoading(false)
    }
    init()
  }, [])

  const fetchIdeas = useCallback(async () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterNiche !== 'all') params.set('niche', filterNiche)

    const res = await fetch(`/api/ideas?${params}`)
    if (res.ok) {
      const data = await res.json()
      setIdeas(data.ideas)
      const uniqueNiches = Array.from(
  new Set(data.ideas.map((r: IdeaRecord) => r.niche))
)
      setNiches(uniqueNiches)
    }
  }, [search, filterNiche])

  useEffect(() => { fetchIdeas() }, [fetchIdeas])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await fetch('/api/ideas', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setIdeas(prev => prev.filter(r => r.id !== id))
    setDeletingId(null)
  }

  const handleExport = () => { window.location.href = '/api/export' }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleUpgrade = async (plan: string) => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  const usagePercent = user ? (user.plan === 'free' ? Math.min((user.generations_used / 5) * 100, 100) : 0) : 0
  const totalIdeas = ideas.reduce((sum, r) => sum + r.ideas_json.length, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#FF0000] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <p className="text-white/40 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display text-lg tracking-wider">IDEASPARK</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: 'Overview', icon: BarChart3, active: true },
            { label: 'My Ideas', icon: BookOpen },
            { label: 'Generator', icon: Zap, href: '/generator' },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href || '#'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                item.active ? 'bg-[#FF0000]/10 text-white border border-[#FF0000]/20' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          {user?.plan === 'free' && (
            <div className="mb-4 p-3 rounded-xl bg-[#FF0000]/5 border border-[#FF0000]/15">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/50">Generations</span>
                <span className="text-white/70">{user.generations_used}/5</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#FF0000] rounded-full transition-all" style={{ width: `${usagePercent}%` }} />
              </div>
              <button onClick={() => handleUpgrade('pro')} className="w-full mt-3 py-2 rounded-lg bg-[#FF0000] text-white text-xs font-semibold hover:bg-[#cc0000] transition-all">
                Upgrade to Pro
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF0000]/20 flex items-center justify-center text-[#FF0000] font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs truncate">{user?.email}</p>
              <p className={`text-xs capitalize font-medium ${PLAN_COLORS[user?.plan || 'free']}`}>
                {user?.plan} plan
              </p>
            </div>
            <button onClick={handleSignOut} className="text-white/25 hover:text-white/70 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
          <div>
            <h1 className="font-display text-3xl tracking-wider">DASHBOARD</h1>
            <p className="text-white/30 text-xs mt-0.5">Your idea library & analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm transition-all">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <Link href="/generator" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF0000] hover:bg-[#cc0000] text-white text-sm font-semibold transition-all">
              <Plus className="w-4 h-4" />
              Generate Ideas
            </Link>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Ideas', value: totalIdeas, icon: Zap, color: 'text-[#FF0000]' },
              { label: 'Generations', value: ideas.length, icon: BarChart3, color: 'text-blue-400' },
              { label: 'Niches', value: niches.length, icon: BookOpen, color: 'text-green-400' },
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/8 bg-white/3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/40 text-sm">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="font-display text-4xl tracking-wider text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search ideas, niches, hooks..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#FF0000]/30 transition-all text-sm"
              />
            </div>
            <select
              value={filterNiche}
              onChange={e => setFilterNiche(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 focus:outline-none text-sm"
            >
              <option value="all">All Niches</option>
              {niches.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Ideas List */}
          {ideas.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="font-display text-2xl tracking-wider text-white/30 mb-2">NO IDEAS YET</h3>
              <p className="text-white/20 text-sm mb-6">Generate your first batch of ideas to get started</p>
              <Link href="/generator" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF0000] hover:bg-[#cc0000] text-white font-semibold text-sm transition-all">
                <Zap className="w-4 h-4 fill-white" />
                Generate Ideas
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ideas.map(record => (
                <div key={record.id} className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
                  <div
                    className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/2 transition-colors"
                    onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FF0000]/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-[#FF0000]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{record.niche}</h3>
                        <p className="text-white/30 text-xs">{record.ideas_json.length} ideas • {formatDate(record.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(record.id) }}
                        disabled={deletingId === record.id}
                        className="p-2 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${expandedRecord === record.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {expandedRecord === record.id && (
                    <div className="border-t border-white/5 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {record.ideas_json.map((idea, i) => (
                          <IdeaMiniCard key={i} idea={idea} index={i} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
