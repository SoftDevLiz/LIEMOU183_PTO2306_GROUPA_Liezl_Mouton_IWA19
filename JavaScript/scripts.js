// Imported data so we can work with it ↓

import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

// Created an object literal that holds all of our DOM element references ↓

/** The data variable contains an object that holds all of the references to necessary DOM elements so that we can easily work
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

// Initialized variables correctly ↓

// const matches = books;

/** `PAGE` represents the 'page' that we are on relating to the `BOOKS_PER_PAGE`.
 * This is used for pagination.
 * @example If we are on page 1, show the first 36 books.
 * If we are on page 2, show the next 36 books.
 */
let PAGE = 1;

// Corrected the conditional statement(s) syntax with curly braces ↓

if (!books && !Array.isArray(books)) {
  throw new Error("Source required");
}

// if (!range && range.length < 2) {
//   throw new Error("Range must be an array with two numbers");
// }

// Initialized day + night variables correctly ↓

/** A variable that contains an object the dark and light colours for the day theme */
const day = {
  dark: "10, 10, 20",
  light: "255, 255, 255",
};

/** A variable that contains an object with the dark and light colours for the night theme */
const night = {
  dark: "255, 255, 255",
  light: "10, 10, 20",
};

// Initialized the preview fragment variables correctly ↓

/** previewFragment creates and holds a document fragment to be used for the book preview functionality */
const previewFragment = document.createDocumentFragment();

/** extractedBooks extracts a shallow copy of a portion of the books
 *  array and creates a new array that contains the first 36 books.
 * The original books array is not modified by .slice()
 */
const extractedBooks = books.slice(0, BOOKS_PER_PAGE);

// Created the `createsPreview` function ↓

/** `createsPreview` creates the button element for our main list of books and then creates the innerHTML of the button
 * using the author, image, title and id parameters (which is passed to it from the below for...of loop that is running
 * through each book) and their related existing css classes.
 * The function then returns the preview variable so that it can be appended to the previewFragment, and then the previewFragment
 * gets appended to data.list.items (the div element that holds the list of books, 36 `BOOKS_PER_PAGE`)
 */
