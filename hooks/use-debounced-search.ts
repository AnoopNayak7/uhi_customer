import { useState, useEffect, useRef, useCallback } from 'react';

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

interface UseDebounceSearchOptions {
  delay?: number;
  minQueryLength?: number;
  endpoint?: string;
}

export function useDebounceSearch(options: UseDebounceSearchOptions = {}) {
  const { delay = 500, minQueryLength = 2, endpoint = 'https://nominatim.openstreetmap.org/search' } = options;
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const searchLocations = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < minQueryLength) {
      setSuggestions([]);
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setIsSearching(true);
    
    try {
      const response = await fetch(
        `${endpoint}?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=8`,
        { signal: abortControllerRef.current.signal }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSuggestions(data);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error searching locations:', error);
        setSuggestions([]);
      }
    } finally {
      setIsSearching(false);
    }
  }, [endpoint, minQueryLength]);

  const debouncedSearch = useCallback((searchQuery: string) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      searchLocations(searchQuery);
    }, delay);
  }, [searchLocations, delay]);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    setShowSuggestions(true);
    
    if (value.trim().length >= minQueryLength) {
      debouncedSearch(value);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  }, [debouncedSearch, minQueryLength]);

  const handleSuggestionSelect = useCallback((suggestion: LocationSuggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    return suggestion;
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    query,
    suggestions,
    isSearching,
    showSuggestions,
    setShowSuggestions,
    handleInputChange,
    handleSuggestionSelect,
    clearSearch,
    setQuery
  };
}
