import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
}

// Database helpers
export const db = {
  // Profiles
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    return { data, error }
  },

  // Relationships
  getRelationships: async () => {
    const { data, error } = await supabase
      .from('relationships')
      .select(`
        *,
        relationship_categories(
          categories(id, name, color, icon)
        )
      `)
      .order('updated_at', { ascending: false })
    return { data, error }
  },

  getRelationship: async (id: string) => {
    const { data, error } = await supabase
      .from('relationships')
      .select(`
        *,
        relationship_categories(
          categories(id, name, color, icon)
        )
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  createRelationship: async (relationship: any) => {
    const { data, error } = await supabase
      .from('relationships')
      .insert(relationship)
      .select()
      .single()
    return { data, error }
  },

  updateRelationship: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('relationships')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  deleteRelationship: async (id: string) => {
    const { error } = await supabase
      .from('relationships')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Relationship Categories
  setRelationshipCategories: async (relationshipId: string, categoryIds: string[]) => {
    // First, delete existing categories
    await supabase
      .from('relationship_categories')
      .delete()
      .eq('relationship_id', relationshipId)

    // Then insert new categories
    if (categoryIds.length > 0) {
      const { error } = await supabase
        .from('relationship_categories')
        .insert(
          categoryIds.map(categoryId => ({
            relationship_id: relationshipId,
            category_id: categoryId
          }))
        )
      return { error }
    }
    return { error: null }
  },

  // Interactions
  getInteractions: async (relationshipId: string) => {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('relationship_id', relationshipId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  createInteraction: async (interaction: any) => {
    const { data, error } = await supabase.functions.invoke('analyze-interaction', {
      body: interaction
    })
    return { data, error }
  },

  // Quests
  getQuests: async (relationshipId?: string) => {
    let query = supabase
      .from('quests')
      .select('*')
      .order('created_at', { ascending: false })

    if (relationshipId) {
      query = query.eq('relationship_id', relationshipId)
    }

    const { data, error } = await query
    return { data, error }
  },

  createQuest: async (quest: any) => {
    const { data, error } = await supabase
      .from('quests')
      .insert(quest)
      .select()
      .single()
    return { data, error }
  },

  updateQuest: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('quests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  generateQuest: async (relationshipId: string, type?: string) => {
    const { data, error } = await supabase.functions.invoke('generate-quest', {
      body: { relationshipId, type }
    })
    return { data, error }
  },

  // Insights
  getInsights: async (relationshipId: string) => {
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('relationship_id', relationshipId)
      .single()
    return { data, error }
  },

  generateInsights: async (relationshipId: string) => {
    const { data, error } = await supabase.functions.invoke('generate-insights', {
      body: { relationshipId }
    })
    return { data, error }
  },

  // Achievements
  getAchievements: async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('unlocked_at', { ascending: false })
    return { data, error }
  },

  // Dashboard data
  getDashboardData: async () => {
    const { data: relationships, error } = await supabase
      .from('relationships')
      .select(`
        id,
        name,
        photo_url,
        level,
        xp,
        last_interaction,
        relationship_categories(
          categories(name, color)
        )
      `)
      .order('updated_at', { ascending: false })

    if (error) return { data: null, error }

    // Calculate dashboard stats
    const totalRelationships = relationships.length
    const totalXP = relationships.reduce((sum, rel) => sum + rel.xp, 0)
    const averageLevel = totalRelationships > 0 
      ? relationships.reduce((sum, rel) => sum + rel.level, 0) / totalRelationships 
      : 1

    // Calculate overdue connections (no interaction in 14+ days)
    const now = new Date()
    const overdueConnections = relationships.filter(rel => {
      if (!rel.last_interaction) return true
      const daysSince = Math.floor((now.getTime() - new Date(rel.last_interaction).getTime()) / (1000 * 60 * 60 * 24))
      return daysSince > 14
    }).length

    // Active relationships (interacted with in last 7 days)
    const activeRelationships = relationships.filter(rel => {
      if (!rel.last_interaction) return false
      const daysSince = Math.floor((now.getTime() - new Date(rel.last_interaction).getTime()) / (1000 * 60 * 60 * 24))
      return daysSince <= 7
    }).length

    return {
      data: {
        relationships,
        stats: {
          totalRelationships,
          activeRelationships,
          overdueConnections,
          weeklyGrowth: 0, // Would need historical data
          totalXP,
          averageLevel: Math.round(averageLevel * 10) / 10
        }
      },
      error: null
    }
  }
}