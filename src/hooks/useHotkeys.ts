
import { useEffect } from 'react';

type KeyHandler = (e: KeyboardEvent) => void;

interface HotkeyConfig {
  key: string;
  modifier?: 'ctrl' | 'meta' | 'shift' | 'alt' | 'none';
  handler: KeyHandler;
}

export function useHotkeys(configs: HotkeyConfig | HotkeyConfig[]): void {
  useEffect(() => {
    const configArray = Array.isArray(configs) ? configs : [configs];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      configArray.forEach(config => {
        const isModifierMatched = config.modifier === 'none' 
          ? (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey)
          : config.modifier === 'ctrl' ? e.ctrlKey
          : config.modifier === 'meta' ? e.metaKey
          : config.modifier === 'shift' ? e.shiftKey
          : config.modifier === 'alt' ? e.altKey
          : (e.ctrlKey || e.metaKey); // Default to either ctrl or meta if no modifier specified
        
        if (isModifierMatched && e.key.toLowerCase() === config.key.toLowerCase()) {
          config.handler(e);
        }
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [configs]);
}
