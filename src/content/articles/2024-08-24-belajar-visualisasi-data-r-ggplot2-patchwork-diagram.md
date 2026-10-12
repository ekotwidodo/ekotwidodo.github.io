---
title: "Belajar Bahasa Pemrograman R: Visualisasi Data dengan Library ggplot2, Patchwork, dan Diagram Lanjutan"
date: 2024-08-24T09:00:00+07:00
summary: "Kuasai ekosistem visualisasi modern di R berbasis Grammar of Graphics: eksplorasi mendalam ggplot2 dari konsep layering geom_*, faceting, custom theme, komposisi multi-plot dengan patchwork, hingga diagram aliran data tingkat lanjut (Sankey & Chord Diagram)."
category: "Data Science"
image: "/assets/img/articles/r-data-visualization-ggplot2.jpg"
tags:
  - "R"
  - "Visualisasi Data"
  - "ggplot2"
  - "Data Science"
  - "Statistika"
  - "Data Analytics"
  - "RStudio"
featured: true
featuredOrder: 8
series:
  name: "Mastering R Programming & Data Visualization"
  part: 4
draft: false
---

Penyajian data (*data visualization*) merupakan jembatan kognitif yang mengemas angka-angka mentah menjadi bentuk visual yang intuitif, persuasif, dan mudah dicerna. Dalam dunia sains data modern, visualisasi yang efektif bukan sekadar mempercantik laporan, melainkan harus memenuhi kaidah analitik yang esensial:
1. **Fokus dan Menarik**: Memikat atensi pemirsa langsung ke pesan inti tanpa distraksi grafis (*chartjunk*).
2. **Jelas dan Presisi**: Menghantarkan informasi secara sederhana, akurat, dan dapat dipertanggungjawabkan secara metodologis.
3. **Bebas Distorsi (*Not Misleading*)**: Proporsi visual dan skala sumbu wajib merefleksikan nilai matematis sebenarnya.
4. **Memfasilitasi Komparasi**: Memudahkan audiens mengevaluasi perbandingan antarkategori maupun tren temporal.
5. **Mendukung Alur Cerita Data**: Mengilustrasikan hipotesis, anomali, serta kesimpulan analitik secara komprehensif.

Jika pada artikel sebelumnya kita telah menguasai sistem grafik dasar (*base graphics*) dengan fungsi `plot()`, kini saatnya kita melompat ke standar industri visualisasi modern di R: **paket `ggplot2`** yang tergabung dalam keluarga besar *Tidyverse*.

---

## 1. Filosofi dan Arsitektur *Grammar of Graphics*

Dikembangkan oleh Hadley Wickham berdasarkan konsep teoritis Leland Wilkinson, `ggplot2` berpijak pada prinsip **The Grammar of Graphics**. Pendekatan ini memandang grafik sebagai susunan lapisan (*layers*) independen yang dirakit secara bertahap menggunakan operator aljabar penjumlahan (`+`):

```r
ggplot(data = dataset, mapping = aes(x = var_x, y = var_y)) +
  geom_tipe_plot() +
  labs(...) +
  theme(...)
```

Tiga pilar utama dalam merancang grafik dengan `ggplot2`:
* **Data & Aesthetic Mapping (`aes()`)**: Menautkan variabel data ke atribut visual kanvas (seperti koordinat sumbu $X$, sumbu $Y$, warna `color`/`fill`, ukuran `size`, dan bentuk simbol `shape`).
* **Geometric Objects (`geom_*`)**: Menentukan manifestasi visual data, misalnya titik (`geom_point`), batang (`geom_bar`), garis (`geom_line`), diagram kotak (`geom_boxplot`), hingga kurva densitas (`geom_violin`).
* **Skala & Tema (`scale_*`, `theme_*`)**: Mengontrol palet warna, tipografi, grid background, dan perataan elemen kanvas.

---

## 2. Persiapan Data Simulasi Keuangan Satker

Untuk melihat ketajaman analitik `ggplot2`, kita akan memanfaatkan studi kasus **data pengelolaan anggaran keuangan di 10 Satuan Kerja (Satker)** yang mencakup 10 jenis kegiatan dan 5 kategori akun belanja negara:

