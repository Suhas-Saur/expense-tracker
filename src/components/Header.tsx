import React from 'react';
import { GraduationCap, Sparkles, Download, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onLoadSampleData: () => void;
  onResetData: () => void;
  onExportData: () => void;
  hasTransactions: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadSampleData,
  onResetData,
  onExportData,
  hasTransactions,
}) => {
  return (
    <header className="text-center pt-8 pb-6 px-4">
      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-semibold mb-3 border border-white/20 shadow-sm">
        <GraduationCap className="w-4 h-4 text-indigo-200" />
        <span>Student Edition • Personal Finance Suite</span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
        Student Finance Tracker
      </h1>
      
      <p className="mt-2 text-indigo-100 text-sm sm:text-base font-normal max-w-xl mx-auto">
        Track your income, expenses and budget effortlessly
      </p>

      {/* Quick Actions for Evaluation & Ease of Use */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onLoadSampleData}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-white/15 hover:bg-white/25 text-white rounded-full border border-white/30 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
          title="Load pre-filled sample student transactions to preview charts and calculations"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Load Sample Data</span>
        </button>

        {hasTransactions && (
          <>
            <button
              onClick={onExportData}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-white/15 hover:bg-white/25 text-white rounded-full border border-white/30 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Export all transactions as JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-indigo-200" />
              <span>Export Data</span>
            </button>

            <button
              onClick={onResetData}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-white/15 hover:bg-white/25 text-rose-100 hover:text-white rounded-full border border-white/30 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Clear all transactions and reset"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-300" />
              <span>Reset All</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
