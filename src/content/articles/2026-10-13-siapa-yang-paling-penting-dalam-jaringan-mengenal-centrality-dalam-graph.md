---
title: "Siapa yang Paling Penting dalam Jaringan? Mengenal Centrality dalam Graph"
date: 2026-10-13T16:00:00+07:00
summary: "Memahami cara menentukan node paling penting dalam jaringan: perbandingan degree, betweenness, closeness, eigenvector centrality, PageRank, dan Katz centrality, lengkap dengan contoh intuitif dan aplikasinya dalam machine learning."
category: "Artificial Intelligence"
image: "/assets/img/articles/graph-centrality-importance-analysis.jpg"
tags:
  - "Graph Machine Learning"
  - "Graph Theory"
  - "Centrality"
  - "PageRank"
  - "Artificial Intelligence"
  - "Network Science"
series:
  name: "Machine Learning on Graphs"
  part: 4
draft: false
---

Bayangkan kamu berada di sebuah lingkungan yang memiliki banyak kelompok pertemanan.

Ada orang yang mengenal hampir semua orang. Ada orang yang hanya memiliki beberapa teman, tetapi sering menjadi penghubung antara dua kelompok yang berbeda. Ada juga orang yang tidak terlalu populer, tetapi teman-temannya merupakan orang-orang yang sangat berpengaruh.

Menurutmu, siapa yang paling penting dalam jaringan tersebut?

Jawabannya ternyata tidak sesederhana menghitung siapa yang memiliki teman paling banyak.

Seseorang bisa memiliki banyak teman, tetapi tidak terlalu berperan dalam menghubungkan kelompok yang berbeda. Sebaliknya, seseorang yang hanya memiliki sedikit teman bisa menjadi satu-satunya penghubung antara dua kelompok besar.

Dalam analisis graph, kita mengenal konsep yang disebut **centrality** untuk mempelajari persoalan seperti ini.

Pada artikel ini, kita akan membahas bagaimana centrality membantu kita memahami posisi sebuah node dalam jaringan, jenis-jenis pengukurannya, dan kapan masing-masing ukuran bisa digunakan.

---

## 1. Apa Itu Centrality?

Secara sederhana, **centrality** adalah ukuran yang digunakan untuk mengetahui seberapa penting atau menonjol posisi sebuah node dalam suatu jaringan, **berdasarkan kriteria tertentu**.

Kita perlu memperhatikan bagian terakhir dari definisi tersebut: *berdasarkan kriteria tertentu*.

Mengapa? Karena arti penting sebuah node dapat berbeda-beda, bergantung pada pertanyaan yang ingin kita jawab:

- Dalam **jaringan pertemanan**, kita mungkin ingin mengetahui siapa yang memiliki paling banyak teman (*popularitas*).
- Dalam **jaringan transportasi**, kita mungkin ingin mencari kota yang menjadi penghubung berbagai rute (*jembatan transit*).
- Dalam **jaringan web**, kita mungkin ingin mengetahui halaman mana yang memperoleh posisi penting berdasarkan rujukan dari halaman lainnya (*otoritas informasi*).

Meskipun semuanya menggunakan struktur graph, cara menentukan node yang penting tidak harus selalu sama.

Centrality membantu kita mengukur posisi node dengan menggunakan informasi struktur jaringan. Hasilnya bisa digunakan untuk membandingkan node, menemukan titik yang strategis, atau memahami pola hubungan dalam suatu graph.

Namun, perlu diingat bahwa centrality tidak secara otomatis menunjukkan bahwa seseorang atau suatu objek paling penting dalam segala hal. Nilainya hanya menjelaskan kepentingan **berdasarkan ukuran yang digunakan**.

---

## 2. Mari Kita Gunakan Contoh Jaringan yang Sederhana

Agar pembahasan lebih mudah, kita gunakan contoh jaringan pertemanan yang memiliki tujuh orang: **A**, **B**, **C**, **D**, **E**, **F**, dan **G**.

Anggap saja A, B, dan C merupakan satu kelompok pertemanan (Kelompok 1). Sementara itu, E, F, dan G merupakan kelompok pertemanan lainnya (Kelompok 2).

Node **D** berada tepat di antara kedua kelompok tersebut.

Struktur hubungannya adalah:
- Kelompok pertama membentuk segitiga **A–B–C**. Artinya, A berteman dengan B dan C, sedangkan B juga berteman dengan C.
- Node C terhubung dengan D.
- Node D terhubung dengan E.
- Kelompok kedua membentuk segitiga **E–F–G**.

Dengan kata lain, dua kelompok tersebut terhubung melalui jalur **C–D–E**. D menjadi satu-satunya node yang berada tepat di antara kedua kelompok itu.

