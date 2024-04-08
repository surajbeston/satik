"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHtml = createHtml;

function createHtml(html, css, products) {
  return "<!DOCTYPE html>\n  <html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Document</title>\n    <link\n      href=\"https://cdn.jsdelivr.net/npm/vue3-toastify@0.1.13/dist/index.css\"\n      rel=\"stylesheet\"\n    />\n   <style>".concat(css, "</style>\n   <script type=\"module\" crossorigin src=\"https://bafybeiebwkku2gjunygdcz7xrqciykgkbe75c2wz4ctqknug6n6snzihkq.ipfs.w3s.link/index-DKjUaonB.js\"></script>\n  </head>\n\n    ").concat(html, "\n    <script>\n    \n    </script>\n  </html>");
}