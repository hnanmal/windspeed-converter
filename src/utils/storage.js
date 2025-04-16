export const saveToStorage = (key, data) =>
    localStorage.setItem(key, JSON.stringify(data));
  
  export const loadFromStorage = (key) =>
    JSON.parse(localStorage.getItem(key) || "[]");
  