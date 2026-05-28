function getSales() {

  return Array.isArray(
    APP_STATE.sales
  )

    ? APP_STATE.sales

    : [];

}

function calculateReportMetrics() {

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

  const totalItemsSold =
    sales.reduce(
      (sum, sale) =>

        sum +

        (
          Array.isArray(
            sale.items
          )

            ? sale.items.reduce(
                (
                  itemSum,
                  item
                ) =>

                  itemSum +

                  Number(
                    item.quantity || 0
                  ),

                0
              )

            : 0
        ),

      0
    );

  const averageOrderValue =

    totalOrders > 0

      ? totalSales /
        totalOrders

      : 0;

  return {

    totalSales,

    totalOrders,

    totalItemsSold,

    averageOrderValue

  };

}

function refreshDashboard() {

  const metrics =
    calculateReportMetrics();

  const totalSalesEl =
    document.getElementById(
      'dashboardTotalSales'
    );

  const totalOrdersEl =
    document.getElementById(
      'dashboardTotalOrders'
    );

  const totalItemsEl =
    document.getElementById(
      'dashboardItemsSold'
    );

  const averageOrderEl =
    document.getElementById(
      'dashboardAverageOrder'
    );

  if (totalSalesEl) {

    totalSalesEl.textContent =
      formatCurrency(
        metrics.totalSales
      );

  }

  if (totalOrdersEl) {

    totalOrdersEl.textContent =
      metrics.totalOrders;

  }

  if (totalItemsEl) {

    totalItemsEl.textContent =
      metrics.totalItemsSold;

  }

  if (averageOrderEl) {

    averageOrderEl.textContent =
      formatCurrency(
        metrics.averageOrderValue
      );

  }

  renderTopProducts();

}

function renderTopProducts() {

  const container =
    document.getElementById(
      'topProductsContainer'
    );

  if (!container)
    return;

  const sales =
    getSales();

  const totals = {};

  sales.forEach(
    sale => {

      if (
        !Array.isArray(
          sale.items
        )
      ) {
        return;
      }

      sale.items.forEach(
        item => {

          if (
            !totals[item.name]
          ) {

            totals[item.name] =
              0;

          }

          totals[item.name] +=
            Number(
              item.quantity || 0
            );

        }
      );

    }
  );

  const ranked =
    Object.entries(
      totals
    )

    .sort(
      (a, b) =>

        b[1] - a[1]
    )

    .slice(0, 5);

  container.innerHTML =
    '';

  if (!ranked.length) {

    container.innerHTML = `

      <div class="empty-state">

        No sales data yet

      </div>

    `;

    return;

  }

  ranked.forEach(
    ([name, qty]) => {

      const row =
        document.createElement(
          'div'
        );

      row.className =
        'top-product-row';

      row.innerHTML = `

        <div class="top-product-name">

          ${name}

        </div>

        <div class="top-product-qty">

          ${qty} sold

        </div>

      `;

      container.appendChild(
        row
      );

    }
  );

}

function exportSalesReport() {

  const sales =
    getSales();

  const lines = [

    [
      'Receipt',
      'Date',
      'Payment',
      'Subtotal',
      'Total'
    ].join(',')

  ];

  sales.forEach(
    sale => {

      lines.push([

        sale.receiptNumber,

        new Date(
          sale.createdAt
        ).toLocaleString(),

        sale.paymentMethod,

        Number(
          sale.subtotal || 0
        ),

        Number(
          sale.total || 0
        )

      ].join(','));

    }
  );

  downloadTextFile(

    `sales-report-${Date.now()}.csv`,

    lines.join('\n')

  );

  showNotification(
    'Sales report exported',
    'success'
  );

}

window.getSales =
  getSales;

window.refreshDashboard =
  refreshDashboard;

window.exportSalesReport =
  exportSalesReport;

window.renderTopProducts =
  renderTopProducts;