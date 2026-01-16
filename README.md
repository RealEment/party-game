# 🎲 Színes Party Játék

Interaktív társasjáték csapatoknak - válassz színt, húzz kártyát, és szórakozz!

## 📁 Projekt struktúra

```
party-game-project/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React komponensek
│   │   │   ├── ColorInput/  # Szín választó
│   │   │   ├── GameCard/    # Flip kártya
│   │   │   └── History/     # Kártya történet
│   │   ├── api/             # API service réteg
│   │   ├── styles/          # Globális stílusok
│   │   └── App.tsx          # Fő komponens
│   └── package.json
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── routes/          # API route-ok
│   │   │   ├── cards.ts     # Kártya endpoints
│   │   │   └── sessions.ts  # Session kezelés
│   │   ├── data/            # Kártya adatok
│   │   │   └── cards.json   # 70+ kártya
│   │   └── server.ts        # Express szerver
│   └── package.json
├── shared/                   # Közös TypeScript típusok
│   ├── types.ts
│   └── package.json
└── package.json              # Monorepo root
```

## 🚀 Telepítés és futtatás

### Előfeltételek
- Node.js 18+
- npm vagy yarn

### Telepítés

```bash
# Klónozás után
cd party-game-project

# Függőségek telepítése (minden workspace-hez)
npm install
```

### Fejlesztői mód

```bash
# Backend és frontend együtt
npm run dev

# Vagy külön-külön:
npm run dev:backend  # http://localhost:3001
npm run dev:frontend # http://localhost:3000
```

### Production build

```bash
npm run build
npm start
```

## 🌐 GitHub Pages Deployment

### Automatikus telepítés

A projekt automatikusan települ a GitHub Pages-re minden push után a `main` ágra.

### Setup lépések:

1. **GitHub repository létrehozása**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/Party-game.git
   git push -u origin main
   ```

2. **GitHub Pages beállítása**
   - Menj a GitHub repository Settings > Pages oldalra
   - Source: "GitHub Actions" kiválasztása

3. **Repository név frissítése** (ha más nevet használsz)
   - Szerkeszd a `frontend/vite.config.ts` fájlt
   - Módosítsd a `base` értéket: `/YOUR-REPO-NAME/`

4. **Deployment**
   - A GitHub Actions automatikusan buildi és telepíti a frontendet
   - Elérhető lesz: `https://YOUR_USERNAME.github.io/Party-game/`

### Kézi telepítés

```bash
cd frontend
npm run build
# A dist mappát feltöltheted bármelyik static hosting szolgáltatásra
```

### Megjegyzés a backend-hez

A GitHub Pages csak statikus fájlokat szolgál ki. A backend API-t külön kell hosztolni:
- **Ingyenes opciók**: Render.com, Railway.app, Fly.io
- A frontend API hívásokat módosítani kell a backend URL-re

## 🎮 Játékszabályok

1. **Színek kiválasztása**: A játék előtt mindenki választ egy színt (nem tudják egymásról)
2. **Csapatok alakulása**: Akik ugyanazt a színt választották, egy csapatba kerülnek
3. **Kártyahúzás**: 30 percenként (vagy bármikor) húzhatsz kártyát
4. **Feladatok**: A kártyákon szereplő feladatokat a megjelölt színű csapat hajtja végre

## 🃏 Kártya kategóriák

| Kategória | Emoji | Leírás |
|-----------|-------|--------|
| Ivós | 🍺 | Ivós feladatok és játékok |
| Kommunikáció | 🗣️ | Beszéd módosító kihívások |
| Fizikai | 🏃 | Mozgásos feladatok |
| Szociális | 👥 | Társas interakciók |
| Szerepjáték | 🎭 | Karakterek eljátszása |
| Vetélkedő | ⚔️ | Csapatok közötti versenyek |
| Flörtös | 💕 | Könnyed, flörtös feladatok |
| Kreatív | 🎨 | Kreatív kihívások |
| Kaotikus | 🌪️ | Káosz és meglepetések |
| Büntetés | ⚠️ | Speciális büntetések |

## 🔌 API Endpoints

### Cards
- `GET /api/cards` - Összes kártya
- `GET /api/cards/random` - Véletlenszerű kártya
- `GET /api/cards/categories` - Kategóriák
- `GET /api/cards/stats` - Statisztikák
- `POST /api/cards/draw` - Kártya húzása színekkel

### Sessions
- `POST /api/sessions` - Új session
- `GET /api/sessions/:id` - Session lekérése
- `PUT /api/sessions/:id/colors` - Színek frissítése
- `POST /api/sessions/:id/cards` - Kártya hozzáadása
- `DELETE /api/sessions/:id` - Session törlése

## 🛠️ Technológiák

### Frontend
- React 18
- TypeScript
- Vite
- Framer Motion (animációk)
- CSS Modules

### Backend
- Node.js
- Express.js
- TypeScript

## 📝 Új kártya hozzáadása

Szerkeszd a `backend/src/data/cards.json` fájlt:

```json
{
  "id": "unique-id",
  "category": "drinking",
  "template": "{0} és {1} versenyeznek",
  "colorCount": 2,
  "duration": 10,
  "difficulty": "medium"
}
```

- `{0}`, `{1}` stb. - színek helye
- `colorCount` - hány szín kell
- `duration` - időtartam percben (opcionális)
- `difficulty` - easy/medium/hard (opcionális)

## 🎨 VS Code integráció

A projekt VS Code-dal és Claude Code extension-nel használható:

1. Nyisd meg a projekt mappát VS Code-ban
2. Használd a Claude Code extension-t a fejlesztéshez
3. Ajánlott extension-ök:
   - ESLint
   - Prettier
   - TypeScript Vue Plugin

## 📄 License

MIT

---

Made with 🎉 by Soma & Claude
