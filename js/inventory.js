function getInventoryItems() {

  return APP_STATE.ingredients || [];

}

function renderInventoryTable() {

  const tableBody =
    document.querySelector(
      '#inventoryTable tbody'
    );

  if (!tableBody) return;

  tableBody.innerHTML = '';

  const inventory =
    getInventoryItems();

  if (!inventory.length) {

    tableBody.innerHTML = `

      <tr>

        <td
          colspan="7"
          class="empty-state centered-empty-state">

          No inventory items found

        </td>

      </tr>

    `;

    return;

  }

  inventory.forEach(item => {

    const stock =
      Number(item.stock || 0);

    const reorderLevel =
      Number(
        item.reorderLevel || 0
      );

    const row =
      document.createElement(
        'tr'
      );

    if (
      stock <= reorderLevel
    ) {

      row.classList.add(
        'low-stock-row'
      );

    }

    row.innerHTML = `

      <td>

        ${item.name || '-'}

      </td>

      <td>

        ${item.unit || 'g'}

      </td>

      <td>

        ${Number(
          item.packageQty || 0
        )}

      </td>

      <td>

        ${formatCurrency(
          Number(
            item.packageCost || 0
          )
        )}

      </td>

      <td>

        ${stock}

      </td>

      <td>

        ${reorderLevel}

      </td>

      <td>

        ${
          stock <= reorderLevel

            ? `
              <span class="stock-alert-badge">
                LOW STOCK
              </span>
            `

            : `
              <span class="stock-ok-badge">
                OK
              </span>
            `
        }

      </td>

    `;

    tableBody.appendChild(row);

  });

}

function restockIngredient(
  ingredientId,
  quantity
) {

  const ingredients =
    getInventoryItems().map(
      ingredient => {

        if (

          String(ingredient.id)
          !==
          String(ingredientId)

        ) {

          return ingredient;

        }

        return {

          ...ingredient,

          stock:

            Number(
              ingredient.stock || 0
            )

            +

            Number(quantity || 0),

          updatedAt:
            new Date().toISOString()

        };

      }
    );

  updateState(
    'ingredients',
    () => ingredients
  );

  renderInventoryTable();

  renderIngredientsTable();

}

function reduceIngredientStock(
  ingredientId,
  quantity
) {

  const ingredients =
    getInventoryItems().map(
      ingredient => {

        if (

          String(ingredient.id)
          !==
          String(ingredientId)

        ) {

          return ingredient;

        }

        return {

          ...ingredient,

          stock: Math.max(

            0,

            Number(
              ingredient.stock || 0
            )

            -

            Number(quantity || 0)

          ),

          updatedAt:
            new Date().toISOString()

        };

      }
    );

  updateState(
    'ingredients',
    () => ingredients
  );

  renderInventoryTable();

  renderIngredientsTable();

}

function getLowStockIngredients() {

  return getInventoryItems().filter(
    ingredient =>

      Number(
        ingredient.stock || 0
      )

      <=

      Number(
        ingredient.reorderLevel || 0
      )
  );

}

function renderLowStockAlerts() {

  const container =
    document.getElementById(
      'lowStockAlerts'
    );

  if (!container) return;

  const alerts =
    getLowStockIngredients();

  container.innerHTML = '';

  if (!alerts.length) {

    container.innerHTML = `

      <div class="empty-state centered-empty-state">

        No low stock alerts

      </div>

    `;

    return;

  }

  alerts.forEach(item => {

    const alert =
      document.createElement(
        'div'
      );

    alert.className =
      'inventory-alert-item';

    alert.innerHTML = `

      <div class="inventory-alert-left">

        <div class="inventory-alert-name">

          ${item.name}

        </div>

        <div class="inventory-alert-meta">

          ${item.stock}
          ${item.unit || 'g'}
          remaining

        </div>

      </div>

      <div class="inventory-alert-right">

        Reorder at
        ${item.reorderLevel}

      </div>

    `;

    container.appendChild(alert);

  });

}

document.addEventListener(
  'DOMContentLoaded',
  () => {

    renderInventoryTable();

    renderLowStockAlerts();

  }
);

window.getInventoryItems =
  getInventoryItems;

window.renderInventoryTable =
  renderInventoryTable;

window.restockIngredient =
  restockIngredient;

window.reduceIngredientStock =
  reduceIngredientStock;

window.getLowStockIngredients =
  getLowStockIngredients;

window.renderLowStockAlerts =
  renderLowStockAlerts;