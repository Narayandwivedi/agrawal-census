const FAMILIES_KEY = 'agrawal_families';
const SAMAJ_KEY = 'agrawal_samaj';

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

/* ===== Families ===== */

export const getFamilies = () => Promise.resolve(read(FAMILIES_KEY));

export const saveFamily = (data) => {
  const list = read(FAMILIES_KEY);
  const doc = { ...data, _id: generateId(), createdAt: now(), updatedAt: now() };
  list.push(doc);
  write(FAMILIES_KEY, list);
  return Promise.resolve(doc);
};

export const createFamily = saveFamily;

export const updateFamily = (id, data) => {
  const list = read(FAMILIES_KEY);
  const idx = list.findIndex((f) => f._id === id);
  if (idx === -1) return Promise.reject(new Error('Family not found'));
  list[idx] = { ...list[idx], ...data, _id: id, updatedAt: now() };
  write(FAMILIES_KEY, list);
  return Promise.resolve(list[idx]);
};

export const deleteFamily = (id) => {
  const list = read(FAMILIES_KEY).filter((f) => f._id !== id);
  write(FAMILIES_KEY, list);
  return Promise.resolve();
};

/* ===== Samaj ===== */

export const getAllSamaj = () => Promise.resolve(read(SAMAJ_KEY));

export const saveSamaj = (data) => {
  const list = read(SAMAJ_KEY);
  const doc = { ...data, _id: generateId(), createdAt: now(), updatedAt: now() };
  list.push(doc);
  write(SAMAJ_KEY, list);
  return Promise.resolve(doc);
};

export const createSamaj = saveSamaj;

export const updateSamaj = (id, data) => {
  const list = read(SAMAJ_KEY);
  const idx = list.findIndex((s) => s._id === id);
  if (idx === -1) return Promise.reject(new Error('Samaj not found'));
  list[idx] = { ...list[idx], ...data, _id: id, updatedAt: now() };
  write(SAMAJ_KEY, list);
  return Promise.resolve(list[idx]);
};

export const deleteSamaj = (id) => {
  const list = read(SAMAJ_KEY).filter((s) => s._id !== id);
  write(SAMAJ_KEY, list);
  return Promise.resolve();
};
