import { useMemo, useState } from 'react'
import AuthField from './components/AuthField'
import AuthSubmitButton from './components/AuthSubmitButton'
import { getAuthValidationError } from './utils/authValidation'
import { loginUser, registerUser } from './services/api'
import './App.css'

const initialFood = [
  { id: 1, name: 'Large', price: 20000, stock: 15, unit: 'Porsi' },
  { id: 2, name: 'Medium', price: 15000, stock: 15, unit: 'Porsi' },
  { id: 3, name: 'Small', price: 10000, stock: 18, unit: 'Porsi' },
]
const initialIngredients = [
  { id: 1, name: 'Tepung tapioka', stock: 25, unit: 'kg', minimum: 10 },
  { id: 2, name: 'Daging ayam', stock: 8, unit: 'kg', minimum: 5 },
  { id: 3, name: 'Minyak goreng', stock: 12, unit: 'liter', minimum: 5 },
  { id: 4, name: 'Bumbu tabur', stock: 1, unit: 'kg', minimum: 2 },
  { id: 5, name: 'Saus sambal', stock: 0, unit: 'liter', minimum: 3 },
]
const branches = [
  { name: 'Cabang Nganjuk', manager: 'Budi Santoso', sales: 'Rp 4.450.000', portions: 145, status: 'Aktif' },
  { name: 'Cabang Kediri', manager: 'Sri Aminah', sales: 'Rp 4.500.000', portions: 112, status: 'Aktif' },
  { name: 'Cabang Surabaya', manager: 'Joko Widodo', sales: 'Rp 3.900.000', portions: 85, status: 'Perlu perhatian' },
]
const money = (value) => new Intl.NumberFormat('id-ID').format(value)

