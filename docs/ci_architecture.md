# Dokumentasi CI GitHub Actions

## Tujuan

GitHub Actions menjalankan pemeriksaan otomatis agar perubahan kode dapat diperiksa sebelum digabungkan ke `main`.

## Workflow yang tersedia

Workflow: `.github/workflows/ci.yml`

### Pemicu

- Pull request yang mengubah file di `client/**` atau workflow CI.
- Push ke branch `main` atau branch dengan pola `feat/**`, jika perubahan menyentuh `client/**` atau workflow CI.

### Job: Client lint, tests, and build

Job berjalan di `ubuntu-latest` dengan direktori kerja `client/`.

Urutan langkah:

1. Checkout repository.
2. Menyiapkan Node.js versi 22.
3. Menggunakan cache npm berdasarkan `client/package-lock.json`.
4. Memasang dependensi dengan `npm ci`.
5. Menjalankan ESLint melalui `npm run lint`.
6. Menjalankan pengujian melalui `npm test`.
7. Membuat build produksi melalui `npm run build`.

## Status dan batasan saat ini

- Workflow yang ada baru memeriksa Frontend.
- `server/package.json` belum tersedia pada branch `main` saat pemeriksaan dilakukan, sehingga pemeriksaan backend belum dapat ditambahkan secara benar tanpa mengetahui skrip yang dipakai Backend.
- Status check harus diverifikasi pada tab **Actions** dan pada Pull Request; keberadaan file YAML saja tidak membuktikan bahwa job sudah berhasil.
- Nama status check yang harus diwajibkan perlu dilihat dari hasil run aktual sebelum mengaktifkan branch protection.

## Alur kerja yang diwajibkan

1. Buat feature branch dari `main`.
2. Buat perubahan kecil dan gunakan Conventional Commits.
3. Push branch dan ajukan Pull Request ke `main`.
4. Minta minimal satu rekan melakukan review.
5. Pastikan seluruh status check yang diwajibkan berhasil.
6. Merge hanya setelah review dan pemeriksaan selesai.

## Pekerjaan lanjutan

- Tambahkan lint dan test backend setelah skrip `server/package.json` disepakati.
- Pastikan test autentikasi frontend dan backend dijalankan oleh CI.
- Catat hasil run CI yang benar pada deskripsi Pull Request.
- Aktifkan required status checks untuk `main` jika fitur proteksi tersedia pada paket/jenis repository yang digunakan.
