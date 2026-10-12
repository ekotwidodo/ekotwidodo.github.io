---
title: "Belajar Bahasa Pemrograman R: Visualisasi Data dengan Plot, Barplot, dan Multiplot Layout"
date: 2024-08-23T09:00:00+07:00
summary: "Pelajari seni visualisasi data menggunakan sistem grafik dasar (base graphics) di R: eksplorasi mendalam fungsi plot(), barplot(), pie(), hist(), boxplot(), hingga perancangan dashboard multi-plot 2x2 dengan studi kasus nyata."
category: "Data Science"
image: "/assets/img/articles/r-data-visualization-plots.jpg"
tags:
  - "R"
  - "Visualisasi Data"
  - "Data Science"
  - "Statistika"
  - "Data Analytics"
  - "RStudio"
featured: true
featuredOrder: 9
series:
  name: "Mastering R Programming & Data Visualization"
  part: 3
draft: false
---

Visualisasi data (*data visualization*) bukan sekadar membubuhkan warna-warni pada angka mentah. Visualisasi adalah jembatan kognitif yang mengubah barisan data abstrak menjadi pola, tren, anomali, dan cerita yang dapat dipahami seketika oleh manusia.

Dalam praktiknya, penyajian data grafis yang baik wajib memenuhi beberapa kriteria esensial:
1. **Menarik dan Jelas**: Menarik fokus pemirsa ke pesan utama tanpa distraksi ornamen yang tidak perlu.
2. **Akurat dan Tidak Menyesatkan (*Not Misleading*)**: Skala sumbu dan proporsi area harus mencerminkan nilai data yang sebenarnya.
3. **Memfasilitasi Komparasi**: Memudahkan pemirsa membandingkan antar-kategori atau perubahan seiring waktu.
4. **Mendukung Narasi Analitik**: Menjadi bukti visual yang memperkuat kesimpulan dalam laporan ilmiah atau bisnis.

Di dalam ekosistem bahasa R, sebelum kita melangkah ke pustaka tingkat tinggi seperti `ggplot2`, sistem grafis bawaan R (**Base Graphics Engine**) telah menyediakan fondasi visualisasi yang luar biasa tangguh, ringan, dan cepat melalui fungsi serbaguna `plot()`. 

Panduan ini membahas tuntas cara merancang grafik analitik dasar di R beserta teknik kustomisasi dan penyusunan multi-grafik dalam satu kanvas.

---

## 1. Anatomi dan Parameter Kunci Fungsi `plot()`

Fungsi `plot()` adalah fungsi polimorfik dasar di R untuk merender grafik 2 dimensi. Perilaku grafik dapat disesuaikan menggunakan parameter terstandarisasi:

```r
plot(x, y, type = "p", main = "Judul Utama", xlab = "Label X", ylab = "Label Y", ...)
```

* `x` & `y`: Vektor data numerik untuk koordinat sumbu horizontal dan vertikal.
* `type`: Menentukan bentuk visualisasi:
  * `"p"`: Titik atau *point* (standar untuk *scatter plot*).
  * `"l"`: Garis bersambung (*line plot*).
  * `"b"`: Kombinasi titik dan garis (*both points and lines*).
  * `"o"`: Garis dan titik yang saling bertumpuk (*overplotted*).
  * `"h"`: Garis vertikal tegak (*histogram-like vertical lines*).
  * `"s"`: Tangga berundak (*stair steps*).
* `main`, `sub`: Judul utama dan subjudul grafik.
* `xlab`, `ylab`: Label deskripsi sumbu $X$ dan sumbu $Y$.
* `pch` (*plotting character*): Simbol titik (kode angka $0$ sampai $25$).
* `col`: Warna elemen visual (nama warna string atau kode heksadesimal).
* `cex` (*character expansion*): Faktor perbesaran ukuran simbol (default $1$, $1.5$ berarti $150\%$).
* `lwd` (*line width*): Ketebalan garis plot.
* `lty` (*line type*): Pola garis ($1$ solid, $2$ dashed, $3$ dotted, dst).

---

## 2. Scatter Plot: Membedah Hubungan Antar-Variabel

