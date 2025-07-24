# SignBridge: Penerjemah Bahasa Isyarat Real-time (Fullstack & Machine Learning)

Selamat datang di **SignBridge**, sebuah aplikasi web inovatif yang dirancang untuk menjembatani kesenjangan komunikasi antara komunitas Tuli dan masyarakat luas. Proyek ini menyediakan terjemahan bahasa isyarat Indonesia (**SIBI & BISINDO**) dan suara secara *real-time* menggunakan arsitektur modern dan model *deep learning* yang canggih.

Dokumentasi ini mencakup seluruh siklus hidup proyek: mulai dari pengumpulan data dan pelatihan model *machine learning*, hingga menjalankan aplikasi web secara lengkap.

### Daftar Isi
1.  [✨ Fitur Utama](#-fitur-utama)
2.  [🏛️ Arsitektur Keseluruhan](#️-arsitektur-keseluruhan)
    - [Arsitektur Aplikasi (Klien-Server)](#arsitektur-aplikasi-klien-server)
    - [Arsitektur Model Machine Learning (Hybrid)](#arsitektur-model-machine-learning-hybrid)
3.  [🗂️ Struktur Direktori Proyek](#️-struktur-direktori-proyek)
4.  [🚀 Panduan Lengkap](#-panduan-lengkap)
    - [Bagian 1: Pembuatan Model Machine Learning (Dari Awal)](#bagian-1-pembuatan-model-machine-learning-dari-awal)
    - [Bagian 2: Menjalankan Aplikasi Web SignBridge](#bagian-2-menjalankan-aplikasi-web-signbridge)
5.  [💻 Teknologi yang Digunakan](#-teknologi-yang-digunakan)

-----

## ✨ Fitur Utama

  - **Deteksi Isyarat Real-time**: Menerjemahkan gerakan tangan dari kamera menjadi teks secara langsung.
  - **Dukungan Multi-Model**: Pilihan antara model deteksi **SIBI** (1 tangan) atau **BISINDO** (2 tangan).
  - **Arsitektur Hybrid**: Menggabungkan **CNN (EfficientNetB0)** untuk fitur visual dan **MLP** untuk fitur geometris landmark tangan, menghasilkan model yang akurat dan *robust*.
  - **Visualisasi Landmark**: Umpan balik visual instan dengan menggambar kerangka tangan di atas video.
  - **Speech-to-Text**: Fitur pengenalan suara untuk mentranskripsi ucapan menjadi teks.
  - **Saran Kata Cerdas**: Memberikan saran kata dinamis dari kamus berdasarkan huruf yang terdeteksi.
  - **Pengaturan Kamera**: Kontrol *real-time* untuk kecerahan, kontras, dan efek *blur* pada video.
  - **Desain Responsif**: Antarmuka yang bersih dan modern untuk desktop maupun *mobile*.
  - **Siap untuk Deployment**: Model dapat dikonversi ke format **TensorFlow Lite (.tflite)** untuk integrasi pada aplikasi *mobile*.

## 🏛️ Arsitektur Keseluruhan

Proyek ini terdiri dari dua komponen utama yang saling terhubung: aplikasi web dan model machine learning yang menjadi otaknya.

### Arsitektur Aplikasi (Klien-Server)

SignBridge menggunakan arsitektur klien-server yang efisien:

  * **Frontend (Sisi Klien):**

      * **Framework:** Next.js (React)
      * **Deteksi Landmark:** MediaPipe Tasks Vision (dijalankan di *browser*)
      * **Speech-to-Text:** Web Speech API bawaan *browser*
      * **Deployment:** Vercel

  * **Backend (Sisi Server):**

      * **Framework:** FastAPI (Python)
      * **Machine Learning:** Menggunakan model `.keras` yang telah dilatih untuk inferensi pada data *landmark* dan gambar.
      * **Deployment Lokal:** Dijalankan secara lokal dan diekspos ke internet menggunakan `ngrok`.

### Arsitektur Model Machine Learning (Hybrid)

Model ini dibangun dengan arsitektur dua cabang untuk mencapai akurasi tinggi:

1.  **Cabang Visual (CNN)**: Menggunakan **EfficientNetB0** (*transfer learning*) untuk mengekstraksi fitur kompleks seperti bentuk, tekstur, dan orientasi tangan dari gambar.
2.  **Cabang Landmark (MLP)**: Menggunakan **MediaPipe Hands** untuk mendeteksi 21 titik kunci (landmark) tangan. Koordinat ini dinormalisasi dan diumpankan ke *Multi-Layer Perceptron* (MLP) untuk memahami struktur geometris dan postur jari.

Fitur dari kedua cabang ini kemudian digabungkan dan dimasukkan ke dalam *layer classifier* akhir untuk memprediksi abjad yang diisyaratkan.

## 🗂️ Struktur Direktori Proyek

Untuk kelancaran, atur proyek Anda dengan struktur direktori yang disarankan berikut:

```
signbridge-proyek/
│
├── frontend/                   # Proyek Next.js (Aplikasi Klien)
│   ├── app/
│   ├── package.json
│   └── ...
│
├── backend/                    # Proyek FastAPI (Server)
│   ├── app.py                  # Logika utama server FastAPI
│   ├── models/                 # Tempat menyimpan model terlatih
│   │   ├── sibi_hybrid_model.keras
│   │   └── bisindo_hybrid_model.keras
│   └── requirements.txt
│
└── machine_learning/           # Skrip & notebook untuk membuat model
    ├── create_dataset.py       # Skrip untuk mengumpulkan data gambar
    ├── mirror.py               # Skrip untuk augmentasi cermin
    ├── Preprocessing_Training.ipynb # Notebook untuk melatih model
    ├── tflite_convert.py       # Skrip untuk konversi ke TFLite
    │
    ├── dataset/                # Dihasilkan oleh create_dataset.py
    └── dataset_augmented/      # Dihasilkan oleh mirror.py

```

-----

## 🚀 Panduan Lengkap

Ikuti panduan ini secara berurutan. Bagian 1 adalah untuk membuat model dari nol, sedangkan Bagian 2 adalah untuk menjalankan aplikasi web yang sudah jadi (dengan asumsi model sudah tersedia).

### Bagian 1: Pembuatan Model Machine Learning (Dari Awal)

Tahapan ini berfokus pada pengumpulan data dan pelatihan model. Jalankan skrip dari dalam folder `machine_learning/`.

**Pra-Instalasi (Machine Learning):**

```bash
# Pastikan Python 3.8+ terinstal
pip install tensorflow opencv-python mediapipe
```

**Tahap 1.1: Pengumpulan Dataset (`create_dataset.py`)**

  * **Tujuan**: Mengambil gambar isyarat tangan dari webcam.
  * **Eksekusi**:
    ```bash
    python create_dataset.py
    ```
    Ikuti instruksi di jendela webcam. Tekan **'S'** untuk mulai merekam dan **'Q'** untuk berhenti.

**Tahap 1.2: Augmentasi Dataset (`mirror.py`)**

  * **Tujuan**: Menggandakan dataset dengan mencerminkan gambar untuk meningkatkan performa model.
  * **Eksekusi**:
    ```bash
    python mirror.py
    ```

**Tahap 1.3: Pelatihan Model (`Preprocessing_Training.ipynb`)**

  * **Lingkungan**: **Google Colaboratory** (Gunakan GPU Runtime).
  * **Tujuan**: Memproses data, mengekstrak fitur, dan melatih model hybrid.
  * **Langkah**:
    1.  Buka notebook `.ipynb` di Google Colab.
    2.  Unggah folder dataset Anda (misal, `dataset_augmented`) ke Google Drive.
    3.  Jalankan sel untuk **Mount Google Drive**.
    4.  **Penting**: Ubah path `DATA_DIR` di dalam notebook agar menunjuk ke lokasi dataset Anda di Google Drive.
    5.  Jalankan semua sel secara berurutan.
  * **Hasil**: Sebuah file model `.keras` (misal: `sibi_hybrid_model.keras`) yang tersimpan di Google Drive Anda.

**Tahap 1.4: (Opsional) Konversi ke TFLite (`tflite_convert.py`)**

  * **Tujuan**: Mengecilkan ukuran model `.keras` untuk inferensi cepat di perangkat mobile.
  * **Langkah**: Unduh file `.keras` dari Drive. Sesuaikan path di dalam skrip, lalu jalankan:
    ```bash
    python tflite_convert.py
    ```

-----

### Bagian 2: Menjalankan Aplikasi Web SignBridge

Tahapan ini menjelaskan cara menjalankan frontend dan backend aplikasi.

**Pra-Instalasi (Aplikasi Web):**

1.  **Conda (Lingkungan Python)**: Direkomendasikan menggunakan [Miniconda](https://docs.conda.io/en/latest/miniconda.html) untuk mengelola lingkungan backend.

2.  **NVM (Node.js & npm)**: Gunakan [NVM](https://github.com/nvm-sh/nvm) untuk mengelola versi Node.js.

    ```bash
    nvm install --lts
    nvm use --lts
    ```

3.  **ngrok (Tunneling)**: Gunakan [ngrok](https://ngrok.com/download) untuk mengekspos server lokal ke internet. Lakukan otentikasi dengan token dari *dashboard* Anda.

    ```bash
    ngrok config add-authtoken <TOKEN_ANDA>
    ```

**Tahap 2.1: Jalankan Backend (Server FastAPI)**

> **PENTING**: Salin file model `.keras` yang telah Anda latih (dari Bagian 1) ke dalam folder `backend/models/`.

Buka terminal baru:

```bash
# Masuk ke direktori backend
cd backend

# Buat dan aktifkan lingkungan Conda
conda create --name signbridge-py python=3.11 -y
conda activate signbridge-py

# Instal dependensi Python
pip install "fastapi[all]" opencv-python tensorflow mediapipe

# Jalankan server di http://localhost:8000
python -m uvicorn app:app --reload
```

**Tahap 2.2: Jalankan Frontend (Aplikasi Next.js)**

Buka terminal **baru**:

```bash
# Masuk ke direktori frontend
cd frontend

# Instal dependensi JavaScript
npm install

# Jalankan server pengembangan di http://localhost:3001
npm run dev -- -p 3001
```

**Tahap 2.3: Hubungkan ke Internet (ngrok)**

Buka terminal **baru lagi**:

```bash
# Jalankan ngrok untuk mengekspos port 8000 (backend)
ngrok http 8000
```

`ngrok` akan memberikan Anda sebuah URL publik (misal: `https://<random-string>.ngrok-free.app`). Salin URL ini dan masukkan ke dalam kode frontend (di `page.tsx`) sebagai alamat API backend agar aplikasi dapat berkomunikasi dengan server.

-----

## 💻 Teknologi yang Digunakan

  - **Frontend**: Next.js, React, CSS Murni, MediaPipe Tasks Vision, Web Speech API
  - **Backend**: FastAPI, Python
  - **Machine Learning**: TensorFlow, Keras, EfficientNetB0, Scikit-learn, OpenCV
  - **Lingkungan & Tools**: Conda, NVM, Google Colab, Git
  - **Deployment**: Vercel (Frontend), ngrok (Tunneling Lokal)
