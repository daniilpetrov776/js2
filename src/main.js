import { render } from './framework/render.js';
import ProfileView from './view/profile-view.js';
import MoviesCountView from './view/footer-movie-count-view.js';
import MovieFeedPresenter from './presenter/movie-feed-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import './mock/mock.js';
import MovieModel from './model/movie-model.js';
import FilterModel from './model/filter-model.js';
import { calculateWatchedMovies, getUserRank } from './utils/user.js';

export const siteMainElement = document.querySelector('.main');
export const siteHeaderElement = document.querySelector('.header');
export const siteFooterElement = document.querySelector('.footer');

const movieModel = new MovieModel();
const filterModel = new FilterModel();
const movieFeedPresenter = new MovieFeedPresenter(siteMainElement, movieModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, movieModel);
const watchedMovies = calculateWatchedMovies(movieModel.get());
const userRank = getUserRank(watchedMovies);
// const filters = generateFilter(movieModel.get());
// console.log(filters);
// console.log(filters.at(1).count);
render(new ProfileView(userRank), siteHeaderElement);
// render(new FilterView(filters, 'all'), siteMainElement);
render(new MoviesCountView(movieModel.get()), siteFooterElement);
filterPresenter.init();
movieFeedPresenter.init();
