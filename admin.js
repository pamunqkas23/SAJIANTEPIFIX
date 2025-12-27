// 🔒 CEK LOGIN ADMIN
if (!localStorage.getItem("adminLogin")) {
  location.href = "login-admin.html";
}

/* ================= DATA ================= */
let products = JSON.parse(localStorage.getItem("products")) || [];
let history = JSON.parse(localStorage.getItem("riwayat")) || [];

/* ================= SIMPAN ================= */
function save() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("riwayat", JSON.stringify(history)); // ✅ FIX
}

/* ================= TAMBAH BARANG ================= */
function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = parseInt(document.getElementById("price").value);
  const category = document.getElementById("category").value;

  if (!name || isNaN(price)) {
    alert("Lengkapi data");
    return;
  }

  products.push({ name, price, category });
  save();
  renderDelete();

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";

  alert("Barang ditambahkan");
}

/* ================= HAPUS BARANG ================= */
function renderDelete() {
  const sel = document.getElementById("deleteProduct");
  sel.innerHTML = "";

  products.forEach((p, i) => {
    sel.innerHTML += `<option value="${i}">${p.name} (${p.category})</option>`;
  });
}
function deleteProduct() {
  const idx = document.getElementById("deleteProduct").value;
  const p = products[idx];
  const ok = confirm(`Hapus barang?\n\n${p.name} (${p.category}) - ${formatRupiah(p.price)}`);
  if (!ok) return;

  products.splice(idx, 1);
  save();
  renderDelete();
}

/* ================= RIWAYAT ================= */
function formatRupiah(num) {
  return "Rp" + Number(num).toLocaleString("id-ID");
}
function renderHistory() {
  const div = document.getElementById("history");
  div.innerHTML = "";

  history.forEach((h, i) => {
    div.innerHTML += `
      <div class="row">
        <span>${h.tanggal} - ${formatRupiah(h.total)}</span>

        <button onclick="deleteHistory(${i})">Hapus</button>
      </div>
    `;
  });
}

function deleteHistory(i) {
  const h = history[i];
  const ok = confirm(
    `Hapus transaksi?\n\n${h.tanggal}\nTotal: ${formatRupiah(h.total)}`
  );

  if (!ok) return;

  history.splice(i, 1);
  save();
  renderHistory();
}

function clearHistory() {
  if (confirm("Hapus semua riwayat?")) {
    history = [];
    save();
    renderHistory();
  }
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("adminLogin");
  location.href = "index.html"; // ⬅️ BALIK KE SPLASH
}

/* ================= INIT ================= */
renderDelete();
renderHistory();

/* ================= LAPORAN ================= */
function laporanHarian() {
  const tgl = document.getElementById("filterTanggal").value;
  if (!tgl) return alert("Pilih tanggal");

  let total = 0;
  let jumlah = 0;

  history.forEach(h => {
    const tanggal = new Date(h.tanggal).toISOString().slice(0,10);
    if (tanggal === tgl) {
      total += h.total;
      jumlah++;
    }
  });

  document.getElementById("hasilLaporan").innerHTML = `
    <b>Laporan ${tgl}</b><br>
    Transaksi: ${jumlah}<br>
    Omzet: ${formatRupiah(total)}
  `;
}
function formatInputHarga() {
  const input = document.getElementById("price");
  // Ambil angka saja
  let angka = input.value.replace(/[^0-9]/g, "");
  if (angka) {
    // ubah ke format Rp dengan titik ribuan
    input.value = formatRupiah(parseInt(angka));
  } else {
    input.value = "";
  }
}
function formatRupiah(num) {
  return "Rp" + Number(num).toLocaleString("id-ID");
}
