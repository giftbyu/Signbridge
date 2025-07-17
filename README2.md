Proyek Penerjemah Bahasa Isyarat SIBI dan BISINDO
Dokumentasi ini menjelaskan alur kerja lengkap untuk proyek klasifikasi gambar abjad Bahasa Isyarat Indonesia (BISINDO) dan Sistem Isyarat Bahasa Indonesia (SIBI) menggunakan pendekatan hybrid deep learning. Proyek ini mencakup empat tahap utama: pengumpulan dataset, augmentasi data, pelatihan model, dan konversi model untuk penggunaan di perangkat mobile.

Deskripsi Umum
Proyek ini bertujuan untuk membangun dan melatih model deep learning yang mampu mengenali 26 abjad (A-Z) dari bahasa isyarat SIBI dan BISINDO. Model yang digunakan adalah arsitektur hybrid yang menggabungkan:

Convolutional Neural Network (CNN) berbasis EfficientNetB0 untuk mengekstraksi fitur visual dari gambar.

Multi-Layer Perceptron (MLP) untuk mengekstraksi fitur geometris dari landmark (titik-titik kunci) tangan menggunakan MediaPipe.

Kedua fitur ini kemudian digabungkan untuk menghasilkan prediksi akhir, menciptakan model yang lebih akurat dan tangguh.

Arsitektur & Teknologi
Bahasa Pemrograman: Python 3

Library Utama:

TensorFlow & Keras (Untuk membangun dan melatih model)

OpenCV (Untuk pemrosesan gambar dan pengambilan data dari webcam)

MediaPipe (Untuk deteksi dan ekstraksi landmark tangan)

Numpy (Untuk operasi numerik)

Lingkungan:

Visual Studio Code: Untuk menjalankan skrip Python (.py).

Google Colaboratory (Colab): Untuk menjalankan notebook pelatihan model (.ipynb) yang membutuhkan akselerasi GPU.

Alur Kerja Proyek (Workflow)
Proyek ini harus dijalankan dalam urutan berikut untuk hasil yang optimal:

Tahap 1: Pengumpulan Dataset (create_dataset.py)

Menggunakan webcam untuk mengambil gambar setiap isyarat abjad untuk SIBI dan BISINDO.

Tahap 2: Augmentasi Dataset (mirror.py)

(Opsional namun direkomendasikan) Menggandakan jumlah dataset dengan membuat versi cermin (flipped horizontal) dari setiap gambar.

Tahap 3: Preprocessing dan Pelatihan Model (.ipynb)

Menggunakan Google Colab untuk memuat dataset, melakukan preprocessing (ekstraksi landmark), dan melatih model hybrid hingga menghasilkan file .keras.

Tahap 4: Konversi Model ke TFLite (tflite_convert.py)

Mengonversi model .keras yang sudah dilatih menjadi format .tflite yang ringan dan efisien untuk aplikasi mobile atau embedded.

Detail Program dan Instruksi Penggunaan
Berikut adalah penjelasan detail untuk setiap file program.

1. create_dataset.py
Tujuan: Skrip ini berfungsi untuk membuat dataset gambar bahasa isyarat secara otomatis menggunakan webcam. Skrip akan membuat struktur direktori yang diperlukan dan memandu pengguna untuk mengambil gambar setiap abjad.

Lingkungan: Visual Studio Code (atau terminal Python lainnya).

Konfigurasi Utama:

DATA_DIR: Direktori utama tempat dataset akan disimpan (default: ./dataset).

METHODES: Daftar sistem isyarat yang akan dibuatkan datasetnya (default: ['SIBI', 'BISINDO']).

NUM_IMAGES_PER_ALPHABET: Jumlah gambar yang akan diambil untuk setiap abjad (default: 200).

Cara Menjalankan:

Buka terminal atau command prompt di direktori proyek.

Jalankan perintah: python create_dataset.py

Sebuah jendela webcam akan muncul. Skrip akan meminta Anda untuk mempersiapkan isyarat tangan untuk abjad 'A'.

Posisikan tangan Anda di depan kamera, lalu tekan tombol 'S' pada keyboard untuk memulai pengambilan gambar.

Akan ada hitungan mundur 3 detik sebelum pengambilan gambar dimulai.

Skrip akan secara otomatis mengambil 200 gambar. Setelah selesai, proses akan berlanjut untuk abjad 'B', dan seterusnya.

Anda bisa menghentikan proses kapan saja dengan menekan tombol 'Q'.

Output: Struktur direktori seperti di bawah ini, berisi gambar-gambar yang telah diambil.

./dataset/
├── SIBI/
│   ├── A/ (berisi 200 gambar)
│   ├── B/
│   └── ...
└── BISINDO/
    ├── A/
    └── ...
2. mirror.py
Tujuan: Melakukan augmentasi data dengan membuat salinan cermin (flip horizontal) dari setiap gambar dalam dataset. Ini bertujuan untuk meningkatkan variasi data dan membuat model lebih tangguh terhadap variasi orientasi tangan.

Lingkungan: Visual Studio Code (atau terminal Python lainnya).

Konfigurasi Utama:

SOURCE_DATA_DIR: Path ke direktori dataset yang ingin di-augmentasi (default: ./dataset/SIBI). Ubah ke ./dataset/BISINDO jika diperlukan.

OUTPUT_DIR_NAME: Nama direktori baru untuk menyimpan dataset hasil augmentasi (default: ./dataset_augmented_sibi).

Cara Menjalankan:

