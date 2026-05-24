document.addEventListener("DOMContentLoaded", () => {
  const inputName = document.getElementById("inputName");
  const inputPhone = document.getElementById("inputPhone");
  const inputWeight = document.getElementById("inputWeight");
  const selectService = document.getElementById("selectService");

  const receiptOrderID = document.getElementById("receiptOrderID");
  const receiptName = document.getElementById("receiptName");
  const receiptPhone = document.getElementById("receiptPhone");
  const receiptService = document.getElementById("receiptService");
  const receiptFragrance = document.getElementById("receiptFragrance");
  const receiptWeight = document.getElementById("receiptWeight");
  const receiptPricePerKg = document.getElementById("receiptPricePerKg");
  const receiptSubtotal = document.getElementById("receiptSubtotal");
  const receiptTax = document.getElementById("receiptTax");
  const receiptTotal = document.getElementById("receiptTotal");
  const qrisText = document.getElementById("qrisText");
  const btnSave = document.getElementById("btnSave");

  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  const generateOrderID = () => {
    const rand = Math.floor(100 + Math.random() * 900);
    return `ORD-2026-0523-${rand}`;
  };
  const currentOrderID = generateOrderID();
  if (receiptOrderID) receiptOrderID.textContent = currentOrderID;

  const formatRupiah = (angka) => {
    return "Rp " + new Intl.NumberFormat("id-ID").format(angka);
  };

  const updateReceipt = () => {
    const name = inputName.value || "-";
    const phone = inputPhone.value ? `+62 ${inputPhone.value}` : "-";
    const weight = parseFloat(inputWeight.value) || 0;
    const pricePerKg = parseInt(selectService.value);
    const serviceText =
      selectService.options[selectService.selectedIndex].text.split(" -")[0];

    const subtotal = weight * pricePerKg;
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + tax;

    if (receiptName) receiptName.textContent = name;
    if (receiptPhone) receiptPhone.textContent = phone;
    if (receiptService) receiptService.textContent = serviceText;
    if (receiptWeight) receiptWeight.textContent = `${weight} kg`;
    if (receiptPricePerKg)
      receiptPricePerKg.textContent = formatRupiah(pricePerKg);
    if (receiptSubtotal) receiptSubtotal.textContent = formatRupiah(subtotal);
    if (receiptTax) receiptTax.textContent = formatRupiah(tax);
    if (receiptTotal) receiptTotal.textContent = formatRupiah(total);
    if (qrisText) qrisText.textContent = `Scan to pay ${formatRupiah(total)}`;
  };

  inputName.addEventListener("input", updateReceipt);
  inputPhone.addEventListener("input", updateReceipt);
  inputWeight.addEventListener("input", updateReceipt);
  selectService.addEventListener("change", updateReceipt);

  const toggleSidebar = () => {
    sidebar.classList.toggle("-translate-x-full");
    sidebarOverlay.classList.toggle("hidden");
  };

  if (menuToggle) menuToggle.addEventListener("click", toggleSidebar);
  if (menuClose) menuClose.addEventListener("click", toggleSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", toggleSidebar);

  btnSave.addEventListener("click", () => {
    if (!inputName.value || !inputPhone.value || !inputWeight.value) {
      alert("Harap isi semua field bertanda bintang (*) terlebih dahulu!");
      return;
    }

    const weight = parseFloat(inputWeight.value);
    const pricePerKg = parseInt(selectService.value);
    const subtotal = weight * pricePerKg;
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + tax;

    const newOrder = {
      id: currentOrderID,
      name: inputName.value,
      weight: weight,
      totalPrice: total,
      status: "Pending",
    };

    let currentOrders =
      JSON.parse(localStorage.getItem("smartclean_orders")) || [];
    currentOrders.unshift(newOrder);
    localStorage.setItem("smartclean_orders", JSON.stringify(currentOrders));

    alert("Pesanan Berhasil Disimpan!");
    window.location.href = "index.html";
  });
});
