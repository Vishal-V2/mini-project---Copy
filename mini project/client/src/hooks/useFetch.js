import { useState, useEffect, useCallback } from 'react';

const cache = new Map();

const useFetch = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            
            // Check cache first
            if (cache.has(url)) {
                const cachedData = cache.get(url);
                if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) { // 5 minutes cache
                    setData(cachedData.data);
                    setLoading(false);
                    return;
                }
            }

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            
            // Update cache
            cache.set(url, {
                data: result,
                timestamp: Date.now()
            });
            
            setData(result);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [url, options]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = () => {
        cache.delete(url);
        fetchData();
    };

    return { data, loading, error, refetch };
};

export default useFetch; 