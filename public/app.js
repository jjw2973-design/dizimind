/* ==========================================================================
   DigiMind Engine (app.js)
   - 1997 Digimon Official Visual Encyclopedia Vector Graphic Renderer
   - Level 10-Threshold Evolution System (Lv.1~10: Baby / Lv.11~20: Rookie / Lv.21~30: Champion / Lv.31~40: Ultimate / Lv.41~50: Mega)
   ========================================================================== */

// === 1997 DIGIMON OFFICIAL VECTOR GRAPHIC GENERATOR === //
function getDigimonSVGVector(partnerId, stage) {
  // Agumon Evolution Line
  if (partnerId === 'agumon_line') {
    if (stage === 1) { // Koromon (코로몬)
      return `
        <svg viewBox="0 0 100 100" class="digimon-svg">
          <!-- Ears -->
          <path d="M 22 45 C 10 20 5 15 18 10 C 30 5 30 25 35 38 Z" fill="#fda4af" stroke="#e11d48" stroke-width="2"/>
          <path d="M 78 45 C 90 20 95 15 82 10 C 70 5 70 25 65 38 Z" fill="#fda4af" stroke="#e11d48" stroke-width="2"/>
          <!-- Body -->
          <circle cx="50" cy="55" r="32" fill="#fda4af" stroke="#e11d48" stroke-width="2.5"/>
          <!-- Eyes -->
          <ellipse cx="38" cy="52" rx="4" ry="7" fill="#991b1b"/>
          <ellipse cx="62" cy="52" rx="4" ry="7" fill="#991b1b"/>
          <circle cx="39" cy="49" r="1.5" fill="#ffffff"/>
          <circle cx="63" cy="49" r="1.5" fill="#ffffff"/>
          <!-- Cheeks & Cute Mouth -->
          <circle cx="30" cy="60" r="3.5" fill="#f43f5e" opacity="0.6"/>
          <circle cx="70" cy="60" r="3.5" fill="#f43f5e" opacity="0.6"/>
          <path d="M 44 62 Q 50 67 56 62" fill="none" stroke="#991b1b" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    } else if (stage === 2) { // Agumon (아구몬)
      return `
        <svg viewBox="0 0 120 120" class="digimon-svg">
          <!-- Tail -->
          <path d="M 80 85 Q 105 80 95 65 Q 85 70 75 78 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/>
          <!-- Feet -->
          <ellipse cx="40" cy="102" rx="16" ry="8" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
          <ellipse cx="80" cy="102" rx="16" ry="8" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
          <!-- Claws -->
          <path d="M 28 102 L 28 107 M 40 102 L 40 108 M 52 102 L 52 107" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M 68 102 L 68 107 M 80 102 L 80 108 M 92 102 L 92 107" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Body & Arms -->
          <ellipse cx="60" cy="72" rx="28" ry="26" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/>
          <path d="M 36 68 Q 20 65 24 80 Q 32 78 38 72 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
          <path d="M 84 68 Q 100 65 96 80 Q 88 78 82 72 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
          <!-- Head -->
          <path d="M 32 45 C 32 20 88 20 88 45 C 88 60 32 60 32 45 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/>
          <!-- Eyes -->
          <ellipse cx="48" cy="40" rx="6" ry="9" fill="#15803d"/>
          <ellipse cx="72" cy="40" rx="6" ry="9" fill="#15803d"/>
          <ellipse cx="49" cy="38" rx="2" ry="4" fill="#ffffff"/>
          <ellipse cx="73" cy="38" rx="2" ry="4" fill="#ffffff"/>
          <!-- Snout & Teeth -->
          <path d="M 40 52 Q 60 58 80 52" fill="none" stroke="#d97706" stroke-width="2"/>
          <polygon points="46,52 49,56 52,52" fill="#ffffff"/>
          <polygon points="68,52 71,56 74,52" fill="#ffffff"/>
        </svg>
      `;
    } else if (stage === 3) { // Greymon (그레이몬)
      return `
        <svg viewBox="0 0 130 130" class="digimon-svg">
          <!-- Tail -->
          <path d="M 90 90 Q 125 80 110 50 Q 95 65 85 80 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
          <!-- Blue Stripe Body -->
          <ellipse cx="65" cy="80" rx="34" ry="30" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
          <path d="M 45 70 Q 65 75 85 70" stroke="#0284c7" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M 40 85 Q 65 90 90 85" stroke="#0284c7" stroke-width="5" fill="none" stroke-linecap="round"/>
          <!-- Helmet (Brown 3-Horn Head) -->
          <path d="M 35 50 C 30 20 100 20 95 50 C 95 65 35 65 35 50 Z" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
          <!-- Center Horn -->
          <polygon points="65,30 57,5 73,5" fill="#451a03" stroke="#78350f" stroke-width="1.5"/>
          <!-- Side Horns -->
          <polygon points="38,35 15,20 30,45" fill="#451a03"/>
          <polygon points="92,35 115,20 100,45" fill="#451a03"/>
          <!-- Red Glowing Eyes -->
          <circle cx="50" cy="45" r="5" fill="#ef4444"/>
          <circle cx="80" cy="45" r="5" fill="#ef4444"/>
          <circle cx="51" cy="44" r="1.5" fill="#ffffff"/>
          <circle cx="81" cy="44" r="1.5" fill="#ffffff"/>
        </svg>
      `;
    } else if (stage === 4) { // MetalGreymon (메탈그레이몬)
      return `
        <svg viewBox="0 0 140 140" class="digimon-svg">
          <!-- Wings -->
          <path d="M 30 40 Q 5 10 35 25 Q 10 35 45 45 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
          <path d="M 110 40 Q 135 10 105 25 Q 130 35 95 45 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
          <!-- Body -->
          <ellipse cx="70" cy="85" rx="36" ry="32" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
          <!-- Cyborg Metal Chest & Metal Arm -->
          <rect x="52" y="70" width="36" height="25" rx="6" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/>
          <path d="M 30 80 L 52 85 M 25 75 L 30 95" stroke="#64748b" stroke-width="6" stroke-linecap="round"/>
          <polygon points="20,70 10,80 20,90" fill="#cbd5e1" stroke="#475569"/>
          <!-- Helmet -->
          <path d="M 40 50 C 35 20 105 20 100 50 C 100 65 40 65 40 50 Z" fill="#64748b" stroke="#334155" stroke-width="2.5"/>
          <polygon points="70,25 62,0 78,0" fill="#cbd5e1" stroke="#475569"/>
          <circle cx="55" cy="48" r="5" fill="#ef4444"/>
          <circle cx="85" cy="48" r="5" fill="#ef4444"/>
        </svg>
      `;
    } else { // WarGreymon (워그레이몬)
      return `
        <svg viewBox="0 0 150 150" class="digimon-svg">
          <!-- Shield Wings (Brave Shield) -->
          <path d="M 25 30 Q 5 70 45 90 Z" fill="#f59e0b" stroke="#b45309" stroke-width="2.5"/>
          <path d="M 125 30 Q 145 70 105 90 Z" fill="#f59e0b" stroke="#b45309" stroke-width="2.5"/>
          <circle cx="28" cy="60" r="6" fill="#ef4444"/>
          <circle cx="122" cy="60" r="6" fill="#ef4444"/>
          <!-- Gold Armor Body -->
          <ellipse cx="75" cy="85" rx="30" ry="35" fill="#f59e0b" stroke="#b45309" stroke-width="2.5"/>
          <path d="M 60 70 L 75 95 L 90 70" stroke="#ffffff" stroke-width="3" fill="none"/>
          <!-- Dramon Killers Claws -->
          <path d="M 35 75 L 15 65 M 35 85 L 10 80 M 35 95 L 15 95" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
          <path d="M 115 75 L 135 65 M 115 85 L 140 80 M 115 95 L 135 95" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
          <!-- Golden Dragon Helmet -->
          <path d="M 50 45 C 50 20 100 20 100 45 L 95 60 L 55 60 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2.5"/>
          <polygon points="75,20 68,-5 82,-5" fill="#cbd5e1" stroke="#475569"/>
          <ellipse cx="63" cy="45" rx="4" ry="6" fill="#0284c7"/>
          <ellipse cx="87" cy="45" rx="4" ry="6" fill="#0284c7"/>
        </svg>
      `;
    }
  }

  // Gabumon Evolution Line
  if (partnerId === 'gabumon_line') {
    if (stage === 1) { // Tunomon (뿔몬)
      return `
        <svg viewBox="0 0 100 100" class="digimon-svg">
          <!-- Center Horn -->
          <polygon points="50,40 40,5 60,5" fill="#ea580c" stroke="#9a3412" stroke-width="2"/>
          <!-- Round Body -->
          <circle cx="50" cy="60" r="30" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/>
          <!-- Eyes -->
          <ellipse cx="38" cy="56" rx="4" ry="7" fill="#0369a1"/>
          <ellipse cx="62" cy="56" rx="4" ry="7" fill="#0369a1"/>
          <circle cx="39" cy="54" r="1.5" fill="#ffffff"/>
          <circle cx="63" cy="54" r="1.5" fill="#ffffff"/>
          <path d="M 45 66 Q 50 70 55 66" fill="none" stroke="#9a3412" stroke-width="2"/>
        </svg>
      `;
    } else if (stage === 2) { // Gabumon (파피몬)
      return `
        <svg viewBox="0 0 120 120" class="digimon-svg">
          <!-- Horn -->
          <polygon points="60,35 53,5 67,5" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
          <!-- Fur Coat (Silver & Blue Stripes) -->
          <path d="M 30 50 C 25 100 95 100 90 50 Z" fill="#818cf8" stroke="#4338ca" stroke-width="2.5"/>
          <path d="M 45 65 Q 60 70 75 65" stroke="#312e81" stroke-width="4" fill="none"/>
          <path d="M 40 80 Q 60 85 80 80" stroke="#312e81" stroke-width="4" fill="none"/>
          <!-- Inner Face -->
          <ellipse cx="60" cy="55" rx="18" ry="16" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
          <ellipse cx="52" cy="52" rx="3" ry="5" fill="#b91c1c"/>
          <ellipse cx="68" cy="52" rx="3" ry="5" fill="#b91c1c"/>
          <!-- Cute Belly Symbol -->
          <ellipse cx="60" cy="82" rx="10" ry="12" fill="#fda4af"/>
        </svg>
      `;
    } else if (stage === 3) { // Garurumon (가루몬)
      return `
        <svg viewBox="0 0 130 130" class="digimon-svg">
          <!-- Wolf Tail -->
          <path d="M 95 85 Q 130 75 115 50 Z" fill="#818cf8" stroke="#3730a3" stroke-width="2.5"/>
          <!-- Silver & Blue Wolf Body -->
          <ellipse cx="65" cy="80" rx="38" ry="28" fill="#e0e7ff" stroke="#3730a3" stroke-width="2.5"/>
          <path d="M 45 70 Q 65 75 85 70" stroke="#312e81" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M 40 85 Q 65 90 90 85" stroke="#312e81" stroke-width="5" fill="none" stroke-linecap="round"/>
          <!-- Wolf Head & Ears -->
          <polygon points="35,40 25,15 45,30" fill="#818cf8"/>
          <polygon points="95,40 105,15 85,30" fill="#818cf8"/>
          <path d="M 35 50 Q 65 30 95 50 Q 65 65 35 50 Z" fill="#e0e7ff" stroke="#3730a3" stroke-width="2.5"/>
          <circle cx="50" cy="45" r="4" fill="#b91c1c"/>
          <circle cx="80" cy="45" r="4" fill="#b91c1c"/>
        </svg>
      `;
    } else if (stage === 4) { // WereGarurumon (워가루몬)
      return `
        <svg viewBox="0 0 140 140" class="digimon-svg">
          <!-- Bipedal Wolf Warrior Body -->
          <ellipse cx="70" cy="80" rx="28" ry="38" fill="#818cf8" stroke="#312e81" stroke-width="2.5"/>
          <!-- Boxing Belt & Jeans -->
          <rect x="52" y="90" width="36" height="20" fill="#1e3a8a" stroke="#1d4ed8" stroke-width="2"/>
          <path d="M 40 70 L 20 85 M 100 70 L 120 85" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round"/>
          <!-- Wolf Mask Head -->
          <polygon points="45,35 30,10 55,25" fill="#e0e7ff"/>
          <polygon points="95,35 110,10 85,25" fill="#e0e7ff"/>
          <ellipse cx="70" cy="45" rx="22" ry="16" fill="#e0e7ff" stroke="#312e81" stroke-width="2.5"/>
          <circle cx="60" cy="42" r="4" fill="#ef4444"/>
          <circle cx="80" cy="42" r="4" fill="#ef4444"/>
        </svg>
      `;
    } else { // MetalGarurumon (메탈가루몬)
      return `
        <svg viewBox="0 0 150 150" class="digimon-svg">
          <!-- Cyborg Metal Wings & Cannons -->
          <path d="M 25 35 L 5 15 L 35 45 Z" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
          <path d="M 125 35 L 145 15 L 115 45 Z" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
          <!-- Metal Wolf Body -->
          <ellipse cx="75" cy="80" rx="42" ry="30" fill="#38bdf8" stroke="#0284c7" stroke-width="2.5"/>
          <rect x="55" y="65" width="40" height="20" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
          <!-- Laser Nose & Goggles Head -->
          <path d="M 40 45 Q 75 25 110 45 Q 75 65 40 45 Z" fill="#cbd5e1" stroke="#0284c7" stroke-width="2.5"/>
          <rect x="55" y="40" width="40" height="10" rx="3" fill="#ef4444"/>
        </svg>
      `;
    }
  }

  // Gatomon Evolution Line (Default Fallback)
  if (stage === 1) { // Nyaromon (야옹몬)
    return `
      <svg viewBox="0 0 100 100" class="digimon-svg">
        <polygon points="30,35 20,10 40,25" fill="#facc15"/>
        <polygon points="70,35 80,10 60,25" fill="#facc15"/>
        <circle cx="50" cy="58" r="28" fill="#fde047" stroke="#ca8a04" stroke-width="2.5"/>
        <ellipse cx="40" cy="54" rx="4" ry="7" fill="#7e22ce"/>
        <ellipse cx="60" cy="54" rx="4" ry="7" fill="#7e22ce"/>
      </svg>
    `;
  } else if (stage === 2) { // Salamon (플롯트몬)
    return `
      <svg viewBox="0 0 120 120" class="digimon-svg">
        <path d="M 30 45 C 10 30 10 70 30 60 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
        <path d="M 90 45 C 110 30 110 70 90 60 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
        <ellipse cx="60" cy="65" rx="28" ry="26" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
        <circle cx="50" cy="60" r="5" fill="#0f172a"/>
        <circle cx="70" cy="60" r="5" fill="#0f172a"/>
      </svg>
    `;
  } else if (stage === 3) { // Gatomon (가트몬)
    return `
      <svg viewBox="0 0 130 130" class="digimon-svg">
        <polygon points="35,40 20,10 45,25" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
        <polygon points="95,40 110,10 85,25" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
        <ellipse cx="65" cy="75" rx="30" ry="28" fill="#ffffff" stroke="#64748b" stroke-width="2.5"/>
        <!-- Holy Ring Tail -->
        <circle cx="95" cy="90" r="10" fill="none" stroke="#eab308" stroke-width="4"/>
        <circle cx="53" cy="68" r="4.5" fill="#2563eb"/>
        <circle cx="77" cy="68" r="4.5" fill="#2563eb"/>
      </svg>
    `;
  } else if (stage === 4) { // Angewomon (엔젤우몬)
    return `
      <svg viewBox="0 0 140 140" class="digimon-svg">
        <!-- 8 Angel Wings -->
        <path d="M 20 30 Q -5 10 30 50 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M 120 30 Q 145 10 110 50 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M 15 50 Q -10 40 25 70 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M 125 50 Q 150 40 115 70 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <!-- Angel Body & Helmet -->
        <ellipse cx="70" cy="80" rx="22" ry="34" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <rect x="52" y="38" width="36" height="16" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <path d="M 40 60 Q 70 80 100 60" stroke="#f43f5e" stroke-width="4" fill="none"/>
      </svg>
    `;
  } else { // Ophanimon (오파니몬)
    return `
      <svg viewBox="0 0 150 150" class="digimon-svg">
        <path d="M 20 20 Q -10 50 40 70 Z" fill="#34d399" stroke="#059669" stroke-width="2"/>
        <path d="M 130 20 Q 160 50 110 70 Z" fill="#34d399" stroke="#059669" stroke-width="2"/>
        <ellipse cx="75" cy="80" rx="26" ry="36" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/>
        <polygon points="75,10 65,30 85,30" fill="#fbbf24"/>
        <circle cx="75" cy="45" r="8" fill="#06b6d4"/>
      </svg>
    `;
  }
}

const DIGIMON_DATA = {
  agumon_line: {
    name: "불꽃 아구몬 라인",
    stages: {
      1: { name: "코로몬 (Koromon)", badge: "유년기 I (Lv.1~10)", quote: "기지개 한 번으로 시원한 아침을 시작해봐!", color: "#fda4af" },
      2: { name: "아구몬 (Agumon)", badge: "성장기 (Lv.11~20)", quote: "이불 개기와 웃어보기 성공! 매일매일 더 강해지고 있어!", color: "#fbbf24" },
      3: { name: "그레이몬 (Greymon)", badge: "성숙기 (Lv.21~30)", quote: "스트레칭과 30분 산책으로 당당한 마음의 뿔이 돋아났어!", color: "#ea580c" },
      4: { name: "메탈그레이몬 (MetalGreymon)", badge: "완전체 (Lv.31~40)", quote: "단단해진 자존감의 날개! 어떠한 소외감도 날려버릴 힘!", color: "#2563eb" },
      5: { name: "워그레이몬 (WarGreymon)", badge: "궁극체 (Lv.41~50)", quote: "최고의 성취에 도달하셨습니다! 당신은 빛나는 용기의 전사!", color: "#f59e0b" }
    }
  },
  gabumon_line: {
    name: "은빛 파피몬 라인",
    stages: {
      1: { name: "뿔몬 (Tunomon)", badge: "유년기 I (Lv.1~10)", quote: "작은 물 한 잔으로 나를 아끼는 마음을 건네보아요.", color: "#fed7aa" },
      2: { name: "파피몬 (Gabumon)", badge: "성장기 (Lv.11~20)", quote: "포근한 모피처럼 다정한 눈빛으로 오늘 하루를 칭찬해!", color: "#818cf8" },
      3: { name: "가루몬 (Garurumon)", badge: "성숙기 (Lv.21~30)", quote: "은빛 늑대의 질주! 바람을 쐬고 온 당신의 미소가 빛나요.", color: "#38bdf8" },
      4: { name: "워가루몬 (WereGarurumon)", badge: "완전체 (Lv.31~40)", quote: "스스로 일어서는 굳건한 발걸음! 거친 방황도 승리해요.", color: "#a855f7" },
      5: { name: "메탈가루몬 (MetalGarurumon)", badge: "궁극체 (Lv.41~50)", quote: "차가운 세상 속을 뚫고 나온 전설의 영웅! 눈부신 도약!", color: "#06b6d4" }
    }
  },
  gatomon_line: {
    name: "빛의 가트몬 라인",
    stages: {
      1: { name: "야옹몬 (Nyaromon)", badge: "유년기 I (Lv.1~9)", quote: "방 책상을 정돈하니 마음에 맑은 바람이 들어요.", color: "#fde047" },
      2: { name: "플롯트몬 (Salamon)", badge: "성장기 (Lv.10~19)", quote: "귀를 쫑긋! 가족에게 마음을 표현해 준 당신이 멋져요.", color: "#f8fafc" },
      3: { name: "가트몬 (Gatomon)", badge: "성숙기 (Lv.20~29)", quote: "당신의 성취감이 신성한 반지처럼 빛납니다!", color: "#facc15" },
      4: { name: "엔젤우몬 (Angewomon)", badge: "완전체 (Lv.30~39)", quote: "빛나는 희망의 화살! 상처받았던 마음이 치유됩니다.", color: "#f43f5e" },
      5: { name: "오파니몬 (Ophanimon)", badge: "궁극체 (Lv.40+)", quote: "자애로운 빛의 마법! 당신의 내일은 늘 축복받을 거예요.", color: "#a855f7" }
    }
  }
};

let currentUser = JSON.parse(localStorage.getItem('digimind_user')) || {
  username: "demo",
  nickname: "용기있는 코로몬",
  partnerId: "agumon_line",
  level: 1,
  stage: 1,
  exp: 20,
  maxExp: 100,
  warmthTemp: 36.5,
  points: 1250,
  pointLogs: [],
  redemptions: [],
  completedQuests: ["l1_q2"],
  customQuests: []
};

let currentLevelQuests = [];
let postsList = [];

class SoundFX {
  static init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
  static playSuccess() {
    try {
      this.init();
      const osc = this.ctx.createOscillator(), gain = this.ctx.createGain(), now = this.ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.35);
    } catch (e) {}
  }
  static playEvolution() {
    try {
      this.init();
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
        osc.type = 'square'; osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08); osc.stop(now + idx * 0.08 + 0.2);
      });
    } catch (e) {}
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateUserStatusBar();
  loadRoutineData();
  fetchPeersList();
  fetchPosts();
});

// === AUTH & HEADER === //
function updateUserStatusBar() {
  const userTextElem = document.getElementById('logged-user-text');
  const tempBadgeElem = document.getElementById('header-warmth-temp');
  const pointsBadgeElem = document.getElementById('header-points-badge');
  const btnAuthElem = document.getElementById('btn-auth-action');

  const userLevel = currentUser.level || 1;
  const tempVal = currentUser.warmthTemp ? currentUser.warmthTemp.toFixed(1) : '36.5';
  const pointsVal = (currentUser.points || 0).toLocaleString();

  if (currentUser && currentUser.username) {
    userTextElem.innerText = `👤 ${currentUser.nickname} (Lv.${userLevel})`;
    tempBadgeElem.innerText = `🌡️ ${tempVal}℃`;
    pointsBadgeElem.innerText = `💰 ${pointsVal} P`;
    btnAuthElem.innerText = '로그아웃';
    btnAuthElem.onclick = handleLogout;
  } else {
    userTextElem.innerText = '👤 게스트 모드';
    tempBadgeElem.innerText = `🌡️ 36.5℃`;
    pointsBadgeElem.innerText = `💰 0 P`;
    btnAuthElem.innerText = '로그인';
    btnAuthElem.onclick = () => switchTab('auth');
  }

  renderPointWallet();
}

function toggleAuthMode(mode) {
  const btnLogin = document.getElementById('btn-show-login');
  const btnReg = document.getElementById('btn-show-register');
  const formLogin = document.getElementById('login-form');
  const formReg = document.getElementById('register-form');

  if (mode === 'login') {
    btnLogin.classList.add('active'); btnReg.classList.remove('active');
    formLogin.classList.remove('hidden'); formReg.classList.add('hidden');
  } else {
    btnReg.classList.add('active'); btnLogin.classList.remove('active');
    formReg.classList.remove('hidden'); formLogin.classList.add('hidden');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      localStorage.setItem('digimind_user', JSON.stringify(currentUser));
      updateUserStatusBar();
      await loadRoutineData();
      alert(`환영합니다, ${currentUser.nickname}님!`);
      switchTab('routine');
    } else { alert(data.message || '로그인 실패'); }
  } catch (err) { console.error('Login error:', err); }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  const nickname = document.getElementById('reg-nickname').value;
  const partnerId = document.getElementById('reg-partner').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, nickname, partnerId })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message);
      toggleAuthMode('login');
      document.getElementById('login-username').value = username;
      document.getElementById('login-password').value = password;
    } else { alert(data.message || '회원가입 실패'); }
  } catch (err) { console.error('Register error:', err); }
}

function handleLogout() {
  localStorage.removeItem('digimind_user');
  currentUser = { username: "demo", nickname: "게스트 디지몬", partnerId: "agumon_line", level: 1, stage: 1, exp: 0, maxExp: 100, warmthTemp: 36.5, points: 0, completedQuests: [], customQuests: [] };
  updateUserStatusBar();
  loadRoutineData();
  alert('로그아웃 되었습니다.');
}

async function fetchPeersList() {
  try {
    const res = await fetch('/api/users/peers');
    const data = await res.json();
    if (data.success) renderPeers(data.peers);
  } catch (err) { console.error('Failed to fetch peers:', err); }
}

function renderPeers(peers) {
  const container = document.getElementById('peers-list');
  if (!container) return;

  container.innerHTML = peers.map(p => {
    const spec = DIGIMON_DATA[p.partnerId] || DIGIMON_DATA.agumon_line;
    const stageSpec = spec.stages[p.stage] || spec.stages[1];
    const tempVal = p.warmthTemp ? p.warmthTemp.toFixed(1) : '36.5';
    const svgContent = getDigimonSVGVector(p.partnerId, p.stage || 1);
    return `
      <div class="peer-card">
        <div class="peer-icon-box" style="width: 50px; height: 50px;">
          ${svgContent}
        </div>
        <div class="peer-info">
          <h4>${escapeHtml(p.nickname)} <span class="warmth-temp-pill">🌡️ ${tempVal}℃</span></h4>
          <p>Lv.${p.level || 1} ${stageSpec.name}</p>
        </div>
      </div>
    `;
  }).join('');
}

// === PAGE 2: MY DIGIMON & LEVEL-10 THRESHOLD EVOLUTION === //
async function loadRoutineData() {
  if (!currentUser || !currentUser.username) return;
  try {
    const res = await fetch(`/api/routine/user/${currentUser.username}`);
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      currentLevelQuests = data.levelQuests || [];
      localStorage.setItem('digimind_user', JSON.stringify(currentUser));
      updateUserStatusBar();
      renderDigivice();
      renderQuests(data.currentLevelKey);
    }
  } catch (err) { console.error('Error loading routine data:', err); }
}

function renderDigivice() {
  const { partnerId, level, stage, exp, maxExp, warmthTemp, points } = currentUser;
  const userLevel = level || 1;
  const userStage = stage || 1;
  const partnerSpec = DIGIMON_DATA[partnerId] || DIGIMON_DATA.agumon_line;
  const currentStageSpec = partnerSpec.stages[userStage] || partnerSpec.stages[1];

  const selectElem = document.getElementById('partner-select');
  if (selectElem) selectElem.value = partnerId;

  document.getElementById('avatar-stage-badge').innerText = currentStageSpec.badge;
  const tempVal = warmthTemp ? warmthTemp.toFixed(1) : '36.5';
  const pointsVal = (points || 0).toLocaleString();

  document.getElementById('digivice-warmth-temp').innerText = `🌡️ ${tempVal}℃`;
  document.getElementById('digivice-points-pill').innerText = `💰 ${pointsVal} P`;

  document.getElementById('avatar-name').innerText = `Lv.${userLevel} ${currentStageSpec.name}`;
  document.getElementById('avatar-quote').innerText = `"${currentStageSpec.quote}"`;

  const graphicBox = document.getElementById('avatar-graphic');
  if (graphicBox) {
    graphicBox.style.background = `radial-gradient(circle, ${currentStageSpec.color}44, transparent 75%)`;
    if (warmthTemp >= 40.0) graphicBox.classList.add('warmth-aura');
    else graphicBox.classList.remove('warmth-aura');

    const digimonSVG = getDigimonSVGVector(partnerId, userStage);

    graphicBox.innerHTML = `
      <div class="cute-avatar-container">
        <div class="cute-bg-ring" style="border-color: ${currentStageSpec.color};"></div>
        <div class="cute-sparkle-left">✨</div>
        <div class="cute-sparkle-right">🌟</div>
        <div class="svg-avatar-wrapper" style="width: 110px; height: 110px; z-index: 2;">
          ${digimonSVG}
        </div>
        <div class="cute-pet-shadow"></div>
      </div>
    `;
  }

  const expPercent = Math.min(100, Math.floor((exp / maxExp) * 100));
  document.getElementById('exp-text').innerText = `${exp} / ${maxExp} EXP (${expPercent}%)`;
  document.getElementById('exp-bar-fill').style.width = `${expPercent}%`;
}

function renderQuests(levelKey) {
  const questsContainer = document.getElementById('quests-list');
  const levelBadgeElem = document.getElementById('current-quest-level-badge');
  if (!questsContainer) return;

  if (levelBadgeElem) {
    levelBadgeElem.innerText = `${levelKey || Math.min(3, currentUser.stage)}단계 업그레이드 퀘스트`;
  }

  const allQuests = [...currentLevelQuests, ...(currentUser.customQuests || [])];
  const completedSet = new Set(currentUser.completedQuests || []);

  questsContainer.innerHTML = allQuests.map(q => {
    const isDone = completedSet.has(q.id);
    return `
      <div class="quest-item ${isDone ? 'completed' : ''}" onclick="toggleQuest('${q.id}', ${q.exp})">
        <div class="quest-left">
          <div class="quest-checkbox">${isDone ? '✓' : ''}</div>
          <span class="quest-title">${escapeHtml(q.title)}</span>
        </div>
        <div style="display:flex; gap:6px;">
          <span class="quest-exp-badge">+${q.exp} EXP</span>
          <span style="font-family:var(--font-pixel); background:rgba(245,158,11,0.2); color:#f59e0b; padding:4px 10px; border-radius:12px; font-size:0.8rem;">+50 P</span>
        </div>
      </div>
    `;
  }).join('');
}

async function toggleQuest(questId, expAmount) {
  try {
    const res = await fetch('/api/routine/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser.username, questId, expAmount })
    });
    const data = await res.json();

    if (data.success) {
      currentUser = data.user;
      currentLevelQuests = data.levelQuests;
      localStorage.setItem('digimind_user', JSON.stringify(currentUser));
      updateUserStatusBar();
      renderDigivice();
      renderQuests(data.currentLevelKey);

      if (data.user.completedQuests.includes(questId)) {
        SoundFX.playSuccess();
      }

      if (data.evolved) {
        showEvolutionModal(data.previousStage, data.currentStage);
      }
    }
  } catch (err) { console.error('Failed to toggle quest:', err); }
}

async function addCustomQuest() {
  const inputElem = document.getElementById('custom-quest-input');
  const expElem = document.getElementById('custom-quest-exp');
  if (!inputElem || !inputElem.value.trim()) return;

  try {
    const res = await fetch('/api/routine/add-quest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser.username, title: inputElem.value.trim(), exp: expElem.value })
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      inputElem.value = '';
      renderQuests(Math.min(3, currentUser.stage));
    }
  } catch (err) { console.error('Failed to add custom quest:', err); }
}

async function changePartnerLine(partnerId) {
  try {
    const res = await fetch('/api/routine/partner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser.username, partnerId })
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      renderDigivice();
    }
  } catch (err) { console.error('Failed to change partner line:', err); }
}

function showEvolutionModal(prevStage, newStage) {
  SoundFX.playEvolution();
  const partnerSpec = DIGIMON_DATA[currentUser.partnerId] || DIGIMON_DATA.agumon_line;
  const prevSpec = partnerSpec.stages[prevStage] || partnerSpec.stages[1];
  const newSpec = partnerSpec.stages[newStage] || partnerSpec.stages[2];

  const prevSVG = getDigimonSVGVector(currentUser.partnerId, prevStage);
  const newSVG = getDigimonSVGVector(currentUser.partnerId, newStage);

  document.getElementById('evo-from-img').innerHTML = `<div style="width: 70px; height: 70px; margin: 0 auto;">${prevSVG}</div>`;
  document.getElementById('evo-from-name').innerText = prevSpec.name;
  document.getElementById('evo-to-img').innerHTML = `<div style="width: 90px; height: 90px; margin: 0 auto;">${newSVG}</div>`;
  document.getElementById('evo-to-name').innerText = `${newSpec.name} (${newSpec.badge})`;
  document.getElementById('evo-dialog').innerText = `"축하합니다! 레벨 ${currentUser.level} 달성으로 ${newSpec.name}(으)로 웅장하게 진화하였습니다! 축하 포인트 +500 P가 적립되었습니다!"`;

  document.getElementById('evolution-modal').classList.remove('hidden');
}

function closeEvolutionModal() { document.getElementById('evolution-modal').classList.add('hidden'); }

// === PAGE 3: COMMUNITY & SECRET REPORT / HOTLINE === //
async function fetchPosts() {
  try {
    const res = await fetch('/api/posts');
    const data = await res.json();
    if (data.success) {
      postsList = data.posts || [];
      renderPosts();
    }
  } catch (err) { console.error('Failed to fetch posts:', err); }
}

function renderPosts() {
  const postsContainer = document.getElementById('posts-feed');
  if (!postsContainer) return;

  postsContainer.innerHTML = postsList.map(post => {
    const partnerSpec = DIGIMON_DATA[post.partnerId] || DIGIMON_DATA.agumon_line;
    const stageSpec = partnerSpec.stages[post.avatarStage || 1] || partnerSpec.stages[1];
    const postTemp = post.warmthTemp ? post.warmthTemp.toFixed(1) : '36.5';
    const svgIcon = getDigimonSVGVector(post.partnerId, post.avatarStage || 1);

    if (post.isBlinded) {
      return `
        <div class="post-card blinded">
          <p style="color:#fb7185; font-size:0.9rem;">🔒 [신고가 누적되어 자동 임시 보호/블라인드 처리된 게시글입니다]</p>
        </div>
      `;
    }

    return `
      <div class="post-card">
        <div class="post-header">
          <div class="post-header-left">
            <div class="post-avatar-icon" style="border-color:${stageSpec.color}; width: 48px; height: 48px; padding: 4px;">
              ${svgIcon}
            </div>
            <div class="post-meta">
              <div class="author-name">${escapeHtml(post.author)} <span class="warmth-temp-pill">🌡️ ${postTemp}℃</span> <span class="stage-badge" style="font-size:0.65rem; background:${stageSpec.color}; color:#fff;">${stageSpec.name}</span></div>
              <div class="post-date">${formatDate(post.createdAt)}</div>
            </div>
          </div>
        </div>

        <div class="post-body">${escapeHtml(post.content)}</div>

        <div class="reactions-bar">
          <button class="btn-react" onclick="reactPost('${post.id}', 'warm')">❤️ 따뜻해요 <span>${post.reactions?.warm || 0}</span></button>
          <button class="btn-react" onclick="reactPost('${post.id}', 'support')">👏 응원해요 <span>${post.reactions?.support || 0}</span></button>
          <button class="btn-react" onclick="reactPost('${post.id}', 'hello')">👋 인사해요 <span>${post.reactions?.hello || 0}</span></button>
          <button class="btn-report" onclick="reportPost('${post.id}')">🚨 신고하기</button>
        </div>

        <div class="comments-section">
          ${(post.comments || []).map(c => `
            <div class="comment-item">
              <span class="comment-author">${escapeHtml(c.author)}:</span>
              <span class="comment-text">${escapeHtml(c.content)}</span>
            </div>
          `).join('')}
          <div class="comment-input-row">
            <input type="text" id="comment-input-${post.id}" placeholder="동료 청년에게 다정한 온기 한마디 건네기..." onkeypress="if(event.key==='Enter') submitComment('${post.id}')" />
            <button class="btn-add-comment" onclick="submitComment('${post.id}')">남기기</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openPostModal() {
  document.getElementById('post-author-input').value = currentUser.nickname || "익명의 디지몬";
  document.getElementById('post-modal').classList.remove('hidden');
}
function closePostModal() { document.getElementById('post-modal').classList.add('hidden'); }

async function submitPost() {
  const contentInput = document.getElementById('post-content-input');
  if (!contentInput || !contentInput.value.trim()) return alert('내용을 입력해주세요.');

  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: currentUser.nickname,
        content: contentInput.value.trim(),
        avatarStage: currentUser.stage,
        partnerId: currentUser.partnerId
      })
    });
    const data = await res.json();
    if (data.success) {
      contentInput.value = '';
      closePostModal();
      postsList = data.posts;
      renderPosts();
    }
  } catch (err) { console.error('Failed submit post:', err); }
}

