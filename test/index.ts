import IsbnFetch from "../src/index";

(async () => {
    const book = await IsbnFetch.fetch('978-3-453-31716-1');
    console.log(book);
})();
