import { render } from '../render.js';
import FilmView from '../view/film-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import PopupView from '../view/popup-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

const AMOUNT_OF_FILMS_RENDERED = 5;

export default class MovieFeedPresenter {
  films = new FilmsView();
  filmsList = new FilmsListView();
  filmsContainer = new FilmsContainerView();


  init = (siteElement, movieModel) => {
    this.siteElement = siteElement;
    this.movieModel = movieModel;
    this.movies = [...this.movieModel.getMovies()];
    console.log(this.movies)

    render(this.films, siteElement);
    render(this.filmsList, this.films.getElement());
    render(this.filmsContainer, this.filmsList.getElement());

    for (let i = 0; i < AMOUNT_OF_FILMS_RENDERED; i++) {
      render(new FilmView(), this.filmsContainer.getElement());
    }

    render(new ShowMoreButtonView(), siteElement);
    render(new PopupView(), siteElement);
  };
}
