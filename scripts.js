// Import the book data, authors, genres, and the number of books per page
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Defining a class to represent a book
class Book {
  constructor(id, title, author, description, published, image, genres) {
    this.id = id; // Unique identifier for the book
    this.title = title; // Title of the book
    this.author = author; // Author ID of the book
    this.description = description; // Description of the book
    this.published = published; // Publication date of the book
    this.image = image; // URL of the book cover image
    this.genres = genres; // Array of genre IDs associated with the book
  }
}

// Creating an array of Book objects from the provided book data
const bookObjects = books.map(
  ({ id, title, author, description, published, image, genres }) =>
    new Book(id, title, author, description, published, image, genres)
);

// Creating an array of author objects from the provided author data
const authorObjects = Object.entries(authors).map(([id, name]) => ({ id, name }));

// Creating an array of genre objects from the provided genre data
const genreObjects = Object.entries(genres).map(([id, name]) => ({ id, name }));

// Function to render a book preview element
function renderBookPreview(book) {
  const element = document.createElement('button');
  element.classList.add('preview');
  element.setAttribute('data-preview', book.id);

  element.innerHTML = `
    <img class="preview__image" src="${book.image}" />
    <div class="preview__info">
      <h3 class="preview__title">${book.title}</h3>
      <div class="preview__author">${authors[book.author]}</div>
    </div>
  `;

  return element;
}

// Function to render a list of book previews in a container
function renderBookList(bookList, container) {
  const fragment = document.createDocumentFragment();

  for (const book of bookList) {
    fragment.appendChild(renderBookPreview(book));
  }

  container.appendChild(fragment);
}

// Function to render a set of options (e.g., genres or authors) in a select element
function renderFilterOptions(options, container, defaultLabel) {
  const fragment = document.createDocumentFragment();

  const defaultOption = document.createElement('option');
  defaultOption.value = 'any';
  defaultOption.innerText = defaultLabel;
  fragment.appendChild(defaultOption);

  for (const option of options) {
    const element = document.createElement('option');
    element.value = option.id;
    element.innerText = option.name;
    fragment.appendChild(element);
  }

  container.appendChild(fragment);
}

// Initialize the book list and filter options
let page = 1; // Current page number for pagination
let matches = bookObjects; // Array of books to be displayed (initially all books)

const listContainer = document.querySelector('[data-list-items]'); // Container for book list
const genreFilter = document.querySelector('[data-search-genres]'); // Genre filter select element
const authorFilter = document.querySelector('[data-search-authors]'); // Author filter select element

// Render the initial book list and filter options  y calling the function
renderBookList(matches.slice(0, BOOKS_PER_PAGE), listContainer);
renderFilterOptions(genreObjects, genreFilter, 'All Genres');
renderFilterOptions(authorObjects, authorFilter, 'All Authors');

// Set the initial theme based on the user's preferences
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.querySelector('[data-settings-theme]').value = 'night';
  document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
  document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
  document.querySelector('[data-settings-theme]').value = 'day';
  document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
  document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

// Update the "Show more" button text and disabled state
document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
document.querySelector('[data-list-button]').disabled = matches.length - page * BOOKS_PER_PAGE > 0;

document.querySelector('[data-list-button]').innerHTML = `
  <span>Show more</span>
  <span class="list__remaining"> (${matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0})</span>
`;

// Event listener for closing the search overlay
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
  document.querySelector('[data-search-overlay]').open = false;
});

// Event listener for closing the settings overlay
document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
  document.querySelector('[data-settings-overlay]').open = false;
});

// Event listener for opening the search overlay
document.querySelector('[data-header-search]').addEventListener('click', () => {
  document.querySelector('[data-search-overlay]').open = true;
  document.querySelector('[data-search-title]').focus();
});

// Event listener for opening the settings overlay
document.querySelector('[data-header-settings]').addEventListener('click', () => {
  document.querySelector('[data-settings-overlay]').open = true;
});

