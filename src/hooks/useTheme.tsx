
import { useContext } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  
  return {
    theme: resolvedTheme || theme || 'system',
    setTheme,
  };
}

export default useTheme;
