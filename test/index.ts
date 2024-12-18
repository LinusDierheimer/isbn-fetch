import IsbnFetch from '../src/index';

(async () => {
  const isbn = '978-3-453-31716-1';

  console.log("googlebooks:", await IsbnFetch.googlebooks(isbn));
  console.log("openlibrary:", await IsbnFetch.openlibrary(isbn));
  console.log("combined:", await IsbnFetch.combined(isbn));
})();
