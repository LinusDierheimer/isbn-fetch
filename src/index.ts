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

import googlebooks from "./googlebooks";
import openlibrary from "./openlibrary";
import combined from "./combined";

export default {
  googlebooks,
  openlibrary,
  combined,
};
