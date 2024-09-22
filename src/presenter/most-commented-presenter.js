import { render } from '../framework/render.js';
import MostCommentedView from '../view/most-commented-list-view.js';
import MostCommentedListView from '../view/most-commented-list-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { compareMoviesRating, isEveryRatingSame, getTwoRandomMovies, compareMoviesComments, isEveryCommentsLengthSame } from '../utils/tasks.js'
import { UpdateType, UserAction, TimeLimit, EXTRA_MOVIES_COUNT } from '../utils/const.js';
import MoviePresenter from './movie-presenter.js';

export default class MostCommentedPresenter {
  #mostCommentedComponent = new MostCommentedView();
  #mostCommentedListComponent = new MostCommentedListView();

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
    return [...this.#movieModel.get()].sort(compareMoviesComments).slice(0, EXTRA_MOVIES_COUNT);
  }

  init = () => {
    this.#renderMostCommentedComponent();
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
      case UpdateType.EXTRA:
        console.log(updateType)
        this.#moviePresenters.forEach((presenter) => presenter.destroy());
        this.#moviePresenters.clear();
        console.log(this.movies)
        this.#renderMovies(this.movies, this.#mostCommentedListComponent);
        // РЕНДЕР ФИЛЬМОВ
    }
  };

  #renderMostCommentedList = (container) => {
    render(this.#mostCommentedComponent, container);
    render(this.#mostCommentedListComponent, this.#mostCommentedComponent.element);
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

  #renderMostCommentedComponent() {
    const movies = this.movies;

    if (movies.length > 0) {
      this.#renderMostCommentedList(this.#container);
      this.#renderMovies(movies, this.#mostCommentedListComponent);
    }
  }
}
