/*

                                                              IMPORTS + GLOBAL VARIABLES ↓

*/

import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

// Initialized variables correctly ↓

/** `page` represents the 'page' that we are on relating to the `BOOKS_PER_PAGE`.
 * This is used for pagination.
 * @example If we are on page 1, show the first 36 books.
 * If we are on page 2, show the next 36 books.
 */
let page = 1;
/** `searchResults` is an array of the matching books from the users search
 * (user can search: title, author, genre) */
let searchResults = [];
/** `initialPageResults` is an array of the initial matching books from the users search before they click 'show more' */
let initialPageResults = [];

/*

                                                                DOCUMENT FRAGMENTS ↓

*/

// Initialized fragment variables correctly ↓

/** `searchResultsFragment` holds a document fragment to be used to display the search results */
const searchResultsFragment = document.createDocumentFragment();
/** `bookListFragment` holds a document fragment to be used for the book preview functionality */
const bookListFragment = document.createDocumentFragment();
/** `genreFragment` holds a document fragment that will contain a the list of genres for the genre dropdown list */
const genreFragment = document.createDocumentFragment();
/** `authorFragment` holds a document fragment that will contain the authors for the dropdown list */
const authorFragment = document.createDocumentFragment();

/*

                                                                DOM REFERENCES ↓

*/

// Created an object literal that holds all of our DOM element references ↓

/** `data` contains an object that holds all of the references to necessary DOM elements so that we can easily work
 *  with the DOM elements in the JavaScript file.
 */
const data = {
  list: {
    items: document.querySelector("[data-list-items]"),
    button: document.querySelector("[data-list-button]"),
    message: document.querySelector("[data-list-message]"),
    active: document.querySelector("[data-list-active]"),
    blur: document.querySelector("[data-list-blur]"),
    image: document.querySelector("[data-list-image]"),
    title: document.querySelector("[data-list-title]"),
    subtitle: document.querySelector("[data-list-subtitle]"),
    description: document.querySelector("[data-list-description]"),
  },
  search: {
    overlay: document.querySelector("[data-search-overlay]"),
    form: document.querySelector("[data-search-form]"),
    cancel: document.querySelector("[data-search-cancel]"),
    title: document.querySelector("[data-search-title]"),
    genres: document.querySelector("[data-search-genres]"),
    authors: document.querySelector("[data-search-authors]"),
  },
  settings: {
    overlay: document.querySelector("[data-settings-overlay]"),
    form: document.querySelector("[data-settings-form]"),
    cancel: document.querySelector("[data-settings-cancel]"),
    theme: document.querySelector("[data-settings-theme]"),
  },
  header: {
    search: document.querySelector("[data-header-search]"),
    settings: document.querySelector("[data-header-settings]"),
    help: document.querySelector("[data-header-help]"),
    add: document.querySelector("[data-header-add]"),
    order: document.querySelector("[data-header-order]"),
    grid: document.querySelector("[data-header-grid]"),
    list: document.querySelector("[data-header-list]"),
    title: document.querySelector("[data-header-title]"),
    subtitle: document.querySelector("[data-header-subtitle]"),
  },
};

// Corrected the conditional statement(s) syntax with curly braces ↓

if (!books && !Array.isArray(books)) {
  throw new Error("Source required");
}

// if (!range && range.length < 2) {
//   throw new Error("Range must be an array with two numbers");
// }

/*

                                                              PREVIEW CREATION ↓

*/

// Created the `createBookElement` function ↓

/** `createBookElement` creates the button element for each of our main list of books and then creates the innerHTML of the button
 * using the author, image, title and id parameters (which is passed to it from the below for...of loop that is running
 * through each book) and their related existing css classes.
 * The function then returns the `preview` so that it can be appended to the `bookListFragment`, and then that
 * gets appended to data.list.items (the div element that holds the list of books, 36 `BOOKS_PER_PAGE`)
 */
