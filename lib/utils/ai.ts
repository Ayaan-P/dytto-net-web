import type { Interaction, AIAnalysis } from '../types';

// Mock AI analysis for demo purposes
// In production, this would call OpenAI/Anthropic APIs
export async function analyzeInteraction(content: string): Promise<AIAnalysis> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple sentiment analysis based on keywords
  const positiveWords = ['happy', 'great', 'amazing', 'wonderful', 'love', 'excited', 'fantastic', 'awesome', 'brilliant', 'perfect'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'disappointed', 'terrible', 'awful', 'hate', 'annoyed', 'upset', 'worried'];
  
  const words = content.toLowerCase().split(/\s+/);
  const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length;
  const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length;
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';
  
  // Extract topics (simplified)
  const topics = extractTopics(content);
  
  // Generate emotional tone
  const emotionalTone = generateEmotionalTone(content, sentiment);
  
  // Generate suggestions
  const suggestions = generateSuggestions(sentiment, topics);
  
  return {
    sentiment,
    emotionalTone,
    topics,
    suggestions,
    confidence: 0.75 + Math.random() * 0.2, // Random confidence between 0.75-0.95
  };
}

function extractTopics(content: string): string[] {
  const topicKeywords = {
    'work': ['work', 'job', 'career', 'office', 'meeting', 'project', 'business'],
    'family': ['family', 'parents', 'kids', 'children', 'mom', 'dad', 'sister', 'brother'],
    'hobbies': ['hobby', 'music', 'sports', 'reading', 'cooking', 'travel', 'art', 'gaming'],
    'health': ['health', 'exercise', 'gym', 'doctor', 'medical', 'fitness', 'wellness'],
    'relationships': ['relationship', 'dating', 'marriage', 'partner', 'love', 'friendship'],
    'goals': ['goal', 'dream', 'plan', 'future', 'ambition', 'aspiration', 'target'],
  };
  
  const words = content.toLowerCase().split(/\s+/);
  const topics: string[] = [];
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => words.some(word => word.includes(keyword)))) {
      topics.push(topic);
    }
  });
  
  return topics.length > 0 ? topics : ['general'];
}

function generateEmotionalTone(content: string, sentiment: string): string[] {
  const toneMap = {
    positive: ['enthusiastic', 'optimistic', 'grateful', 'excited', 'content'],
    negative: ['concerned', 'frustrated', 'disappointed', 'anxious', 'stressed'],
    neutral: ['reflective', 'casual', 'informative', 'thoughtful', 'balanced'],
  };
  
  const baseTones = toneMap[sentiment as keyof typeof toneMap];
  return baseTones.slice(0, 2 + Math.floor(Math.random() * 2)); // Return 2-3 tones
}

function generateSuggestions(sentiment: string, topics: string[]): string[] {
  const suggestionTemplates = {
    positive: [
      "Continue building on this positive momentum",
      "Share more experiences like this together",
      "Express gratitude for their support",
    ],
    negative: [
      "Check in on how they're feeling",
      "Offer support or help if appropriate",
      "Plan a positive activity together",
    ],
    neutral: [
      "Ask follow-up questions about their interests",
      "Share something personal about yourself",
      "Suggest meeting up soon",
    ],
  };
  
  const topicSuggestions = {
    work: ["Ask about their career goals", "Discuss work-life balance"],
    family: ["Ask about family updates", "Share family stories"],
    hobbies: ["Explore shared interests", "Plan an activity together"],
    health: ["Check on their wellness", "Suggest healthy activities"],
    relationships: ["Offer relationship advice", "Share relationship experiences"],
    goals: ["Discuss future plans", "Offer support for their goals"],
  };
  
  const suggestions = [...(suggestionTemplates[sentiment as keyof typeof suggestionTemplates] || [])];
  
  topics.forEach(topic => {
    const topicSugs = topicSuggestions[topic as keyof typeof topicSuggestions];
    if (topicSugs) {
      suggestions.push(...topicSugs.slice(0, 1));
    }
  });
  
  return suggestions.slice(0, 3); // Return max 3 suggestions
}

export function calculateXPGain(content: string, sentiment: string): number {
  const baseXP = 1;
  const lengthBonus = Math.min(Math.floor(content.length / 100), 2); // +1-2 XP for longer entries
  const sentimentBonus = sentiment === 'positive' ? 1 : 0; // +1 XP for positive interactions
  
  return baseXP + lengthBonus + sentimentBonus;
}

export function generateConversationStarters(relationship: any): string[] {
  const starters = [
    "How has your week been going?",
    "What's the most interesting thing that happened to you recently?",
    "I saw something that reminded me of you...",
    "What are you most excited about right now?",
    "How are you feeling about [recent topic you discussed]?",
    "I've been thinking about what you said about...",
    "What's bringing you joy these days?",
    "Any fun plans coming up?",
    "How's your [work/family/hobby] going?",
    "I'd love to hear your thoughts on...",
  ];
  
  return starters.sort(() => Math.random() - 0.5).slice(0, 3);
}