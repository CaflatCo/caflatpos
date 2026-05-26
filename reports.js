function getSales() {

  return APP_STATE.sales || [];

}

function calculateTotalRevenue() {

  const cachedRevenue =
    getCache(
      'totalRevenue'
    );

  if (cachedRevenue !== null) {

    return cachedRevenue;

  }

  const revenue =
    measurePerformance(
      'calculate-total-revenue',

      () => {

        const sales =
          getSales();

        return sales.reduce(
          (total, sale) => {

            return (
              total +
              Number(
                sale.total || 0
              )
            );

          },
          0
        );

      }
    );

  setCache(
    'totalRevenue',
    revenue
  );

  return revenue;

}

function calculateTotalOrders() {

  const cachedOrders =
    getCache(
      'totalOrders'
    );

  if (cachedOrders !== null) {

    return cachedOrders;

  }

  const orders =
    measurePerformance(
      'calculate-total-orders',

      () => {

        return getSales().length;

      }
    );

  setCache(
    'totalOrders',
    orders
  );

  return orders;

}

function calculateAverageOrderValue() {

  const cachedAverage =
    getCache(
      'averageOrderValue'
    );

  if (cachedAverage !== null) {

    return cachedAverage;

  }

  const average =
    measurePerformance(
      'calculate-average-order',

      () => {

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
    );

  setCache(
    'averageOrderValue',
    average
  );

  return average;

}

function getTopProducts() {

  const cachedProducts =
    getCache(
      'topProducts'
    );

  if (cachedProducts !== null) {

    return cachedProducts;

  }

  const products =
    measurePerformance(
      'calculate-top-products',

      () => {

        const sales =
          getSales();

        const productMap = {};

        sales.forEach(sale => {

          sale.items.forEach(item => {

            if (
              !productMap[item.name]
            ) {

              productMap[item.name] = 0;

            }

            productMap[item.name] +=
              Number(
                item.quantity || 0
              );

          });

        });

        return Object.entries(
          productMap
        )
          .sort(
            (a, b) =>
              b[1] - a[1]
          )
          .slice(0, 5);

      }
    );

  setCache(
    'topProducts',
    products
  );

  return products;

}

function updateDashboardStats() {

  safeRender(
    'dashboard-stats',

    () => {

      const revenueElement =
        safeGetById(
          'dashboardRevenue'
        );

      const ordersElement =
        safeGetById(
          'dashboardOrders'
        );

      const averageElement =
        safeGetById(
          'dashboardAverage'
        );

      const revenue =
        calculateTotalRevenue();

      const orders =
        calculateTotalOrders();

      const average =
        calculateAverageOrderValue();

      if (revenueElement) {

        revenueElement.textContent =
          formatCurrency(
            revenue
          );

      }

      if (ordersElement) {

        ordersElement.textContent =
          orders;

      }

      if (averageElement) {

        averageElement.textContent =
          formatCurrency(
            average
          );

      }

      trackMetric(
        'dashboard_updated',

        {

          revenue,

          orders,

          average

        }
      );

    }
  );

}

function refreshReportsCache() {

  clearCache(
    'totalRevenue'
  );

  clearCache(
    'totalOrders'
  );

  clearCache(
    'averageOrderValue'
  );

  clearCache(
    'topProducts'
  );

}

document.addEventListener(
  '