const createBookElement = ({ author, image, title, id }) => {
  /** `preview` creates/holds a button element for each book which is each books `preview` */
  const preview = document.createElement("button");
  preview.classList = "preview";
  preview.setAttribute("book-id", id);
  preview.innerHTML = /* html */ `
  <img class="preview__image" src="${image}"/>

    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
  </div>`;

  return preview;
};

/** `currentPageBooks` holds the subset of `books` that will be displayed on the current page.
 * 36 `BOOKS_PER_PAGE`.
 */
let currentPageBooks = books.slice(0, BOOKS_PER_PAGE);

//  Corrected the for...of syntax + added variable initialization (It was a mix between the i++ method and the more modern for...of method) ↓

/** `renderBookList` loops through the subset of `currentPageBooks` and then `createBookElement`
 *  for each book for the current page. It then appends the `preview` to the `bookListFragment`.
 */
const renderBookList = (object, fragment) => {
  for (let { author, image, title, id } of object) {
    /** `preview` holds the preview for an individual book, created by the `createBookElement` function */
    const preview = createBookElement({
      author,
      image,
      title,
      id,
    });

    fragment.appendChild(preview);
    data.list.items.appendChild(fragment);
  }
};

// Called `renderBookList` function for the first page load ↓

renderBookList(currentPageBooks, bookListFragment);

// Used `data` to append the `preview` to the list for the first page load ↓

/*

                                                SEARCH DROPDOWN CREATION ↓  

*/

/** `allGenresOpt` creates and holds a new HTML 'option' element for a genre dropdown list.
 * This element is used to create the 'All Genres' option element, which needs to be
 * done separately from the other genres.
 */
const allGenresOpt = document.createElement("option");

allGenresOpt.value = "any";

// Used .textContent to add 'All Genres' text to the dropdown list ↓

allGenresOpt.textContent = "All Genres";

genreFragment.appendChild(allGenresOpt);

/** The below for...of loop loops through each property of the `genres` object.
 *  It then creates an HTML 'option' element for each genre and appends it to the `genreFragment`
 *  which follows on from the 'All Genres' option element.
 *  The element value is set to the id of the genre and the textContent is set to the genre name.
 */
for (let [id, genre] of Object.entries(genres)) {
  /** genreOption creates and holds an HTML 'option' element for our dropdown list
   * that contains the genre id and genre name.
   */
  let genreOption = document.createElement("option");
  genreOption.value = id;
  genreOption.textContent = genre;
  genreFragment.appendChild(genreOption);
}

// Used `data` reference to append the `genreFragment` to the search overlay ↓

data.search.genres.appendChild(genreFragment);

/** `allAuthorsOpt` creates and holds a new HTML 'option' element for an author dropdown list.
 * This element is used to create the 'All Authors' option element, which needs to be
 * done separately from the other authors.
 */
const allAuthorsOpt = document.createElement("option");

allAuthorsOpt.value = "any";
allAuthorsOpt.textContent = "All Authors";

authorFragment.appendChild(allAuthorsOpt);

/** The below for...of loop loops through each property of the `authors` object.
 *  It then creates an HTML option element for each author and appends it to the `authorFragment`
 *  which follows on from the 'All Authors' option element.
 *  The element value is set to the id of the author and the textContent is set to the author name.
 */
for (let [id, author] of Object.entries(authors)) {
  /** authorOption creates and holds an HTML 'option' element for our dropdown list
   * that contains the author id and author name.
   */
  let authorOption = document.createElement("option");
  authorOption.value = id;
  authorOption.textContent = author;
  authorFragment.appendChild(authorOption);
}

// Used `data` reference to append the `authorFragment` to the search overlay ↓

data.search.authors.appendChild(authorFragment);

/*

                                                            THEME SELECTION EVENT ↓

*/

// Initialized day + night variables correctly ↓

/** `day` contains the dark and light colours for the day theme */
const day = {
  dark: "10, 10, 20",
  light: "255, 255, 255",
};

