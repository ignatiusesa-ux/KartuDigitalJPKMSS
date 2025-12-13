window.addEventListener("DOMContentLoaded", function () {
  // ============================
  // KONFIGURASI LINK EXCEL (Pastikan link ini mengarah ke file .xlsx RAW di GitHub)
  // ============================
  const excelUrl = "https://raw.githubusercontent.com/ignatiusesa-ux/KartuDigitalJPKMSS/main/Peserta%20JPKM%20s.d%2010%20Juli%202025%20New.xlsx";
  
  const nameInput = document.getElementById("name");
  const autocompleteList = document.getElementById("autocomplete-list");
  let pesertaListFull = []; // Menyimpan semua data peserta dari Excel

  // ============================
  // FUNGSI LOAD DATA DARI EXCEL MENGGUNAKAN SHEETJS
  // ============================
  function loadExcelData() {
    console.log("Mencoba mengambil data dari:", excelUrl); 

    fetch(excelUrl)
      .then(res => {
        if (!res.ok) throw new Error("Gagal mengambil file Excel (Status: " + res.status + ")");
        return res.arrayBuffer(); // Excel dibaca sebagai Buffer
      })
      .then(data => {
        // Membaca workbook
        const workbook = XLSX.read(data, { type: "array" });
        
        // Mengambil nama sheet pertama (asumsi data ada di sheet pertama)
        const firstSheetName = workbook.SheetNames[0];
        
        // Mengubah sheet menjadi JSON Object
        // Perhatian: Pastikan header kolom di Excel sama persis dengan key di JS (misal: "Nama Member")
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Simpan data ke variabel global
        pesertaListFull = jsonData;
        console.log("Data berhasil dimuat! Jumlah baris:", pesertaListFull.length);
        
        if(pesertaListFull.length > 0) {
            console.log("Contoh data baris pertama:", pesertaListFull[0]);
        }
      })
      .catch(err => {
        console.error("Error loading Excel:", err);
        const notFoundElem = document.getElementById("not-found");
        notFoundElem.textContent = "Gagal memuat database Excel. Pastikan link benar & file publik.";
        notFoundElem.style.display = "block";
      });
  }

  // Panggil fungsi load saat halaman dibuka
  loadExcelData();

  // ============================
  // FUNGSI UTILITY
  // ============================
  function normalizeText(text) {
    // Fungsi untuk mengubah teks menjadi huruf kecil, menghilangkan spasi ganda, dan trim
    return text ? text.toString().toLowerCase().trim().replace(/\s+/g, " ") : "";
  }
  
  const getVal = (item, key) => item[key] || "-"; // Helper untuk mengambil nilai dan mencegah error jika field kosong

  // ============================
  // AUTOCOMPLETE DROPDOWN
  // ============================
  nameInput.addEventListener("input", function () {
    const val = this.value.toLowerCase();
    autocompleteList.innerHTML = "";

    if (!val || pesertaListFull.length === 0) return;

    // Membuat Set untuk melacak nama yang sudah ditampilkan (mencegah duplikat saran)
    const seenNames = new Set();
    
    // Memfilter dan membatasi saran
    const filtered = pesertaListFull
      .filter(item => {
        if (!item["Nama Member"]) return false;
        const nama = item["Nama Member"].toString().toLowerCase();
        const isMatch = nama.includes(val);
        
        if (isMatch && !seenNames.has(nama)) {
          seenNames.add(nama);
          return true;
        }
        return false;
      })
      .slice(0, 10); // Batasi 10 saran

    filtered.forEach(item => {
      const nama = item["Nama Member"];
      const li = document.createElement("li");
      li.textContent = nama;
      li.addEventListener("click", function () {
        nameInput.value = nama;
        autocompleteList.innerHTML = "";
      });
      autocompleteList.appendChild(li);
    });
  });

  // Klik di luar input = tutup dropdown
  document.addEventListener("click", function (e) {
    if (e.target !== nameInput) {
      autocompleteList.innerHTML = "";
    }
  });

  // ============================
  // FORM SEARCH & TAMPIL KARTU
  // ============================
  document.getElementById("identity-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInputValue = normalizeText(document.getElementById("name").value);
    const packageInput = normalizeText(document.getElementById("package").value);

    const loadingElement = document.getElementById("loading");
    const resultElement = document.getElementById("result");
    const notFoundElement = document.getElementById("not-found");
    const kartuContainer = document.getElementById("kartu-container");
    const kartuGambar = document.getElementById("kartu-gambar");

    // Reset tampilan
    loadingElement.style.display = "block";
    resultElement.style.display = "none";
    notFoundElement.style.display = "none";

    // Mencari peserta di data yang sudah di-load dari Excel
    // Tambahkan sedikit delay agar pengguna melihat 'Loading...'
    setTimeout(() => {
      loadingElement.style.display = "none";

      const peserta = pesertaListFull.find((item) => {
        const nama = normalizeText(item["Nama Member"]);
        const jenisPaket = normalizeText(item["Paket"]);

        const matchNama = nameInputValue && nama === nameInputValue;

        // Logika pencarian berdasarkan kategori paket
        if (packageInput === "siswa" || packageInput === "siswa santo aloysius") {
          return matchNama && jenisPaket.includes("siswa");
        } else if (packageInput === "paket mahasiswa") {
          return matchNama && jenisPaket.includes("mahasiswa"); // Mengubah dari "paket" menjadi "mahasiswa" agar lebih spesifik
        } else if (packageInput === "umum") {
          // Asumsi "Umum" adalah semua yang tidak mengandung kata "siswa" atau "mahasiswa"
          return matchNama && !jenisPaket.includes("siswa") && !jenisPaket.includes("mahasiswa");
        }
        // Jika tidak memilih paket, akan selalu false (harus pilih paket)
        return false;
      });

      if (peserta) {
        const jenisPaket = peserta["Paket"] ? peserta["Paket"].toString().toUpperCase() : "";
        let cssClass = "";
        let gambar = "";

        // Logika pemilihan gambar kartu berdasarkan Jenis Paket
        if (jenisPaket === "SISWA SANTO ALOYSIUS") {
            cssClass = "kartu-aloysius";
            gambar = "Kartu Peserta Siswa Aloysius Kosong Untuk Web Kartu DepanBelakang.jpg";
        } else if (jenisPaket === "SISWA" || jenisPaket === "MAHASISWA" || jenisPaket === "PAKET MAHASISWA") {
            cssClass = "kartu-siswa";
            gambar = "Kartu Peserta Siswa Kosong Untuk Web Kartu DepanBelakang.jpg";
        } else if (jenisPaket === "DASAR PLUS") {
            cssClass = "kartu-dasarplus";
            gambar = "Kartu Peserta Dasar Plus Kosong Untuk Web Kartu DepanBelakang.jpg";
        } else if (jenisPaket === "PRIMER") {
            cssClass = "kartu-primer";
            gambar = "Kartu Peserta Primer Kosong Untuk Web Kartu DepanBelakang.jpg";
        } else if (jenisPaket === "MIX") {
            cssClass = "kartu-mix";
            gambar = "Kartu Peserta Mix Kosong Untuk Web Kartu DepanBelakang.jpg";
        } else if (jenisPaket === "ADVANCED") {
            cssClass = "kartu-advanced";
            gambar = "Kartu Peserta Advanced Kosong Untuk Web Kartu DepanBelakang.jpg";
        } else if (jenisPaket === "EXECUTIVE") {
            cssClass = "kartu-executive";
            gambar = "Kartu Peserta Executive Kosong Untuk Web Kartu DepanBelakang.jpg";
        } else if (jenisPaket === "PLATINUM") {
            cssClass = "kartu-platinum";
            gambar = "Kartu Peserta Platinum Kosong Untuk Web Kartu DepanBelakang.jpg";
        } else if (jenisPaket === "KEUSKUPAN") {
            cssClass = "kartu-keuskupan";
            gambar = "Kartu Peserta Keuskupan Kosong Untuk Web Kartu DepanBelakang.jpg";
        } else {
            // Default
            cssClass = "kartu-siswa";
            gambar = "Kartu Peserta Siswa Kosong Untuk Web Kartu DepanBelakang.jpg";
        }

        // Set Class dan Gambar
        kartuContainer.className = `kartu-container ${cssClass}`;
        kartuGambar.src = gambar;

        // Isi Data ke Elemen HTML
        document.getElementById("field-nama").textContent = getVal(peserta, "Nama Member");
        document.getElementById("field-nojpkm").textContent = getVal(peserta, "No JPKM");
        document.getElementById("field-namagrup").textContent = getVal(peserta, "Grup");
        document.getElementById("field-ppkbasis").textContent = getVal(peserta, "PPK Basis");
        document.getElementById("field-tgllahir").textContent = getVal(peserta, "Tanggal Lahir");
        document.getElementById("field-klinik").textContent = getVal(peserta, "Klinik Layanan");
        document.getElementById("field-plafon").textContent = getVal(peserta, "Kode Plafond");
        document.getElementById("field-gigi").textContent = getVal(peserta, "Paket Tambahan");
        
        // Format Masa Berlaku
        const tglMasuk = getVal(peserta, "Tanggal Masuk");
        const tglAkhir = getVal(peserta, "Tanggal Akhir Kontrak");
        document.getElementById("field-masaberlaku").textContent = `${tglMasuk} s.d ${tglAkhir}`;

        // Nama Paket (Hanya ditampilkan untuk paket tertentu jika ada di CSS)
        const namaPaketField = document.getElementById("field-namapaket");
        if (jenisPaket.includes("SISWA") || jenisPaket.includes("MAHASISWA")) {
          namaPaketField.textContent = getVal(peserta, "Paket");
          namaPaketField.style.display = "block";
        } else {
          namaPaketField.textContent = "";
          namaPaketField.style.display = "none";
        }

        resultElement.style.display = "block";
      } else {
        notFoundElement.style.display = "block";
      }
    }, 500); // Delay 0.5 detik
  });
});
