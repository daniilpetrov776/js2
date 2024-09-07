import { remove, render, replace } from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import SortView from '../view/sort-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFeedView from '../view/empty-feed-view.js';
import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';
// import { updateItem } from '../utils/utils.js';
import { SortType, UpdateType, UserAction } from '../utils/const.js';
import { sortByNewest, compareMoviesRating } from '../utils/tasks.js';

const MOVIES_PER_STEP = 5;
export default class MovieFeedPresenter {
  #films = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsContainer = new FilmsContainerView();
  #loadMoreMoviesComponent = new ShowMoreButtonView();
  #sortComponent = null;
  #popupPresenter = null;
  #siteElement = null;
  #movieModel = null;
  #currentMovie = null;
  #currentSortType = SortType.DEFAULT;
  // #sourcedMovies = [];

  // #movies = [];
  #renderMoviesCount = MOVIES_PER_STEP;
  #moviePresenters = new Map();

  constructor (siteElement, movieModel) {
    this.#siteElement = siteElement;
    this.#movieModel = movieModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#movieModel.get()].sort(sortByNewest);
      case SortType.RATING:
        return [...this.#movieModel.get()].sort(compareMoviesRating);
    }
    return this.#movieModel.get();
  }

  init = () => {
    // this.#movies = [...this.#movieModel.get()];
    // this.#sourcedMovies = [...this.#movieModel.get()];
    this.#renderSort(this.#siteElement);
    this.#renderFeed();
  };

  // #handleMovieChange = (updatedMovie) => {
  //   // this.#movies = updateItem(this.#movies, updatedMovie);
  //   // this.#sourcedMovies = updateItem(this.#sourcedMovies, updatedMovie);
  //   this.#moviePresenters.get(updatedMovie.id).init(updatedMovie);

  //   if (this.#popupPresenter && this.#currentMovie.id === updatedMovie.id) {
  //     this.#popupPresenter.init(updatedMovie);
  //   }
  // };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#movieModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#movieModel.addMovieComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#movieModel.deleteMovieComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenters.get(data.id).init(data);
        // - обновить часть списка (например, когда поменялось описание)
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  };

  // #sortMovies = (sortType) => {
  //   switch (sortType) {
  //     case SortType.DATE:
  //       this.#movies.sort(sortByNewest);
  //       break;
  //     case SortType.RATING:
  //       this.#movies.sort(compareMoviesRating);
  //       break;
  //     default:
  //       this.#movies = [...this.#sourcedMovies];
  //   }
  //   this.#currentSortType = sortType;
  // };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    // this.#sortMovies(sortType);
    this.#clearMovies();
    this.#renderMoviesList();
    this.#renderSort();
  };

  #renderSort = (container) => {
    if (!this.#sortComponent) {
      this.#sortComponent = new SortView(this.#currentSortType);
      render(this.#sortComponent, container);
    } else {
      const updatedSortComponent = new SortView(this.#currentSortType);
      replace(updatedSortComponent, this.#sortComponent);
      this.#sortComponent = updatedSortComponent;
    }
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#filmsContainer, this.#handleViewAction, this.#addPopup);
    moviePresenter.init(movie);
    this.#moviePresenters.set(movie.id, moviePresenter);
  };

  #renderFeed = () => {
    this.#renderBaseStructure();
    this.#renderMoviesList();
  };

  #renderBaseStructure = () => {
    render(this.#films, this.#siteElement);
    render(this.#filmsList, this.#films.element);
    render(this.#filmsContainer, this.#filmsList.element);
  };

  #renderMoviesList = () => {
    const moviesCount = this.movies.length;
    console.log(moviesCount);
    const newRenderedMoviesCount =  Math.min(moviesCount, this.#renderMoviesCount + MOVIES_PER_STEP);
    console.log(newRenderedMoviesCount);
    const movies = this.movies.slice(this.#renderMoviesCount, newRenderedMoviesCount);
    this.#renderMovies(movies);
    this.#checkAndRenderEmptyFeed();
    this.#renderloadMoreMoviesComponent();
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
  };

  #checkAndRenderEmptyFeed = () => {
    if (this.movies.length === 0) {
      this.#renderEmptyFeed();
    }
  };

  #renderloadMoreMoviesComponent = () => {
    if (this.movies.length > MOVIES_PER_STEP) {
      render(this.#loadMoreMoviesComponent, this.#siteElement);
      this.#loadMoreMoviesComponent.setClickHandler(this.#onShowMoreButtonClick);
    }
  };

  #onShowMoreButtonClick = () => {
    this.movies
      .slice(this.#renderMoviesCount, this.#renderMoviesCount + MOVIES_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));
    this.#renderMoviesCount += MOVIES_PER_STEP;
    this.#removeShowMoreButton();
  };

  #removeShowMoreButton = () => {
    if (this.#renderMoviesCount >= this.movies.length) {
      this.#loadMoreMoviesComponent.element.remove();
      this.#loadMoreMoviesComponent.removeElement();
    }
  };

  #renderEmptyFeed = () => {
    render(new EmptyFeedView(), this.#films.element);
  };

  #renderMoviePopup = () => {
    if (!this.#popupPresenter) {
      this.#popupPresenter = new PopupPresenter(this.#filmsContainer, this.#removeMoviePopup, this.#handleViewAction);
      this.#popupPresenter.init(this.#currentMovie);
    }
  };

  #addPopup = (movie) => {
    //Если есть текущий фильм и если id текущего фильма строго не равен id фильма, то выполни код ниже.
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
