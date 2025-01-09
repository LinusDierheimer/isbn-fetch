import type { FetchOptions, Book } from ".";
import { parseHTML } from "./util";

function parsePages(pages: string): number | undefined {
  const match = pages.match(/(\d+)/);
  if (!match) return NaN;
  return parseInt(match[0]);
}

/**
 * Fetches a book from amazon.com.
 *
 * @param isbn the ISBN to fetch. Should be a valid ISBN-10 or ISBN-13.
 * @param fetchOptions fetch options to pass to fetch.
 * @returns a Book object with the fetched data.
 */
export default async function amazonWebscrape(isbn: string, fetchOptions?: FetchOptions): Promise<Book> {
  const searchResponse = await fetch(`https://www.amazon.com/s?k=${isbn.replace(/-/g, "")}`, fetchOptions);
  if (!searchResponse.ok)
    throw new Error("fetch amazonWebscrape search failed: " + searchResponse.statusText);

  const searchDoc = await parseHTML(await searchResponse.text());
  const link = searchDoc.querySelector(".s-result-item .a-link-normal")?.getAttribute("href");
  if (!link)
    throw new Error("amazonWebscrape: link not found");

  const bookResponse = await fetch(`https://www.amazon.com${link}`, fetchOptions);
  if (!bookResponse.ok)
    throw new Error("fetch amazonWebscrape book failed: " + bookResponse.statusText);

  const bookDoc = await parseHTML(await bookResponse.text());

  const image = bookDoc.querySelector("#main-image-container .imgTagWrapper img")?.getAttribute("src") ?? undefined;

  let book: Book = {
    title: bookDoc.querySelector("#productTitle")?.textContent?.trim() ?? undefined,
    thumbnail: image,
    thumbnailSmall: image,
    description: bookDoc.querySelector("#bookDescription_feature_div span:not([class])")?.textContent?.trim() ?? undefined,
  }

  const ol = bookDoc.querySelector("#rich_product_information ol");
  for (const li of ol?.querySelectorAll("li") ?? []) {
    const key = li.querySelector(".rpi-attribute-label span")?.textContent?.trim();
    if (!key) continue;

    const value = li.querySelector(".rpi-attribute-value span")?.textContent?.trim();
    if (!value) continue;

    switch (key) {
      case "Print length": book.pageCount = parsePages(value); break;
      case "Language": book.language = value; break;
      case "Publisher": book.publishers = [value]; break;
      case "Publication date": book.publishedDate = value; break;
    }
  }

  return book;
}
