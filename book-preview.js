//book-preview.js
import { authors } from './data.js'; 
// Define a new Web Component class called 'BookPreview'
class BookPreview extends HTMLElement {
    constructor() {
      super(); // Call the constructor of the parent class (HTMLElement)
  
      // Create a shadow root for the component
      // This allows the component to have its own encapsulated DOM tree
      this.attachShadow({ mode: 'open' });
    }
  
    // Define the attributes that the component should observe for changes
    static get observedAttributes() {
      return ['book'];
    }
  
    // This method is called when an observed attribute (book) changes
    attributeChangedCallback(name, oldValue, newValue) {
      // Check if the 'book' attribute has changed and has a new value
      if (name === 'book' && newValue) {
        // Parse the JSON string from the 'book' attribute
        this.renderPreview(JSON.parse(newValue));
      }
    }
  
    // Method to render the book preview
    renderPreview(book) {
      const { id, title, author, image } = book; // Destructure the book object
  
      // HTML template for the book preview
      const previewTemplate = `
     
    
        <style>
        .preview {
            border-width: 0;
            width: 100%;
            font-family: Roboto, sans-serif;
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            cursor: pointer;
            text-align: left;
            border-radius: 8px;
            border: 1px solid rgba(var(--color-dark), 0.15);
            background: rgba(var(--color-light), 1);
          }
          
          @media (min-width: 60rem) {
            .preview {
              padding: 1rem;
            }
          }
          
          .preview_hidden {
            display: none;
          }
          
          .preview:hover {
            background: rgba(var(--color-blue), 0.05);
          }
          
          .preview__image {
            width: 48px;
            height: 70px;
            object-fit: cover;
            background: grey;
            border-radius: 2px;
            box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
          }
          
          .preview__info {
            padding: 1rem;
          }
          
          .preview__title {
            margin: 0 0 0.5rem;
            font-weight: bold;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            color: rgba(var(--color-dark), 0.8)
          }
          
          .preview__author {
            color: rgba(var(--color-dark), 0.4);
          }
                    
                  </style>
  
                  <button class="preview" data-preview="${id}">
                  <img class="preview__image" src="${image}" alt="${title}">
                  <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                  </div>
                </button>      `;
  
      // Inject the HTML template into the shadow root
      this.shadowRoot.innerHTML = previewTemplate;
    }
  }
  
  // Define the Web Component and register it with the browser
  customElements.define('book-preview', BookPreview);