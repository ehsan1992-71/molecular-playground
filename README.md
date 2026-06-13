# 🧬 Molecular Biology Playground

> Interactive simulation of DNA transcription to mRNA — built with React, TypeScript, and HTML5 Canvas.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Zustand](https://img.shields.io/badge/Zustand-000?logo=zustand&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Canvas](https://img.shields.io/badge/Canvas-API-E34F26?logo=html5&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

---

## 🎯 Why I Built This

As a former biology teacher with a background in biochemistry, I saw students struggle with abstract molecular processes like DNA transcription. This project transforms passive textbook diagrams into an **interactive, visual experience** — bridging my domain expertise with modern frontend development.

**Target job market:** EdTech & Bioinformatics companies in Scandinavia.

---

## ✨ Features

- 🧬 Real-time DNA → mRNA transcription
- 🎬 Step-by-step Canvas animation with RNA Polymerase movement
- 🧮 Codon visualization (3-letter groups with color coding)
- 📊 Dynamic nucleotide composition bar chart
- ⚡ Adjustable animation speed (0.5x / 1x / 2x)
- ✅ DNA input validation with bilingual error messages
- 🎮 Play / Pause / Step Forward / Reset controls
- 📈 Progress bar showing transcription completion percentage
- 🌙 Dark-themed molecular laboratory UI
- 📱 Responsive design (mobile-friendly grid layout)

---

## 🛠 Tech Stack

| Category | Technology | Why This Choice |
|----------|------------|-----------------|
| **Framework** | React 19 | Component-based architecture, industry standard |
| **Language** | TypeScript | Type safety, better developer experience, standard in Nordic companies |
| **State Management** | Zustand | Lightweight, no boilerplate, perfect for mid-size applications |
| **Animation** | HTML5 Canvas API | Smooth frame-by-frame molecular animation without external libraries |
| **Styling** | Tailwind CSS v4 | Utility-first, rapid prototyping, highly popular in Scandinavian startups |
| **Icons** | React Icons | Lightweight, tree-shakeable icon library |
| **Build Tool** | Vite | Fast HMR, modern bundling, superior developer experience |

---

## 🏗 Architecture
molecular-playground/
├── src/
│ ├── utils/
│ │ └── transcription.ts # Pure bioinformatics functions
│ ├── store/
│ │ └── useSimulationStore.ts # Centralized state (Zustand)
│ ├── components/
│ │ ├── Header.tsx # App title with gradient styling
│ │ ├── DNASequenceInput.tsx # DNA input with regex validation
│ │ ├── AnimationCanvas.tsx # Canvas-based molecular animation
│ │ ├── ControlPanel.tsx # Play/Pause/Step/Reset controls
│ │ ├── SequenceOutput.tsx # mRNA display with codon colors
│ │ └── NucleotideChart.tsx # Dynamic bar chart of base percentages
│ ├── App.tsx # Root component + animation loop
│ ├── main.tsx # Entry point
│ └── index.css # Tailwind imports
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md

### Key Design Decisions

| Decision | What I Did | Why |
|----------|------------|-----|
| **Separation of Concerns** | Pure logic in `/utils`, state in `/store`, UI in `/components` | Testable, maintainable, scalable |
| **State Machine Pattern** | Animation: `IDLE → UNWINDING → TRANSCRIBING → DONE` | Predictable, debuggable, prevents invalid states |
| **Pure Functions** | `transcribeDNA()`, `validateDNA()`, `calculateNucleotidePercentages()` | Deterministic, testable without browser, reusable |
| **Canvas over SVG** | Molecular animation uses Canvas API | Better performance for real-time animation of many objects |
| **Zustand over Redux** | State management with Zustand | Minimal boilerplate, intuitive API, sufficient for this scope |

---

## 🧪 Key Technical Highlights

### 1. Pure Bioinformatics Functions

```typescript
// No React dependency — pure, deterministic, testable
export function transcribeDNA(dna: string): string {
  const complement = { A: 'U', T: 'A', C: 'G', G: 'C' }
  return dna.toUpperCase().split('').map(b => complement[b] || '?').join('')
}

export function calculateNucleotidePercentages(mrna: string): Record<RNANucleotide, number> {
  // Returns { A: 30, U: 25, C: 25, G: 20 } for any mRNA string
}

export function splitIntoCodons(mrna: string): string[] {
  // Splits "AUGCCGUAA" into ["AUG", "CCG", "UAA"]
}

Animation State Machine

IDLE ──▶ UNWINDING ──▶ TRANSCRIBING ──▶ DONE
  ▲                                        │
  └──────────────── Reset ◀────────────────┘
 Each state transition is handled by Zustand actions, ensuring the animation never enters an invalid state.

Canvas Animation Loop

// In App.tsx — runs the animation engine
useEffect(() => {
  if (!isPlaying) return
  const interval = setInterval(() => advanceAnimation(), speed)
  return () => clearInterval(interval) // Proper cleanup
}, [isPlaying, speed])

Type-Safe Nucleotide Handling

type RNANucleotide = 'A' | 'U' | 'C' | 'G' // Only valid mRNA bases
type AnimationStep = 'IDLE' | 'UNWINDING' | 'TRANSCRIBING' | 'DONE' // Finite state
TypeScript catches invalid nucleotide assignments at compile time, preventing runtime errors.

🚀 Getting Started
Prerequisites
.Node.js 18.0 or higher

.npm or pnpm

Installation

# Clone the repository
git clone https://github.com/YOUR_USERNAME/molecular-playground.git
git clone https://github.com/ehsan1992-71/molecular-playground.git
cd molecular-playground

# Install dependencies
npm install

# Start development server
npm run dev
Open http://localhost:5173 in your browser.

Build for Production
npm run build
npm run preview

📖 How to Use

Step	Action	What Happens
1	Enter a DNA sequence	Only A, T, C, G allowed (max 30 nucleotides)
2	Click Start (شروع)	RNA Polymerase begins transcribing DNA to mRNA
3	Use Step (مرحله بعد)	Advance one nucleotide at a time for detailed observation
4	Use Pause (توقف)	Pause the animation at any point
5	Adjust Speed	Choose 0.5x, 1x, or 2x playback speed
6	Click Reset (بازنشانی)	Clear everything and start fresh
Example Sequences to Try
ATGCGTACC — 9 nucleotides (default)

AAAATTTTCCCCGGGG — Equal distribution of all 4 bases

ATGCCGATTACGTAA — Longer sequence with varied composition

📊 What I Learned
Skill	How This Project Demonstrates It
React + TypeScript	Full type-safe component architecture
Canvas API	Programmatic 2D drawing, coordinate systems, animation frames
State Machines	Modeling biological processes as finite states
Pure Functions	Writing testable, deterministic business logic
Tailwind CSS	Building responsive, dark-themed UI from scratch
Git & GitHub	Professional commit messages, comprehensive README
Domain-Driven Design	Applying biochemistry knowledge to software architecture
🔮 Future Improvements
Add Translation step (mRNA → Protein) with codon table

Implement CRISPR-Cas9 gene editing simulation

Add unit tests with Vitest for pure functions

Replace setInterval with requestAnimationFrame for smoother 60fps animation

Add accessibility features (ARIA labels, keyboard controls)

Deploy to Vercel for live demo link

Add internationalization (Persian/English toggle)

📝 License
This project is licensed under the MIT License — see the LICENSE file for details.

👤 About Me
Former biology teacher with a university degree in Biochemistry, now transitioning into software development. I build tools at the intersection of biology + education + technology.

Looking for: Junior Frontend Developer or Bioinformatics Software Developer roles in Scandinavia (Sweden, Norway, Denmark, Finland).

What makes me different: I don't just write code — I understand the biological domain deeply and can translate complex scientific concepts into intuitive software.

Built with ❤️ for students who learn better by seeing.