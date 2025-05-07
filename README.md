<p align="center">
  <img src="./public/logo.png" alt="Quanta Press Logo" width="120" />
</p>

<h1 align="center">Quanta Press</h1>

<p align="center">
  <a href="https://github.com/idugeni/quanta-press/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/idugeni/quanta-press/ci.yml?branch=main&label=build" alt="Build Status" />
  </a>
  <a href="https://img.shields.io/librariesio/release/npm/quanta-press">
    <img src="https://img.shields.io/librariesio/release/npm/quanta-press" alt="Dependencies Status" />
  </a>
  <a href="https://img.shields.io/github/issues/idugeni/quanta-press">
    <img src="https://img.shields.io/github/issues/idugeni/quanta-press" alt="Open Issues" />
  </a>
  <a href="https://img.shields.io/github/issues-pr/idugeni/quanta-press">
    <img src="https://img.shields.io/github/issues-pr/idugeni/quanta-press" alt="Open PRs" />
  </a>
  <a href="https://img.shields.io/badge/code%20style-airbnb-blue">
    <img src="https://img.shields.io/badge/code%20style-airbnb-blue" alt="Code Style: Airbnb" />
  </a>
  <a href="https://img.shields.io/coveralls/github/idugeni/quanta-press/main">
    <img src="https://img.shields.io/coveralls/github/idugeni/quanta-press/main" alt="Coverage" />
  </a>
  <a href="https://github.com/idugeni/quanta-press/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/idugeni/quanta-press?color=blue" alt="License: MIT" />
  </a>
  <a href="https://www.npmjs.com/package/quanta-press">
    <img src="https://img.shields.io/npm/v/quanta-press?color=orange" alt="NPM Version" />
  </a>
</p>

<p align="center">
  <img src="./public/demo.png" alt="Demo Quanta Press" width="600" />
</p>

---

Quanta Press adalah aplikasi web modern berbasis Next.js App Router, TypeScript, dan Tailwind CSS, dirancang untuk pengelolaan dan publikasi konten secara efisien, cepat, dan aman. Proyek ini mengadopsi arsitektur modular dengan standar open source terkini, serta integrasi shadcn/ui untuk komponen UI yang konsisten dan mudah dikustomisasi.

## Fitur Utama
- **Next.js App Router**: Routing dinamis, server components, dan optimasi performa.
- **TypeScript**: Pengetikan statis untuk keamanan dan skalabilitas kode.
- **Tailwind CSS**: Utility-first styling untuk pengembangan UI yang cepat dan responsif.
- **shadcn/ui**: Komponen UI siap pakai, konsisten, dan mudah diintegrasikan.
- **Validasi Input**: Menggunakan Zod untuk validasi dan sanitasi data.
- **State Management**: React Context atau Zustand.
- **Linting**: Mengikuti standar Airbnb Style Guide dengan ESLint.

## Struktur Proyek
```
quanta-press/
├── src/
│   ├── app/         # Routing & server components
│   ├── components/  # Komponen UI
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Library & helper
│   ├── styles/      # File CSS global
│   └── utils/       # Utility functions
├── .gitignore
├── tsconfig.json
├── eslint.config.mjs
├── README.md
```

## Instalasi
1. **Clone repository:**
   ```bash
   git clone https://github.com/idugeni/quanta-press.git
   cd quanta-press
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
4. **Akses aplikasi:**
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Penggunaan
- Edit atau tambahkan halaman di `src/app/`.
- Tambahkan komponen UI di `src/components/`.
- Gunakan utility dan hooks dari `src/utils/` dan `src/hooks/`.
- Pastikan semua input divalidasi dengan Zod.
- Untuk styling, gunakan class Tailwind CSS.

## Kontribusi
Kontribusi sangat terbuka! Silakan fork repository ini, buat branch baru untuk fitur atau perbaikan Anda, lalu ajukan pull request.

**Panduan kontribusi:**
- Ikuti struktur folder yang ada.
- Gunakan TypeScript secara konsisten.
- Pastikan kode lolos linting (`npm run lint`).
- Tambahkan dokumentasi pada fungsi publik (TypeDoc).

## Lisensi
Proyek ini berlisensi MIT. Silakan lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

---

<p align="center">
  © 2025 Quanta Press &middot; <a href="mailto:officialelsa21@gmail.comom">officialelsa21@gmail.comom</a>
</p>