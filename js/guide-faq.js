// The village guide's answers (free, no AI): keyword matching over a small FAQ in 繁體中文.
// Each entry: words to look for (any match counts, more matches rank higher) and the answer.

export const GUIDE_GREETING = "嗨！我是嚮導 👋 想知道什麼都可以問我，或點下面的問題～";

export const GUIDE_QUICK_QUESTIONS = [
  "🏠 怎麼回家？",
  "📹 怎麼視訊？",
  "🎉 怎麼開派對？",
  "🧗 抱石館在哪？",
  "🎮 有什麼好玩的？",
  "✏️ 怎麼改名片？",
];

const FAQ = [
  {
    words: ["你好", "嗨", "哈囉", "hello", "hi", "安安", "你是誰", "嚮導"],
    answer: "嗨嗨～我是這裡的嚮導！這是一個 LGBTQ 友善的像素小鎮，可以到處走走、聊天、視訊、玩小遊戲，還有自己的家 🏠",
  },
  {
    words: ["回家", "我的家", "家在哪", "home"],
    answer: "按「📍 前往」選「🏠 我的家」就能回家，第一次會自動幫你蓋好一間 ✨ 要出門就踩門口的 EXIT 地墊。",
  },
  {
    words: ["佈置", "裝潢", "家具", "擺設", "壁紙", "地板"],
    answer: "在自己家裡按「🔨 佈置」就能擺家具、換地板和壁紙，改完會自動存檔，來玩的朋友馬上看得到！",
  },
  {
    words: ["派對", "party", "聚會", "趴"],
    answer: "在家裡按「🎉 派對」，取個名字、選 1–3 小時。派對期間大家都能直接進門，聊天室也會自動公告 🎊",
  },
  {
    words: ["邀請", "來我家", "約朋友", "朋友來"],
    answer: "點朋友的角色或名單上的名字打開名片，按「💌 邀請來我家」，對方按「前往」就會直接進門～",
  },
  {
    words: ["視訊", "通話", "video", "打電話", "鏡頭", "call"],
    answer: "走到朋友旁邊，點他頭上的「👋」選「📹 邀請視訊」，對方同意就會開始 📹 在會議室裡則按下方的「📹 加入視訊」。",
  },
  {
    words: ["私訊", "聊天", "訊息", "傳訊", "dm", "chat"],
    answer: "按「💬」打開聊天：每個地方有自己的頻道，像主世界頻道、抱石村頻道。想私訊，點對方名字旁的 💬 就可以！",
  },
  {
    words: ["頻道", "公共"],
    answer: "每個地方都有自己的頻道：主世界、抱石村、辦公室、住宅區。走到哪裡，就會聊那裡的頻道 🗺️",
  },
  {
    words: ["抱石", "攀岩", "抱石館", "岩館", "爬牆", "boulder", "climb"],
    answer: "主世界右邊那棟有彩色岩點的建築就是抱石館 🧗 走進門就到抱石村，裡面有岩壁、軟墊和休息室！",
  },
  {
    words: ["時間表", "告示", "活動", "什麼時候", "約爬"],
    answer: "旁邊的「📌 告示板」有攀岩時間表，走過去點一下就能看。想揪人一起爬，也可以在頻道喊一聲！",
  },
  {
    words: ["住宅區", "鄰居", "別人的家", "拜訪"],
    answer: "主世界左邊那棟雙層住宅就是住宅區入口 🏘️ 每戶門口有名牌，走到門口就能拜訪。也可以在參與者名單按 🏠 直接去。",
  },
  {
    words: ["遊戲", "好玩", "無聊", "下棋", "井字", "玩什麼"],
    answer: "主世界的遊戲區有井字棋桌 ♟️ 走到桌邊就能下棋！走近其他玩家點「👋」→「🎲 破冰問答」也很好玩～",
  },
  {
    words: ["破冰", "認識", "交朋友", "搭話"],
    answer: "走到別人旁邊，點他頭上的「👋」→「🎲 破冰問答」，兩個人一起回答有趣的問題，很適合剛認識的朋友 😊",
  },
  {
    words: ["名片", "暱稱", "改名", "名字", "外觀", "頭像", "衣服", "髮型", "興趣", "代名詞", "自我介紹"],
    answer: "點你自己的角色 → 「✏️ 編輯名片」，可以改暱稱、外觀、代名詞、興趣和一句話自我介紹 ✨",
  },
  {
    words: ["表情", "emoji", "舉手"],
    answer: "點你自己的角色，就有「😊 表情」和「✋ 舉手」。電腦上也可以按 1–7 直接發表情！",
  },
  {
    words: ["跟隨", "找人", "在哪裡", "找朋友", "定位"],
    answer: "按「👥」打開參與者名單，按 👣 就會跟著對方走，他走到哪你就到哪 👣",
  },
  {
    words: ["會議室", "私人", "隱私", "房間"],
    answer: "會議室和休息室是私人空間 🔒 在裡面聊天只有房間裡的人看得到，也可以一起按「📹 加入視訊」。",
  },
  {
    words: ["封鎖", "檢舉", "騷擾", "安全", "不舒服", "討厭"],
    answer: "遇到讓你不舒服的人，點他的名片就能「封鎖」或「⚠️ 檢舉」。封鎖後你們互相看不到訊息，也進不了你家。你的安全最重要 💜",
  },
  {
    words: ["門", "上鎖", "敲門", "開放"],
    answer: "在家按「🔨 佈置」可以設開門模式：開放、敲門或上鎖。敲門時你會收到通知，同意了對方才能進來 🚪",
  },
  {
    words: ["lgbtq", "同志", "友善", "彩虹", "酷兒", "gay", "les"],
    answer: "這裡是 LGBTQ 友善的地方 🏳️‍🌈 每個人都可以做自己，名片上也能填你的代名詞。有人不友善的話，可以直接封鎖或檢舉。",
  },
  {
    words: ["辦公室", "equ"],
    answer: "主世界的 EQU 大樓就是辦公室 🏢 裡面有辦公區、會議室、休息室、咖啡廳和遊戲區！",
  },
  {
    words: ["怎麼走", "移動", "操作", "搖桿", "方向"],
    answer: "手機用右下角的搖桿移動，電腦用方向鍵或 WASD，按 Shift 可以跑步。也可以直接點地圖，角色會自己走過去 🏃",
  },
  {
    words: ["謝謝", "感謝", "thanks", "thank", "3q", "讚"],
    answer: "不客氣～有問題隨時來找我 😊 玩得開心！",
  },
];

const normalize = (text) => String(text || "").toLowerCase().replace(/\s+/g, "");

/** Best answer for a question, or a friendly fallback that lists what you can ask. */
export const answerGuideQuestion = (question) => {
  const q = normalize(question);
  if (!q) return GUIDE_GREETING;
  let best = null;
  let bestScore = 0;
  FAQ.forEach((entry) => {
    const score = entry.words.reduce((n, w) => (q.includes(normalize(w)) ? n + normalize(w).length : n), 0);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  });
  if (best) return best.answer;
  return "嗯…這個我還不太懂 🤔 你可以問我：怎麼回家、怎麼視訊、怎麼開派對、抱石館在哪、有什麼好玩的、怎麼改名片～";
};
