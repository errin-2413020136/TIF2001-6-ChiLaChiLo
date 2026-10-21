# Matriks Pengujian Sprint 1 — Autentikasi

Dokumen ini merupakan rencana pengujian. Tandai hasil hanya setelah skenario benar-benar dijalankan.

## Frontend — validasi formulir

| ID | Jenis | Skenario | Hasil yang diharapkan | Status |
|---|---|---|---|---|
| FE-AUTH-01 | Positive | Email dan password dengan format valid | Form dapat dikirim | Belum diverifikasi |
| FE-AUTH-02 | Negative | Email kosong | Pesan validasi ditampilkan dan form tidak dikirim | Belum diverifikasi |
| FE-AUTH-03 | Negative | Format email tidak valid | Pesan validasi ditampilkan | Belum diverifikasi |
| FE-AUTH-04 | Negative | Password kosong | Pesan validasi ditampilkan | Belum diverifikasi |
| FE-AUTH-05 | Boundary | Password pada batas panjang minimum yang disepakati | Hasil mengikuti aturan validasi proyek | Menunggu aturan final |
| FE-AUTH-06 | Boundary | Input dengan spasi atau karakter khusus | Input ditangani sesuai aturan yang disepakati | Belum diverifikasi |

## Backend — register, login, dan JWT

| ID | Jenis | Skenario | Hasil yang diharapkan | Status |
|---|---|---|---|---|
| BE-AUTH-01 | Positive | Registrasi dengan data valid | Respons sukses; password tersimpan dalam bentuk hash | Menunggu implementasi/test |
| BE-AUTH-02 | Negative | Registrasi dengan email yang sudah digunakan | Respons konflik/validasi sesuai kontrak API | Menunggu implementasi/test |
| BE-AUTH-03 | Negative | Login dengan password salah | Respons 401 tanpa membocorkan detail sensitif | Menunggu implementasi/test |
| BE-AUTH-04 | Negative | Login dengan akun yang tidak ditemukan | Respons gagal yang aman dan konsisten | Menunggu implementasi/test |
| BE-AUTH-05 | Boundary | Request wajib tidak dikirim atau bernilai kosong | Respons validasi 400 | Menunggu implementasi/test |
| BE-AUTH-06 | Positive | Login dengan kredensial benar | Token JWT diterbitkan sesuai kontrak API | Menunggu implementasi/test |
| BE-AUTH-07 | Negative | Akses endpoint privat tanpa token | Respons 401 | Menunggu implementasi/test |
| BE-AUTH-08 | Negative | Akses endpoint privat dengan token tidak valid/kedaluwarsa | Akses ditolak | Menunggu implementasi/test |

## Pelaporan hasil

- Jalankan test lokal dan melalui GitHub Actions.
- Catat jumlah test yang lulus/gagal berdasarkan hasil aktual.
- Tambahkan pengukuran code coverage setelah test runner dan konfigurasi coverage tersedia.
- Persentase coverage saat ini: **belum diukur**. Jangan mengisi angka perkiraan sebagai hasil pengujian.
- Simpan tautan run GitHub Actions atau log CI pada Pull Request.
