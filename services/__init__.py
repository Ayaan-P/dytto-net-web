# Services package for Dytto backend
# This file makes the services directory a Python package

from .ai_processing import (
    process_interaction_log_ai,
    analyze_sentiment,
    calculate_xp,
    detect_patterns,
    suggest_evolution,
    suggest_interaction
)

from .leveling_system import (
    calculate_level,
    get_xp_for_next_level,
    get_xp_progress_in_level
)

from .quest_generation import (
    generate_quest,
    generate_milestone_quest,
    generate_recurring_quest
)

from .ai_insights import (
    generate_interaction_trends,
    generate_emotional_summary,
    generate_relationship_forecasts,
    generate_smart_suggestions,
    generate_complete_insights,
    get_stored_insights,
    generate_and_store_insights
)

from .tree_system import (
    get_relationship_tree_data,
    suggest_tree_evolution,
    get_tree_completion_status
)

from .global_tree_service import (
    get_global_tree_data
)

__all__ = [
    # AI Processing
    'process_interaction_log_ai',
    'analyze_sentiment',
    'calculate_xp',
    'detect_patterns',
    'suggest_evolution',
    'suggest_interaction',
    
    # Leveling System
    'calculate_level',
    'get_xp_for_next_level',
    'get_xp_progress_in_level',
    
    # Quest Generation
    'generate_quest',
    'generate_milestone_quest',
    'generate_recurring_quest',
    
    # AI Insights
    'generate_interaction_trends',
    'generate_emotional_summary',
    'generate_relationship_forecasts',
    'generate_smart_suggestions',
    'generate_complete_insights',
    'get_stored_insights',
    'generate_and_store_insights',
    
    # Tree System
    'get_relationship_tree_data',
    'suggest_tree_evolution',
    'get_tree_completion_status',
    
    # Global Tree Service
    'get_global_tree_data'
]