```r
# Reproducibility seed
set.seed(123)

# Membangun data frame simulasi terstruktur (100 observasi)
data_keuangan <- data.frame(
  nama_satker   = rep(paste("Satker", LETTERS[1:10]), each = 10),
  nama_kegiatan = rep(paste("Kegiatan", 1:10), times = 10),
  nama_akun     = rep(paste("Akun", 1:5), times = 20),
  target        = sample(100:500, 100, replace = TRUE)
)

# Menghitung realisasi dan persentase capaian
data_keuangan$realisasi <- data_keuangan$target - sample(-50:50, 100, replace = TRUE)
data_keuangan$persentase_realisasi <- (data_keuangan$realisasi / data_keuangan$target) * 100

# Agregasi data untuk kebutuhan komparasi
agg_data          <- aggregate(cbind(target, realisasi) ~ nama_satker, data = data_keuangan, sum)
agg_data_kegiatan <- aggregate(realisasi ~ nama_kegiatan, data = data_keuangan, sum)
agg_data$selisih  <- agg_data$target - agg_data$realisasi
```

---

## 3. Empat Ragam Visualisasi Fundamental dengan `ggplot2`

### A. Scatter Plot: Korelasi Target vs Realisasi
Scatter plot digunakan untuk mengevaluasi linearitas antara anggaran yang ditargetkan dengan nilai serapan aktual:

```r
library(ggplot2)

scatter_plot <- ggplot(data_keuangan, aes(x = target, y = realisasi)) +
  geom_point(color = "blue", size = 3, alpha = 0.8) +
  labs(
    title = "Scatter Plot Target vs Realisasi",
    x = "Target Anggaran (Juta Rupiah)",
    y = "Realisasi Anggaran (Juta Rupiah)"
  ) +
  theme_minimal()

print(scatter_plot)
```

Berikut adalah hasil render visualisasi scatter plot menggunakan `ggplot2`:

![Scatter Plot Target vs Realisasi](/assets/img/articles/plots/r-ggplot-scatter-target-realisasi.png)

---

### B. Bar Plot: Komparasi Total Serapan per Kegiatan
Untuk membandingkan volume serapan antar-kegiatan, kita gunakan `geom_bar(stat = "identity")` dengan rotasi teks sumbu $X$ agar label tidak saling tumpang tindih:

```r
bar_plot <- ggplot(agg_data_kegiatan, aes(x = nama_kegiatan, y = realisasi)) +
  geom_bar(stat = "identity", fill = "darkgreen", width = 0.65) +
  labs(
    title = "Total Realisasi per Kegiatan",
    x = "Nama Kegiatan",
    y = "Total Realisasi (Juta Rupiah)"
  ) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

print(bar_plot)
```

Berikut tampilan diagram batang yang terstruktur:

![Total Realisasi per Kegiatan](/assets/img/articles/plots/r-ggplot-bar-realisasi-kegiatan.png)

---

### C. Boxplot: Sebaran Realisasi per Jenis Akun Belanja
Boxplot memaparkan ringkasan lima angka statistik (*median*, kuartil, serta pencilan) untuk memeriksa konsistensi serapan di setiap pos akun:

```r
box_plot <- ggplot(data_keuangan, aes(x = nama_akun, y = realisasi)) +
  geom_boxplot(fill = "skyblue", color = "darkblue", outlier.color = "red") +
  labs(
    title = "Distribusi Realisasi per Akun Belanja",
    x = "Kode Akun",
    y = "Nilai Realisasi (Juta Rupiah)"
  ) +
  theme_minimal()

print(box_plot)
```

Hasil render sebaran data per akun belanja:

![Distribusi Realisasi per Akun Belanja](/assets/img/articles/plots/r-ggplot-boxplot-realisasi-akun.png)

---

### D. Bar Plot Horizontal: Evaluasi Deviasi Anggaran per Satker
Dengan mengurutkan kategori berdasarkan besaran selisih (`reorder`), kita mempermudah audiens mengidentifikasi satker mana yang mengalami surplus serapan atau sebaliknya:

```r
bar_plot_horiz <- ggplot(agg_data, aes(x = selisih, y = reorder(nama_satker, selisih))) +
  geom_bar(stat = "identity", fill = "purple", width = 0.6) +
  labs(
    title = "Selisih Target vs Realisasi per Satker",
    x = "Deviasi Anggaran (Juta Rupiah)",
    y = "Nama Satker"
  ) +
  theme_minimal()

print(bar_plot_horiz)
```

