export async function parseHTML(html: string): Promise<Document> {
  if(typeof DOMParser !== "undefined")
    return new DOMParser().parseFromString(html, "text/html");

  try {
    const { JSDOM, VirtualConsole } = await import("jsdom");
    return new JSDOM(html, {
      virtualConsole: new VirtualConsole() // suppress JSDOM warnings
    }).window.document;
  } catch {}

  throw new Error("DOMParser is undefined and JSDOM is not available");
}
