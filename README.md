# isbn-fetch

A small package that fetches book information given an ISBN number.

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

## Providers

| function name | description |
| --- | --- |
| `googlebooks` | Fetches book information from the Google Books API. |
| `openlibrary` | Fetches book information from the Open Library API. |
| `combined` | Fetches book information from both the Google Books and Open Library APIs. Tries to return the most complete information. |

For more infomation, see the documentation in the type definitions.

## Usage

```typescript
import IsbnFetch from 'isbn-fetch';
const book = await IsbnFetch.fetch('978-3-453-31716-1');
```
