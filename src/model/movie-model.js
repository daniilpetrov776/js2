import { generateMovie } from '../mock/mock.js';
const FILM_COUNT = 18;

export default class movieModel {
  #movies = Array.from({length: FILM_COUNT}, (_, index) => generateMovie(index));

  get = () => this.#movies;
}
