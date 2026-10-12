---
title: "Mengenal Graph: Node, Edge, dan Berbagai Jenis Hubungan"
date: 2026-10-12T14:15:00+07:00
summary: "Memahami fondasi struktur graph: konsep node dan edge, perbedaan directed vs undirected, weighted, keterhubungan jaringan, hingga bipartite dan projected graph untuk machine learning."
category: "Artificial Intelligence"
image: "/assets/img/articles/types-of-graphs-fundamentals.jpg"
tags:
  - "Graph Machine Learning"
  - "Graph Theory"
  - "Data Science"
  - "Artificial Intelligence"
  - "Bipartite Graph"
  - "Network Science"
series:
  name: "Machine Learning on Graphs"
  part: 2
draft: false
---

Pada artikel sebelumnya, kita sudah berkenalan dengan *machine learning on graphs* dan memahami gagasan dasarnya: data tidak selalu cukup dipahami dari karakteristik masing-masing objek secara terisolasi. Sering kali, jalinan hubungan antarobjek justru menyimpan wawasan analitik yang paling krusial.

Kita juga sempat melihat analogi sederhana berupa jejaring pertemanan. Setiap orang digambarkan sebagai sebuah titik, kemudian garis ditarik untuk menunjukkan siapa yang terhubung dengan siapa.

Sekarang, mari kita melangkah lebih dalam: bagaimana sebenarnya sebuah graph dibentuk, apa saja variasi jenisnya, dan mengapa perbedaan karakteristik ini sangat berpengaruh saat kita ingin mengolahnya dengan algoritma machine learning?

Tenang saja, kita tidak akan langsung terburu-buru dengan rumus matematis yang rumit. Kita akan membedah konsepnya tahap demi tahap dari sudut pandang yang paling intuitif.

---

## 1. Mengenal Dua Komponen Utama: Node dan Edge

Secara mendasar, graph tersusun dari dua elemen pembangun utama: **node** dan **edge**.

<div class="my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <span class="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Elemen 1</span>
      <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 mb-2">Node (Vertex)</h3>
      <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        Objek atau entitas individu yang ingin kita amati. Node merepresentasikan benda, orang, lokasi, dokumen, akun, molekul, atau apa pun yang menjadi fokus analisis kita.
      </p>
    </div>
    <div>
      <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Elemen 2</span>
      <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 mb-2">Edge (Link)</h3>
      <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        Garis relasi atau interaksi yang menghubungkan satu node dengan node lainnya. Edge membawa makna kontekstual mengenai bagaimana dua entitas saling berinteraksi.
      </p>
    </div>
  </div>
</div>

### Objek Nyata di Balik Node dan Edge

Wujud fisik dari node dan edge sepenuhnya bergantung pada domain permasalahan yang sedang kita hadapi:

* **Jejaring Sosial**: Node adalah pengguna (*user*), sedangkan edge adalah status pertemanan, hubungan keluarga, atau langganan (*following*).
* **Sistem Transportasi & Logistik**: Node adalah kota atau gudang distribusi, sedangkan edge adalah jalan tol, rute penerbangan, atau jalur rel kereta.
* **Infrastruktur Jaringan Komputer**: Node adalah server, router, atau perangkat komputer, sedangkan edge adalah kabel LAN atau koneksi nirkabel aktif.
* **Bioinformatika & Farmasi**: Node adalah atom penyusun senyawa, sedangkan edge adalah ikatan kimia kovalen antaratom.

Bayangkan contoh tiga sekawan: **Rina**, **Dodi**, dan **Sari**. Rina berteman dengan Dodi, lalu Dodi berteman dengan Sari:

```text
Rina ───── Dodi ───── Sari
```

Pada ilustrasi di atas, ada tiga buah node (Rina, Dodi, Sari) dan dua buah edge (penghubung Rina–Dodi dan penghubung Dodi–Sari).

Perhatikan satu detail penting: **Rina dan Sari tidak terhubung langsung**. Meskipun demikian, keduanya tidak benar-benar terputus; informasi atau pengaruh dari Rina masih bisa sampai ke Sari dengan melalui Dodi sebagai perantara. 

Struktur sederhana ini sudah membuktikan bahwa graph bukan sekadar tumpukan data acak. Letak dan susunan jalinan antarobjek membawa makna yang sangat kaya.

---

## 2. Directed Graph vs. Undirected Graph

Setelah memahami node dan edge, kita akan menjumpai fakta bahwa sifat hubungan di dunia nyata tidak selalu simetris. Salah satu pembeda paling fundamental adalah **apakah hubungan tersebut memiliki arah atau tidak**.

