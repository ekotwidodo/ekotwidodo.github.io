---
title: "Bagaimana Graph Disimpan di Komputer? Mengenal Adjacency List dan Adjacency Matrix"
date: 2026-10-13T14:30:00+07:00
summary: "Memahami cara komputer menyimpan struktur jaringan: perbandingan adjacency matrix vs adjacency list, efisiensi memori O(|V|²) vs O(|V|+|E|), implementasi Python, hingga peran representasi data dalam machine learning on graphs."
category: "Artificial Intelligence"
image: "/assets/img/articles/graph-representations-adjacency-matrix-list.jpg"
tags:
  - "Graph Machine Learning"
  - "Graph Theory"
  - "Data Structures"
  - "Python"
  - "Artificial Intelligence"
  - "Network Science"
series:
  name: "Machine Learning on Graphs"
  part: 3
draft: false
---

Pada dua artikel sebelumnya, kita sudah belajar bahwa graph digunakan untuk merepresentasikan objek dan hubungan di antara objek tersebut.

Misalnya, kita memiliki jaringan pertemanan yang terdiri atas empat orang: **Rina**, **Dodi**, **Sari**, dan **Bima**.

Rina berteman dengan Dodi dan Sari. Dodi juga berteman dengan Bima, sedangkan Sari berteman dengan Bima.

Jika digambarkan, jaringan tersebut terlihat seperti ini:

```text
        Rina
       /    \
     Dodi   Sari
       \    /
        Bima
```

Gambar tersebut mudah dipahami oleh manusia. Kita bisa melihat siapa saja yang terhubung dan bagaimana hubungan itu membentuk sebuah jaringan.

Namun, komputer tidak memahami gambar diagram lingkaran dan garis dengan cara intuitif seperti kita. Komputer memerlukan susunan angka, biner, atau koleksi objek terstruktur dalam memori. Agar bisa melakukan perhitungan, mencari rute terpendek, atau menjalankan algoritma machine learning, graph perlu direpresentasikan dalam **struktur data** yang dapat diproses oleh program komputer.

Lalu, bagaimana caranya?

Secara umum, ada dua pendekatan utama yang paling sering digunakan untuk menyimpan graph:
1. **Adjacency Matrix** (Matriks Ketetanggaan)
2. **Adjacency List** (Daftar Ketetanggaan)

Keduanya menyimpan informasi hubungan yang sama persis, tetapi menggunakan cara dan alokasi memori yang berbeda. 

<figure class="my-8">
  <img src="/assets/img/articles/graph-adjacency-matrix-vs-list.svg" alt="Diagram Perbandingan Representasi Visual Graph, Adjacency Matrix, dan Adjacency List" class="w-full rounded-xl border border-slate-200 dark:border-slate-800" />
  <figcaption class="mt-3 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
    Perbandingan 3 bentuk representasi jaringan pertemanan: visual topologi, tabel matriks 4 × 4, dan daftar tetangga (dictionary/list).
  </figcaption>
</figure>

Mari kita pelajari satu per satu mulai dari bentuk yang paling sederhana.

---

## 1. Mulai dari Bentuk Paling Sederhana: Daftar Hubungan (Edge List)

Sebelum masuk ke bentuk matriks atau list, cara paling intuitif untuk mencatat relasi di atas adalah menuliskannya dalam sebuah tabel daftar pasangan.

| Orang Pertama | Orang Kedua |
| :--- | :--- |
| Rina | Dodi |
| Rina | Sari |
| Dodi | Bima |
| Sari | Bima |

Tabel ini disebut **daftar edge** (*edge list*). Setiap baris menunjukkan satu garis hubungan yang sah di dalam graph.

Karena contoh pertemanan kita bersifat dua arah (*undirected graph*), hubungan Rina–Dodi cukup ditulis sekali. Kita tidak perlu menambahkan baris Dodi–Rina sebagai entri terpisah karena relasinya simetris.

Dari tabel tersebut, program komputer tentu dapat membaca siapa berteman dengan siapa. Namun, coba bayangkan jika kita ingin menjawab pertanyaan praktis seperti:

> *"Siapa saja semua teman yang dimiliki oleh Rina?"*

