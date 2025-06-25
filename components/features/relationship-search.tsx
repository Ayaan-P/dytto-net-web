"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { PremiumButton } from '@/components/ui/premium-button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { useDebounce } from '@/lib/hooks/use-debounce';
import type { Relationship } from '@/lib/types';

interface RelationshipSearchProps {
  onResultsChange: (results: Relationship[]) => void;
}

export function RelationshipSearch({ onResultsChange }: RelationshipSearchProps) {
  const { relationships, categories } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'xp' | 'lastInteraction'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredAndSortedRelationships = useMemo(() => {
    let filtered = relationships;

    // Apply search filter
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(rel =>
        rel.name.toLowerCase().includes(query) ||
        rel.bio?.toLowerCase().includes(query) ||
        rel.categories.some(cat => cat.name.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(rel =>
        rel.categories.some(cat => selectedCategories.includes(cat.id))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'level':
          aValue = a.level;
          bValue = b.level;
          break;
        case 'xp':
          aValue = a.xp;
          bValue = b.xp;
          break;
        case 'lastInteraction':
          aValue = a.lastInteraction?.getTime() || 0;
          bValue = b.lastInteraction?.getTime() || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [relationships, debouncedSearch, selectedCategories, sortBy, sortOrder]);

  // Update results when filters change
  React.useEffect(() => {
    onResultsChange(filteredAndSortedRelationships);
  }, [filteredAndSortedRelationships, onResultsChange]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSortBy('name');
    setSortOrder('asc');
  };

  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    relationships.forEach(rel => {
      suggestions.add(rel.name);
      rel.categories.forEach(cat => suggestions.add(cat.name));
    });
    return Array.from(suggestions);
  }, [relationships]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search relationships..."
            suggestions={searchSuggestions}
          />
        </div>
        
        <PremiumButton
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-primary/10' : ''}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </PremiumButton>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border border-border rounded-lg p-4 space-y-4"
        >
          {/* Category Filters */}
          <div>
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category.id}
                  variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                  style={{
                    backgroundColor: selectedCategories.includes(category.id)
                      ? category.color
                      : undefined,
                    borderColor: category.color,
                  }}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h4 className="text-sm font-medium mb-2">Sort By</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'name', label: 'Name' },
                { key: 'level', label: 'Level' },
                { key: 'xp', label: 'XP' },
                { key: 'lastInteraction', label: 'Last Contact' },
              ].map(option => (
                <PremiumButton
                  key={option.key}
                  variant={sortBy === option.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSort(option.key as any)}
                  className="flex items-center gap-1"
                >
                  {option.label}
                  {sortBy === option.key && (
                    sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                  )}
                </PremiumButton>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm text-muted-foreground">
              {filteredAndSortedRelationships.length} of {relationships.length} relationships
            </span>
            <PremiumButton variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </PremiumButton>
          </div>
        </motion.div>
      )}
    </div>
  );
}