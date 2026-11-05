import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fakeApi } from '../services/fakeApi.js';
import { CATEGORIES, PRIORITIES, STATUSES } from '../services/initial-data-sample.js';
import TaskCard from '../components/TaskCard.jsx';

export default function TaskListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL parameters state
  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const statusFilter = searchParams.get('status') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 9;

  // Data states
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    fakeApi.getAll()
      .then((data) => {
        if (!ignore) {
          setTasks(data);
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
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== '1' && value !== 'newest') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleResetSeed = async () => {
    setLoading(true);
    const fresh = await fakeApi.resetData();
    setTasks(fresh);
    setLoading(false);
    setToast('База сброшена до исходных 100 записей!');
  };

  const handleToggleStatus = async (targetId, currentStatus) => {
    if (actionLoadingId) return;
    setActionLoadingId(targetId);
    const nextStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
    try {
      const updated = await fakeApi.update(targetId, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t.id === targetId ? updated : t)));
      setToast(`Статус задачи ${targetId} изменен!`);
    } catch (err) {
      alert(`Ошибка обновления: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (targetId) => {
    if (!window.confirm(`Удалить задачу ${targetId}?`)) return;
    setActionLoadingId(targetId);
    try {
      await fakeApi.remove(targetId);
      setTasks((prev) => prev.filter((t) => t.id !== targetId));
      setToast(`Задача ${targetId} удалена.`);
    } catch (err) {
      alert(`Ошибка удаления: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTask = {
      title: formData.get('title'),
      category: formData.get('category'),
      priority: formData.get('priority'),
      status: formData.get('status'),
      assignee: formData.get('assignee'),
      estimatedHours: Number(formData.get('estimatedHours')),
      description: formData.get('description')
    };
    setActionLoadingId('CREATE');
    try {
      const created = await fakeApi.create(newTask);
      setTasks((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      setToast(`Создана задача ${created.id}`);
    } catch (err) {
      alert(`Ошибка создания: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    const formData = new FormData(e.target);
    const updatedFields = {
      title: formData.get('title'),
      category: formData.get('category'),
      priority: formData.get('priority'),
      status: formData.get('status'),
      assignee: formData.get('assignee'),
      estimatedHours: Number(formData.get('estimatedHours')),
      description: formData.get('description')
    };
    const targetId = editingTask.id;
    setActionLoadingId(targetId);
    try {
      const updated = await fakeApi.update(targetId, updatedFields);
      setTasks((prev) => prev.map((t) => (t.id === targetId ? updated : t)));
      setEditingTask(null);
      setToast(`Задача ${targetId} обновлена!`);
    } catch (err) {
      alert(`Ошибка: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter, Sort, Paginate
  const filteredTasks = tasks.filter((t) => {
    const matchesQ = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     t.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesStat = statusFilter === 'All' || t.status === statusFilter;
    return matchesQ && matchesCat && matchesStat;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'hours') return b.estimatedHours - a.estimatedHours;
    return b.id.localeCompare(a.id);
  });

  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage) || 1;
  const paginatedTasks = sortedTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl">
        <div>
          <h2 className="text-lg font-bold text-white">Каталог задач (Items List)</h2>
          <p className="text-xs text-slate-400">Синхронизация фильтров с URL через useSearchParams</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleResetSeed} className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300">
            Сброс (100 Seed)
          </button>
          <button onClick={() => setIsCreateOpen(true)} className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white shadow-md">
            + Новая задача
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => updateParam('q', e.target.value)}
          placeholder="Поиск по названию, ID, автору..."
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => updateParam('category', e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="All">Все категории</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => updateParam('status', e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="All">Все статусы</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="newest">Сначала новые (ID)</option>
          <option value="title">По названию (A-Z)</option>
          <option value="hours">По часам (убывание)</option>
        </select>
      </div>

      {/* Loading / Error States */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-card h-40 rounded-xl animate-pulse bg-slate-900"></div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-6 glass-card border border-red-500/40 rounded-xl text-center text-red-400 text-xs">
          ⚠️ Ошибка загрузки данных: {error}
        </div>
      )}

      {!loading && !error && paginatedTasks.length === 0 && (
        <div className="p-12 glass-card rounded-xl text-center text-slate-400 text-xs">
          Задач по выбранным фильтрам не найдено.
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isActionBusy={actionLoadingId === task.id}
                onToggleStatus={handleToggleStatus}
                onEdit={setEditingTask}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs">
            <span className="text-slate-400">
              Показано {paginatedTasks.length} из {sortedTasks.length} (Страница {currentPage} из {totalPages})
            </span>
            <div className="flex space-x-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => updateParam('page', (currentPage - 1).toString())}
                className="px-3 py-1.5 rounded bg-slate-800 disabled:opacity-40 text-slate-200 border border-slate-700"
              >
                ← Назад
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => updateParam('page', (currentPage + 1).toString())}
                className="px-3 py-1.5 rounded bg-slate-800 disabled:opacity-40 text-slate-200 border border-slate-700"
              >
                Вперед →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-xl border border-slate-700">
            <h2 className="text-base font-bold text-white mb-4">Создать новую задачу</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Title *</label>
                <input required name="title" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select name="category" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Priority</label>
                  <select name="priority" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Status</label>
                  <select name="status" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Assignee</label>
                  <input required name="assignee" defaultValue="Medeu Seidali" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Estimated Hours</label>
                <input required type="number" name="estimatedHours" defaultValue="4" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea required name="description" rows="3" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-3 py-1.5 text-slate-400">Отмена</button>
                <button type="submit" disabled={actionLoadingId === 'CREATE'} className="px-4 py-1.5 bg-indigo-600 text-white rounded font-bold">
                  {actionLoadingId === 'CREATE' ? 'Сохранение...' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-xl border border-slate-700">
            <h2 className="text-base font-bold text-white mb-4">Редактирование: {editingTask.id}</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Title</label>
                <input required name="title" defaultValue={editingTask.title} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select name="category" defaultValue={editingTask.category} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Priority</label>
                  <select name="priority" defaultValue={editingTask.priority} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Status</label>
                  <select name="status" defaultValue={editingTask.status} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Assignee</label>
                  <input required name="assignee" defaultValue={editingTask.assignee} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Estimated Hours</label>
                <input required type="number" name="estimatedHours" defaultValue={editingTask.estimatedHours} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea required name="description" rows="3" defaultValue={editingTask.description} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setEditingTask(null)} className="px-3 py-1.5 text-slate-400">Отмена</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded font-bold">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 glass-card border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center space-x-2">
          <span>✅</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
