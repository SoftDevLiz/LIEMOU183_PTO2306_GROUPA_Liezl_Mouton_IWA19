/*

                                                        IMPORTS/GLOBAL VARIABLE BOOKS_PER_PAGE ↓

*/

import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

/*

                                                                  DOCUMENT FRAGMENTS ↓

*/

// Created document fragments so we can work with them throughout the file ↓

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

// Create the `initialPageResults` variable to hold the 36 books for the initial page load ↓

/** `initialPageResults` is an array of the initial 36 `BOOKS_PER_PAGE` from the user's search before they click 'show more'
 * in order to display the initial 36 results to the user.
 */
let initialPageResults = [];

/** Extracts the `initialPageResults` (0 - 36 `BOOKS_PER_PAGE`) before the user clicks 'show more'.
 * @param {object} object - The object that you want to extract the initial results from.
 * @returns {array} - Returns the initial book list (0 - 36 `BOOKS_PER_PAGE`).
 */
const extractInitialResults = (object) => {
  // Slice the object based on the `BOOKS_PER_PAGE` to get the initial 36 results ↓

  initialPageResults = object.slice(0, BOOKS_PER_PAGE);
  return initialPageResults;
};

// Called `extractInitialResults` function for the first page load, based on all of the `books` ↓

extractInitialResults(books);

// Created the `createBookElement` function ↓

/** `createBookElement` creates the button element for each of our main list of books and then creates the innerHTML of the button.
 */
const createBookElement = ({ author, image, title, id }) => {
  // Create the button element for each book ↓

  /** `bookElement` creates/holds a button element for each book which the user can click on to view the book preview. */
  const bookElement = document.createElement("button");

  // Set the class and attribute of the button element ↓

  bookElement.classList = "preview";
  bookElement.setAttribute("book-id", id);

  // Set the innerHTML of the button element ↓

  bookElement.innerHTML = /* html */ `
  <img class="preview__image" src="${image}"/>

    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
  </div>`;

  return bookElement;
};

// Create the `renderBookList` function ↓

/** `renderBookList` loops through the subset of the given object parameter and then `createBookElement` is called
 * for each book. It then appends the `singleBook` to the given fragment parameter.
 * @param {object} object - The object that you want to render the book list for. This can be `books` or `searchResults`.
 * @param {object} fragment - The fragment that you want to append the `singleBook` to. This can be `bookListFragment` or `searchResultsFragment`.
 */
const renderBookList = (object, fragment) => {
  // Start the for...of loop to loop through each book ↓

  /** The below for...of loop loops through the given object and calls the `createBookElement` function for each book in the object. */
  for (let { author, image, title, id } of object) {
    /** `singleBook` holds the `bookElement` for an individual book, created by the `createBookElement` function */
    const singleBook = createBookElement({
      author,
      image,
      title,
      id,
    });

    // Append the `singleBook` to the given fragment ↓

    fragment.appendChild(singleBook);

    // Append the given fragment to the list, making it visible in the UI ↓

    data.list.items.appendChild(fragment);
  }
};

// Called `renderBookList` function for the first page load, based on the `initialPageResults` ↓

renderBookList(initialPageResults, bookListFragment);

/*

                                                                    BOOK PREVIEWS ↓

*/

// Created the `activeBook` variable ↓

/** `activeBook` holds the data of the unique book that the user has clicked on. */
let activeBook = "";

// Created the `identifyBook` function ↓

/** Identifies the `activeBook` the user has clicked on to view the preview.
 * @param {target} event - The event target that the user has clicked on.
 */
const identifyBook = (event) => {
  // Create the `element` and `previewId` variables ↓

  /** `element` checks for the closest element that was clicked on which includes "[book-id]", returns true or false. */
  let element = event.target.closest("[book-id]");
  /** `previewId` is a ternary that checks if `element` is truthy, if so it gets the id attribute.*/
  let previewId = element ? element.getAttribute("book-id") : "";

  // Start the for...of loop to loop through each book and get the id ↓

  /** The below for...of loop loops through each book in the `books` array
   * and checks to see if the id of the book strictly matches the id of the
   * book that was clicked on. If it matches it assigns the `singleBook` to the `activeBook` variable. */
  for (let singleBook of books) {
    if (singleBook.id === previewId) {
      activeBook = singleBook;
    }
  }
};

