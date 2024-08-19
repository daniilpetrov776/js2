import AbstractView from '../framework/view/abstract-view.js';

const createNewMoviesCountTemplate = (movies) => (`
  <section class="footer__statistics">
    <p>${movies.length} movies inside</p>
  </section>`);

export default class MoviesCountView extends AbstractView {
  #count = null;

  constructor(movies) {
    super();
    this.movies = movies;
  }

  get template() {
    return createNewMoviesCountTemplate(this.movies);
  }
}
