import { useEffect, useState } from 'react';
import notify from '../helpers/notify';
import type { BookResult, OmdbResult } from '../types';

interface DetailedOmdbResult extends OmdbResult {
  Plot?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Runtime?: string;
  imdbRating?: string;
  totalSeasons?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Writer?: string;
  Released?: string;
}

type DetailedItem = DetailedOmdbResult | BookResult;


const useFetchDetailedInfo = (item: OmdbResult | BookResult) => {
  const [detailedItem, setDetailedItem] = useState<DetailedItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const baseURL = import.meta.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const fetchData = async () => {
      if ('imdbID' in item) {
        setLoading(true);
        try {
          const response = await fetch(`${baseURL}/external/search/omdb-details?id=${item.imdbID}`);
          if (response.ok) {
            const detailed = await response.json();
            if (detailed.Response === 'False') {
              throw new Error(detailed.Error || 'Failed to fetch detailed information');
            }
            setDetailedItem(detailed);
          } else {
            throw new Error(`Server error: ${response.status}`);
          }
        } catch (err) {
          notify({ type: 'error', message: 'Failed to fetch detailed information', logToConsole: true, error: err as Error });
          setDetailedItem(item);
        } finally {
          setLoading(false);
        }
      } else {
        setDetailedItem(item);
      }
    };

    fetchData();
  }, [item]);

  return { detailedItem, loading };
};

export default useFetchDetailedInfo;
