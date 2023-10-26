import { useEffect, useState } from "react";
import StarRating from "./StarRating";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const apiKey = "573af7be";
// const query = "one piece";
export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [isError, setIsError] = useState("");
  const [seletedMovie, setSelectedMovie] = useState(null);
  const controller = new AbortController();

  
  useEffect(
    function () {
      async function fetchData() {
        try {
          setIsloading(true);
          setIsError("");
          const search = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`, {signal : controller.signal }
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

      handelBack()
      fetchData();

      return function() {
        controller.abort()
      }
    },
    [query]
  );

  function handelBack() {
    setSelectedMovie(null);
  }

  function handelWatchList(listMovie) {
    setWatched((movies) => [...movies, listMovie]);
  }

  function handelDeleteWatchList(id) {
    setWatched((movies) => movies.filter((movie) => movie.imdbID !== id));
  }
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <Result movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isloading ? <Loading /> : ""}
          {isError ? <StateError error={isError} /> : ""}
          {!isloading & !isError ? (
            <MoviesList movies={movies} handelSelectMovie={setSelectedMovie} />
          ) : (
            ""
          )}
        </Box>

        <Box>
          {seletedMovie ? (
            <MovieDetails
              onBack={handelBack}
              seletedMovie={seletedMovie}
              onWatchedList={handelWatchList}
              watchedList={watched}
            />
          ) : (
            <>
              <MovieSummery watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatchMovie={handelDeleteWatchList}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />

      {children}
    </nav>
  );
}

function Loading() {
  return <p className="loader">Loading...</p>;
}

function StateError({ error }) {
  return <p className="error">❌{error}</p>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Result({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function ListBox({children}) {
//   const [isOpen1, setIsOpen1] = useState(true);
//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen1((open) => !open)}
//       >
//         {isOpen1 ? "–" : "+"}
//       </button>
//       {isOpen1 && children}
//     </div>
//   );
// }

// function WatchedMoviesBox() {
//   const [watched, setWatched] = useState(tempWatchedData);

//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <MovieSummery watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function MoviesList({ movies, handelSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handelSelectMovie={handelSelectMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handelSelectMovie }) {
  return (
    <li
      onClick={() =>
        handelSelectMovie((id) => (id === movie.imdbID ? null : movie.imdbID))
      }
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieSummery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatchMovie }) {
  return (
    <>
      <ul className="list" style={{ cursor: "pointer" }}>
        {watched.map((movie) => (
          <WatchMovie
            key={movie.imdbID}
            movie={movie}
            onDeleteWatchMovie={onDeleteWatchMovie}
          />
        ))}
      </ul>
    </>
  );
}

function MovieDetails({ onBack, seletedMovie, onWatchedList, watchedList }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsloading] = useState(false);
  const [userRating, setUserRating] = useState(0);

 
  const isWatched = watchedList
    .map((movie) => movie.imdbID)
    .includes(seletedMovie);

  const watchedRating = watchedList.find(
    (movie) => movie.imdbID === seletedMovie
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function setWatchedList() {
    const movie = {
      imdbID: seletedMovie,
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      userRating,
    };

    onWatchedList(movie);
    onBack();
  }

  useEffect(function() {

    function keydown(e) {
      if(e.code === "Escape") {
         onBack();
      }
    }

    document.addEventListener('keydown', keydown)

    return function() {
        document.removeEventListener("keydown", keydown)
    }
  }, [onBack])

  useEffect(
    function () {
      async function getMovieDetail() {
        setIsloading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&i=${seletedMovie}`
        );
        const data = await res.json();
       
        setMovie(data);
        setIsloading(false);
      }

      getMovieDetail();
    },
    [seletedMovie]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
        // console.log(`Clean up effect for movie ${title}`);
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onBack}>
              &larr;
            </button>
            <img src={poster} alt={movie} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMdb Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onState={setUserRating}
                  />

                  {userRating ? (
                    <button className="btn-add" onClick={setWatchedList}>
                      + Add to Watched list
                    </button>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <p>You rated this movie {watchedRating} ⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchMovie({ movie, onDeleteWatchMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatchMovie(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
