function getInventory() {

  return APP_STATE.inventory || [];

}

function setInventory(inventory) {

  updateState(
    'inventory',
    () => inventory
  );

}

function renderInventoryTable() {

  const tableBody = safeQuery(
    '#inventoryTable tbody'
  );

  if (!tableBody) return;

  const inventory = getInventory();

  tableBody.innerHTML = '';

  if (!inventory.length) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          No inventory items found
        </td>
      </tr>
    `;

    return;

  }

  inventory.forEach(item => {

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.sku || '-'}</td>
      <td>${item.name || '-'}</td>
      <td>${item.category || '-'}</td>
      <td>${item.stock || 0}</td>
      <td>${item.reorderLevel || 0}</td>

      <td>
        <button
          class="btn btn-sm"
          onclick="adjustInventory('${item.id}')">
          Adjust
        </button>
      </td>
    `;

    tableBody.appendChild(row);

  });

}

async function adjustInventory(itemId) {

  const amount = Number(
    prompt(
      'Enter adjustment amount:'
    )
  );

  if (isNaN(amount)) {

    showNotification(
      'Invalid inventory adjustment',
      'error'
    );

    return;

  }

  const result =
    await executeCommand(
      'adjustInventory',
      {

        itemId,

        amount

      }
    );

  if (!result) {

    logError(
      'Inventory adjustment failed'
    );

    return;

  }

  safeRender(
    'inventory-table',

    () => {

      renderInventoryTable();

    }
  );

}

function getLowStockItems() {

  return getInventory().filter(item => {

    return (
      Number(item.stock || 0) <=
      Number(item.reorderLevel || 0)
    );

  });

}

document.addEventListener(
  'DOMContentLoaded',
  renderInventoryTable
);

registerCommand(
  'adjustInventory',

  async payload => {

    return await runTransaction(
      'adjust-inventory',

      async () => {

        const {
          itemId,
          amount
        } = payload;

        createAuditEntry(
          'inventory_adjusted',
          {

            itemId,

            amount

          }
        );

        updateState(
          'inventory',

          currentInventory => {

            return currentInventory.map(
              item => {

                if (
                  item.id !== itemId
                ) {

                  return item;

                }

                return {

                  ...item,

                  stock:
                    Number(
                      item.stock || 0
                    ) + amount

                };

              }
            );

          }
        );

        const updatedItem =
          getInventory().find(
            item =>
              item.id === itemId
          );

        if (
          updatedItem &&
          Number(updatedItem.stock) <=
          Number(
            updatedItem.reorderLevel || 0
          )
        ) {

          showNotification(
            `${updatedItem.name} is low on stock`,
            'warning'
          );

        } else {

          showNotification(
            'Inventory updated successfully',
            'info'
          );

        }

        emitEvent(
          'inventoryAdjusted',
          {

            itemId,

            amount

          }
        );

        return true;

      }
    );

  }
);
