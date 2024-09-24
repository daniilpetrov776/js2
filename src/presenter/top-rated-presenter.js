import { remove, render } from '../framework/render.js';
import TopRatedView from '../view/top-rated-view.js';
import TopRatedListView from '../view/top-rated-list-view.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { compareMoviesRating } from '../utils/tasks.js';
import { UpdateType, UserAction, TimeLimit, EXTRA_MOVIES_COUNT } from '../utils/const.js';
import MoviePresenter from './movie-presenter.js';

export default class TopRatedPresenter {
  #topRatedComponent = new TopRatedView();
  #topRatedListComponent = new TopRatedListView();

  #container = null;
  #movieModel = null;
  #moviePopup = null;

  #moviePresenters = new Map();

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor (container, movieModel, moviePopup) {
    this.#container = container;
    this.#movieModel = movieModel;
    this.#moviePopup = moviePopup;

    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    return [...this.#movieModel.get()].sort(compareMoviesRating).slice(0, EXTRA_MOVIES_COUNT);
  }

  init = () => {
    this.#renderTopRatedComponent();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        if (this.#moviePresenters.get(update.id)) {
          this.#moviePresenters.get(update.id).setMovieEditing();
        }
        try {
          await this.#movieModel.updateOnServer(updateType, update);
        } catch {
          if (this.#moviePresenters.get(update.id)) {
            this.#moviePresenters.get(update.id).setAborting();
          }
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#moviePresenters.get(data.id)) {
          this.#moviePresenters.get(data.id).init(data);
        }
        break;
    }
  };

  #renderTopRatedList = (container) => {
    render(this.#topRatedComponent, container);
    render(this.#topRatedListComponent, this.#topRatedComponent.element);
  };

  #renderMovies = (movies, container) => {
    movies.forEach((movie) => {
      this.#renderMovie(movie, container);
    });
  };

  #renderMovie(movie, container)  {
    const moviePresenter = new MoviePresenter(
      container,
      this.#handleViewAction,
      this.#moviePopup
    );
    moviePresenter.init(movie);
    this.#moviePresenters.set(movie.id, moviePresenter);
  }

  destroy = () => {
    remove(this.#topRatedComponent);
  };

  #renderTopRatedComponent() {
    const movies = this.movies;

    if (movies.length > 0) {
      this.#renderTopRatedList(this.#container);
      this.#renderMovies(movies, this.#topRatedListComponent);
    }
  }
}
