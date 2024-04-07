export function createHtml(html, css, products) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
   <style>${css}</style>
   <script type="module" crossorigin src="https://bafybeibv7x3c6vyap4iz7gsli7wt5q6xxo2k476bzshi5lutn5juw4k2ue.ipfs.w3s.link/index-XtzKWkoY.js"></script>
  </head>

    ${html}
    <script>
    
    </script>
  </html>`;
}
