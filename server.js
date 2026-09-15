const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// === SECURITY & CLEAN KEYWORD FILTER === //
const BANNED_KEYWORDS = ["욕설", "바보", "멍청이", "사기", "카지노", "대출", "돈입금", "광고", "꺼져", "죽어", "죽여", "비하"];

function sanitizeContent(text) {
  if (!text) return "";
  let cleanText = text;
  BANNED_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(keyword, "gi");
    cleanText = cleanText.replace(regex, "❤️[클린언어 차단됨]");
  });
  return cleanText;
}

// === LEVEL-BASED QUEST TEMPLATES === //
const LEVEL_QUESTS = {
  1: [
    { id: "l1_q1", title: "🚶‍♂️ 2분 산책 하기", exp: 20 },
    { id: "l1_q2", title: "🙆‍♂️ 아침에 일어나서 기지개 켜기", exp: 15 },
    { id: "l1_q3", title: "📱 스마트폰 5분간 안 보기", exp: 15 },
    { id: "l1_q4", title: "🍚 집밥 맛있게 먹기", exp: 20 },
    { id: "l1_q5", title: "🗣️ 가족들에게 안부 말 한마디 하기", exp: 25 },
    { id: "l1_q6", title: "✨ 오늘 하루 잘했다고 스스로에게 칭찬하기", exp: 15 },
    { id: "l1_q7", title: "🧹 방 책상 정리하기", exp: 20 }
  ],
  2: [
    { id: "l2_q1", title: "🚶‍♂️ 10분 동안 햇살 받으며 산책하기", exp: 25 },
    { id: "l2_q2", title: "🛌 아침에 일어나서 이불 깔끔하게 개기", exp: 20 },
    { id: "l2_q3", title: "📱 스마트폰 15분간 두고 거실 나가기", exp: 20 },
    { id: "l2_q4", title: "😊 거울을 보고 자신에게 한번 크게 웃어보기", exp: 20 },
    { id: "l2_q5", title: "🍵 가족이나 나 자신에게 따뜻한 차 한 잔 대접하기", exp: 25 },
    { id: "l2_q6", title: "📝 오늘 내가 감사했던 한 가지 적어보기", exp: 20 },
    { id: "l2_q7", title: "🧹 방 바닥 청소기 밀기 또는 닦기", exp: 25 }
  ],
  3: [
    { id: "l3_q1", title: "🚶‍♂️ 30분 야외 산책 또는 가벼운 러닝하기", exp: 35 },
    { id: "l3_q2", title: "🧘‍♂️ 아침에 일어나서 5분간 전신 스트레칭하기", exp: 30 },
    { id: "l3_q3", title: "📱 스마트폰 30분간 멀리하고 독서나 음악 감상하기", exp: 30 },
    { id: "l3_q4", title: "💬 가족이나 친구와 5분 동안 깊은 대화 나누기", exp: 35 },
    { id: "l3_q5", title: "🥗 직접 가벼운 요리나 집밥 차려먹기", exp: 30 },
    { id: "l3_q6", title: "🌟 나만의 버킷리스트와 내일의 작은 계획 작성하기", exp: 30 },
    { id: "l3_q7", title: "🧹 방 전체 창문 열고 대청소 및 환기하기", exp: 35 }
  ]
};

