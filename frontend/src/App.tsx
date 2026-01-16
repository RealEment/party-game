import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorInput, GameCard, History } from './components';
import { cardsApi } from './api';
import styles from './App.module.css';

interface Color {
  id: string;
  name: string;
  hex: string;
}

interface DrawnCardData {
  id: string;
  card: {
    id: string;
    category: string;
    duration?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
  content: string;
  assignedColors: Color[];
  drawnAt: string;
}

type GamePhase = 'setup' | 'playing';

const DEFAULT_COLORS: Color[] = [
  { id: '1', name: 'Piros', hex: '#ff2d95' },
  { id: '2', name: 'Kék', hex: '#00d4ff' },
  { id: '3', name: 'Zöld', hex: '#39ff14' },
  { id: '4', name: 'Sárga', hex: '#fff01f' },
  { id: '5', name: 'Lila', hex: '#bf00ff' },
];

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [colors, setColors] = useState<Color[]>(DEFAULT_COLORS);
  const [currentCard, setCurrentCard] = useState<DrawnCardData | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [history, setHistory] = useState<DrawnCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = useCallback(() => {
    if (colors.length < 2) {
      setError('Minimum 2 szín szükséges!');
      return;
    }
    setPhase('playing');
    setHistory([]);
    setCurrentCard(null);
    setIsFlipped(false);
    setError(null);
  }, [colors]);

  const drawCard = useCallback(async () => {
    if (colors.length < 2) return;

    setIsLoading(true);
    setError(null);
    setIsFlipped(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const excludeIds = history.slice(0, 10).map(h => h.card.id);
      const result = await cardsApi.draw(colors, excludeIds);

      if (result.success && result.data) {
        const drawnCard: DrawnCardData = {
          ...result.data,
          drawnAt: new Date().toISOString(),
        };
        setCurrentCard(drawnCard);
        setHistory(prev => [drawnCard, ...prev]);
        setTimeout(() => setIsFlipped(true), 300);
      } else {
        setError(result.error || 'Hiba történt a kártya húzásakor');
      }
    } catch (err) {
      setError('Hálózati hiba - próbáld újra!');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [colors, history]);

  const handleCardFlip = useCallback(() => {
    if (!currentCard && !isLoading) {
      drawCard();
    } else if (currentCard && !isFlipped) {
      setIsFlipped(true);
    }
  }, [currentCard, isFlipped, isLoading, drawCard]);

  const resetGame = useCallback(() => {
    setPhase('setup');
    setCurrentCard(null);
    setIsFlipped(false);
    setHistory([]);
    setError(null);
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.bgEffects} />

      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🎲 Színes Party 🎉
          </motion.h1>
          <p className={styles.subtitle}>
            {phase === 'setup'
              ? 'Add meg a csapat színeket!'
              : `${colors.length} szín • ${history.length} húzott kártya`}
          </p>
        </header>

        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.section
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.section}
            >
              <h2 className={styles.sectionTitle}>⚡ Színek beállítása</h2>

              <ColorInput
                colors={colors}
                onColorsChange={setColors}
                minColors={2}
                maxColors={10}
              />

              {error && <p className={styles.error}>{error}</p>}

              <button
                onClick={startGame}
                disabled={colors.length < 2}
                className={styles.primaryButton}
              >
                🎮 Játék indítása
              </button>
            </motion.section>
          )}

          {phase === 'playing' && (
            <motion.section
              key="playing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.section}
            >
              <div className={styles.activeColors}>
                {colors.map(color => (
                  <span
                    key={color.id}
                    className={styles.colorTag}
                    style={{
                      backgroundColor: color.hex,
                      color: isLightColor(color.hex) ? '#000' : '#fff'
                    }}
                  >
                    {color.name}
                  </span>
                ))}
              </div>

              <div className={styles.cardArea}>
                <GameCard
                  card={currentCard ? {
                    id: currentCard.id,
                    category: currentCard.card.category,
                    content: currentCard.content,
                    assignedColors: currentCard.assignedColors,
                    duration: currentCard.card.duration,
                    difficulty: currentCard.card.difficulty,
                  } : null}
                  isFlipped={isFlipped}
                  onFlip={handleCardFlip}
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.buttonRow}>
                <button
                  onClick={drawCard}
                  disabled={isLoading}
                  className={styles.drawButton}
                >
                  {isLoading ? '⏳ Húzás...' : '🃏 Új kártya húzása'}
                </button>
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{history.length}</span>
                  <span className={styles.statLabel}>Húzott kártyák</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{colors.length}</span>
                  <span className={styles.statLabel}>Aktív színek</span>
                </div>
              </div>

              <History
                items={history.map(h => ({
                  id: h.id,
                  content: h.content,
                  category: h.card.category,
                  assignedColors: h.assignedColors,
                  drawnAt: h.drawnAt,
                }))}
              />

              <div className={styles.resetSection}>
                <button onClick={resetGame} className={styles.secondaryButton}>
                  🔄 Új játék (színek újraválasztása)
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