// Event listener for closing the book preview overlay
document.querySelector('[data-list-close]').addEventListener('click', () => {
  document.querySelector('[data-list-active]').open = false;
});

// Event listener for submitting the settings form
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  if (theme === 'night') {
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
  } else {
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
  }

  document.querySelector('[data-settings-overlay]').open = false;
});

// Event listener for submitting the search form
document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of bookObjects) {
    let genreMatch = filters.genre === 'any';

    for (const singleGenre of book.genres) {
      if (genreMatch) break;
      if (singleGenre === filters.genre) {
        genreMatch = true;
    }
}

    if (
      (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.author === 'any' || book.author === filters.author) &&
      genreMatch
    ) {
      result.push(book);
    }
  }

// Resetting the page number to 1
page = 1;

// Updating the list of matched books with the filtered result
matches = result;

// Showing or hiding a message based on whether there are any matching books
if (result.length < 1) {
    // If no matching books, add a class to show the message
    document.querySelector('[data-list-message]').classList.add('list__message_show');
} else {
    // If there are matching books, remove the class to hide the message
    document.querySelector('[data-list-message]').classList.remove('list__message_show');
}

// Clearing the existing list of book items
document.querySelector('[data-list-items]').innerHTML = '';
// Creating a document fragment to store the new book items
const newItems = document.createDocumentFragment();

// Looping through the first page of filtered books and creating buttons for each
for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
    // Creating a button element for each book
    const element = document.createElement('button');
    element.classList = 'preview'; // Adding class for styling
    element.setAttribute('data-preview', id); // Adding data attribute for book ID

    // Adding HTML content to the button element
    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;

    // Appending the button element to the document fragment
    newItems.appendChild(element);
}

// Appending the new list of book items to the DOM
document.querySelector('[data-list-items]').appendChild(newItems);

// Disabling or enabling the "Show more" button based on remaining books
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1;

// Updating the "Show more" button text to display remaining books count
document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`;

// Smooth scrolling to the top of the page
window.scrollTo({top: 0, behavior: 'smooth'});

// Closing the search overlay
document.querySelector('[data-search-overlay]').open = false;
})

// Event listener for the "Show more" button to load additional books
document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment(); // Create a document fragment to store new book previews

    // Loop through the next page of books and create buttons for each
    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button'); // Create a button element
        element.classList = 'preview'; // Add class for styling
        element.setAttribute('data-preview', id); // Add data attribute for book ID

        // Add HTML content to the button element
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

        fragment.appendChild(element); // Append the button element to the document fragment
    }

    document.querySelector('[data-list-items]').appendChild(fragment); // Append the new book previews to the DOM
    page += 1; // Increment the page number
});

// Event listener for clicking on individual book previews to display more details
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath()); // Get the event path array
    let active = null; // Initialize a variable to store the active book

    // Loop through the event path array to find the clicked book preview
    for (const node of pathArray) {
        if (active) break; // If active book is found, exit the loop

        // Check if the clicked element has a dataset containing book ID
        if (node?.dataset?.preview) {
            let result = null; // Initialize a variable to store the book matching the ID
    
            // Loop through the books array to find the book with the matching ID
            for (const singleBook of books) {
                if (result) break; // If result is found, exit the loop
                if (singleBook.id === node?.dataset?.preview) result = singleBook; // If IDs match, assign the book to result
            } 
        
            active = result; // Assign the found book to the active variable
        }
    }
    
    // If an active book is found, display its details
    if (active) {
        document.querySelector('[data-list-active]').open = true; // Open the active book overlay
        document.querySelector('[data-list-blur]').src = active.image; // Set the book cover image
        document.querySelector('[data-list-image]').src = active.image; // Set the book image
        document.querySelector('[data-list-title]').innerText = active.title; // Set the book title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`; // Set the book author and publication year
        document.querySelector('[data-list-description]').innerText = active.description; // Set the book description
    }
});