<figure class="my-8">
  <img src="/assets/img/articles/graph-types-characteristics-comparison.svg" alt="Ilustrasi Taksonomi Karakteristik Graph: Undirected vs Directed, Unweighted vs Weighted, dan Connected vs Disconnected" class="w-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm" />
  <figcaption class="mt-3 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
    Tiga dimensi klasifikasi graph: arah aliran relasi (kiri), bobot kuantitatif (tengah), dan keterhubungan komponen jaringan (kanan).
  </figcaption>
</figure>

### Undirected Graph: Hubungan Simetris Tanpa Arah

Pada **undirected graph**, garis edge tidak memiliki tanda panah. Relasi berlaku setara dari kedua belah pihak secara dua arah.

```text
Rina ───── Dodi
```

Jika Rina berteman dengan Dodi di dunia nyata (atau Facebook zaman awal), maka secara otomatis Dodi juga berteman dengan Rina. Garis tersebut dibaca sama persis, baik saat kita memandangnya dari sudut pandang Rina maupun dari sisi Dodi.

Contoh lainnya:
* Jalan raya dua arah antarkota.
* Hubungan kolaborasi rekan kerja dalam satu proyek kantor.
* Ikatan kimia antaratom dalam molekul air ($H_2O$).

### Directed Graph (Digraph): Hubungan yang Memiliki Arah

Sebaliknya, pada **directed graph**, setiap edge memiliki orientasi tertentu yang biasanya digambarkan dengan tanda panah. Relasi ini membedakan secara tegas antara pihak *sumber* (*source*) dan pihak *tujuan* (*target*).

Misalnya di media sosial seperti Instagram, X (Twitter), atau GitHub: Rina mengikuti (*follows*) akun Dodi.

```text
Rina ─────► Dodi
```

Panah dari Rina ke Dodi menegaskan bahwa Rina adalah pihak yang mengikuti konten Dodi. Apakah Dodi otomatis mengikuti Rina balik (*follow back*)? Tentu tidak selalu. 

Jika kelak Dodi memutuskan untuk mengikuti akun Rina juga, kita merepresentasikannya sebagai dua buah edge berlawanan:

```text
Rina ─────► Dodi
Rina ◄───── Dodi
```

Contoh penerapan directed graph yang sangat vital lainnya adalah **transaksi keuangan perbankan**. Jika rekening Rina mengirim dana Rp 500.000 ke rekening Dodi, arah panah dari Rina ke Dodi menunjukkan siapa pengirim dan siapa penerima dana. Membalik arah panah akan mengubah total siapa yang kehilangan saldo dan siapa yang menerima uang!

Dalam machine learning, membedakan graf berarah dan tak berarah sangat krusial karena derajat koneksi (*in-degree* vs. *out-degree*) menghasilkan informasi perilaku yang bertolak belakang.

---

## 3. Unweighted Graph vs. Weighted Graph

Pertanyaan berikutnya: apakah garis hubungan kita hanya bertugas mencatat ada/tidaknya relasi, ataukah garis tersebut juga menyimpan nilai numerik tertentu?

### Unweighted Graph: Biner (Ada atau Tidak)

Pada **unweighted graph**, setiap edge hanya berfungsi sebagai penanda eksistensi biner (nilai $1$ jika terhubung, $0$ jika tidak ada relasi).

```text
Kota A ───── Kota B ───── Kota C
```

Dari diagram rute di atas, kita tahu bahwa Kota A terhubung ke Kota B, dan Kota B terhubung ke Kota C. Namun, informasi yang kita miliki berhenti di sana; kita belum tahu berapa kilometer jarak tempuhnya atau berapa jam waktu perjalanannya.

### Weighted Graph: Membawa Nilai Tambahan (Bobot)

Pada **weighted graph**, setiap edge disematkan sebuah nilai numerik yang disebut **weight** (bobot). Bobot inilah yang memperkaya konteks analisis kita:

```text
Kota A ───[ 10 km ]─── Kota B ───[ 5 km ]─── Kota C
```

Di sini, angka $10\text{ km}$ dan $5\text{ km}$ adalah bobot edge. 

Perlu digarisbawahi bahwa **makna bobot sangat fleksibel dan bergantung pada tujuan kasus kita**:
* **Jarak / Biaya / Latensi Jaringan**: Nilai bobot yang lebih *kecil* biasanya lebih diinginkan (karena rute lebih pendek atau biaya lebih murah).
* **Frekuensi Interaksi / Kedekatan Sosial / Kapasitas Jalur**: Nilai bobot yang lebih *besar* biasanya menandakan hubungan yang jauh lebih kuat atau kapasitas yang lebih tinggi.

Jika model machine learning kita bertugas memprediksi jalur distribusi barang tercepat atau mendeteksi kelompok pertemanan terdekat, mengabaikan bobot bisa membuat rekomendasi yang dihasilkan melenceng jauh dari kondisi optimal.

---

## 4. Connected Graph vs. Disconnected Graph

