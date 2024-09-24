import Observable from '../framework/observable';
import { FilterType } from '../utils/const';

export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get () {
    return this.#filter;
  }

  set = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  };
}
