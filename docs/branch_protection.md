# Panduan Branch Protection untuk `main`

Panduan ini digunakan untuk memenuhi bagian **Mandatory CI status check** pada Pertemuan 8.

## Aturan yang disarankan

Buka repository GitHub → **Settings → Rules → Rulesets**, lalu buka ruleset bernama `main`.

Atur target branch agar hanya mencakup `main`, lalu aktifkan:

- Require a pull request before merging.
- Require at least 1 approval.
- Dismiss stale approvals when new commits are pushed.
- Require status checks to pass before merging.
- Pilih `CI Required` sebagai required status check.
- Block force pushes dan branch deletion jika tersedia.

## Required status check

Setelah workflow `Web CI` berjalan pada Pull Request dan GitHub menampilkan daftar check, pilih:

- `CI Required`

Job tersebut memverifikasi hasil dua job utama:

- `Client lint, tests, and build`
- `Server lint, tests, and syntax check`

## Status verifikasi repository

Pemeriksaan ruleset repository pada 12 November 2026 menemukan:

- Ruleset `main` sudah dibuat (ID `23519957`).
- Enforcement ruleset masih **disabled**.
- Daftar `required_status_checks` masih kosong.
- Aturan PR menyimpan konfigurasi minimal 1 approval, tetapi belum berlaku karena enforcement disabled.

Dengan demikian, **Branch Protection belum aktif** dan `CI Required` belum menjadi pemeriksaan wajib. Jangan menyatakan bagian ini selesai sampai enforcement diaktifkan dan required check benar-benar dipilih.

## Langkah yang harus dilakukan pemilik repository

1. Buka **Settings → Rules → Rulesets**.
2. Pilih ruleset `main`.
3. Ubah enforcement menjadi **Active**.
4. Pastikan target branch mencakup `main`.
5. Aktifkan pull request requirement dan minimal 1 approval.
6. Aktifkan required status checks, lalu pilih `CI Required`.
7. Simpan perubahan.
8. Buka Pull Request percobaan menuju `main`; pastikan merge tertahan jika belum ada approval atau check belum sukses.
9. Lampirkan screenshot ruleset aktif dan hasil verifikasi pada Issue DevOps.

## Catatan akses

Perubahan enforcement ruleset memerlukan hak administrasi repository. Jika menu pengaturan tidak tersedia, minta pemilik/admin repository melakukannya. Dokumentasi atau PR saja tidak dapat mengaktifkan Branch Protection.

## Keamanan

- Jangan commit file `.env` yang berisi kredensial asli.
- Simpan hanya placeholder di `.env.example`.
- Jangan menampilkan secret dengan `echo` atau mencetak environment ke log.
- Jangan memberikan secret produksi kepada workflow Pull Request yang tidak tepercaya.
- Jika secret terpublikasi, segera rotasi nilainya.