Untuk menjawabnya, komputer harus memindai (*scan*) baris tabel dari atas sampai bawah satu per satu, mencari setiap baris yang memuat nama Rina, lalu mencatat nama pasangannya. Jika tabel memiliki jutaan baris, pencarian ini tentu memakan waktu.

Di sinilah **adjacency matrix** dan **adjacency list** dirancang agar pertanyaan semacam itu jauh lebih cepat dijawab.

---

## 2. Adjacency Matrix: Menyimpan Hubungan dalam Bentuk Matriks

**Adjacency matrix** adalah cara merepresentasikan graph menggunakan tabel angka berbentuk persegi dua dimensi (matriks).

Baris dan kolom matriks mewakili node yang sama. Setiap perpotongan sel baris $i$ dan kolom $j$ menunjukkan apakah node $i$ dan node $j$ memiliki edge langsung:

$$
A_{ij} = \begin{cases} 
1, & \text{jika terdapat edge langsung antara node } i \text{ dan node } j \\ 
0, & \text{jika tidak ada hubungan langsung} 
\end{cases}
$$

Mari kita tentukan urutan indeks untuk keempat node kita:
1. **Rina** (indeks 0)
2. **Dodi** (indeks 1)
3. **Sari** (indeks 2)
4. **Bima** (indeks 3)

Karena ada 4 node ($|V| = 4$), kita membuat matriks berukuran $4 \times 4$:

| | Rina | Dodi | Sari | Bima |
| :--- | :---: | :---: | :---: | :---: |
| **Rina** | 0 | 1 | 1 | 0 |
| **Dodi** | 1 | 0 | 0 | 1 |
| **Sari** | 1 | 0 | 0 | 1 |
| **Bima** | 0 | 1 | 1 | 0 |

### Membaca Nilai Matriks

- **Angka $1$**: Menandakan kedua node terhubung secara langsung.
- **Angka $0$**: Menandakan tidak ada edge langsung di antara keduanya.

Sebagai contoh, perhatikan baris **Rina**:
- Pada kolom Dodi nilainya adalah $1$. Artinya, Rina terhubung langsung dengan Dodi.
- Pada kolom Sari nilainya adalah $1$. Artinya, Rina terhubung langsung dengan Sari.
- Pada kolom Bima nilainya adalah $0$. Artinya, tidak ada edge langsung yang menghubungkan Rina dan Bima.

Perhatikan juga dua karakteristik penting dari matriks di atas:
1. **Diagonal utama bernilai $0$**: Sel $(0,0), (1,1), (2,2), (3,3)$ bernilai nol karena dalam relasi pertemanan biasa, seseorang tidak dianggap berteman dengan dirinya sendiri (tidak ada *self-loop*).
2. **Matriksnya simetris**: Karena graph tidak berarah (*undirected*), nilai pada sel baris Rina–kolom Dodi sama persis dengan sel baris Dodi–kolom Rina ($A_{ij} = A_{ji}$).

### Mencoba Adjacency Matrix dengan Python

Mari kita implementasikan matriks tersebut menggunakan pustaka NumPy di Python:

```python
import numpy as np

# Daftar node
nodes = ["Rina", "Dodi", "Sari", "Bima"]

# Matriks ketetanggaan 4x4
adjacency_matrix = np.array([
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0]
])

print("Adjacency Matrix:")
print(adjacency_matrix)
```

Output:

```text
Adjacency Matrix:
[[0 1 1 0]
 [1 0 0 1]
 [1 0 0 1]
 [0 1 1 0]]
```

Kini komputer menyimpan seluruh jaringan dalam matriks angka. 

Keunggulan utama dari representasi ini adalah **kecepatan memeriksa hubungan langsung**. Misalnya, kita ingin mengecek apakah Rina berteman langsung dengan Bima:

```python
rina = nodes.index("Rina")
bima = nodes.index("Bima")

# Pengecekan instan lewat indeks matriks
if adjacency_matrix[rina, bima] == 1:
    print("Rina terhubung langsung dengan Bima")
else:
    print("Rina tidak terhubung langsung dengan Bima")
```

Output:

```text
Rina tidak terhubung langsung dengan Bima
```