Berikut adalah diagram batang horizontal terurut:

![Selisih Target vs Realisasi per Satker](/assets/img/articles/plots/r-ggplot-bar-horizontal-selisih.png)

---

## 4. Komposisi Dashboard Multi-Plot dengan Pustaka `patchwork`

Pada sistem grafik dasar, kita memanfaatkan `par(mfrow)` atau `layout()`. Di ekosistem modern, paket **`patchwork`** menyediakan sintaksis deklaratif yang sangat intuitif dengan operator matematika:
* Operator `+` atau `|` untuk menjejerkan plot secara berdampingan (*horizontal*).
* Operator `/` untuk menumpuk plot secara vertikal (*stacked*).
* `plot_layout()` dan `plot_annotation()` untuk koordinasi tata letak dan judul kanvas utama.

```r
library(patchwork)

# Menggabungkan 4 plot ke dalam komposisi 2 baris x 2 kolom
dashboard <- (scatter_plot + bar_plot) / 
             (box_plot + bar_plot_horiz) +
  plot_annotation(
    title = "Dashboard Eksekutif Monitoring Keuangan Satker APBN",
    subtitle = "Komposisi Multi-Plot Terintegrasi Berbasis ggplot2 & patchwork",
    theme = theme(plot.title = element_text(size = 16, face = "bold", hjust = 0.5))
  )

print(dashboard)
```

Hasil perakitan multi-grafik menggunakan `patchwork`:

![Dashboard Multi-Plot Patchwork](/assets/img/articles/plots/r-ggplot-patchwork-dashboard.png)

Dibandingkan dengan fungsi bawaan `par()`, `patchwork` secara otomatis menyelaraskan margin, sumbu, dan tata letak legenda antargrafik sehingga menghasilkan tampilan publikasi tingkat profesional.

---

## 5. Fitur Visualisasi Tingkat Lanjut di `ggplot2`

### 1. Faceting: Memecah Data Berdasarkan Kategori
Teknik *faceting* (*small multiples*) memecah visualisasi ke dalam kisi-kisi subplot terpisah berdasarkan tingkatan faktor tertentu. Ini adalah teknik terbaik untuk menghindari penumpukan titik (*overplotting*):

```r
# Facet 1 Dimensi menggunakan facet_wrap
faceting_plot <- ggplot(data_keuangan, aes(x = target, y = realisasi)) +
  geom_point(color = "blue", size = 2.5) +
  labs(title = "Target vs Realisasi per Akun Belanja", x = "Target", y = "Realisasi") +
  facet_wrap(~nama_akun, ncol = 5) +
  theme_minimal()

print(faceting_plot)
```

Tampilan komparasi antar-kategori dengan `facet_wrap`:

![Faceting Berdasarkan Akun](/assets/img/articles/plots/r-ggplot-faceting-per-akun.png)

> **Tips Analisis**: Jika Anda ingin memecah data berdasarkan **dua variabel kategorikal sekaligus** (misalnya `Satker` di baris dan `Akun` di kolom), gunakan `facet_grid(nama_satker ~ nama_akun)`.

---

### 2. Matriks Heatmap dengan `geom_tile` dan Pelabelan Nilai
Heatmap sangat efektif untuk memetakan intensitas matriks dua dimensi. Kita memetakan `persentase_realisasi` ke gradasi warna `scale_fill_gradient()` dan menyematkan teks angka dengan `geom_text()`:

```r
heatmap_plot <- ggplot(data_keuangan, aes(x = nama_kegiatan, y = nama_satker, fill = persentase_realisasi)) +
  geom_tile(color = "white") +
  geom_text(aes(label = paste0(round(persentase_realisasi), "%")), color = "white", size = 2.8, fontface = "bold") +
  scale_fill_gradient(low = "#93c5fd", high = "#1e3a8a") +
  labs(
    title = "Heatmap Persentase Capaian per Satker & Kegiatan",
    x = "Kegiatan",
    y = "Satuan Kerja",
    fill = "Capaian (%)"
  ) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

print(heatmap_plot)
```

Visualisasi matriks capaian menggunakan heatmap:

![Heatmap Persentase Realisasi](/assets/img/articles/plots/r-ggplot-heatmap-persentase.png)

