const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.TMDB_API_KEY;

const getPopularMovies = async () => {
  try{
    const endPoints = Array.from(
      { length: 50 },
      (_, i) =>
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${i + 1}`,
    );

    const responses = await Promise.all(
      endPoints.map((endpoint) => axios.get(endpoint)),
    );

    const movies = responses.flatMap((response) => response.data.results);

    const data = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
    );
    return movies;
  } catch(error) {
    console.error("TMDB Error:", error.message);
    throw new Error(error.message);
  }
};

const searchMovies = async (query) => {
  try{
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
    );
    return response.data;
  }
  catch(error){
    console.log(error.message);
  }
};

const getMovieDetails = async (id) => {
  try{
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    );
    return response.data;
  }
  catch(error){
    console.log(error.message);
  }
};

const getSimilarMovies = async (id) => {
  try{
    const [res1, res2] = await Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}`,
      ),
      axios.get(
        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`,
      ),
    ]);

    return (res1.data, res2.data);
  }
  catch(error){
    console.error({message : error.message});
    console.log(error.message);
  }
};

module.exports = { getPopularMovies, searchMovies, getMovieDetails, getSimilarMovies };