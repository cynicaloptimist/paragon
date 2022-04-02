import { useState } from "react";

export function useStorageBackedState<T>(
  storageKey: string,
  initialValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  const setValueWithSave = (value: T) => {
    setValue(value);
    localStorage.setItem(storageKey, JSON.stringify(value));
  };

  return [value, setValueWithSave];
}
