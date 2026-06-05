import { useState, useCallback, useEffect } from 'react';
import { fetchHistory, deleteHistoryItem as apiDeleteHistoryItem } from 'src/api/historyApi';
import { useToast } from './useToast';

export const useHistory = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'AI_GENERATED' | 'REAL'

  const loadHistory = useCallback(async (targetPage = page, targetFilter = filter) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchHistory({
        page: targetPage,
        filter: targetFilter,
      });

      setItems(data.items);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to load scan history';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, [page, filter, toast]);

  const deleteItem = useCallback(async (id) => {
    try {
      await apiDeleteHistoryItem(id);
      toast.success('Record deleted successfully');
      
      // Reload history (handling page bounds if we deleted the last item on the page)
      const isLastItemOnPage = items.length === 1 && page > 1;
      const nextPage = isLastItemOnPage ? page - 1 : page;
      await loadHistory(nextPage, filter);
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to delete record';
      toast.error(errMsg);
    }
  }, [items, page, filter, loadHistory, toast]);

  const changePage = useCallback((newPage) => {
    if (newPage < 1 || newPage > pages) return;
    setPage(newPage);
    loadHistory(newPage, filter);
  }, [pages, filter, loadHistory]);

  const changeFilter = useCallback((newFilter) => {
    setFilter(newFilter);
    setPage(1);
    loadHistory(1, newFilter);
  }, [loadHistory]);

  // Initial load
  useEffect(() => {
    loadHistory(1, filter);
  }, []);

  return {
    items,
    total,
    page,
    pages,
    loading,
    error,
    filter,
    loadHistory,
    deleteItem,
    changePage,
    changeFilter,
  };
};

export default useHistory;
