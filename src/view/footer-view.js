import AbstractView from '../framework/view/abstract-view.js';

const createNewFooterTemplate = () => (`<footer class="footer">
  <section class="footer__logo logo logo--smaller">Cinemaddict</section>

</footer>`);

export default class FooterView extends AbstractView {
  get template() {
    return createNewFooterTemplate();
  }
}
