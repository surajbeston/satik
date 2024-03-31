<template>
  <div class="editor-container">
    <div ref="editorEl" style="width: 100%" id="gjs"></div>
    <button @click="getCode">Get Code</button>
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";
import { onMounted, ref } from "vue";
// grapes and grapes plugins
import grapesjs from "grapesjs";
import grapesjsblocks from "grapesjs-blocks-basic";

import webpage from "grapesjs-preset-webpage";
import grjNavbar from "grapesjs-navbar";
import plugin from "grapesjs-advance-components";
import { createHtml } from "../helper/htmlCreator";

import "grapesjs/dist/css/grapes.min.css";
// web3 storage
import { createClient } from "/home/badu/workspace/satik/app/src/helper/client";

const editor = ref(null);
const editorEl = ref(null);
const selectedProduct = ref(null);
const products = [
  {
    id: 1,
    name: "Product 1",
    image: "https://picsum.photos/id/1005/200/300",
  },
  {
    id: 2,
    name: "Product 2",
    image: "https://picsum.photos/id/1005/200/300",
  },
];

onMounted(async () => {
  editor.value = grapesjs.init({
    container: "#gjs",
    plugins: [grapesjsblocks, webpage, grjNavbar, plugin],
  });

  editor.value.on("component:selected", (model) => {
    let className;
    if (selectedProduct.value) {
      className = `product-${selectedProduct.value.product.id}`;
      model.setAttributes({
        class: className,
      });

      toast("Product linked.", { autoClose: 1000 });
      // clean selected product and remove clicked class
      selectedProduct.value.div.classList.remove("clicked");
      selectedProduct.value = null;
    }
  });

  setTimeout(() => {
    insetProduct();
  }, 1000);
});

const productClicked = (div, product) => {
  // unselect, selected component  on canvas
  editor.value.select(null);

  selectedProduct.value = null;
  if (div.classList.contains("selected")) {
    div.classList.remove("selected");
  } else {
    toast("Product Selected. click on component to link product", {
      autoClose: 2000,
    });
    selectedProduct.value = { div, product };
    if (selectedProduct.value.div) div.classList.add("selected");
  }
};
const insetProduct = () => {
  const element = editorEl.value.querySelector(
    "div.gjs-pn-panels >div:last-child"
  );
  products.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("product_container");
    div.addEventListener("click", () => productClicked(div, product));
    div.innerHTML = `
      <img class="product_image" src="${product.image}" alt="${product.name}"/>
      <p class="product_name">${product.name}</p>
    `;
    element.insertBefore(div, element.firstChild);
  });
};

const getCode = async () => {
  const html = editor.value.getHtml();
  const cssCode = editor.value.getCss({ clean: true });

  //   combine css to the html file
  const code = createHtml(html, cssCode, products);

  const files = [new File([code], "index.html")];
  await createClient(files);
};
</script>

<style>
.gjs-pn-devices-c {
  left: 0;
}
.editor-container {
  width: 1200px;
}
.product_container {
  width: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-block: 1rem;
  padding-block: 0.8rem;
}
.selected {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
  border: 1px solid #d97aa6;
}
.product_container:hover {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
}
.product_image {
  height: 50px;
  width: 50px;
  object-fit: cover;
}
</style>