<figure class="my-8">
  <img src="/assets/img/articles/graph-centrality-concept-comparison.svg" alt="Diagram Analisis Centrality pada Jaringan 7 Node" class="w-full rounded-xl border border-slate-200 dark:border-slate-800" />
  <figcaption class="mt-3 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
    Visualisasi jaringan 7 node (kiri) dan ringkasan pemenang berdasarkan masing-masing metrik centrality (kanan).
  </figcaption>
</figure>

Kita akan menggunakan struktur ini untuk memahami beberapa jenis centrality. 

Mengapa tidak langsung menggunakan jaringan besar? Karena dengan jaringan kecil, kita bisa melihat intuisi di balik setiap ukuran tanpa perlu pusing dengan komputasi yang rumit.

---

## 3. Degree Centrality: Siapa yang Memiliki Paling Banyak Hubungan?

Kita mulai dari ukuran yang paling intuitif dan mudah dipahami, yaitu **degree centrality**.

Degree menunjukkan jumlah edge yang terhubung langsung dengan sebuah node. Dalam jaringan yang tidak berarah (*undirected*), ini sama dengan menghitung jumlah tetangga langsung node tersebut.

Mari kita hitung jumlah hubungan setiap orang pada contoh tadi:

| Node | Siapa Saja Tetangganya? | Degree Langsung | Skor Dinormalisasi ($C_D$) |
| :---: | :--- | :---: | :---: |
| **A** | B, C | 2 | $2 / 6 \approx 0{,}333$ |
| **B** | A, C | 2 | $2 / 6 \approx 0{,}333$ |
| **C** | A, B, D | **3** | **$3 / 6 = 0{,}500$** |
| **D** | C, E | 2 | $2 / 6 \approx 0{,}333$ |
| **E** | D, F, G | **3** | **$3 / 6 = 0{,}500$** |
| **F** | E, G | 2 | $2 / 6 \approx 0{,}333$ |
| **G** | E, F | 2 | $2 / 6 \approx 0{,}333$ |

Dari tabel tersebut, **C** dan **E** memiliki degree paling tinggi, yaitu $3$. Masing-masing terhubung langsung dengan tiga node lain.

Jika tujuan kita adalah mencari siapa yang mempunyai hubungan langsung paling banyak, C dan E adalah pemenangnya.

### Bagaimana Cara Menghitungnya?

Untuk graph tidak berarah sederhana, degree suatu node $v$ dihitung sesederhana:

$$
\text{degree}(v) = \text{jumlah tetangga langsung dari } v
$$

Jadi, untuk node C:

$$
\text{degree}(C) = 3
$$

karena C terhubung langsung dengan A, B, dan D.

Kita juga dapat menghitung degree dalam bentuk yang **dinormalisasi** agar nilainya berada di rentang $[0, 1]$ dan adil dibandingkan pada jaringan dengan jumlah node yang berbeda.

Untuk graph dengan total $n$ node, nilai maksimum koneksi yang bisa dimiliki satu node adalah $n - 1$:

$$
C_D(v) = \frac{\text{degree}(v)}{n - 1}
$$

Karena graph contoh kita mempunyai tujuh node ($n = 7$), nilai normalisasi untuk node C adalah:

$$
C_D(C) = \frac{3}{7 - 1} = \frac{3}{6} = 0{,}5
$$

Artinya, C terhubung dengan $50\%$ dari seluruh kemungkinan tetangga yang ada di jaringan.

### Kapan Degree Centrality Berguna?

Ukuran ini sangat cocok ketika kita ingin mengetahui node mana yang memiliki banyak koneksi langsung:
- Mencari akun media sosial dengan jumlah *followers* terbanyak.
- Menemukan produk yang paling sering dibeli bersamaan (*hub product*).
- Mengidentifikasi server router yang menangani banyak kabel fisik langsung.

Namun, degree centrality tidak menceritakan seluruh posisi sebuah node dalam jaringan. Untuk memahami peran struktural yang lebih dalam, kita memerlukan ukuran berikutnya.

---

## 4. Betweenness Centrality: Siapa yang Menjadi Penghubung?

Sekarang perhatikan node **D**.

Node D hanya terhubung langsung dengan dua orang, yaitu C dan E. Nilai degree-nya ($2$) bahkan lebih rendah dibandingkan C dan E ($3$).

Namun, perhatikan perannya:

> Jika seseorang ingin berpindah dari kelompok A–B–C menuju kelompok E–F–G, jalur tersebut **wajib melewati D**.

