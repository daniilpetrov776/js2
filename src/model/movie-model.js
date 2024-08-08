import { generateMovie } from '../mock/mock.js';

export default class movieModel {
  movies = Array.from({length: 5}, (_, index) => generateMovie(index));

  getMovies = () => this.movies;
}
