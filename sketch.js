let questionTable;
let allQuestions = [];
let quizQuestions = []; // 儲存本次測驗的3個題目
let currentQuestionIndex = 0;
let score = 0;
let gameState = 'START'; // 遊戲狀態: START, QUESTION, FEEDBACK, RESULT

// 按鈕物件
let answerButtons = [];
let startButton, restartButton;

// 互動效果
let particles = [];
let feedbackMessage = '';
let feedbackColor;
let feedbackTimer = 0;

function preload() {
  // 載入 CSV 檔案，指定 'csv' 格式且沒有標頭
  questionTable = loadTable('questions.csv', 'csv');
}

function setup() {
  createCanvas(800, 600);
  processData();
  setupButtons();
  setupParticles();
  startGame();
}

function draw() {
  // 淺粉色背景
  background(255, 230, 240);
  drawParticles();

  // 根據不同的遊戲狀態繪製不同畫面
  switch (gameState) {
    case 'START':
      drawStartScreen();
      break;
    case 'QUESTION':
      drawQuestionScreen();
      break;
    case 'FEEDBACK':
      drawFeedbackScreen();
      break;
    case 'RESULT':
      drawResultScreen();
      break;
  }
}

// ---------------------------------
// 遊戲流程函數
// ---------------------------------

// 1. 處理CSV資料
function processData() {
  // 遍歷 CSV 的每一行
  for (let row of questionTable.getRows()) {
    allQuestions.push({
      question: row.getString(0),
      opA: row.getString(1),
      opB: row.getString(2),
      opC: row.getString(3),
      opD: row.getString(4),
      correct: row.getString(5) // 儲存 'A', 'B', 'C', or 'D'
    });
  }
}

// 2. 設定按鈕位置
function setupButtons() {
  // 開始按鈕
  startButton = { x: width / 2 - 100, y: height / 2 + 50, w: 200, h: 60, text: '開始測驗' };
  // 重新開始按鈕
  restartButton = { x: width / 2 - 100, y: height / 2 + 150, w: 200, h: 60, text: '重新開始' };

  // 四個答案按鈕
  let btnW = 350;
  let btnH = 80;
  let gap = 20;
  answerButtons.push({ x: 40, y: 250, w: btnW, h: btnH, option: 'A' });
  answerButtons.push({ x: 40 + btnW + gap, y: 250, w: btnW, h: btnH, option: 'B' });
  answerButtons.push({ x: 40, y: 250 + btnH + gap, w: btnW, h: btnH, option: 'C' });
  answerButtons.push({ x: 40 + btnW + gap, y: 250 + btnH + gap, w: btnW, h: btnH, option: 'D' });
}

// 3. 開始或重新開始遊戲
function startGame() {
  score = 0;
  currentQuestionIndex = 0;
    // 隨機排序所有問題，並取出前5題
    quizQuestions = shuffle(allQuestions).slice(0, 5);
  gameState = 'START';
}

// 4. 檢查答案
function checkAnswer(selectedOption) {
  let correctOption = quizQuestions[currentQuestionIndex].correct;

  if (selectedOption === correctOption) {
    score++;
    feedbackMessage = '答對了！';
    feedbackColor = color(0, 200, 100, 220); // 綠色
  } else {
    feedbackMessage = `答錯了... 正確答案是 ${correctOption}`;
    feedbackColor = color(200, 50, 50, 220); // 紅色
  }
  
  gameState = 'FEEDBACK';
  feedbackTimer = 90; // 顯示回饋 1.5 秒 (60fps * 1.5)
}

// 5. 進入下一題
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= quizQuestions.length) {
    gameState = 'RESULT';
  } else {
    gameState = 'QUESTION';
  }
}

// 6. 取得回饋用語
function getFeedbackText() {
  if (score === 3) return '太棒了，全部答對！';
  if (score >= 1) return '不錯喔，再接再厲！';
  return '別灰心，再試一次吧！';
}

// ---------------------------------
// 畫面繪製函數
// ---------------------------------

function drawStartScreen() {
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(0);
  textSize(48);
  text('p5.js 題庫測驗', width / 2, height / 2 - 100);
  textSize(24);
    text(`從 ${allQuestions.length} 題中隨機抽取 5 題`, width / 2, height / 2 - 30);
  
  // 繪製開始按鈕
  drawButton(startButton);
}