Tanpa D, kedua kelompok pertemanan ini akan terputus total menjadi dua pulau yang terisolasi.

Di sinilah kita mulai menyadari bahwa jumlah teman bukan satu-satunya tolok ukur pengaruh. Inilah gagasan utama di balik **Betweenness Centrality**.

Betweenness centrality mengukur seberapa sering sebuah node berada pada **jalur terpendek** (*shortest path*) antara pasangan-pasangan node lainnya dalam jaringan.

Bayangkan kita ingin mencari jalur terpendek dari A menuju F:
$$
A \to C \to D \to E \to F
$$
Node D berada tepat di tengah jalur tersebut. Begitu pula saat mencari rute terpendek dari B menuju G:
$$
B \to C \to D \to E \to G
$$

Dalam contoh kita, terdapat $3 \times 3 = 9$ pasang lintas kelompok (kombinasi satu anggota $\{A, B, C\}$ dengan satu anggota $\{E, F, G\}$). Seluruh rute terpendek di antara sembilan pasangan tersebut harus melintasi D.

Secara formal, betweenness centrality suatu node $v$ dirumuskan sebagai fraksi jalur terpendek yang melewatinya:

$$
C_B(v) = \sum_{s \neq v \neq t} \frac{\sigma_{st}(v)}{\sigma_{st}}
$$

Di mana:
- $\sigma_{st}$ adalah total jumlah jalur terpendek antara node $s$ dan node $t$.
- $\sigma_{st}(v)$ adalah jumlah jalur terpendek antara $s$ dan $t$ yang melewati node $v$.

Itulah sebabnya **D memiliki betweenness centrality paling tinggi di seluruh jaringan**, meskipun hanya mempunyai dua tetangga langsung!

### Mengapa Ukuran Ini Sangat Menarik?

Coba bayangkan D adalah sebuah server gateway komunikasi antara dua kantor cabang, atau jembatan penghubung dua pulau. 

Walaupun hanya memiliki dua kabel koneksi, posisinya sangat strategis (*critical bottleneck*). Jika jembatan D terputus, arus pertukaran informasi antar-wilayah akan lumpuh total.

Dalam dunia nyata:
- **Analisis Organisasi**: Orang dengan betweenness tinggi sering menjadi perantara (*broker*) penting antar-divisi yang jarang berinteraksi.
- **Keamanan Jaringan**: Node dengan betweenness tinggi adalah titik rawan kegagalan (*single point of failure*) yang harus paling dijaga keamanannya.

---

## 5. Closeness Centrality: Siapa yang Paling Dekat dengan Seluruh Node?

Sekarang, mari kita ubah sudut pandang:

> *"Bayangkan kita ingin menyebarkan sebuah kabar atau file penting secepat mungkin ke seluruh anggota jaringan. Siapa orang yang paling cepat menjangkau semua orang melalui rute terpendek?"*

Pertanyaannya bukan lagi siapa yang paling populer (degree) atau siapa yang menjadi jembatan (betweenness), melainkan **siapa yang secara rata-rata memiliki jarak langkah paling pendek ke semua node lain**.

Ukuran ini disebut **Closeness Centrality**.

Closeness centrality dihitung dari kebalikan (*invers*) total jarak jalur terpendek dari satu node ke seluruh node lainnya:

$$
C_C(v) = \frac{n - 1}{\sum_{u \neq v} d(v, u)}
$$

Di mana:
- $n$ adalah jumlah total node dalam jaringan ($n = 7$).
- $d(v, u)$ adalah panjang jarak terpendek (jumlah langkah) dari node $v$ ke node $u$.

Semakin kecil total jaraknya, semakin besar nilai $C_C(v)$, yang berarti node tersebut berada di posisi yang sangat sentral secara geografis/topologi.

### Mencoba Menghitungnya pada Node D dan Node C

Mari kita hitung jarak dari **D** ke 6 node lainnya:
- Ke C: 1 langkah
- Ke E: 1 langkah
- Ke A: 2 langkah (lewat C)
- Ke B: 2 langkah (lewat C)
- Ke F: 2 langkah (lewat E)
- Ke G: 2 langkah (lewat E)

Total jarak langkah node D:
$$
1 + 1 + 2 + 2 + 2 + 2 = 10 \text{ langkah}
$$

Maka nilai Closeness Centrality node D adalah:
$$
C_C(D) = \frac{7 - 1}{10} = \frac{6}{10} = 0{,}6
$$

Sekarang, coba kita bandingkan dengan **node C**:
- Ke A: 1 langkah
- Ke B: 1 langkah
- Ke D: 1 langkah
- Ke E: 2 langkah (lewat D)
- Ke F: 3 langkah (C $\to$ D $\to$ E $\to$ F)
- Ke G: 3 langkah (C $\to$ D $\to$ E $\to$ G)

