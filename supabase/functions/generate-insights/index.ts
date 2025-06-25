import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InsightsRequest {
  relationshipId: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { relationshipId }: InsightsRequest = await req.json()

    // Get user from JWT
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify relationship belongs to user and get data
    const { data: relationship, error: relError } = await supabaseClient
      .from('relationships')
      .select(`
        *,
        relationship_categories(
          categories(name, color)
        )
      `)
      .eq('id', relationshipId)
      .eq('user_id', user.id)
      .single()

    if (relError || !relationship) {
      return new Response(JSON.stringify({ error: 'Relationship not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get interactions for this relationship
    const { data: interactions, error: intError } = await supabaseClient
      .from('interactions')
      .select('*')
      .eq('relationship_id', relationshipId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (intError) {
      throw new Error(`Failed to fetch interactions: ${intError.message}`)
    }

    if (!interactions || interactions.length < 3) {
      return new Response(JSON.stringify({ 
        error: 'Not enough interactions to generate insights. Log more interactions first.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Generate comprehensive insights
    const insights = await generateComprehensiveInsights(relationship, interactions)

    // Store insights in database
    const { error: upsertError } = await supabaseClient
      .from('insights')
      .upsert({
        relationship_id: relationshipId,
        interaction_trends: insights.interactionTrends,
        emotional_summary: insights.emotionalSummary,
        relationship_forecasts: insights.relationshipForecasts,
        smart_suggestions: insights.smartSuggestions,
        generated_at: new Date().toISOString()
      })

    if (upsertError) {
      console.error('Failed to store insights:', upsertError)
    }

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function generateComprehensiveInsights(relationship: any, interactions: any[]) {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Interaction Trends
  const weeklyInteractions = interactions.filter(i => 
    new Date(i.created_at) > oneWeekAgo
  ).length

  const monthlyInteractions = interactions.filter(i => 
    new Date(i.created_at) > oneMonthAgo
  ).length

  const averageXP = interactions.reduce((sum, i) => sum + (i.xp_gained || 0), 0) / interactions.length

  // Emotional Summary
  const sentiments = interactions
    .map(i => i.ai_analysis?.sentiment)
    .filter(Boolean)

  const positiveCount = sentiments.filter(s => s === 'positive').length
  const negativeCount = sentiments.filter(s => s === 'negative').length
  const neutralCount = sentiments.filter(s => s === 'neutral').length

  const commonTone = positiveCount > negativeCount && positiveCount > neutralCount ? 'Positive' :
                    negativeCount > positiveCount && negativeCount > neutralCount ? 'Negative' :
                    'Balanced'

  // Relationship Forecasts
  const forecasts = generateForecasts(relationship, interactions, averageXP)

  // Smart Suggestions
  const suggestions = generateSmartSuggestions(relationship, interactions)

  return {
    interactionTrends: {
      totalInteractions: interactions.length,
      weeklyFrequency: weeklyInteractions,
      monthlyFrequency: monthlyInteractions,
      averageXP: Math.round(averageXP * 10) / 10,
      trendInsight: generateTrendInsight(relationship.name, weeklyInteractions, monthlyInteractions)
    },
    emotionalSummary: {
      commonTone,
      sentimentDistribution: {
        positive: Math.round((positiveCount / sentiments.length) * 100),
        negative: Math.round((negativeCount / sentiments.length) * 100),
        neutral: Math.round((neutralCount / sentiments.length) * 100)
      },
      emotionalKeywords: extractEmotionalKeywords(interactions),
      summary: generateEmotionalSummary(relationship.name, commonTone, interactions.length)
    },
    relationshipForecasts: {
      forecasts,
      confidence: calculateForecastConfidence(interactions.length)
    },
    smartSuggestions: {
      suggestions
    },
    generatedAt: new Date().toISOString()
  }
}

function generateTrendInsight(name: string, weekly: number, monthly: number): string {
  if (weekly === 0 && monthly === 0) {
    return `You haven't logged any interactions with ${name} recently. Consider reaching out!`
  }
  
  if (weekly > 2) {
    return `You're very active with ${name} this week! Your relationship is clearly thriving.`
  }
  
  if (monthly > weekly * 3) {
    return `Your interactions with ${name} have been consistent this month. Great job maintaining the connection!`
  }
  
  return `You maintain a steady relationship with ${name}. Consider scheduling regular check-ins.`
}

function extractEmotionalKeywords(interactions: any[]): string[] {
  const keywords = new Set<string>()
  
  interactions.forEach(interaction => {
    if (interaction.ai_analysis?.emotionalTone) {
      interaction.ai_analysis.emotionalTone.forEach((tone: string) => keywords.add(tone))
    }
  })
  
  return Array.from(keywords).slice(0, 5)
}

function generateEmotionalSummary(name: string, tone: string, count: number): string {
  return `Your relationship with ${name} shows a ${tone.toLowerCase()} emotional pattern across ${count} interactions. This suggests a ${tone === 'Positive' ? 'healthy and supportive' : tone === 'Negative' ? 'challenging but important' : 'stable and balanced'} connection.`
}

function generateForecasts(relationship: any, interactions: any[], averageXP: number) {
  const forecasts = []
  
  // Growth trajectory
  if (averageXP > 2) {
    forecasts.push({
      path: "Deepening Connection",
      confidence: 85,
      reasoning: "High-quality interactions suggest this relationship will continue to strengthen."
    })
  }
  
  // Stability forecast
  if (interactions.length > 10) {
    forecasts.push({
      path: "Stable Friendship",
      confidence: 90,
      reasoning: "Consistent interaction history indicates a reliable, long-term relationship."
    })
  }
  
  // Evolution potential
  const categories = relationship.relationship_categories?.map((rc: any) => rc.categories.name) || []
  if (categories.includes('Friend') && relationship.level >= 5) {
    forecasts.push({
      path: "Potential for Deeper Bond",
      confidence: 70,
      reasoning: "Current level and friendship category suggest potential for closer connection."
    })
  }
  
  return forecasts.length > 0 ? forecasts : [{
    path: "Continued Growth",
    confidence: 75,
    reasoning: "Based on current interaction patterns, this relationship shows positive potential."
  }]
}

function generateSmartSuggestions(relationship: any, interactions: any[]) {
  const suggestions = []
  
  // Recent activity check
  const lastInteraction = interactions[0]
  const daysSinceLastInteraction = Math.floor(
    (Date.now() - new Date(lastInteraction.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  if (daysSinceLastInteraction > 7) {
    suggestions.push({
      type: "Reconnection Nudge",
      content: `It's been ${daysSinceLastInteraction} days since you logged an interaction with ${relationship.name}. How are they doing?`
    })
  }
  
  // Level-based suggestions
  if (relationship.level < 5) {
    suggestions.push({
      type: "Growth Opportunity",
      content: `Try sharing something personal with ${relationship.name} to deepen your connection.`
    })
  } else {
    suggestions.push({
      type: "Maintenance",
      content: `Your relationship with ${relationship.name} is strong. Consider planning a meaningful activity together.`
    })
  }
  
  // Topic-based suggestions
  const recentTopics = interactions
    .slice(0, 5)
    .flatMap(i => i.ai_analysis?.topics || [])
  
  if (recentTopics.includes('work')) {
    suggestions.push({
      type: "Personal Connection",
      content: `You've been discussing work with ${relationship.name}. Try asking about their personal interests or hobbies.`
    })
  }
  
  return suggestions.slice(0, 3) // Limit to 3 suggestions
}

function calculateForecastConfidence(interactionCount: number): number {
  if (interactionCount < 5) return 60
  if (interactionCount < 10) return 75
  if (interactionCount < 20) return 85
  return 95
}