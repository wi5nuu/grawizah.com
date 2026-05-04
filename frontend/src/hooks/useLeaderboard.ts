import { useState, useEffect } from 'react';
import { LeaderboardScore } from '@/types/company';
import { LeaderboardService } from '@/services/LeaderboardService';

const leaderboardService = new LeaderboardService();

export const useLeaderboard = (category?: string) => {
  const [scores, setScores] = useState<LeaderboardScore[]>([]);
  const [myScore, setMyScore] = useState<LeaderboardScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [category]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leaderboardService.getLeaderboard(category);
      setScores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyScore = async (companyId: string) => {
    try {
      const data = await leaderboardService.getMyScore(companyId);
      setMyScore(data);
    } catch (err) {
      console.error('Failed to fetch my score:', err);
    }
  };

  const getTopPerformers = (count: number = 10) => {
    return scores.slice(0, count);
  };

  const getMyRank = (companyId: string): number | null => {
    const index = scores.findIndex(score => score.company_id === companyId);
    return index >= 0 ? index + 1 : null;
  };

  const compareWithCompetitors = (companyId: string) => {
    const myIndex = scores.findIndex(score => score.company_id === companyId);
    if (myIndex < 0) return null;

    const above = myIndex > 0 ? scores[myIndex - 1] : null;
    const below = myIndex < scores.length - 1 ? scores[myIndex + 1] : null;

    return {
      my_score: scores[myIndex],
      above,
      below,
      gap_to_above: above ? above.total_score - scores[myIndex].total_score : null,
      gap_to_below: below ? scores[myIndex].total_score - below.total_score : null
    };
  };

  return {
    scores,
    myScore,
    loading,
    error,
    fetchMyScore,
    getTopPerformers,
    getMyRank,
    compareWithCompetitors,
    refresh: fetchLeaderboard
  };
};