Sekarang bayangkan kamu mengamati sebuah jaringan besar. Apakah seluruh node di dalam jaringan tersebut dijamin bisa saling menjangkau?

Belum tentu. Di sinilah konsep **keterhubungan** (*connectivity*) masuk.

### Connected Graph: Satu Jaringan Utuh

Pada graph tak berarah, sebuah graph disebut **connected** jika kita selalu bisa menemukan lintasan (*path*) untuk berpindah dari satu node ke node mana pun di dalam jaringan.

```text
A ───── B ───── C
        │
        D ───── E
```

Walaupun node A tidak terhubung langsung ke node E, A tetap dapat menjangkau E dengan melewati rangkaian node B dan D ($A \to B \to D \to E$). Seluruh entitas berada di dalam satu ekosistem jaringan yang utuh.

### Disconnected Graph: Ada Pulau-Pulau yang Terisolasi

Sekarang perhatikan kondisi jika jalur antara B dan D terputus:

```text
A ───── B ───── C


D ───── E
```

Di sini, kelompok $\{A, B, C\}$ sama sekali tidak memiliki jembatan komunikasi ke kelompok $\{D, E\}$. Graph ini disebut **disconnected graph**.

Masing-masing kelompok yang saling terhubung di dalamnya disebut sebagai **connected component**. Pada contoh di atas, terdapat 2 komponen terpisah.

Mengapa pemahaman ini penting di dunia nyata?
* **Jaringan Komunikasi Kantor**: Jika kantor cabang terputus dari kantor pusat, informasi gagal mengalir.
* **Deteksi Komunitas**: Di media sosial, connected components sering kali mencerminkan lingkaran pertemanan atau kelompok hobi yang berdiri sendiri secara organik.

---

## 5. Mengenal Bipartite Graph dan Projected Graph

Semua contoh yang kita diskusikan sebelumnya menempatkan node pada jenis entitas yang seragam (sama-sama orang, atau sama-sama kota). Namun di banyak skenario nyata, kita berurusan dengan **dua kelompok objek yang sifatnya berbeda**.

Struktur semacam ini disebut **Bipartite Graph**.

<figure class="my-8">
  <img src="/assets/img/articles/graph-bipartite-and-projection.svg" alt="Diagram Bipartite Graph Mahasiswa dan Mata Kuliah beserta Projected Graph" class="w-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm" />
  <figcaption class="mt-3 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
    Panel A: Bipartite Graph yang memisahkan entitas Mahasiswa dan Mata Kuliah. Panel B: Projected Graph yang menautkan sesama mahasiswa berdasarkan kesamaan mata kuliah yang diambil.
  </figcaption>
</figure>

Dalam bipartite graph, himpunan node dipartisi menjadi dua kelompok terpisah (misalnya kelompok $U$ dan kelompok $V$). Aturan utamanya: **edge hanya boleh menghubungkan node dari kelompok yang berbeda**, dan tidak pernah ada edge di antara node dalam kelompok yang sama.

Mari gunakan contoh konkret perkuliahan di kampus:
* **Kelompok Mahasiswa**: Rina, Dodi, Sari.
* **Kelompok Mata Kuliah**: Basis Data, Machine Learning.

Hubungannya terjalin sebagai berikut:
* Rina mengambil mata kuliah Basis Data dan Machine Learning.
* Dodi mengambil mata kuliah Basis Data.
* Sari mengambil mata kuliah Machine Learning.

Perhatikan bahwa Rina tidak dihubungkan langsung ke Dodi, dan Basis Data tidak dihubungkan langsung ke Machine Learning. Relasi yang tercatat murni hubungan antar-entitas: *Mahasiswa mengambil Mata Kuliah*.

Pola bipartite graph ini sangat lazim kita temui di industri:
* **E-Commerce**: Pengguna $\longleftrightarrow$ Produk yang dibeli.
* **Platform Streaming**: Penonton $\longleftrightarrow$ Film yang ditonton.
* **Akademik**: Peneliti $\longleftrightarrow$ Makalah yang dipublikasikan.

### Mengubah Sudut Pandang Lewat Projected Graph

Kerap kali, kita ingin memprediksi relasi antarsesama objek dalam satu kelompok berdasarkan kesamaan keterikatan mereka dengan kelompok lain. Misalnya: *"Mahasiswa mana yang berpotensi menjadi teman belajar karena sering mengambil kelas yang sama?"*

Untuk menjawabnya, kita melakukan operasi **proyeksi graph** (*projected graph*):
1. **Rina dan Dodi** sama-sama mengambil *Basis Data* $\to$ buat edge antara Rina dan Dodi.
2. **Rina dan Sari** sama-sama mengambil *Machine Learning* $\to$ buat edge antara Rina dan Sari.
3. **Dodi dan Sari** tidak memiliki kelas bersama $\to$ tidak ada edge di antara mereka.

