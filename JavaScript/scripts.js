/*

                                                              IMPORTS + GLOBAL VARIABLES ↓

*/

import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

// Initialized variables correctly ↓

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
    close: document.querySelector("[data-list-close]"),
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

/*

                                                                INITIAL BOOK LISTS ↓

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

/** `initialPageResults` is an array of the initial 36 `BOOKS_PER_PAGE` from the user's search before they click 'show more'
 * in order to display the initial 36 results to the user.
 */
let initialPageResults = [];

/** Extracts the `initialPageResults` (0 - 36 `BOOKS_PER_PAGE`) before the user clicks 'show more'.
 * @param {object} object - The object that you want to extract the initial results from.
 * @returns {array} - Returns the initial results (0 - 36 `BOOKS_PER_PAGE`).
 */
const extractInitialResults = (object) => {
  initialPageResults = object.slice(0, BOOKS_PER_PAGE);
  return initialPageResults;
};

extractInitialResults(books);

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

/** `page` represents the 'page' that we are on relating to the `BOOKS_PER_PAGE`.
 * This is used for pagination when it comes to the `showMoreHandler`(Show more button).
 * @example If we are on page 1, show the first 36 books.
 * If we are on page 2, show the next 36 books.
 */
let page = 1;

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

data.header.settings.addEventListener("click", (event) => {
  data.settings.overlay.show();
});

data.settings.cancel.addEventListener("click", (event) => {
  data.settings.overlay.close();
});

/*

                                                                SHOW MORE BUTTON ↓    

*/

/** `searchResults` is an array of the matching books from the users search (user can search: title, author, genre). */
let searchResults = [];

/** `remainingPageResults` is an array that stores the remaining books to be displayed when the user clicks the 'show more' button. */
let remainingPageResults = [];

/** Extracts the remaining results to be displayed when the user clicks the 'show more' button.
 * @param {object} object - The object that you want to extract the remaining results from.
 * @returns {array} - Returns the remaining results data to render the book list for it.
 */
const extractRemainingResults = (object) => {
  // Get the starting and ending index for the slicing. This is based on the `page` variable. Every time the user clicks the 'show more' button, the `page` variable increases by 1, therefore we can get the next batch of 36 `BOOKS_PER_PAGE` ↓

  /** `start` holds the starting index for the slicing */
  const start = page * BOOKS_PER_PAGE;

  /** `end` holds the ending index for the slicing */
  const end = (page + 1) * BOOKS_PER_PAGE;

  // Slice the array based on the starting and ending index to get the remaining results ↓

  remainingPageResults = object.slice(start, end);

  // Increment page by 1 so that the next time the user clicks the 'show more' button, the next batch of 36 `BOOKS_PER_PAGE` is displayed ↓

  page++;

  // Return the remaining results so that we can render the book list for it ↓

  return remainingPageResults;
};

/** `showMoreHandler` handles the 'show more' button click event.
 * If the user has used the search feature, the button will work based on the `searchResults` array.
 * If the user has not used the search feature (in other words they are on the website how they initially found it),
 * the button will work based on the original `books` array.
 */
const showMoreHandler = () => {
  // Start the conditional statement ↓

  if (searchResults.length > 0) {
    // Call `extractRemainingResults` to get the remaining results based on the `searchResults` array ↓

    extractRemainingResults(searchResults);

    // Call `renderBookList` to render the remaining results based on the extracted `remainingPageResults` array ↓

    renderBookList(remainingPageResults, searchResultsFragment);

    // Call `updateShowMoreBtn` to update the 'show more' button based on the remaining books of the `searchResults` array ↓

    updateShowMoreBtn(searchResults);
  } else {
    // Call `extractRemainingResults` to get the remaining results based on the `books` array ↓

    extractRemainingResults(books);

    // Call `renderBookList` to render the remaining results based on the extracted `remainingPageResults` array ↓

    renderBookList(remainingPageResults, bookListFragment);

    // Call `updateShowMoreBtn` to update the 'show more' button based on the remaining books of the `books` array ↓

    updateShowMoreBtn(books);
  }
};

/** Show more button event listener */
data.list.button.addEventListener("click", showMoreHandler);

/*

                                                        SEARCH RESULTS FILTERING + DISPLAYING ↓

*/