Total jarak langkah node C:
$$
1 + 1 + 1 + 2 + 3 + 3 = 11 \text{ langkah}
$$

Maka nilai Closeness Centrality node C adalah:
$$
C_C(C) = \frac{6}{11} \approx 0{,}545
$$

Perhatikan hasilnya: **Nilai closeness D ($0{,}6$) lebih tinggi daripada C ($0{,}545$)!**

Meski D hanya berteman dengan 2 orang, posisinya tepat di tengah-tengah jaringan sehingga ia dapat menjangkau seluruh anggota kelompok 1 maupun kelompok 2 dengan rata-rata langkah paling sedikit.

### Kapan Closeness Centrality Berguna?
- Menentukan lokasi gudang distribusi atau rumah sakit agar waktu tanggap ke seluruh penjuru kota paling optimal.
- Memilih juru bicara atau *influencer* awal untuk memulai kampanye pesan agar informasi menyebar dengan waktu transit terpendek.

---

## 6. Eigenvector Centrality: Bagaimana Jika Tetangga Kita Juga Orang Penting?

Sekarang, bayangkan skenario lain:

> Dua orang sama-sama memiliki tiga orang teman. Apakah pengaruh keduanya pasti setara?

Belum tentu!
- Orang pertama berteman dengan 3 orang yang juga merupakan tokoh berpengaruh, pejabat, atau pemimpin komunitas.
- Orang kedua berteman dengan 3 orang yang pendiam dan tidak mengenal siapa-siapa lagi.

**Eigenvector Centrality** berangkat dari gagasan sederhana:

> *"Nilai penting sebuah node bukan hanya ditentukan oleh berapa banyak temannya, tetapi juga oleh seberapa penting teman-teman yang dimilikinya."*

Dengan kata lain, mendapatkan satu koneksi dari orang yang sangat berpengaruh bernilai jauh lebih besar daripada mendapatkan sepuluh koneksi dari akun-akun biasa.

Perhitungannya dilakukan secara berulang (*iteratif*): nilai centrality suatu node merupakan jumlah dari nilai centrality seluruh tetangganya:

$$
x_v = \frac{1}{\lambda} \sum_{u \in \text{Tetangga}(v)} x_u
$$

Di mana $\lambda$ adalah nilai eigen (*eigenvalue*) terbesar dari matriks ketetanggaan graph. Nilai-nilai ini diperbarui terus-menerus sampai mencapai kondisi konvergen yang stabil.

Ukuran ini sangat efektif untuk mengukur prestise sosial, otoritas riset di bidang akademis, atau pengaruh pasar.

---

## 7. PageRank: Mengapa Sebuah Halaman Web Dianggap Penting?

Jika kamu pernah menggunakan Google Search, kamu pasti memanfaatkan algoritma analisis jaringan paling terkenal di dunia: **PageRank**.

PageRank dikembangkan oleh Larry Page dan Sergey Brin untuk menilai otoritas sebuah halaman web berdasarkan struktur tautan (*hyperlink*) yang mengarah kepadanya.

Konsep dasarnya mirip dengan eigenvector centrality, namun disesuaikan untuk karakteristik web yang berarah (*directed graph*):
1. **Tautan sebagai Suara Dukungan**: Jika halaman A menaruh tautan ke halaman B, itu dianggap sebagai satu suara rujukan (*vote*) untuk B.
2. **Kualitas Pemberi Tautan**: Tautan dari situs ternama seperti *Wikipedia* bernilai jauh lebih tinggi daripada tautan dari blog pribadi yang baru dibuat kemarin sore.
3. **Pembagian Bobot Keluar**: Jika sebuah halaman merekomendasikan ratusan tautan ke luar, bobot suara yang ia berikan akan terbagi rata dan mengecil untuk masing-masing tautan tersebut.
4. **Damping Factor ($d$)**: Mengakomodasi perilaku peselancar web acak (*random surfer*) yang terkadang berhenti mengklik tautan dan langsung mengetik alamat baru di bilah peramban.

Dengan mekanisme berulang ini, halaman yang memperoleh tautan dari simpul-simpul berotoritas tinggi akan memperoleh skor PageRank yang tinggi pula.

---

## 8. Mengenal Katz Centrality

Ukuran lain yang sering dibahas adalah **Katz Centrality**.

Katz centrality merupakan perluasan dari eigenvector centrality. Pada eigenvector biasa, jika sebuah node tidak memiliki koneksi masuk dalam graf berarah, nilainya bisa menjadi nol permanen.