function App() {
  const [page, setPage] = useState('login')
  const [authMode, setAuthMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [food, setFood] = useState(initialFood)
  const [ingredients, setIngredients] = useState(initialIngredients)
  const [editing, setEditing] = useState(null)
  const [newStock, setNewStock] = useState('')
  const [stockNote, setStockNote] = useState('')
  const [cart, setCart] = useState([])
  const [transactions, setTransactions] = useState([
    { id: 'ORD-1021', time: '10:45', shift: 'Shift Pagi', item: 'Nasi Goreng Spesial Chila (2)', method: 'Tunai', total: 50000 },
    { id: 'ORD-1022', time: '11:15', shift: 'Shift Pagi', item: 'Mie Ayam Bang Chila (1)', method: 'QRIS', total: 18000 },
  ])
  const [shiftActive, setShiftActive] = useState(true)
  const [shiftName, setShiftName] = useState('Shift Siang')
  const [selectedBranch, setSelectedBranch] = useState(branches[0].name)
  const [detailBranch, setDetailBranch] = useState(false)
  const [notice, setNotice] = useState('')

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const foodStock = food.reduce((sum, item) => sum + item.stock, 0)
  const lowIngredients = ingredients.filter((item) => item.stock <= item.minimum).length

  async function handleAuth(event) {
    event.preventDefault()
    setMessage('')
    const error = getAuthValidationError({ mode: authMode, username, email, password, confirmPassword })
    if (error) { setMessage(error); return }
    setLoading(true)
    try {
      if (authMode === 'register') {
        const result = await registerUser(username.trim(), email.trim(), password)
        if (result.token) localStorage.setItem('auth_token', result.token)
        setMessageType('success')
        setMessage('Pendaftaran berhasil. Silakan masuk.')
        setAuthMode('login')
        setPassword('')
        setConfirmPassword('')
      } else {
        const result = await loginUser(email.trim(), password)
        if (result.token) localStorage.setItem('auth_token', result.token)
        setPage('Kasir Penjualan')
        setNotice('Selamat datang di ChiLa-Chillo.')
      }
    } catch (error) {
      setMessageType('error')
      setMessage(error.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally { setLoading(false) }
  }

  function addToCart(product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id)
      return found
        ? current.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
        : [...current, { ...product, qty: 1 }]
    })
  }

  function checkout() {
    if (!cart.length) return
    const next = { id: `ORD-${1023 + transactions.length - 2}`, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), shift: shiftName, item: cart.map((item) => `${item.name} (${item.qty})`).join(', '), method: 'Tunai', total: cartTotal }
    setTransactions((current) => [next, ...current])
    setFood((current) => current.map((item) => {
      const ordered = cart.find((cartItem) => cartItem.id === item.id)
      return ordered ? { ...item, stock: Math.max(0, item.stock - ordered.qty) } : item
    }))
    setCart([])
    setNotice('Transaksi berhasil dicatat pada data demo.')
  }

  function saveStock(event) {
    event.preventDefault()
    if (newStock === '' || Number(newStock) < 0) return
    const update = (items) => items.map((item) => item.id === editing.id ? { ...item, stock: Number(newStock) } : item)
    if (editing.type === 'food') setFood(update)
    else setIngredients(update)
    setEditing(null)
    setNewStock('')
    setStockNote('')
    setNotice('Perubahan stok tersimpan pada data demo.')
  }

  function openStock(item, type) {
    setEditing({ ...item, type })
    setNewStock(String(item.stock))
    setStockNote('')
  }

  function logout() {
    localStorage.removeItem('auth_token')
    setPage('login')
    setAuthMode('login')
    setCart([])
  }

  if (page === 'login') {
    const isRegister = authMode === 'register'
    return (
      <main className="login-layout">
        <section className="login-form-side">
          <div className="login-brand"><strong>Chilla-Chillo</strong><small>KULINER & MANAJEMEN</small></div>
          <div className="login-card">
            <span className="red-kicker">{isRegister ? 'AKUN BARU' : 'AKUN KARYAWAN'}</span>
            <h1>{isRegister ? 'Buat akun baru' : 'Selamat datang kembali'}</h1>
            <p>{isRegister ? 'Daftarkan akun untuk mulai menggunakan Chilla-Chillo.' : 'Masuk untuk mulai mengelola operasional Chilla-Chillo hari ini.'}</p>
            <form onSubmit={handleAuth} className="auth-form" noValidate>
              {isRegister && <AuthField id="username" name="username" label="Username" type="text" autoComplete="username" placeholder="Masukkan username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />}
              <AuthField id="email" name="email" label="Email atau username" type="email" autoComplete="username" placeholder="Masukkan email atau username" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <AuthField id="password" name="password" label="Kata sandi" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="Masukkan kata sandi" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              {isRegister && <AuthField id="confirm-password" name="confirmPassword" label="Konfirmasi kata sandi" type="password" autoComplete="new-password" placeholder="Ulangi kata sandi" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />}
              {!isRegister && <div className="login-options"><label><input type="checkbox" /> Ingat saya</label><button type="button" className="link-button" onClick={() => setMessage('Hubungi admin untuk mengatur ulang kata sandi.')}>Lupa kata sandi?</button></div>}
              {message && <div className={`form-message ${messageType}`} role="status">{message}</div>}
              <AuthSubmitButton loading={loading} isRegister={isRegister} />
            </form>
            <div className="auth-switch">{isRegister ? 'Sudah memiliki akun?' : 'Belum memiliki akun?'} <button className="link-button" onClick={() => { setAuthMode(isRegister ? 'login' : 'register'); setMessage('') }}>{isRegister ? 'Masuk' : 'Daftar sekarang'}</button></div>
            <div className="login-help">Gunakan layanan bantuan admin jika Anda mengalami kendala saat masuk.</div>
          </div>
        </section>
        <aside className="login-promo">
          <div><h2>Chilla-Chillo</h2><span>KULINER & MANAJEMEN</span></div>
          <div className="promo-copy"><h1>Satu tempat untuk setiap aktivitas usaha Anda.</h1><p>Dari pesanan pertama hingga rekap shift terakhir. Kelola penjualan, stok, dan cabang dengan lebih teratur.</p><ol><li><b>01</b><span>Penjualan lebih praktis<small>Catat pesanan dan pembayaran.</small></span></li><li><b>02</b><span>Stok selalu terpantau<small>Kelola ketersediaan setiap menu.</small></span></li><li><b>03</b><span>Rekap per shift<small>Ringkasan shift pagi dan siang.</small></span></li></ol></div>
          <small>Sistem Kasir & Manajemen Cabang</small>
        </aside>
      </main>
    )
  }

  const nav = [
    { label: 'Kasir Penjualan', group: 'MENU UTAMA', icon: '▦' },
    { label: 'Stok Makanan', group: 'MENU UTAMA', icon: '▤' },
    { label: 'Stok Bahan Baku', group: 'MENU UTAMA', icon: '◫' },
    { label: 'Rekap & Shift', group: 'LAPORAN & SHIFT', icon: '▧' },
    { label: 'Kelola Cabang', group: 'PENGATURAN', icon: '⌂' },
  ]
  const pageTitle = page === 'Rekap & Shift' ? 'Riwayat Pesanan & Laporan Shift' : page === 'Kelola Cabang' && detailBranch ? 'Detail Kinerja Cabang' : page === 'Kelola Cabang' ? 'Kelola Cabang' : page === 'Stok Makanan' ? 'Manajemen Stok Makanan' : page === 'Stok Bahan Baku' ? 'Manajemen Stok Bahan Baku' : 'Kasir Penjualan'

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="side-brand"><b>Chilla-Chillo</b><small>KULINER & MANAJEMEN</small></div>
        <div className="side-nav">{['MENU UTAMA', 'LAPORAN & SHIFT', 'PENGATURAN'].map((group) => <div key={group}><p className="nav-group">{group}</p>{nav.filter((item) => item.group === group).map((item) => <button key={item.label} className={page === item.label ? 'nav-item active' : 'nav-item'} onClick={() => { setPage(item.label); setDetailBranch(false) }}><span>{item.icon}</span>{item.label}</button>)}</div>)}</div>
        <div className="side-user"><div className="user-avatar">A</div><div><b>Admin</b><small>Administrator</small></div><button onClick={logout} title="Keluar">↪</button></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div><span className="breadcrumb">Dashboard /</span> {pageTitle}</div><button className="shift-pill" onClick={() => setPage('Rekap & Shift')}>● Shift Aktif: {shiftName}</button></header>
        {notice && <button className="notice" onClick={() => setNotice('')}>{notice} <b>×</b></button>}
        <div className="page-content">
          <div className="page-heading"><div><span className="section-mark" /><h1>{pageTitle}</h1><p>{page === 'Kasir Penjualan' ? 'Catat pesanan pelanggan dan proses pembayaran.' : 'Pantau dan kelola data operasional Chilla-Chillo.'}</p></div>{page === 'Kelola Cabang' && <button className="subtle-button">Cabang Nganjuk (Pusat)⌄</button>}{page === 'Stok Makanan' || page === 'Stok Bahan Baku' ? <button className="subtle-button">⇧ Unduh Data</button> : null}</div>

          {page === 'Kasir Penjualan' && <div className="pos-layout"><section><div className="section-title"><h2>Menu Tersedia</h2><span>3 Makanan</span></div><div className="product-grid">{food.map((item) => <article className="product-card" key={item.id}><div className="food-placeholder">🍽</div><span className="stock-tag">{item.stock} porsi</span><h3>{item.name}</h3><b className="price">Rp {money(item.price)}</b><button className="add-button" onClick={() => addToCart(item)} disabled={item.stock === 0}>＋ Tambah</button></article>)}</div><div className="section-title recent-title"><h2>Transaksi Terbaru</h2><button className="link-button" onClick={() => setPage('Rekap & Shift')}>Lihat semua</button></div><TransactionTable rows={transactions.slice(0, 3)} /></section><aside className="cart-panel"><h2>Keranjang Makanan</h2>{cart.length === 0 ? <div className="empty-cart"><span>▱</span><b>Keranjang masih kosong</b><small>Pilih menu makanan untuk memulai pesanan.</small></div> : <div className="cart-items">{cart.map((item) => <div className="cart-line" key={item.id}><div><b>{item.name}</b><small>Rp {money(item.price)}</small></div><div className="qty-control"><button onClick={() => setCart((current) => current.map((x) => x.id === item.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}>−</button>{item.qty}<button onClick={() => addToCart(item)}>＋</button></div></div>)}</div>}<div className="cart-summary"><div><span>Jumlah item</span><b>{cart.reduce((sum, item) => sum + item.qty, 0)}</b></div><div><span>Subtotal</span><b>Rp {money(cartTotal)}</b></div><div className="total-line"><span>Total Pembayaran</span><b>Rp {money(cartTotal)}</b></div><button className="primary-button" disabled={!cart.length || !shiftActive} onClick={checkout}>Proses Pembayaran</button></div></aside></div>}

          {page === 'Stok Makanan' && <><div className="stats-grid"><Stat label="Menu makanan" value="3 menu" detail="Menu yang tersedia" /><Stat label="Total stok tersedia" value={`${foodStock} porsi`} detail="Jumlah stok seluruh menu" /><Stat label="Ketersediaan menu" value="3 tersedia" detail="Menu dengan stok aktif" /></div><div className="table-card"><div className="table-heading"><h2>Daftar Stok Makanan</h2><span>3 menu</span></div><table><thead><tr><th>NAMA MAKANAN</th><th>HARGA JUAL</th><th>STOK SAAT INI</th><th>SATUAN</th><th>AKSI</th></tr></thead><tbody>{food.map((item) => <tr key={item.id}><td><b>{item.name}</b><small>Makanan siap jual</small></td><td className="price">Rp {money(item.price)}</td><td><span className="stock-badge">{item.stock} porsi</span></td><td>Porsi</td><td><button className="edit-button" onClick={() => openStock(item, 'food')}>Edit Stok</button></td></tr>)}</tbody></table><div className="table-foot">Jumlah stok makanan mengikuti menu: Large, Medium, dan Small.</div></div><div className="info-banner">Jumlah stok makanan saat ini adalah {foodStock} porsi. Pastikan stok selalu diperbarui.</div></>}

          {page === 'Stok Bahan Baku' && <><div className="stats-grid"><Stat label="Jenis bahan baku" value="5 bahan" detail="Bahan yang dikelola" /><Stat label="Stok aman" value={`${ingredients.filter((x) => x.stock > x.minimum).length} bahan`} detail="Di atas batas minimum" /><Stat label="Perlu restok" value={`${lowIngredients} bahan`} detail="Periksa ketersediaan" danger /></div><div className="table-card"><div className="table-heading"><h2>Daftar Stok Bahan Baku</h2><span>5 bahan</span></div><table><thead><tr><th>NAMA BAHAN</th><th>STOK SAAT INI</th><th>STOK MINIMUM</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody>{ingredients.map((item) => <tr key={item.id}><td><b>{item.name}</b><small>Bahan untuk produksi</small></td><td><span className="stock-badge">{item.stock} {item.unit}</span></td><td>{item.minimum} {item.unit}</td><td><span className={item.stock <= item.minimum ? 'status-warning' : 'status-safe'}>{item.stock <= item.minimum ? item.stock === 0 ? 'Habis' : 'Menipis' : 'Aman'}</span></td><td><button className="edit-button" onClick={() => openStock(item, 'ingredient')}>Edit Stok</button></td></tr>)}</tbody></table><div className="table-foot">Menampilkan seluruh bahan baku yang dikelola.</div></div><div className="info-banner">Terdapat {lowIngredients} bahan baku yang perlu diperiksa atau ditambah stoknya.</div></>}

          {page === 'Rekap & Shift' && <><div className="shift-grid"><div className="shift-card"><div className="shift-card-head"><div><b>▣ Shift Pagi</b><small>2 transaksi tercatat</small></div><span className="shift-done">SELESAI</span></div><p>Total transaksi <b>Rp 68.000</b></p><p>Kas tunai <b>Rp 50.000</b></p><button className="subtle-button" onClick={() => setNotice('Ringkasan Shift Pagi ditampilkan pada tabel transaksi.')}>Pilih Shift Pagi</button></div><div className="shift-card current"><div className="shift-card-head"><div><b>▣ {shiftName}</b><small>{shiftActive ? 'Shift sedang berjalan' : 'Shift belum dimulai'}</small></div><span className="shift-live">{shiftActive ? 'AKTIF SEKARANG' : 'SELESAI'}</span></div><p>Total transaksi <b>Rp {money(transactions.filter((x) => x.shift === shiftName).reduce((s, x) => s + x.total, 0))}</b></p><p>Kas tunai <b>Rp {money(transactions.filter((x) => x.shift === shiftName).reduce((s, x) => s + x.total, 0))}</b></p><button className="primary-button" onClick={() => setShiftActive((active) => !active)}>{shiftActive ? 'Akhiri Shift' : 'Mulai Shift'}</button></div></div><div className="table-card"><div className="table-heading"><h2>Riwayat Transaksi Lengkap</h2><span>Total {transactions.length} Transaksi</span></div><TransactionTable rows={transactions} /></div><div className="info-banner">Riwayat transaksi tersimpan pada sesi demo browser ini.</div></>}

          {page === 'Kelola Cabang' && <>{detailBranch ? <><button className="back-button" onClick={() => setDetailBranch(false)}>← Kembali ke daftar cabang</button><div className="stats-grid"><Stat label="Total penjualan cabang" value="Rp 3.900.000" detail="Periode bulan ini" /><Stat label="Total porsi terjual" value="85 Pcs" detail="Seluruh menu" /><Stat label="Status cabang" value="Perlu perhatian" detail="Periksa ketersediaan stok" danger /></div><div className="table-card"><div className="table-heading"><h2>Informasi Cabang</h2><span>{selectedBranch}</span></div><div className="branch-detail"><p>Nama cabang <b>{selectedBranch}</b></p><p>Penanggung jawab <b>Joko Widodo</b></p><p>Status operasional <b>Beroperasi normal</b></p></div></div></> : <><div className="stats-grid"><Stat label="Total omzet semua cabang" value="Rp 14.850.000" detail="Penjualan bulan ini" /><Stat label="Total porsi makanan" value="342 Pcs" detail="Porsi terjual" /><Stat label="Cabang teraktif" value="Cabang Nganjuk" detail="Performa tertinggi" /></div><div className="table-card"><div className="table-heading"><h2>Rekapitulasi Kinerja Cabang</h2><span>3 cabang</span></div><table><thead><tr><th>NAMA CABANG</th><th>KEPALA CABANG</th><th>TOTAL PENJUALAN</th><th>PORSI TERJUAL</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody>{branches.map((branch) => <tr key={branch.name}><td><b>{branch.name}</b><small>Cabang operasional</small></td><td>{branch.manager}</td><td className="price">{branch.sales}</td><td>{branch.portions} Pcs</td><td><span className={branch.status === 'Aktif' ? 'status-safe' : 'status-warning'}>{branch.status}</span></td><td><button className="edit-button" onClick={() => { setSelectedBranch(branch.name); setDetailBranch(true) }}>Detail</button></td></tr>)}</tbody></table></div><div className="info-banner">Data kinerja cabang menggunakan data contoh untuk tampilan frontend.</div></>}</>}
        </div>
      </main>
      {editing && <div className="modal-backdrop" role="presentation"><form className="stock-modal" onSubmit={saveStock}><button type="button" className="modal-close" onClick={() => setEditing(null)}>×</button><span className="red-kicker">PERBARUI STOK</span><h2>Edit Stok {editing.type === 'food' ? 'Makanan' : 'Bahan Baku'}</h2><p>Perbarui jumlah stok untuk {editing.name}.</p><label>Nama item<input value={editing.name} disabled /></label><label>Stok saat ini<input value={editing.stock + ' ' + (editing.unit || 'porsi')} disabled /></label><label>Stok baru<input type="number" min="0" value={newStock} onChange={(e) => setNewStock(e.target.value)} required /></label><label>Catatan perubahan<textarea value={stockNote} onChange={(e) => setStockNote(e.target.value)} placeholder="Tuliskan alasan perubahan stok" /></label><div className="modal-actions"><button type="button" className="subtle-button" onClick={() => setEditing(null)}>Batal</button><button className="primary-button" type="submit">Simpan Perubahan</button></div></form></div>}
    </div>
  )
}

function Stat({ label, value, detail, danger = false }) {
  return <article className="stat-card"><span className="stat-icon">▣</span><div><small>{label}</small><h2 className={danger ? 'danger-text' : ''}>{value}</h2><p>{detail}</p></div></article>
}

function TransactionTable({ rows }) {
  return <table className="transaction-table"><thead><tr><th>ID PESANAN</th><th>WAKTU & SHIFT</th><th>DETAIL MAKANAN</th><th>METODE BAYAR</th><th>TOTAL</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><b>{row.id}</b></td><td>{row.time}<small>{row.shift}</small></td><td>{row.item}</td><td>{row.method}</td><td className="price">Rp {money(row.total)}</td></tr>)}</tbody></table>
}

export default App
