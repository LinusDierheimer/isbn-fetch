import type IsbnFetch from ".";

type GoogleBooksVolumeInfo = {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  industryIdentifiers: {
    type: string;
    identifier: string;
  }[];
  pageCount: number;
  categories: string[];
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
  language: string;
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

export default async function googlebooks(isbn: string): Promise<IsbnFetch.Book> {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
  if (!response.ok)
    throw new Error("fetch googlebooks failed: " + response.statusText);

  const data = await response.json() as GoogleBooksVolumeResponse;
  if (data.totalItems === 0) {
    throw new Error("No items found");
  }

  let book: IsbnFetch.Book = {
    isbnSource: isbn,
  };

  for(const item of data.items) {
    book = {
      isbn10: item.volumeInfo.industryIdentifiers.find(i => i.type === "ISBN_10")?.identifier,
      isbn13: item.volumeInfo.industryIdentifiers.find(i => i.type === "ISBN_13")?.identifier,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      publishers: item.volumeInfo.publisher ? [item.volumeInfo.publisher] : undefined,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description || item.searchInfo.textSnippet,
      pageCount: item.volumeInfo.pageCount,
      genres: item.volumeInfo.categories,
      thumbnail: item.volumeInfo.imageLinks.thumbnail,
      thumbnailSmall: item.volumeInfo.imageLinks.smallThumbnail,
      language: item.volumeInfo.language,

      //Preserve previous values
      ...book
    };
  }

  return book;
}
