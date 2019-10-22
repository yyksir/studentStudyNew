(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{1646:function(module,__webpack_exports__,__webpack_require__){"use strict";eval("__webpack_require__.r(__webpack_exports__);\n\n// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./pages/test/courseTest/components/Canvas.vue?vue&type=template&id=f15e3688&\nvar Canvasvue_type_template_id_f15e3688_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:\"container\"},[_c('canvas',{style:({ 'width': _vm.canvasWith, 'height': _vm.canvasHeight }),attrs:{\"id\":\"canvas\"}})])}\nvar staticRenderFns = []\n\n\n// CONCATENATED MODULE: ./pages/test/courseTest/components/Canvas.vue?vue&type=template&id=f15e3688&\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.typed.uint8-array.js\nvar es6_typed_uint8_array = __webpack_require__(1588);\n\n// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/test/courseTest/components/Canvas.vue?vue&type=script&lang=js&\n\n//\n//\n//\n//\n//\n//\n//\n//\n/* harmony default export */ var Canvasvue_type_script_lang_js_ = ({\n  name: 'canvas',\n  props: ['canvasWith', 'canvasHeight'],\n  methods: {\n    init: function init() {\n      var AudioContext = window.AudioContext || window.webkitAudioContext;\n      var audioContext = new AudioContext();\n      var analyser = audioContext.createAnalyser();\n      analyser.fftSize = 256;\n      analyser = audioContext.createAnalyser(); // let audio = document.getElementById('audio');\n\n      var audioSrc = audioContext.createMediaElementSource(audioDomEn);\n      audioSrc.connect(analyser);\n      analyser.connect(audioContext.destination);\n      var canvas = document.getElementById('canvas');\n      var ctx = canvas.getContext('2d');\n      var cwidth = canvas.width;\n      var cheight = canvas.height - 2;\n      var meterWidth = 10; //方块的宽度\n\n      var gap = 10; //方块的间距\n\n      var capHeight = 10;\n      var meterNum = cwidth / (meterWidth + gap);\n      var gradient = ctx.createLinearGradient(0, 0, 0, cheight);\n      gradient.addColorStop(1, '#00ff00');\n      gradient.addColorStop(0.8, '#ffff00');\n      gradient.addColorStop(0, '#ff0000');\n      ctx.fillStyle = gradient; //填充\n\n      var array = new Uint8Array(analyser.frequencyBinCount);\n      analyser.getByteFrequencyData(array);\n      var step = Math.round(array.length / meterNum);\n      ctx.clearRect(0, 0, cwidth, cheight);\n\n      for (var i = 0; i < meterNum; i++) {\n        var value = array[i * step];\n        ctx.fillRect(i * (meterWidth + gap), cheight - value + capHeight, meterWidth, cheight || capHeight);\n      }\n\n      requestAnimationFrame(render);\n    }\n  }\n});\n// CONCATENATED MODULE: ./pages/test/courseTest/components/Canvas.vue?vue&type=script&lang=js&\n /* harmony default export */ var components_Canvasvue_type_script_lang_js_ = (Canvasvue_type_script_lang_js_); \n// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js\nvar componentNormalizer = __webpack_require__(70);\n\n// CONCATENATED MODULE: ./pages/test/courseTest/components/Canvas.vue\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(componentNormalizer[\"a\" /* default */])(\n  components_Canvasvue_type_script_lang_js_,\n  Canvasvue_type_template_id_f15e3688_render,\n  staticRenderFns,\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* harmony default export */ var Canvas = __webpack_exports__[\"default\"] = (component.exports);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTY0Ni5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3BhZ2VzL3Rlc3QvY291cnNlVGVzdC9jb21wb25lbnRzL0NhbnZhcy52dWU/NDA1NyIsIndlYnBhY2s6Ly8vQ2FudmFzLnZ1ZT84OTMxIiwid2VicGFjazovLy8uL3BhZ2VzL3Rlc3QvY291cnNlVGVzdC9jb21wb25lbnRzL0NhbnZhcy52dWU/N2UzZiIsIndlYnBhY2s6Ly8vLi9wYWdlcy90ZXN0L2NvdXJzZVRlc3QvY29tcG9uZW50cy9DYW52YXMudnVlP2RiNjEiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHJlbmRlciA9IGZ1bmN0aW9uICgpIHt2YXIgX3ZtPXRoaXM7dmFyIF9oPV92bS4kY3JlYXRlRWxlbWVudDt2YXIgX2M9X3ZtLl9zZWxmLl9jfHxfaDtyZXR1cm4gX2MoJ2Rpdicse3N0YXRpY0NsYXNzOlwiY29udGFpbmVyXCJ9LFtfYygnY2FudmFzJyx7c3R5bGU6KHsgJ3dpZHRoJzogX3ZtLmNhbnZhc1dpdGgsICdoZWlnaHQnOiBfdm0uY2FudmFzSGVpZ2h0IH0pLGF0dHJzOntcImlkXCI6XCJjYW52YXNcIn19KV0pfVxudmFyIHN0YXRpY1JlbmRlckZucyA9IFtdXG5cbmV4cG9ydCB7IHJlbmRlciwgc3RhdGljUmVuZGVyRm5zIH0iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgPGNhbnZhcyBpZD1cImNhbnZhc1wiXHJcbiAgICAgIHYtYmluZDpzdHlsZT1cInsgJ3dpZHRoJzogY2FudmFzV2l0aCwgJ2hlaWdodCc6IGNhbnZhc0hlaWdodCB9XCJcclxuICAgID48L2NhbnZhcz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBuYW1lOiAnY2FudmFzJyxcclxuICBwcm9wczogWydjYW52YXNXaXRoJywgJ2NhbnZhc0hlaWdodCddLFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGluaXQgKCkge1xyXG4gICAgICBsZXQgQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xyXG4gICAgICBsZXQgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgICBsZXQgYW5hbHlzZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQW5hbHlzZXIoKTtcclxuICAgICAgYW5hbHlzZXIuZmZ0U2l6ZSA9IDI1NjtcclxuICAgICAgYW5hbHlzZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQW5hbHlzZXIoKTtcclxuXHJcbiAgICAgIC8vIGxldCBhdWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdWRpbycpO1xyXG4gICAgICBsZXQgYXVkaW9TcmMgPSBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKGF1ZGlvRG9tRW4pO1xyXG4gICAgICBhdWRpb1NyYy5jb25uZWN0KGFuYWx5c2VyKTtcclxuICAgICAgYW5hbHlzZXIuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xyXG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xyXG5cclxuICAgICAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICBsZXQgY3dpZHRoID0gY2FudmFzLndpZHRoO1xyXG4gICAgICBsZXQgY2hlaWdodCA9IGNhbnZhcy5oZWlnaHQgLSAyO1xyXG4gICAgICBsZXQgbWV0ZXJXaWR0aCA9IDEwOyAvL+aWueWdl+eahOWuveW6plxyXG4gICAgICBsZXQgZ2FwID0gMTA7IC8v5pa55Z2X55qE6Ze06LedXHJcbiAgICAgIGxldCBjYXBIZWlnaHQgPSAxMDtcclxuICAgICAgbGV0IG1ldGVyTnVtID0gY3dpZHRoIC8gKG1ldGVyV2lkdGggKyBnYXApO1xyXG4gICAgICBsZXQgZ3JhZGllbnQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgY2hlaWdodCk7XHJcbiAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAnIzAwZmYwMCcpO1xyXG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC44LCAnI2ZmZmYwMCcpO1xyXG4gICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJyNmZjAwMDAnKTtcclxuICAgICAgY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50Oy8v5aGr5YWFXHJcblxyXG4gICAgICBsZXQgYXJyYXkgPSBuZXcgVWludDhBcnJheShhbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudCk7XHJcbiAgICAgIGFuYWx5c2VyLmdldEJ5dGVGcmVxdWVuY3lEYXRhKGFycmF5KTtcclxuICAgICAgbGV0IHN0ZXAgPSBNYXRoLnJvdW5kKGFycmF5Lmxlbmd0aCAvIG1ldGVyTnVtKTtcclxuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjd2lkdGgsIGNoZWlnaHQpO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1ldGVyTnVtOyBpKyspIHtcclxuICAgICAgICAgIGxldCB2YWx1ZSA9IGFycmF5W2kgKiBzdGVwXTtcclxuICAgICAgICAgIGN0eC5maWxsUmVjdChpICogKG1ldGVyV2lkdGgrZ2FwKSAsIGNoZWlnaHQgLSB2YWx1ZSArIGNhcEhlaWdodCwgbWV0ZXJXaWR0aCwgY2hlaWdodHx8Y2FwSGVpZ2h0KTsgXHJcbiAgICAgIH1cclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbjwvc2NyaXB0PiIsImltcG9ydCBtb2QgZnJvbSBcIi0hLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMi0wIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vQ2FudmFzLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qcyZcIjsgZXhwb3J0IGRlZmF1bHQgbW9kOyBleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yLTAhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2luZGV4LmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhLi9DYW52YXMudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzJlwiIiwiaW1wb3J0IHsgcmVuZGVyLCBzdGF0aWNSZW5kZXJGbnMgfSBmcm9tIFwiLi9DYW52YXMudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPWYxNWUzNjg4JlwiXG5pbXBvcnQgc2NyaXB0IGZyb20gXCIuL0NhbnZhcy52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anMmXCJcbmV4cG9ydCAqIGZyb20gXCIuL0NhbnZhcy52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anMmXCJcblxuXG4vKiBub3JtYWxpemUgY29tcG9uZW50ICovXG5pbXBvcnQgbm9ybWFsaXplciBmcm9tIFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9ydW50aW1lL2NvbXBvbmVudE5vcm1hbGl6ZXIuanNcIlxudmFyIGNvbXBvbmVudCA9IG5vcm1hbGl6ZXIoXG4gIHNjcmlwdCxcbiAgcmVuZGVyLFxuICBzdGF0aWNSZW5kZXJGbnMsXG4gIGZhbHNlLFxuICBudWxsLFxuICBudWxsLFxuICBudWxsXG4gIFxuKVxuXG5leHBvcnQgZGVmYXVsdCBjb21wb25lbnQuZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQXBDQTtBQUhBOztBQ1RBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///1646\n")}}]);