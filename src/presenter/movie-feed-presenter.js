import { remove, render } from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFeedView from '../view/empty-feed-view.js';
import MoviePresenter from './movie-presenter.js';
import { updateItem } from '../utils/utils.js';

const MOVIES_PER_STEP = 5;
export default class MovieFeedPresenter {
  #films = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsContainer = new FilmsContainerView();
  #loadMoreMoviesComponent = new ShowMoreButtonView();
  // #moviePresenter = new MoviePresenter(this.#filmsContainer);
  #siteElement = null;
  #movieModel = null;

  #movies = [];
  #renderMoviesCount = MOVIES_PER_STEP;
  #moviePresenters = new Map();

  constructor (siteElement, movieModel) {
    this.#siteElement = siteElement;
    this.#movieModel = movieModel;
  }

  init = () => {
    this.#movies = [...this.#movieModel.get()];
    this.#renderFeed();
  };

  #handleMovieChange = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    this.#moviePresenters.get(updatedMovie.id).init(updatedMovie);
  };

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#filmsContainer, this.#handleMovieChange);
    moviePresenter.init(movie);
    this.#moviePresenters.set(movie.id, moviePresenter);
    // console.log(this.#moviePresenters);
    // console.log(this.#movies)
  };

  #renderFeed = () => {
    render(this.#films, this.#siteElement);
    render(this.#filmsList, this.#films.element);
    render(this.#filmsContainer, this.#filmsList.element);

    for (let i = 0; i < Math.min(this.#movies.length, MOVIES_PER_STEP); i++) {
      this.#renderMovie(this.#movies[i]);
      // this.#moviePresenter.init(this.#movies[i]);
    }
    // console.log(this.#moviePresenters);
    if (this.#movies.length === 0) {
      this.#renderEmptyFeed();
    }

    if (this.#movies.length > MOVIES_PER_STEP) {
      render(this.#loadMoreMoviesComponent, this.#siteElement);

      this.#loadMoreMoviesComponent.setClickHandler(this.#onShowMoreButtonClick);
    }
  };

  #onShowMoreButtonClick = () => {
    this.#movies
      .slice(this.#renderMoviesCount, this.#renderMoviesCount + MOVIES_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderMoviesCount += MOVIES_PER_STEP;

    if (this.#renderMoviesCount >= this.#movies.length) {
      this.#loadMoreMoviesComponent.element.remove();
      this.#loadMoreMoviesComponent.removeElement();
    }
  };

  #renderEmptyFeed = () => {
    const emptyMessageComponent = new EmptyFeedView();

    render(emptyMessageComponent, this.#films.element);
  };

  #clearMovies = () => {
    this.#moviePresenters.forEach((presenter) => presenter.destroy());
    this.#moviePresenters.clear();
    this.#renderMoviesCount = MOVIES_PER_STEP;
    remove(this.#loadMoreMoviesComponent);
  };
}
