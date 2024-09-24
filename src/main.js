import ProfilePresenter from './presenter/profile-presenter.js';
import MovieFeedPresenter from './presenter/movie-feed-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MovieModel from './model/movie-model.js';
import FilterModel from './model/filter-model.js';
import MoviesApiService from './movies-api-service.js';
import MoviesCountPresenter from './presenter/movies-count-presenter.js';

const AUTHORIZATION = 'Basic dawf3121sfddasd';
const END_POINT = 'https://17.ecmascript.htmlacademy.pro/cinemaddict';

export const siteMainElement = document.querySelector('.main');
export const siteHeaderElement = document.querySelector('.header');
export const siteFooterElement = document.querySelector('.footer');

const movieModel = new MovieModel(new MoviesApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();


const profilePresenter = new ProfilePresenter(siteHeaderElement, movieModel);
const moviesCountPresenter = new MoviesCountPresenter(siteFooterElement, movieModel);
const movieFeedPresenter = new MovieFeedPresenter(siteMainElement, movieModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, movieModel);

profilePresenter.init();
moviesCountPresenter.init();
filterPresenter.init();
movieFeedPresenter.init();
movieModel.init();
