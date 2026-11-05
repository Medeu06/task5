import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-900 py-4 text-center text-[11px] text-slate-500">
        DevTask Hub © 2026 — Medeu Seidali. React Router Architecture TSIS5.
      </footer>
    </div>
  );
}
