import { render } from '../framework/render.js';
import FilmView from '../view/film-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import PopupView from '../view/popup-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFeedView from '../view/empty-feed-view.js';
import CommentView from '../view/comment-view.js';
import PopupCommentContainerView from '../view/popup-comment-container-view.js';
import { isEscapeKey } from '../utils/utils.js';

const MOVIES_PER_STEP = 5;
export default class MovieFeedPresenter {
  #films = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsContainer = new FilmsContainerView();
  #loadMoreMoviesComponent = new ShowMoreButtonView();
  #siteElement = null;
  #movieModel = null;
  #popupComponent = null;
  #commentContainer = new PopupCommentContainerView();
  #commentComponent = null;

  #movies = [];
  #comments = [];
  #renderMoviesCount = MOVIES_PER_STEP;

  constructor (siteElement, movieModel) {
    this.#siteElement = siteElement;
    this.#movieModel = movieModel;
  }

  init = () => {
    this.#movies = [...this.#movieModel.get()];
    this.#renderFeed();
  };

  #renderFeed = () => {
    render(this.#films, this.#siteElement);
    render(this.#filmsList, this.#films.element);
    render(this.#filmsContainer, this.#filmsList.element);

    for (let i = 0; i < Math.min(this.#movies.length, MOVIES_PER_STEP); i++) {
      this.#renderMovie(this.#movies[i]);
    }

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

  #renderMovie = (movie) => {
    const movieComponent = new FilmView(movie);
    render(movieComponent, this.#filmsContainer.element);

    movieComponent.setMovieClickHandler(() => this.#renderMoviePopup(movie));
  };

  #renderMoviePopup = (movie) => {
    const closePopup = () => {
      if (this.#popupComponent) {
        this.#popupComponent.element.remove();
        document.body.classList.remove('hide-overflow');
        this.#popupComponent = null;
      }
    };

    const onEscKeydown = (evt) => {
      if (isEscapeKey(evt) && this.#popupComponent) {
        closePopup();
        document.removeEventListener('keydown', onEscKeydown);
      }
    };

    const onCloseButtonClick = () => {
      closePopup();
      document.removeEventListener('keydown', onEscKeydown);
    };

    const renderComment = () => {
      this.#comments = movie.comments;
      // console.log(this.#comments)
      // console.log(this.#commentComponent)
      // console.log(this.#popupComponent.element instanceof HTMLElement)

      for (let i = 0; i < this.#comments.length; i++) {
        this.#commentComponent = new CommentView(this.#comments[i]);
        render(this.#commentComponent, this.#popupComponent.element);
      }
    };

    const renderPopup = () => {
      if (!this.#popupComponent) {
        this.#popupComponent = new PopupView(movie);

      }
      render(this.#popupComponent,this.#filmsContainer.element);
      document.body.classList.add('hide-overflow');
      this.#popupComponent.setPopupClickHandler(() => {
        onCloseButtonClick();
      });
      document.addEventListener('keydown', onEscKeydown);
    };

    renderPopup();
    renderComment();
  };
}