// Created the `populatePreview` function ↓

/** Populates the preview overlay with the `activeBook` data.
 * @param {object} activeBook - The object containing the data of the unique book that the user has clicked on
 */
const populatePreview = (activeBook) => {
  // Set the attributes and innerHTML of the preview overlay ↓

  data.list.image.setAttribute("src", activeBook.image);
  data.list.blur.setAttribute("src", activeBook.image);
  data.list.title.innerHTML = activeBook.title;

  // Set the subtitle, description, and date of publish of the preview overlay ↓

  data.list.subtitle.innerHTML = `${authors[activeBook.author]} (${new Date(
    activeBook.published
  ).getFullYear()})`;
  data.list.description.innerHTML = activeBook.description;

  // Set the style of the description so that it has a scrollbar if the description is too long ↓

  data.list.description.style.overflowY = "auto";
};

// Created the book preview event listener which calls the above functions ↓

/** Book preview event listener, added to the whole list of books so that we don't need an event listener on each book element */
data.list.items.addEventListener("click", (event) => {
  // Call `identifyBook` to identify the book that was clicked on ↓

  identifyBook(event);

  // Call `populatePreview` to populate the preview with the book that was clicked on ↓

  populatePreview(activeBook);

  // Display the active book preview overlay to the user ↓

  data.list.active.show();
});

// Created the book preview close button event listener ↓

/** Preview overlay close button event listener */
data.list.close.addEventListener("click", (event) => {
  data.list.active.close();
});

/*

                                                REMAINING BOOKS FOR SHOW MORE BUTTON AND SHOW MORE EVENT ↓

*/

// Created the `page` variable ↓

/** `page` represents the 'page' that we are on relating to the `BOOKS_PER_PAGE`.
 * This is used for calculating the `remainingBooks` and for pagination when it comes to the `showMoreHandler`(Show more button).
 */
let page = 1;

// Created the `remainingBooks` function ↓

/** Calculates the remaining amount of books to be displayed.
 * @param {object} object - The object that you want to calculate the remaining books for. This gets passed
 * to the `remainingBooks` function automatically based on the `updateShowMoreBtn` function.
 */
const remainingBooks = (object) => {
  // Use boolean logic to check if the remaining amount of books is bigger than 0 ↓

  /** `isNotZero` checks if the remaining amount of books is bigger than 0, returning true or false. */
  const isNotZero = object.length - [page * BOOKS_PER_PAGE] > 0;

  // Start the conditional statement ↓

  if (isNotZero) {
    data.list.button.disabled = false;
    /** `remaining` calculates and holds the remaining amount of books. */
    const remaining = object.length - [page * BOOKS_PER_PAGE];
    return remaining;
  } else {
    data.list.button.disabled = true;
    return 0;
  }
};

// Create updateShowMoreBtn function, to update the button based on the `remainingBooks` ↓

/** `updateShowMoreBtn` updates the 'show more' button visually depending on the `remainingBooks`
 * @param {object} object - The object that you want to update the 'show more' button for. This
 * can be `books` or `searchResults`.
 */
const updateShowMoreBtn = (object) => {
  data.list.button.innerHTML =
    /* html */
    `<span>Show more</span>
      <span class="list__remaining"> (${remainingBooks(object)})</span>`;
};

// Called the `updateShowMoreBtn` to update the 'show more' button for the initial page load ↓

updateShowMoreBtn(books);

/*

                                                                SHOW MORE BUTTON ↓    

*/

// Created the `searchResults` and `remainingPageResults` variables ↓

/** `searchResults` is an array of the matching books from the users search (user can search: title, author, genre). */
let searchResults = [];

/** `remainingPageResults` is an array that stores the remaining books to be displayed when the user clicks the 'show more' button. */
let remainingPageResults = [];

// Created the `extractRemainingResults` function ↓

