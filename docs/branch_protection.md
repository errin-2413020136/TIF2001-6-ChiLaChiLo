# Panduan Branch Protection untuk `main`

Panduan ini digunakan untuk memenuhi bagian **Mandatory CI status check** pada Pertemuan 8.

## Aturan yang disarankan

Buka repository GitHub → **Settings → Branches** atau **Settings → Rules → Rulesets**, lalu buat aturan yang menargetkan branch `main`.

Aktifkan:

- Require a pull request before merging.
- Require at least 1 approval.
- Dismiss stale approvals when new commits are pushed (jika tersedia).
- Require status checks to pass before merging.
- Block force pushes (jika tersedia).
- Block branch deletion (jika tersedia).

## Required status check

Setelah workflow `Web CI` pernah berjalan pada Pull Request dan GitHub menampilkan daftar check, pilih:

- `CI Required`

Job tersebut memverifikasi hasil dua job utama:

- `Client lint, tests, and build`
- `Server lint, tests, and syntax check`

## Verifikasi

1. Simpan rule untuk `main`.
2. Buka Pull Request percobaan menuju `main`.
3. Pastikan GitHub menahan merge ketika belum ada approval atau ketika `CI Required` belum sukses.
4. Setelah approval dan check sukses, pastikan merge baru dapat dilakukan.

## Catatan status

File dokumentasi ini bukan bukti bahwa Branch Protection sudah aktif. Pengaturan harus disimpan oleh pemilik repository dan diverifikasi pada halaman Settings. Lampirkan screenshot rule yang aktif pada Issue DevOps Pertemuan 8.
