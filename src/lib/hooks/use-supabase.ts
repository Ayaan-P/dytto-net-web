import { useEffect, useState } from 'react'
import { supabase, auth } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    signUp: auth.signUp,
    signIn: auth.signInWithPassword, // Assuming password-based sign-in
    signOut: auth.signOut
  }
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data, error }) => {
        if (!error && data) {
          setProfile(data)
        }
        setLoading(false)
      })
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  const updateProfile = async (updates: any) => {
    if (!user) return { error: new Error('No user') }
    
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single()
    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }

  return {
    profile,
    loading,
    updateProfile
  }
}

export function useRelationships() {
  const [relationships, setRelationships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRelationships = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('relationships').select('*, relationship_categories(categories(*))')
    if (!error && data) {
      // Transform data to match frontend format
      const transformedData = data.map(rel => ({
        ...rel,
        categories: rel.relationship_categories?.map((rc: { categories: { id: string; name: string; color: string; icon: string; } }) => ({
          id: rc.categories.id,
          name: rc.categories.name,
          color: rc.categories.color,
          icon: rc.categories.icon
        })) || []
      }))
      setRelationships(transformedData)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRelationships()
  }, [])

  const createRelationship = async (relationshipData: any) => {
    const { data, error } = await supabase.from('relationships').insert(relationshipData).select().single()
    if (!error) {
      await fetchRelationships() // Refresh list
    }
    return { data, error }
  }

  const updateRelationship = async (id: string, updates: any) => {
    const { data, error } = await supabase.from('relationships').update(updates).eq('id', id).select().single()
    if (!error) {
      await fetchRelationships() // Refresh list
    }
    return { data, error }
  }

  const deleteRelationship = async (id: string) => {
    const { error } = await supabase.from('relationships').delete().eq('id', id)
    if (!error) {
      await fetchRelationships() // Refresh list
    }
    return { error }
  }

  return {
    relationships,
    loading,
    createRelationship,
    updateRelationship,
    deleteRelationship,
    refetch: fetchRelationships
  }
}

export function useInteractions(relationshipId: string) {
  const [interactions, setInteractions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInteractions = async () => {
    if (!relationshipId) return
    
    setLoading(true)
    const { data, error } = await supabase.from('interactions').select('*').eq('relationship_id', relationshipId)
    if (!error && data) {
      setInteractions(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchInteractions()
  }, [relationshipId])

  const createInteraction = async (interactionData: any) => {
    const { data, error } = await supabase.from('interactions').insert({
      relationship_id: relationshipId,
      ...interactionData
    }).select().single()
    if (!error) {
      await fetchInteractions() // Refresh list
    }
    return { data, error }
  }

  return {
    interactions,
    loading,
    createInteraction,
    refetch: fetchInteractions
  }
}

export function useQuests(relationshipId?: string) {
  const [quests, setQuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQuests = async () => {
    setLoading(true)
    let query = supabase.from('quests').select('*')
    if (relationshipId) {
      query = query.eq('relationship_id', relationshipId)
    }
    const { data, error } = await query
    if (!error && data) {
      setQuests(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQuests()
  }, [relationshipId])

  const createQuest = async (questData: any) => {
    const { data, error } = await supabase.from('quests').insert(questData).select().single()
    if (!error) {
      await fetchQuests() // Refresh list
    }
    return { data, error }
  }

  const updateQuest = async (id: string, updates: any) => {
    const { data, error } = await supabase.from('quests').update(updates).eq('id', id).select().single()
    if (!error) {
      await fetchQuests() // Refresh list
    }
    return { data, error }
  }

  const generateQuest = async (relationshipId: string, type?: string) => {
    // Assuming generateQuest is a Supabase function call
    const { data, error } = await supabase.rpc('generate_quest', { relationship_id: relationshipId, type })
    if (!error) {
      await fetchQuests() // Refresh list
    }
    return { data, error }
  }

  return {
    quests,
    loading,
    createQuest,
    updateQuest,
    generateQuest,
    refetch: fetchQuests
  }
}

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    setLoading(true)
    // This assumes getDashboardData is a Supabase function or view
    // If it's a complex query, it might need to be broken down
    const { data, error } = await supabase.rpc('get_dashboard_data') // Assuming it's an RPC
    if (!error && data) {
      setDashboardData(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    dashboardData,
    loading,
    refetch: fetchDashboardData
  }
}
