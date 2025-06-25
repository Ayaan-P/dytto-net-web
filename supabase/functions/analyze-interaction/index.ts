import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InteractionRequest {
  relationshipId: string
  content: string
  tags?: string[]
}

interface AIAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative'
  emotionalTone: string[]
  topics: string[]
  suggestions: string[]
  confidence: number
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

    const { relationshipId, content, tags = [] }: InteractionRequest = await req.json()

    // Get user from JWT
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify relationship belongs to user
    const { data: relationship, error: relError } = await supabaseClient
      .from('relationships')
      .select('id, level, xp, name')
      .eq('id', relationshipId)
      .eq('user_id', user.id)
      .single()

    if (relError || !relationship) {
      return new Response(JSON.stringify({ error: 'Relationship not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Analyze interaction with AI
    const aiAnalysis = await analyzeInteraction(content)
    const xpGained = calculateXPGain(content, aiAnalysis.sentiment, relationship.level)

    // Calculate sentiment score
    const sentimentScore = aiAnalysis.sentiment === 'positive' ? 0.8 : 
                          aiAnalysis.sentiment === 'negative' ? -0.3 : 0.1

    // Create interaction record
    const { data: interaction, error: intError } = await supabaseClient
      .from('interactions')
      .insert({
        relationship_id: relationshipId,
        content,
        sentiment_score: sentimentScore,
        xp_gained: xpGained,
        ai_analysis: aiAnalysis,
        tags
      })
      .select()
      .single()

    if (intError) {
      throw new Error(`Failed to create interaction: ${intError.message}`)
    }

    // Update relationship XP and level
    const newXP = relationship.xp + xpGained
    const newLevel = calculateLevel(newXP)
    const leveledUp = newLevel > relationship.level

    const { error: updateError } = await supabaseClient
      .from('relationships')
      .update({
        xp: newXP,
        level: newLevel,
        last_interaction: new Date().toISOString()
      })
      .eq('id', relationshipId)

    if (updateError) {
      console.error('Failed to update relationship:', updateError)
    }

    // Log level history if leveled up
    if (leveledUp) {
      await supabaseClient
        .from('level_history')
        .insert({
          relationship_id: relationshipId,
          old_level: relationship.level,
          new_level: newLevel,
          xp_gained: xpGained,
          interaction_id: interaction.id
        })

      // Generate milestone quest for special levels
      if ([3, 5, 7, 10].includes(newLevel)) {
        await generateMilestoneQuest(supabaseClient, relationshipId, newLevel, relationship.name)
      }
    }

    // Trigger insights generation in background
    try {
      await generateInsights(supabaseClient, relationshipId)
    } catch (error) {
      console.error('Failed to generate insights:', error)
    }

    return new Response(JSON.stringify({
      interaction,
      leveledUp,
      newLevel,
      xpGained,
      aiAnalysis
    }), {
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

async function analyzeInteraction(content: string): Promise<AIAnalysis> {
  // Mock AI analysis for demo - replace with actual AI service
  const positiveWords = ['happy', 'great', 'amazing', 'wonderful', 'love', 'excited', 'fantastic', 'awesome']
  const negativeWords = ['sad', 'angry', 'frustrated', 'disappointed', 'terrible', 'awful', 'hate', 'annoyed']
  
  const words = content.toLowerCase().split(/\s+/)
  const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length
  const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
  if (positiveCount > negativeCount) sentiment = 'positive'
  else if (negativeCount > positiveCount) sentiment = 'negative'
  
  return {
    sentiment,
    emotionalTone: sentiment === 'positive' ? ['enthusiastic', 'grateful'] : 
                   sentiment === 'negative' ? ['concerned', 'frustrated'] : 
                   ['reflective', 'casual'],
    topics: extractTopics(content),
    suggestions: generateSuggestions(sentiment),
    confidence: 0.75 + Math.random() * 0.2
  }
}

function extractTopics(content: string): string[] {
  const topicKeywords = {
    'work': ['work', 'job', 'career', 'office', 'meeting', 'project'],
    'family': ['family', 'parents', 'kids', 'children', 'mom', 'dad'],
    'hobbies': ['hobby', 'music', 'sports', 'reading', 'cooking', 'travel'],
    'health': ['health', 'exercise', 'gym', 'doctor', 'medical'],
    'relationships': ['relationship', 'dating', 'marriage', 'partner', 'love'],
    'goals': ['goal', 'dream', 'plan', 'future', 'ambition']
  }
  
  const words = content.toLowerCase().split(/\s+/)
  const topics: string[] = []
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => words.some(word => word.includes(keyword)))) {
      topics.push(topic)
    }
  })
  
  return topics.length > 0 ? topics : ['general']
}

function generateSuggestions(sentiment: string): string[] {
  const suggestions = {
    positive: [
      "Continue building on this positive momentum",
      "Share more experiences like this together",
      "Express gratitude for their support"
    ],
    negative: [
      "Check in on how they're feeling",
      "Offer support or help if appropriate",
      "Plan a positive activity together"
    ],
    neutral: [
      "Ask follow-up questions about their interests",
      "Share something personal about yourself",
      "Suggest meeting up soon"
    ]
  }
  
  return suggestions[sentiment as keyof typeof suggestions] || suggestions.neutral
}

function calculateXPGain(content: string, sentiment: string, level: number): number {
  const baseXP = 1
  const lengthBonus = Math.min(Math.floor(content.length / 100), 2)
  const sentimentBonus = sentiment === 'positive' ? 1 : 0
  const levelAdjustment = level > 5 ? 0 : 1 // Harder to gain XP at higher levels
  
  return Math.min(baseXP + lengthBonus + sentimentBonus + levelAdjustment, 3)
}

function calculateLevel(xp: number): number {
  const thresholds = [0, 5, 12, 22, 36, 54, 78, 108, 145, 190]
  let level = 1
  
  for (let i = 1; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) {
      level = i + 1
    } else {
      break
    }
  }
  
  return Math.min(level, 10)
}

async function generateMilestoneQuest(
  supabase: any, 
  relationshipId: string, 
  level: number, 
  name: string
) {
  const questTemplates = {
    3: `Share a meaningful memory with ${name}`,
    5: `Plan a special activity together with ${name}`,
    7: `Have a deep conversation about life goals with ${name}`,
    10: `Celebrate your amazing friendship with ${name}`
  }
  
  const description = questTemplates[level as keyof typeof questTemplates] || 
                     `Milestone quest for level ${level}`
  
  await supabase
    .from('quests')
    .insert({
      relationship_id: relationshipId,
      title: `Level ${level} Milestone`,
      description,
      type: 'milestone',
      difficulty: 'medium',
      xp_reward: level * 2,
      milestone_level: level
    })
}

async function generateInsights(supabase: any, relationshipId: string) {
  // This would typically call another edge function or AI service
  // For now, we'll just mark that insights need to be generated
  console.log(`Insights generation triggered for relationship ${relationshipId}`)
}