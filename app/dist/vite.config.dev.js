"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vite = require("vite");

var _pluginVue = _interopRequireDefault(require("@vitejs/plugin-vue"));

var _path = _interopRequireDefault(require("path"));

var _vitePluginNodePolyfills = require("vite-plugin-node-polyfills");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// https://vitejs.dev/config/
var _default = (0, _vite.defineConfig)({
  plugins: [(0, _pluginVue["default"])(), (0, _vitePluginNodePolyfills.nodePolyfills)({
    include: ["stream"],
    globals: {
      Buffer: true,
      process: true
    }
  })],
  define: {
    "process.env.ANCHOR_BROWSER": true
  },
  // resolve: {
  // 	alias: {
  // 		'@': path.resolve(__dirname, 'src'),
  // 	}
  // },
  resolve: {
    alias: {
      crypto: "crypto-browserify"
    }
  }
});

exports["default"] = _default;