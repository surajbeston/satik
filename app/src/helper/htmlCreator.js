export function createHtml(html, css, products) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
   <style>${css}</style>
  </head>

    ${html}
    <script>
    
    const products = document.querySelectorAll('[class^="product-"]');
  products.forEach(element => {
    element.addEventListener('click', () =>productBuy(element.getAttribute('class').split('-')[1]))
  });
  function productBuy(productId) {
    console.log('your purchase for product is added ', productId);
  }
console.log("called and products", products);
    
    </script>
  </html>`;
}
