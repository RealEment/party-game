import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ColorInput.module.css';

interface Color {
  id: string;
  name: string;
  hex: string;
}

interface ColorInputProps {
  colors: Color[];
  onColorsChange: (colors: Color[]) => void;
  minColors?: number;
  maxColors?: number;
}

const DEFAULT_PALETTE = [
  '#ff2d95', '#00d4ff', '#39ff14', '#fff01f', '#bf00ff',
  '#ff6b35', '#00ff88', '#ff3366', '#00ccff', '#ffcc00'
];

export function ColorInput({
  colors,
  onColorsChange,
  minColors = 2,
  maxColors = 10
}: ColorInputProps) {
  const [newColorName, setNewColorName] = useState('');

  const addColor = () => {
    if (!newColorName.trim()) return;
    if (colors.length >= maxColors) return;

    const newColor: Color = {
      id: `color-${Date.now()}`,
      name: newColorName.trim(),
      hex: DEFAULT_PALETTE[colors.length % DEFAULT_PALETTE.length],
    };

    onColorsChange([...colors, newColor]);
    setNewColorName('');
  };

  const removeColor = (id: string) => {
    if (colors.length <= minColors) return;
    onColorsChange(colors.filter(c => c.id !== id));
  };

  const updateColorName = (id: string, name: string) => {
    onColorsChange(colors.map(c => c.id === id ? { ...c, name } : c));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addColor();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <input
          type="text"
          value={newColorName}
          onChange={(e) => setNewColorName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Új szín neve..."
          className={styles.input}
          maxLength={20}
        />
        <button
          onClick={addColor}
          disabled={!newColorName.trim() || colors.length >= maxColors}
          className={styles.addButton}
        >
          + Hozzáadás
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        <div className={styles.colorList}>
          {colors.map((color, index) => (
            <motion.div
              key={color.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              transition={{ duration: 0.2 }}
              className={styles.colorTag}
              style={{
                backgroundColor: color.hex,
                color: isLightColor(color.hex) ? '#000' : '#fff'
              }}
            >
              <input
                type="text"
                value={color.name}
                onChange={(e) => updateColorName(color.id, e.target.value)}
                className={styles.colorNameInput}
                style={{ color: isLightColor(color.hex) ? '#000' : '#fff' }}
                maxLength={20}
              />
              {colors.length > minColors && (
                <button
                  onClick={() => removeColor(color.id)}
                  className={styles.removeButton}
                  style={{ color: isLightColor(color.hex) ? '#000' : '#fff' }}
                >
                  ×
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <p className={styles.hint}>
        {colors.length} / {maxColors} szín • minimum {minColors} szükséges
      </p>
    </div>
  );
}

// Segédfüggvény a kontraszt ellenőrzéshez
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
