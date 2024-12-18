import type { Book } from ".";
import googlebooks from "./googlebooks";
import openlibrary from "./openlibrary";

const EMPTY_BOOK: Book = { isbnSource: "" };

/**
 * This method fetches book data from both {@link googlebooks} and {@link openlibrary}.
 * It then merges the data from both sources, preferring the data from the provider that is known to be more reliable for that field.
 *
 * @note This method will never throw an error. If both providers fail, the returned Book object will have empty fields.
 *
 * @param isbn the ISBN to fetch. Should be a valid ISBN-10 or ISBN-13.
 * @returns a Book object with the fetched data.
 */
export default async function combined(isbn: string): Promise<Book> {
  const [googlebooks_book, openlibrary_book] = await Promise.all([
    googlebooks(isbn).catch(() => EMPTY_BOOK),
    openlibrary(isbn).catch(() => EMPTY_BOOK),
  ]);

  return {
    isbnSource: isbn,
    isbn10: googlebooks_book.isbn10 || openlibrary_book.isbn10,
    isbn13: googlebooks_book.isbn13 || openlibrary_book.isbn13,
    title: googlebooks_book.title || openlibrary_book.title,
    authors: googlebooks_book.authors || openlibrary_book.authors,
    publishedDate: googlebooks_book.publishedDate || openlibrary_book.publishedDate,
    genres: openlibrary_book.genres || googlebooks_book.genres,
    language: openlibrary_book.language || googlebooks_book.language,
    pageCount: googlebooks_book.pageCount || openlibrary_book.pageCount,
    thumbnail: openlibrary_book.thumbnail || googlebooks_book.thumbnail,
    thumbnailSmall: openlibrary_book.thumbnailSmall || googlebooks_book.thumbnailSmall,
    description: openlibrary_book.description || googlebooks_book.description,
    publishers: openlibrary_book.publishers || googlebooks_book.publishers,
  }
}