// Store Manager
function ensureStore() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
      users: [
        {
          username: "demo",
          password: "123",
          nickname: "용기있는 코로몬",
          partnerId: "agumon_line",
          level: 5,
          stage: 1,
          exp: 20,
          maxExp: 100,
          warmthTemp: 36.5,
          points: 1250,
          pointLogs: [
            { title: "회원가입 축하 온기 포인트", amount: 1000, date: new Date().toISOString() },
            { title: "기지개 켜기 퀘스트 완료", amount: 50, date: new Date().toISOString() },
            { title: "응원 받음 수신 보너스", amount: 200, date: new Date().toISOString() }
          ],
          redemptions: [],
          completedQuests: ["l1_q2"],
          customQuests: [{ id: "cq_1", title: "창문 열고 하늘 바라보기", exp: 15 }]
        },
        {
          username: "hope",
          password: "123",
          nickname: "다정한 뿔몬",
          partnerId: "gabumon_line",
          level: 5,
          stage: 1,
          exp: 60,
          maxExp: 100,
          warmthTemp: 37.5,
          points: 1500,
          pointLogs: [{ title: "온기 포인트 적립", amount: 500, date: new Date().toISOString() }],
          redemptions: [],
          completedQuests: ["l1_q1"],
          customQuests: []
        }
      ],
      posts: [
        {
          id: "post_1",
          author: "용기있는 코로몬",
          partnerId: "agumon_line",
          avatarStage: 1,
          warmthTemp: 36.5,
          content: "오늘 1단계 퀘스트로 기지개 켜기를 수행했어요! 작지만 뿌듯한 아침입니다.",
          createdAt: new Date().toISOString(),
          reactions: { warm: 5, support: 8, hello: 3 },
          reports: 0,
          isBlinded: false,
          comments: []
        }
      ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

function readStore() {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (err) {
    return { users: [], posts: [] };
  }
}

function writeStore(data) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper: Calculate stage from Level (Level 1~10: Stage 1 / Lv 11~20: Stage 2 / Lv 21~30: Stage 3 / Lv 31~40: Stage 4 / Lv 41+: Stage 5)
function getStageFromLevel(level) {
  if (level >= 41) return 5;
  if (level >= 31) return 4;
  if (level >= 21) return 3;
  if (level >= 11) return 2;
  return 1;
}

// === AUTH APIs === //
app.post('/api/auth/register', (req, res) => {
  const { username, password, nickname, partnerId } = req.body;
  if (!username || !password || !nickname) {
    return res.status(400).json({ success: false, message: '아이디, 비밀번호, 닉네임을 모두 입력해주세요.' });
  }

  const store = readStore();
  if (store.users.some(u => u.username === username)) {
    return res.status(400).json({ success: false, message: '이미 존재하는 아이디입니다.' });
  }

  const newUser = {
    username: username.trim(),
    password: password.trim(),
    nickname: sanitizeContent(nickname.trim()),
    partnerId: partnerId || 'agumon_line',
    level: 1,
    stage: 1,
    exp: 0,
    maxExp: 100,
    warmthTemp: 36.5,
    points: 1000,
    pointLogs: [{ title: "🎉 신규 가입 축하 온기 포인트 적립", amount: 1000, date: new Date().toISOString() }],
    redemptions: [],
    completedQuests: [],
    customQuests: []
  };

  store.users.push(newUser);
  writeStore(store);

  res.json({ success: true, user: newUser, message: '회원가입 성공! 가입 축하 온기 1,000 P가 적립되었습니다.' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const store = readStore();
  const user = store.users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
  }

  if (user.level === undefined) user.level = 1;
  user.stage = getStageFromLevel(user.level);
  if (user.warmthTemp === undefined) user.warmthTemp = 36.5;
  if (user.points === undefined) user.points = 1000;
  if (!user.pointLogs) user.pointLogs = [];

  res.json({ success: true, user });
});

app.get('/api/users/peers', (req, res) => {
  const store = readStore();
  const peers = store.users.map(u => ({
    nickname: u.nickname,
    partnerId: u.partnerId,
    level: u.level || 1,
    stage: getStageFromLevel(u.level || 1),
    exp: u.exp,
    maxExp: u.maxExp,
    warmthTemp: u.warmthTemp || 36.5,
    completedCount: (u.completedQuests || []).length
  }));
  res.json({ success: true, peers });
});

// === ROUTINE & DIGIMON LEVEL-10 EVOLUTION APIs === //
app.get('/api/routine/user/:username', (req, res) => {
  const { username } = req.params;
  const store = readStore();
  const user = store.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ success: false, message: '유저를 찾을 수 없습니다.' });
  }

  if (user.level === undefined) user.level = 1;
  user.stage = getStageFromLevel(user.level);
  if (user.warmthTemp === undefined) user.warmthTemp = 36.5;
  if (user.points === undefined) user.points = 0;

  const currentLevelKey = Math.min(3, user.stage);
  const levelQuests = LEVEL_QUESTS[currentLevelKey] || LEVEL_QUESTS[1];

  res.json({
    success: true,
    user,
    levelQuests,
    currentLevelKey
  });
});

