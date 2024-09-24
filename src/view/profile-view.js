import AbstractView from '../framework/view/abstract-view.js';

const createNewProfileTemplate = (rank) => (`<section class="header__profile profile">
   ${(rank) !== null ? `<p class="profile__rating">${rank}</p>` : ''}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
`);

export default class ProfileView extends AbstractView {
  constructor(rank) {
    super();
    this.rank = rank;
  }

  get template() {
    return createNewProfileTemplate(this.rank);
  }
}
