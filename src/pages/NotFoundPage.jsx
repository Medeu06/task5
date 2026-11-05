import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto glass-card p-10 rounded-2xl text-center space-y-4 my-12 border border-slate-800">
      <div className="text-5xl font-black text-indigo-500">404</div>
      <h1 className="text-lg font-bold text-white">Страница не найдена</h1>
      <p className="text-xs text-slate-400">
        Запрошенный адрес не существует или был перемещен.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl inline-block shadow-md"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
