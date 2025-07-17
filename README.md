# SignBridge: Penerjemah Bahasa Isyarat Real-time

**SignBridge** adalah aplikasi web inovatif yang dirancang untuk menjembatani kesenjangan komunikasi dengan menyediakan terjemahan bahasa isyarat Indonesia (SIBI & BISINDO) dan suara secara real-time. Dibangun dengan arsitektur modern, aplikasi ini memanfaatkan kekuatan machine learning di sisi backend dan antarmuka yang responsif di sisi frontend.

## ✨ Fitur Utama

  - **Deteksi Isyarat Real-time**: Menerjemahkan gerakan tangan dari kamera menjadi teks.
  - **Dukungan Multi-Model**: Pilihan antara model deteksi **SIBI** (1 tangan) atau **BISINDO** (2 tangan).
  - **Visualisasi Landmark**: Umpan balik visual instan dengan menggambar kerangka tangan di atas video.
  - **Speech-to-Text**: Fitur pengenalan suara untuk mentranskripsi ucapan menjadi teks.
  - **Saran Kata Cerdas**: Memberikan saran kata dinamis dari kamus berdasarkan huruf yang terdeteksi.
  - **Pengaturan Kamera**: Kontrol real-time untuk kecerahan, kontras, dan efek blur pada video.
  - **Desain Responsif**: Antarmuka yang bersih dan modern untuk desktop maupun mobile.

## 🏛️ Arsitektur Aplikasi

SignBridge menggunakan arsitektur klien-server yang efisien:

  * **Frontend (Sisi Klien):**

      * **Framework:** [Next.js](https://nextjs.org/) (React)
      * **Styling:** CSS Murni dengan Variabel CSS
      * **Deteksi Landmark:** [MediaPipe Tasks Vision](https://developers.google.com/mediapipe) dijalankan di browser.
      * **Speech-to-Text:** Menggunakan [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) bawaan browser.
      * **Deployment:** Di-host di [Vercel](https://vercel.com).

  * **Backend (Sisi Server):**

      * **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
      * **Machine Learning:** Menggunakan model `.keras` untuk inferensi pada data landmark dan gambar.
      * **Deployment Lokal:** Dijalankan secara lokal dan diekspos ke internet menggunakan [ngrok](https://ngrok.com).

-----

## 🛠️ Persiapan Lingkungan (Environment Setup)

Sebelum menjalankan proyek, pastikan Anda telah menginstal semua alat yang diperlukan.

### 1\. Conda (untuk Lingkungan Python)

Conda membantu mengelola paket dan lingkungan Python agar tidak saling berkonflik. Direkomendasikan menggunakan **Miniconda** yang lebih ringan.

  * **Download:** [Miniconda Installer](https://docs.conda.io/en/latest/miniconda.html)
  * Ikuti instruksi instalasi untuk sistem operasi Anda.

### 2\. NVM (untuk Node.js & npm)

NVM (Node Version Manager) adalah cara terbaik untuk mengelola versi Node.js.

  * **Untuk Windows:** Download installer dari [nvm-windows](https://github.com/coreybutler/nvm-windows/releases).
  * **Untuk macOS/Linux:** Ikuti instruksi di [nvm-sh](https://github.com/nvm-sh/nvm).
  * Setelah terinstal, buka terminal baru dan jalankan:
    ```bash
    # Menginstal versi LTS (Long-Term Support) terbaru dari Node.js
    nvm install --lts
    # Menggunakan versi yang baru diinstal
    nvm use --lts
    ```

### 3\. ngrok (untuk Tunneling)

`ngrok` digunakan untuk mengekspos server lokal Anda ke internet.

  * **Download:** [ngrok Download Page](https://ngrok.com/download)
  * **Setup:**
    1.  Unzip file yang sudah di-download.
    2.  Pindahkan file `ngrok.exe` ke lokasi permanen (misal: `C:\ProgramFiles\ngrok`).
    3.  Tambahkan lokasi folder tersebut ke **System Environment PATH** Anda (seperti yang pernah kita diskusikan).
    4.  Lakukan autentikasi dengan token dari [dashboard ngrok](https://dashboard.ngrok.com/get-started/your-authtoken) Anda (hanya perlu sekali). Buka terminal dan jalankan:
        ```bash
        ngrok config add-authtoken <TOKEN_ANDA>
        ```

-----

## 🚀 Cara Menjalankan Proyek

Setelah semua persiapan selesai, ikuti langkah ini untuk menjalankan aplikasi.

### 1\. Jalankan Backend (Server FastAPI)

Buka terminal (misal: Terminal 1).

```bash
# Buat dan aktifkan lingkungan Conda baru untuk backend
conda create --name signbridge-py python=3.11 -y
conda activate signbridge-py

# Instal semua dependensi Python
pip install "fastapi[all]" opencv-python tensorflow mediapipe

# Jalankan server dari direktori utama proyek
# Server akan berjalan di http://localhost:8000
python -m uvicorn app:app --reload
```

### 2\. Jalankan Frontend (Aplikasi Next.js)

Buka terminal **baru** (Terminal 2).

```bash
# Masuk ke folder frontend
cd signbridge

# Instal semua dependensi JavaScript
npm install

# Jalankan server pengembangan di port 3001
# Server akan berjalan di http://localhost:3001
npm run dev -- -p 3001
```

### 3\. Hubungkan ke Internet (ngrok)

Buka terminal **baru lagi** (Terminal 3).

1.  **Konfigurasi `ngrok.yml`**: Pastikan Anda memiliki file `ngrok.yml` di `C:\Users\NAMA_ANDA\.ngrok2\` dengan isi:
    ```yaml
    version: "2"
    authtoken: <TOKEN_ANDA>
    tunnels:
      frontend:
        proto: http
        addr: 3001
      backend:
        proto: http
        addr: 8000
    ```
2.  **Jalankan `ngrok`**:
    ```bash
    ngrok start --all
    ```
3.  `ngrok` akan memberikan Anda dua URL publik. Salin URL untuk **backend**.
4.  **Perbarui `page.tsx`**: Masukkan URL backend `ngrok` ke `fetch` atau (lebih baik lagi) ke Environment Variable di Vercel.

Dengan panduan ini, siapa pun yang ingin mencoba proyek Anda seharusnya bisa melakukan setup dari awal hingga aplikasi berjalan dengan lengkap.
