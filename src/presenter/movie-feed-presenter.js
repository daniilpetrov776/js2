import { remove, render } from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFeedView from '../view/empty-feed-view.js';
import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';
import { updateItem } from '../utils/utils.js';

const MOVIES_PER_STEP = 5;
export default class MovieFeedPresenter {
  #films = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsContainer = new FilmsContainerView();
  #loadMoreMoviesComponent = new ShowMoreButtonView();
  #popupPresenter = null;
  #siteElement = null;
  #movieModel = null;
  #currentMovie = null;

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

    if (this.#popupPresenter && this.#currentMovie.id === updatedMovie.id) {
      this.#popupPresenter.init(updatedMovie);
    }
  };

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#filmsContainer, this.#handleMovieChange, this.#addPopup);
    moviePresenter.init(movie);
    this.#moviePresenters.set(movie.id, moviePresenter);
  };

  #renderFeed = () => {
    this.#renderBaseStructure();
    this.#renderMovies();
    this.#renderloadMoreMoviesComponent();
  };

  #renderBaseStructure = () => {
    render(this.#films, this.#siteElement);
    render(this.#filmsList, this.#films.element);
    render(this.#filmsContainer, this.#filmsList.element);
  };

  #renderMovies = () => {
    const movieCount = Math.min(this.#movies.length, MOVIES_PER_STEP);
    this.#movies.slice(0, movieCount).forEach(this.#renderMovie);
    this.#checkAndRenderEmptyFeed();
  };

  #checkAndRenderEmptyFeed = () => {
    if (this.#movies.length === 0) {
      this.#renderEmptyFeed();
    }
  };

  #renderloadMoreMoviesComponent = () => {
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
    this.#removeShowMoreButton();
  };

  #removeShowMoreButton = () => {
    if (this.#renderMoviesCount >= this.#movies.length) {
      this.#loadMoreMoviesComponent.element.remove();
      this.#loadMoreMoviesComponent.removeElement();
    }
  };

  #renderEmptyFeed = () => {
    render(new EmptyFeedView(), this.#films.element);
  };

  #renderMoviePopup = () => {
    if (!this.#popupPresenter) {
      this.#popupPresenter = new PopupPresenter(this.#filmsContainer, this.#removeMoviePopup, this.#handleMovieChange);
      this.#popupPresenter.init(this.#currentMovie);
    }
  };

  #addPopup = (movie) => {
    // if (this.#currentMovie && this.#currentMovie.id === movie.id) {
    //   return;
    // }

    // if (this.#currentMovie && this.#currentMovie.id !== movie.id) {
    // }
    if (this.#currentMovie?.id !== movie.id) {

      this.#removeMoviePopup();
      this.#currentMovie = movie;
      this.#renderMoviePopup();
      document.body.classList.add('hide-overflow');
    }
  };

  #removeMoviePopup = () => {
    if (this.#popupPresenter) {
      this.#popupPresenter.destroy();
      this.#popupPresenter = null;
      this.#currentMovie = null;
      document.body.classList.remove('hide-overflow');
    }
  };

  #clearMovies = () => {
    this.#moviePresenters.forEach((presenter) => presenter.destroy());
    this.#moviePresenters.clear();
    this.#renderMoviesCount = MOVIES_PER_STEP;
    remove(this.#loadMoreMoviesComponent);
  };
}
