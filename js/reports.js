function getSales() {

  return APP_STATE.sales || [];

}

function getLowStockProducts() {

  return getProducts().filter(

    product =>

      Number(product.stock || 0)

      <=

      Number(
        product.lowStockThreshold || 0
      )

  );

}

function getLowStockIngredients() {

  return getIngredients().filter(

    ingredient =>

      Number(ingredient.stock || 0)

      <=

      Number(
        ingredient.reorderLevel || 0
      )

  );

}

function calculateTotalRevenue() {

  return getSales().reduce(

    (total, sale) =>

      total +

      Number(sale.total || 0),

    0

  );

}

function calculateTotalOrders() {

  return getSales().length;

}

function calculateAverageOrderValue() {

  const sales =
    getSales();

  if (!sales.length) {

    return 0;

  }

  return (

    calculateTotalRevenue() /

    sales.length

  );

}

function getTopProducts() {

  const sales =
    getSales();

  const map = {};

  sales.forEach(sale => {

    sale.items.forEach(item => {

      if (!map[item.name]) {

        map[item.name] = {

          quantity: 0,

          revenue: 0

        };

      }

      map[item.name].quantity +=

        Number(
          item.quantity || 0
        );

      map[item.name].revenue +=

        Number(item.price || 0) *

        Number(item.quantity || 0);

    });

  });

  return Object.entries(map)

    .map(([name, data]) => ({

      name,

      quantity:
        data.quantity,

      revenue:
        data.revenue

    }))

    .sort(
      (a, b) =>

        b.quantity - a.quantity
    )

    .slice(0, 5);

}

function updateDashboardStats() {

  const statsGrid =
    safeGetById(
      'statsGrid'
    );

  if (!statsGrid) return;

  const revenue =
    calculateTotalRevenue();

  const orders =
    calculateTotalOrders();

  const average =
    calculateAverageOrderValue();

  const lowStockCount =

    getLowStockProducts().length +

    getLowStockIngredients().length;

  statsGrid.innerHTML = `

    <div class="stat-card">
      <div class="stat-label">
        Revenue
      </div>
      <div class="stat-value">
        ${formatCurrency(revenue)}
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-label">
        Orders
      </div>
      <div class="stat-value">
        ${orders}
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-label">
        Average Order
      </div>
      <div class="stat-value">
        ${formatCurrency(average)}
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-label">
        Low Stock Alerts
      </div>
      <div class="stat-value">
        ${lowStockCount}
      </div>
    </div>

  `;

  renderLowStockTable();

  renderTopProducts();

}

function renderTopProducts() {

  const table =
    safeQuery(
      '#topProductsTable tbody'
    );

  if (!table) return;

  table.innerHTML = '';

  const products =
    getTopProducts();

  if (!products.length) {

    table.innerHTML = `

      <tr>

        <td colspan="4">

          No sales yet

        </td>

      </tr>

    `;

    return;

  }

  products.forEach(product => {

    const row =
      document.createElement(
        'tr'
      );

    row.innerHTML = `

      <td>
        ${product.name}
      </td>

      <td>
        ${product.quantity}
      </td>

      <td>
        ${formatCurrency(
          product.revenue
        )}
      </td>

      <td>
        —
      </td>

    `;

    table.appendChild(row);

  });

}

function renderLowStockTable() {

  const table =
    safeQuery(
      '#lowStockTable tbody'
    );

  if (!table) return;

  table.innerHTML = '';

  const productAlerts =
    getLowStockProducts();

  const ingredientAlerts =
    getLowStockIngredients();

  const alerts = [

    ...productAlerts.map(item => ({

      name: item.name,

      stock: item.stock,

      reorder:
        item.lowStockThreshold,

      type: 'Product'

    })),

    ...ingredientAlerts.map(item => ({

      name: item.name,

      stock: item.stock,

      reorder:
        item.reorderLevel,

      type: 'Ingredient'

    }))

  ];

  if (!alerts.length) {

    table.innerHTML = `

      <tr>

        <td colspan="4">

          No low stock alerts

        </td>

      </tr>

    `;

    return;

  }

  alerts.forEach(alert => {

    const row =
      document.createElement(
        'tr'
      );

    row.innerHTML = `

      <td>
        ${alert.name}
      </td>

      <td>
        ${alert.stock}
      </td>

      <td>
        ${alert.reorder}
      </td>

      <td>

        <span class="badge-low-stock">

          LOW STOCK

        </span>

      </td>

    `;

    table.appendChild(row);

  });

}

function refreshDashboard() {

  updateDashboardStats();

}

document.addEventListener(

  'DOMContentLoaded',

  () => {

    refreshDashboard();

  }

);

window.refreshDashboard =
  refreshDashboard;