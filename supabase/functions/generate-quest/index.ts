import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QuestRequest {
  relationshipId: string
  type?: 'daily' | 'weekly' | 'milestone' | 'custom'
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

    const { relationshipId, type = 'custom' }: QuestRequest = await req.json()

    // Get user from JWT
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get relationship data
    const { data: relationship, error: relError } = await supabaseClient
      .from('relationships')
      .select(`
        *,
        relationship_categories(
          categories(name)
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

    // Get recent interactions for context
    const { data: interactions } = await supabaseClient
      .from('interactions')
      .select('content, ai_analysis')
      .eq('relationship_id', relationshipId)
      .order('created_at', { ascending: false })
      .limit(5)

    // Generate quest based on type and context
    const quest = generateQuest(relationship, interactions || [], type)

    // Create quest in database
    const { data: newQuest, error: questError } = await supabaseClient
      .from('quests')
      .insert({
        relationship_id: relationshipId,
        title: quest.title,
        description: quest.description,
        type: quest.type,
        difficulty: quest.difficulty,
        xp_reward: quest.xpReward,
        deadline: quest.deadline
      })
      .select()
      .single()

    if (questError) {
      throw new Error(`Failed to create quest: ${questError.message}`)
    }

    return new Response(JSON.stringify(newQuest), {
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

function generateQuest(relationship: any, interactions: any[], type: string) {
  const categories = relationship.relationship_categories?.map((rc: any) => rc.categories.name) || []
  const level = relationship.level
  const name = relationship.name

  // Quest templates based on type and level
  const questTemplates = {
    daily: [
      {
        title: "Daily Check-in",
        description: `Send a quick message to ${name} asking how their day is going`,
        difficulty: "easy",
        xpReward: 5
      },
      {
        title: "Share Something",
        description: `Share an interesting article, meme, or thought with ${name}`,
        difficulty: "easy",
        xpReward: 5
      },
      {
        title: "Express Gratitude",
        description: `Tell ${name} something you appreciate about them`,
        difficulty: "medium",
        xpReward: 8
      }
    ],
    weekly: [
      {
        title: "Deep Conversation",
        description: `Have a meaningful conversation with ${name} about their goals or dreams`,
        difficulty: "medium",
        xpReward: 12
      },
      {
        title: "Plan Together",
        description: `Make plans for a future activity or hangout with ${name}`,
        difficulty: "medium",
        xpReward: 10
      },
      {
        title: "Memory Lane",
        description: `Share a favorite memory you have with ${name}`,
        difficulty: "easy",
        xpReward: 8
      }
    ],
    milestone: getMilestoneQuest(level, name, categories),
    custom: getCustomQuest(level, name, categories, interactions)
  }

  const template = questTemplates[type as keyof typeof questTemplates]
  
  if (Array.isArray(template)) {
    // Random selection for daily/weekly
    const selected = template[Math.floor(Math.random() * template.length)]
    return {
      ...selected,
      type,
      deadline: type === 'daily' ? getDeadline(1) : getDeadline(7)
    }
  }
  
  return {
    ...template,
    type,
    deadline: type === 'milestone' ? getDeadline(30) : getDeadline(14)
  }
}

function getMilestoneQuest(level: number, name: string, categories: string[]) {
  const milestoneQuests = {
    3: {
      title: "Foundation Builder",
      description: `Share a personal story or experience with ${name} to strengthen your foundation`,
      difficulty: "medium",
      xpReward: 15
    },
    5: {
      title: "Trust Deepener",
      description: `Ask ${name} for advice on something important to you`,
      difficulty: "medium",
      xpReward: 20
    },
    7: {
      title: "Bond Strengthener",
      description: `Plan and execute a special activity or experience with ${name}`,
      difficulty: "hard",
      xpReward: 25
    },
    10: {
      title: "Soul Connection",
      description: `Have a heart-to-heart conversation about life, values, and what your friendship means`,
      difficulty: "hard",
      xpReward: 30
    }
  }

  return milestoneQuests[level as keyof typeof milestoneQuests] || {
    title: "Milestone Achievement",
    description: `Celebrate reaching level ${level} with ${name} by doing something meaningful together`,
    difficulty: "medium",
    xpReward: level * 2
  }
}

function getCustomQuest(level: number, name: string, categories: string[], interactions: any[]) {
  // Analyze recent interactions for context
  const recentTopics = interactions
    .flatMap(i => i.ai_analysis?.topics || [])
    .slice(0, 10)

  const hasWorkTopic = recentTopics.includes('work')
  const hasHobbyTopic = recentTopics.includes('hobbies')
  const hasFamilyTopic = recentTopics.includes('family')

  // Generate contextual quest
  if (categories.includes('Business') && !hasWorkTopic) {
    return {
      title: "Professional Connection",
      description: `Ask ${name} about their current work projects or career goals`,
      difficulty: "easy",
      xpReward: 8
    }
  }

  if (categories.includes('Friend') && level >= 5 && !hasHobbyTopic) {
    return {
      title: "Interest Explorer",
      description: `Discover a new hobby or interest that ${name} is passionate about`,
      difficulty: "medium",
      xpReward: 12
    }
  }

  if (level < 3) {
    return {
      title: "Getting to Know You",
      description: `Learn three new things about ${name}'s background or interests`,
      difficulty: "easy",
      xpReward: 10
    }
  }

  // Default quest
  return {
    title: "Connection Builder",
    description: `Have a meaningful conversation with ${name} about something they care about`,
    difficulty: "medium",
    xpReward: 10
  }
}

function getDeadline(days: number): string {
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + days)
  return deadline.toISOString()
}