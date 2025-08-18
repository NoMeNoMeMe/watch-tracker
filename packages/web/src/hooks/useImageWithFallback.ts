import { useState, useEffect, useCallback } from 'react';

interface UseImageWithFallbackOptions {
  fallbackSrc: string;
  onError?: (error: Event) => void;
}

interface UseImageWithFallbackReturn {
  src: string;
  loading: boolean;
  error: boolean;
  handleError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * Custom hook for handling image loading with fallback
 * Prevents infinite loading loops when fallback images also fail
 */
export const useImageWithFallback = (
  initialSrc: string | undefined | null,
  options: UseImageWithFallbackOptions
): UseImageWithFallbackReturn => {
  const { fallbackSrc, onError } = options;

  const [src, setSrc] = useState<string>(initialSrc || fallbackSrc);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);

  // Reset state when initialSrc changes
  useEffect(() => {
    if (initialSrc && initialSrc !== src) {
      setSrc(initialSrc);
      setLoading(true);
      setError(false);
      setHasTriedFallback(false);
    }
  }, [initialSrc, src]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false);

    // Only try fallback once to prevent infinite loops
    if (!hasTriedFallback && src !== fallbackSrc) {
      setHasTriedFallback(true);
      setSrc(fallbackSrc);
      setError(false);
    } else {
      setError(true);
      if (onError) {
        onError(e.nativeEvent);
      }
    }
  }, [hasTriedFallback, src, fallbackSrc, onError]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  // Pre-load the image to detect errors early
  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = handleLoad;
    img.onerror = (e) => {
      handleError({ nativeEvent: e } as React.SyntheticEvent<HTMLImageElement, Event>);
    };
    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, handleError]);

  return {
    src,
    loading,
    error,
    handleError,
  };
};

export default useImageWithFallback;
