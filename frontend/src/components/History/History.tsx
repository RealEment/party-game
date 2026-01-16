import { motion, AnimatePresence } from 'framer-motion';
import styles from './History.module.css';

interface Color {
  id: string;
  name: string;
  hex: string;
}

interface HistoryItem {
  id: string;
  content: string;
  category: string;
  assignedColors: Color[];
  drawnAt: string;
}

interface HistoryProps {
  items: HistoryItem[];
  maxItems?: number;
}

const CATEGORY_EMOJI: Record<string, string> = {
  drinking: '🍺',
  communication: '🗣️',
  physical: '🏃',
  social: '👥',
  roleplay: '🎭',
  competition: '⚔️',
  flirty: '💕',
  creative: '🎨',
  chaotic: '🌪️',
  punishment: '⚠️',
};

export function History({ items, maxItems = 20 }: HistoryProps) {
  const displayItems = items.slice(0, maxItems);

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>📜 Korábbi kártyák</h3>
        <p className={styles.empty}>Még nem húztál kártyát...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>📜 Korábbi kártyák ({items.length})</h3>
      <div className={styles.list}>
        <AnimatePresence mode="popLayout">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className={styles.item}
            >
              <span className={styles.number}>#{items.length - index}</span>
              <span className={styles.emoji}>{CATEGORY_EMOJI[item.category]}</span>
              <span className={styles.content}>
                {formatContentWithColors(item.content, item.assignedColors)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function formatContentWithColors(content: string, colors: Color[]): React.ReactNode {
  let result = content;
  const parts: (string | React.ReactElement)[] = [];
  
  // Egyszerűsített megközelítés - csak szövegként jelenítjük meg
  colors.forEach(color => {
    result = result.replace(
      new RegExp(color.name, 'g'),
      `【${color.name}】`
    );
  });

  // Feldaraboljuk a szöveget a jelölők mentén
  const regex = /【([^】]+)】/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(result)) !== null) {
    // Szöveg a match előtt
    if (match.index > lastIndex) {
      parts.push(result.slice(lastIndex, match.index));
    }

    // A színes tag
    const colorName = match[1];
    const color = colors.find(c => c.name === colorName);
    if (color) {
      parts.push(
        <span
          key={key++}
          style={{
            background: color.hex,
            color: isLightColor(color.hex) ? '#000' : '#fff',
            padding: '1px 6px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '0.85em',
          }}
        >
          {colorName}
        </span>
      );
    } else {
      parts.push(colorName);
    }

    lastIndex = regex.lastIndex;
  }

  // Maradék szöveg
  if (lastIndex < result.length) {
    parts.push(result.slice(lastIndex));
  }

  return parts;
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
