import React, { useCallback, useEffect, useMemo, useState } from 'react';
import LoginForm from './components/LoginForm';
import ShipMap from './components/ShipMap';
import ShipList from './components/ShipList';
import ActivityLog from './components/ActivityLog';
import PaginationControls from './components/PaginationControls';
import { useAuth } from './context/AuthContext';
import { fetchShipActivities, fetchShips } from './utils/api';
import { useShipUpdates } from './hooks/useShipUpdates';
import { Ship, ShipActivity } from './types';

const PAGE_SIZE = 10;
const ACTIVITY_PAGE_SIZE = 5;

const App: React.FC = () => {
  const { isAuthenticated, logout, token } = useAuth();
  const [ships, setShips] = useState<Ship[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);
  const [activities, setActivities] = useState<ShipActivity[]>([]);
  const [activityPage, setActivityPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeShip = useMemo(() => ships.find(ship => ship.ship_id === selectedShipId) ?? null, [ships, selectedShipId]);

  useEffect(() => {
    if (ships.length === 0) {
      setSelectedShipId(null);
      setActivities([]);
      setActivityTotalPages(1);
    }
  }, [ships]);

  const loadShips = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetchShips(token, page, PAGE_SIZE);
      setShips(response.results);
      setTotalPages(response.total_pages);
      if (!selectedShipId && response.results.length > 0) {
        setSelectedShipId(response.results[0].ship_id);
      }
      if (
        selectedShipId &&
        response.results.length > 0 &&
        !response.results.some(ship => ship.ship_id === selectedShipId)
      ) {
        setSelectedShipId(response.results[0].ship_id);
        setActivityPage(1);
      }
      setStatusMessage(null);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to load ships');
    }
  }, [page, token, selectedShipId]);

  const loadActivities = useCallback(
    async (shipId: string | null, nextPage: number) => {
      if (!token || !shipId) return;
      try {
        const response = await fetchShipActivities(token, shipId, nextPage, ACTIVITY_PAGE_SIZE);
        setActivities(response.results);
        setActivityTotalPages(response.total_pages);
        setStatusMessage(null);
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : 'Unable to load activities');
      }
    },
    [token]
  );

  useEffect(() => {
    if (isAuthenticated) {
      void loadShips();
    }
  }, [isAuthenticated, loadShips]);

  useEffect(() => {
    if (selectedShipId) {
      void loadActivities(selectedShipId, activityPage);
    }
  }, [selectedShipId, activityPage, loadActivities]);

  useShipUpdates({
    token: token ?? null,
    onShips: updates => {
      setShips(prevShips => {
        const shipMap = new Map(prevShips.map(ship => [ship.ship_id, ship]));
        updates.forEach(update => {
          const previous = shipMap.get(update.ship_id);
          shipMap.set(update.ship_id, previous ? { ...previous, ...update } : update);
        });
        const merged = Array.from(shipMap.values());
        merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return merged;
      });
      setStatusMessage(null);
    },
    onError: message => {
      setStatusMessage(message);
    }
  });

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 px-8 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Ship Tracker Dashboard</h1>
            <p className="text-sm text-slate-400">Monitor vessels in real time and review their latest activities.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-rose-400 hover:text-rose-400"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-8 py-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Live map</h2>
              <button
                type="button"
                onClick={() => void loadShips()}
                className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-200 transition hover:border-cyan-500"
              >
                Refresh
              </button>
            </div>
            {statusMessage && (
              <p className="mt-2 rounded-lg border border-rose-500 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {statusMessage}
              </p>
            )}
            <div className="mt-4 h-[480px] overflow-hidden rounded-xl border border-slate-800">
              <ShipMap ships={ships} />
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Fleet overview</h2>
            </div>
            <ShipList
              ships={ships}
              selectedShipId={selectedShipId}
              onSelect={shipId => {
                setSelectedShipId(shipId);
                setActivityPage(1);
                void loadActivities(shipId, 1);
              }}
            />
            <PaginationControls page={page} totalPages={totalPages} onChange={nextPage => setPage(nextPage)} />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Activity log</h2>
              {activeShip && <span className="text-xs text-slate-400">{activeShip.name}</span>}
            </div>
            <ActivityLog activities={activities} />
            <PaginationControls
              page={activityPage}
              totalPages={activityTotalPages}
              onChange={nextPage => setActivityPage(nextPage)}
            />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
