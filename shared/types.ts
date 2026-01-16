// Szín típus
export interface Color {
  id: string;
  name: string;
  hex: string;
}

// Kártya kategóriák
export type CardCategory =
  | 'drinking'
  | 'communication'
  | 'physical'
  | 'social'
  | 'roleplay'
  | 'competition'
  | 'flirty'
  | 'creative'
  | 'chaotic'
  | 'punishment';

// Kártya típus
export interface Card {
  id: string;
  category: CardCategory;
  template: string;
  colorCount: number; // Hány szín kell a kártyához
  duration?: number; // Időtartam percben (opcionális)
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Játék session
export interface GameSession {
  id: string;
  colors: Color[];
  drawnCards: DrawnCard[];
  createdAt: Date;
  isActive: boolean;
}

// Húzott kártya
export interface DrawnCard {
  id: string;
  card: Card;
  assignedColors: Color[];
  drawnAt: Date;
  content: string; // A renderelt szöveg
}

// API Response típusok
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Kategória megjelenítési info
export interface CategoryInfo {
  id: CardCategory;
  name: string;
  emoji: string;
  color: string;
}

export const CATEGORIES: Record<CardCategory, CategoryInfo> = {
  drinking: { id: 'drinking', name: 'Ivós', emoji: '🍺', color: '#ff6b35' },
  communication: { id: 'communication', name: 'Kommunikáció', emoji: '🗣️', color: '#00d4ff' },
  physical: { id: 'physical', name: 'Fizikai', emoji: '🏃', color: '#39ff14' },
  social: { id: 'social', name: 'Szociális', emoji: '👥', color: '#bf00ff' },
  roleplay: { id: 'roleplay', name: 'Szerepjáték', emoji: '🎭', color: '#ff2d95' },
  competition: { id: 'competition', name: 'Vetélkedő', emoji: '⚔️', color: '#fff01f' },
  flirty: { id: 'flirty', name: 'Flörtös', emoji: '💕', color: '#ff69b4' },
  creative: { id: 'creative', name: 'Kreatív', emoji: '🎨', color: '#00ff88' },
  chaotic: { id: 'chaotic', name: 'Kaotikus', emoji: '🌪️', color: '#ff3366' },
  punishment: { id: 'punishment', name: 'Büntetés', emoji: '⚠️', color: '#ffcc00' },
};

// Default színpaletta
export const DEFAULT_COLOR_PALETTE = [
  '#ff2d95', '#00d4ff', '#39ff14', '#fff01f', '#bf00ff',
  '#ff6b35', '#00ff88', '#ff3366', '#00ccff', '#ffcc00'
];
