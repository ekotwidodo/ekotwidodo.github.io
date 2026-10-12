---
title: "Machine Learning on Graphs: Memahami Data Lewat Hubungannya"
date: 2026-10-12T11:45:00+07:00
summary: "Mengenal machine learning on graphs dari intuisi paling mendasar: mengapa baris dan kolom tabel tidak selalu cukup, serta bagaimana struktur relasi antarentitas membuka wawasan analitik baru."
category: "Artificial Intelligence"
image: "/assets/img/articles/machine-learning-on-graphs-introduction.jpg"
tags:
  - "Graph Machine Learning"
  - "Artificial Intelligence"
  - "Data Science"
  - "Graph Neural Networks"
  - "Network Science"
  - "Representation Learning"
featured: true
featuredOrder: 1
series:
  name: "Machine Learning on Graphs"
  part: 1
draft: false
---

Pernahkah kamu memperhatikan bahwa kita kerap mengenal seseorang bukan hanya dari identitas pribadinya, melainkan juga dari orang-orang di sekitarnya?

Ambil contoh sederhana. Kita tahu Rina adalah seorang mahasiswa. Kita juga tahu Rina berteman dengan Dodi dan Sari. Sementara itu, Dodi berteman dengan Bima, yang ternyata memiliki minat bidang studi yang serupa dengan Rina.

Dari rangkaian informasi ini, wawasan yang kita miliki jauh lebih kaya daripada sekadar daftar nama, program studi, atau semester masing-masing orang. Kita mulai melihat formasi jejaring dan pola interaksi di antara mereka.

Bahkan dari sana, muncul pertanyaan-pertanyaan yang wajar:
* Apakah Rina dan Bima berpeluang saling mengenal atau berteman di masa depan?
* Apakah Rina dan Sari berada dalam satu lingkar pertemanan (*circle*) yang sama?
* Siapa sosok yang bertindak sebagai jembatan informasi paling sentral dalam jaringan tersebut?

Pertanyaan-pertanyaan semacam inilah yang membuka pintu ke salah satu cabang paling menarik dalam kecerdasan buatan modern: **Machine Learning on Graphs**.

---

## 1. Data Tidak Selalu Cukup Dipahami dari Tabel

Saat pertama kali bersentuhan dengan data science atau machine learning, format data tabular hampir selalu menjadi titik mula kita. Kita terbiasa membuka file CSV, spreadsheet Excel, atau tabel database relasional yang rapi tersusun dalam baris dan kolom.

Mari kita lihat data mahasiswa tadi jika disajikan dalam format tabel standar:

| Nama | Program Studi | Semester |
|:---|:---|:---:|
| Rina | Informatika | 4 |
| Dodi | Statistika | 4 |
| Sari | Informatika | 6 |
| Bima | Sistem Informasi | 4 |

Dari tabel di atas, analisis deskriptif dasar tentu sangat mudah dilakukan. Kita bisa menghitung distribusi mahasiswa per program studi, mengelompokkan mahasiswa berdasarkan tingkat semester, atau membangun model klasifikasi untuk memprediksi indeks prestasi.

Namun, ada hal penting yang hilang: **siapa berinteraksi dengan siapa?**

Informasi mengenai interaksi tersebut tidak terekam dalam atribut kolom tabel di atas. Kita harus membuat tabel terpisah (misalnya tabel relasi *friends*) atau melakukan operasi *join* yang rumit untuk melacak jalurnya.

Tabel tentu saja bisa dipaksa merepresentasikan relasi antarentitas. Namun, persoalannya bukan terletak pada apakah tabel mampu menyimpannya, melainkan **seberapa alami dan efektif format tersebut ketika dianalisis**. Begitu jaringan meluas dan relasi menjadi fokus utama persoalan, representasi berbentuk jaringan atau *graph* menjadi jauh lebih intuitif dan bertenaga.

---

## 2. Apa Itu Graph?

Secara mendasar, **graph** adalah cara matematis sekaligus visual untuk merepresentasikan sekumpulan objek beserta hubungan yang terjalin di antara mereka.

Struktur graph tersusun atas dua komponen esensial:

1. **Node (atau Vertex)**: Objek, entitas, atau partisipan yang sedang kita amati.
2. **Edge (atau Link)**: Garis relasi yang menghubungkan satu node dengan node lainnya.

