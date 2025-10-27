export interface Ship {
  ship_id: string;
  name: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  activity: string;
}

export interface ShipActivity {
  ship_id: string;
  activity_time: string;
  activity: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
}

export type ShipUpdateMessage =
  | {
      type: 'ship_update';
      ships: Ship[];
    }
  | {
      type: 'error';
      error: 'Invalid ship data';
      details?: string;
    };
