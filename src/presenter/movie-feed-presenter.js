import { remove, render } from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import {filter} from '../utils/filter.js';
import FilmsListView from '../view/films-list-view.js';
import SortView from '../view/sort-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFeedView from '../view/empty-feed-view.js';
import LoadingView from '../view/loading-view.js';
import TopRatedView from '../view/top-rated-view.js';
import MostCommentedView from '../view/most-commented-view.js';
import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { FilterType, SortType, UpdateType, UserAction } from '../utils/const.js';
import { sortByNewest, compareMoviesRating, isEveryRatingSame, getTwoRandomMovies } from '../utils/tasks.js';

const MOVIES_PER_STEP = 5;

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class MovieFeedPresenter {
  #films = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsContainer = new FilmsContainerView();
  #loadingComponent = new LoadingView();
  #topRatedComponent = new TopRatedView();
  #mostCommentedComponent = new MostCommentedView();
  #loadMoreMoviesComponent = null;
  #sortComponent = null;
  #popupPresenter = null;
  #siteElement = null;
  #emptyFeedComponent = null;
  #movieModel = null;
  #currentMovie = null;
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL;
  #filterModel = null;

  #renderMoviesCount = MOVIES_PER_STEP;
  #moviePresenters = new Map();
  #isLoading = true;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor (siteElement, movieModel, filterModel) {
    this.#siteElement = siteElement;
    this.#movieModel = movieModel;
    this.#filterModel = filterModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    this.#currentFilterType = this.#filterModel.get();

    const movies = this.#movieModel.get();

    const filteredmovies = filter[this.#currentFilterType](movies);
    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredmovies.sort(sortByNewest);
      case SortType.RATING:
        return filteredmovies.sort(compareMoviesRating);
    }
    return filteredmovies;
  }

  init = () => {
    this.#renderFeed();
  };

  #renderTopRatedComponent = () => {
    const movies = this.movies;

    const getTopRatedMovies = () => {
      const sortedTopRatedMovies = movies.sort(compareMoviesRating);
      if (isEveryRatingSame(sortedTopRatedMovies)) {
        console.log(getTwoRandomMovies(movies))
        console.log('все рейтинги одинаковы')
          // рендер двух случайных фильмов
      }
      // рендер лучшего фильма
      this.#renderMovie(sortedTopRatedMovies[0], this.#topRatedComponent);
      console.log('Рейтинги разные')
    };
    return getTopRatedMovies()
  };

  #handleViewAction = async (actionType, updateType, update, updateComment) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        if (
          this.#moviePresenters.get(update.id) &&
          !this.#popupPresenter
        ) {
          this.#moviePresenters.get(update.id).setMovieEditing();
        }

        if (this.#popupPresenter) {
          this.#popupPresenter.setMovieEditing();
        }
        try {
          await this.#movieModel.updateOnServer(updateType, update);
        } catch {
          if (
            this.#moviePresenters.get(update.id) &&
            !this.#popupPresenter
          ) {
            this.#moviePresenters.get(update.id).setAborting();
          }

          if (this.#popupPresenter) {
            this.#popupPresenter.setAborting({actionType});
          }
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#popupPresenter.setCommentCreation();
        try {
          await this.#movieModel.addMovieComment(updateType, update, updateComment);
          this.#popupPresenter.clearMovieData();
        } catch {
          this.#popupPresenter.setAborting({actionType});
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#popupPresenter.setCommentDeleting(updateComment.id);
        try {
          await this.#movieModel.deleteMovieComment(updateType, update, updateComment);
        } catch {
          this.#popupPresenter.setAborting({actionType, commentId: updateComment.id});
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

        if (this.#popupPresenter && this.#currentMovie.id === data.id) {
          this.#currentMovie = data;
          this.#renderMoviePopup();
        }
        if (this.#filterModel.get() !== FilterType.ALL) {
          this.#handleModelEvent(UpdateType.MINOR);
        }
        break;

      case UpdateType.MINOR:
        this.#clearMovies();
        this.#renderFeed();
        break;
      case UpdateType.MAJOR:
        this.#clearMovies({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFeed();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFeed();
        break;
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsList.element);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearMovies({resetRenderedMoviesCount: true});
    this.#renderFeed();
  };

  #renderSort = () => {
    if (this.movies.length > 0) {
      this.#sortComponent = new SortView(this.#currentSortType);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
      render(this.#sortComponent, this.#siteElement);
    }
  };

  #renderMovie = (movie, movieContainer = this.#filmsContainer) => {
    const moviePresenter = new MoviePresenter(movieContainer, this.#handleViewAction, this.#addPopup);
    moviePresenter.init(movie);
    this.#moviePresenters.set(movie.id, moviePresenter);
  };

  #renderFeed = () => {
    const movies = this.movies;
    const moviesCount = movies.length;
    this.#renderMoviesCount = MOVIES_PER_STEP;

    this.#renderSort(this.#siteElement);

    render(this.#films, this.#siteElement);
    render(this.#filmsList, this.#films.element);
    render(this.#filmsContainer, this.#filmsList.element);
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#checkAndRenderEmptyFeed();

    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderMoviesCount)));
    if (moviesCount > this.#renderMoviesCount) {
      this.#renderloadMoreMoviesComponent();
    }
    render(this.#topRatedComponent, this.#filmsList.element);
    this.#renderTopRatedComponent();
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
      this.#loadMoreMoviesComponent = new ShowMoreButtonView();
      this.#loadMoreMoviesComponent.setClickHandler(this.#onShowMoreButtonClick);
      render(this.#loadMoreMoviesComponent, this.#filmsList.element);
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
    this.#emptyFeedComponent = new EmptyFeedView(this.#currentFilterType);
    render(this.#emptyFeedComponent, this.#films.element);
  };

  #renderMoviePopup = async () => {
    const comments = await this.#movieModel.getCurrentcomments(this.#currentMovie);
    const isCommentsLoadingError = !comments;
    if (!this.#popupPresenter) {
      this.#popupPresenter = new PopupPresenter(
        this.#filmsContainer,
        this.#removeMoviePopup,
        this.#handleViewAction,
      );
    }
    if (!isCommentsLoadingError) {
      document.addEventListener('keydown', this.#onCtrlEnterDown);
    }

    this.#popupPresenter.init(this.#currentMovie, comments, isCommentsLoadingError);
  };

  #addPopup = (movie) => {
    //Если есть текущий фильм и если id текущего фильма строго не равен id фильма, то выполни код ниже.
    if (this.#currentMovie?.id === movie.id) {
      return;
    }

    if (this.#currentMovie?.id !== movie.id) {
      this.#removeMoviePopup();
    }

    this.#currentMovie = movie;
    this.#renderMoviePopup();
    document.body.classList.add('hide-overflow');
  };

  #removeMoviePopup = () => {
    if (this.#popupPresenter) {
      document.removeEventListener('keydown', this.#onCtrlEnterDown);
      this.#popupPresenter.destroy();
      this.#popupPresenter = null;
      this.#currentMovie = null;
      document.body.classList.remove('hide-overflow');
    }
  };

  #onCtrlEnterDown = (evt) => {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this.#popupPresenter.createComment();
    }
  };

  #clearMovies = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    this.#moviePresenters.forEach((presenter) => presenter.destroy());
    this.#moviePresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#loadMoreMoviesComponent);

    if (this.#emptyFeedComponent) {
      remove(this.#emptyFeedComponent);
    }
    if (resetRenderedMoviesCount) {
      this.#renderMoviesCount = MOVIES_PER_STEP;
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
