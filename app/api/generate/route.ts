import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { GenerateRequest, PLAN_LIMITS } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()
    const { niche, audience, goal, language } = body

    if (!niche?.trim()) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Check auth and usage limits
    const supabase = createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      const { data: user } = await supabase
        .from('users')
        .select('plan, generations_used')
        .eq('id', session.user.id)
        .single()

      if (user) {
        const limit = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS]
        if (user.generations_used >= limit) {
          return NextResponse.json({
            error: `You've reached your ${user.plan} plan limit of ${limit} generations/month. Please upgrade.`
          }, { status: 429 })
        }
      }
    }

    const langInstruction = language === 'arabic'
      ? 'Generate all titles, hooks, and thumbnail concepts in Arabic language.'
      : 'Generate all content in English.'

    const systemPrompt = `You are a YouTube strategy expert. ${langInstruction} Always respond with a valid JSON array only. No markdown, no explanation, just the raw JSON array.`

    const userPrompt = `Generate 10 unique YouTube video ideas for:
- Niche: ${niche}
- Target Audience: ${audience || 'general audience'}
- Content Goal: ${goal}

Return a JSON array of exactly 10 objects, each with:
{
  "title": "clickbait-optimized title",
  "hook": "first 15 seconds script",
  "thumbnail_concept": "visual description for thumbnail",
  "estimated_views_potential": "low" or "medium" or "high",
  "content_type": "tutorial" or "story" or "list" or "challenge"
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.9,
        max_tokens: 4000,
      })
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'Groq API error')
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) throw new Error('No response from AI')

    let ideas
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('No JSON array found')
      ideas = JSON.parse(jsonMatch[0])
    } catch {
      throw new Error('Failed to parse AI response')
    }

    // Save to DB if authenticated
    if (session?.user) {
      await supabase.from('ideas').insert({
        user_id: session.user.id,
        niche,
        audience: audience || '',
        goal,
        language,
        ideas_json: ideas,
      })

      await supabase
        .from('users')
        .update({ generations_used: supabase.rpc('increment_generations', { user_id: session.user.id }) as any })
        .eq('id', session.user.id)
    }

    return NextResponse.json({ ideas })
  } catch (error: any) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 })
  }
}
