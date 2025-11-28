let model, webcam, maxPredictions;

// 모델 초기화
async function init() {
    const modelURL = 'model/model.json';
    const metadataURL = 'model/metadata.json';
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // 웹캠 세팅
    const flip = true; // 좌우 반전
    webcam = new tmImage.Webcam(400, 400, flip); // width, height
    await webcam.setup(); // 웹캠 권한 요청
    await webcam.play();
    document.getElementById('webcam-container').appendChild(webcam.canvas);

    // 프레임마다 예측
    window.requestAnimationFrame(loop);
}

// 루프 함수
async function loop() {
    webcam.update(); // 웹캠 캡처
    await predict();
    window.requestAnimationFrame(loop);
}

// 예측 함수
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let resultText = '';
    prediction.forEach(p => {
        resultText += `${p.className}: ${(p.probability*100).toFixed(2)}%<br>`;
    });
    document.getElementById('label-container').innerHTML = resultText;
}

// 초기화
init();
