# Proyek Softdev

Aplikasi web berbasis React.js dan Node.js REST API.

## Anggota Kelompok
- Frontend Developer: GRISELDI RESWARA (2413020135)
- Backend Developer: DANI DWI SETYA PUTRA (2413020127)
- DevOps Engineer: ERRIN SHAFA' OTSAMA (2413020136)

## Teknologi
- Frontend: React.js
- Backend: Node.js, Express.js, PostgreSQL, JWT, bcrypt
- Version control: Git dan GitHub
- CI/testing: GitHub Actions, Jest (sesuai konfigurasi tim)

## Struktur
- `client/`: aplikasi frontend
- `server/`: REST API dan koneksi PostgreSQL
- `docs/`: skema database, data dictionary, spesifikasi API, dan dokumen proyek

## Menjalankan backend
Lihat [panduan backend](server/README.md). Ringkasnya:
1. Gunakan Node.js 18+ dan siapkan database PostgreSQL (misalnya Neon/Supabase).
2. Salin `server/.env.example` menjadi `server/.env`, isi `DATABASE_URL` dan `JWT_SECRET` secara lokal.
3. Jalankan `npm install` dari folder `server/`.
4. Jalankan skrip `docs/database_schema.sql` pada database PostgreSQL.
5. Jalankan `npm run dev` dari folder `server/`.
6. Cek `GET http://localhost:5000/api/v1/health`.

API contract tersedia di [docs/api_specifications.md](docs/api_specifications.md). Jangan commit file `.env` atau credential asli.
