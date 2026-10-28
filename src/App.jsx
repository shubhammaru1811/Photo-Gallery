
import { useState,useReducer,useEffect,useCallback,useMemo} from "react";
import favouritesReducer from "./reducers/favouritesReducer";
import useFetchPhotos from "./hooks/useFetchPhotos";

function App() {
  
  const {photos, loading,error} =useFetchPhotos();
  const [searchTerm, setSearchTerm]= useState("");
  const [favourites, dispatch] =useReducer(favouritesReducer,[],()=>{
    try {
      const savedFavourites = localStorage.getItem("favourites");
      return savedFavourites ? JSON.parse(savedFavourites) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favourites",JSON.stringify(favourites));
  }, [favourites]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [photos, searchTerm]);

  if (loading) {
    return <h2 className="p-5 text-xl">Loading photos...</h2>;
  }

  if (error) {
    return <h2 className="p-5 text-red-500">Error: {error}</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-3xl font-bold">Photo Gallery</h1>
      <input type="text" placeholder="Search by author..." value={searchTerm} onChange={handleSearch} className="mb-6 w-full rounded-lg border p-3"/>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="overflow-hidden rounded-lg bg-white p-3 shadow">
            <img src={photo.download_url} alt={photo.author} className="h-48 w-full rounded object-cover"/>
            <h2 className="mt-3 font-semibold">{photo.author}</h2>
            <button onClick={() => dispatch({type:"TOGGLE_FAVOURITE",photo:photo})} className="mt-2 text-2xl text-red-500">
              {favourites.some((fav) => fav.id === photo.id) ? "♥" : "♡"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
