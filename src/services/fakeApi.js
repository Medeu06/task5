import { API_CONFIG } from './settings.js';
import { generateInitialTasks } from './initial-data-sample.js';

function getStorageData() {
  const raw = localStorage.getItem(API_CONFIG.STORAGE_KEY);
  if (!raw) {
    const initial = generateInitialTasks();
    localStorage.setItem(API_CONFIG.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    const initial = generateInitialTasks();
    localStorage.setItem(API_CONFIG.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function setStorageData(data) {
  localStorage.setItem(API_CONFIG.STORAGE_KEY, JSON.stringify(data));
}

export const fakeApi = {
  async getAll() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < API_CONFIG.ERROR_RATE) {
          reject(new Error('Network error: Unable to load tasks from server.'));
          return;
        }
        resolve([...getStorageData()]);
      }, API_CONFIG.DELAY_MS);
    });
  },

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < API_CONFIG.ERROR_RATE) {
          reject(new Error(`Failed to fetch details for task ID: ${id}`));
          return;
        }
        const data = getStorageData();
        const found = data.find((item) => item.id === id);
        if (!found) {
          reject(new Error(`Task "${id}" was not found.`));
        } else {
          resolve({ ...found });
        }
      }, API_CONFIG.DELAY_MS);
    });
  },

  async create(newItem) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStorageData();
        const created = {
          ...newItem,
          id: `TASK-${Date.now().toString().slice(-4)}`,
          createdAt: new Date().toISOString().split('T')[0]
        };
        const updated = [created, ...data];
        setStorageData(updated);
        resolve(created);
      }, API_CONFIG.DELAY_MS);
    });
  },

  async update(id, partialData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = getStorageData();
        let updatedItem = null;
        const updatedList = data.map((item) => {
          if (item.id === id) {
            updatedItem = { ...item, ...partialData };
            return updatedItem;
          }
          return item;
        });

        if (!updatedItem) {
          reject(new Error(`Task ${id} not found for update.`));
          return;
        }

        setStorageData(updatedList);
        resolve(updatedItem);
      }, API_CONFIG.DELAY_MS);
    });
  },

  async remove(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStorageData();
        const updated = data.filter((item) => item.id !== id);
        setStorageData(updated);
        resolve({ id });
      }, API_CONFIG.DELAY_MS);
    });
  },

  async resetData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fresh = generateInitialTasks();
        setStorageData(fresh);
        resolve(fresh);
      }, API_CONFIG.DELAY_MS);
    });
  }
};
