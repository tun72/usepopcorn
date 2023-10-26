import { useEffect, useState } from "react";
const apiKey = "573af7be";

export function useMovie(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [isError, setIsError] = useState("");

  const controller = new AbortController();

  useEffect(
    function () {
      async function fetchData() {
        try {
          setIsloading(true);
          setIsError("");
          const search = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
            { signal: controller.signal }
          );

          if (!search.ok) {
            throw new Error("Error can't fetch data");
          }
          const data = await search.json();

          if (data.Response === "False") {
            throw new Error("Movie not found!");
          }

          setMovies(data.Search);
          setIsError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setIsError(err.message);
          }
        } finally {
          setIsloading(false);
        }
      }
      if (query.length < 4) {
        setMovies([]);
        setIsError("");
        return;
      }

      callback();
      fetchData();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return {movies, isloading, isError};
}
