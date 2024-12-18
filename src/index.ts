import __googlebooks from './googlebooks';
import __openlibrary from './openlibrary';

namespace IsbnFetch {
  /**
   * A Book object represents a book with its metadata.
   */
  export type Book = {
    isbnSource: string;
    isbn10?: string;
    isbn13?: string;
    title?: string;
    authors?: string[];
    publishedDate?: string;
    genres?: string[];
    language?: string;
    pageCount?: number;
    thumbnail?: string;
    thumbnailSmall?: string;
    description?: string;
    publishers?: string[];
  };

  /**
   * A Provider is a function that fetches a book from a source.
   */
  type Provider = (isbn: string) => Promise<Book>;

  /**
   * Fetches a book from Google Books.
   *
   * @throws an error if the fetch fails.
   * @param isbn the ISBN to fetch. Should be a valid ISBN-10 or ISBN-13.
   * @returns a Book object with the fetched data.
   */
  export const googlebooks: Provider = __googlebooks;

  /**
   * Fetches a book from Open Library.
   *
   * @throws an error if the fetch fails.
   * @param isbn the ISBN to fetch. Should be a valid ISBN-10 or ISBN-13.
   * @returns a Book object with the fetched data.
   */
  export const openlibrary: Provider = __openlibrary;

  const EMPTY_BOOK: Book = {isbnSource: ""};

  /**
   * This method fetches book data from both {@link googlebooks} and {@link openlibrary}.
   * It then merges the data from both sources, preferring the data from the provider that is known to be more reliable for that field.
   *
   * @note This method will never throw an error. If both providers fail, the returned Book object will have empty fields.
   *
   * @param isbn the ISBN to fetch. Should be a valid ISBN-10 or ISBN-13.
   * @returns a Book object with the fetched data.
   */
  export async function fetch(isbn: string): Promise<Book> {
    let googlebooks_book: Book = EMPTY_BOOK;
    let openlibrary_book: Book = EMPTY_BOOK;

    try {
      googlebooks_book = await googlebooks(isbn);
    } catch {}

    try {
      openlibrary_book = await openlibrary(isbn);
    } catch {}

    return {
      isbnSource: isbn,
      isbn10: googlebooks_book.isbn10 || openlibrary_book.isbn10,
      isbn13: googlebooks_book.isbn13 || openlibrary_book.isbn13,
      title: googlebooks_book.title || openlibrary_book.title,
      authors: googlebooks_book.authors || openlibrary_book.authors,
      publishedDate: googlebooks_book.publishedDate || openlibrary_book.publishedDate,
      genres: googlebooks_book.genres || openlibrary_book.genres,
      language: openlibrary_book.language || googlebooks_book.language,
      pageCount: googlebooks_book.pageCount || openlibrary_book.pageCount,
      thumbnail: openlibrary_book.thumbnail || googlebooks_book.thumbnail,
      thumbnailSmall: openlibrary_book.thumbnailSmall || googlebooks_book.thumbnailSmall,
      description: openlibrary_book.description || googlebooks_book.description,
      publishers: openlibrary_book.publishers || googlebooks_book.publishers,
    }
  }
};

export default IsbnFetch;
