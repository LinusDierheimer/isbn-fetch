import IsbnFetch from '../src/index';

(async () => {
  const isbn = '978-3-8000-4705-5';

  try {
    console.log("googlebooks:", await IsbnFetch.googlebooks(isbn));
  } catch (e) {
    console.error("googlebooks:", e.message);
  }

  try {
    console.log("openlibrary:", await IsbnFetch.openlibrary(isbn));
  } catch (e) {
    console.error("openlibrary:", e.message);
  }

  console.log("combined:", await IsbnFetch.combined(isbn));
})();