Scatter plot adalah pilihan utama saat kita ingin menginvestigasi korelasi atau distribusi spasial antara dua variabel numerik kontinu.

```r
# Data deret pengamatan
x <- 1:10
y <- c(2, 3, 5, 7, 11, 13, 17, 19, 23, 29)

# Scatter plot dengan simbol lingkaran padat (pch = 19) berwarna biru
plot(x, y, 
     main = "Scatter Plot Dasar", 
     xlab = "Indeks Pengamatan (X)", 
     ylab = "Nilai Keluaran (Y)", 
     pch = 19, 
     col = "blue")
grid(col = "gray85")
```

Berikut adalah hasil render visualisasi dari kode di atas:

![Scatter Plot Dasar di R](/assets/img/articles/plots/r-plot-scatter-basic.png)

### Menyesuaikan Ukuran Titik (`cex`) dan Bentuk Simbol (`pch`)
Kita dapat mengeksplorasi variasi simbol dari rentang `pch = 0` hingga `pch = 25`. Simbol `21` hingga `25` bahkan mendukung pemisahan warna garis tepi (`col`) dan warna isian bagian dalam (`bg`):

```r
plot(1:10, 
     main = "Kustomisasi Simbol & Ukuran Titik", 
     xlab = "Sumbu X", 
     ylab = "Sumbu Y",
     col = "darkred", 
     cex = 2,      # Ukuran 2 kali lebih besar
     pch = 25      # Segitiga terbalik terisi
)
```

---

## 3. Line Plot: Menganalisis Tren Data Runtun Waktu

Saat data mencerminkan urutan waktu, dinamika harga saham, atau pertumbuhan fisik, kita mengubah tipe grafik menjadi garis (`type = "l"` atau `type = "b"`):

```r
# Plot Garis Tunggal
plot(x, y, 
     type = "l", 
     main = "Line Plot Tren Data", 
     xlab = "Waktu / Tahapan", 
     ylab = "Nilai Metrik", 
     col = "red", 
     lwd = 2.5)

# Menambahkan lapisan garis kedua menggunakan lines()
lines(x, y + 4, col = "blue", lwd = 2, lty = 2)

# Menambahkan lapisan titik pengamatan dengan points()
points(x, y + 4, col = "blue", pch = 17, cex = 1.3)
```

Di R, fungsi `lines()` dan `points()` adalah fungsi tingkat rendah (*low-level plotting functions*) yang berfungsi **menambahkan elemen baru ke atas grafik yang sudah ada**, tanpa menghapus atau membuat ulang jendela kanvas.

![Perbandingan Line Plot dan Garis Gabungan di R](/assets/img/articles/plots/r-plot-line-types.png)

---

## 4. Studi Kasus Komparasi: Scatter Plot Multi-Kelompok

Misalkan kita mengamati hubungan antara **usia kendaraan** dan **kecepatan maksimum** pada dua hari pengujian yang berbeda:

```r
# Hari pertama (12 unit kendaraan)
usia_h1 <- c(5, 7, 8, 7, 2, 2, 9, 4, 11, 12, 9, 6)
kec_h1  <- c(99, 86, 87, 88, 111, 103, 87, 94, 78, 77, 85, 86)

# Hari kedua (15 unit kendaraan)
usia_h2 <- c(2, 2, 8, 1, 15, 8, 12, 9, 7, 3, 11, 4, 7, 14, 12)
kec_h2  <- c(100, 105, 84, 105, 90, 99, 90, 95, 94, 100, 79, 112, 91, 80, 85)

# Render kelompok pertama
plot(usia_h1, kec_h1,
     main = "Pengamatan Mobil: Usia vs Kecepatan",
     xlab = "Usia Kendaraan (Tahun)",
     ylab = "Kecepatan Maksimum (km/jam)",
     col = "red",
     pch = 19,
     cex = 1.5,
     xlim = c(0, 16),
     ylim = c(70, 120))

# Tambahkan kelompok kedua ke kanvas yang sama
points(usia_h2, kec_h2,
       col = "blue",
       pch = 19,
       cex = 1.5)

# Tambahkan legenda penjelas
legend("topright", 
       legend = c("Pengamatan Hari 1", "Pengamatan Hari 2"),
       col = c("red", "blue"), 
       pch = 19)
```

