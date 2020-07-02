// communicate with parent about iframe size
// https://medium.com/better-programming/how-to-automatically-resize-an-iframe-7be6bfbb1214
let height;

const sendPostMessage = () => {
  if (height !== document.getElementById('map').offsetHeight) {
    height = document.getElementById('map').offsetHeight;
    window.parent.postMessage({
      frameHeight: height
    }, '*');
    console.log(height);
  }
}

window.onload = () => sendPostMessage();
window.onresize = () => sendPostMessage();