/** Extracts the remaining results to be displayed when the user clicks the 'show more' button.
 * @param {object} object - The object that you want to extract the remaining results from.
 * @returns {array} - Returns the remaining results data to render the book list for it.
 */
const extractRemainingResults = (object) => {
  // Get the starting and ending index for the slicing. This is based on the `page` variable. Every time the user clicks the 'show more' button, the `page` variable increases by 1, therefore we can get the next batch of 36 `BOOKS_PER_PAGE` ↓

  /** `start` holds the starting index for the slicing. */
  const start = page * BOOKS_PER_PAGE;

  /** `end` holds the ending index for the slicing. */
  const end = (page + 1) * BOOKS_PER_PAGE;

  // Slice the array based on the starting and ending index to get the remaining results ↓

  remainingPageResults = object.slice(start, end);

  // Increment page by 1 so that the next time the user clicks the 'show more' button, the next batch of 36 `BOOKS_PER_PAGE` is displayed ↓

  page++;

  // Return the remaining results so that we can render the book list for it ↓

  return remainingPageResults;
};

// Created the `showMoreHandler` function ↓

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

// Created the 'show more' button event listener ↓

/** Show more button event listener */
data.list.button.addEventListener("click", showMoreHandler);

/*

                                                              SEARCH DROPDOWN CREATION ↓  

*/

// Created the createAnyGenreOpt function ↓

/** Creates the 'all genres' option for the genre dropdown list. */
const createAnyGenreOpt = () => {
  /** `allGenresOpt` creates and holds a new HTML 'option' element for the
   *  'All Genres' option. This needs to be done separately from the other genres,
   *   because it will have the value of 'any'.
   */
  const allGenresOpt = document.createElement("option");

  // Used .value to add 'any' value to the 'All Genres' option ↓

  allGenresOpt.value = "any";

  // Used .textContent to add 'All Genres' text to the 'All Genres' option ↓

  allGenresOpt.textContent = "All Genres";

  // Append the 'All Genres' option to the `genreFragment` ↓

  genreFragment.appendChild(allGenresOpt);
};

// Created the populateGenreDropdown function ↓

/** Populates the genre dropdown list with all of the genres. */
const populateGenreDropdown = () => {
  // Used a for...of loop to loop through each property of the `genres` object ↓

  /** The below for...of loop loops through each property of the `genres` object.
   *  It then creates an HTML 'option' element for each genre and appends it to the `genreFragment`
   *  which follows on from the 'All Genres' option element.
   *  The element value is set to the id of the genre and the textContent is set to the genre name.
   */
  for (let [id, genre] of Object.entries(genres)) {
    /** `genreOption` creates and holds an HTML 'option' element for our dropdown list
     * that contains the genre id and genre name. */
    const genreOption = document.createElement("option");
    genreOption.value = id;
    genreOption.textContent = genre;
    genreFragment.appendChild(genreOption);
  }

  // Used `data` reference to append the `genreFragment` to the genre search form, which will make it visible in the UI ↓

  data.search.genres.appendChild(genreFragment);
};

// Called the `createAnyGenreOpt` and `populateGenreDropdown` functions ↓

createAnyGenreOpt();

populateGenreDropdown();

// Created the createAnyAuthorOpt function ↓

/** Creates the 'all authors' option for the author dropdown list. */
const createAnyAuthorOpt = () => {
  /** `allAuthorsOpt` creates and holds a new HTML 'option' element for the
   *  'All Authors' option. This needs to be done separately from the other genres,
   *   because it will have the value of 'any'.
   */
  const allAuthorsOpt = document.createElement("option");

  // Used .value to add 'any' value to the 'All Authors' option ↓

  allAuthorsOpt.value = "any";

  // Used .textContent to add 'All Authors' text to the 'All Authors' option ↓

  allAuthorsOpt.textContent = "All Authors";

  // Append the 'All Authors' option to the `authorFragment` ↓

  authorFragment.appendChild(allAuthorsOpt);
};

// Created the populateAuthorDropdown function ↓

