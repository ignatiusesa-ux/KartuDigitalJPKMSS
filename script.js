window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("identity-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name").value.trim().toLowerCase();
    const packageInput = document.getElementById("package").value.trim().toUpperCase();

    const loadingElement = document.getElementById("loading");
    const resultElement = document.getElementById("result");
    const notFoundElement = document.getElementById("not-found");

    loadingElement.style.display = "block";
    resultElement.style.display = "none";
    notFoundElement.style.display = "none";

    fetch("Peserta%20JPKM%20s.d%2010%20Juni%202025%20New.json")
      .then((response) => response.json())
      .then((data) => {
        const list = data.Sheet1 || [];

        const peserta = list.find((item) => {
          const nama = item["Nama Member"]?.toLowerCase();
          const jenisPaket = item["Nama Paket"]?.toUpperCase();

          const matchNama = nameInput && nama === nameInput;

          if (packageInput === "SISWA") {
            return matchNama && jenisPaket === "SISWA";
          } else if (packageInput === "UMUM") {
            return matchNama && jenisPaket !== "SISWA";
          }

          return false;
        });

        loadingElement.style.display = "none";

        if (peserta) {
          const namaPaket = peserta["Nama Paket"]?.toUpperCase();
          const kartuGambar = document.getElementById("kartu-gambar");
          const kartuContainer = document.getElementById("kartu-container");

          let fileName = "Kartu Peserta Siswa Kosong Untuk Web Kartu DepanBelakang.jpg";
          let kartuClass = "";

          if (packageInput === "UMUM") {
            switch (namaPaket) {
              case "DASAR PLUS":
                fileName = "Kartu Peserta Dasar Plus Kosong Untuk Web Kartu DepanBelakang.jpg";
                kartuClass = "dasar-plus";
                break;
              case "PRIMER":
                fileName = "Kartu Peserta Primer Kosong Untuk Web Kartu DepanBelakang.jpg";
                kartuClass = "primer";
                break;
              case "MIX":
                fileName = "Kartu Peserta Mix Kosong Untuk Web Kartu DepanBelakang.jpg";
                kartuClass = "mix";
                break;
              case "ADVANCED":
                fileName = "Kartu Peserta Advanced Kosong Untuk Web Kartu DepanBelakang.jpg";
                kartuClass = "advanced";
                break;
              case "EXECUTIVE":
                fileName = "Kartu Peserta Executive Kosong Untuk Web Kartu DepanBelakang.jpg";
                kartuClass = "executive";
                break;
              case "PLATINUM":
                fileName = "Kartu Peserta Platinum Kosong Untuk Web Kartu DepanBelakang.jpg";
                kartuClass = "platinum";
                break;
              case "KEUSKUPAN":
                fileName = "Kartu Peserta Keuskupan Kosong Untuk Web Kartu DepanBelakang.jpg";
                kartuClass = "keuskupan";
                break;
            }
          }

          kartuGambar.src = fileName;
          kartuContainer.className = `kartu-container ${kartuClass}`;

          document.getElementById("field-nama").textContent = peserta["Nama Member"];
          document.getElementById("field-nojpkm").textContent = peserta["No JPKM"];
          document.getElementById("field-namagrup").textContent = peserta["Nama Grup"];
          document.getElementById("field-ppkbasis").textContent = peserta["PPKBasis"];
          document.getElementById("field-tgllahir").textContent = peserta["Tanggal Lahir"];
          document.getElementById("field-klinik").textContent = peserta["Klinik Layanan"];
          document.getElementById("field-plafon").textContent = peserta["Kode Plafond"];
          document.getElementById("field-gigi").textContent = peserta["Paket Tambahan"];
          document.getElementById("field-masaberlaku").textContent = `${peserta["Tanggal Masuk"]} s.d ${peserta["Tanggal Akhir Kontrak"]}`;

          // Tampilkan Nama Paket hanya jika "SISWA"
          const fieldNamaPaket = document.getElementById("field-namapaket");
          if (namaPaket === "SISWA") {
            fieldNamaPaket.style.display = "block";
            fieldNamaPaket.textContent = peserta["Nama Paket"];
          } else {
            fieldNamaPaket.style.display = "none";
          }

          resultElement.style.display = "block";
        } else {
          notFoundElement.style.display = "block";
        }
      })
      .catch((error) => {
        loadingElement.style.display = "none";
        notFoundElement.style.display = "block";
        console.error("Terjadi kesalahan:", error);
      });
  });
});