function drawQuestionScreen() {
  if (quizQuestions.length === 0) return; // 防止資料還沒載入
  
  let q = quizQuestions[currentQuestionIndex];
  
  // 繪製問題
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  fill(0);
  textSize(28);
  text(`第 ${currentQuestionIndex + 1} 題 / 3 題`, 40, 40);
  text(q.question, 40, 100, width - 80, 150); // 自動換行
  
  // 更新並繪製答案按鈕
  answerButtons[0].text = 'A. ' + q.opA;
  answerButtons[1].text = 'B. ' + q.opB;
  answerButtons[2].text = 'C. ' + q.opC;
  answerButtons[3].text = 'D. ' + q.opD;
  
  for (let btn of answerButtons) {
    drawButton(btn);
  }
}

function drawFeedbackScreen() {
  // 顯示回饋文字 (綠色或紅色)
    // 顯示回饋
    if (feedbackMessage === '答對了！') {
      // 綠色橢圓背景
      fill(0, 200, 100, 220);
      ellipse(width/2, height/2, 300, 200);
    } else {
      // 錯誤時的紅色全螢幕
      fill(feedbackColor);
      rect(0, 0, width, height);
    }
  
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(60);
  text(feedbackMessage, width / 2, height / 2);
  
  // 計時
  feedbackTimer--;
  if (feedbackTimer <= 0) {
    nextQuestion();
  }
}

function drawResultScreen() {
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(0);
  
  textSize(50);
  text('測驗結束！', width / 2, 150);
  
  textSize(36);
    // 計算百分比成績（每題20分）
    let percentageScore = score * 20;
    text(`你的成績: ${percentageScore} / 100`, width / 2, 250);
  
  textSize(24);
  fill(50, 50, 0); // 深色
    let feedbackText = '';
    if (percentageScore === 100) {
      feedbackText = '太棒了！完美的表現！';
      fill(0, 153, 0);
    } else if (percentageScore >= 60) {
      feedbackText = '做得不錯！繼續加油！';
      fill(0, 102, 153);
    } else {
      feedbackText = '再接再厲！';
      fill(153, 0, 0);
    }
    text(feedbackText, width / 2, 350);
  
  // 繪製重新開始按鈕
  drawButton(restartButton);
}

// ---------------------------------
// 互動與輔助函數
// ---------------------------------

// 繪製按鈕 (含 hover 效果)
function drawButton(btn) {
  let isHover = isMouseOver(btn);
  
  push(); // 保存繪圖狀態
  if (isHover) {
    fill(100, 180, 255); // hover 亮藍色
    stroke(255);
    strokeWeight(2);
    cursor(HAND); // 改變滑鼠游標
  } else {
    fill(50, 100, 200, 200); // 預設藍色
    noStroke();
  }
  rect(btn.x, btn.y, btn.w, btn.h, 10); // 圓角矩形
  
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(btn.text, btn.x, btn.y, btn.w, btn.h); // 按鈕文字
  pop(); // 恢復繪圖狀態
}

// 檢查滑鼠是否在按鈕上
function isMouseOver(btn) {
  return (mouseX > btn.x && mouseX < btn.x + btn.w &&
          mouseY > btn.y && mouseY < btn.y + btn.h);
}

// 滑鼠點擊事件
function mousePressed() {
  // 重設游標
  cursor(ARROW);

  if (gameState === 'START') {
    if (isMouseOver(startButton)) {
      gameState = 'QUESTION';
    }
  } else if (gameState === 'QUESTION') {
    for (let btn of answerButtons) {
      if (isMouseOver(btn)) {
        checkAnswer(btn.option);
        break; // 點擊後就停止檢查
      }
    }
  } else if (gameState === 'RESULT') {
    if (isMouseOver(restartButton)) {
      startGame();
    }
  }
}

// ---------------------------------
// 互動視覺效果 (背景粒子)
// ---------------------------------

function setupParticles() {
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      r: random(2, 5),
      alpha: random(50, 150)
    });
  }
}

function drawParticles() {
  for (let p of particles) {
    // 更新位置
    p.x += p.vx;
    p.y += p.vy;
    
    // 邊界環繞
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // 繪製
    noStroke();
    fill(255, p.alpha);
    ellipse(p.x, p.y, p.r);
  }
}