---

### 3. Bubble Chart: Menampilkan Tiga Dimensi Sekaligus
Bubble chart memperkaya scatter plot dengan menambahkan variabel ketiga yang dikodekan ke dalam ukuran diameter lingkaran (`size`):

```r
bubble_plot <- ggplot(data_keuangan, aes(x = nama_satker, y = realisasi, size = target, fill = realisasi)) +
  geom_point(shape = 21, color = "black", alpha = 0.8) +
  scale_size(range = c(3, 10)) +
  scale_fill_gradient(low = "#bbf7d0", high = "#15803d") +
  labs(
    title = "Bubble Chart Realisasi per Satker",
    x = "Nama Satker",
    y = "Realisasi (Juta)",
    size = "Target Anggaran",
    fill = "Nilai Serapan"
  ) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

print(bubble_plot)
```

Berikut tampilan grafik gelembung multidimensi:

![Bubble Chart Realisasi per Satker](/assets/img/articles/plots/r-ggplot-bubble-chart.png)

---

### 4. Anotasi Khusus dan Pemodelan Regresi dengan `geom_smooth`
Kita dapat melengkapi grafik analitik dengan garis estimasi tren (`geom_smooth`), garis ambang batas (`geom_hline`), serta kotak penanda teks kustom (`annotate`):

```r
annotation_plot <- ggplot(data_keuangan, aes(x = target, y = realisasi)) +
  geom_point(color = "#2563eb", size = 3, alpha = 0.8) +
  # Garis tren regresi linier dengan pita estimasi
  geom_smooth(method = "lm", color = "#dc2626", linetype = "dashed", se = TRUE) +
  # Garis referensi rata-rata realisasi
  geom_hline(yintercept = mean(data_keuangan$realisasi), color = "#16a34a", linetype = "dotted", linewidth = 1) +
  # Anotasi teks pada titik ekstrem
  annotate("text", x = 250, y = max(data_keuangan$realisasi) - 10, 
           label = "Batas Serapan Maksimum", color = "#dc2626", fontface = "bold") +
  labs(
    title = "Target vs Realisasi dengan Garis Tren & Anotasi",
    x = "Target (Juta Rupiah)",
    y = "Realisasi (Juta Rupiah)"
  ) +
  theme_minimal()

print(annotation_plot)
```

Grafik regresi dengan anotasi eksplisit:

![Anotasi dan Garis Tren Regresi](/assets/img/articles/plots/r-ggplot-regression-annotation.png)

---

### 5. Violin Plot: Inspeksi Kepadatan Distribusi Data
Violin plot memadukan keunggulan boxplot konvensional dengan estimasi kepadatan probabilitas kernel (*kernel density*), memperlihatkan bentuk kurva persebaran data secara kontinu:

```r
violin_plot <- ggplot(data_keuangan, aes(x = nama_akun, y = realisasi, fill = nama_akun)) +
  geom_violin(alpha = 0.7, color = "#334155") +
  geom_boxplot(width = 0.15, fill = "white", outlier.shape = NA) +
  labs(
    title = "Distribusi Realisasi per Akun (Violin Plot)",
    x = "Akun Anggaran",
    y = "Nilai Realisasi (Juta Rupiah)"
  ) +
  theme_minimal() +
  theme(legend.position = "none")

print(violin_plot)
```

Visualisasi sebaran densitas menggunakan violin plot:

![Violin Plot Distribusi Realisasi per Akun](/assets/img/articles/plots/r-ggplot-violin-plot.png)

---

## 6. Diagram Aliran Data Lanjutan: Sankey & Chord Diagram

Ketika kita perlu menyajikan aliran alokasi sumber daya antar-entitas (misalnya: dari **Satker** dialirkan ke **Program Kegiatan**, lalu diserap ke masing-masing **Akun Pengeluaran**), grafik diagram alir menyediakan narasi visual yang sangat kuat.

### A. Diagram Alir Sankey (*Sankey Diagram*)
Sankey diagram menggunakan pita lengkung dengan ketebalan proporsional terhadap besaran nilai yang mengalir:

