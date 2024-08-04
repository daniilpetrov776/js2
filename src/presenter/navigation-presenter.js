import { render } from '../render.js';
import ProfileView from '../view/profile-view.js';

export default class NavigationPresenter {
  init = (siteElement) => {
    this.siteElement = siteElement;

    render(new ProfileView(), siteElement);
  };
}
