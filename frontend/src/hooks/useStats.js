import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { useToast } from './useToast';
import { setStatsLoading, setStats, setStatsError } from 'src/store/statsSlice';
import { fetchStats } from 'src/api/statsApi';

export const useStats = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { stats, loading, error } = useSelector((state) => state.stats);

  const loadStats = useCallback(async () => {
    try {
      dispatch(setStatsLoading());
      const data = await fetchStats();
      dispatch(setStats(data));
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to load dashboard metrics';
      dispatch(setStatsError(errMsg));
      toast.error(errMsg);
    }
  }, [dispatch, toast]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    reloadStats: loadStats,
  };
};

export default useStats;