/** `night` contains the dark and light colours for the night theme */
const night = {
  dark: "255, 255, 255",
  light: "10, 10, 20",
};

// Used `data` reference to refer to correct elements in ternary statement and removed redundant ternary ↓

data.settings.theme.value === window.matchMedia &&
window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "night"
  : "day";

// Created the theme selection event listener and handler ↓

/** The below event listener listens for when the user submits the form. The event listener is tied to the form
 * as a whole and not the submit button so it can run when the user clicks the submit button or presses the enter key.
 * When the user submits the form, the event handler prevents the default behaviour of the form so that we can
 * work with the form data. The event handler then checks to see if the theme value is equal to day or night
 * and changes the CSS variables accordingly.
 */
data.settings.form.addEventListener("submit", (event) => {
  event.preventDefault();
  /** `isDay` checks to see if the value of the dropdown list option for the current theme is 'day' or 'night',
   * returning true or false.
   */
  const isDay = data.settings.theme.value === "day";
  /**`isNight` checks to see if the value of the dropdown list option for the current theme is 'day' or 'night',
   * returning true or false.
   */
  const isNight = data.settings.theme.value === "night";

  if (isDay) {
    document.documentElement.style.setProperty("--color-dark", day.dark);
    document.documentElement.style.setProperty("--color-light", day.light);
  } else if (isNight) {
    document.documentElement.style.setProperty("--color-dark", night.dark);
    document.documentElement.style.setProperty("--color-light", night.light);
  }

  data.settings.overlay.close();
});

/*

                                                REMAINING BOOKS FOR SHOW MORE BUTTON AND EVENT ↓

*/

// Created the `remainingBooks` function ↓

/** `remainingBooks` checks to see if the remaining amount of books `isNotZero`.
 * If it is not zero, it updates the remaining amount of books and returns the `remaining` amount of books.
 * If it is zero, it returns 0 and disables the button.
 */
const remainingBooks = (object) => {
  /** `isNotZero` checks if the remaining amount of books is bigger than 0, returning true or false */
  const isNotZero = object.length - [page * BOOKS_PER_PAGE] > 0;

  if (isNotZero) {
    data.list.button.disabled = false;
    /** `remaining` calculates the remaining amount of books */
    const remaining = object.length - [page * BOOKS_PER_PAGE];

    return remaining;
  } else {
    data.list.button.disabled = true;
    return 0;
  }
};

// Used `data` references, added backticks for interpolation, removed square brackets and redundant code, made it into a function ↓

/** `updateShowMoreBtn` updates the 'show more' button visually depending on the `remainingBooks` */
const updateShowMoreBtn = (object) => {
  data.list.button.innerHTML =
    /* html */
    `<span>Show more</span>
      <span class="list__remaining"> (${remainingBooks(object)})</span>`;
};

// Called the `updateShowMoreBtn` to update the 'show more' for the initial page load ↓

updateShowMoreBtn(books);

/*

                                                              BASIC TOGGLE EVENTS ↓

*/

// Created event listeners and handlers for the toggling of overlays ↓

data.header.search.addEventListener("click", (event) => {
  data.search.overlay.show();
  data.search.title.focus();
});

data.search.cancel.addEventListener("click", (event) => {
  data.search.overlay.close();
});

data.header.settings.addEventListener("click", (event) => {
  data.settings.overlay.show();
});

data.settings.cancel.addEventListener("click", (event) => {
  data.settings.overlay.close();
});

/*

                                                                SHOW MORE BUTTON ↓    

*/

// Created the event listener and handler for the 'show more' button ↓

/** `showMoreHandler` handles the 'show more' button click event.
 * It calculates the `start` and `end` of the next page of books,
 * extracts it from `books` and calls the `renderBookList` which `createBookElement`
 * for each book for the current page. It then appends the `preview` to the `bookListFragment`
 * and then appends that to the list of books to update the UI.
 *  It then increments `page` by 1 for the next page and calls `updateShowMoreBtn` to update the 'show more' button.
 */
