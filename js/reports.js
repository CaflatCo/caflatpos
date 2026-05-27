function getSales() {

  return APP_STATE.sales || [];

}

function renderSalesTable() {

  const tableBody =
    document.querySelector(
      '#salesTable tbody'
    );

  if (!tableBody) return;

  tableBody.innerHTML = '';

  const sales =
    getSales();

  if (!sales.length) {

    tableBody.innerHTML = `

      <tr>

        <td
          colspan="6"
          class="empty-state centered-empty-state">

          No sales found

        </td>

      </tr>

    `;

    return;

  }

  sales
    .slice()
    .reverse()
    .forEach(sale => {

      const row =
        document.createElement(
          'tr'
        );

      const itemCount =
        Array.isArray(sale.items)

          ? sale.items.reduce(
              (sum, item) =>

                sum +
                Number(
                  item.quantity || 0
                ),

              0
            )

          : 0;

      row.innerHTML = `

        <td>

          ${sale.receiptNumber || '-'}

        </td>

        <td>

          ${new Date(
            sale.createdAt
          ).toLocaleString()}

        </td>

        <td>

          ${itemCount}

        </td>

        <td>

          ${formatCurrency(
            Number(
              sale.subtotal || 0
            )
          )}

        </td>

        <td>

          ${formatCurrency(
            Number(
              sale.total || 0
            )
          )}

        </td>

        <td>

          <button
            class="btn btn-sm"
            type="button"
            onclick="viewSale('${sale.id}')">

            View

          </button>

        </td>

      `;

      tableBody.appendChild(row);

    });

}

function viewSale(id) {

  const sale =
    getSales().find(

      item =>

        String(item.id)
        ===
        String(id)

    );

  if (!sale) return;

  let itemsHtml = '';

  if (
    Array.isArray(sale.items)
  ) {

    sale.items.forEach(item => {

      itemsHtml += `

        <div class="receipt-line">

          <span>

            ${item.name}
            x${item.quantity}

          </span>

          <span>

            ${formatCurrency(

              Number(item.price || 0)
              *
              Number(item.quantity || 0)

            )}

          </span>

        </div>

      `;

    });

  }

  const modalBody =
    document.getElementById(
      'receiptBody'
    );

  if (!modalBody) return;

  modalBody.innerHTML = `

    <div class="receipt-header">

      <div class="receipt-brand">

        ${
          APP_STATE.settings
            ?.brandName ||

          'Caflat.Co POS'
        }

      </div>

      <div>

        ${sale.receiptNumber}

      </div>

      <div>

        ${new Date(
          sale.createdAt
        ).toLocaleString()}

      </div>

    </div>

    <div class="receipt-divider"></div>

    ${itemsHtml}

    <div class="receipt-divider"></div>

    <div class="receipt-line">

      <span>
        Subtotal
      </span>

      <span>

        ${formatCurrency(
          Number(
            sale.subtotal || 0
          )
        )}

      </span>

    </div>

    <div class="receipt-line receipt-total">

      <span>
        Total
      </span>

      <span>

        ${formatCurrency(
          Number(
            sale.total || 0
          )
        )}

      </span>

    </div>

  `;

  openModal(
    'receiptModal'
  );

}

function refreshDashboard() {

  const sales =
    getSales();

  const totalSales =
    sales.reduce(

      (sum, sale) =>

        sum +
        Number(
          sale.total || 0
        ),

      0

    );

  const totalOrders =
    sales.length;

  const totalProducts =
    Array.isArray(
      APP_STATE.products
    )

      ? APP_STATE.products.length

      : 0;

  const salesEl =
    document.getElementById(
      'dashboardSales'
    );

  const ordersEl =
    document.getElementById(
      'dashboardOrders'
    );

  const productsEl =
    document.getElementById(
      'dashboardProducts'
    );

  if (salesEl) {

    salesEl.textContent =
      formatCurrency(
        totalSales
      );

  }

  if (ordersEl) {

    ordersEl.textContent =
      totalOrders;

  }

  if (productsEl) {

    productsEl.textContent =
      totalProducts;

  }

}

document.addEventListener(
  'DOMContentLoaded',
  () => {

    renderSalesTable();

    refreshDashboard();

  }
);

window.getSales =
  getSales;

window.renderSalesTable =
  renderSalesTable;

window.viewSale =
  viewSale;

window.refreshDashboard =
  refreshDashboard;