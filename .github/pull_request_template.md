# Pull Request

Gunakan template ini saat mengajukan perubahan kode agar anggota
kelompok lain dapat memahami dan memeriksanya sebelum digabungkan ke
branch utama.

## 1. Ringkasan Perubahan

Jelaskan perubahan yang kamu buat dan alasan perubahan tersebut
diperlukan.

**Contoh:** Menambahkan endpoint `/api/health` untuk memeriksa apakah
Backend berjalan.

## 2. Jenis Perubahan

Pilih jenis perubahan yang paling sesuai.

-   [ ] `feat` --- menambahkan fitur baru.
-   [ ] `fix` --- memperbaiki bug.
-   [ ] `refactor` --- merapikan atau menyusun ulang kode tanpa mengubah
    hasil fitur.
-   [ ] `test` --- menambah atau memperbaiki pengujian.
-   [ ] `docs` --- memperbarui dokumentasi.
-   [ ] `chore` --- memperbarui konfigurasi atau kebutuhan pendukung
    proyek.

## 3. Issue Terkait

Jika perubahan ini berkaitan dengan Issue GitHub, cantumkan nomor atau
tautannya.

**Contoh:** `Closes #14`

Jika tidak ada Issue terkait, tulis `Tidak ada`.

## 4. Bagian yang Diubah

-   [ ] Frontend (`client/`)
-   [ ] Backend (`server/`)
-   [ ] DevOps / CI (`.github/workflows/`, konfigurasi)
-   [ ] Dokumentasi (`docs/`, `README.md`)
-   [ ] Bagian lain:

## 5. Pengujian

Jelaskan pengujian yang sudah kamu lakukan. Jangan mencentang pengujian
yang belum dijalankan.

-   [ ] Aplikasi berhasil dijalankan secara lokal.
-   [ ] Linter berhasil dijalankan.
-   [ ] Unit test berhasil dijalankan.
-   [ ] Perubahan sudah dicoba sesuai kebutuhan.
-   [ ] Belum ada pengujian; jelaskan alasannya di bawah.

**Perintah yang dijalankan dan hasilnya:**

``` text
Contoh:
npm test
Test Suites: 1 passed
```

Ganti contoh di atas dengan hasil pengujian yang sebenarnya.

## 6. Checklist Sebelum Review

-   [ ] Kode mengikuti aturan penamaan dan format proyek.
-   [ ] Tidak ada file `.env`, password, token, atau API key yang ikut
    di-commit.
-   [ ] Dokumentasi diperbarui jika diperlukan.
-   [ ] Perubahan tidak memasukkan file hasil build atau `node_modules`.
-   [ ] Saya sudah memeriksa perubahan sebelum mengajukan PR.

## 7. Bukti Perubahan

Tambahkan screenshot tampilan, log pengujian, atau bukti lain jika
relevan.

**Bukti:**\
*Tempelkan screenshot atau tautan bukti di sini.*

## 8. Catatan untuk Reviewer

Tuliskan bagian yang perlu diperiksa secara khusus atau hal yang masih
belum selesai.

**Catatan:**

------------------------------------------------------------------------

**Pengingat untuk tim:** 1. Gunakan feature branch, misalnya
`feat/client-auth-pages` atau `feat/server-auth-jwt`. 2. Ajukan Pull
Request ke branch tujuan yang disepakati tim. 3. Minta anggota lain
melakukan review. 4. Perbaiki masukan reviewer dan pastikan status CI
sesuai aturan tim. 5. Merge hanya setelah persyaratan review dan
pengujian yang disepakati terpenuhi.
