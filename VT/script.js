const idleImage = "images/idle.png";      // รูปเมื่อไม่พูด
const talkingImage = "images/talking.png"; // รูปเมื่อพูด
const pngtuberElement = document.getElementById("pngtuber");

// ตั้งค่า Web Audio API
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    analyser.fftSize = 512;
    microphone.connect(analyser);

    const threshold = 10; // กำหนดระดับเสียงที่ถือว่ากำลังพูด

    function detectTalking() {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        // เปลี่ยนภาพตามระดับเสียง
        if (volume > threshold) {
            pngtuberElement.src = talkingImage;
        } else {
            pngtuberElement.src = idleImage;
        }

        requestAnimationFrame(detectTalking);
    }

    detectTalking();
}).catch((err) => {
    console.error("ไมโครโฟนใช้งานไม่ได้:", err);
});
