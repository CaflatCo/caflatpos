class InventoryItem {

  constructor(data = {}) {

    this.id =
      data.id || generateId();

    this.sku =
      data.sku || '';

    this.name =
      data.name || '';

    this.category =
      data.category || '';

    this.stock =
      Number(data.stock || 0);

    this.reorderLevel =
      Number(data.reorderLevel || 0);

  }

}

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

  const tableBody =
    safeQuery(
      '#inventoryTable tbody'
    );

  if (!tableBody) return;

  const inventory =
    getInventory();

  tableBody.innerHTML = '';

  if (!inventory.length) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="6">
          No inventory items found
        </td>
      </tr>
    `;

    return;

  }

  inventory.forEach(item => {

    const row =
      document.createElement(
        'tr'
      );

    row.innerHTML = `

      <td>${item.sku}</td>

      <td>${item.name}</td>

      <td>${item.category}</td>

      <td>${item.stock}</td>

      <td>${item.reorderLevel}</td>

      <td>

        <button
          class="btn btn-sm"
          onclick="editInventory('${item.id}')">

          Edit

        </button>

        <button
          class="btn btn-sm"
          onclick="adjustInventory('${item.id}')">

          Adjust

        </button>

      </td>

    `;

    tableBody.appendChild(
      row
    );

  });

}

function editInventory(id) {

  const item =
    getInventory().find(
      inventory =>
        String(inventory.id) ===
        String(id)
    );

  if (!item) {

    return;

  }

  alert(
    `Editing inventory item: ${item.name}`
  );

}

function adjustInventory(id) {

  const item =
    getInventory().find(
      inventory =>
        String(inventory.id) ===
        String(id)
    );

  if (!item) {

    return;

  }

  const amount =
    Number(
      prompt(
        'Adjustment amount:'
      )
    );

  if (isNaN(amount)) {

    showNotification(
      'Invalid adjustment',
      'error'
    );

    return;

  }

  item.stock += amount;

  setInventory(
    [...getInventory()]
  );

  renderInventoryTable();

  showNotification(
    'Inventory adjusted',
    'success'
  );

}

document.addEventListener(

  'DOMContentLoaded',

  renderInventoryTable

);