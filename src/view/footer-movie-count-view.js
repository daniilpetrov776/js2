import AbstractView from '../framework/view/abstract-view.js';

const createNewMoviesCountTemplate = (length) => (`
  <section class="footer__statistics">
    <p>${length} movies inside</p>
  </section>`);

export default class MoviesCountView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createNewMoviesCountTemplate(this.#movies);
  }
}
