let model, webcam, maxPredictions;

async function init() {
    const modelURL = 'teachableModel/model.json';
    const metadataURL = 'model/metadata.json';
    model = await tmImage.load(modelURL, metadataURL); // 모델 로드
    maxPredictions = model.getTotalClasses();

    // 웹캠 세팅
    const flip = true; // 좌우 반전
    webcam = new tmImage.Webcam(400, 400, flip); // width, height
    await webcam.setup(); // 웹캠 권한 요청
    await webcam.play();
    document.getElementById('webcam-container').appendChild(webcam.canvas);

    window.requestAnimationFrame(loop); // 반복 실행
}

async function loop() {
    webcam.update(); // 웹캠 프레임 업데이트
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let resultText = '';
    prediction.forEach(p => {
        resultText += `${p.className}: ${(p.probability*100).toFixed(2)}%<br>`;
    });
    document.getElementById('label-container').innerHTML = resultText;
}

// 초기화 실행
init();

