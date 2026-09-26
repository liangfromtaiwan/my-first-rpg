// Player profile ("個人名片"): pronouns, interest tags and a one-line intro.
// Stored on users/{uid} (owner-only writes, see firestore.rules).

export const INTERESTS = [
  { id: "climbing", emoji: "🧗", label: "攀岩" },
  { id: "boardgames", emoji: "🎲", label: "桌遊" },
  { id: "gaming", emoji: "🎮", label: "電玩" },
  { id: "movies", emoji: "🎬", label: "電影" },
  { id: "reading", emoji: "📚", label: "閱讀" },
  { id: "music", emoji: "🎵", label: "音樂" },
  { id: "cooking", emoji: "🍳", label: "料理" },
  { id: "fitness", emoji: "🏃", label: "運動" },
  { id: "cats", emoji: "🐱", label: "貓派" },
  { id: "dogs", emoji: "🐶", label: "狗派" },
  { id: "travel", emoji: "✈️", label: "旅行" },
  { id: "photo", emoji: "📷", label: "攝影" },
  { id: "art", emoji: "🎨", label: "藝術" },
  { id: "coding", emoji: "💻", label: "寫程式" },
  { id: "plants", emoji: "🌱", label: "植物" },
  { id: "coffee", emoji: "☕", label: "咖啡" },
  { id: "drinks", emoji: "🍷", label: "小酌" },
  { id: "yoga", emoji: "🧘", label: "瑜珈" },
  { id: "anime", emoji: "🌸", label: "動漫" },
  { id: "karaoke", emoji: "🎤", label: "唱歌" },
];
const INTEREST_BY_ID = new Map(INTERESTS.map((i) => [i.id, i]));
export const MAX_INTERESTS = 6;
export const MAX_BIO = 60;

export const PRONOUNS = ["", "他", "她", "他們", "隨意稱呼"];

export const getInterest = (id) => INTEREST_BY_ID.get(id) || null;

/** Validate a profile read from Firestore (unknown interests are dropped). */
export const normalizeProfile = (raw) => {
  const interests = Array.isArray(raw?.interests)
    ? [...new Set(raw.interests.filter((id) => INTEREST_BY_ID.has(id)))].slice(0, MAX_INTERESTS)
    : [];
  return {
    pronouns: PRONOUNS.includes(raw?.pronouns) ? raw.pronouns : "",
    interests,
    bio: typeof raw?.bio === "string" ? raw.bio.slice(0, MAX_BIO) : "",
  };
};

export const commonInterests = (a, b) => {
  const set = new Set(a || []);
  return (b || []).filter((id) => set.has(id));
};

export const interestEmojis = (ids, max = MAX_INTERESTS) =>
  (ids || []).slice(0, max).map((id) => getInterest(id)?.emoji || "").join("");
