import type { Book } from ".";

const OPENLIBRARY_BASE_URL = "https://openlibrary.org";
const OPENLIBRARY_COVER_URL = "https://covers.openlibrary.org/b/id";

type OpenLibraryReference = {
  key: string;
};

type OpenLibraryBook = {
  title?: string;
  publishers?: string[];
  publish_date?: string;
  authors?: OpenLibraryReference[];
  works?: OpenLibraryReference[];
  languages?: OpenLibraryReference[];
  description?: string;
  isbn_10?: string[];
  isbn_13?: string[];
  covers?: string[];
};

type OpenLibraryAuthor = {
  personal_name: string | undefined;
  name: string;
};

type OpenLibraryLanguage = {
  name: string;
  identifiers: {
    iso_639_1: string[];
  };
  name_translated: {
    [key: string]: string[];
  }
};

type OpenLibraryWork = {
  subjects: string[];
};

async function parseGenres(works?: OpenLibraryReference[]): Promise<string[] | undefined> {
  if (!works || works.length === 0)
    return undefined;

  const subjects = (await Promise.all(works.map(async work => {
    try {
      const response = await fetch(`${OPENLIBRARY_BASE_URL}${work.key}.json`);
      if (!response.ok)
        throw new Error("fetch openlibrary work failed: " + response.statusText);

      const data = await response.json() as OpenLibraryWork;
      return data.subjects;
    } catch {
      return undefined;
    }
  }))) //==> (string[] | undefined)[]
    .filter(a => a !== undefined) //==> string[][]
    .reduce((acc, val) => acc.concat(val), []) //==> string[]
    .filter((v, i, a) => a.indexOf(v) === i) //==> string[] (unique)

  if (subjects.length === 0)
    return undefined;

  //Openlibrary returns a lot of junk. We are only interested in stuff we know is a genre
  let keywords = [
    "fiction", "novel", "fantasy", "mystery", "thriller", "romance", "horror", "dystopia", "biography"
  ];

  let result = [];

  for (const subject of subjects) {
    //Openlibrary returns some subjects that are not genres, like award:hugo_award=novel
    if (subject.includes(":"))
      continue;

    const subjectLowercase = subject.toLowerCase();

    for (const keyword of keywords) {
      if (!subjectLowercase.includes(keyword))
        continue;

      result.push(subjectLowercase[0].toUpperCase() + subjectLowercase.slice(1));
      keywords = keywords.filter(k => k !== keyword);
      break;
    }

    if (result.length >= 3 || keywords.length === 0)
      break;
  }

  return result.length > 0 ? result : undefined;
}

async function parseLanguages(languages?: OpenLibraryReference[]): Promise<string | undefined> {
  if (!languages || languages.length === 0)
    return undefined;

  try {
    const response = await fetch(`${OPENLIBRARY_BASE_URL}${languages[0].key}.json`);
    if (!response.ok)
      throw new Error("fetch openlibrary language failed: " + response.statusText);

    const data = await response.json() as OpenLibraryLanguage;

    for (const id of data.identifiers.iso_639_1 || []) {
      if (data.name_translated[id] && data.name_translated[id].length > 0)
        return data.name_translated[id][0];
    }

    return data.name;
  } catch {
    return undefined;
  }
}

async function parseAuthors(authors?: OpenLibraryReference[]): Promise<string[] | undefined> {
  if (!authors || authors.length === 0)
    return undefined

  return (await Promise.all(authors.map(async author => {
    try {
      const response = await fetch(`${OPENLIBRARY_BASE_URL}${author.key}.json`);
      if (!response.ok)
        throw new Error("fetch openlibrary author failed: " + response.statusText);

      const data = await response.json() as OpenLibraryAuthor;
      return data.personal_name || data.name;
    } catch {
      return undefined;
    }
  })))
    .filter(a => a !== undefined);
}

function parseIsbn(isbn?: string[]): string | undefined {
  if (!isbn || isbn.length === 0)
    return undefined;

  return isbn.filter(i => i.length > 0).shift();
}

function parseCover(covers: string[] | undefined, size: "S" | "M" | "L"): string | undefined {
  if (!covers || covers.length === 0)
    return undefined;

  return `${OPENLIBRARY_COVER_URL}/${covers[0]}-${size}.jpg`;
}

/**
 * Fetches a book from Open Library.
 *
 * @throws an error if the fetch fails.
 * @param isbn the ISBN to fetch. Should be a valid ISBN-10 or ISBN-13.
 * @returns a Book object with the fetched data.
 */
export default async function openlibrary(isbn: string): Promise<Book> {
  const response = await fetch(`${OPENLIBRARY_BASE_URL}/isbn/${isbn}.json`);
  if (!response.ok)
    throw new Error("fetch openlibrary failed: " + response.statusText);

  const data = await response.json() as OpenLibraryBook;

  const [authors, genres, language] = await Promise.all([
    parseAuthors(data.authors),
    parseGenres(data.works),
    parseLanguages(data.languages)
  ]);

  return {
    isbnSource: isbn,
    isbn10: parseIsbn(data.isbn_10),
    isbn13: parseIsbn(data.isbn_13),
    title: data.title,
    authors: authors,
    publishedDate: data.publish_date,
    genres: genres,
    language: language,
    thumbnail: parseCover(data.covers, "L"),
    thumbnailSmall: parseCover(data.covers, "S"),
    description: data.description,
    publishers: data.publishers,
  };
}