```r
library(networkD3)

# Membangun simpul relasi (Links) Satker -> Kegiatan dan Kegiatan -> Akun
links <- data.frame(
  source = c(data_keuangan$nama_satker, data_keuangan$nama_kegiatan),
  target = c(data_keuangan$nama_kegiatan, data_keuangan$nama_akun),
  value  = c(data_keuangan$target / 2, data_keuangan$realisasi / 2)
)

# Menghitung indeks node unik
nodes <- data.frame(name = unique(c(links$source, links$target)))
links$source <- match(links$source, nodes$name) - 1
links$target <- match(links$target, nodes$name) - 1

# Render Sankey interaktif dengan networkD3
sankeyNetwork(
  Links = links, Nodes = nodes,
  Source = "source", Target = "target", Value = "value",
  NodeID = "name", units = "Juta", fontSize = 12, nodeWidth = 30
)
```

Berikut ilustrasi pemodelan aliran alokasi dana menggunakan konsep diagram Sankey:

![Diagram Aliran Anggaran Keuangan Sankey](/assets/img/articles/plots/r-ggplot-sankey-chord-diagram.png)

### B. Diagram Hubungan Melingkar (*Chord Diagram*)
Untuk data relasi multi-arah, paket `circlize` di R memungkinkan pembuatan diagram akord melingkar yang memperlihatkan intensitas keterkaitan antar-sektor:

```r
library(circlize)

# Membangun matriks relasi tabulasi silang
matriks_relasi <- xtabs(target ~ nama_satker + nama_kegiatan, data = data_keuangan)

# Render diagram akord melingkar
chordDiagram(
  matriks_relasi, 
  transparency = 0.4, 
  annotationTrack = "grid", 
  preAllocateTracks = 1
)
```

Berikut adalah hasil render visualisasi hubungan melingkar antarsektor menggunakan Chord Diagram:

![Diagram Sirkular Hubungan Satker dan Kegiatan (Chord Diagram)](/assets/img/articles/plots/r-ggplot-chord-diagram.png)

---

## 7. Ekspor Grafik untuk Publikasi dengan `ggsave()`

Salah satu keunggulan terbesar `ggplot2` adalah kemudahan menyimpan grafik ke berkas fisik dengan dimensi fisik dan resolusi DPI yang terukur secara presisi:

```r
# Menyimpan grafik terakhir atau objek plot tertentu
ggsave(
  filename = "output_laporan_keuangan.png",
  plot = dashboard,
  width = 12,
  height = 8,
  units = "in",
  dpi = 300 # Standar industri untuk cetak berkualitas tinggi (High DPI)
)

# Menyimpan ke format dokumen vektor PDF
ggsave(
  filename = "grafik_vektor_resmi.pdf",
  plot = heatmap_plot,
  width = 10,
  height = 7
)
```

---

## 8. Ringkasan Panduan Sintaksis `ggplot2`

| Kebutuhan Visual | Fungsi / Layer `ggplot2` | Contoh Kasus Penggunaan |
|---|---|---|
| **Titik & Sebaran** | `geom_point()`, `geom_jitter()` | Scatter plot korelasi, bubble chart multidimensi |
| **Batang & Frekuensi** | `geom_bar()`, `geom_col()` | Perbandingan capaian, ranking kategori diskret |
| **Distribusi Statistik** | `geom_boxplot()`, `geom_violin()` | Deteksi outlier, perbandingan kuartil & densitas probabilitas |
| **Matriks Dua Dimensi** | `geom_tile()` | Heatmap korelasi, kalender aktivitas, peta matriks capaian |
| **Tren & Estimasi** | `geom_line()`, `geom_smooth()` | Deret waktu, garis regresi linear & nonlinear beserta pita error |
| **Subplot Kisi-kisi** | `facet_wrap()`, `facet_grid()` | Komparasi multi-panel terpisah antarkategori data |
| **Komposisi Multi-Plot** | Pustaka `patchwork` (`+`, `/`, `\|`) | Perakitan dashboard terintegrasi berstandar publikasi |
| **Ekspor Berkas Fisik** | `ggsave(filename, width, height, dpi)` | Menyimpan ke gambar raster PNG atau vektor PDF resolusi tinggi |

Dengan menguasai arsitektur *Grammar of Graphics* pada `ggplot2` serta dukungan pustaka pelengkap seperti `patchwork`, Anda kini mampu mentransformasikan data tabular mentah menjadi visualisasi analitik yang komunikatif, estetis, dan profesional.
