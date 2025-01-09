# isbn-fetch

A small package that fetches book information given an ISBN number.

## Usage

```typescript
import IsbnFetch from 'isbn-fetch';

// Fetch a book with the best possible information
// Note: this method does not throw an error even if all providers fail
const book = await IsbnFetch.combined('978-3-453-31716-1');

// Fetch a book from Google Books
try {
    const book = await IsbnFetch.googlebooks('978-3-453-31716-1');
} catch (e) {
    console.error(e);
}
```

## Providers

| function name | description |
| --- | --- |
| `googlebooks` | Fetches book information from the Google Books API. |
| `openlibrary` | Fetches book information from the Open Library API. |
| `isbndbWebscrape` | Fetches book information by scraping the ISBNdb website. |
| `combined` | Fetches book information from all other providers. Tries to return the most complete information. |

All providers are exported as functions from the default export object.  
For more infomation about a specific method see the documentation in the type definition files.

## Types

A `Book` object is defined as follows:

```typescript
type Book = {
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
```

All provider functions have the following signature:

```typescript
async function provider(isbn: string, fetchOptions?: FetchOptions): Promise<Book>;
```

Fetch options are a stripped down version of the `RequestInit` interface:
```typescript
type FetchOptions = Omit<RequestInit, "body" | "method" | "keepalive">;
```

For more information see the documentation in the type definition files.

## Installation

```bash
npm i isbn-fetch --save
```

If you want to use a provider that does web scraping, and you are using nodejs (DOMParser is not available), you also need to install the `jsdom` package:
```bash
npm i jsdom --save
```

## combinedResults

You can use the `combinedResults` function to merge the results of only selected providers:

```typescript
import IsbnFetch from 'isbn-fetch';

const isbnSource = '978-3-453-31716-1'; // Used to set the isbnSource field in the result
const googlebooks_book = /* fetch or undefined */;
const openlibrary_book = /* fetch or undefined */;
const isbndbWebscrape_book = /* fetch or undefined */;

const book = IsbnFetch.combinedResults(isbnSource, googlebooks_book, openlibrary_book, isbndbWebscrape_book);
```

This is not a simple function over an array of books because it knows which provider has the best chance of providing the best information for each field.
