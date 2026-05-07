import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const headers = ['Niche', 'Audience', 'Title', 'Hook', 'Thumbnail Concept', 'Views Potential', 'Content Type', 'Created At']
  const rows = (data || []).flatMap((record: any) =>
    record.ideas_json.map((idea: any) => [
      `"${(record.niche || '').replace(/"/g, '""')}"`,
      `"${(record.audience || '').replace(/"/g, '""')}"`,
      `"${(idea.title || '').replace(/"/g, '""')}"`,
      `"${(idea.hook || '').replace(/"/g, '""')}"`,
      `"${(idea.thumbnail_concept || '').replace(/"/g, '""')}"`,
      idea.estimated_views_potential || '',
      idea.content_type || '',
      new Date(record.created_at).toLocaleDateString(),
    ].join(','))
  )

  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="ideaspark-ideas-${Date.now()}.csv"`,
    },
  })
}
