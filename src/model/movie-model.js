import { generateMovie } from '../mock/mock.js';

export default class movieModel {
  movies = Array.from({length: 5}, generateMovie);

  getMovies = () => this.movies;
}
