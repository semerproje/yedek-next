"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NewsFiltersContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  clearFilters: () => void;
}

const NewsFiltersContext = createContext<NewsFiltersContextType | undefined>(undefined);

export const useNewsFilters = () => {
  const context = useContext(NewsFiltersContext);
  if (!context) {
    throw new Error('useNewsFilters must be used within a NewsFiltersProvider');
  }
  return context;
};

interface NewsFiltersProviderProps {
  children: ReactNode;
}

export const NewsFiltersProvider: React.FC<NewsFiltersProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTime('all');
    setSelectedSort('newest');
  };

  return (
    <NewsFiltersContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedTime,
        setSelectedTime,
        selectedSort,
        setSelectedSort,
        clearFilters
      }}
    >
      {children}
    </NewsFiltersContext.Provider>
  );
};
