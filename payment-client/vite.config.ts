import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ nodePolyfills({include: ['stream'], globals: {Buffer: true, process: true}})],

	resolve: {
		alias: {
		  crypto: 'crypto-browserify',
		},
	  },

});

