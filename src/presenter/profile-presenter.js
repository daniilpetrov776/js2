import {remove, render, replace} from '../framework/render';
import { getUserRank } from '../utils/user';
import ProfileView from '../view/profile-view.js';

export default class ProfilePresenter {
  #container = null;
  #porfileComponent = null;

  #moveModel = null;
  #userRank = null;

  constructor(container, movieModel) {
    this.#container = container;
    this.#moveModel = movieModel;

    this.#moveModel.addObserver(this.#modeEventHandler);
  }

  init ()  {
    this.#userRank = getUserRank(this.#moveModel.get());

    const prevProfileComponent = this.#porfileComponent;

    this.#porfileComponent = new ProfileView(this.#userRank);

    if (prevProfileComponent === null) {
      render(this.#porfileComponent, this.#container);
      return;
    }

    replace(this.#porfileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  }

  #modeEventHandler = () => {
    this.init();
  };
}