Kembali ke skenario pertemanan di atas. Bayangkan setiap mahasiswa digambarkan sebagai lingkaran kecil (*node*). Setiap kali dua orang saling berteman, kita tarik garis (*edge*) yang menghubungkan kedua lingkaran tersebut.

<figure class="my-8">
  <img
    src="/assets/img/articles/graph-machine-learning-social-network-concept.svg"
    alt="Ilustrasi Struktur Data Graph: Node, Edge, dan Tiga Tugas Utama Machine Learning on Graphs"
    class="h-auto w-full rounded-xl shadow-xs"
    loading="lazy"
  />
  <figcaption>
    <strong>Gambar 1:</strong> Representasi graph jejaring sosial mahasiswa. Rina terhubung dengan Sari dan Dodi melalui relasi pertemanan, sementara Dodi terhubung ke Bima. Garis putus-putus menunjukkan potensi hubungan pertemanan baru antara Rina dan Bima yang dapat dipelajari oleh model.
  </figcaption>
</figure>

Konsep ini sangat fleksibel. Grafis titik dan garis di atas bisa mewakili domain apa pun di dunia nyata:

* **Sistem Transportasi**: Node adalah stasiun kereta atau bandara kota, sedangkan edge adalah rel atau rute penerbangan yang menghubungkannya.
* **Infrastruktur Jaringan Komputer**: Node adalah server, router, atau perangkat pengguna, sedangkan edge adalah kabel serat optik atau koneksi nirkabel.
* **Ekosistem Bisnis & Finansial**: Node adalah perusahaan atau rekening bank, sedangkan edge adalah transaksi pembayaran, kemitraan rantai pasok, atau kepemilikan saham.
* **Jaringan Pengetahuan & Informasi**: Node adalah artikel ensiklopedia atau paper ilmiah, sedangkan edge adalah rujukan sitasi dan tautan referensi silang.

Objek fisiknya bisa sangat beraneka ragam, tetapi prinsip dasarnya identik: **kita memiliki entitas-entitas individual, dan kita peduli terhadap hubungan timbal balik di antara entitas tersebut**.

---

## 3. Menghubungkan Graph dengan Machine Learning

Memodelkan data ke dalam bentuk graph baru menyelesaikan separuh tantangan. Mengetahui bahwa Rina berteman dengan Dodi belum tentu langsung menjawab siapa yang layak direkomendasikan menjadi teman baru Rina di platform.

Di sinilah **Machine Learning on Graphs** mengambil peran.

> **Definisi Sederhana:**  
> Machine Learning on Graphs adalah serangkaian pendekatan komputasi yang memanfaatkan struktur topologi jaringan serta atribut di dalamnya untuk menemukan pola tersembunyi dan menyelesaikan tugas prediksi.

Informasi yang dipelajari mesin tidak hanya berasal dari atribut masing-masing node (seperti prodi atau semester), melainkan juga pola konektivitasnya terhadap tetangga sekitar (*neighborhood context*).

Secara garis besar, ada tiga tugas analitik utama yang paling sering kita jumpai:

### A. Memprediksi Kategori Objek (*Node Classification*)

Bayangkan sebuah jejaring akun di platform akademis. Kita memiliki sebagian akun yang sudah terverifikasi bidang keahliannya (misalnya peneliti AI, dokter, ekonom), sementara sebagian akun baru belum mencantumkan keahlian mereka.

Daripada menebak murni dari nama atau teks profil, model dapat melihat siapa saja yang berinteraksi secara konsisten dengan akun tersebut. Jika hampir semua koneksi dekat seseorang adalah peneliti machine learning, kemungkinan besar akun tersebut juga berkecimpung di bidang yang berkaitan.

Tugas mengestimasi label pada node yang belum diketahui inilah yang disebut sebagai **Node Classification**.

### B. Memprediksi Hubungan yang Belum Ada (*Link Prediction*)

Perhatikan kembali Gambar 1: Rina berteman dengan Dodi, dan Dodi berteman dengan Bima. Namun, saat ini belum ada garis yang menghubungkan Rina langsung dengan Bima.

Apakah mereka berpotensi saling mengenal?

Mungkin mereka berada di angkatan yang sama, memiliki teman bersama (*mutual friend*), atau menyukai topik bahasan yang sama. **Link Prediction** berfokus memprediksi apakah sebuah edge berpeluang terbentuk antara dua node di masa mendatang, atau mendeteksi hubungan yang sebetulnya ada di dunia nyata tetapi luput tercatat pada database kita.