![Scatter Plot Komparasi Kendaraan di R](/assets/img/articles/plots/r-plot-cars-comparison.png)

---

## 5. Diagram Batang (*Bar Plot*)

Diagram batang sangat efektif untuk membandingkan besaran nilai diskret atau frekuensi antar-kategori. Di R, kita menggunakan fungsi `barplot()`:

```r
# Data frekuensi jumlah gigi transmisi (gear) pada dataset klasik mtcars
data(mtcars)
tabel_gear <- table(mtcars$gear)

# Render diagram batang frekuensi
barplot(tabel_gear, 
        main = "Frekuensi Jumlah Gear pada mtcars", 
        xlab = "Jumlah Gear", 
        ylab = "Jumlah Mobil", 
        col = c("cyan", "deepskyblue", "teal"),
        border = "black")
```

Parameter fleksibel pada `barplot()`:
* `horiz = TRUE`: Mengubah diagram menjadi horizontal.
* `width`: Mengatur lebar batang secara proporsional.
* `beside = TRUE`: Menampilkan batang berdampingan saat menyajikan data matriks multi-kelompok.

![Contoh Diagram Batang Dasar dan Frekuensi Gear mtcars](/assets/img/articles/plots/r-plot-barplot-gear.png)

---

## 6. Diagram Lingkaran (*Pie Chart*)

Pie chart memvisualisasikan proporsi persentase dari keseluruhan ($100\%$). Meskipun dalam literatur statistika modern diagram batang sering lebih dianjurkan daripada diagram lingkaran, pie chart tetap bermanfaat untuk data dengan sedikit kategori:

```r
proporsi_buah <- c(10, 20, 30, 40)
label_buah <- c("Apel", "Pisang", "Semangka", "Kurma")
warna_buah <- c("#38bdf8", "#fbbf24", "#34d399", "#f87171")

pie(proporsi_buah, 
    labels = paste(label_buah, paste0(proporsi_buah, "%")), 
    main = "Proporsi Inventaris Buah-buahan", 
    col = warna_buah, 
    init.angle = 90)

legend("bottomright", legend = label_buah, fill = warna_buah, cex = 0.8)
```

![Pie Chart Proporsi Kategori di R](/assets/img/articles/plots/r-plot-pie-chart.png)

---

## 7. Histogram dan Boxplot: Memahami Distribusi Data

Ketika kita perlu memeriksa bentuk sebaran data numerik (apakah simetris berdistribusi normal, condong miring/skewed, atau memiliki pencilan), dua alat grafis yang wajib dipakai adalah **Histogram** dan **Boxplot**.

### Histogram (`hist`)
Histogram membagi rentang nilai numerik ke dalam wadah (*bins*) dan menghitung frekuensi kemunculannya:

```r
set.seed(42)
data_normal <- rnorm(200, mean = 50, sd = 10)

hist(data_normal, 
     main = "Histogram Distribusi Nilai (rnorm)", 
     xlab = "Nilai Pengukuran", 
     ylab = "Frekuensi", 
     col = "lightblue", 
     border = "black")
```

### Boxplot (`boxplot`)
Boxplot (*diagram kotak garis*) menampilkan ringkasan lima angka statistik (*Five-Number Summary*): nilai minimum, kuartil bawah ($Q_1$), median ($Q_2$), kuartil atas ($Q_3$), nilai maksimum, serta mendeteksi pencilan (*outliers*):

```r
boxplot(mtcars$mpg, 
        main = "Boxplot Efisiensi Bahan Bakar (MPG)", 
        ylab = "Miles Per Gallon (mpg)", 
        col = "orange",
        border = "darkred")
```

![Histogram Distribusi dan Boxplot MPG di R](/assets/img/articles/plots/r-plot-hist-boxplot.png)

---

## 8. Multi-Plot Grid: Merangkum Analisis dalam 1 Jendela dengan `par()`

Dalam analisis data komprehensif, menampilkan satu grafik saja sering kali tidak cukup. R menyediakan fungsi `par(mfrow = c(baris, kolom))` untuk membagi area grafis menjadi kisi-kisi (*grid layout*).