async function reactPost(postId, type) {
  try {
    const res = await fetch(`/api/posts/${postId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    const data = await res.json();
    if (data.success) {
      postsList = data.posts;
      renderPosts();
      await fetchPeersList();
      await loadRoutineData();
    }
  } catch (err) { console.error('Failed react post:', err); }
}

async function reportPost(postId) {
  if (!confirm('비매너, 욕설, 광고 등 유해 게시글로 신고하시겠습니까?')) return;
  try {
    const res = await fetch(`/api/posts/${postId}/report`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      alert(data.message);
      postsList = data.posts;
      renderPosts();
      await fetchPeersList();
    }
  } catch (err) { console.error('Failed report post:', err); }
}

async function submitComment(postId) {
  const inputElem = document.getElementById(`comment-input-${postId}`);
  if (!inputElem || !inputElem.value.trim()) return;

  try {
    const res = await fetch(`/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: currentUser.nickname, content: inputElem.value.trim() })
    });
    const data = await res.json();
    if (data.success) {
      inputElem.value = '';
      postsList = data.posts;
      renderPosts();
    }
  } catch (err) { console.error('Failed comment post:', err); }
}

function openTempGuideModal() { document.getElementById('temp-guide-modal').classList.remove('hidden'); }
function closeTempGuideModal() { document.getElementById('temp-guide-modal').classList.add('hidden'); }