/** Filters the books based on the user's search form entries.
 * @param {array} books - The array of books to be filtered
 * @param {object} filters - The object containing the user's search form entries
 */
const filterBooks = (books, filters) => {
  /** The below for...of loop loops through the books array and checks to see
   * if the title, author and genre match the user's search form entries.
   * If it matches it pushes the book/data to the `searchResults` array.
   */
  for (let book of books) {
    /** Checks to see if the user's entry in the title field matches any of the book's titles.
     * @returns {boolean} - Returns true or false based on whether the title matches or not.
     */
    let titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());

    /** Checks to see if the user's entry in the author field matches any of the book's authors.
     * @returns {boolean} - Returns true or false based on whether the author matches or not.
     */
    let authorMatch =
      filters.author === "any" || book.author === filters.author;

    /** Checks to see if the user's entry in the genre field matches any of the book's genres.
     * @returns {boolean} - Returns true or false based on whether the genre matches or not.
     */
    let genreMatch = filters.genre === "any";

    /** The below for...of loop loops through every book's genres list
     * and checks to see if it matches the user's entry in the genre field.
     * If it matches it sets `genreMatch` to true.
     */
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
/** Displays error message to user if no results are found. */
const displayIfNoResults = () => {
  searchResults.length < 1
    ? data.list.message.classList.add("list__message_show")
    : data.list.message.classList.remove("list__message_show");
};

/** `searchResultsHandler` handles the search form submission and results event.
 * @param {target} event - The form that the user has clicked on. (See related event listener below)
 */
const searchResultsHandler = (event) => {
  // Prevent the default behaviour of the form so that we can work with the form data ↓
  event.preventDefault();

  // Reset the `page` to 1 so that every time the user searches the pagination does not carry on from a potential previous search ↓

  page = 1;

  // Empty the `searchResults` array so that the user's search results are not appended to a potential previous search ↓

  searchResults.length = 0;

  // Extract form entries and store it in `filters` ↓

  /** Creates an object that contains the data from the form that was submitted */
  const formData = new FormData(event.target);

  /** Creates an object from the form entries */
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

/** Search form submission event listener */
data.search.form.addEventListener("submit", searchResultsHandler);

/** Search button event listener */
data.header.search.addEventListener("click", (event) => {
  data.search.overlay.show();
  data.search.title.focus();
});

/** Search overlay close button event listener */
data.search.cancel.addEventListener("click", (event) => {
  data.search.overlay.close();
});

/*

                                                                    BOOK PREVIEWS ↓

*/

/** `activeBook` holds the data of the unique book that the user has clicked on. */
let activeBook = "";

/** Identifies the `activeBook` the user has clicked on to view the preview.
 * @param {target} event - The event target that the user has clicked on
 */
const identifyBook = (event) => {
  /** `previewId` holds the id of the book that the user has clicked on. */
  let previewId = event.target.closest("[book-id]").getAttribute("book-id");

  /** The below for...of loop loops through each book in the `books` array
   * and checks to see if the id of the book strictly matches the id of the
   * book that was clicked on. If it matches it assigns the `singleBook` to the `activeBook` variable. */
  for (let singleBook of books) {
    if (singleBook.id === previewId) {
      activeBook = singleBook;
    }
  }
};

/** Populates the preview overlay with the `activeBook` data.
 * @param {object} activeBook - The object containing the data of the unique book that the user has clicked on
 */
const populatePreview = (activeBook) => {
  data.list.image.setAttribute("src", activeBook.image);
  data.list.blur.setAttribute("src", activeBook.image);
  data.list.title.innerHTML = activeBook.title;

  data.list.subtitle.innerHTML = `${authors[activeBook.author]} (${new Date(
    activeBook.published
  ).getFullYear()})`;
  data.list.description.innerHTML = activeBook.description;
};

/** Book preview event listener, added to the whole list of books so that we don't need an event listener on each book element */
data.list.items.addEventListener("click", (event) => {
  // Call `identifyBook` to identify the book that was clicked on ↓

  identifyBook(event);

  // Call `populatePreview` to populate the preview with the book that was clicked on ↓

  populatePreview(activeBook);

  // Display the active book preview overlay to the user ↓

  data.list.active.show();
});

/** Preview overlay close button event listener */
data.list.close.addEventListener("click", (event) => {
  data.list.active.close();
});
