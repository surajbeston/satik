<template>
  <div class="editor-container">
    <div style="width: 100%" id="gjs"></div>
    <button @click="getCode">Get Code</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
// grapes and grapes plugins
import grapesjs from "grapesjs";
import grapesjsblocks from "grapesjs-blocks-basic";
import webpage from "grapesjs-preset-webpage";
import grjNavbar from "grapesjs-navbar";

import "grapesjs/dist/css/grapes.min.css";
// web3 storage
import { createClient } from "/home/badu/workspace/satik/app/src/client.js";

const editor = ref(null);

onMounted(() => {
  editor.value = grapesjs.init({
    container: "#gjs",
    plugins: [grapesjsblocks, webpage, grjNavbar],
  });
});
const getCode = async () => {
  const html = editor.value.getHtml();
  const cssCode = editor.value.getCss({ clean: true });
  const jsCode = editor.value.getJs();
  //   combine css to the html file
  let code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
  ${cssCode}
  </style>
</head>

  ${html}
 
</html>`;

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
</style>
