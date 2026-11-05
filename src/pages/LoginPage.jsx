import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('medeu@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Вход успешно выполнен (эмуляция)! Добро пожаловать, ${email}`);
    navigate('/tasks');
  };

  return (
    <div className="max-w-md mx-auto glass-card p-6 rounded-xl space-y-4 my-10 border border-slate-800">
      <div className="text-center">
        <h1 className="text-lg font-bold text-white">Вход в DevTask Hub</h1>
        <p className="text-xs text-slate-400 mt-1">Форма авторизации (Placeholder для будущего JWT/Auth)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-300 mb-1 font-semibold">Email / Логин</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded-lg transition-all shadow-md mt-2"
        >
          Войти в аккаунт
        </button>
      </form>
    </div>
  );
}
