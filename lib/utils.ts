import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  }).format(new Date(date))
}

export function exportToCSV(ideas: any[], filename = 'ideas') {
  const headers = ['Title', 'Hook', 'Thumbnail Concept', 'Views Potential', 'Content Type']
  const rows = ideas.flatMap(record =>
    record.ideas_json.map((idea: any) => [
      `"${idea.title.replace(/"/g, '""')}"`,
      `"${idea.hook.replace(/"/g, '""')}"`,
      `"${idea.thumbnail_concept.replace(/"/g, '""')}"`,
      idea.estimated_views_potential,
      idea.content_type
    ])
  )
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const viewsPotentialColor = {
  low: 'text-yellow-500',
  medium: 'text-blue-400',
  high: 'text-green-400'
}

export const contentTypeEmoji = {
  tutorial: '🎓',
  story: '📖',
  list: '📋',
  challenge: '🏆'
}