app.post('/api/routine/toggle', (req, res) => {
  const { username, questId, expAmount } = req.body;
  const store = readStore();
  const user = store.users.find(u => u.username === username);

  if (!user) return res.status(404).json({ success: false });

  if (user.level === undefined) user.level = 1;
  const previousStage = getStageFromLevel(user.level);

  if (user.warmthTemp === undefined) user.warmthTemp = 36.5;
  if (user.points === undefined) user.points = 0;
  if (!user.pointLogs) user.pointLogs = [];

  const isCompleted = user.completedQuests.includes(questId);
  let evolvedJustNow = false;

  const expBonusMultiplier = user.warmthTemp >= 50.0 ? 1.2 : 1.0;
  const finalExpGain = Math.round(expAmount * expBonusMultiplier);

  if (isCompleted) {
    user.completedQuests = user.completedQuests.filter(id => id !== questId);
    user.exp = Math.max(0, user.exp - finalExpGain);
  } else {
    user.completedQuests.push(questId);
    user.exp += finalExpGain;

    const pointEarned = 50;
    user.points += pointEarned;
    user.pointLogs.unshift({
      title: "🌱 루틴 퀘스트 완수 보상",
      amount: pointEarned,
      date: new Date().toISOString()
    });

    user.warmthTemp = Number((user.warmthTemp + 0.1).toFixed(1));

    // Experience & Level Up Logic (100 EXP = +1 Level)
    if (user.exp >= user.maxExp) {
      user.level += 1;
      user.exp = user.exp - user.maxExp;

      const newStage = getStageFromLevel(user.level);

      // Check if Digimon evolved to next form (Level 10, 20, 30, 40)
      if (newStage > previousStage) {
        user.stage = newStage;
        user.completedQuests = [];
        user.warmthTemp = Number((user.warmthTemp + 0.5).toFixed(1));

        const evoPointEarned = 500;
        user.points += evoPointEarned;
        user.pointLogs.unshift({
          title: `💥 Lv.${user.level} 디지몬 진화 달성 보너스`,
          amount: evoPointEarned,
          date: new Date().toISOString()
        });

        evolvedJustNow = true;
      }
    }
  }

  user.stage = getStageFromLevel(user.level);
  writeStore(store);

  const currentLevelKey = Math.min(3, user.stage);
  const levelQuests = LEVEL_QUESTS[currentLevelKey] || LEVEL_QUESTS[1];

  res.json({
    success: true,
    user,
    evolved: evolvedJustNow,
    previousStage,
    currentStage: user.stage,
    levelQuests,
    currentLevelKey
  });
});

app.post('/api/routine/add-quest', (req, res) => {
  const { username, title, exp } = req.body;
  const store = readStore();
  const user = store.users.find(u => u.username === username);

  if (!user) return res.status(404).json({ success: false });

  const sanitizedTitle = sanitizeContent(title.trim());
  const newQuest = {
    id: "cq_" + Date.now(),
    title: sanitizedTitle,
    exp: Number(exp) || 15
  };
  user.customQuests.push(newQuest);
  writeStore(store);

  res.json({ success: true, user });
});

app.post('/api/routine/partner', (req, res) => {
  const { username, partnerId } = req.body;
  const store = readStore();
  const user = store.users.find(u => u.username === username);

  if (user) {
    user.partnerId = partnerId;
    writeStore(store);
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false });
  }
});

// === POINT REWARD REDEMPTION & CASH OUT APIs === //

app.post('/api/points/redeem', (req, res) => {
  const { username, itemTitle, costPoints } = req.body;
  const store = readStore();
  const user = store.users.find(u => u.username === username);

  if (!user) return res.status(404).json({ success: false, message: '유저 없음' });
  if ((user.points || 0) < costPoints) {
    return res.status(400).json({ success: false, message: `포인트가 부족합니다. (필요: ${costPoints} P / 보유: ${user.points || 0} P)` });
  }

  user.points -= costPoints;
  if (!user.redemptions) user.redemptions = [];
  if (!user.pointLogs) user.pointLogs = [];

  const redemptionItem = {
    id: "red_" + Date.now(),
    title: itemTitle,
    costPoints: costPoints,
    couponCode: "DIGI-" + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toISOString(),
    status: "발급완료"
  };

  user.redemptions.unshift(redemptionItem);
  user.pointLogs.unshift({
    title: `🛍️ ${itemTitle} 교환`,
    amount: -costPoints,
    date: new Date().toISOString()
  });

  writeStore(store);
  res.json({ success: true, user, redemption: redemptionItem, message: `🎉 '${itemTitle}' 교환이 성공적으로 완료되었습니다! 쿠폰번호: ${redemptionItem.couponCode}` });
});