Pengecekan tersebut berjalan secara instan ($\mathcal{O}(1)$), karena komputer hanya perlu melompat langsung ke alamat memori baris `rina` dan kolom `bima`.

Perlu dicatat bahwa hasil tersebut hanya menyatakan **tidak adanya edge langsung**. Rina dan Bima tetap terhubung secara tidak langsung melalui teman bersama mereka, yaitu Dodi atau Sari.

---

## 3. Adjacency List: Menyimpan Daftar Tetangga Setiap Node

Sekarang, bayangkan skenario jejaring sosial nyata dengan skala yang jauh lebih besar:

> Ada $10.000$ orang pengguna. Namun, setiap orang rata-rata hanya berteman akrab dengan $10$ orang saja.

Jika kita memaksakan menggunakan adjacency matrix, komputer harus menyiapkan matriks berukuran:

$$
10.000 \times 10.000 = 100.000.000 \text{ sel (100 juta angka)}
$$

Padahal, dari $100$ juta sel tersebut, hanya sebagian kecil yang bernilai $1$. Lebih dari $99\%$ sel lainnya hanya berisi angka $0$ yang mubazir memakan memori komputer!

Kondisi jaringan di mana jumlah relasi jauh lebih sedikit daripada kapasitas total pasangan yang mungkin terjadi disebut sebagai **sparse graph** (graf jarang).

Untuk kasus seperti ini, solusi yang jauh lebih hemat dan efisien adalah **Adjacency List**.

Pada adjacency list, kita hanya mencatat **daftar tetangga** (*neighbors*) yang benar-benar terhubung untuk setiap node.

Untuk contoh pertemanan 4 orang tadi, adjacency list-nya adalah:

```text
Rina: [Dodi, Sari]
Dodi: [Rina, Bima]
Sari: [Rina, Bima]
Bima: [Dodi, Sari]
```

Kita tidak lagi membuang memori untuk mencatat relasi bernilai nol. Kita hanya menyimpan node dan daftar orang-orang yang terhubung dengannya.

### Mencoba Adjacency List dengan Python

Dalam Python, kita bisa merepresentasikan adjacency list secara natural menggunakan struktur data `dict` (dictionary) yang memetakan nama node ke dalam `list`:

```python
# Adjacency list menggunakan dictionary bawaan Python
graph = {
    "Rina": ["Dodi", "Sari"],
    "Dodi": ["Rina", "Bima"],
    "Sari": ["Rina", "Bima"],
    "Bima": ["Dodi", "Sari"]
}

# Mengambil semua teman Rina
print("Teman Rina:", graph["Rina"])
```

Output:

```text
Teman Rina: ['Dodi', 'Sari']
```

Sederhana dan sangat ekspresif!

Jika kita ingin mengetahui siapa saja teman Dodi, kita cukup memanggil kuncinya:

```python
print("Teman Dodi:", graph["Dodi"])
```

Output:

```text
Teman Dodi: ['Rina', 'Bima']
```

Kita juga dapat memeriksa apakah Rina berteman langsung dengan Bima menggunakan operator `in`:

```python
if "Bima" in graph["Rina"]:
    print("Rina terhubung langsung dengan Bima")
else:
    print("Rina tidak terhubung langsung dengan Bima")
```

Output:

```text
Rina tidak terhubung langsung dengan Bima
```

Program langsung membaca daftar tetangga yang dicari tanpa perlu memindai jutaan sel kosong.

---

## 4. Membandingkan Adjacency Matrix vs Adjacency List

Sekarang kita sudah melihat cara kerja kedua pendekatan tersebut. Pertanyaan yang wajar muncul: **kapan kita sebaiknya memilih Adjacency Matrix, dan kapan memilih Adjacency List?**

Jawabannya bergantung pada tiga faktor:
1. Ukuran dan kepadatan hubungan dalam graph (*density*).
2. Kapasitas memori yang tersedia.
3. Jenis operasi atau algoritma yang paling sering dijalankan.

Berikut adalah tabel perbandingan komparatifnya:

