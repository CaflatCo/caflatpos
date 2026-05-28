function renderInventoryTable() {

  const tableBody =
    document.querySelector(
      '#inventoryTable tbody'
    );

  if (!tableBody)
    return;

  const ingredients =
    getIngredients();

  tableBody.innerHTML =
    '';

  if (!ingredients.length) {

    tableBody.innerHTML = `

      <tr>

        <td
          colspan="8"
          class="empty-state">

          No inventory found

        </td>

      </tr>

    `;

    return;

  }

  ingredients.forEach(
    ingredient => {

      const stock =
        Number(
          ingredient.stock || 0
        );

      const reorderLevel =
        Number(
          ingredient.reorderLevel || 0
        );

      const lowStock =
        stock <= reorderLevel;

      const row =
        document.createElement(
          'tr'
        );

      if (lowStock) {

        row.classList.add(
          'low-stock-row'
        );

      }

      row.innerHTML = `

        <td>

          ${ingredient.name}

        </td>

        <td>

          ${ingredient.unit}

        </td>

        <td>

          ${ingredient.packageQuantity}

        </td>

        <td>

          ${formatCurrency(
            ingredient.packageCost
          )}

        </td>

        <td>

          ${stock}

        </td>

        <td>

          ${reorderLevel}

        </td>

        <td>

          ${lowStock

            ? `
              <span class="badge-low-stock">
                Low Stock
              </span>
            `

            : `
              <span class="badge dark">
                OK
              </span>
            `
          }

        </td>

        <td>

          <div class="table-actions">

            <button
              class="btn btn-sm"
              onclick="restockIngredient('${ingredient.id}')">

              Restock

            </button>

          </div>

        </td>

      `;

      tableBody.appendChild(
        row
      );

    }
  );

}

function restockIngredient(
  ingredientId
) {

  const ingredient =
    getIngredients().find(
      item =>

        String(item.id)
        ===
        String(ingredientId)
    );

  if (!ingredient)
    return;

  const quantity =
    prompt(
      `Add stock for ${ingredient.name}`
    );

  if (
    quantity === null
  ) {
    return;
  }

  const amount =
    safeNumber(
      quantity
    );

  if (
    amount <= 0
  ) {

    showNotification(
      'Invalid quantity',
      'error'
    );

    return;

  }

  const updated =
    getIngredients().map(
      item => {

        if (
          String(item.id)
          !==
          String(ingredientId)
        ) {

          return item;

        }

        return {

          ...item,

          stock:

            Number(
              item.stock || 0
            )

            +

            amount

        };

      }
    );

  setIngredients(
    updated
  );

  showNotification(
    'Ingredient restocked',
    'success'
  );

}

function renderLowStockAlerts() {

  const container =
    document.getElementById(
      'lowStockContainer'
    );

  if (!container)
    return;

  const lowStockItems =
    getIngredients().filter(
      ingredient =>

        Number(
          ingredient.stock || 0
        )

        <=

        Number(
          ingredient.reorderLevel || 0
        )
    );

  container.innerHTML =
    '';

  if (
    !lowStockItems.length
  ) {

    container.innerHTML = `

      <div class="empty-state">

        No low stock alerts

      </div>

    `;

    return;

  }

  lowStockItems.forEach(
    ingredient => {

      const card =
        document.createElement(
          'div'
        );

      card.className =
        'low-stock-card';

      card.innerHTML = `

        <div class="low-stock-name">

          ${ingredient.name}

        </div>

        <div class="low-stock-meta">

          ${ingredient.stock}
          ${ingredient.unit} left

        </div>

      `;

      container.appendChild(
        card
      );

    }
  );

}

window.renderInventoryTable =
  renderInventoryTable;

window.renderLowStockAlerts =
  renderLowStockAlerts;

window.restockIngredient =
  restockIngredient;