Katz centrality mengatasi hal ini dengan menambahkan **skor dasar bawaan** ($\beta$) untuk setiap node:

$$
x_v = \alpha \sum_{u \in \text{Tetangga}(v)} x_u + \beta
$$

Parameter $\alpha$ (faktor redaman) mengontrol seberapa besar pengaruh koneksi jauh, sedangkan $\beta$ menjamin bahwa setiap entitas tetap memiliki nilai eksistensi dasar. Ini sangat berguna ketika menganalisis jaringan sosial di mana setiap individu memiliki pengaruh bawaan di luar jaringan.

---

## 9. Ringkasan Komparatif: Ukuran Mana yang Sebaiknya Dipakai?

Tidak ada satu ukuran centrality yang "paling benar" untuk segala situasi. Setiap metrik menjawab pertanyaan analitik yang berbeda:

| Jenis Centrality | Pertanyaan Kunci yang Dijawab | Kapan Paling Tepat Digunakan? |
| :--- | :--- | :--- |
| **Degree Centrality** | Siapa yang memiliki koneksi langsung paling banyak? | Mencari node populer, hub lokal, atau akun dengan interaksi instan terbanyak. |
| **Betweenness Centrality** | Siapa yang paling sering menjadi jembatan antar-kelompok? | Menemukan perantara (*broker*), titik kritis kemacetan (*bottleneck*), atau simpul rawan kegagalan. |
| **Closeness Centrality** | Siapa yang paling dekat secara rata-rata ke semua node? | Menentukan lokasi fasilitas sentral atau penyebar informasi tercepat. |
| **Eigenvector Centrality** | Siapa yang terhubung dengan node-node berpengaruh lainnya? | Mengukur prestise, otoritas sosial, atau kekuasaan struktural. |
| **PageRank** | Halaman mana yang paling berbobot berdasarkan rujukan berarah? | Analisis web link, sistem peringkat dokumen, atau rekomendasi berbasis referensi. |
| **Katz Centrality** | Bagaimana mengukur pengaruh jaringan dengan tetap memberi nilai dasar? | Jaringan berarah di mana setiap entitas memiliki bobot pengaruh independen. |

Ketika menganalisis graph, mulailah dengan bertanya:

> *"Penting dalam arti apa? Apakah penting karena banyak teman, penting karena menjadi jembatan, atau penting karena dekat dengan semua orang?"*

---

## 10. Apa Hubungan Centrality dengan Machine Learning?

Lalu, bagaimana metrik-metrik di atas dimanfaatkan dalam proyek machine learning modern?

### 1. Sebagai Fitur Masukan (*Graph Feature Engineering*)
<figure class="my-6">
  <img src="/assets/img/articles/graph-centrality-ml-pipeline.svg" alt="Diagram Alur Pemanfaatan Centrality dalam Pipeline Machine Learning" class="w-full rounded-xl border border-slate-200 dark:border-slate-800" />
  <figcaption class="mt-2 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
    Alur kerja ekstraksi metrik centrality sebagai fitur input untuk melatih model klasifikasi machine learning.
  </figcaption>
</figure>

Sebagai contoh: dalam **deteksi penipuan keuangan (*fraud detection*)**, akun *mule* penampung dana sering kali memiliki pola yang sangat khas: degree langsungnya kecil, tetapi betweenness centrality-nya sangat tinggi karena ia menjadi jembatan transfer antara komplotan penipu dan rekening pencairan.

### 2. Membaca Struktur Sebelum Membangun Model Kompleks
Sebelum melangkah ke arsitektur mendalam seperti *Graph Neural Networks* (GNN), menghitung distribusi centrality membantu data scientist memahami apakah graf yang dihadapi memiliki struktur *scale-free*, modular, atau terpolarisasi.

---

## Penutup

Dalam sebuah jaringan, orang yang paling banyak bicara atau memiliki paling banyak teman belum tentu merupakan sosok yang paling berpengaruh.

Kita telah melihat bagaimana **node D**—meski hanya memiliki dua teman—ternyata menjadi tokoh paling penting dalam menjembatani dua kubu besar dan memiliki rata-rata jarak tercepat ke seluruh anggota jaringan.

Centrality memberi kita kacamata matematis yang objektif untuk membedah peran struktural tersebut secara mendalam.

Pada artikel berikutnya dalam seri *Machine Learning on Graphs*, kita akan beralih ke persoalan yang tak kalah menarik: **bagaimana cara komputer mendeteksi kelompok atau komunitas yang terbentuk secara alami di dalam graph?** Kita akan berkenalan dengan konsep **Community Detection** dan algoritma partisi jaringan.
