import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 px-4 text-xs text-indigo-200">
      <p className="flex items-center justify-center gap-1">
        <span>Built with</span>
        <span className="text-rose-400">❤️</span>
        <span>for students | College Project 2026</span>
      </p>
      <p className="mt-1 text-[11px] text-indigo-300/80">
        Student Finance Tracker • Self-contained & Permanent
      </p>
    </footer>
  );
};
