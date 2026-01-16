import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cardsRouter from './routes/cards';
import sessionsRouter from './routes/sessions';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/cards', cardsRouter);
app.use('/api/sessions', sessionsRouter);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint nem található',
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Szerver hiba',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🎉 Party Game Backend Server
============================
🚀 Server running on http://localhost:${PORT}
📚 API endpoints:
   - GET  /api/health          - Health check
   - GET  /api/cards           - Összes kártya
   - GET  /api/cards/random    - Véletlenszerű kártya
   - GET  /api/cards/categories - Kategóriák
   - GET  /api/cards/stats     - Statisztikák
   - POST /api/cards/draw      - Kártya húzása színekkel
   - POST /api/sessions        - Új session
   - GET  /api/sessions/:id    - Session lekérése
   - PUT  /api/sessions/:id/colors - Színek frissítése
   - POST /api/sessions/:id/cards  - Kártya hozzáadása
============================
  `);
});

export default app;
