# 🤟 Penerjemah Bahasa Isyarat SIBI & BISINDO

Selamat datang di Proyek Penerjemah Bahasa Isyarat Indonesia\! Proyek ini adalah implementasi *deep learning* untuk mengenali dan menerjemahkan abjad dari dua sistem bahasa isyarat utama di Indonesia: **SIBI** (Sistem Isyarat Bahasa Indonesia) dan **BISINDO** (Bahasa Isyarat Indonesia).

Tujuan utamanya adalah membangun sebuah model yang akurat dan efisien, yang dapat menjadi jembatan komunikasi antara komunitas Tuli dan masyarakat luas.

-----

### Daftar Isi

1.  [Deskripsi Proyek](https://www.google.com/search?q=%23deskripsi-proyek)
2.  [Fitur Utama](https://www.google.com/search?q=%23fitur-utama)
3.  [Arsitektur Model & Teknologi](https://www.google.com/search?q=%23arsitektur-model--teknologi)
4.  [Struktur Direktori](https://www.google.com/search?q=%23struktur-direktori)
5.  [Panduan Instalasi & Penggunaan](https://www.google.com/search?q=%23panduan-instalasi--penggunaan)
      - [Tahap 1: Pengumpulan Dataset](https://www.google.com/search?q=%23tahap-1-pengumpulan-dataset-create_datasetpy)
      - [Tahap 2: Augmentasi Dataset](https://www.google.com/search?q=%23tahap-2-augmentasi-dataset-mirrorpy)
      - [Tahap 3: Pelatihan Model](https://www.google.com/search?q=%23tahap-3-preprocessing-dan-pelatihan-model-ipynb)
      - [Tahap 4: Konversi ke TFLite](https://www.google.com/search?q=%23tahap-4-konversi-model-ke-tflite-tflite_convertpy)
6.  [Catatan Tambahan](https://www.google.com/search?q=%23catatan-tambahan)

-----

## Deskripsi Proyek

Proyek ini menggunakan pendekatan **hybrid deep learning** untuk mengenali 26 isyarat abjad (A-Z) SIBI dan BISINDO dari gambar. Dengan menggabungkan analisis fitur visual (bentuk dan tekstur tangan) melalui **CNN** dan analisis fitur geometris (posisi jari-jari) melalui **MLP** dengan data *landmark* dari MediaPipe, model ini mencapai tingkat akurasi yang lebih tinggi dibandingkan jika hanya menggunakan satu jenis fitur.

## Fitur Utama

  - **Dukungan Ganda**: Mampu mengenali abjad dari SIBI dan BISINDO.
  - **Arsitektur Hybrid**: Menggabungkan **EfficientNetB0** untuk fitur visual dan **MLP** untuk fitur landmark tangan, menghasilkan model yang robust.
  - **Pengumpulan Data Terpandu**: Skrip interaktif untuk mengumpulkan dataset gambar secara sistematis menggunakan webcam.
  - **Augmentasi Data**: Termasuk skrip untuk augmentasi cermin (*mirroring*) guna memperkaya variasi data dan meningkatkan generalisasi model.
  - **Pelatihan Efisien**: Menggunakan Google Colab dengan akselerasi GPU untuk proses training dan *fine-tuning* yang cepat.
  - **Siap untuk Deployment**: Model akhir dioptimalkan dan dikonversi ke format **TensorFlow Lite (.tflite)**, membuatnya siap untuk diintegrasikan ke dalam aplikasi mobile (Android/iOS).

## Arsitektur Model & Teknologi

Model ini dibangun dengan arsitektur dua cabang yang bekerja secara paralel:

1.  **Cabang Visual (CNN)**:

      - Menggunakan **EfficientNetB0** yang telah dilatih sebelumnya pada dataset ImageNet.
      - Model ini bertugas mengekstraksi fitur-fitur kompleks seperti bentuk, tekstur, dan orientasi tangan dari gambar input.
      - Teknik *transfer learning* dan *fine-tuning* diterapkan untuk menyesuaikan model dengan dataset bahasa isyarat.

2.  **Cabang Landmark (MLP)**:

      - Menggunakan **MediaPipe Hands** untuk mendeteksi 21 titik kunci (landmark) pada setiap tangan.
      - Koordinat (x, y, z) dari landmark ini dinormalisasi dan dijadikan input untuk jaringan Multi-Layer Perceptron (MLP).
      - Cabang ini fokus pada pemahaman struktur geometris dan postur jari-jari tangan.

Fitur dari kedua cabang ini kemudian digabungkan (*concatenate*) dan dimasukkan ke dalam lapisan *classifier* akhir untuk menghasilkan prediksi abjad.

-----

## Struktur Direktori

Pastikan Anda mengatur direktori proyek seperti di bawah ini untuk kelancaran eksekusi semua skrip.

```
proyek-bahasa-isyarat/
│
├── create_dataset.py           # Skrip untuk mengumpulkan data
├── mirror.py                   # Skrip untuk augmentasi cermin
├── Preprocessing_Training.ipynb  # Notebook untuk pelatihan model SIBI
├── preprocessing_bisindo.ipynb   # Notebook untuk pelatihan model BISINDO
├── tflite_convert.py           # Skrip untuk konversi ke TFLite
├── README.md                   # Dokumentasi ini
│
├── dataset/                    # Dihasilkan oleh create_dataset.py
│   ├── SIBI/
│   │   ├── A/, B/, ...
│   └── BISINDO/
│       ├── A/, B/, ...
│
├── dataset_augmented_sibi/     # Dihasilkan oleh mirror.py
│   └── SIBI/
│       ├── A/, B/, ...
│
└── models/                     # Tempat menyimpan model
    ├── sibi_hybrid_model_v_final.keras
    ├── bisindo_hybrid_model_v_final.keras
    ├── sibi_model_lightweight.tflite
    ├── bisindo_model_lightweight.tflite
    └── labels.txt
```

-----

## Panduan Instalasi & Penggunaan

Ikuti langkah-langkah di bawah ini secara berurutan.

### Pra-Instalasi

1.  **Clone Repository** (Jika ada):
    ```bash
    git clone <URL_REPOSITORY_ANDA>
    cd proyek-bahasa-isyarat
    ```
2.  **Instalasi Dependencies**: Pastikan Anda memiliki Python 3.8+ terinstal.
    ```bash
    pip install tensorflow opencv-python mediapipe
    ```

### Tahap 1: Pengumpulan Dataset (`create_dataset.py`)

> 실행 환경: **Visual Studio Code**

  * **Tujuan**: Mengambil gambar isyarat tangan dari webcam untuk membuat dataset mentah.
  * **Konfigurasi**: Anda bisa mengubah variabel berikut di dalam skrip:
      - `DATA_DIR`: Folder utama untuk menyimpan dataset.
      - `METHODES`: Sistem isyarat yang akan direkam (`['SIBI', 'BISINDO']`).
      - `NUM_IMAGES_PER_ALPHABET`: Jumlah gambar per abjad.
  * **Eksekusi**:
    ```bash
    python create_dataset.py
    ```
      - Ikuti instruksi yang muncul di jendela webcam. Tekan **'S'** untuk mulai merekam setiap abjad dan **'Q'** untuk berhenti.

### Tahap 2: Augmentasi Dataset (`mirror.py`)

> **Visual Studio Code**

  * **Tujuan**: Menggandakan dataset SIBI dengan mencerminkan gambar secara horizontal untuk meningkatkan performa model.
  * **Konfigurasi**: Sesuaikan variabel ini jika perlu:
      - `SOURCE_DATA_DIR`: Dataset sumber yang akan di-augmentasi.
      - `OUTPUT_DIR_NAME`: Folder baru untuk hasil augmentasi.
  * **Eksekusi**:
    ```bash
    python mirror.py
    ```

### Tahap 3: Preprocessing dan Pelatihan Model (`.ipynb`)

> 実行環境: **Google Colaboratory (Gunakan GPU Runtime)**

  * **Tujuan**: Memproses data mentah, mengekstrak fitur, dan melatih model hybrid hingga siap digunakan.
  * **Eksekusi**:
    1.  Buka `Preprocessing_Training.ipynb` (untuk SIBI) atau `preprocessing_bisindo.ipynb` (untuk BISINDO) di Google Colab.
    2.  Unggah folder dataset Anda (misalnya, `dataset_augmented_sibi`) ke Google Drive.
    3.  Jalankan sel kode untuk **Mount Google Drive**.
    4.  **Sangat Penting**: Ubah path pada variabel `DATA_DIR` agar menunjuk ke lokasi dataset Anda di Google Drive.
        ```python
        # Contoh
        DATA_DIR = '/content/drive/MyDrive/Skripsi/dataset/SIBI_augmentend' # Untuk SIBI
        DATA_DIR = '/content/drive/MyDrive/Skripsi/dataset/dataset_augmented/BISINDO' # Untuk BISINDO
        ```
    5.  Jalankan semua sel secara berurutan. Proses ini akan melakukan:
          - Membuat `data_generator` yang memuat gambar dan mengekstrak landmark MediaPipe.
          - Membangun arsitektur model hybrid.
          - Melatih *classifier* terlebih dahulu, kemudian melakukan *fine-tuning* pada beberapa lapisan EfficientNetB0 untuk akurasi yang lebih baik.
  * **Hasil**: File model `.keras` yang tersimpan di Google Drive, misalnya `sibi_hybrid_model_v_final.keras`.

### Tahap 4: Konversi Model ke TFLite (`tflite_convert.py`)

> 실행 환경: **Visual Studio Code**

  * **Tujuan**: Mengecilkan ukuran model `.keras` dan mengoptimalkannya untuk inferensi cepat di perangkat mobile.
  * **Konfigurasi**: Sebelum menjalankan, pastikan untuk mengatur:
      - `MODEL_TO_CONVERT`: Pilih antara `'SIBI'` atau `'BISINDO'`.
      - `KERAS_MODEL_PATH`: Sesuaikan dengan nama file `.keras` yang telah Anda latih dan unduh.
      - `TFLITE_OUTPUT_PATH`: Nama file keluaran `.tflite`.
  * **Eksekusi**:
    ```bash
    python tflite_convert.py
    ```
  * **Hasil**:
      - File `sibi_model_lightweight.tflite` atau `bisindo_model_lightweight.tflite` di dalam folder `models`.
      - File `labels.txt` yang berisi urutan kelas (A-Z).

-----

## Catatan Tambahan

  - **Perbedaan Augmentasi**: Perlu dicatat bahwa untuk dataset SIBI, augmentasi dilakukan secara *offline* menggunakan `mirror.py`. Sementara untuk BISINDO, augmentasi cermin dilakukan secara *on-the-fly* (langsung saat pelatihan) di dalam notebook `preprocessing_bisindo.ipynb`.
  - **Pengembangan Lanjutan**: Model `.tflite` yang dihasilkan dapat langsung diintegrasikan ke dalam aplikasi Android menggunakan TensorFlow Lite Interpreter. File `labels.txt` sangat penting untuk memetakan output numerik dari model kembali ke label abjad yang dapat dibaca manusia.
