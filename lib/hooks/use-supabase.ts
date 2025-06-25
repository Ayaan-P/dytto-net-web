import { useEffect, useState } from 'react'
import { supabase, auth, db } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    auth.getSession().then(({ session }) => {
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
    signIn: auth.signIn,
    signOut: auth.signOut
  }
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      db.getProfile(user.id).then(({ data, error }) => {
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
    
    const { data, error } = await db.updateProfile(user.id, updates)
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
    const { data, error } = await db.getRelationships()
    if (!error && data) {
      // Transform data to match frontend format
      const transformedData = data.map(rel => ({
        ...rel,
        categories: rel.relationship_categories?.map(rc => ({
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
    const { data, error } = await db.createRelationship(relationshipData)
    if (!error) {
      await fetchRelationships() // Refresh list
    }
    return { data, error }
  }

  const updateRelationship = async (id: string, updates: any) => {
    const { data, error } = await db.updateRelationship(id, updates)
    if (!error) {
      await fetchRelationships() // Refresh list
    }
    return { data, error }
  }

  const deleteRelationship = async (id: string) => {
    const { error } = await db.deleteRelationship(id)
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
    const { data, error } = await db.getInteractions(relationshipId)
    if (!error && data) {
      setInteractions(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchInteractions()
  }, [relationshipId])

  const createInteraction = async (interactionData: any) => {
    const { data, error } = await db.createInteraction({
      relationshipId,
      ...interactionData
    })
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
    const { data, error } = await db.getQuests(relationshipId)
    if (!error && data) {
      setQuests(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQuests()
  }, [relationshipId])

  const createQuest = async (questData: any) => {
    const { data, error } = await db.createQuest(questData)
    if (!error) {
      await fetchQuests() // Refresh list
    }
    return { data, error }
  }

  const updateQuest = async (id: string, updates: any) => {
    const { data, error } = await db.updateQuest(id, updates)
    if (!error) {
      await fetchQuests() // Refresh list
    }
    return { data, error }
  }

  const generateQuest = async (relationshipId: string, type?: string) => {
    const { data, error } = await db.generateQuest(relationshipId, type)
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
    const { data, error } = await db.getDashboardData()
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