| Aspek Komputasi | Adjacency Matrix | Adjacency List |
| :--- | :--- | :--- |
| **Bentuk Penyimpanan** | Matriks berukuran $\|V\| \times \|V\|$ | Daftar tetangga untuk setiap node |
| **Kebutuhan Memori (Ruang)** | $\mathcal{O}(\|V\|^2)$ | $\mathcal{O}(\|V\| + \|E\|)$ |
| **Pengecekan Hubungan Langsung** (Apakah ada edge antara $u$ dan $v$?) | $\mathcal{O}(1)$ (Sangat cepat, cukup cek indeks sel) | $\mathcal{O}(\text{deg}(u))$ (Perlu menelusuri daftar tetangga $u$) |
| **Menemukan Seluruh Tetangga Node $u$** | $\mathcal{O}(\|V\|)$ (Harus membaca seluruh baris ke-$u$) | $\mathcal{O}(\text{deg}(u))$ (Tinggal mengambil list tetangga $u$) |
| **Menambah Node Baru** | $\mathcal{O}(\|V\|^2)$ (Harus merelokasi/mengubah ukuran matriks) | $\mathcal{O}(1)$ (Cukup tambah satu entri kunci baru) |
| **Paling Cocok Untuk** | **Dense graph** (graf padat) atau program yang sering memeriksa eksistensi edge | **Sparse graph** (graf jarang, seperti jejaring sosial & web data) |

> **Catatan Notasi:**
> - $|V|$ melambangkan jumlah node (*vertices*).
> - $|E|$ melambangkan jumlah edge (*edges*).
> - $\text{deg}(u)$ melambangkan derajat atau jumlah tetangga yang dimiliki node $u$.
> - Notasi Big-O ($\mathcal{O}$) menggambarkan bagaimana kebutuhan waktu atau memori bertambah seiring membesarnya ukuran data.

### Mengapa Adjacency List Jauh Lebih Populer di Data Nyata?

Sebagian besar graph di dunia nyata—seperti jejaring pertemanan media sosial, jaringan sitasi jurnal ilmiah, hingga *knowledge graph*—adalah **sparse graph**.

Tingkat kepadatan jaringan (*density*) untuk graph tak berarah didefinisikan sebagai:

$$
D = \frac{2|E|}{|V|(|V| - 1)}
$$

Misalkan sebuah jaringan memiliki $|V| = 100.000$ akun pengguna dengan $|E| = 500.000$ relasi:
- **Jika memakai Adjacency Matrix**: Komputer harus mengalokasikan $100.000 \times 100.000 = 10.000.000.000$ (10 miliar sel). Jika tiap sel berukuran 1 byte, kita butuh $\approx 10\text{ GB}$ RAM hanya untuk graf sederhana ini.
- **Jika memakai Adjacency List**: Memori yang dibutuhkan hanya sebanding dengan $|V| + |E| = 100.000 + 500.000 = 600.000$ elemen, yang hanya memakan beberapa megabita saja.

Itulah alasan mengapa pustaka analisis graph modern (seperti NetworkX, PyTorch Geometric, dan DGL) menggunakan adjacency list atau representasi sparse matrix (*Compressed Sparse Row/Column*) sebagai standar penyimpanan utama mereka.

---

## 5. Bagaimana Jika Graph Memiliki Arah (Directed Graph)?

Contoh sebelumnya menggunakan pertemanan dua arah. Sekarang, mari ubah konteksnya menjadi **hubungan mengikuti (following) di media sosial**:

- Rina mengikuti Dodi ($ \text{Rina} \to \text{Dodi} $).
- Dodi mengikuti Bima ($ \text{Dodi} \to \text{Bima} $).
- Sari mengikuti Dodi ($ \text{Sari} \to \text{Dodi} $).
- Bima tidak mengikuti siapa pun.

Hubungan ini memiliki arah yang tegas. Jika Rina mengikuti Dodi, tidak otomatis berarti Dodi mengikuti Rina.

Pada **adjacency list**, kita mencatat hubungan yang keluar (*outgoing edges*) dari masing-masing akun:

