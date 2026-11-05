import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const linkStyle = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-30 glass-card border-b border-slate-800 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
      <NavLink to="/" className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-xl shadow-lg text-white">
          D
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white">DevTask Hub</h1>
          <p className="text-[10px] text-slate-400">TSIS5 Modular Architecture & Routing</p>
        </div>
      </NavLink>

      <nav className="flex items-center space-x-1 sm:space-x-2">
        <NavLink to="/" end className={linkStyle}>Главная</NavLink>
        <NavLink to="/tasks" className={linkStyle}>Задачи</NavLink>
        <NavLink to="/dashboard" className={linkStyle}>Дашборд</NavLink>
        <NavLink to="/about" className={linkStyle}>О проекте</NavLink>
        <NavLink to="/login" className={linkStyle}>Войти</NavLink>
      </nav>
    </header>
  );
}
