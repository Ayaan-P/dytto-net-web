// API client for communicating with the Flask backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Relationship API
export const relationshipApi = {
  // Create a new relationship
  create: (data: {
    name: string;
    relationship_type: string;
    reminder_interval: string;
    initial_category_name: string;
    photo_url?: string;
    tags?: string[];
    bio?: string;
    birthday?: string;
    phone?: string;
    email?: string;
    location?: string;
    preferred_communication?: string;
    meeting_frequency?: string;
    notes?: string;
  }) => apiRequest('/relationships', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get all relationships
  getAll: () => apiRequest('/relationships'),

  // Get specific relationship
  get: (id: number) => apiRequest(`/relationships/${id}`),

  // Update relationship
  update: (id: number, data: any) => apiRequest(`/relationships/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete relationship
  delete: (id: number) => apiRequest(`/relationships/${id}`, {
    method: 'DELETE',
  }),

  // Get relationship overview
  getOverview: (id: number) => apiRequest(`/relationships/${id}/overview`),

  // Get relationship interactions thread
  getInteractionsThread: (id: number) => apiRequest(`/relationships/${id}/interactions_thread`),

  // Get relationship quests
  getQuests: (id: number) => apiRequest(`/relationships/${id}/quests`),

  // Generate quest for relationship
  generateQuest: (id: number) => apiRequest(`/relationships/${id}/generate_quest`, {
    method: 'POST',
  }),

  // Get relationship tree data
  getTree: (id: number) => apiRequest(`/relationships/${id}/tree`),

  // Get tree evolution suggestions
  getTreeEvolution: (id: number) => apiRequest(`/relationships/${id}/tree/evolution`),

  // Get tree completion status
  getTreeCompletion: (id: number) => apiRequest(`/relationships/${id}/tree/completion`),

  // Get relationship insights
  getInsights: (id: number) => apiRequest(`/relationships/${id}/insights`),

  // Get interaction trends
  getInteractionTrends: (id: number) => apiRequest(`/relationships/${id}/insights/interaction_trends`),

  // Get emotional summary
  getEmotionalSummary: (id: number) => apiRequest(`/relationships/${id}/insights/emotional_summary`),

  // Get relationship forecasts
  getForecasts: (id: number) => apiRequest(`/relationships/${id}/insights/relationship_forecasts`),
};

// Interaction API
export const interactionApi = {
  // Create a new interaction
  create: (data: {
    relationship_id: number;
    interaction_log: string;
    tone_tag?: string;
  }) => apiRequest('/interactions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get all interactions
  getAll: () => apiRequest('/interactions'),

  // Get specific interaction
  get: (id: number) => apiRequest(`/interactions/${id}`),

  // Update interaction
  update: (id: number, data: any) => apiRequest(`/interactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete interaction
  delete: (id: number) => apiRequest(`/interactions/${id}`, {
    method: 'DELETE',
  }),

  // Mark interaction as milestone
  markAsMilestone: (id: number) => apiRequest(`/interactions/${id}/milestone`, {
    method: 'PUT',
  }),
};

// Quest API
export const questApi = {
  // Create a new quest
  create: (data: {
    relationship_id: number;
    quest_description: string;
    quest_status: string;
    milestone_level?: number;
  }) => apiRequest('/quests', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get specific quest
  get: (id: number) => apiRequest(`/quests/${id}`),

  // Update quest
  update: (id: number, data: any) => apiRequest(`/quests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete quest
  delete: (id: number) => apiRequest(`/quests/${id}`, {
    method: 'DELETE',
  }),
};

// Dashboard API
export const dashboardApi = {
  // Get dashboard data
  getData: () => apiRequest('/dashboard_data'),

  // Get global tree data
  getGlobalTree: () => apiRequest('/global_tree_data'),
};

// Export the main API object
export const api = {
  relationships: relationshipApi,
  interactions: interactionApi,
  quests: questApi,
  dashboard: dashboardApi,
};

export { ApiError };