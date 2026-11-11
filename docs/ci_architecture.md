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

Unit test frontend mencakup validasi dan state tampilan Login/Register. Rincian skenario tersedia di `docs/client_test_matrix.md`.

## Job backend — Server lint, tests, and syntax check

Direktori kerja: `server/`.

1. Checkout repository.
2. Menyiapkan Node.js 22.
3. Menginstal dependensi dengan `npm install --no-audit --no-fund`. Backend belum menyediakan `package-lock.json`, sehingga job ini belum menggunakan `npm ci`.
4. Menjalankan ESLint dengan `npm run lint`.
5. Menjalankan Jest beserta laporan coverage dengan `npm run test:coverage`.
6. Memeriksa sintaks setiap file JavaScript di `src/` dan `tests/` dengan `node --check`.
7. Mengunggah folder `server/coverage/` sebagai artifact `backend-coverage` jika tersedia.

Unit test backend memakai mock database. Pengujian ini tidak memerlukan kredensial PostgreSQL, tetapi tidak menggantikan uji koneksi dan integrasi terhadap PostgreSQL sebenarnya.

## Job gate — CI Required

Job `CI Required` bergantung pada job frontend dan backend. Job ini gagal jika salah satu job tersebut gagal, dibatalkan, atau tidak berhasil diselesaikan.

Gunakan nama check berikut ketika mengatur Branch Protection pada branch `main`:

- `Client lint, tests, and build`
- `Server lint, tests, and syntax check`
- `CI Required`

Pilih `CI Required` sebagai required check utama jika GitHub menampilkan nama tersebut.

## Bukti run CI yang sudah diverifikasi

Run #58 pada PR #37 selesai dengan kesimpulan **success**:

- Frontend: ESLint berhasil, 12 unit test lulus, dan production build berhasil.
- Backend pada commit tersebut: ESLint berhasil, 2 test suites dan 16 unit test lulus, serta syntax check berhasil.
- Backend coverage: 66.25% statements, 69.44% branches, 66.66% functions, dan 66.25% lines.
- Artifact `backend-coverage` berhasil diunggah.
- Job `CI Required`: success.

Tautan run: https://github.com/errin-2413020136/TIF2001-6-ChiLaChiLo/actions/runs/41868598595

**Batas bukti:** Run #58 berasal dari PR #37 dan mendahului penambahan endpoint serta unit test inventaris melalui PR #41. Karena itu, run tersebut belum membuktikan bahwa test inventaris baru pada versi `main` setelah PR #41 lulus. Pull Request audit DevOps berikutnya perlu menjalankan ulang workflow terhadap kondisi repository terbaru.

## Branch Protection dan peer review

Status ruleset repository diperiksa pada 12 November 2026:

- Ruleset bernama `main` sudah ada.
- Enforcement masih `disabled`.
- `required_status_checks` masih kosong.
- Konfigurasi minimal 1 approval tersimpan pada ruleset, tetapi tidak berlaku selama enforcement disabled.

Artinya, `CI Required` sudah tersedia sebagai job workflow tetapi **belum menjadi required status check yang diberlakukan pada branch main**. Ikuti `docs/branch_protection.md` untuk langkah aktivasi oleh pemilik/admin repository.

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

- Workflow perlu dijalankan kembali setelah integrasi PR #41 untuk membuktikan test inventaris terbaru.
- Branch Protection enforcement dan required status check perlu diaktifkan serta diverifikasi oleh pemilik/admin repository.
- Unit test backend masih memakai mock database; runtime check PostgreSQL perlu dilakukan terpisah.
- Backend belum memiliki `package-lock.json`; pertimbangkan membuat dan mengelolanya pada perubahan backend terpisah agar instalasi CI dapat memakai `npm ci`.
- Hasil CI sukses tidak menggantikan peer review.
