export function createHtml(html, css, products) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="connect-src 'self' blob: data: https://*.w3s.link https://*.nftstorage.link https://*.dweb.link https://ipfs.io/ipfs/ https://*.githubusercontent.com https://tableland.network https://*.tableland.network https://api.devnet.solana.com/">
    <title>Document</title>
   <style>${css}</style>
   <script type="module" crossorigin src="https://bafybeiaslfltwump3lytd3p4ifdsr7yx6okqqi5ik7r74ecqapkiqnhezq.ipfs.w3s.link/index-B1bimilV.js"></script>
  </head>

    ${html}
    <script>
    
    </script>
  </html>`;
}
