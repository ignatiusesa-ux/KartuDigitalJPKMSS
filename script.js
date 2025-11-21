document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("searchInput");
    const pesertaList = document.getElementById("pesertaList");
    const resultSection = document.getElementById("resultSection");
    const nomorKartu = document.getElementById("nomorKartu");
    const namaPeserta = document.getElementById("namaPeserta");
    const tanggalLahir = document.getElementById("tanggalLahir");
    const alamatPeserta = document.getElementById("alamatPeserta");
    const statusKepesertaan = document.getElementById("statusKepesertaan");
    const masaAktif = document.getElementById("masaAktif");
    const jenisKelamin = document.getElementById("jenisKelamin");
    const agama = document.getElementById("agama");

    let pesertaData = [];

    // ==============================
    // LOAD DATA JSON (PERBAIKAN DISINI)
    // ==============================
    try {
        const response = await fetch("https://raw.githubusercontent.com/ignatiusesa-ux/KartuDigitalJPKMSS/main/Peserta%20JPKM%20s.d%2010%20Juli%202025%20New.json");

        pesertaData = await response.json();
    } catch (error) {
        console.error("Gagal load data peserta untuk autocomplete:", error);
    }

    // ==================================
    // EVENT: KETIK UNTUK AUTOCOMPLETE
    // ==================================
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        pesertaList.innerHTML = "";

        if (query === "") {
            pesertaList.classList.add("hidden");
            return;
        }

        const filtered = pesertaData.filter(p =>
            p.nama_lengkap.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            pesertaList.classList.add("hidden");
            return;
        }

        filtered.forEach(p => {
            const li = document.createElement("li");
            li.textContent = p.nama_lengkap;
            li.classList.add("p-2", "hover:bg-gray-200", "cursor-pointer");
            pesertaList.appendChild(li);

            li.addEventListener("click", () => {
                searchInput.value = p.nama_lengkap;
                pesertaList.classList.add("hidden");
                tampilkanData(p.nama_lengkap);
            });
        });

        pesertaList.classList.remove("hidden");
    });

    // ==================================
    // TAMPILKAN DATA PESERTA
    // ==================================
    function tampilkanData(nama) {
        const peserta = pesertaData.find(p => p.nama_lengkap === nama);

        if (!peserta) {
            alert("Data peserta tidak ditemukan!");
            return;
        }

        nomorKartu.textContent = peserta.nomor_kartu || "-";
        namaPeserta.textContent = peserta.nama_lengkap || "-";
        tanggalLahir.textContent = peserta.tanggal_lahir || "-";
        alamatPeserta.textContent = peserta.alamat || "-";
        statusKepesertaan.textContent = peserta.status || "-";
        masaAktif.textContent = peserta.masa_aktif || "-";
        jenisKelamin.textContent = peserta.jenis_kelamin || "-";
        agama.textContent = peserta.agama || "-";

        resultSection.classList.remove("hidden");
    }
});
