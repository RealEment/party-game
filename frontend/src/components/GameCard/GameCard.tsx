import { motion } from 'framer-motion';
import styles from './GameCard.module.css';

interface Color {
  id: string;
  name: string;
  hex: string;
}

interface CardData {
  id: string;
  category: string;
  content: string;
  assignedColors: Color[];
  duration?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface GameCardProps {
  card: CardData | null;
  isFlipped: boolean;
  onFlip: () => void;
  categoryInfo?: {
    name: string;
    emoji: string;
    color: string;
  };
}

const CATEGORY_INFO: Record<string, { name: string; emoji: string; color: string }> = {
  drinking: { name: 'Ivós', emoji: '🍺', color: '#ff6b35' },
  communication: { name: 'Kommunikáció', emoji: '🗣️', color: '#00d4ff' },
  physical: { name: 'Fizikai', emoji: '🏃', color: '#39ff14' },
  social: { name: 'Szociális', emoji: '👥', color: '#bf00ff' },
  roleplay: { name: 'Szerepjáték', emoji: '🎭', color: '#ff2d95' },
  competition: { name: 'Vetélkedő', emoji: '⚔️', color: '#fff01f' },
  flirty: { name: 'Flörtös', emoji: '💕', color: '#ff69b4' },
  creative: { name: 'Kreatív', emoji: '🎨', color: '#00ff88' },
  chaotic: { name: 'Kaotikus', emoji: '🌪️', color: '#ff3366' },
  punishment: { name: 'Büntetés', emoji: '⚠️', color: '#ffcc00' },
};

export function GameCard({ card, isFlipped, onFlip, categoryInfo }: GameCardProps) {
  const catInfo = card ? (categoryInfo || CATEGORY_INFO[card.category]) : null;

  // Szöveg formázása a színekkel
  const formatContent = (content: string, colors: Color[]) => {
    let formatted = content;
    colors.forEach(color => {
      const regex = new RegExp(color.name, 'g');
      formatted = formatted.replace(
        regex,
        `<span class="${styles.colorMention}" style="background: ${color.hex}; color: ${isLightColor(color.hex) ? '#000' : '#fff'}">${color.name}</span>`
      );
    });
    return formatted;
  };

  return (
    <div className={styles.container} onClick={onFlip}>
      <motion.div
        className={styles.card}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Back side */}
        <div className={styles.cardFace + ' ' + styles.cardBack}>
          <div className={styles.questionMark}>?</div>
          <p className={styles.backText}>Kattints a húzáshoz!</p>
        </div>

        {/* Front side */}
        <div className={styles.cardFace + ' ' + styles.cardFront}>
          {card && catInfo && (
            <>
              <div
                className={styles.category}
                style={{ borderColor: catInfo.color, color: catInfo.color }}
              >
                {catInfo.emoji} {catInfo.name}
              </div>

              <div
                className={styles.content}
                dangerouslySetInnerHTML={{
                  __html: formatContent(card.content, card.assignedColors)
                }}
              />

              {card.duration && (
                <div className={styles.duration}>
                  ⏱️ {card.duration} perc
                </div>
              )}

              {card.difficulty && (
                <div className={`${styles.difficulty} ${styles[card.difficulty]}`}>
                  {card.difficulty === 'easy' && '😊 Könnyű'}
                  {card.difficulty === 'medium' && '😤 Közepes'}
                  {card.difficulty === 'hard' && '🔥 Nehéz'}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
