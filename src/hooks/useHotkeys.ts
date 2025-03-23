
import { useEffect, useCallback, useRef } from 'react';

type KeyHandler = (e: KeyboardEvent) => void;

interface HotkeyConfig {
  key: string;
  modifier?: 'ctrl' | 'meta' | 'shift' | 'alt' | 'none';
  handler: KeyHandler;
  preventDefault?: boolean;
}

export function useHotkeys(configs: HotkeyConfig | HotkeyConfig[]): void {
  const configsRef = useRef<HotkeyConfig[]>(
    Array.isArray(configs) ? configs : [configs]
  );
  
  // Update ref when configs change
  useEffect(() => {
    configsRef.current = Array.isArray(configs) ? configs : [configs];
  }, [configs]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    configsRef.current.forEach(config => {
      // Check if input or textarea is focused
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        // Only proceed if it's a non-typing hotkey (like Esc)
        if (e.key !== 'Escape' && config.key !== 'Escape') {
          return;
        }
      }
      
      const isModifierMatched = config.modifier === 'none' 
        ? (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey)
        : config.modifier === 'ctrl' ? e.ctrlKey
        : config.modifier === 'meta' ? e.metaKey
        : config.modifier === 'shift' ? e.shiftKey
        : config.modifier === 'alt' ? e.altKey
        : (e.ctrlKey || e.metaKey); // Default to either ctrl or meta if no modifier specified
      
      if (isModifierMatched && e.key.toLowerCase() === config.key.toLowerCase()) {
        if (config.preventDefault !== false) {
          e.preventDefault();
        }
        config.handler(e);
      }
    });
  }, []);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
