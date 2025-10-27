import React from 'react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-slate-700 px-3 py-1 transition hover:border-cyan-500 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg border border-slate-700 px-3 py-1 transition hover:border-cyan-500 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
