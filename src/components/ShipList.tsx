import React from 'react';
import classNames from 'classnames';
import { Ship } from '../types';

interface ShipListProps {
  ships: Ship[];
  selectedShipId: string | null;
  onSelect: (shipId: string) => void;
}

const ShipList: React.FC<ShipListProps> = ({ ships, selectedShipId, onSelect }) => {
  if (ships.length === 0) {
    return <p className="text-sm text-slate-400">No ships to display.</p>;
  }

  return (
    <ul className="space-y-2">
      {ships.map(ship => (
        <li key={ship.ship_id}>
          <button
            type="button"
            onClick={() => onSelect(ship.ship_id)}
            className={classNames(
              'w-full rounded-lg border px-4 py-3 text-left transition',
              selectedShipId === ship.ship_id
                ? 'border-cyan-500 bg-cyan-500/20 text-white'
                : 'border-slate-700 bg-slate-900 hover:border-cyan-500/70 hover:bg-slate-800'
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{ship.name}</p>
                <p className="text-xs text-slate-400">{ship.ship_id}</p>
              </div>
              <span className="text-xs text-slate-300">{new Date(ship.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="mt-2 text-sm text-cyan-300">{ship.activity}</p>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ShipList;
