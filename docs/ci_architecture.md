# Dokumentasi CI GitHub Actions

## Tujuan

GitHub Actions memeriksa perubahan secara otomatis ketika Pull Request dibuat atau diperbarui. Workflow membantu menemukan kesalahan lebih awal sebelum perubahan digabungkan ke `main`.

## Workflow

Lokasi konfigurasi: `.github/workflows/ci.yml`

### Pemicu

- Pull Request yang mengubah `client/**`, `server/**`, `docs/**`, atau workflow CI.
- Push ke `main`, `feat/**`, atau `chore/**` dengan perubahan pada jalur yang sama.

### Job 1 — Client lint, tests, and build

Job ini berjalan jika `client/package.json` tersedia.

1. Checkout repository.
2. Menyiapkan Node.js 22 dan cache npm berdasarkan `client/package-lock.json`.
3. Memasang dependensi dengan `npm ci`.
4. Menjalankan ESLint melalui `npm run lint`.
5. Menjalankan test melalui `npm test`.
6. Membuat build produksi melalui `npm run build`.

### Job 2 — Server JavaScript syntax check

Job ini berjalan jika `server/package.json` tersedia.

1. Checkout repository dan menyiapkan Node.js 22.
2. Memasang dependensi backend tanpa menjalankan lifecycle scripts.
3. Menjalankan `node --check` untuk setiap berkas JavaScript di `server/src/`.

**Batasan:** job backend saat ini memeriksa sintaks JavaScript saja. Backend belum menyediakan skrip `lint` dan unit test pada `package.json` yang diperiksa, sehingga job ini bukan pengganti ESLint atau automated unit testing. Setelah tim backend menambahkan skrip lint/test, perluasan job backend harus dilakukan agar menjalankan skrip tersebut.

## Izin dan keamanan

- Workflow menggunakan `permissions: contents: read` karena hanya perlu membaca kode.
- Jangan menyimpan nilai rahasia pada workflow, log, Issue, atau Pull Request.
- Jangan berikan kredensial produksi kepada workflow Pull Request.
- `.env` asli harus tetap diabaikan Git; gunakan `.env.example` dengan nilai placeholder.

## Alur Pull Request

1. Sinkronkan `main` dan buat feature branch sesuai tanggung jawab.
2. Buat commit kecil dengan Conventional Commits.
3. Push branch dan buat PR menuju `main`.
4. Isi seluruh bagian pada `.github/pull_request_template.md`, termasuk issue terkait, pengujian aktual, checklist, dan evidence.
5. Minta minimal satu rekan melakukan review.
6. Periksa status setiap job CI pada tab Checks.
7. Merge hanya setelah review dan pemeriksaan yang diwajibkan berhasil.

## Verifikasi status

Keberadaan file YAML tidak otomatis membuktikan workflow berhasil. Periksa tab **Actions** dan bagian **Checks** pada PR. Nama job yang tersedia adalah:

- `Client lint, tests, and build`
- `Server JavaScript syntax check` (jika `server/package.json` tersedia)

Required status checks dan Branch Protection Rules tetap perlu diperiksa di pengaturan repository. Jangan menganggapnya aktif sebelum diverifikasi.

## Pekerjaan lanjutan

- Tambahkan ESLint serta skrip lint dan unit test backend setelah disepakati dengan pemilik `server/`.
- Tambahkan pengujian unit autentikasi client dan server.
- Catat tautan run CI aktual dan hasilnya di PR; jangan mengklaim lulus sebelum ada hasil run.
