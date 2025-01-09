import type { Book, FetchOptions } from ".";
import amazonWebscrape from "./amazonWebscrape";
import googlebooks from "./googlebooks";
import isbndbWebscrape from "./isbndbWebscrape";
import openlibrary from "./openlibrary";

/**
 * The results from the different providers.
 */
export type BooksResults = {
  googlebooks?: Book,
  openlibrary?: Book,
  isbndbWebscrape?: Book,
  amazonWebscrape?: Book,
};

/**
 *
 * Implements the logic to combine the results from the different providers.
 * Use this if you want to only combine the results from selected providers (pass undefined for the providers you want to skip).
 *
 * @param isbn Sets the isbnSource field of the returned Book object.
 * @param googlebooks_book The Book object returned by the googlebooks provider.
 * @param openlibrary_book The Book object returned by the openlibrary provider.
 * @param isbndbWebscrape_book The Book object returned by the isbndbWebscrape provider.
 * @returns A Book object with the combined data from the providers.
 */
export function combinedResults(books: BooksResults): Book {
  books.googlebooks = books.googlebooks || {};
  books.openlibrary = books.openlibrary || {};
  books.isbndbWebscrape = books.isbndbWebscrape || {};
  books.amazonWebscrape = books.amazonWebscrape || {};

  let book: Book = {}

  book.isbn10 =
    books.isbndbWebscrape.isbn10 ||
    books.googlebooks.isbn10 ||
    books.openlibrary.isbn10 ||
    books.amazonWebscrape.isbn10;

  book.isbn13 =
    books.isbndbWebscrape.isbn13 ||
    books.googlebooks.isbn13 ||
    books.openlibrary.isbn13 ||
    books.amazonWebscrape.isbn13;

  book.title =
    books.googlebooks.title ||
    books.openlibrary.title ||
    books.isbndbWebscrape.title ||
    books.amazonWebscrape.title;

  book.authors =
    books.googlebooks.authors ||
    books.openlibrary.authors ||
    books.isbndbWebscrape.authors ||
    books.amazonWebscrape.authors;

  book.publishedDate =
    books.googlebooks.publishedDate ||
    books.openlibrary.publishedDate ||
    books.isbndbWebscrape.publishedDate ||
    books.amazonWebscrape.publishedDate;

  book.genres =
    books.openlibrary.genres ||
    books.googlebooks.genres ||
    books.isbndbWebscrape.genres ||
    books.amazonWebscrape.genres;

  book.language =
    books.openlibrary.language ||
    books.googlebooks.language ||
    books.isbndbWebscrape.language ||
    books.amazonWebscrape.language;

  book.pageCount =
    books.googlebooks.pageCount ||
    books.openlibrary.pageCount ||
    books.isbndbWebscrape.pageCount ||
    books.amazonWebscrape.pageCount;

  book.thumbnail =
    books.openlibrary.thumbnail ||
    books.isbndbWebscrape.thumbnail ||
    books.amazonWebscrape.thumbnail ||
    books.googlebooks.thumbnail;

  book.thumbnailSmall =
    books.openlibrary.thumbnailSmall ||
    books.isbndbWebscrape.thumbnailSmall ||
    books.amazonWebscrape.thumbnailSmall ||
    books.googlebooks.thumbnailSmall;

  book.description =
    books.amazonWebscrape.description ||
    books.openlibrary.description ||
    books.googlebooks.description ||
    books.isbndbWebscrape.description;

  book.publishers =
    books.openlibrary.publishers ||
    books.googlebooks.publishers ||
    books.isbndbWebscrape.publishers ||
    books.amazonWebscrape.publishers;

  return book;
}

/**
 * This method fetches book data from both {@link googlebooks} and {@link openlibrary}.
 * It then merges the data from both sources, preferring the data from the provider that is known to be more reliable for that field.
 *
 * @note This method will never throw an error. If both providers fail, the returned Book object will have empty fields.
 *
 * @param isbn the ISBN to fetch. Should be a valid ISBN-10 or ISBN-13.
 * @returns a Book object with the fetched data.
 */
export default async function combined(isbn: string, fetchOptions?: FetchOptions): Promise<Book> {
  const [googlebooks_book, openlibrary_book, isbndbWebscrape_book, amazonWebscrape_book] = await Promise.all([
    googlebooks(isbn, fetchOptions).catch(() => undefined),
    openlibrary(isbn, fetchOptions).catch(() => undefined),
    isbndbWebscrape(isbn, fetchOptions).catch(() => undefined),
    amazonWebscrape(isbn, fetchOptions).catch(() => undefined),
  ]);

  return combinedResults({
    googlebooks: googlebooks_book,
    openlibrary: openlibrary_book,
    isbndbWebscrape: isbndbWebscrape_book,
    amazonWebscrape: amazonWebscrape_book,
  });
}
