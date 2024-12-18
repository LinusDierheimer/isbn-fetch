import type { Book } from ".";

const GOOGLEBOOKS_BASE_URL = "https://www.googleapis.com/books/v1";

type GoogleBooksIsbn = {
  type: string;
  identifier: string;
};

type GoogleBooksVolumeInfo = {
  title?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: GoogleBooksIsbn[];
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  language?: string;
};

type GoogleBooksSearchInfo = {
  textSnippet: string;
};

type GoogleBooksVolume = {
  searchInfo: GoogleBooksSearchInfo;
  volumeInfo: GoogleBooksVolumeInfo;
};

type GoogleBooksVolumeResponse = {
  totalItems: number;
  items: GoogleBooksVolume[];
};

function parseIsbn(GoogleBooksIsbn: GoogleBooksIsbn[] | undefined, type: "ISBN_10" | "ISBN_13"): string | undefined {
  if (!GoogleBooksIsbn || GoogleBooksIsbn.length === 0)
    return undefined;

  return GoogleBooksIsbn.find(i => i.type === type)?.identifier;
}

/**
 * Fetches a book from Google Books.
 *
 * @throws an error if the fetch fails.
 * @param isbn the ISBN to fetch. Should be a valid ISBN-10 or ISBN-13.
 * @returns a Book object with the fetched data.
 */
export default async function googlebooks(isbn: string): Promise<Book> {
  const response = await fetch(`${GOOGLEBOOKS_BASE_URL}/volumes?q=isbn:${isbn}`);
  if (!response.ok)
    throw new Error("fetch googlebooks failed: " + response.statusText);

  const data = await response.json() as GoogleBooksVolumeResponse;
  if (data.totalItems === 0)
    throw new Error("No items found");

  let book: Book = {
    isbnSource: isbn,
  };

  for (const item of data.items) {
    book = {
      isbn10: parseIsbn(item.volumeInfo.industryIdentifiers, "ISBN_10"),
      isbn13: parseIsbn(item.volumeInfo.industryIdentifiers, "ISBN_13"),
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      publishers: item.volumeInfo.publisher ? [item.volumeInfo.publisher] : undefined,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description || item.searchInfo.textSnippet,
      pageCount: item.volumeInfo.pageCount,
      genres: item.volumeInfo.categories,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail,
      thumbnailSmall: item.volumeInfo.imageLinks?.smallThumbnail,
      language: item.volumeInfo.language,

      //Preserve previous values
      ...book
    };
  }

  return book;
}