Fitur *People You May Know* di jejaring sosial, sistem rekomendasi produk *e-commerce*, hingga penemuan interaksi obat baru di bidang farmasi bertumpu pada tugas ini.

### C. Menemukan Kelompok yang Saling Terhubung (*Community Detection*)

Dalam jejaring yang memiliki ribuan atau jutaan anggota, manusia cenderung membentuk kelompok-kelompok kecil yang berinteraksi lebih intens di dalam kelompoknya dibandingkan ke luar.

Tanpa perlu mengelompokkan mahasiswa satu per satu secara manual, algoritma graph dapat mendeteksi klaster-klaster pertemanan secara alami berdasarkan kepadatan edge. Tugas ini dikenal sebagai **Community Detection**, yang sangat berharga untuk segmentasi pengguna, investigasi transaksi mencurigakan (*fraud detection*), maupun pemetaan subdisiplin riset.

---

## 4. Mengapa Tidak Cukup Menggunakan Algoritma Klasik Saja?

Pertanyaan ini wajar sekali diajukan. Algoritma pembelajaran mesin klasik seperti **Random Forest**, **Support Vector Machines (SVM)**, atau **XGBoost** sudah terbukti sangat tangguh dan andal untuk data tabular.

Apakah setiap kali memiliki data relasional kita harus beralih ke model berbasis graph?

Jawabannya: **tidak selalu**.

Jika informasi pada baris dan kolom tabel biasa sudah cukup representatif untuk menjawab kebutuhan bisnis atau riset kita, algoritma tabular konvensional adalah pilihan yang efisien dan mudah diinterpretasikan.

Namun, kelemahan mendasar model klasik muncul saat kita menghadapi asumsi dasar statistik: **data diasumsikan independen dan terdistribusi secara identik (i.i.d. - *independent and identically distributed*)**.

Dalam dunia nyata, data jarang sekali berdiri sendiri:
* Selera menonton kita dipengaruhi oleh lingkaran teman terdekat kita.
* Risiko penularan virus sangat bergantung pada rute kontak fisik.
* Risiko sebuah transaksi keuangan dipengaruhi oleh reputasi rekening pengirim maupun penerima.

Mengabaikan struktur hubungan berarti membuang sinyal prediktif yang krusial. 

Menariknya, mengadopsi graph bukan berarti kita wajib membuang algoritma lama. Kita bisa mengekstraksi metrik jaringan (seperti derajat simpul, koefisien clustering, atau skor sentralitas) sebagai fitur kolom baru, lalu melatihnya menggunakan XGBoost. Pendekatan yang lebih modern memanfaatkan representasi vektor otomatis (*node embeddings*) dan arsitektur *Graph Neural Networks (GNN)*.

---

## 5. Mengapa Data Graph Lebih Menantang untuk Mesin?

Jika graph secara konseptual hanya tersusun atas titik dan garis, mengapa melatih mesin pada graph membutuhkan arsitektur khusus?

Dalam data tabular atau gambar (citra), data berada dalam ruang teratur (*Euclidean space*). Sebuah gambar memiliki susunan piksel yang teratur: setiap piksel memiliki tetangga atas, bawah, kiri, dan kanan. Kalimat dalam teks memiliki urutan kata yang berurutan dari kiri ke kanan.

Graph, sebaliknya, adalah struktur **Non-Euclidean**:

1. **Ukuran dan Derajat yang Sangat Bervariasi**:  
   Satu node bisa memiliki hanya 1 tetangga, sedangkan node lain (seperti akun selebritas) bisa memiliki 10 juta tetangga. Tidak ada matriks ukuran tetap yang seragam untuk semua entitas.
2. **Kekebalan Urutan (*Permutation Invariance*)**:  
   Urutan penulisan node pada matriks keterhubungan tidak mengubah hakikat jaringan. Mengubah urutan baris ke-1 dan ke-2 tidak boleh mengubah hasil prediksi model.
3. **Relasi Membawa Semantik**:  
   Dua orang dengan usia dan pekerjaan yang persis sama bisa memiliki peran yang bertolak belakang di dalam komunitas hanya karena posisi jejaringnya berbeda.
4. **Sifat Dinamis Jaringan**:  
   Jejaring di dunia nyata terus berevolusi. Node baru bergabung, koneksi terputus, dan bobot interaksi berfluktuasi dari waktu ke waktu.

