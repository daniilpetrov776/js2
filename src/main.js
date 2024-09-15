import { render } from './framework/render.js';
import ProfileView from './view/profile-view.js';
import MoviesCountView from './view/footer-movie-count-view.js';
import MovieFeedPresenter from './presenter/movie-feed-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import './mock/mock.js';
import MovieModel from './model/movie-model.js';
import FilterModel from './model/filter-model.js';
import { calculateWatchedMovies, getUserRank } from './utils/user.js';
import MoviesApiService from './movies-api-service.js';

const AUTHORIZATION = 'Basic dawf3121sfddasd';
const END_POINT = 'https://17.ecmascript.htmlacademy.pro/cinemaddict';

export const siteMainElement = document.querySelector('.main');
export const siteHeaderElement = document.querySelector('.header');
export const siteFooterElement = document.querySelector('.footer');

const movieModel = new MovieModel(new MoviesApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const movieFeedPresenter = new MovieFeedPresenter(siteMainElement, movieModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, movieModel);
const watchedMovies = calculateWatchedMovies(movieModel.get());
const userRank = getUserRank(watchedMovies);

render(new ProfileView(userRank), siteHeaderElement);
render(new MoviesCountView(movieModel.get()), siteFooterElement);

filterPresenter.init();
movieFeedPresenter.init();
