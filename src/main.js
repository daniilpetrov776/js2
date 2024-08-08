import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import { render } from './render.js';
import ProfileView from './view/profile-view.js';
import MovieFeedPresenter from './presenter/movie-feed-presenter.js';
import './mock/mock.js';
import MovieModel from './model/movie-model.js';
export const siteMainElement = document.querySelector('.main');
export const siteHeaderElement = document.querySelector('.header');


const movieModel = new MovieModel().getMovies;
const movieFeedPresenter = new MovieFeedPresenter();

render(new ProfileView(), siteHeaderElement);
render(new FilterView(), siteMainElement);
render(new SortView(), siteMainElement);
console.log(new movieModel());
movieFeedPresenter.init(siteMainElement, movieModel);