```python
# Directed graph representation
graph_berarah = {
    "Rina": ["Dodi"],
    "Dodi": ["Bima"],
    "Sari": ["Dodi"],
    "Bima": []
}

print("Akun yang diikuti Rina:", graph_berarah["Rina"])
print("Akun yang diikuti Dodi:", graph_berarah["Dodi"])
print("Akun yang diikuti Bima:", graph_berarah["Bima"])
```

Output:

```text
Akun yang diikuti Rina: ['Dodi']
Akun yang diikuti Dodi: ['Bima']
Akun yang diikuti Bima: []
```

Bima memiliki list kosong `[]` karena dalam data ini, ia tidak mengikuti siapa pun.

Jika disimpan dalam **adjacency matrix**, matriksnya **tidak lagi simetris**:
- Baris Rina–kolom Dodi bernilai $1$.
- Tetapi baris Dodi–kolom Rina bernilai $0$.

Struktur data yang dipilih harus selalu mempertahankan orientasi dan makna relasi yang sesungguhnya.

---

## 6. Bagaimana Jika Edge Memiliki Bobot (Weighted Graph)?

Pada artikel sebelumnya, kita juga telah mengenal *weighted graph*, yaitu graph yang garis hubungannya membawa nilai bobot tertentu.

Misalnya, kita ingin memodelkan peta jaringan jalan antarkota:
- Kota A ke Kota B berjarak $10\text{ km}$.
- Kota A ke Kota C berjarak $15\text{ km}$.
- Kota B ke Kota C berjarak $5\text{ km}$.

Dalam adjacency list Python, kita bisa menyimpan bobot dengan mengubah list tetangga menjadi dictionary berisi pasangan `{tetangga: bobot}`:

```python
# Weighted graph: memetakan kota ke tetangga beserta jaraknya (km)
peta_kota = {
    "Kota A": {
        "Kota B": 10,
        "Kota C": 15
    },
    "Kota B": {
        "Kota A": 10,
        "Kota C": 5
    },
    "Kota C": {
        "Kota A": 15,
        "Kota B": 5
    }
}

# Akses tetangga dan jarak dari Kota A
print("Koneksi dari Kota A:", peta_kota["Kota A"])
print("Jarak Kota A ke Kota B:", peta_kota["Kota A"]["Kota B"], "km")
```

Output:

```text
Koneksi dari Kota A: {'Kota B': 10, 'Kota C': 15}
Jarak Kota A ke Kota B: 10 km
```

Pada adjacency matrix, kita cukup mengganti angka biner $1$ dengan nilai bobot $w_{ij}$ tersebut:

$$
A = \begin{bmatrix}
0 & 10 & 15 \\
10 & 0 & 5 \\
15 & 5 & 0
\end{bmatrix}
$$

Nilai bobot ini tidak hanya terbatas pada jarak fisik dalam kilometer. Dalam persoalan data science lain, bobot bisa merepresentasikan waktu tempuh, intensitas interaksi pesan, kapasitas pipa jaringan, atau tingkat kemiripan (*similarity score*).

---

## 7. Lalu, Apa Hubungannya dengan Machine Learning on Graphs?

Sampai di titik ini, kita sudah memahami bagaimana graph disimpan di dalam memori komputer.

Namun, pertanyaan pentingnya: **apakah memilih adjacency matrix atau adjacency list berarti kita sudah melakukan machine learning?**

Jawabannya: **belum.**

Keduanya murni merupakan **fondasi representasi data**. Kita masih memerlukan metode untuk mempelajari pola dari data tersebut sesuai dengan tujuan analitik yang ingin dicapai.

Lalu, di mana letak peran kedua struktur data ini dalam machine learning?

### 1. Sebagai Sumber Fitur (*Graph Feature Engineering*)
Dalam machine learning tradisional, algoritma membutuhkan masukan berupa angka (fitur). Struktur graph yang tersimpan memungkinkan kita menghitung karakteristik topologi setiap orang secara otomatis:
- **Derajat (*Degree*)**: Berapa banyak koneksi langsung yang dimiliki seseorang?
- **Teman Bersama (*Common Neighbors*)**: Jika Rina dan Bima sama-sama berteman dengan Dodi dan Sari, kemungkinan besar Rina dan Bima saling mengenal di dunia nyata.