Pastikan SOURCE_DATA_DIR sudah diatur dengan benar.

Jalankan perintah: python mirror.py

Output: Sebuah direktori baru (misal: ./dataset_augmented_sibi) yang berisi salinan gambar asli dan versi cerminnya (dengan nama file flipped_...). Jumlah gambar di direktori output akan menjadi dua kali lipat dari direktori sumber.

3. Preprocessing_Training.ipynb dan preprocessing_bisindo.ipynb
Tujuan: Notebook ini adalah inti dari proyek, di mana proses preprocessing data dan pelatihan model hybrid dilakukan. Prosesnya meliputi:

Memuat gambar dari dataset.

Menggunakan MediaPipe untuk mendeteksi tangan dan mengekstraksi 42 landmark (koordinat x, y, z) untuk setiap tangan.

Membangun arsitektur model hybrid (EfficientNetB0 + MLP).

Melakukan augmentasi data secara on-the-fly (rotasi, zoom, kontras, dan mirroring).

Melatih model dengan teknik transfer learning dan fine-tuning.

Lingkungan: Google Colaboratory (disarankan menggunakan GPU runtime untuk mempercepat pelatihan).

Konfigurasi Utama:

DATA_DIR: PENTING! Ubah path ini agar sesuai dengan lokasi dataset Anda di Google Drive (misal: /content/drive/MyDrive/dataset/dataset_augmented_sibi).

EPOCHS & FINE_TUNE_EPOCHS: Jumlah epoch untuk training awal dan fine-tuning.

Cara Menjalankan:

Upload dataset Anda (yang sudah di-augmentasi jika menggunakan mirror.py) ke Google Drive Anda.

Buka file .ipynb yang sesuai (satu untuk SIBI, satu untuk BISINDO) di Google Colab.

Jalankan sel pertama untuk menghubungkan Colab dengan Google Drive Anda dan berikan izin akses.

Ubah variabel DATA_DIR di sel konfigurasi.

Jalankan semua sel secara berurutan dari atas ke bawah. Proses pelatihan akan memakan waktu cukup lama.

Output:

Grafik akurasi dan loss selama proses pelatihan.

Sebuah file model yang telah dilatih dengan format .keras (misal: sibi_hybrid_model_v_final.keras), yang tersimpan di Google Drive Anda.

4. tflite_convert.py
Tujuan: Skrip ini mengonversi model .keras yang berat menjadi format TensorFlow Lite (.tflite) yang ringan dan teroptimasi. Model ini cocok untuk diimplementasikan pada aplikasi Android atau perangkat dengan sumber daya terbatas.

Lingkungan: Visual Studio Code (atau terminal Python lainnya).

Konfigurasi Utama:

MODEL_TO_CONVERT: Pilih model mana yang akan dikonversi ('SIBI' atau 'BISINDO').

KERAS_MODEL_PATH: Path lengkap ke file .keras hasil pelatihan.

DATA_DIR: Path ke direktori dataset yang sesuai (digunakan untuk membuat file labels.txt).

TFLITE_OUTPUT_PATH: Nama dan path untuk file .tflite yang akan dihasilkan.

Cara Menjalankan:

Pastikan Anda telah mengunduh file .keras dari Google Drive ke direktori models di proyek lokal Anda.

Atur variabel-variabel di bagian konfigurasi agar sesuai dengan model yang ingin Anda konversi.

Jalankan perintah: python tflite_convert.py

Output:

File model ringan: ./models/sibi_model_lightweight.tflite (atau nama yang sesuai).

File label: ./models/labels.txt, yang berisi daftar nama kelas (A-Z) sesuai urutan yang dipelajari oleh model.

Struktur Direktori Proyek
Struktur direktori yang disarankan untuk proyek ini adalah sebagai berikut:

proyek-bahasa-isyarat/
├── create_dataset.py
├── mirror.py
├── Preprocessing_Training.ipynb
├── preprocessing_bisindo.ipynb
├── tflite_convert.py
├── README.md
│
├── dataset/
│   ├── SIBI/
│   │   ├── A/, B/, ...
│   └── BISINDO/
│       ├── A/, B/, ...
│
├── dataset_augmented_sibi/  (Dihasilkan oleh mirror.py)
│   ├── SIBI/
│   │   ├── A/, B/, ...
│
├── models/
│   ├── sibi_hybrid_model_v_final.keras  (Dihasilkan oleh notebook)
│   ├── bisindo_hybrid_model_v_final.keras (Dihasilkan oleh notebook)
│   ├── sibi_model_lightweight.tflite    (Dihasilkan oleh tflite_convert.py)
│   ├── bisindo_model_lightweight.tflite (Dihasilkan oleh tflite_convert.py)
│   └── labels.txt                       (Dihasilkan oleh tflite_convert.py)
Catatan Tambahan
Dependencies: Pastikan untuk menginstal semua library yang diperlukan sebelum menjalankan skrip. Anda dapat membuat file requirements.txt dan menginstalnya dengan pip install -r requirements.txt. Library utama adalah tensorflow, opencv-python, mediapipe.

Augmentasi: Notebook preprocessing_bisindo.ipynb melakukan augmentasi cermin secara on-the-fly di dalam data_generator, sehingga tidak memerlukan skrip mirror.py secara terpisah. Sementara itu, alur kerja untuk SIBI dalam dokumentasi ini menggunakan mirror.py untuk membuat dataset teraugmentasi terlebih dahulu sebelum dilatih dengan Preprocessing_Training.ipynb. Keduanya adalah pendekatan yang valid.
