# Matriks Pengujian Sprint 1 — Autentikasi

Dokumen ini merangkum skenario unit test yang sudah ditulis tim dan pemeriksaan manual yang masih diperlukan. Status test otomatis harus dikonfirmasi melalui hasil CI aktual; keberadaan file test saja belum membuktikan test berhasil.

## Frontend — validasi dan state UI

Runner: Node.js built-in test runner melalui `npm test` dari direktori `client/`.

| ID | Skenario | Hasil yang diharapkan | Bukti implementasi | Status |
|---|---|---|---|---|
| FE-AUTH-01 | Registrasi dengan username, email, password, dan konfirmasi valid | Tidak ada pesan validasi | `client/src/utils/authValidation.test.js` | Test tersedia; Run #58 lulus |
| FE-AUTH-02 | Email tidak valid | Validasi email menolak input | File test yang sama | Test tersedia; Run #58 lulus |
| FE-AUTH-03 | Password kurang dari 8 karakter | Validasi password menolak input | File test yang sama | Test tersedia; Run #58 lulus |
| FE-AUTH-04 | Konfirmasi password berbeda | Validasi menolak input | File test yang sama | Test tersedia; Run #58 lulus |
| FE-AUTH-05 | Username kosong/kurang dari 2 karakter non-spasi | Validasi menolak input | File test yang sama | Test tersedia; Run #58 lulus |
| FE-AUTH-06 | Login dengan email dan password valid | Tidak ada pesan validasi | File test yang sama | Test tersedia; Run #58 lulus |
| FE-AUTH-07 | Email dengan spasi di awal/akhir | Spasi dibersihkan sebelum validasi | File test yang sama | Test tersedia; Run #58 lulus |
| FE-AUTH-08 | Password tepat 8 karakter | Input diterima | File test yang sama | Test tersedia; Run #58 lulus |
| FE-UI-01 | Konten halaman Login/Register | Judul, deskripsi, dan switch action sesuai mode | `client/src/utils/authValidation.test.js` | Test tersedia; Run #58 lulus |
| FE-UI-02 | Label tombol submit saat idle/loading | Label sesuai mode dan status loading | File test yang sama | Test tersedia; Run #58 lulus |

## Backend — validasi, register, login, dan JWT

Runner: Jest melalui `npm test` atau `npm run test:coverage` dari direktori `server/`.

| ID | Skenario | Hasil yang diharapkan | Bukti implementasi | Status |
|---|---|---|---|---|
| BE-VAL-01 | Normalisasi string dan input bukan string | Spasi dipangkas; input bukan string menjadi string kosong | `server/tests/auth.validation.test.js` | Test tersedia; Run #58 lulus |
| BE-VAL-02 | Username terlalu pendek / mengandung karakter terlarang | Validasi menolak input | File test yang sama | Test tersedia; Run #58 lulus |
| BE-VAL-03 | Email tidak valid | Validasi menolak input | File test yang sama | Test tersedia; Run #58 lulus |
| BE-VAL-04 | Password kurang dari 8 atau lebih dari 72 karakter | Validasi menolak input | File test yang sama | Test tersedia; Run #58 lulus |
| BE-VAL-05 | Payload kosong/null | Validasi menolak input | File test yang sama | Test tersedia; Run #58 lulus |
| BE-AUTH-01 | Register dengan input tidak valid | HTTP 400; query database tidak dipanggil | `server/tests/auth.controller.test.js` | Test tersedia; Run #58 lulus |
| BE-AUTH-02 | JWT secret belum dikonfigurasi | HTTP 500; user tidak disimpan | File test yang sama | Test tersedia; Run #58 lulus |
| BE-AUTH-03 | Register valid | Password di-hash dengan bcrypt; respons HTTP 201 dan token tersedia | File test yang sama | Test tersedia; Run #58 lulus |
| BE-AUTH-04 | Username/email duplikat | HTTP 409 | File test yang sama | Test tersedia; Run #58 lulus |
| BE-AUTH-05 | Login untuk akun yang tidak ditemukan | HTTP 401 | File test yang sama | Test tersedia; Run #58 lulus |
| BE-AUTH-06 | Request tanpa Bearer token | HTTP 401 dan middleware tidak melanjutkan request | File test yang sama | Test tersedia; Run #58 lulus |
| BE-AUTH-07 | Token JWT valid dengan issuer yang sesuai | Middleware mengisi identitas dan memanggil next | File test yang sama | Test tersedia; Run #58 lulus |

## Skenario yang belum tercakup penuh

- Login dengan akun yang ditemukan tetapi password salah belum diuji secara terpisah.
- Penolakan token JWT yang kedaluwarsa atau tanda tangannya salah belum terlihat pada suite saat ini.
- Pengujian endpoint end-to-end dengan PostgreSQL sungguhan belum dibuktikan oleh unit test yang memakai mock.
- Browser/API integration test frontend masih manual.
- Coverage backend yang tercatat pada Run #58 adalah hasil sebelum test inventaris dari PR #41 digabungkan; jangan gunakan angka coverage tersebut sebagai coverage versi terbaru.
- Test inventaris pada PR #41 perlu dibuktikan melalui run CI baru pada versi repository setelah PR #41.

## Bukti CI aktual

Run #58 pada PR #37 berstatus **success**:

- Frontend: 12 unit test lulus (0 gagal), lint dan production build berhasil.
- Backend: 2 test suites dan 16 unit test lulus (0 gagal), lint dan syntax check berhasil.
- Coverage backend saat itu: 66.25% statements, 69.44% branches, 66.66% functions, 66.25% lines.
- Artifact coverage: https://github.com/errin-2413020136/TIF2001-6-ChiLaChiLo/actions/runs/41868598595/artifacts/13342254631

Run tersebut mendahului PR #41, sehingga perlu run baru untuk memastikan pengujian backend inventaris yang ditambahkan setelahnya.

## Perintah pengujian lokal

Frontend:

```bash
cd client
npm ci
npm run lint
npm test
npm run build
```

Backend:

```bash
cd server
npm install
npm run lint
npm run test:coverage
```

## Pelaporan hasil

- Catat jumlah test lulus/gagal berdasarkan output aktual.
- Lampirkan tautan run GitHub Actions atau artifact coverage pada Pull Request.
- Tandai skenario sebagai lulus hanya setelah test benar-benar dijalankan.
- Jangan menganggap mock database sebagai bukti koneksi PostgreSQL berhasil.
