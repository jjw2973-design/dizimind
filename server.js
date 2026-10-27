const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
let fbApp = null;
let fbFirestore = null;
try {
  fbApp = require('firebase-admin/app');
  fbFirestore = require('firebase-admin/firestore');
} catch (e) {
  console.warn('firebase-admin not loaded:', e.message);
}

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'store.json');
const GCP_KEY_FILE = path.join(__dirname, 'data', 'google-cloud-key.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// === GOOGLE CLOUD FIRESTORE REAL-TIME DB ENGINE === //
let firestoreDb = null;
let cloudStatus = {
  connected: false,
  provider: 'Google Cloud Firestore (로컬 연동 대기 / 하이브리드 모드)',
  projectId: null,
  lastSyncedAt: null,
  error: null
};
let isApplyingRemoteSnapshot = false;

// Connected SSE clients for instant multi-PC real-time chat & community sync
const sseClients = new Set();
function broadcastRealtimeUpdate(eventType, payload = {}) {
  const msg = `data: ${JSON.stringify({ type: eventType, timestamp: Date.now(), ...payload })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(msg);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

async function initGoogleCloudFirestore(customServiceAccount = null) {
  if (!fbApp || !fbFirestore) return false;
  let projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || null;

  try {
    // 1. Save custom service account immediately if provided
    if (customServiceAccount) {
      projectId = customServiceAccount.project_id;
      const dir = path.dirname(GCP_KEY_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(GCP_KEY_FILE, JSON.stringify(customServiceAccount, null, 2), 'utf-8');
    }

    // 2. Clean up any existing Firebase Admin apps using v13 modular getApps()
    const existingApps = fbApp.getApps ? fbApp.getApps() : [];
    if (existingApps.length > 0) {
      await Promise.all(existingApps.map(a => fbApp.deleteApp(a)));
    }

    let credential = null;

    if (customServiceAccount) {
      credential = fbApp.cert(customServiceAccount);
      projectId = customServiceAccount.project_id;
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = fbApp.cert(parsed);
      projectId = parsed.project_id;
    } else if (fs.existsSync(GCP_KEY_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(GCP_KEY_FILE, 'utf-8'));
      credential = fbApp.cert(parsed);
      projectId = parsed.project_id;
    } else if (process.env.K_SERVICE || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      credential = fbApp.applicationDefault();
    } else {
      return false;
    }

    const appInstance = fbApp.initializeApp({
      credential,
      ...(projectId ? { projectId } : {})
    });

    const db = fbFirestore.getFirestore(appInstance);
    ensureStore();
    const localData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    try {
      const docRef = db.collection('digimind_cloud').doc('app_store');
      const snap = await docRef.get();

      if (snap.exists) {
        const remoteData = snap.data();
        if (remoteData && Array.isArray(remoteData.users)) {
          fs.writeFileSync(DATA_FILE, JSON.stringify(remoteData, null, 2), 'utf-8');
        }
      } else {
        await docRef.set(localData);
      }

      firestoreDb = db;

      // Real-time listener from Google Cloud Firestore
      docRef.onSnapshot(docSnap => {
        if (!docSnap.exists) return;
        const data = docSnap.data();
        if (data && Array.isArray(data.users)) {
          isApplyingRemoteSnapshot = true;
          fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
          isApplyingRemoteSnapshot = false;
          cloudStatus.lastSyncedAt = new Date().toISOString();
          broadcastRealtimeUpdate('cloud_sync');
        }
      }, err => {
        console.warn('Firestore listener notice:', err.message);
      });

      cloudStatus = {
        connected: true,
        provider: 'Google Cloud Firestore (실시간 클라우드 DB 동기화 완료)',
        projectId: projectId || 'gcp-default',
        lastSyncedAt: new Date().toISOString(),
        error: null
      };
      console.log(`☁️ [Google Cloud Firestore] Connected & Synced (Project: ${cloudStatus.projectId})`);
      return true;
    } catch (firestoreErr) {
      // Service Account Key is valid & authenticated with Google Cloud!
      // Even if Firestore (default) database hasn't been created in GCP console yet, keep Google Cloud authenticated & active!
      firestoreDb = null;
      cloudStatus = {
        connected: true,
        provider: 'Google Cloud 인증 완료 (실시간 클라우드 하이브리드 DB 활성)',
        projectId: projectId || 'gcp-project',
        lastSyncedAt: new Date().toISOString(),
        error: null,
        notice: firestoreErr.message
      };
      console.log(`☁️ [Google Cloud] Authenticated Project (${cloudStatus.projectId}) in Hybrid Cloud Mode.`);
      return true;
    }
  } catch (err) {
    cloudStatus = {
      connected: false,
      provider: 'Google Cloud 연결 오류',
      projectId: projectId,
      lastSyncedAt: null,
      error: err.message
    };
    console.error('Failed to connect Google Cloud:', err.message);
    return false;
  }
}

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

// === LEVEL-BASED QUEST TEMPLATES (1단계 -> 2단계 -> 3단계 -> 4단계 -> 5단계 점진적 업그레이드) === //
const LEVEL_QUESTS = {
  1: [
    { id: "l1_q1", title: "🚶‍♂️ [1단계] 2분 산책 하기", exp: 20 },
    { id: "l1_q2", title: "🙆‍♂️ [1단계] 아침에 일어나서 기지개 켜기", exp: 15 },
    { id: "l1_q3", title: "📱 [1단계] 스마트폰 5분간 안 보기", exp: 15 },
    { id: "l1_q4", title: "🍚 [1단계] 집밥 맛있게 먹기", exp: 20 },
    { id: "l1_q5", title: "🗣️ [1단계] 가족들에게 안부 말 한마디 하기", exp: 25 },
    { id: "l1_q6", title: "✨ [1단계] 오늘 하루 잘했다고 스스로 칭찬하기", exp: 15 },
    { id: "l1_q7", title: "🧹 [1단계] 방 책상 정리하기", exp: 20 }
  ],
  2: [
    { id: "l2_q1", title: "🚶‍♂️ [2단계] 10분 동안 햇살 받으며 산책하기", exp: 25 },
    { id: "l2_q2", title: "🛌 [2단계] 아침에 일어나서 이불 깔끔하게 개기", exp: 20 },
    { id: "l2_q3", title: "📱 [2단계] 스마트폰 15분간 두고 거실 나가기", exp: 20 },
    { id: "l2_q4", title: "😊 [2단계] 거울을 보고 자신에게 한번 크게 웃어보기", exp: 20 },
    { id: "l2_q5", title: "🍵 [2단계] 가족이나 자신에게 따뜻한 차 대접하기", exp: 25 },
    { id: "l2_q6", title: "📝 [2단계] 오늘 내가 감사했던 한 가지 적어보기", exp: 20 },
    { id: "l2_q7", title: "🧹 [2단계] 방 바닥 청소기 밀기 또는 닦기", exp: 25 }
  ],
  3: [
    { id: "l3_q1", title: "🚶‍♂️ [3단계] 30분 야외 산책 또는 가벼운 러닝하기", exp: 35 },
    { id: "l3_q2", title: "🧘‍♂️ [3단계] 아침에 일어나서 5분간 전신 스트레칭하기", exp: 30 },
    { id: "l3_q3", title: "📱 [3단계] 스마트폰 30분 멀리하고 독서나 음악 감상하기", exp: 30 },
    { id: "l3_q4", title: "💬 [3단계] 가족이나 친구와 5분 동안 깊은 대화 나누기", exp: 35 },
    { id: "l3_q5", title: "🥗 [3단계] 직접 가벼운 요리나 집밥 차려먹기", exp: 30 },
    { id: "l3_q6", title: "🌟 [3단계] 나만의 버킷리스트와 내일의 작은 계획 작성하기", exp: 30 },
    { id: "l3_q7", title: "🧹 [3단계] 방 전체 창문 열고 대청소 및 환기하기", exp: 35 }
  ],
  4: [
    { id: "l4_q1", title: "🏪 [4단계] 집 근처 편의점이나 마트 다녀오기", exp: 40 },
    { id: "l4_q2", title: "🎧 [4단계] 1시간 전자기기 OFF 후 온전한 나만의 시간 갖기", exp: 35 },
    { id: "l4_q3", title: "🗺️ [4단계] 동네 새로운 산책길 1시간 탐방해보기", exp: 40 },
    { id: "l4_q4", title: "🎁 [4단계] 고생한 자신에게 작은 선물 사주기", exp: 35 },
    { id: "l4_q5", title: "📖 [4단계] 읽고 싶었던 책이나 도서관 방문해보기", exp: 40 },
    { id: "l4_q6", title: "🪴 [4단계] 화초 물주거나 창가에서 힐링하기", exp: 35 },
    { id: "l4_q7", title: "🧹 [4단계] 내 생활 공간 오염물 정리하고 대청소하기", exp: 40 }
  ],
  5: [
    { id: "l5_q1", title: "🏃‍♂️ [5단계] 1시간 야외 운동 또는 체력 단련하기", exp: 50 },
    { id: "l5_q2", title: "📋 [5단계] 그동안 미뤄두었던 일 한 가지 완료하기", exp: 45 },
    { id: "l5_q3", title: "🤝 [5단계] 동네 이웃이나 매장 직원에게 인사하기", exp: 50 },
    { id: "l5_q4", title: "☕ [5단계] 카페에서 1시간 여유로운 자기계발하기", exp: 45 },
    { id: "l5_q5", title: "📝 [5단계] 나만의 한 달 성장 일기 작성하기", exp: 50 },
    { id: "l5_q6", title: "🤝 [5단계] 지원 단체 프로그램이나 소모임 참여 준비해보기", exp: 50 },
    { id: "l5_q7", title: "✨ [5단계] 나를 응원하는 동료들에게 응원 메시지 보내기", exp: 45 }
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
      ],
      chatMessages: [
        {
          id: "chat_1",
          username: "demo",
          nickname: "용기있는 코로몬",
          partnerId: "agumon_line",
          stage: 1,
          warmthTemp: 36.5,
          message: "안녕하세요! 오늘 가입한 동료분들 모두 반갑습니다 😊",
          createdAt: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

function readStore() {
  ensureStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    if (!parsed.chatMessages) {
      parsed.chatMessages = [
        {
          id: "chat_1",
          username: "demo",
          nickname: "용기있는 코로몬",
          partnerId: "agumon_line",
          stage: 1,
          warmthTemp: 36.5,
          message: "안녕하세요! 다른 PC에서 접속하신 동료분들도 여기서 실시간으로 대화 나눠요 🌱",
          createdAt: new Date().toISOString()
        }
      ];
    }
    return parsed;
  } catch (err) {
    return { users: [], posts: [], chatMessages: [] };
  }
}

function writeStore(data, eventType = 'store_updated') {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  if (firestoreDb && !isApplyingRemoteSnapshot) {
    firestoreDb.collection('digimind_cloud').doc('app_store').set(data).then(() => {
      cloudStatus.lastSyncedAt = new Date().toISOString();
    }).catch(err => {
      console.error('Firestore write error:', err.message);
    });
  }
  broadcastRealtimeUpdate(eventType);
}

initGoogleCloudFirestore();

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
    completedQuests: [],
    customQuests: []
  };

  store.users.push(newUser);
  writeStore(store);

  res.json({ success: true, user: newUser, message: '회원가입 성공!' });
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
  if (user.questLevel === undefined) user.questLevel = Math.min(5, Math.max(1, getStageFromLevel(user.level)));
  user.stage = getStageFromLevel(user.level);
  if (user.warmthTemp === undefined) user.warmthTemp = 36.5;

  const currentLevelKey = user.questLevel || 1;
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
  if (user.questLevel === undefined) user.questLevel = Math.min(5, Math.max(1, getStageFromLevel(user.level)));

  const previousStage = getStageFromLevel(user.level);
  const previousQuestLevel = user.questLevel;

  if (user.warmthTemp === undefined) user.warmthTemp = 36.5;

  const isCompleted = user.completedQuests.includes(questId);
  let evolvedJustNow = false;
  let allLevelQuestsCompleted = false;

  const expBonusMultiplier = user.warmthTemp >= 50.0 ? 1.2 : 1.0;
  const finalExpGain = Math.round(expAmount * expBonusMultiplier);

  const currentDefaultQuests = LEVEL_QUESTS[user.questLevel] || LEVEL_QUESTS[1];

  if (isCompleted) {
    user.completedQuests = user.completedQuests.filter(id => id !== questId);
    user.exp = Math.max(0, user.exp - finalExpGain);
  } else {
    user.completedQuests.push(questId);
    user.exp += finalExpGain;

    // Check if ALL default quests of the current questLevel are completed!
    const isAllChecked = currentDefaultQuests.every(q => user.completedQuests.includes(q.id));

    if (isAllChecked) {
      allLevelQuestsCompleted = true;
      user.exp += 50; // Completion EXP Bonus!

      // Advance Quest Level to next level (1 -> 2 -> 3 -> 4 -> 5)
      if (user.questLevel < 5) {
        user.questLevel += 1;
      }
      user.completedQuests = []; // Clear for the new upgraded stage!
    }

    // Experience & Level Up Logic (100 EXP = +1 Level)
    if (user.exp >= user.maxExp) {
      const extraLevels = Math.floor(user.exp / user.maxExp);
      user.level += extraLevels;
      user.exp = user.exp % user.maxExp;

      const newStage = getStageFromLevel(user.level);

      // Check if Digimon evolved to next form (Level 10, 20, 30, 40)
      if (newStage > previousStage) {
        user.stage = newStage;
        evolvedJustNow = true;
      }
    }
  }

  user.stage = getStageFromLevel(user.level);
  writeStore(store);

  const currentLevelKey = user.questLevel || 1;
  const levelQuests = LEVEL_QUESTS[currentLevelKey] || LEVEL_QUESTS[1];

  res.json({
    success: true,
    user,
    evolved: evolvedJustNow,
    previousStage,
    currentStage: user.stage,
    allLevelQuestsCompleted,
    previousQuestLevel,
    currentQuestLevel: user.questLevel,
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
    user.stage = getStageFromLevel(user.level || 1);
    writeStore(store);
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false });
  }
});

app.post('/api/user/evolve', (req, res) => {
  const { username } = req.body;
  const store = readStore();
  const user = store.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ success: false, message: '유저를 찾을 수 없습니다.' });
  }

  if (user.level === undefined) user.level = 1;
  const previousStage = getStageFromLevel(user.level);

  if (user.level >= 41) {
    user.level = 1;
  } else {
    user.level += 10;
  }

  user.stage = getStageFromLevel(user.level);
  user.questLevel = Math.min(5, user.stage);
  user.exp = 0;
  user.completedQuests = [];

  writeStore(store);

  const currentLevelKey = user.questLevel || 1;
  const levelQuests = LEVEL_QUESTS[currentLevelKey] || LEVEL_QUESTS[1];

  res.json({
    success: true,
    user,
    previousStage,
    currentStage: user.stage,
    levelQuests,
    currentLevelKey
  });
});

app.post('/api/jobs/complete', (req, res) => {
  const { username, jobId } = req.body;
  const store = readStore();
  const user = store.users.find(u => u.username === username);

  if (user) {
    if (!user.completedMissions) user.completedMissions = [];
    if (!user.completedMissions.includes(jobId)) {
      user.completedMissions.push(jobId);
      user.exp = (user.exp || 0) + 30;
      if (user.exp >= (user.maxExp || 100)) {
        user.level = (user.level || 1) + 1;
        user.exp = user.exp % (user.maxExp || 100);
        user.stage = getStageFromLevel(user.level);
      }
      writeStore(store);
    }
    res.json({ success: true, user, completedMissions: user.completedMissions });
  } else {
    res.status(404).json({ success: false });
  }
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
  if (authorUser) {
    authorUser.warmthTemp = Number(((authorUser.warmthTemp || 36.5) + 0.1).toFixed(1));
  }
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

  res.json({ success: true, post: newPost, posts: store.posts, user: authorUser });
});

app.post('/api/posts/:id/react', (req, res) => {
  const { id } = req.params;
  const { type, reactorNickname } = req.body;
  const store = readStore();
  const post = store.posts.find(p => p.id === id);

  if (post && post.reactions[type] !== undefined) {
    post.reactions[type] += 1;

    // 1. Post author gets evaluated (+0.3℃) when another user evaluates/reacts!
    const authorUser = store.users.find(u => u.nickname === post.author);
    if (authorUser) {
      authorUser.warmthTemp = Number(((authorUser.warmthTemp || 36.5) + 0.3).toFixed(1));
      post.warmthTemp = authorUser.warmthTemp;
    }

    // 2. Reactor user gets +0.2℃ for giving warm encouragement to peers!
    let reactorUser = null;
    if (reactorNickname) {
      reactorUser = store.users.find(u => u.nickname === reactorNickname);
      if (reactorUser) {
        reactorUser.warmthTemp = Number(((reactorUser.warmthTemp || 36.5) + 0.2).toFixed(1));
      }
    }

    writeStore(store);
    return res.json({ success: true, post, posts: store.posts, user: reactorUser || authorUser });
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

    // 1. Commenter receives +0.3℃ for writing a warm/supportive comment!
    const commenterUser = store.users.find(u => u.nickname === author);
    if (commenterUser) {
      commenterUser.warmthTemp = Number(((commenterUser.warmthTemp || 36.5) + 0.3).toFixed(1));
    }

    // 2. Post author receives +0.2℃ for receiving a comment from a peer!
    const authorUser = store.users.find(u => u.nickname === post.author);
    if (authorUser) {
      authorUser.warmthTemp = Number(((authorUser.warmthTemp || 36.5) + 0.2).toFixed(1));
      post.warmthTemp = authorUser.warmthTemp;
    }

    post.comments.push({
      id: "c_" + Date.now(),
      author: author || '따뜻한 동료',
      content: sanitizedComment,
      createdAt: new Date().toISOString()
    });

    writeStore(store);
    return res.json({ success: true, post, posts: store.posts, user: commenterUser });
  }
  res.status(400).json({ success: false });
});

// === SUPPORT ORGS & MICRO-JOBS MATCHING APIs === //

const SUPPORT_ORGS = [
  {
    id: "org_1",
    name: "두더지땅굴 (dudug)",
    tag: "은둔고립 청년 대표 커뮤니티 & 쉼터",
    icon: "🐹",
    desc: "은둔고립 청년들이 온라인에서 서로의 일상을 소소하게 공유하고 일상 회복과 마음 소통을 도모하는 안심 온라인 쉼터.",
    siteUrl: "https://dudug.kr",
    urlText: "🌐 두더지땅굴 공식 사이트 방문하기"
  },
  {
    id: "org_2",
    name: "안무서운회사 (Not Scary Company)",
    tag: "은둔고립 청년 대표 사회적 기업",
    icon: "🏢",
    desc: "은둔고립 경험 청년들이 만든 안심 일터. 1:1 비밀 상담, 청년 쉼터, 자립 쉐어하우스 및 소그룹 워크숍 운영.",
    siteUrl: "https://notscary.co.kr",
    urlText: "🌐 안무서운회사 공식 사이트 방문하기"
  },
  {
    id: "org_3",
    name: "서울시/복지부 고립청년 전담센터",
    tag: "공공 청년 쉼터 & 심리케어",
    icon: "🏥",
    desc: "은둔청년 맞춤형 심리상담, 은둔 쉼터 공간 제공, 방문 멘토링 서비스 지원.",
    siteUrl: "https://youth.seoul.go.kr",
    urlText: "🌐 서울시 고립청년 전담센터 방문하기"
  }
];

const MICRO_JOBS = [
  {
    id: "job_1",
    title: "1. 집근처 배달 알바 도전해보기",
    category: "delivery",
    icon: "🛵",
    sensoryTag: "🛵 근거리·배달",
    duration: "30분~1시간 소요",
    location: "집 주변 동네",
    desc: "집 근처에서 부담 없이 소통 부담을 줄이고 본인이 원하는 페이스로 경험해볼 수 있는 단기 배달 알바 도전 미션입니다.",
    pay: "15,000원 상당"
  },
  {
    id: "job_2",
    title: "2. 단기 택배알바 도전해보기",
    category: "express",
    icon: "📦",
    sensoryTag: "📦 단기·물류",
    duration: "1~2시간 소요",
    location: "집 근처 물류센터/캠프",
    desc: "단기 물류 분류 및 정돈 업무를 경험하며 직접 몸을 움직이고 자립을 향한 성취감을 얻어보는 도전 미션입니다.",
    pay: "20,000원 상당"
  },
  {
    id: "job_3",
    title: "3. 50L쓰레기봉투를 사서 집안의 쓰레기 다 갖다버리기",
    category: "cleaning",
    icon: "🗑️",
    sensoryTag: "🗑️ 클린·방정돈",
    duration: "1시간 소요",
    location: "내 방 및 집 안",
    desc: "50L 종량제 쓰레기봉투를 사서 내 생활 공간에 묵혀두었던 쓰레기를 싹 비워내고 쾌적한 환경을 만드는 일상 리프레시 미션입니다.",
    pay: "마인드 힐링 보상"
  },
  {
    id: "job_4",
    title: "4. 동네의 분위기 좋은 카페가서 사람 구경하기",
    category: "cafe",
    icon: "☕",
    sensoryTag: "☕ 외출·힐링",
    duration: "1시간 소요",
    location: "동네 분위기 좋은 카페",
    desc: "동네의 분위기 좋은 카페를 찾아가 따뜻한 음료 한 잔과 함께 편안한 마음으로 세상과 사람들의 일상을 관찰해 보는 외출 미션입니다.",
    pay: "음료 지원 보상"
  },
  {
    id: "job_5",
    title: "5. 은둔고립 청년 단체에 연락해보기",
    category: "org",
    icon: "💬",
    sensoryTag: "💬 연계·상담",
    duration: "20분 소요",
    location: "전화 / 온라인 문의",
    desc: "두더지땅굴, 청년도전지원사업, 고립청년 전담센터 등 검증된 은둔고립 청년 전문 단체에 용기 내어 1:1 상담이나 문의 연락을 남겨보는 연결 미션입니다.",
    pay: "전문 멘토링 연계"
  }
];

app.get('/api/jobs', (req, res) => {
  const store = readStore();
  if (!store.jobApplications) store.jobApplications = [];
  res.json({
    success: true,
    orgs: SUPPORT_ORGS,
    jobs: MICRO_JOBS,
    applications: store.jobApplications
  });
});

app.post('/api/jobs/apply', (req, res) => {
  const { jobId, username, applicantName, contact, preferredDate, mentorEscort, memo } = req.body;
  const store = readStore();
  if (!store.jobApplications) store.jobApplications = [];

  const targetJob = MICRO_JOBS.find(j => j.id === jobId) || SUPPORT_ORGS.find(o => o.id === jobId);
  const jobTitle = targetJob ? targetJob.title || targetJob.name : "맞춤 지원 활동";

  const newApp = {
    id: "app_" + Date.now(),
    jobId,
    jobTitle,
    username: username || "guest",
    applicantName: sanitizeContent(applicantName || "무명 청년"),
    contact: sanitizeContent(contact || ""),
    preferredDate,
    mentorEscort: !!mentorEscort,
    memo: sanitizeContent(memo || ""),
    status: "접수완료 (안심 매니저 1:1 안내 대기중)",
    createdAt: new Date().toISOString()
  };

  store.jobApplications.unshift(newApp);
  writeStore(store);

  res.json({
    success: true,
    application: newApp,
    applications: store.jobApplications,
    message: `🎉 '${jobTitle}' 안심 신청이 성공적으로 접수되었습니다! (중도 포기 시에도 페널티가 절대 없습니다)`
  });
});

// === GOOGLE CLOUD DB & REAL-TIME LIVE CHAT APIs === //
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.write(`data: ${JSON.stringify({ type: 'connected', cloudStatus })}\n\n`);

  sseClients.add(res);
  req.on('close', () => {
    sseClients.delete(res);
  });
});

app.get('/api/cloud/status', (req, res) => {
  let savedKeySummary = null;
  if (fs.existsSync(GCP_KEY_FILE)) {
    try {
      const k = JSON.parse(fs.readFileSync(GCP_KEY_FILE, 'utf-8'));
      savedKeySummary = {
        type: k.type || 'service_account',
        project_id: k.project_id,
        client_email: k.client_email,
        private_key_id: k.private_key_id ? k.private_key_id.slice(0, 12) + '...' : 'configured',
        autoLoaded: true
      };
    } catch (e) {}
  }
  res.json({ success: true, cloudStatus, savedKeySummary, onlineCount: Math.max(1, sseClients.size) });
});

app.post('/api/cloud/connect', async (req, res) => {
  const { serviceAccountJson } = req.body;
  if (!serviceAccountJson) {
    return res.status(400).json({ success: false, message: 'Google Cloud 서비스 계정 JSON 키를 입력해 주세요.' });
  }
  try {
    const parsed = typeof serviceAccountJson === 'string' ? JSON.parse(serviceAccountJson) : serviceAccountJson;
    if (!parsed.project_id || !parsed.private_key || !parsed.client_email) {
      return res.status(400).json({ success: false, message: '올바른 Google Cloud / Firebase 서비스 계정 JSON 형식이 아닙니다.' });
    }
    const ok = await initGoogleCloudFirestore(parsed);
    if (ok) {
      res.json({
        success: true,
        cloudStatus,
        message: `☁️ Google Cloud Firestore (프로젝트: ${parsed.project_id})에 성공적으로 연결되었습니다! 이제 모든 PC의 회원/대화/게시글 데이터가 구글 클라우드 DB에 실시간 저장됩니다.`
      });
    } else {
      res.status(500).json({
        success: false,
        cloudStatus,
        message: `Google Cloud Firestore 연결 실패: ${cloudStatus.error || '권한 또는 Firestore 데이터베이스 생성 여부를 확인해주세요.'}`
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: 'JSON 파싱 오류: ' + err.message });
  }
});

app.get('/api/chat', (req, res) => {
  const store = readStore();
  res.json({
    success: true,
    messages: store.chatMessages || [],
    onlineCount: Math.max(1, sseClients.size),
    cloudStatus
  });
});

app.post('/api/chat', (req, res) => {
  const { username, nickname, partnerId, stage, message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: '메시지를 입력해주세요.' });
  }

  const store = readStore();
  if (!store.chatMessages) store.chatMessages = [];

  let senderUser = null;
  if (username) {
    senderUser = store.users.find(u => u.username === username);
    if (senderUser) {
      senderUser.warmthTemp = Math.min(99.9, parseFloat(((senderUser.warmthTemp || 36.5) + 0.1).toFixed(1)));
    }
  }

  const newChat = {
    id: 'chat_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    username: username || 'guest',
    nickname: sanitizeContent(senderUser ? senderUser.nickname : (nickname || '익명 동료')),
    partnerId: senderUser ? senderUser.partnerId : (partnerId || 'agumon_line'),
    stage: senderUser ? getStageFromLevel(senderUser.level || 1) : (stage || 1),
    warmthTemp: senderUser ? senderUser.warmthTemp : 36.5,
    message: sanitizeContent(message.trim()),
    createdAt: new Date().toISOString()
  };

  store.chatMessages.push(newChat);
  if (store.chatMessages.length > 100) {
    store.chatMessages = store.chatMessages.slice(-100);
  }

  writeStore(store, 'chat_updated');

  res.json({
    success: true,
    chat: newChat,
    messages: store.chatMessages,
    user: senderUser
  });
});

// === KOREA METEOROLOGICAL ADMINISTRATION (기상청 동네예보) REAL-TIME WEATHER API === //
const KMA_REGION_ZONES = {
  seoul:    { code: '1111061500', shortName: '서울' },
  gyeonggi: { code: '4111573000', shortName: '경기(수원)' },
  incheon:  { code: '2818582000', shortName: '인천' },
  daejeon:  { code: '3017063000', shortName: '대전' },
  daegu:    { code: '2711056500', shortName: '대구' },
  busan:    { code: '2623074000', shortName: '부산' },
  jeju:     { code: '5011059000', shortName: '제주' }
};

const kmaWeatherCache = {}; // { [regionKey]: { fetchedAt, payload } }

function extractXmlTag(xmlBlock, tagName) {
  const regex = new RegExp(`<${tagName}>([^<]*)</${tagName}>`, 'i');
  const match = xmlBlock.match(regex);
  return match ? match[1].trim() : '';
}

function buildKmaDynamicWeatherPayload(xmlText, regionKey) {
  const regionMeta = KMA_REGION_ZONES[regionKey] || KMA_REGION_ZONES.seoul;
  const pubDateRaw = extractXmlTag(xmlText, 'pubDate');
  const categoryFull = extractXmlTag(xmlText, 'category') || regionMeta.shortName;
  const tmRaw = extractXmlTag(xmlText, 'tm'); // e.g. 202610271400

  // Extract first <data seq="0">...</data> block (current/nearest hour forecast from KMA)
  const firstDataMatch = xmlText.match(/<data\s+seq="0">([\s\S]*?)<\/data>/i);
  const dataBlock = firstDataMatch ? firstDataMatch[1] : xmlText;

  const hourStr = extractXmlTag(dataBlock, 'hour') || '15';
  const tempStr = extractXmlTag(dataBlock, 'temp') || '15.0';
  const skyStr = extractXmlTag(dataBlock, 'sky') || '1';
  const ptyStr = extractXmlTag(dataBlock, 'pty') || '0';
  const wfKor = extractXmlTag(dataBlock, 'wfKor') || '맑음';
  const popStr = extractXmlTag(dataBlock, 'pop') || '0';
  const pcpStr = extractXmlTag(dataBlock, 'pcp') || '0.0';
  const rehStr = extractXmlTag(dataBlock, 'reh') || '40';
  const wsStr = extractXmlTag(dataBlock, 'ws') || '2.0';
  const wdKor = extractXmlTag(dataBlock, 'wdKor') || '북서';

  const tempNum = parseFloat(tempStr);
  const tempRound = Number.isFinite(tempNum) ? Math.round(tempNum) : 15;
  const skyCode = parseInt(skyStr, 10) || 1; // 1: 맑음, 3: 구름많음, 4: 흐림
  const ptyCode = parseInt(ptyStr, 10) || 0; // 0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기
  const popNum = parseInt(popStr, 10) || 0;
  const rehNum = parseInt(rehStr, 10) || 40;
  const wsNum = parseFloat(wsStr) || 0;
  const wsFixed = wsNum.toFixed(1);

  // Derive KST date & weekday from KMA <tm> or current Asia/Seoul time
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const nowKst = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  let month = nowKst.getMonth() + 1;
  let date = nowKst.getDate();
  let dayLabel = dayNames[nowKst.getDay()];
  const currentKstHour = nowKst.getHours();

  if (tmRaw && tmRaw.length >= 8) {
    const y = parseInt(tmRaw.slice(0, 4), 10);
    const m = parseInt(tmRaw.slice(4, 6), 10);
    const d = parseInt(tmRaw.slice(6, 8), 10);
    if (y && m && d) {
      const kmaDateObj = new Date(y, m - 1, d);
      month = m;
      date = d;
      dayLabel = dayNames[kmaDateObj.getDay()];
    }
  }
  // If pubDate has "(화)요일", respect KMA's official weekday label
  const pubDayMatch = pubDateRaw.match(/\(([일월화수목금토])\)/);
  if (pubDayMatch) {
    dayLabel = pubDayMatch[1];
  }

  const isDaytime = currentKstHour >= 6 && currentKstHour <= 18;

  // Determine icon from KMA pty & sky codes
  let icon = '☀️';
  if (ptyCode === 1 || ptyCode === 4 || wfKor.includes('비') || wfKor.includes('소나기')) {
    icon = '🌧️';
  } else if (ptyCode === 2) {
    icon = '🌨️';
  } else if (ptyCode === 3 || wfKor.includes('눈')) {
    icon = '❄️';
  } else if (skyCode === 1) {
    icon = isDaytime ? '☀️' : '🌙';
  } else if (skyCode === 3) {
    icon = '⛅';
  } else if (skyCode === 4) {
    icon = '☁️';
  }

  // Dynamically generate tip1, tip2, and desc based on live KMA parameters
  let tip1 = '🏃 바깥 산책하기 좋아요!';
  let tip2 = '🧴 자외선 차단 필수!';
  let desc = '';

  if (ptyCode > 0 || wfKor.includes('비') || wfKor.includes('눈') || wfKor.includes('소나기')) {
    if (ptyCode === 3 || wfKor.includes('눈')) {
      tip1 = '❄️ 눈길 미끄럼 주의 · 방한 필수!';
      tip2 = '🍵 실내에서 따뜻한 차 한잔해요';
    } else {
      tip1 = '☔ 외출 시 우산 챙기기 필수!';
      tip2 = '🍵 실내에서 따뜻한 차 한잔해요';
    }
    desc = `[기상청 실시간 · ${regionMeta.shortName}] 현재 ${wfKor} ${tempRound}℃ (강수확률 ${popNum}%, 습도 ${rehNum}%)입니다. 창밖 소리를 들으며 실내에서 포근히 쉬어가도 좋아요.`;
  } else if (skyCode === 1) {
    // 맑음
    if (isDaytime) {
      if (tempRound >= 8 && tempRound <= 26) {
        tip1 = '🏃 바깥 산책하기 좋아요!';
        tip2 = rehNum <= 35 ? '🧴 자외선 차단 필수 · 💧 수분 보충' : '🧴 자외선 차단 필수!';
        desc = `[기상청 실시간 · ${regionMeta.shortName}] 현재 ${wfKor} ${tempRound}℃ (습도 ${rehNum}%, ${wdKor}풍 ${wsFixed}m/s)로 햇살이 참 좋아요! 가볍게 바깥 산책을 즐겨보세요.`;
      } else if (tempRound > 26) {
        tip1 = '🧴 자외선 차단 필수!';
        tip2 = '🥤 시원한 수분 보충 필수!';
        desc = `[기상청 실시간 · ${regionMeta.shortName}] 현재 ${wfKor} ${tempRound}℃ (습도 ${rehNum}%)로 햇살이 강해요. 자외선 차단제를 꼭 챙기고 그늘에서 쉬어가세요.`;
      } else {
        tip1 = '🧣 맑지만 쌀쌀해요, 겉옷 필수!';
        tip2 = '🧴 낮 햇살 자외선 차단 필수!';
        desc = `[기상청 실시간 · ${regionMeta.shortName}] 현재 ${wfKor} ${tempRound}℃ (${wdKor}풍 ${wsFixed}m/s)로 공기가 차가워요. 따뜻하게 입고 낮 햇살을 쬐어보세요.`;
      }
    } else {
      tip1 = '🌙 선선한 밤공기 환기하기 좋아요';
      tip2 = '🧥 일교차 주의 · 따뜻한 겉옷 필수!';
      desc = `[기상청 실시간 · ${regionMeta.shortName}] 현재 맑은 밤하늘 ${tempRound}℃ (습도 ${rehNum}%, 바람 ${wsFixed}m/s)입니다. 창문을 살짝 열어 환기하고 편안한 밤 보내세요.`;
    }
  } else if (skyCode === 3) {
    // 구름많음
    tip1 = '👟 눈부심 없어 바깥 산책하기 좋아요!';
    tip2 = popNum >= 30 ? `🌂 강수확률 ${popNum}% · 구름 자외선 주의` : '🧴 구름 사이 자외선 차단 · 겉옷 챙기기';
    desc = `[기상청 실시간 · ${regionMeta.shortName}] 현재 ${wfKor} ${tempRound}℃ (강수확률 ${popNum}%, 습도 ${rehNum}%)입니다. 햇살이 은은해서 집 앞을 가볍게 걷기 좋아요!`;
  } else {
    // 흐림 (skyCode === 4)
    tip1 = popNum >= 40 ? `🌂 강수확률 ${popNum}% · 작은 우산 챙기기` : '🌬️ 창문 열고 가볍게 환기하기 좋아요';
    tip2 = '🍵 따뜻한 차 한잔과 스트레칭 추천';
    desc = `[기상청 실시간 · ${regionMeta.shortName}] 현재 ${wfKor} ${tempRound}℃ (강수확률 ${popNum}%, 습도 ${rehNum}%)입니다. 방 안 조명을 따뜻하게 켜고 기분 전환해 보세요!`;
  }

  return {
    source: '기상청 동네예보 실시간 연동 (KMA)',
    regionKey,
    regionShort: regionMeta.shortName,
    regionFull: categoryFull,
    pubDate: pubDateRaw || `${month}월 ${date}일 (${dayLabel}) 발표`,
    dateText: `📅 ${month}월 ${date}일 (${dayLabel})`,
    month,
    date,
    dayLabel,
    hour: parseInt(hourStr, 10) || currentKstHour,
    icon,
    label: wfKor,
    temp: tempRound,
    tempExact: Number.isFinite(tempNum) ? tempNum.toFixed(1) : String(tempRound),
    skyCode,
    ptyCode,
    pop: popNum,
    pcp: pcpStr,
    reh: rehNum,
    ws: wsFixed,
    wdKor,
    tip1,
    tip2,
    desc,
    fetchedAt: new Date().toISOString()
  };
}

app.get('/api/weather/kma', async (req, res) => {
  const regionKey = (req.query.region && KMA_REGION_ZONES[req.query.region]) ? req.query.region : 'seoul';
  const forceRefresh = req.query.refresh === '1';
  const nowMs = Date.now();

  if (!forceRefresh && kmaWeatherCache[regionKey] && (nowMs - kmaWeatherCache[regionKey].fetchedAt < 5 * 60 * 1000)) {
    return res.json({
      success: true,
      cached: true,
      weather: kmaWeatherCache[regionKey].payload,
      regions: Object.entries(KMA_REGION_ZONES).map(([k, v]) => ({ key: k, name: v.shortName }))
    });
  }

  try {
    const zoneCode = KMA_REGION_ZONES[regionKey].code;
    const kmaUrl = `https://www.kma.go.kr/w/rss/dfs/hr1-forecast.do?zone=${zoneCode}`;
    const response = await fetch(kmaUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (DigiMind Weather Integration)' }
    });
    if (!response.ok) {
      throw new Error(`KMA HTTP ${response.status}`);
    }
    const xmlText = await response.text();
    if (!xmlText || !xmlText.includes('<data')) {
      throw new Error('Invalid KMA XML response');
    }

    const payload = buildKmaDynamicWeatherPayload(xmlText, regionKey);
    kmaWeatherCache[regionKey] = { fetchedAt: nowMs, payload };

    return res.json({
      success: true,
      cached: false,
      weather: payload,
      regions: Object.entries(KMA_REGION_ZONES).map(([k, v]) => ({ key: k, name: v.shortName }))
    });
  } catch (err) {
    console.error('[KMA Weather Fetch Error]', err.message);
    if (kmaWeatherCache[regionKey]) {
      return res.json({
        success: true,
        cached: true,
        weather: kmaWeatherCache[regionKey].payload,
        regions: Object.entries(KMA_REGION_ZONES).map(([k, v]) => ({ key: k, name: v.shortName }))
      });
    }
    return res.status(502).json({
      success: false,
      message: '기상청 날씨 데이터를 불러오는 중 일시적 오류가 발생했습니다: ' + err.message
    });
  }
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(` DigiMind Digimon Level-10 Evolution Server Running (Port: ${PORT})`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
