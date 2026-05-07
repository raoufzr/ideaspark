export interface VideoIdea {
  title: string
  hook: string
  thumbnail_concept: string
  estimated_views_potential: 'low' | 'medium' | 'high'
  content_type: 'tutorial' | 'story' | 'list' | 'challenge'
}

export interface GenerateRequest {
  niche: string
  audience: string
  goal: 'educate' | 'entertain' | 'sell'
  language: 'arabic' | 'english'
}

export interface IdeaRecord {
  id: string
  user_id: string
  niche: string
  audience: string
  ideas_json: VideoIdea[]
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  plan: 'free' | 'pro' | 'agency'
  generations_used: number
  created_at: string
}

export interface Subscription {
  user_id: string
  stripe_customer_id: string
  plan: 'free' | 'pro' | 'agency'
  status: 'active' | 'canceled' | 'past_due'
}

export type Plan = 'free' | 'pro' | 'agency'

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 5,
  pro: Infinity,
  agency: Infinity
}

export const PLAN_PRICES = {
  free: 0,
  pro: 9,
  agency: 29
}
