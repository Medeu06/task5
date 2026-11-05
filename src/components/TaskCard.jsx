import React from 'react';
import { Link } from 'react-router-dom';

export default function TaskCard({ task, isActionBusy, onToggleStatus, onEdit, onDelete }) {
  return (
    <div className="glass-card p-4 rounded-xl transition-all border border-slate-800 hover:border-slate-700 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold text-indigo-400">{task.id}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {task.category}
            </span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            task.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {task.status}
          </span>
        </div>

        <Link to={`/tasks/${task.id}`} className="block mt-2 group">
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {task.title}
          </h3>
        </Link>
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{task.description}</p>
      </div>

      <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>👤 {task.assignee}</span>
        
        <div className="flex items-center space-x-1.5">
          <Link
            to={`/tasks/${task.id}`}
            className="px-2 py-0.5 rounded bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/50"
          >
            Инфо
          </Link>
          <button
            onClick={() => onToggleStatus(task.id, task.status)}
            disabled={isActionBusy}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            {isActionBusy ? '...' : task.status === 'Completed' ? 'Reopen' : 'Complete'}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-red-900/50 text-red-400 border border-slate-700"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