// Secret Report & Hotline Modals
function openSecretReportModal() { document.getElementById('secret-report-modal').classList.remove('hidden'); }
function closeSecretReportModal() { document.getElementById('secret-report-modal').classList.add('hidden'); }
function openHotlineModal() { document.getElementById('hotline-modal').classList.remove('hidden'); }
function closeHotlineModal() { document.getElementById('hotline-modal').classList.add('hidden'); }

function submitSecretReport() {
  const target = document.getElementById('secret-report-target').value;
  const content = document.getElementById('secret-report-content').value;
  if (!target || !content) return alert('신고 대상과 제보 내용을 입력해 주세요.');

  alert(`🚨 전담 헬프데스크에 1:1 비밀 제보가 안전하게 접수되었습니다.\n(접수번호: SEC-${Math.floor(100000+Math.random()*900000)})\n24시간 이내에 운영팀이 비매너/유해 유저를 검토하여 처리합니다.`);
  document.getElementById('secret-report-target').value = '';
  document.getElementById('secret-report-content').value = '';
  closeSecretReportModal();
}

// === PAGE 4: POINT WALLET & REWARD SHOP === //
function renderPointWallet() {
  const balanceElem = document.getElementById('my-points-amount');
  if (balanceElem) {
    const pts = (currentUser.points || 0).toLocaleString();
    balanceElem.innerText = `${pts} P`;
  }

  const logsListElem = document.getElementById('point-logs-list');
  if (logsListElem) {
    const logs = currentUser.pointLogs || [];
    if (logs.length === 0) {
      logsListElem.innerHTML = `<div style="font-size:0.82rem; color:#94a3b8;">아직 적립된 포인트 내역이 없습니다.</div>`;
    } else {
      logsListElem.innerHTML = logs.map(l => `
        <div class="log-item ${l.amount > 0 ? 'plus' : 'minus'}">
          <span>${escapeHtml(l.title)} <span style="font-size:0.75rem; color:#94a3b8;">(${formatDate(l.date)})</span></span>
          <span class="amount">${l.amount > 0 ? '+' : ''}${l.amount.toLocaleString()} P</span>
        </div>
      `).join('');
    }
  }

  const redemptionListElem = document.getElementById('redemption-list');
  if (redemptionListElem) {
    const redemptions = currentUser.redemptions || [];
    if (redemptions.length === 0) {
      redemptionListElem.innerHTML = `<div style="font-size:0.82rem; color:#94a3b8;">교환 및 환전 신청 내역이 없습니다.</div>`;
    } else {
      redemptionListElem.innerHTML = redemptions.map(r => `
        <div class="redemption-item">
          <div>
            <b>${escapeHtml(r.title)}</b> (${formatDate(r.date)})
            <div style="color:#34d399; font-size:0.78rem;">상태: ${r.status}</div>
          </div>
          <div class="coupon-code">${r.couponCode}</div>
        </div>
      `).join('');
    }
  }
}

