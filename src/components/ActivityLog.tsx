import React from 'react';
import { ShipActivity } from '../types';

interface ActivityLogProps {
  activities: ShipActivity[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  if (activities.length === 0) {
    return <p className="text-sm text-slate-400">No activity available for this ship.</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map(activity => (
        <div key={`${activity.ship_id}-${activity.activity_time}`} className="rounded-lg border border-slate-700 bg-slate-900 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {new Date(activity.activity_time).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-slate-100">{activity.activity}</p>
        </div>
      ))}
    </div>
  );
};

export default ActivityLog;