Hasil proyeksi menghasilkan relasi antarmahasiswa yang kini siap diproses oleh algoritma social recommendation. Konsep proyeksi inilah yang menjadi salah satu fondasi dasar di balik algoritma *collaborative filtering* pada sistem rekomendasi modern!

---

## 6. Satu Graph Bisa Memiliki Berbagai Karakteristik Sekaligus

Satu hal yang perlu diingat: label-label di atas bukanlah kategori yang saling meniadakan (*mutually exclusive*). Sebuah graph di dunia nyata hampir selalu memadukan beberapa karakteristik sekaligus.

Sebagai contoh:
* **Jaringan Penerbangan Maskapai**: Merupakan **directed graph** (jadwal penerbangan berangkat pagi dari Jakarta ke Bali tidak otomatis sama dengan jadwal kembali sore), sekaligus **weighted** (bobot berupa durasi terbang atau harga tiket pesawat), dan bisa saja **disconnected** jika ada pulau perintis yang rutenya sedang ditutup.
* **Jaringan Transfer Uang Antarrekening**: Merupakan **directed graph** (arah panah aliran uang), **weighted** (nominal transfer rupiah), dan **bipartite** jika kita memisahkan antara rekening nasabah individu dan merchant pembayaran.

Jadi, tujuan kita bukan sekadar menghafal label sebanyak-banyaknya, melainkan **memilih representasi yang paling akurat sesuai karakteristik domain masalah yang hendak kita selesaikan**.

---

## 7. Mengapa Memahami Jenis Graph Begitu Krusial untuk Machine Learning?

Mungkin timbul pertanyaan: *"Bukankah saat dimasukkan ke dalam program komputer, semuanya sama-sama kumpulan angka dan titik? Mengapa kita harus repot-repot membedakan jenisnya?"*

Jawabannya: **asumsi struktur yang keliru di awal akan merusak representasi fitur yang dipelajari oleh model machine learning.**

Perhatikan contoh berikut:
1. **Asumsi Arah**: Jika kamu memodelkan interaksi follow di platform Twitter/X sebagai *undirected graph*, modelmu akan berasumsi bahwa akun selebriti dengan jutaan follower memiliki relasi timbal balik yang setara dengan akun pengguna biasa. Ini akan mengacaukan perhitungan sentralitas dan algoritma prediksi tautan (*link prediction*).
2. **Pengabaian Bobot**: Jika kamu mengabaikan bobot frekuensi interaksi dalam jejaring komunikasi internal perusahaan, pesan email formal sekali setahun akan diperlakukan setara dengan kolaborasi obrolan harian antartim. Fitur embedding yang dihasilkan pun akan kehilangan sensitivitas intensitas hubungan.
3. **Penyusunan Fitur Matematika**: Fitur topologi klasik seperti *degree*, *clustering coefficient*, hingga jalur terpendek (*shortest path*) dihitung dengan rumus dan matriks yang berbeda antara graf berarah dan tak berarah.

Model secanggih Graph Neural Network (GNN) sekalipun tidak akan bisa memberikan prediksi yang baik jika struktur data yang kita berikan sejak awal membiaskan makna relasi aslinya.

---

## Rangkuman Singkat

Kita telah menjelajahi blok bangunan utama graph dan ragam variasinya:

* **Node dan Edge**: Pondasi dasar entitas objek dan relasi pengikatnya.
* **Directed vs. Undirected**: Menentukan apakah hubungan memiliki orientasi aliran tertentu atau berlaku timbal balik simetris.
* **Unweighted vs. Weighted**: Menentukan apakah edge sekadar penanda keberadaan koneksi atau membawa atribut kuantitatif (jarak, biaya, frekuensi).
* **Connected vs. Disconnected**: Menjelaskan apakah seluruh jaringan utuh dalam satu jangkauan atau terpecah menjadi pulau-pulau komponen.
* **Bipartite & Projected Graph**: Menghubungkan dua jenis entitas berbeda dan teknik memproyeksikannya menjadi relasi homogen (fondasi sistem rekomendasi).

Sekarang pemahaman konseptual kita tentang bentuk dan jenis graph sudah kokoh. Pertanyaan selanjutnya yang wajar muncul adalah: **bagaimana cara kita menyimpan struktur ini ke dalam memori komputer dan bahasa pemrograman?**

Pada artikel berikutnya dalam seri ini, kita akan melangkah ke implementasi teknis: **Representasi Graph di Komputer: Memahami Adjacency Matrix dan Adjacency List**. Kita akan membedah bagaimana komputer membaca baris dan kolom matriks untuk mewakili hubungan, serta kapan kita harus memilih salah satunya demi efisiensi memori. Sampai jumpa di artikel selanjutnya!
