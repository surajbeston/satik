<template>
    <div>
      <div id="gjs"></div>
    </div>
</template>

<script setup>
import { onMounted,ref } from 'vue'
import grapesjs from 'grapesjs'
import grapesjsblocks from 'grapesjs-blocks-basic';
import webpage from 'grapesjs-preset-webpage';
import 'grapesjs/dist/css/grapes.min.css'   


const editor = ref(null);


onMounted(() => {
  

   editor.value = grapesjs.init({
     container: '#gjs',
     height: '900px',
     width: '1000px',
     plugins: [grapesjsblocks,webpage],
    
   })
  

})
</script>

<style  >

.gjs-pn-devices-c{

  left: 0;

}
</style>