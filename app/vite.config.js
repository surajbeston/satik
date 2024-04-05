import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), nodePolyfills({include: ['stream'], globals: {Buffer: true, process: true}})],
  define: {
    'process.env.ANCHOR_BROWSER': true
	},
	// resolve: {
	// 	alias: {
	// 		'@': path.resolve(__dirname, 'src'),
	// 	}
	// },


	// resolve: {
	// 	alias: {
	// 	  crypto: 'crypto-browserify',
	// 	},
	//   },

});

