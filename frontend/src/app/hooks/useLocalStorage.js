import { useState } from "react";
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initial;
    } catch {
      return initial;
    }
  });
  const save = (next) => {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      return true;
    } catch {
      return false;
    }
  };
  return [value, save];
}
