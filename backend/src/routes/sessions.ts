import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { GameSession, Color, DrawnCard } from '../../../shared/types';

const router = Router();

// In-memory session storage (production-ben adatbázis lenne)
const sessions = new Map<string, GameSession>();

// POST /api/sessions - Új session létrehozása
router.post('/', (req: Request, res: Response) => {
  const { colors } = req.body as { colors: Color[] };

  if (!colors || colors.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Minimum 2 szín szükséges',
    });
  }

  const session: GameSession = {
    id: uuidv4(),
    colors,
    drawnCards: [],
    createdAt: new Date(),
    isActive: true,
  };

  sessions.set(session.id, session);

  res.status(201).json({
    success: true,
    data: session,
  });
});

// GET /api/sessions/:id - Session lekérése
router.get('/:id', (req: Request, res: Response) => {
  const session = sessions.get(req.params.id);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session nem található',
    });
  }

  res.json({
    success: true,
    data: session,
  });
});

// PUT /api/sessions/:id/colors - Színek frissítése
router.put('/:id/colors', (req: Request, res: Response) => {
  const session = sessions.get(req.params.id);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session nem található',
    });
  }

  const { colors } = req.body as { colors: Color[] };

  if (!colors || colors.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Minimum 2 szín szükséges',
    });
  }

  session.colors = colors;

  res.json({
    success: true,
    data: session,
  });
});

// POST /api/sessions/:id/cards - Húzott kártya hozzáadása
router.post('/:id/cards', (req: Request, res: Response) => {
  const session = sessions.get(req.params.id);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session nem található',
    });
  }

  const { drawnCard } = req.body as { drawnCard: DrawnCard };

  if (!drawnCard) {
    return res.status(400).json({
      success: false,
      error: 'DrawnCard szükséges',
    });
  }

  session.drawnCards.push(drawnCard);

  res.json({
    success: true,
    data: session,
  });
});

// GET /api/sessions/:id/history - Húzott kártyák történet
router.get('/:id/history', (req: Request, res: Response) => {
  const session = sessions.get(req.params.id);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session nem található',
    });
  }

  res.json({
    success: true,
    data: {
      cards: session.drawnCards,
      total: session.drawnCards.length,
    },
  });
});

// DELETE /api/sessions/:id - Session törlése
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = sessions.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Session nem található',
    });
  }

  res.json({
    success: true,
    data: { message: 'Session törölve' },
  });
});

// POST /api/sessions/:id/end - Session befejezése
router.post('/:id/end', (req: Request, res: Response) => {
  const session = sessions.get(req.params.id);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session nem található',
    });
  }

  session.isActive = false;

  res.json({
    success: true,
    data: session,
  });
});

export default router;
