import { useState, useEffect } from "react";

export function useLocalStorageState(initialQuery, key) {
  const [watched, setWatched] = useState(function () {
    const stateQuery = localStorage.getItem(key);
    return stateQuery ? JSON.parse(stateQuery) : initialQuery;
  });
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(watched));
    },
    [watched, key, initialQuery]
  );
  return [watched, setWatched];
}
