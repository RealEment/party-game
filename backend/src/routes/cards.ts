import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import cardsData from '../data/cards.json';
import { Card, CardCategory, Color, DrawnCard, CATEGORIES } from '../../../shared/types';

const router = Router();

// Típus assertion a JSON adatokhoz
const cards: Card[] = cardsData.cards as Card[];

// GET /api/cards - Összes kártya lekérése
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      cards,
      total: cards.length,
    },
  });
});

// GET /api/cards/categories - Kategóriák lekérése
router.get('/categories', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: CATEGORIES,
  });
});

// GET /api/cards/random - Véletlenszerű kártya húzása
router.get('/random', (req: Request, res: Response) => {
  const { category, colorCount, excludeIds } = req.query;

  let filteredCards = [...cards];

  // Kategória szűrés
  if (category && typeof category === 'string') {
    filteredCards = filteredCards.filter((c) => c.category === category);
  }

  // Szín szám szűrés
  if (colorCount !== undefined) {
    const count = parseInt(colorCount as string, 10);
    filteredCards = filteredCards.filter((c) => c.colorCount <= count);
  }

  // Kizárt kártyák szűrése (ne húzza ugyanazt újra)
  if (excludeIds && typeof excludeIds === 'string') {
    const excluded = excludeIds.split(',');
    filteredCards = filteredCards.filter((c) => !excluded.includes(c.id));
  }

  if (filteredCards.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Nincs elérhető kártya a megadott feltételekkel',
    });
  }

  // Véletlenszerű választás
  const randomCard = filteredCards[Math.floor(Math.random() * filteredCards.length)];

  res.json({
    success: true,
    data: randomCard,
  });
});

// POST /api/cards/draw - Kártya húzása színekkel
router.post('/draw', (req: Request, res: Response) => {
  const { colors, excludeIds, category } = req.body as {
    colors: Color[];
    excludeIds?: string[];
    category?: CardCategory;
  };

  if (!colors || colors.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Minimum 2 szín szükséges',
    });
  }

  let filteredCards = [...cards];

  // Kategória szűrés
  if (category) {
    filteredCards = filteredCards.filter((c) => c.category === category);
  }

  // Szín szám szűrés - csak olyat húzunk ami teljesíthető
  filteredCards = filteredCards.filter((c) => c.colorCount <= colors.length);

  // Kizárt kártyák szűrése
  if (excludeIds && excludeIds.length > 0) {
    filteredCards = filteredCards.filter((c) => !excludeIds.includes(c.id));
  }

  if (filteredCards.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Nincs elérhető kártya',
    });
  }

  // Véletlenszerű kártya
  const card = filteredCards[Math.floor(Math.random() * filteredCards.length)];

  // Véletlenszerű színek választása
  const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
  const assignedColors = shuffledColors.slice(0, Math.max(card.colorCount, 1));

  // Template feltöltése
  let content = card.template;
  assignedColors.forEach((color, index) => {
    content = content.replace(new RegExp(`\\{${index}\\}`, 'g'), color.name);
  });

  const drawnCard: DrawnCard = {
    id: uuidv4(),
    card,
    assignedColors,
    drawnAt: new Date(),
    content,
  };

  res.json({
    success: true,
    data: drawnCard,
  });
});

// GET /api/cards/stats - Statisztikák
router.get('/stats', (_req: Request, res: Response) => {
  const stats = {
    total: cards.length,
    byCategory: {} as Record<string, number>,
    byDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
    byColorCount: {} as Record<number, number>,
  };

  cards.forEach((card) => {
    // Kategória szerint
    stats.byCategory[card.category] = (stats.byCategory[card.category] || 0) + 1;

    // Nehézség szerint
    if (card.difficulty) {
      stats.byDifficulty[card.difficulty]++;
    }

    // Szín szám szerint
    stats.byColorCount[card.colorCount] = (stats.byColorCount[card.colorCount] || 0) + 1;
  });

  res.json({
    success: true,
    data: stats,
  });
});

export default router;
