import { useState, useEffect } from 'react';
import { Buyer, LeadScoringResult } from '@/types/buyer';
import { BuyerService } from '@/services/BuyerService';

const buyerService = new BuyerService();

interface BuyerRadarFilters {
  country?: string;
  min_score?: number;
  category?: string;
}

export const useBuyerRadar = (filters?: BuyerRadarFilters) => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuyers();
  }, [filters]);

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buyerService.getBuyerRadar(filters);
      setBuyers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch buyers');
    } finally {
      setLoading(false);
    }
  };

  const getLeadScore = async (buyerId: string, productCategory: string): Promise<LeadScoringResult | null> => {
    try {
      const result = await buyerService.getLeadScore(buyerId, productCategory);
      return result;
    } catch (err) {
      console.error('Failed to get lead score:', err);
      return null;
    }
  };

  const searchBuyers = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await buyerService.searchBuyers(query);
      setBuyers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const filterByScore = (minScore: number) => {
    setBuyers(prev => prev.filter(buyer => buyer.buy_score >= minScore));
  };

  const sortByScore = (ascending: boolean = false) => {
    setBuyers(prev => [...prev].sort((a, b) => 
      ascending ? a.buy_score - b.buy_score : b.buy_score - a.buy_score
    ));
  };

  return {
    buyers,
    loading,
    error,
    getLeadScore,
    searchBuyers,
    filterByScore,
    sortByScore,
    refresh: fetchBuyers
  };
};