const showMoreHandler = (event) => {
  /** `start` holds the starting index for the `books` slicing */
  const start = page * BOOKS_PER_PAGE;
  /** `end` holds the ending index for the `books` slicing */
  const end = (page + 1) * BOOKS_PER_PAGE;

  if (searchResults.length > 0) {
    let currentPageResults = searchResults.slice(start, end);

    renderBookList(currentPageResults, searchResultsFragment);

    page++;

    updateShowMoreBtn(searchResults);
  } else {
    currentPageBooks = books.slice(start, end);

    renderBookList(currentPageBooks, bookListFragment);

    page++;

    updateShowMoreBtn(books);
  }
};

data.list.button.addEventListener("click", showMoreHandler);

/*

                                                        SEARCH RESULTS FILTERING + DISPLAYING ↓

*/

/** Filters the books based on the user's search form entries
 * @param {array} books - The array of books to be filtered
 * @param {object} filters - The object containing the user's search form entries
 */
const filterBooks = (books, filters) => {
  for (let book of books) {
    let titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());

    let authorMatch =
      filters.author === "any" || book.author === filters.author;

    let genreMatch = filters.genre === "any";

    for (let singleGenre of book.genres) {
      if (singleGenre === filters.genre) {
        genreMatch = true;
      }
    }

    if (titleMatch && authorMatch && genreMatch) {
      searchResults.push(book);
    }
  }
};
/** Displays error message to user if no results are found */
const displayIfNoResults = () => {
  searchResults.length < 1
    ? data.list.message.classList.add("list__message_show")
    : data.list.message.classList.remove("list__message_show");
};

/** Extracts the initial page load results (0 - 36 `BOOKS_PER_PAGE`) before the user clicks 'show more' */
const extractInitialResults = () => {
  let page = 0;
  const start = page * BOOKS_PER_PAGE;
  const end = (page + 1) * BOOKS_PER_PAGE;

  initialPageResults = searchResults.slice(start, end);
  return initialPageResults;
};

const searchResultsHandler = (event) => {
  // Prevent the default behaviour of the form so that we can work with the form data ↓
  event.preventDefault();

  // Reset page to 0 and empty searchResults so that the search results are not appended to the previous search results, and so that the `page` is reset to 0 for the new search results ↓

  page = 1;
  searchResults.length = 0;

  // Extract form entries and store it in `filters` ↓

  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);

  // Call `filterBooks` to filter the books based on the user's search form entries ↓

  filterBooks(books, filters);

  // Call `displayIfNoResults` to display error message if no results are found ↓

  displayIfNoResults();

  // Empty the initial list so that the search results can be displayed ↓

  data.list.items.innerHTML = "";

  // Call `extractInitialResults` to get the initial 36 results ↓

  extractInitialResults(searchResults);

  // Call `renderBookList` to render the initial page load results ↓

  renderBookList(initialPageResults, searchResultsFragment);

  // Call `updateShowMoreBtn` to update the 'show more' button based on the search results ↓

  updateShowMoreBtn(searchResults);

  // Close the search overlay and scroll to the top of the page ↓

  data.search.overlay.close();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

data.search.form.addEventListener("submit", searchResultsHandler);

data.list.items.addEventListener("click", (event) => {
    
});

data-list-items.click() {
    pathArray = Array.from(event.path || event.composedPath())
    active;

    for (node; pathArray; i++) {
        if active break;
        const previewId = node?.dataset?.preview

        for (const singleBook of books) {
            if (singleBook.id === id) active = singleBook
        }
    }

    if !active return
    data-list-active.open === true
    data-list-blur + data-list-image === active.image
    data-list-title === active.title

    data-list-subtitle === '${authors[active.author]} (${Date(active.published).year})'
    data-list-description === active.description
}