### Studi Kasus: Analisis Eksploratif Dataset `mtcars`
Kita ingin menyusun dashboard 2 baris $\times$ 2 kolom yang memadukan empat sudut pandang analitik sekaligus:

1. **Scatter Plot (HP vs MPG)**: Hubungan daya mesin dengan konsumsi bahan bakar, dilengkapi garis tren regresi `abline()`.
2. **Boxplot (MPG by Cylinders)**: Membandingkan efisiensi bahan bakar berdasarkan kelompok jumlah silinder ($4$, $6$, dan $8$ silinder).
3. **Histogram (Distribusi Horsepower)**: Sebaran kekuatan mesin mobil secara agregat.
4. **Diagram Batang (Distribusi Transmisi)**: Proporsi mobil bertransmisi otomatis vs manual.

```r
# Membagi jendela grafik menjadi 2 baris x 2 kolom
par(mfrow = c(2, 2), mar = c(4, 4, 3, 1), oma = c(0, 0, 2, 0))

# 1. Scatter Plot dengan Garis Regresi
plot(mtcars$hp, mtcars$mpg,
     main = "HP vs MPG (Scatter & Regresi)",
     xlab = "Horsepower (HP)",
     ylab = "Miles Per Gallon (MPG)",
     pch = 19,
     col = "darkblue")
abline(lm(mpg ~ hp, data = mtcars), col = "red", lwd = 2)

# 2. Boxplot Distribusi Berdasarkan Kategori
boxplot(mpg ~ cyl, data = mtcars,
        main = "MPG Berdasarkan Jumlah Silinder",
        xlab = "Jumlah Silinder",
        ylab = "MPG",
        col = c("lightgreen", "lightblue", "lightpink"))

# 3. Histogram
hist(mtcars$hp,
     main = "Distribusi Horsepower (Histogram)",
     xlab = "Horsepower (HP)",
     ylab = "Frekuensi",
     col = "lightgray",
     border = "black")

# 4. Diagram Batang Transmisi
barplot(table(mtcars$am),
        main = "Jumlah Mobil Berdasarkan Transmisi",
        xlab = "Jenis Transmisi",
        ylab = "Jumlah Unit",
        col = c("orange", "purple"),
        names.arg = c("Automatic (0)", "Manual (1)"))

# Memberikan judul utama di atas seluruh kanvas
mtext("Analisis Komprehensif Dataset mtcars", outer = TRUE, cex = 1.3, font = 2)

# Kembalikan pengaturan kanvas ke default 1x1
par(mfrow = c(1, 1))
```

Berikut adalah output render dashboard 2x2 dari skrip analisis di atas:

![Multi-Plot 2x2 Analisis Dataset mtcars](/assets/img/articles/plots/r-plot-mtcars-multiplot.png)

---

## 9. Studi Kasus Lanjutan: Dashboard Monitoring Realisasi Keuangan Satker

Untuk melihat penerapan praktis di lingkungan kerja nyata (seperti monitoring anggaran APBN pada satuan kerja pemerintah), mari kita buat visualisasi terintegrasi 4 kuadran:

