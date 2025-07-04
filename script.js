window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("identity-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const jpkmInput = document.getElementById("nojpkm").value.trim().toUpperCase();
    const nameInput = document.getElementById("name").value.trim().toLowerCase();
    const packageInput = document.getElementById("package").value.trim().toUpperCase();

    const loadingElement = document.getElementById("loading");
    const resultElement = document.getElementById("result");
    const notFoundElement = document.getElementById("not-found");
    const infoText = document.getElementById("info-text");

    loadingElement.style.display = "block";
    resultElement.style.display = "none";
    notFoundElement.style.display = "none";

    fetch("Peserta%20JPKM%20s.d%2010%20Juni%202025%20New.json")
      .then((response) => response.json())
      .then((json) => {
        const data = json["Sheet1"];
        const peserta = data.find((item) => {
          const matchJPKM = jpkmInput && item["No JPKM"]?.toUpperCase() === jpkmInput;
          const matchName = nameInput && item["Nama Member"]?.toLowerCase() === nameInput;
          const matchPackage = packageInput && item["Nama Paket"]?.toUpperCase() === packageInput;
          return matchJPKM || (matchName && matchPackage);
        });

        loadingElement.style.display = "none";

        if (peserta) {
          resultElement.innerHTML = `
            <p><strong>Nama:</strong> ${peserta["Nama Member"]}</p>
            <p><strong>Tanggal Lahir:</strong> ${peserta["Tanggal Lahir"]}</p>
            <p><strong>Nama Grup:</strong> ${peserta["Nama Grup"]}</p>
            <p><strong>PPKBasis:</strong> ${peserta["PPKBasis"]}</p>
            <p><strong>Klinik Layanan:</strong> ${peserta["Klinik Layanan"]}</p>
            <p><strong>Masa Berlaku Kartu:</strong> ${peserta["Tanggal Masuk"]} s.d ${peserta["Tanggal Akhir Kontrak"]}</p>
          `;
          resultElement.style.display = "block";

          // Geser info-text ke bawah hasil jika ditemukan
          resultElement.insertAdjacentElement("afterend", infoText);
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
