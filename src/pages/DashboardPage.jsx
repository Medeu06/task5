import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fakeApi } from '../services/fakeApi.js';
import { CATEGORIES } from '../services/initial-data-sample.js';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignee, setSelectedAssignee] = useState('All');

  useEffect(() => {
    fakeApi.getAll().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-xs">Загрузка данных дашборда...</div>;
  }

  const assignees = Array.from(new Set(tasks.map((t) => t.assignee)));
  const filteredTasks = selectedAssignee === 'All' ? tasks : tasks.filter((t) => t.assignee === selectedAssignee);

  const totalCount = filteredTasks.length;
  const completedCount = filteredTasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = filteredTasks.filter((t) => t.status === 'In Progress').length;
  const totalHours = filteredTasks.reduce((acc, t) => acc + t.estimatedHours, 0);
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl">
        <div>
          <h1 className="text-lg font-bold text-white">Дашборд проекта (Dashboard)</h1>
          <p className="text-xs text-slate-400">Метрики и интерактивный срез аналитики</p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Фильтр по исполнителю:</span>
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">Все исполнители ({tasks.length})</option>
            {assignees.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-bold">1. Всего задач</span>
          <p className="text-2xl font-black text-white mt-1">{totalCount}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[10px] text-emerald-400 uppercase font-bold">2. Завершено</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{completedCount} ({completionRate}%)</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[10px] text-amber-400 uppercase font-bold">3. В работе</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{inProgressCount}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[10px] text-indigo-400 uppercase font-bold">4. Трудозатраты</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">{totalHours} ч.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Срез 1: Распределение по категориям</h3>
          <div className="space-y-2.5">
            {CATEGORIES.map((cat) => {
              const catTasks = filteredTasks.filter((t) => t.category === cat);
              const percent = totalCount > 0 ? Math.round((catTasks.length / totalCount) * 100) : 0;
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{cat}</span>
                    <span>{catTasks.length} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Срез 2: Нагрузка по приоритетам</h3>
            <div className="space-y-2.5">
              {['Critical', 'High', 'Medium', 'Low'].map((priority) => {
                const count = filteredTasks.filter((t) => t.priority === priority).length;
                return (
                  <div key={priority} className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-xs">
                    <span className="font-bold text-slate-200">{priority}</span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono font-bold">{count} задач</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Link to="/tasks" className="text-xs text-indigo-400 hover:underline flex items-center space-x-1">
              <span>Смотреть эти задачи в каталоге</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
