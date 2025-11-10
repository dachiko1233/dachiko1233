import { useState, useEffect } from "react";
const KEY = "bba94175";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const contriller = new AbortController();
    async function fetchmovies() {
      try {
        setIsloading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: contriller.signal }
        );
        if (!res.ok) throw new Error("Something went wrong fetching movies");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
        setIsloading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err.message);
          setError(err.message);
        }
      } finally {
        setIsloading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchmovies();

    return () => {
      contriller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