const createsPreview = ({ author, image, title, id }) => {
  /** `preview` creates/holds a singular button element and the innerHTML and css styling is applied
   * to it. A button is created for each book the loop is looping through.
   */
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

//  Corrected the for...of syntax + added variable initialization (It was a mix between the i++ method and the more modern for...of method) ↓

/** `previewLoop` loops through the subset of `extractedBooks` and then `createsPreview`
 *  for each book for the current page. It then appends the `preview` to the `previewFragment`.
 */
const previewLoop = () => {
  for (let { author, image, title, id } of extractedBooks) {
    /** `preview` holds the preview for an individual book, created by the `createsPreview` function */
    const preview = createsPreview({
      author,
      image,
      title,
      id,
    });

    previewFragment.appendChild(preview);
  }
};

// Called the `previewLoop` function for the first page load ↓

previewLoop();

// Used our data variable to append the preview fragment to the list for the first page load ↓

data.list.items.appendChild(previewFragment);

// Initialized genre fragment variables correctly ↓

/** `genreFragment` holds a document fragment that will contain a the list of genres for the genre dropdown list */
const genreFragment = document.createDocumentFragment();

/** `allGenresOpt` creates and holds a new HTML 'option' element for a genre dropdown list.
 * This element is used to create the 'All Genres' option element, which needs to be
 * done separately from the other genres.
 */
const allGenresOpt = document.createElement("option");

allGenresOpt.value = "any";

// Used .textContent to add 'All Genres' text to the dropdown list ↓

allGenresOpt.textContent = "All Genres";

genreFragment.appendChild(allGenresOpt);

/** The below for...of loop loops through each property of the genres object.
 *  It then creates an HTML option element for each genre and appends it to the genreFragment variable
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

// Used `data` reference to append the genre fragment to the search overlay ↓

data.search.genres.appendChild(genreFragment);

// Initialized author fragment variables correctly ↓

/** authorFragment creates and holds a document fragment */
const authorFragment = document.createDocumentFragment();

/** allAuthorsOpt creates and holds a new HTML 'option' element for an author dropdown list.
 * This element is used to create the 'All Authors' option element, which needs to be
 * done separately from the other authors.
 */
const allAuthorsOpt = document.createElement("option");

allAuthorsOpt.value = "any";
allAuthorsOpt.textContent = "All Authors";

authorFragment.appendChild(allAuthorsOpt);

/** The below for...of loop loops through each property of the authors object.
 *  It then creates an HTML option element for each author and appends it to the authorFragment variable
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

// Used `data` reference to append the author fragment to the search overlay ↓

data.search.authors.appendChild(authorFragment);

// Used `data` reference to refer to correct elements in ternary statement and removed redundant ternary ↓

data.settings.theme.value === window.matchMedia &&
window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "night"
  : "day";

// Created the theme selection event listener and handler ↓

/** The below event listener listens for when the user submits the form. The event listener is tied to the form
 * as a whole and not the button so allow the user to submit using the enter key. So it will actually run when
 * the user clicks the submit button or presses the enter key.
 * When the user submits the form, the event listener prevents the default behaviour of the form so that we can
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

// Created the `remainingBooks` function ↓

/** `remainingBooks` checks to see if the remaining amount of books `isNotZero`.
 * If it is not zero, it `updatesRemaining` amount of books and returns the `remaining` amount of books.
 * If it is zero, it returns 0 and disables the button.
 */
const remainingBooks = () => {
  /** `isNotZero` checks if the remaining amount of books is bigger than 0 */
  const isNotZero = books.length - [PAGE * BOOKS_PER_PAGE] > 0;

  if (isNotZero) {
    /** `remaining` calculates the remaining amount of books */
    const remaining = books.length - [PAGE * BOOKS_PER_PAGE];
    return remaining;
  } else {
    data.list.button.disabled = true;
    return 0;
  }
};

// Used `data` references, added backticks for interpolation, removed square brackets and redundant code, made it into a function ↓

/** `updateShowMore` updates the 'show more' button visually depending on the `remainingBooks` */
const updatesShowMore = () => {
  data.list.button.innerHTML =
    /* html */
    `<span>Show more</span>
      <span class="list__remaining"> (${remainingBooks()})</span>`;
};

// Called the `updateShowMore` to update the 'show more' for the initial page load ↓

updatesShowMore();

// Created event listeners and handlers for the toggling of overlays ↓

data.header.search.addEventListener("click", (event) => {
  data.search.overlay.show();
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

// Created the event listener and handler for the 'show more' button ↓

/** `showMoreHandler` handles the 'show more' button click event.
 * It calculates the `start` and `end` of the next page of books,
 * extracts it from `books`and calls the `previewLoop` which `createsPreview`
 * for each book for the current page. It then appends the `preview` to the `previewFragment`
 * and then appends that to the list of books to update the UI.
 *  It then increments `PAGE` by 1 for the next page and calls `updatesShowMore` to update the 'show more' button.
 */
const showMoreHandler = (event) => {
  /** `start` holds the starting index for the `books` slicing */
  const start = PAGE * BOOKS_PER_PAGE;
  /** `end` holds the ending index for the `books` slicing */
  const end = (PAGE + 1) * BOOKS_PER_PAGE;
  /** `extractedBooks` holds the books we have extracted from the slicing */
  const extractedBooks = books.slice(start, end);

  previewLoop();

  data.list.items.appendChild(previewFragment);

  PAGE++;

  updatesShowMore();
};

data.list.button.addEventListener("click", showMoreHandler);

// data-list-button.click() {
//   document.querySelector([data-list-items]).appendChild(createsPreviewsFragment(matches, page x BOOKS_PER_PAGE, {page + 1} x BOOKS_PER_PAGE]))
//   actions.list.updateRemaining()
//   page = page + 1
// }

// data.list.close.click() { data-list-active.open === false }

// data-header-search.click() {
//     data-search-overlay.open === true ;
//     data-search-title.focus();
// }

// data-search-form.click(filters) {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const filters = Object.fromEntries(formData)
//     result = []

//     for (book; booksList; i++) {
//         titleMatch = filters.title.trim() = '' && book.title.toLowerCase().includes[filters.title.toLowerCase()]
//         authorMatch = filters.author = 'any' || book.author === filters.author

//         {
//             genreMatch = filters.genre = 'any'
//             for (genre; book.genres; i++) { if singleGenre = filters.genre { genreMatch === true }}}
//         }

//         if titleMatch && authorMatch && genreMatch => result.push(book)
//     }

//     if display.length < 1
//     data-list-message.class.add('list__message_show')
//     else data-list-message.class.remove('list__message_show')

//     data-list-items.innerHTML = ''
//     const fragment = document.createDocumentFragment()
//     const extracted = source.slice(range[0], range[1])

//     for ({ author, image, title, id }; extracted; i++) {
//         const { author: authorId, id, image, title } = props

//         element = document.createElement('button')
//         element.classList = 'preview'
//         element.setAttribute('data-preview', id)

//         element.innerHTML = /* html */ `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />

//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[authorId]}</div>
//             </div>
//         `

//         fragment.appendChild(element)
//     }

//     data-list-items.appendChild(fragments)
//     initial === matches.length - [page * BOOKS_PER_PAGE]
//     remaining === hasRemaining ? initial : 0
//     data-list-button.disabled = initial > 0

//     data-list-button.innerHTML = /* html */ `
//         <span>Show more</span>
//         <span class="list__remaining"> (${remaining})</span>
//     `

//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     data-search-overlay.open = false
// }

// data-settings-overlay.submit; {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const result = Object.fromEntries(formData)
//     document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
//     document.documentElement.style.setProperty('--color-light', css[result.theme].light);
//     data-settings-overlay).open === false
// }

// data-list-items.click() {
//     pathArray = Array.from(event.path || event.composedPath())
//     active;

//     for (node; pathArray; i++) {
//         if active break;
//         const previewId = node?.dataset?.preview

//         for (const singleBook of books) {
//             if (singleBook.id === id) active = singleBook
//         }
//     }

//     if !active return
//     data-list-active.open === true
//     data-list-blur + data-list-image === active.image
//     data-list-title === active.title

//     data-list-subtitle === '${authors[active.author]} (${Date(active.published).year})'
//     data-list-description === active.description
// }
