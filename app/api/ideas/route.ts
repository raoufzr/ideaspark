import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const niche = searchParams.get('niche')
  const search = searchParams.get('search')

  let query = supabase
    .from('ideas')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (niche && niche !== 'all') query = query.eq('niche', niche)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let filtered = data || []
  if (search) {
    const s = search.toLowerCase()
    filtered = filtered.filter(record =>
      record.niche.toLowerCase().includes(s) ||
      record.ideas_json.some((idea: any) =>
        idea.title.toLowerCase().includes(s) ||
        idea.hook.toLowerCase().includes(s)
      )
    )
  }

  return NextResponse.json({ ideas: filtered })
}

export async function DELETE(req: NextRequest) {
  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  const { error } = await supabase.from('ideas').delete().eq('id', id).eq('user_id', session.user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
