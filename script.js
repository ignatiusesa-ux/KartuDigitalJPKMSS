window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("identity-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name").value.trim().toLowerCase();

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
          return item["Nama Member"]?.toLowerCase() === nameInput;
        });

        loadingElement.style.display = "none";

        if (peserta) {
          document.getElementById("field-nama").textContent = peserta["Nama Member"];
          document.getElementById("field-nojpkm").textContent = peserta["No JPKM"];
          document.getElementById("field-namagrup").textContent = peserta["Nama Grup"];
          document.getElementById("field-ppkbasis").textContent = peserta["PPKBasis"];
          document.getElementById("field-tgllahir").textContent = peserta["Tanggal Lahir"];
          document.getElementById("field-klinik").textContent = peserta["Klinik Layanan"];
          document.getElementById("field-plafon").textContent = peserta["Kode Plafond"];
          document.getElementById("field-gigi").textContent = peserta["Paket Tambahan"];
          document.getElementById("field-masaberlaku").textContent =
            `${peserta["Tanggal Masuk"]} s.d ${peserta["Tanggal Akhir Kontrak"]}`;
          document.getElementById("field-namapaket").textContent = peserta["Nama Paket"];

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