/** Populates the author dropdown list with all of the authors. */
const populateAuthorDropdown = () => {
  // Used a for...of loop to loop through each property of the `authors` object ↓

  /** The below for...of loop loops through each property of the `authors` object.
   *  It then creates an HTML option element for each author and appends it to the `authorFragment`
   *  which follows on from the 'All Authors' option element.
   *  The element value is set to the id of the author and the textContent is set to the author name.
   */
  for (let [id, author] of Object.entries(authors)) {
    /** authorOption creates and holds an HTML 'option' element for our dropdown list
     * that contains the author id and author name.
     */
    const authorOption = document.createElement("option");
    authorOption.value = id;
    authorOption.textContent = author;
    authorFragment.appendChild(authorOption);
  }
  // Used `data` reference to append the `authorFragment` to the author search form, which will make it visible in the UI ↓

  data.search.authors.appendChild(authorFragment);
};

// Called the `createAnyAuthorOpt` and `populateAuthorDropdown` functions ↓

createAnyAuthorOpt();

populateAuthorDropdown();

/*

                                                        SEARCH RESULTS FILTERING + DISPLAYING ↓

*/

// Created the `filterBooks` function ↓

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

// Created the `displayIfNoResults` function ↓

/** Displays error message to user if no results are found. */
const displayIfNoResults = () => {
  searchResults.length < 1
    ? data.list.message.classList.add("list__message_show")
    : data.list.message.classList.remove("list__message_show");
};

// Created the `searchResultsHandler` function ↓

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

// Created the search form submission event listener ↓

/** Search form submission event listener */
data.search.form.addEventListener("submit", searchResultsHandler);

// Created the search overlay open and close button event listeners ↓

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

                                                            USER THEME SELECTION ↓

*/

// Corrected the `day` and `night` objects ↓

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

// Created the `setThemeToNight` function ↓

/** Sets the theme to night */
const setThemeToNight = () => {
  document.documentElement.style.setProperty("--color-dark", night.dark);
  document.documentElement.style.setProperty("--color-light", night.light);
};

// Created the `setThemeToDay` function ↓

/** Sets the theme to day */
const setThemeToDay = () => {
  document.documentElement.style.setProperty("--color-dark", day.dark);
  document.documentElement.style.setProperty("--color-light", day.light);
};

// Created the `checkDefaultTheme` function ↓

/** Checks the users default browser theme */
const checkDefaultTheme = () => {
  // Start a ternary that checks if the user's default browser preferred theme is dark/night ↓

  data.settings.theme.value === "night" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? setThemeToNight()
    : setThemeToDay();
};

// Call `checkDefaultTheme` to check the user's default browser theme ↓

checkDefaultTheme();

// Created the `themeSelectionHandler` function to handle the theme selection event ↓

/** Handles the user's theme selection event */
const themeSelectionHandler = (event) => {
  // Prevent the default behaviour of the form so that we can work with the form data ↓

  event.preventDefault();

  // Create two boolean variables for our if statement ↓

  /** `isDay` checks to see if the value of the dropdown list option for the current theme is 'day',
   * returning true or false.
   */
  const isDay = data.settings.theme.value === "day";
  /**`isNight` checks to see if the value of the dropdown list option for the current theme is 'night',
   * returning true or false.
   */
  const isNight = data.settings.theme.value === "night";

  // Start the conditional statement that checks if the theme is day or night ↓

  if (isDay) {
    // Call `setThemeToDay` to set the theme to day ↓

    setThemeToDay();
  } else if (isNight) {
    // Call `setThemeToNight` to set the theme to night ↓

    setThemeToNight();
  }

  // Close the settings overlay ↓

  data.settings.overlay.close();
};

// Created listeners and handlers for the closing/opening of the settings overlay ↓

/** Settings button event listener */
data.header.settings.addEventListener("click", (event) => {
  data.settings.overlay.show();
});

/** Settings cancel button event listener */
data.settings.cancel.addEventListener("click", (event) => {
  data.settings.overlay.close();
});

// Created the settings form submission event listener ↓

/** Settings form submission event listener */
data.settings.form.addEventListener("submit", themeSelectionHandler);
