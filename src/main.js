import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import { render } from './render.js';
import PopupView from './view/popup-view.js';
import ProfileView from './view/profile-view.js';
import NavigationPresenter from './presenter/navigation-presenter.js';
import MovieFeedPresenter from './presenter/movie-feed-presenter.js';

export const siteMainElement = document.querySelector('.main');
export const siteHeaderElement = document.querySelector('.header');

const navigationPresenter = new NavigationPresenter();
const movieFeedPresenter = new MovieFeedPresenter();

navigationPresenter.init(siteHeaderElement);
movieFeedPresenter.init(siteMainElement);
