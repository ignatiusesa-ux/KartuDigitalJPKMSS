window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("identity-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name").value.trim().toLowerCase();
    const packageInput = document.getElementById("package").value.trim().toUpperCase();
    const nojpkmInput = document.getElementById("nojpkm").value.trim().toUpperCase();

    fetch("Peserta%20JPKM%20s.d%2010%20Juni%202025%20New.json")
      .then((response) => response.json())
      .then((data) => {
        const pesertaList = data["Sheet1"];

        const peserta = pesertaList.find((item) => {
          const nama = item["Nama Member"]?.toLowerCase();
          const paket = item["Nama Paket"]?.toUpperCase();
          const nojpkm = item["No JPKM"]?.toUpperCase();

          return nojpkm === nojpkmInput ||
            (nama === nameInput && paket === packageInput);
        });

        if (peserta) {
          document.getElementById("namaText").textContent = peserta["Nama Member"];
          document.getElementById("nojpkmText").textContent = peserta["No JPKM"];
          document.getElementById("tgllahirText").textContent = peserta["Tanggal Lahir"];
          document.getElementById("rajalText").textContent = peserta["Klinik Layanan"];
          document.getElementById("ranapText").textContent = peserta["Kode Plafond"];
          document.getElementById("gigiText").textContent = peserta["Paket Tambahan"];
          document.getElementById("masaberlakuText").textContent =
            `${peserta["Tanggal Masuk"]} s.d ${peserta["Tanggal Akhir Kontrak"]}`;

          document.getElementById("kartu-wrapper").style.display = "block";
          document.getElementById("not-found").style.display = "none";
        } else {
          document.getElementById("kartu-wrapper").style.display = "none";
          document.getElementById("not-found").style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Terjadi kesalahan:", error);
        document.getElementById("not-found").style.display = "block";
      });
  });
});
