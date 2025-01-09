/**
 * A Book object represents a book with its metadata.
 */
export type Book = {
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
 * FetchOptions is passed to every fetch function call.
 * Be carefull with setting things here, as it is implementation defined how many fetches a provider does do and to where.
 * The openlibrary provider for example will do 4 fetches to get all the data, all using the same options.
 *
 * Method is ommited as implementations have to set their required method themselves.
 * Because of this, body is also ommited.
 * Keepalive is ommited as the library does not support it.
 *
 * The main motivation here is to allow setting a custom timeout for fetches.
 * This can be done using the signal property:
 * ```ts
 * const options: FetchOptions = {
 *   // Timeout after 5 seconds
 *   signal: AbortSignal.timeout(5000),
 * };
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout
 */
export type FetchOptions = Omit<RequestInit, "body" | "method" | "keepalive">;

import googlebooks from "./googlebooks";
import openlibrary from "./openlibrary";
import isbndbWebscrape from "./isbndbWebscrape";
import amazonWebscrape from "./amazonWebscrape";
import combined, { combinedResults, type BooksResults } from "./combined";

export default {
  googlebooks,
  openlibrary,
  isbndbWebscrape,
  amazonWebscrape,
  combined,
  combinedResults
};

export { type BooksResults };
