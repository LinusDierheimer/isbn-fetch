import type { Book, FetchOptions } from ".";
import { parseHTML } from "./util";

function parseText(elment: Element): string | undefined {
  const text = elment.textContent?.trim();
  return text?.startsWith("Random") ? undefined : text;
}

function parseAuthors(td: HTMLTableCellElement): string[] | undefined {
  const ankors = [...td.querySelectorAll("a")];
  const names = ankors.map(a => parseText(a)).filter(name => name !== undefined);
  return names.length > 0 ? names : undefined;
}

/**
 * Fetches a book from isbndb.com.
 *
 * Note: This function only supports the following fields:
 * - isbn10
 * - isbn13
 * - title
 * - authors
 * - thumbnail
 * - thumbnailSmall (same as thumbnail)
 *
 * @param isbn the ISBN to fetch. Should be a valid ISBN-10 or ISBN-13.
 * @param fetchOptions fetch options to pass to fetch.
 * @returns a Book object with the fetched data.
 */
export default async function isbndbWebscrape(isbn: string, fetchOptions?: FetchOptions): Promise<Book> {
  const response = await fetch(`https://isbndb.com/book/${isbn.replace(/-/g, "")}`, fetchOptions);
  if (!response.ok)
    throw new Error("fetch isbndbWebscrape failed: " + response.statusText);

  const doc = await parseHTML(await response.text());

  const image = doc.querySelector(".artwork object")?.getAttribute("data") ?? undefined;
  const bookTable = doc.querySelector(".book-table");

  let book: Book = {
    thumbnail: image,
    thumbnailSmall: image,
    title: bookTable?.querySelector("h1")?.textContent ?? undefined,
  }

  const trs = bookTable?.querySelectorAll("tr") ?? [];
  for (const tr of trs) {
    const th = tr.querySelector("th")?.textContent?.trim();
    const td = tr.querySelector("td");
    if (!th || !td)
      continue;

    switch (th) {
      case "ISBN:": book.isbn10 = parseText(td); break;
      case "ISBN13:": book.isbn13 = parseText(td); break;
      case "Authors:": book.authors = parseAuthors(td); break;

      //Everything else seems to be always the same to prevent webscraping lol
    }
  }

  return book;
}