Karakteristik unik inilah yang melahirkan bidang spesifik rekayasa fitur graf dan arsitektur *Graph Neural Networks*.

---

## 6. Machine Learning on Graphs vs Graph Neural Networks

Saat menelusuri literatur mengenai topik ini, istilah **GNN (Graph Neural Networks)** sering kali mendominasi perbincangan, sehingga terkadang disamakan dengan Machine Learning on Graphs secara keseluruhan.

Perlu ditekankan bahwa keduanya adalah dua tingkatan konsep yang berbeda:

<figure class="my-8">
  <img
    src="/assets/img/articles/graph-ml-taxonomy-hierarchy.svg"
    alt="Taksonomi Hierarki Machine Learning on Graphs: Metrik Tradisional, Representation Learning, dan Graph Neural Networks"
    class="h-auto w-full rounded-xl shadow-xs"
    loading="lazy"
  />
  <figcaption>
    <strong>Gambar 2:</strong> Taksonomi pendekatan Machine Learning on Graphs, mencakup tiga tingkatan: ekstraksi metrik manual, pembelajaran representasi simpul (shallow embeddings), hingga arsitektur deep learning Graph Neural Networks (GNN).
  </figcaption>
</figure>

* **Machine Learning on Graphs**: Domain komprehensif untuk seluruh metode analitik dan pembelajaran mesin pada data jaringan—mulai dari rekayasa fitur berbasis statistik jaringan lokal, representasi ruang vektor acak (*random walk*), hingga arsitektur deep learning.
* **Graph Neural Networks (GNN)**: Salah satu cabang arsitektur deep learning modern di mana representasi setiap node diperbarui secara iteratif dengan melewatkan pesan (*message passing*) antar-tetangganya secara langsung di dalam graph.

Kita tidak perlu langsung terburu-buru meloncat ke rumus kalkulus GNN yang rumit sebelum memahami bagaimana graph direpresentasikan secara mendasar di dalam komputer.

---

## 7. Rencana Perjalanan Pembelajaran Kita

Artikel ini merupakan fondasi pertama dari serial **Machine Learning on Graphs**.

Sepanjang seri ini, kita akan menjelajahi topik ini langkah demi langkah:
1. **Representasi Komputasi Graph**: Bagaimana komputer menyimpan hubungan (Adjacency Matrix, Adjacency List, dan Edge List).
2. **Metrik Topologi Jaringan**: Mengukur siapa entitas terpenting melalui berbagai jenis *Centrality* (Degree, Closeness, Betweenness, PageRank).
3. **Graph Representation Learning**: Bagaimana mengubah node menjadi vektor angka (*Node Embeddings*) menggunakan algoritma seperti DeepWalk dan Node2Vec.
4. **Graph Neural Networks dari Nol**: Memahami mekanisme *Message Passing*, agregasi ketetanggaan, dan implementasi praktis menggunakan Python dan pustaka PyTorch Geometric.

Setiap artikel akan dirancang dengan bahasa yang membumi, analogi yang aplikatif, dan kode implementasi yang dapat kamu coba langsung di komputermu.

---

## Penutup

Selama ini, kita mungkin terbiasa memandang data semata-mata sebagai himpunan atribut yang terkurung dalam kotak baris dan kolom. Padahal, fenomena paling berharga di sekitar kita kerap terjadi justru di antara celah-celah hubungan antarentitas.

Seorang individu bukan hanya sekumpulan data demografis, melainkan bagian dari jejaring pertemanan dan profesional. Sebuah organisasi bisnis terikat erat dalam rantai pasok dan relasi perbankan. Demikian pula molekul kimia, rute logistik, dan dokumen web yang membentuk jaring laba-laba pengetahuan raksasa.

Graph memberi kita bahasa visual dan matematis untuk memetakan hubungan tersebut. Machine learning on graphs kemudian memberi kita instrumen untuk menyingkap pola dan memprediksi masa depannya.

Titik tolak terbaik untuk memulai perjalanan ini bukanlah dengan menghafal rumus algoritma, melainkan dengan membiasakan diri mengajukan satu pertanyaan reflektif:

> *“Selain mengetahui karakteristik masing-masing entitas, wawasan apa yang bisa kita pelajari dari cara mereka saling terhubung?”*

Di artikel berikutnya, kita akan membahas cara komputer merepresentasikan struktur graph secara matematis dan bagaimana kita mengolahnya menggunakan pustaka Python NetworkX. Sampai jumpa di bagian kedua!
