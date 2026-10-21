import { useState } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import Card from './components/Card';
import Modal from './components/Modal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-6">ChiLa-ChiLo UI Component Catalog</h1>
        
        <Card title="Form Input Component">
          <Input label="Email" placeholder="Masukkan email..." />
          <Input label="Password" type="password" error="Password wajib diisi" />
        </Card>

        <Card title="Button Variations">
          <div className="flex gap-3 flex-wrap">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button isLoading={true}>Loading State</Button>
          </div>
        </Card>

        <Card title="Modal Component">
          <Button onClick={() => setIsModalOpen(true)}>Buka Modal</Button>
        </Card>

        <Modal isOpen={isModalOpen} title="Konfirmasi Aksi" onClose={() => setIsModalOpen(false)}>
          <p className="text-gray-600 mb-4">Apakah kamu yakin ingin melanjutkan aksi ini?</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>Ya, Lanjutkan</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}