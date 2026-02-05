import { memo } from 'react';
import { List, MapIcon } from 'lucide-react';
import type { ViewMode } from '@/types';


interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewToggle = memo(function ViewToggle({
  activeView,
  onViewChange,
}: ViewToggleProps) {
  return (
    <div 
      className="view-toggle" 
      role="tablist" 
      aria-label="View mode"
    >
      <button
        role="tab"
        aria-selected={activeView === 'list'}
        aria-controls="service-list-panel"
        className={`view-toggle-button ${
          activeView === 'list' 
            ? 'view-toggle-button-active' 
            : 'view-toggle-button-inactive'
        }`}
        onClick={() => onViewChange('list')}
      >
        <List className="w-4 h-4 inline mr-1.5" aria-hidden="true" />
        List
      </button>
      <button
        role="tab"
        aria-selected={activeView === 'map'}
        aria-controls="service-map-panel"
        className={`view-toggle-button ${
          activeView === 'map' 
            ? 'view-toggle-button-active' 
            : 'view-toggle-button-inactive'
        }`}
        onClick={() => onViewChange('map')}
      >
        <MapIcon className="w-4 h-4 inline mr-1.5" aria-hidden="true" />
        Map
      </button>
    </div>
  );
});
