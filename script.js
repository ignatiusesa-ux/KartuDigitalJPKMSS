window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("identity-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const nojpkmInput = document.getElementById("nojpkm").value.trim().toUpperCase();
    const nameInput = document.getElementById("name").value.trim().toLowerCase();
    const packageInput = document.getElementById("package").value.trim().toUpperCase();

    fetch("Peserta%20JPKM%20s.d%2010%20Juni%202025%20New.json")
      .then((response) => response.json())
      .then((data) => {
        const pesertaList = data["Sheet1"];
        const peserta = pesertaList.find((item) => {
          const matchNoJPKM = item["No JPKM"]?.toUpperCase() === nojpkmInput;
          const matchName = nameInput === "" || item["Nama Member"]?.toLowerCase() === nameInput;
          const matchPackage = packageInput === "" || item["Nama Paket"]?.toUpperCase() === packageInput;
          return matchNoJPKM && matchName && matchPackage;
        });

        const card = document.getElementById("cardContainer");

        if (peserta) {
          document.getElementById("namaText").textContent = peserta["Nama Member"];
          document.getElementById("nojpkmText").textContent = peserta["No JPKM"];
          document.getElementById("namagrupText").textContent = peserta["Nama Grup"];
          document.getElementById("ppkbasisText").textContent = peserta["PPKBasis"];
          document.getElementById("tgllahirText").textContent = peserta["Tanggal Lahir"];
          document.getElementById("rajalText").textContent = peserta["Klinik Layanan"];
          document.getElementById("ranapText").textContent = peserta["Kode Plafond"];
          document.getElementById("gigiText").textContent = peserta["Paket Tambahan"];
          document.getElementById("masaberlakuText").textContent =
            `${peserta["Tanggal Masuk"]} s.d ${peserta["Tanggal Akhir Kontrak"]}`;
          
          card.style.display = "inline-block";
        } else {
          alert("Data tidak ditemukan. Silakan periksa kembali input Anda.");
          card.style.display = "none";
        }
      })
      .catch((error) => {
        alert("Terjadi kesalahan saat memuat data.");
        console.error("Error:", error);
      });
  });
});
