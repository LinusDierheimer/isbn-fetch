import IsbnFetch from '../src/index';

(async () => {
  const isbn = '978-3-458-17876-7';

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

  try {
    console.log("isbndbWebscrape:", await IsbnFetch.isbndbWebscrape(isbn));
  } catch (e) {
    console.error("isbndbWebscrape:", e.message);
  }

  try {
    console.log("amazonWebscrape:", await IsbnFetch.amazonWebscrape(isbn));
  } catch (e) {
    console.error("amazonWebscrape:", e.message);
  }

  console.log("combined:", await IsbnFetch.combined(isbn));
})();
