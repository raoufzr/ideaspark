import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createSupabaseServerClient } from '@/lib/supabase'
import { GenerateRequest, PLAN_LIMITS } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()
    const { niche, audience, goal, language } = body

    if (!niche?.trim()) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
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
            error: `You've reached your ${user.plan} plan limit of ${limit} generations/month. Please upgrade to continue.`
          }, { status: 429 })
        }
      }
    }

    // Build prompt
    const langInstruction = language === 'arabic'
      ? 'Generate all titles, hooks, and thumbnail concepts in Arabic language.'
      : 'Generate all content in English.'

    const systemPrompt = `You are a YouTube strategy expert with deep knowledge of viral content, audience psychology, and platform algorithms. Generate creative, unique, high-quality video ideas.

${langInstruction}

Always respond with a valid JSON array of exactly 10 objects. No markdown, no explanation, just the JSON array.`

    const userPrompt = `Generate 10 unique YouTube video ideas for:
- Niche: ${niche}
- Target Audience: ${audience || 'general audience'}
- Content Goal: ${goal} (educate viewers / entertain / sell product or service)

For each idea return a JSON object with these exact fields:
{
  "title": "clickbait-optimized title that creates curiosity without misleading",
  "hook": "compelling first 15 seconds script that grabs attention immediately",
  "thumbnail_concept": "visual description for the thumbnail - colors, text overlay, facial expression, props",
  "estimated_views_potential": "low" | "medium" | "high",
  "content_type": "tutorial" | "story" | "list" | "challenge"
}

Make titles irresistible, hooks dramatic, and thumbnails visually striking.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    let ideas
    try {
      const text = content.text.trim()
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

      // Increment usage counter
      await supabase.rpc('increment_generations', { user_id: session.user.id })
    }

    return NextResponse.json({ ideas })
  } catch (error: any) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 })
  }
}