```r
# Simulasi Data Target dan Realisasi Anggaran pada Satker
set.seed(123)
satker <- paste("Satker", LETTERS[1:8])
target <- c(320, 410, 290, 480, 360, 430, 270, 390)
realisasi <- target - c(20, -15, 35, 10, -25, 40, -10, 15)
selisih <- target - realisasi

# Mengatur tata letak 2x2
par(mfrow = c(2, 2), mar = c(4.5, 4.5, 2.5, 1), oma = c(0, 0, 2, 0))

# Kuadran 1: Bar Plot Perbandingan Target vs Realisasi
barplot(rbind(target, realisasi),
        beside = TRUE,
        names.arg = satker,
        col = c("deepskyblue", "darkorange"),
        main = "Perbandingan Target vs Realisasi per Satker",
        ylab = "Nilai (Juta Rupiah)",
        las = 2)
legend("topright", legend = c("Target", "Realisasi"), fill = c("deepskyblue", "darkorange"))

# Kuadran 2: Total Realisasi per Sub-Kegiatan
kegiatan <- paste("Keg.", 1:8)
realisasi_keg <- c(340, 290, 410, 380, 260, 440, 310, 350)
barplot(realisasi_keg,
        names.arg = kegiatan,
        col = "mediumseagreen",
        main = "Total Realisasi per Kegiatan",
        ylab = "Realisasi (Juta Rupiah)",
        las = 2)

# Kuadran 3: Distribusi Belanja per Akun Mata Anggaran (Boxplot)
akun_data <- list(
  Akun_51 = rnorm(20, 320, 25),
  Akun_52 = rnorm(20, 380, 30),
  Akun_53 = rnorm(20, 290, 20)
)
boxplot(akun_data,
        col = "dodgerblue",
        main = "Distribusi Realisasi per Jenis Akun Belanja",
        ylab = "Realisasi (Juta Rupiah)")

# Kuadran 4: Selisih Deviasi Anggaran (Horizontal Bar)
barplot(selisih,
        names.arg = satker,
        horiz = TRUE,
        col = ifelse(selisih < 0, "crimson", "forestgreen"),
        main = "Deviasi Anggaran (Target - Realisasi)",
        xlab = "Selisih (Juta Rupiah)",
        las = 1)
abline(v = 0, lwd = 1.5)

mtext("Dashboard Monitoring Eksekutif Keuangan Satker APBN", outer = TRUE, cex = 1.3, font = 2)
par(mfrow = c(1, 1))
```

Hasil render visualisasi analisis keuangan:

![Dashboard Multi-Plot Analisis Keuangan Satker APBN](/assets/img/articles/plots/r-plot-keuangan-multiplot.png)

---

## 10. Mengekspor Grafik ke Format Berkas Gambar & PDF

Setelah grafik selesai dirancang, langkah terakhir adalah menyimpannya ke dalam berkas beresolusi tinggi untuk disematkan dalam laporan atau presentasi:

```r
# Menyimpan ke berkas gambar PNG resolusi tinggi
png("laporan_analisis_kinerja.png", width = 1200, height = 900, res = 150)
plot(target, realisasi, 
     main = "Korelasi Target dan Realisasi", 
     xlab = "Target Anggaran", 
     ylab = "Realisasi", 
     pch = 19, col = "navy")
abline(a = 0, b = 1, lty = 2, col = "red") # Garis referensi 100%
dev.off() # Menutup graphic device untuk merilis berkas ke disk

# Menyimpan ke dokumen vektor PDF (kualitas cetak sempurna tanpa pikselasi)
pdf("laporan_vektor_resmi.pdf", width = 10, height = 7.5)
# ... jalankan skrip plot Anda di sini ...
dev.off()
```

---

## 11. Ringkasan Sintaksis Grafik Dasar R

| Tipe Grafik | Fungsi R | Contoh Penggunaan Kunci |
|---|---|---|
| **Scatter Plot** | `plot(x, y)` | Pola hubungan dua variabel numerik kontinu |
| **Line Plot** | `plot(x, y, type = "l")` | Tren deret waktu, laju pertumbuhan |
| **Diagram Batang** | `barplot(vektor/tabel)` | Perbandingan diskret antarkelompok atau frekuensi |
| **Histogram** | `hist(vektor_numerik)` | Bentuk kurva frekuensi dan simetri distribusi |
| **Boxplot** | `boxplot(y ~ grup)` | Evaluasi kuartil, median, dan pendeteksian pencilan (*outliers*) |
| **Multi-Plot Kanvas** | `par(mfrow = c(r, c))` | Menggabungkan kisi-kisi grafik analitik dalam satu tampilan |
| **Ekspor Berkas** | `png(...)` / `pdf(...)` | Menyimpan grafik visual ke media penyimpanan permanen |

Dengan menguasai grafik dasar di R, Anda memiliki perkakas visualisasi instan yang selalu siap sedia kapan pun Anda membutuhkan eksplorasi data cepat (*Exploratory Data Analysis*) tanpa ketergantungan pada pustaka pihak ketiga.
