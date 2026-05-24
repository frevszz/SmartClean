document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("tableBody");
  const statRevenue = document.getElementById("statRevenue");
  const statOrders = document.getElementById("statOrders");
  const statVolume = document.getElementById("statVolume");
  const btnClear = document.getElementById("btnClear");

  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  const formatRupiah = (angka) => {
    return "Rp " + new Intl.NumberFormat("id-ID").format(angka);
  };

  const renderDashboard = () => {
    const orders = JSON.parse(localStorage.getItem("smartclean_orders")) || [];
    tableBody.innerHTML = "";
    let totalRevenue = 0;
    let totalOrders = orders.length;
    let totalVolume = 0;

    if (orders.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="py-8 text-center text-sm text-[#64748B]">Belum ada transaksi masukan data lewat menu "Orders".</td>
                </tr>`;
    } else {
      orders.forEach((order, index) => {
        if (order.status === "Paid") totalRevenue += order.totalPrice;
        totalVolume += order.weight;

        const tr = document.createElement("tr");
        tr.className = "hover:bg-[#F8FAFC] transition";

        const selectStyle =
          order.status === "Paid"
            ? "bg-[#ECFDF5] text-[#10B981] border-[#10B981]"
            : "bg-[#FFFBEB] text-[#F59E0B] border-[#F59E0B]";

        tr.innerHTML = `
                    <td class="py-4 px-6 font-medium text-[#0F172A]">${order.id}</td>
                    <td class="py-4 px-6">${order.name}</td>
                    <td class="py-4 px-6">${order.weight.toFixed(1)} kg</td>
                    <td class="py-4 px-6">${formatRupiah(order.totalPrice)}</td>
                    <td class="py-4 px-6">
                        <select data-index="${index}" class="status-select px-2.5 py-1 text-xs font-semibold rounded-full border outline-none cursor-pointer transition ${selectStyle}">
                            <option value="Paid" ${order.status === "Paid" ? "selected" : ""}>Paid</option>
                            <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                        </select>
                    </td>
                `;
        tableBody.appendChild(tr);
      });
    }

    statRevenue.textContent = formatRupiah(totalRevenue);
    statOrders.textContent = totalOrders;
    statVolume.textContent = `${totalVolume.toFixed(1)} kg`;

    document.querySelectorAll(".status-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const orderIndex = e.target.getAttribute("data-index");
        const newStatus = e.target.value;
        let currentOrders =
          JSON.parse(localStorage.getItem("smartclean_orders")) || [];
        currentOrders[orderIndex].status = newStatus;
        localStorage.setItem(
          "smartclean_orders",
          JSON.stringify(currentOrders),
        );
        renderDashboard();
      });
    });
  };

  const toggleSidebar = () => {
    sidebar.classList.toggle("-translate-x-full");
    sidebarOverlay.classList.toggle("hidden");
  };

  if (menuToggle) menuToggle.addEventListener("click", toggleSidebar);
  if (menuClose) menuClose.addEventListener("click", toggleSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", toggleSidebar);

  btnClear.addEventListener("click", () => {
    if (confirm("Apakah kamu yakin ingin menghapus semua data transaksi?")) {
      localStorage.removeItem("smartclean_orders");
      renderDashboard();
    }
  });

  renderDashboard();
});
