import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fakeApi } from '../services/fakeApi.js';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    fakeApi.getById(id)
      .then((data) => {
        if (!ignore) {
          setTask(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { ignore = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto glass-card p-6 rounded-xl animate-pulse space-y-4">
        <div className="h-6 bg-slate-800 rounded w-1/3"></div>
        <div className="h-4 bg-slate-800/60 rounded w-2/3"></div>
        <div className="h-24 bg-slate-800/40 rounded w-full"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-md mx-auto glass-card p-8 rounded-xl text-center space-y-4">
        <div className="text-3xl">⚠️</div>
        <h2 className="text-lg font-bold text-white">Задача не найдена</h2>
        <p className="text-xs text-slate-400">{error || `Элемент с ID "${id}" не существует.`}</p>
        <div className="pt-2 flex justify-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 border border-slate-700"
          >
            ← Назад
          </button>
          <Link to="/tasks" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white">
            Все задачи
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto glass-card p-6 rounded-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold">{task.id}</span>
          <h1 className="text-xl font-bold text-white">{task.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-700"
          >
            ← Назад
          </button>
          <Link
            to="/tasks"
            className="px-3 py-1.5 text-xs bg-indigo-600/80 hover:bg-indigo-600 rounded-lg text-white font-bold"
          >
            Все задачи
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
        <div>
          <span className="text-slate-500 block text-[10px]">1. Task ID</span>
          <span className="font-mono font-bold text-indigo-300">{task.id}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">2. Категория</span>
          <span className="font-semibold text-slate-200">{task.category}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">3. Приоритет</span>
          <span className="font-bold text-amber-400">{task.priority}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">4. Статус</span>
          <span className="font-bold text-emerald-400">{task.status}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">5. Исполнитель</span>
          <span className="text-slate-200">{task.assignee}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">6. Оценка времени</span>
          <span className="font-bold text-white">{task.estimatedHours} ч.</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">7. Дата создания</span>
          <span className="font-mono text-slate-400">{task.createdAt}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">8. Заголовок</span>
          <span className="text-slate-300 truncate block">{task.title}</span>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">9. Полное описание</h3>
        <p className="p-4 bg-slate-900/50 rounded-xl text-slate-300 leading-relaxed border border-slate-800 text-xs">
          {task.description}
        </p>
      </div>

      <div className="flex justify-between items-center pt-2">
        <Link to="/tasks" className="text-xs text-indigo-400 hover:underline">
          ← Перейти к каталогу всех задач
        </Link>
      </div>
    </div>
  );
}
