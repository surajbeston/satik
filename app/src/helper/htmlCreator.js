export function createHtml(html, css, products) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link
      href="https://cdn.jsdelivr.net/npm/vue3-toastify@0.1.13/dist/index.css"
      rel="stylesheet"
    />
   <style>${css}</style>
   <script type="module" crossorigin src="https://bafybeiebwkku2gjunygdcz7xrqciykgkbe75c2wz4ctqknug6n6snzihkq.ipfs.w3s.link/index-DKjUaonB.js"></script>
  </head>

    ${html}
    <script>
    
    </script>
  </html>`;
}
