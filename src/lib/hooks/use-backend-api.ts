import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '@/lib/api/client';
import { toast } from 'sonner';

// Hook for dashboard data
export function useDashboardData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await api.dashboard.getData();
      setData(dashboardData);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for relationship management
export function useBackendRelationships() {
  const [relationships, setRelationships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelationships = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.relationships.getAll();
      setRelationships(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch relationships';
      setError(errorMessage);
      console.error('Relationships error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRelationship = useCallback(async (relationshipData: any) => {
    try {
      const newRelationship = await api.relationships.create(relationshipData);
      await fetchRelationships(); // Refresh the list
      toast.success('Relationship created successfully!');
      return newRelationship;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to create relationship';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchRelationships]);

  const updateRelationship = useCallback(async (id: number, updates: any) => {
    try {
      await api.relationships.update(id, updates);
      await fetchRelationships(); // Refresh the list
      toast.success('Relationship updated successfully!');
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to update relationship';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchRelationships]);

  const deleteRelationship = useCallback(async (id: number) => {
    try {
      await api.relationships.delete(id);
      await fetchRelationships(); // Refresh the list
      toast.success('Relationship deleted successfully!');
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to delete relationship';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchRelationships]);

  useEffect(() => {
    fetchRelationships();
  }, [fetchRelationships]);

  return {
    relationships,
    loading,
    error,
    createRelationship,
    updateRelationship,
    deleteRelationship,
    refetch: fetchRelationships
  };
}

// Hook for interactions
export function useBackendInteractions(relationshipId?: number) {
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInteractions = useCallback(async () => {
    if (!relationshipId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.interactions.getAll();
      // Filter by relationship ID on the frontend for now
      const filtered = data.filter((interaction: any) => interaction.relationship_id === relationshipId);
      setInteractions(filtered);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch interactions';
      setError(errorMessage);
      console.error('Interactions error:', err);
    } finally {
      setLoading(false);
    }
  }, [relationshipId]);

  const createInteraction = useCallback(async (interactionData: any) => {
    try {
      const newInteraction = await api.interactions.create(interactionData);
      await fetchInteractions(); // Refresh the list
      toast.success('Interaction logged successfully!');
      return newInteraction;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to log interaction';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchInteractions]);

  useEffect(() => {
    if (relationshipId) {
      fetchInteractions();
    }
  }, [relationshipId, fetchInteractions]);

  return {
    interactions,
    loading,
    error,
    createInteraction,
    refetch: fetchInteractions
  };
}

// Hook for quests
export function useBackendQuests(relationshipId?: number) {
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (relationshipId) {
        data = await api.relationships.getQuests(relationshipId);
      } else {
        // For now, we'll need to implement a general quests endpoint
        data = [];
      }
      setQuests(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch quests';
      setError(errorMessage);
      console.error('Quests error:', err);
    } finally {
      setLoading(false);
    }
  }, [relationshipId]);

  const updateQuest = useCallback(async (questId: number, updates: any) => {
    try {
      await api.quests.update(questId, updates);
      await fetchQuests(); // Refresh the list
      toast.success('Quest updated successfully!');
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to update quest';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchQuests]);

  const generateQuest = useCallback(async (relationshipId: number) => {
    try {
      const newQuest = await api.relationships.generateQuest(relationshipId);
      await fetchQuests(); // Refresh the list
      toast.success('New quest generated!');
      return newQuest;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to generate quest';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchQuests]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return {
    quests,
    loading,
    error,
    updateQuest,
    generateQuest,
    refetch: fetchQuests
  };
}

// Hook for relationship insights
export function useRelationshipInsights(relationshipId: number) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    if (!relationshipId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.relationships.getInsights(relationshipId);
      setInsights(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch insights';
      setError(errorMessage);
      console.error('Insights error:', err);
    } finally {
      setLoading(false);
    }
  }, [relationshipId]);

  useEffect(() => {
    if (relationshipId) {
      fetchInsights();
    }
  }, [relationshipId, fetchInsights]);

  return {
    insights,
    loading,
    error,
    refetch: fetchInsights
  };
}

// Hook for relationship tree data
export function useRelationshipTree(relationshipId: number) {
  const [treeData, setTreeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTreeData = useCallback(async () => {
    if (!relationshipId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.relationships.getTree(relationshipId);
      setTreeData(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch tree data';
      setError(errorMessage);
      console.error('Tree data error:', err);
    } finally {
      setLoading(false);
    }
  }, [relationshipId]);

  useEffect(() => {
    if (relationshipId) {
      fetchTreeData();
    }
  }, [relationshipId, fetchTreeData]);

  return {
    treeData,
    loading,
    error,
    refetch: fetchTreeData
  };
}

// Hook for global tree data
export function useGlobalTree() {
  const [treeData, setTreeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTreeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.dashboard.getGlobalTree();
      setTreeData(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch global tree data';
      setError(errorMessage);
      console.error('Global tree error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTreeData();
  }, [fetchTreeData]);

  return {
    treeData,
    loading,
    error,
    refetch: fetchTreeData
  };
}