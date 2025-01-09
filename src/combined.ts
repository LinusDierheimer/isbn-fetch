import type { Book, FetchOptions } from ".";
import googlebooks from "./googlebooks";
import isbndbWebscrape from "./isbndbWebscrape";
import openlibrary from "./openlibrary";

const EMPTY_BOOK: Book = { isbnSource: "" };

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
export function combinedResults(isbn: string,
    googlebooks_book: Book | undefined,
    openlibrary_book: Book | undefined,
    isbndbWebscrape_book: Book | undefined
): Book {
  googlebooks_book = googlebooks_book || EMPTY_BOOK;
  openlibrary_book = openlibrary_book || EMPTY_BOOK;
  isbndbWebscrape_book = isbndbWebscrape_book || EMPTY_BOOK;

  return {
    isbnSource:     isbn,
    isbn10:         isbndbWebscrape_book.isbn10     || googlebooks_book.isbn10             || openlibrary_book.isbn10,
    isbn13:         isbndbWebscrape_book.isbn13     || googlebooks_book.isbn13             || openlibrary_book.isbn13,
    title:          googlebooks_book.title          || openlibrary_book.title              || isbndbWebscrape_book.title,
    authors:        googlebooks_book.authors        || openlibrary_book.authors            || isbndbWebscrape_book.authors,
    publishedDate:  googlebooks_book.publishedDate  || openlibrary_book.publishedDate      || isbndbWebscrape_book.publishedDate,
    genres:         openlibrary_book.genres         || googlebooks_book.genres             || isbndbWebscrape_book.genres,
    language:       openlibrary_book.language       || googlebooks_book.language           || isbndbWebscrape_book.language,
    pageCount:      googlebooks_book.pageCount      || openlibrary_book.pageCount          || isbndbWebscrape_book.pageCount,
    thumbnail:      openlibrary_book.thumbnail      || isbndbWebscrape_book.thumbnail      || googlebooks_book.thumbnail,
    thumbnailSmall: openlibrary_book.thumbnailSmall || isbndbWebscrape_book.thumbnailSmall || googlebooks_book.thumbnailSmall,
    description:    openlibrary_book.description    || googlebooks_book.description        || isbndbWebscrape_book.description,
    publishers:     openlibrary_book.publishers     || googlebooks_book.publishers         || isbndbWebscrape_book.publishers,
  }
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
  const [googlebooks_book, openlibrary_book, isbndbWebscrape_book] = await Promise.all([
    googlebooks(isbn, fetchOptions).catch(() => undefined),
    openlibrary(isbn, fetchOptions).catch(() => undefined),
    isbndbWebscrape(isbn, fetchOptions).catch(() => undefined),
  ]);

  return combinedResults(isbn, googlebooks_book, openlibrary_book, isbndbWebscrape_book);
}
