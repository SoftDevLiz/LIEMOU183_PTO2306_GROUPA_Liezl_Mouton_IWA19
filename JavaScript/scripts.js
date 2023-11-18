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

const matches = books;
const page = 1;

// Corrected the conditional statement(s) syntax with curly braces ↓

if (!books && !Array.isArray(books)) {
  throw new Error("Source required");
}

if (!range && range.length < 2) {
  throw new Error("Range must be an array with two numbers");
}

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

//  Corrected the for...of syntax + added variable initialization (It was a mix between the i++ method and the    more modern for...of method) ↓

/** The below for...of loop loops through the subset of extracted books (see extracted variable)
 *  and creates a preview using the createPreview function.
 *  The preview is then appended to the fragment variable.
 */
for (let { author, image, title, id } of extractedBooks) {
  const preview = createPreview({
    author,
    id,
    image,
    title,
  });

  previewFragment.appendChild(preview);
}

// Used our data variable to append the preview fragment to the list ↓

data.list.items.appendChild(previewFragment);

// Initialized genre fragment variables correctly ↓

/** genreFragment creates and holds a document fragment */
const genreFragment = document.createDocumentFragment();

/** allGenresOpt creates and holds a new HTML 'option' element for a genre dropdown list.
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

data.list.button.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0);

// Used `data` references, added backticks for interpolation, removed square brackets and redundant code ↓

data.list.button.innerHTML =
  /* html */
  `<span>Show more</span><span class="list__remaining"> (${
    matches.length - [page * BOOKS_PER_PAGE] > 0
      ? matches.length - [page * BOOKS_PER_PAGE]
      : 0
  })</span>`;

// Created event listeners and handlers ↓

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

// Created the theme selection event listener and handler ↓

data.settings.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const isDay = data.settings.theme.value === "day";
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

// data.list.close.click() { data-list-active.open === false }

// data-list-button.click() {
//     document.querySelector([data-list-items]).appendChild(createPreviewsFragment(matches, page x BOOKS_PER_PAGE, {page + 1} x BOOKS_PER_PAGE]))
//     actions.list.updateRemaining()
//     page = page + 1
// }

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
