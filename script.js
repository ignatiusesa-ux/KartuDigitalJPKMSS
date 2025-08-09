window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("identity-form").addEventListener("submit", function (event) {
    event.preventDefault();

    function normalizeText(text) {
    return text
        ?.toLowerCase()
        .trim()
        .replace(/\s+/g, " "); // hapus spasi ganda
}

    const nameInput = normalizeText(document.getElementById("name").value);
    const packageInput = normalizeText(document.getElementById("package").value);


    const loadingElement = document.getElementById("loading");
    const resultElement = document.getElementById("result");
    const notFoundElement = document.getElementById("not-found");

    const kartuContainer = document.getElementById("kartu-container");
    const kartuGambar = document.getElementById("kartu-gambar");

    loadingElement.style.display = "block";
    resultElement.style.display = "none";
    notFoundElement.style.display = "none";

    fetch("Peserta%20JPKM%20s.d%2010%20Juli%202025%20New.json")
      .then((response) => response.json())
      .then((data) => {
        const list = data["Peserta_11-07-2025"] || [];

        const peserta = list.find((item) => {
    const nama = normalizeText(item["Nama Member"]);
    const jenisPaket = normalizeText(item["Paket"]);

    const matchNama = nameInput && nama === nameInput;

    if (packageInput === "siswa" || packageInput === "mahasiswa") {
    return matchNama && (jenisPaket.includes("siswa") || jenisPaket.includes("mahasiswa"));
}
 else if (packageInput === "umum") {
        return matchNama && jenisPaket !== "siswa" && jenisPaket !== "mahasiswa";
    }

    return false;
});

        loadingElement.style.display = "none";
function cariPeserta() {
    let namaInput = document.getElementById("input-nama").value.trim().toLowerCase();
    let paketDipilih = document.getElementById("input-paket").value.trim().toLowerCase();

    // cari data di JSON yang cocok dengan nama & paket
    let peserta = data.find(item =>
        item.Nama.toLowerCase() === namaInput &&
        item.Paket && item.Paket.toLowerCase().includes(paketDipilih)
    );

        if (peserta) {
          const jenisPaket = peserta["Paket"]?.toUpperCase();
          let cssClass = "";
          let gambar = "";

          switch (jenisPaket) {
            case "SISWA":
            case "MAHASISWA":
              cssClass = "kartu-siswa";
              gambar = "Kartu Peserta Siswa Kosong Untuk Web Kartu DepanBelakang.jpg";
              break;
            case "DASAR PLUS":
              cssClass = "kartu-dasarplus";
              gambar = "Kartu Peserta Dasar Plus Kosong Untuk Web Kartu DepanBelakang.jpg";
              break;
            case "PRIMER":
              cssClass = "kartu-primer";
              gambar = "Kartu Peserta Primer Kosong Untuk Web Kartu DepanBelakang.jpg";
              break;
            case "MIX":
              cssClass = "kartu-mix";
              gambar = "Kartu Peserta Mix Kosong Untuk Web Kartu DepanBelakang.jpg";
              break;
            case "ADVANCED":
              cssClass = "kartu-advanced";
              gambar = "Kartu Peserta Advanced Kosong Untuk Web Kartu DepanBelakang.jpg";
              break;
            case "EXECUTIVE":
              cssClass = "kartu-executive";
              gambar = "Kartu Peserta Executive Kosong Untuk Web Kartu DepanBelakang.jpg";
              break;
            case "PLATINUM":
              cssClass = "kartu-platinum";
              gambar = "Kartu Peserta Platinum Kosong Untuk Web Kartu DepanBelakang.jpg";
              break;
            case "KEUSKUPAN":
              cssClass = "kartu-keuskupan";
              gambar = "Kartu Peserta Keuskupan Kosong Untuk Web Kartu DepanBelakang.jpg";
              break;
            default:
              cssClass = "kartu-siswa";
              gambar = "Kartu Peserta Siswa Kosong Untuk Web Kartu DepanBelakang.jpg";
          }

          // Set class dan gambar kartu
          kartuContainer.className = `kartu-container ${cssClass}`;
          kartuGambar.src = gambar;

          // Isi data ke kartu
          document.getElementById("field-nama").textContent = peserta["Nama Member"];
          document.getElementById("field-nojpkm").textContent = peserta["No JPKM"];
          document.getElementById("field-namagrup").textContent = peserta["Grup"];
          document.getElementById("field-ppkbasis").textContent = peserta["PPK Basis"];
          document.getElementById("field-tgllahir").textContent = peserta["Tanggal Lahir"];
          document.getElementById("field-klinik").textContent = peserta["Klinik Layanan"];
          document.getElementById("field-plafon").textContent = peserta["Kode Plafond"];
          document.getElementById("field-gigi").textContent = peserta["Paket Tambahan"];
          document.getElementById("field-masaberlaku").textContent = `${peserta["Tanggal Masuk"]} s.d ${peserta["Tanggal Akhir Kontrak"]}`
          document.getElementById("field-namapaket").textContent = peserta.Paket;

          // Nama Paket hanya untuk Siswa
          const namaPaketField = document.getElementById("field-namapaket");
         if (jenisPaket === "SISWA" || jenisPaket === "MAHASISWA") {
            namaPaketField.textContent = peserta["Paket"];
            namaPaketField.style.display = "block";
          } else {
            namaPaketField.textContent = "";
            namaPaketField.style.display = "none";
          }

          resultElement.style.display = "block";
        } else {
          notFoundElement.style.display = "block";
        }
      )
      .catch((error) => {
        loadingElement.style.display = "none";
        notFoundElement.style.display = "block";
        console.error("Terjadi kesalahan:", error);
      });
  });
});








