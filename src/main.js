import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import { render } from './framework/render.js';
import ProfileView from './view/profile-view.js';
import MoviesCountView from './view/footer-movie-count-view.js';
import MovieFeedPresenter from './presenter/movie-feed-presenter.js';
import './mock/mock.js';
import MovieModel from './model/movie-model.js';

export const siteMainElement = document.querySelector('.main');
export const siteHeaderElement = document.querySelector('.header');
export const siteFooterElement = document.querySelector('.footer');


const movieModel = new MovieModel();
const movieFeedPresenter = new MovieFeedPresenter(siteMainElement, movieModel);

render(new ProfileView(), siteHeaderElement);
render(new FilterView(), siteMainElement);
render(new SortView(), siteMainElement);
render(new MoviesCountView(movieModel.get()), siteFooterElement);
movieFeedPresenter.init();