app.post('/api/points/cashout', (req, res) => {
  const { username, bankName, accountNumber, accountHolder, amountPoints } = req.body;
  const store = readStore();
  const user = store.users.find(u => u.username === username);

  if (!user) return res.status(404).json({ success: false, message: '유저 없음' });
  if (!bankName || !accountNumber || !accountHolder) {
    return res.status(400).json({ success: false, message: '은행명, 계좌번호, 예금주명을 모두 입력해 주세요.' });
  }
  if (amountPoints < 10000) {
    return res.status(400).json({ success: false, message: '현금 환전 신청은 최소 10,000 P 이상부터 가능합니다.' });
  }
  if ((user.points || 0) < amountPoints) {
    return res.status(400).json({ success: false, message: '보유 포인트가 부족합니다.' });
  }

  user.points -= amountPoints;
  if (!user.redemptions) user.redemptions = [];
  if (!user.pointLogs) user.pointLogs = [];

  const cashoutItem = {
    id: "cash_" + Date.now(),
    title: `💵 현금 ${amountPoints.toLocaleString()}원 이체 신청 (${bankName} ${accountNumber})`,
    costPoints: amountPoints,
    couponCode: "입금대기중 (1영업일 이내 이체)",
    date: new Date().toISOString(),
    status: "이체신청완료"
  };

  user.redemptions.unshift(cashoutItem);
  user.pointLogs.unshift({
    title: `💵 계좌 현금 환전 신청 (${amountPoints.toLocaleString()}원)`,
    amount: -amountPoints,
    date: new Date().toISOString()
  });

  writeStore(store);
  res.json({ success: true, user, redemption: cashoutItem, message: `💵 ${amountPoints.toLocaleString()}원 현금 입금 신청이 접수되었습니다! (1영업일 이내 입금 처리)` });
});

// === COMMUNITY APIs === //
app.get('/api/posts', (req, res) => {
  const store = readStore();
  res.json({ success: true, posts: store.posts });
});

app.post('/api/posts', (req, res) => {
  const { author, content, partnerId, avatarStage } = req.body;
  const store = readStore();

  const authorUser = store.users.find(u => u.nickname === author);
  const authorTemp = authorUser ? (authorUser.warmthTemp || 36.5) : 36.5;

  const sanitized = sanitizeContent(content.trim());

  const newPost = {
    id: "post_" + Date.now(),
    author: author || '익명의 은둔청년',
    partnerId: partnerId || 'agumon_line',
    avatarStage: avatarStage || 1,
    warmthTemp: authorTemp,
    content: sanitized,
    createdAt: new Date().toISOString(),
    reactions: { warm: 0, support: 0, hello: 0 },
    reports: 0,
    isBlinded: false,
    comments: []
  };

  store.posts.unshift(newPost);
  writeStore(store);

  res.json({ success: true, post: newPost, posts: store.posts });
});

app.post('/api/posts/:id/react', (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  const store = readStore();
  const post = store.posts.find(p => p.id === id);

  if (post && post.reactions[type] !== undefined) {
    post.reactions[type] += 1;

    const authorUser = store.users.find(u => u.nickname === post.author);
    if (authorUser) {
      authorUser.warmthTemp = Number(((authorUser.warmthTemp || 36.5) + 0.2).toFixed(1));
      post.warmthTemp = authorUser.warmthTemp;

      authorUser.points = (authorUser.points || 0) + 20;
      if (!authorUser.pointLogs) authorUser.pointLogs = [];
      authorUser.pointLogs.unshift({
        title: "❤️ 커뮤니티 응원 수신 포인트",
        amount: 20,
        date: new Date().toISOString()
      });
    }

    writeStore(store);
    return res.json({ success: true, post, posts: store.posts });
  }
  res.status(400).json({ success: false });
});

app.post('/api/posts/:id/report', (req, res) => {
  const { id } = req.params;
  const store = readStore();
  const post = store.posts.find(p => p.id === id);

  if (post) {
    post.reports = (post.reports || 0) + 1;
    if (post.reports >= 3) post.isBlinded = true;

    const authorUser = store.users.find(u => u.nickname === post.author);
    if (authorUser) {
      authorUser.warmthTemp = Number(Math.max(0, (authorUser.warmthTemp || 36.5) - 1.5).toFixed(1));
      post.warmthTemp = authorUser.warmthTemp;
    }

    writeStore(store);
    return res.json({ success: true, post, posts: store.posts, message: '신고가 접수되었습니다.' });
  }
  res.status(404).json({ success: false });
});

app.post('/api/posts/:id/comment', (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;
  const store = readStore();
  const post = store.posts.find(p => p.id === id);

  if (post && content) {
    const sanitizedComment = sanitizeContent(content.trim());
    post.comments.push({
      id: "c_" + Date.now(),
      author: author || '따뜻한 동료',
      content: sanitizedComment,
      createdAt: new Date().toISOString()
    });
    writeStore(store);
    return res.json({ success: true, post, posts: store.posts });
  }
  res.status(400).json({ success: false });
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` DigiMind Digimon Level-10 Evolution Server Running (Port: ${PORT})`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
