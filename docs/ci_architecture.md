# Dokumentasi CI GitHub Actions

## Tujuan

GitHub Actions memeriksa kualitas kode dan menjalankan unit test secara otomatis saat Pull Request menuju `main` dibuat atau diperbarui. Pemeriksaan ini membantu menemukan masalah sebelum perubahan digabungkan.

File workflow: `.github/workflows/ci.yml`.

## Pemicu workflow

Workflow berjalan ketika Pull Request menuju `main` atau push ke branch `main`, `feat/**`, dan `chore/**` mengubah salah satu lokasi berikut:

- `client/**`
- `server/**`
- `docs/**`
- `.github/workflows/ci.yml`

Workflow memakai izin minimum `contents: read`.

## Job frontend — Client lint, tests, and build

Direktori kerja: `client/`.

1. Checkout repository.
2. Menyiapkan Node.js 22 dan cache npm menggunakan `client/package-lock.json`.
3. Menginstal dependensi dengan `npm ci`.
4. Menjalankan ESLint dengan `npm run lint`.
5. Menjalankan unit test Node.js dengan `npm test`.
6. Membuat production build dengan `npm run build`.

Unit test frontend saat ini mencakup validasi email, password, konfirmasi password, username, dan state tampilan halaman Login/Register. Rincian skenario tersedia di `docs/client_test_matrix.md`.

## Job backend — Server lint, tests, and syntax check

Direktori kerja: `server/`.

1. Checkout repository.
2. Menyiapkan Node.js 22.
3. Menginstal dependensi dengan `npm install --no-audit --no-fund`. Backend belum menyediakan package-lock, sehingga job ini belum menggunakan `npm ci`.
4. Menjalankan ESLint dengan `npm run lint`.
5. Menjalankan Jest beserta laporan coverage dengan `npm run test:coverage`.
6. Memeriksa sintaks setiap file JavaScript di `src/` dan `tests/` dengan `node --check`.
7. Mengunggah folder `server/coverage/` sebagai artifact `backend-coverage` jika tersedia.

Unit test backend memakai mock database. Pengujian ini tidak memerlukan kredensial PostgreSQL, tetapi juga tidak menggantikan uji koneksi dan integrasi terhadap database PostgreSQL yang sebenarnya.

## Job gate — CI Required

Job `CI Required` bergantung pada job frontend dan backend. Job ini akan gagal jika salah satu job tersebut gagal, dibatalkan, atau tidak berhasil diselesaikan.

Gunakan nama check berikut ketika mengatur Branch Protection pada branch `main`:

- `Client lint, tests, and build`
- `Server lint, tests, and syntax check`
- `CI Required`

Pilih `CI Required` sebagai satu required check utama jika GitHub menampilkan nama tersebut. Dua job lainnya tetap terlihat sebagai detail pemeriksaan.

## Branch Protection dan peer review

Pengaturan dilakukan di GitHub repository:

1. Buka **Settings → Branches** (atau **Rules → Rulesets**, sesuai tampilan GitHub).
2. Tambahkan rule untuk branch `main`.
3. Aktifkan kewajiban Pull Request sebelum merge.
4. Atur minimal **1 required approval**.
5. Aktifkan **Require status checks to pass before merging**.
6. Pilih `CI Required` sebagai required status check setelah workflow pernah berjalan dan check tersebut muncul.
7. Simpan aturan dan uji dengan Pull Request percobaan.

**Status:** dokumentasi ini menjelaskan konfigurasi yang harus diterapkan. Branch Protection belum boleh dinyatakan aktif sebelum pengaturan benar-benar disimpan dan diverifikasi pada GitHub Settings.

## Keamanan

- Jangan commit file `.env` yang berisi kredensial asli.
- Simpan hanya placeholder di `.env.example`.
- Jangan menampilkan secret dengan `echo` atau mencetak environment ke log.
- Unit test yang memakai mock tidak perlu diberi kredensial database produksi.
- Jangan memberikan secret produksi kepada workflow Pull Request yang tidak tepercaya.
- Jika secret terlanjur terpublikasi, segera rotasi nilainya.

## Alur kerja Pull Request (Pertemuan 6–7)

1. Ambil Issue/Task dan pindahkan ke In Progress.
2. Sinkronkan branch lokal dengan `main`.
3. Buat feature branch sesuai bagian yang dikerjakan.
4. Buat commit kecil menggunakan Conventional Commits.
5. Push branch dan buat Pull Request ke branch tujuan yang disepakati.
6. Isi `.github/pull_request_template.md`, termasuk Issue terkait, hasil pengujian aktual, dan bukti.
7. Minta minimal satu rekan melakukan review.
8. Perbaiki komentar reviewer dan tunggu seluruh required checks berhasil.
9. Merge hanya setelah approval dan status checks terpenuhi.

## Batasan yang masih perlu diverifikasi

- Hasil run workflow pada PR DevOps ini harus diperiksa pada tab **Checks**.
- Branch Protection dan required status checks perlu dikonfirmasi manual di Settings.
- Unit test backend masih memakai mock database; runtime check PostgreSQL perlu dilakukan terpisah.
- Backend belum memiliki `package-lock.json`; pertimbangkan membuat dan mengelolanya pada perubahan backend terpisah agar instalasi CI dapat memakai `npm ci`.
