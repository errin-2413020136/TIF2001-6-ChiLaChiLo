# Referensi Environment dan GitHub Secrets

Dokumen ini menjelaskan nama variabel yang mungkin dibutuhkan. **Jangan pernah menuliskan nilai rahasia yang sebenarnya di dokumen, Issue, Pull Request, log, atau repository.**

## Variabel server

Template lokal: `server/.env.example`

| Nama | Kegunaan | Penanganan |
|---|---|---|
| `PORT` | Port server lokal | Nilai konfigurasi non-rahasia |
| `DATABASE_URL` | Koneksi database | Rahasia; simpan pada environment lokal atau GitHub Secrets jika CI membutuhkannya |
| `JWT_SECRET` | Menandatangani token JWT | Rahasia; gunakan nilai acak kuat, jangan commit nilai riil |
| `NODE_ENV` | Menentukan lingkungan eksekusi | Nilai konfigurasi |

## Pengaturan GitHub

Jika workflow memerlukan koneksi database atau token JWT, buka:

**Repository → Settings → Secrets and variables → Actions → New repository secret**

Tambahkan hanya secret yang benar-benar diperlukan workflow. Nama secret harus cocok dengan referensi di file workflow.

## Aturan keamanan

- Jangan commit file `.env` yang berisi kredensial nyata.
- Pertahankan `.env.example` hanya dengan nilai contoh atau placeholder.
- Jangan menampilkan secret menggunakan perintah `echo` pada log CI.
- Batasi akses secret dan jangan berikan secret produksi ke workflow Pull Request dari sumber yang tidak tepercaya.
- Jika secret terlanjur terpublikasi, segera rotasi/ganti secret tersebut; menghapus file dari commit terbaru saja tidak cukup.
- Gunakan GitHub Actions secrets hanya jika diperlukan. Test unit yang tidak membutuhkan database sebaiknya tidak menggunakan kredensial database sungguhan.
