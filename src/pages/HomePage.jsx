import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto glass-card p-8 rounded-2xl text-center space-y-6 my-8">
      <div className="inline-block p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs">
        🚀 DevTask Hub v2.0 Architecture
      </div>
      
      <h1 className="text-3xl font-extrabold text-white tracking-tight">
        Система управления разработкой и задачами
      </h1>
      
      <p className="text-slate-400 text-xs leading-relaxed max-w-2xl mx-auto">
        Модульное React-приложение с маршрутизацией через React Router v6, динамическими адресами URL (`useParams`), синхронизацией фильтров с поисковыми параметрами (`useSearchParams`) и аналитическим дашбордом.
      </p>

      <div className="my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 p-4 max-w-xl mx-auto">
        <img
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
          alt="Developer Code Editor"
          className="w-full h-48 object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="flex justify-center space-x-3 pt-2">
        <Link to="/tasks" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all">
          Перейти к задачам →
        </Link>
        <Link to="/dashboard" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700">
          Открыть Дашборд
        </Link>
      </div>
    </div>
  );
}
