<template>
  <div class="container">
    <canvas id="canvas"
      v-bind:style="{ 'width': canvasWith, 'height': canvasHeight }"
    ></canvas>
  </div>
</template>

<script>
export default {
  name: 'canvas',
  props: ['canvasWith', 'canvasHeight'],
  methods: {
    init () {
      let AudioContext = window.AudioContext || window.webkitAudioContext;
      let audioContext = new AudioContext();
      let analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser = audioContext.createAnalyser();

      // let audio = document.getElementById('audio');
      let audioSrc = audioContext.createMediaElementSource(audioDomEn);
      audioSrc.connect(analyser);
      analyser.connect(audioContext.destination);
      let canvas = document.getElementById('canvas');

      let ctx = canvas.getContext('2d');
      let cwidth = canvas.width;
      let cheight = canvas.height - 2;
      let meterWidth = 10; //方块的宽度
      let gap = 10; //方块的间距
      let capHeight = 10;
      let meterNum = cwidth / (meterWidth + gap);
      let gradient = ctx.createLinearGradient(0, 0, 0, cheight);
      gradient.addColorStop(1, '#00ff00');
      gradient.addColorStop(0.8, '#ffff00');
      gradient.addColorStop(0, '#ff0000');
      ctx.fillStyle = gradient;//填充

      let array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let step = Math.round(array.length / meterNum);
      ctx.clearRect(0, 0, cwidth, cheight);
      for (let i = 0; i < meterNum; i++) {
          let value = array[i * step];
          ctx.fillRect(i * (meterWidth+gap) , cheight - value + capHeight, meterWidth, cheight||capHeight); 
      }
      requestAnimationFrame(render);
    }
  }
}
</script>