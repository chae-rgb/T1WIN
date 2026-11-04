
const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");

const entrance = document.getElementById("entrance");
const game = document.getElementById("game");

// 이미지 불러오기
// 캐릭터 5개 불러오기
const characterImages = [];

for (let i = 1; i <= 5; i++) {
  const img = new Image();
  img.src = `assets/character${i}.png`;
  characterImages.push(img);
}

// 랜덤 캐릭터 선택
let characterImg = characterImages[
  Math.floor(Math.random() * characterImages.length)
];

const backgroundImg = new Image();
backgroundImg.src = "assets/background.png";

const trashImages = [];

for (let i = 1; i <= 5; i++) {
  const img = new Image();
  img.src = `assets/trash${i}.png`;
  trashImages.push(img);
}

// 게임 기본 설정
let player = { x: 450, y: 250 };
let score = 0;
let nickname = "";
let trash = [];
const keys = {};

// 쓰레기 랜덤 생성
function createTrash() {
  trash = [];

  for (let i = 0; i < 20; i++) {
    const randomImage = Math.floor(
      Math.random() * trashImages.length
    );

    trash.push({
      x: 30 + Math.random() * 840,
      y: 30 + Math.random() * 440,
      image: randomImage
    });
  }
}

// 게임 입장
document.getElementById("enter").onclick = () => {
  nickname = document
    .getElementById("nickname")
    .value.trim();

  if (!nickname) {
    alert("닉네임을 입력해 주세요!");
    return;
  }

  entrance.hidden = true;
  game.hidden = false;
  // 입장할 때 랜덤 캐릭터 선택
characterImg = characterImages[
  Math.floor(Math.random() * characterImages.length)
];

  score = Number(localStorage.getItem("score") || 0);

  player = { x: 450, y: 250 };

  createTrash();
  updateUI();
  draw();
};

// 게임 나가기
document.getElementById("leave").onclick = () => {
  game.hidden = true;
  entrance.hidden = false;
};

// 키보드 입력
document.addEventListener("keydown", (e) => {
  if (game.hidden) return;

  const key = e.key.toLowerCase();

  if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
    e.preventDefault();
  }

  keys[key] = true;

  if (key === "7" && !e.repeat) {
    pickTrash();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// 캐릭터 이동
function movePlayer() {
  if (keys["arrowup"] || keys["w"]) player.y -= 3;
  if (keys["arrowdown"] || keys["s"]) player.y += 3;
  if (keys["arrowleft"] || keys["a"]) player.x -= 3;
  if (keys["arrowright"] || keys["d"]) player.x += 3;

  player.x = Math.max(20, Math.min(880, player.x));
  player.y = Math.max(20, Math.min(480, player.y));
}

// 쓰레기 줍기
function pickTrash() {
  let nearestIndex = -1;
  let nearestDistance = Infinity;

  trash.forEach((item, index) => {
    const dx = player.x - item.x;
    const dy = player.y - item.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  if (nearestDistance < 110) {
    trash.splice(nearestIndex, 1);

    score++;

    localStorage.setItem("score", score);

    document.getElementById("message").textContent =
      "#T1WIN";

    if (trash.length === 0) {
      createTrash();
    }

    updateUI();

  } else {
    document.getElementById("message").textContent =
      "조금 더 가까이";
  }
}

// 점수 업데이트
function updateUI() {
  document.getElementById("score").textContent = score;

  document.getElementById("gauge").textContent =
    score % 100;
}

// 게임 화면 그리기
function draw() {
  if (game.hidden) return;

  ctx.clearRect(0, 0, 900, 500);
  ctx.imageSmoothingEnabled = false;

  // 배경
  if (backgroundImg.complete && backgroundImg.naturalWidth > 0) {
    ctx.drawImage(backgroundImg, 0, 0, 900, 500);
  } else {
    ctx.fillStyle = "#A9D69A";
    ctx.fillRect(0, 0, 900, 500);
  }

  // 쓰레기 이미지
  trash.forEach(item => {
    const img = trashImages[item.image];

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(
        img,
        item.x - 20,
        item.y - 20,
        40,
        40
      );
    }
  });

  // 캐릭터 이미지
  if (characterImg.complete && characterImg.naturalWidth > 0) {
    ctx.drawImage(
      characterImg,
      player.x - 75,
      player.y - 75,
      150,
      150
    );
  }

  // 캐릭터 이동
  movePlayer();

  requestAnimationFrame(draw);
}
