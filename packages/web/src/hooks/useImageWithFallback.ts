import { useCallback } from 'react';

interface UseImageWithFallbackOptions {
  fallbackSrc: string;
}

export const useImageWithFallback = (
  options: UseImageWithFallbackOptions
) => {
  const { fallbackSrc } = options;

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (!target.src.includes(fallbackSrc)) {
      target.src = fallbackSrc;
    }
  }, [fallbackSrc]);

  return {
    handleError,
  };
};

export default useImageWithFallback;
