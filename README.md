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
| `combined` | Fetches book information from both the Google Books and Open Library APIs. Tries to return the most complete information. |

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
async function provider(isbn: string): Promise<Book>;
```

## Installation

```bash
npm i isbn-fetch --save
```
