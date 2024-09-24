import {remove, render, replace} from '../framework/render';
import { UpdateType } from '../utils/const';
import MoviesCountView from '../view/footer-movie-count-view';

export default class MoviesCountPresenter {
  #container = null;
  #moviesCountComponent = null;

  #movieModel = null;

  #moviesCount = null;

  constructor(container, movieModel) {
    this.#container = container;
    this.#movieModel = movieModel;

    this.#movieModel.addObserver(this.#modelEventHandler);
  }

  init () {
    this.#moviesCount = this.#movieModel.get().length;


    const prevmoviesCountComponent = this.#moviesCountComponent;

    this.#moviesCountComponent = new MoviesCountView(this.#moviesCount);

    if (prevmoviesCountComponent === null) {
      render(this.#moviesCountComponent, this.#container);
      return;
    }

    replace(this.#moviesCountComponent, prevmoviesCountComponent);
    remove(prevmoviesCountComponent);
  }

  #modelEventHandler = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.init();
    }
  };
}