Informasi ini diekstrak dari *adjacency list* atau *adjacency matrix*, lalu dijadikan kolom fitur untuk model machine learning seperti Random Forest atau XGBoost guna memprediksi hubungan baru (*link prediction*).

### 2. Sebagai Mesin Komputasi pada Graph Neural Networks (GNN)
Pada pendekatan modern seperti **Graph Neural Networks (GNN)**, model AI belajar dengan cara yang sangat manusiawi:

> *"Setiap node memperbarui pemahamannya tentang dirinya sendiri dengan cara mendengarkan (merangkum) informasi dari teman-teman di sekitarnya."*

Secara konseptual, informasi baru seorang node $v$ dihitung sesederhana:

$$
h_{v}^{(\text{baru})} = \text{Gabungkan} \left( h_{v}^{(\text{lama})}, \sum_{u \in \text{Tetangga}(v)} h_{u} \right)
$$

Di sinilah **Adjacency Matrix** dan **Adjacency List** memainkan peran kuncinya:
- **Adjacency List** memandu program: *"Node mana saja yang harus dikunjungi untuk mengambil pesan tetangga?"*
- **Adjacency Matrix** memungkinkan operasi penjumlahan tetangga untuk **seluruh node dalam jaringan** dihitung sekaligus dalam satu kali **perkalian matriks**:
  $$
  Z = A \times X
  $$
  *(di mana $A$ adalah Adjacency Matrix dan $X$ adalah tabel data fitur dari seluruh node).*

Karena komputer dan kartu grafis (GPU) dirancang khusus untuk melakukan perkalian matriks dengan sangat cepat, adjacency matrix menjadi jembatan aljabar linear yang mengubah struktur graf menjadi komputasi paralel berkecepatan tinggi.

### 3. Efisiensi Skala Besar
Ketika jaringan membesar hingga ratusan juta pengguna (seperti di media sosial atau sistem rekomendasi e-commerce), menyimpan matriks $A$ penuh akan menghabiskan memori GPU. 

Oleh karena itu, framework GNN modern (seperti PyTorch Geometric) memanfaatkan representasi *sparse* berbasis **adjacency list** untuk memproses miliaran hubungan secara efisien tanpa kehabisan memori.

---

Satu hal mendasar yang perlu diingat: **representasi yang kita pilih tidak mengubah fakta hubungan jaringan yang sebenarnya.** Selama dimodelkan dengan benar, baik adjacency matrix maupun adjacency list memuat informasi topologi yang setara. Perbedaannya murni terletak pada efisiensi ruang memori dan kemudahan jenis operasi yang ingin kita jalankan.

---

## Rangkuman Singkat

Dari pembahasan di atas, berikut poin-poin utama yang telah kita pelajari:

- Graph di komputer tidak disimpan sebagai gambar grafis, melainkan melalui struktur data terstruktur.
- **Adjacency Matrix** menyimpan seluruh kemungkinan koneksi dalam tabel persegi $|V| \times |V|$. Sangat cepat untuk mengecek keberadaan suatu edge ($\mathcal{O}(1)$), tetapi boros memori pada graf yang jarang ($\mathcal{O}(|V|^2)$).
- **Adjacency List** hanya mencatat tetangga yang benar-benar ada. Jauh lebih hemat memori ($\mathcal{O}(|V| + |E|)$) dan menjadi format standar untuk data dunia nyata yang berukuran besar (*sparse graph*).
- Kedua pendekatan tersebut dapat dengan luwes disesuaikan untuk memodelkan **graph berarah** (*directed*) maupun **graph berbobot** (*weighted*).

Tidak perlu langsung menghafal seluruh kompleksitas komputasi dalam semalam. Yang paling penting adalah memahami bahwa pilihan struktur data menentukan bagaimana kita mengakses dan mengolah informasi relasi tersebut.

Pada artikel berikutnya dalam seri *Machine Learning on Graphs*, kita akan mulai menganalisis struktur jaringan lebih dalam: **bagaimana cara menentukan node yang paling penting atau paling berpengaruh dalam sebuah graph?** Kita akan berkenalan dengan konsep **Centrality** melalui analogi intuitif sebelum membedah rumus pengukurannya.
