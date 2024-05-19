class DataSearch extends HTMLElement {
    constructor() {
      super();
  
      const template = document.createElement('template');
      template.innerHTML = `
      <link rel="stylesheet" href="./styles.css" />
      <dialog class="overlay" data-search-overlay>
      <div class="overlay__content">
        <form class="overlay__form" data-search-form id="search">
          <label class="overlay__field">
            <div class="overlay__label">Title</div>
            <input class="overlay__input" data-search-title name="title" placeholder="Any"></input>
          </label>

          <label class="overlay__field">
            <div class="overlay__label">Genre</div>
            <select class="overlay__input overlay__input_select" data-search-genres name="genre"></select>
          </label>

          <label class="overlay__field">
            <div class="overlay__label">Author</div>
            <select class="overlay__input overlay__input_select" data-search-authors name="author">
            </select>
          </label>
        </form>

        <div class="overlay__row">
          <button class="overlay__button" data-search-cancel>Cancel</button>
          <button class="overlay__button overlay__button_primary" type="submit" form="search">Search</button>
        </div>
      </div>
    </dialog>
      `;
  
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
  
      this.dialog = shadowRoot.querySelector('.data-search-overlay');
      this.backdrop = shadowRoot.querySelector('.data-search-backdrop');
      this.dataListBlur = shadowRoot.querySelector('[data-input-blur]');
      this.dataListImage = shadowRoot.querySelector('[data-search-cancel]');
  
  
      const closeButton = shadowRoot.querySelector('[data-list-cancel]');
      if (closeButton) {
        closeButton.addEventListener('click', () => this.close());
      }
    }
  
    open() {
      this.dialog.showModal();
      this.backdrop.style.display = 'block';
    }
  
    close() {
      this.dialog.close();
      this.backdrop.style.display = 'none';
    }
  }
  
  customElements.define('data-search', DataSearch);
  
  export default DataSearch;