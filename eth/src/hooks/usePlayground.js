import { useContext } from 'react';
import { PlaygroundContext } from '../contexts/PlaygroundContextDefinition';

export function usePlayground() {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error('usePlayground must be used within a PlaygroundProvider');
  }
  return context;
}