async function redeemShopItem(itemTitle, costPoints) {
  if ((currentUser.points || 0) < costPoints) {
    alert(`포인트가 부족합니다. (보유: ${(currentUser.points || 0).toLocaleString()} P / 필요: ${costPoints.toLocaleString()} P)`);
    return;
  }

  if (!confirm(`'${itemTitle}' 상품을 ${costPoints.toLocaleString()} P로 교환하시겠습니까?`)) return;

  try {
    const res = await fetch('/api/points/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser.username, itemTitle, costPoints })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message);
      currentUser = data.user;
      localStorage.setItem('digimind_user', JSON.stringify(currentUser));
      updateUserStatusBar();
    } else { alert(data.message || '교환 실패'); }
  } catch (err) { console.error('Failed redeem item:', err); }
}

async function handleCashout(e) {
  e.preventDefault();
  const bankName = document.getElementById('cashout-bank').value;
  const accountNumber = document.getElementById('cashout-account').value.trim();
  const accountHolder = document.getElementById('cashout-holder').value.trim();
  const amountPoints = Number(document.getElementById('cashout-amount').value);

  if (amountPoints < 10000) return alert('현금 환전은 10,000 P 이상부터 가능합니다.');
  if ((currentUser.points || 0) < amountPoints) return alert('보유 포인트가 부족합니다.');

  if (!confirm(`${amountPoints.toLocaleString()} P를 현금 ${amountPoints.toLocaleString()}원으로 ${bankName} ${accountNumber} (${accountHolder}) 계좌로 환전 신청하시겠습니까?`)) return;

  try {
    const res = await fetch('/api/points/cashout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: currentUser.username,
        bankName, accountNumber, accountHolder, amountPoints
      })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message);
      currentUser = data.user;
      localStorage.setItem('digimind_user', JSON.stringify(currentUser));
      updateUserStatusBar();
      document.getElementById('cashout-account').value = '';
      document.getElementById('cashout-holder').value = '';
      document.getElementById('cashout-amount').value = '';
    } else { alert(data.message || '환전 신청 실패'); }
  } catch (err) { console.error('Failed cashout:', err); }
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(`tab-${tabName}-btn`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match]));
}
function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}
