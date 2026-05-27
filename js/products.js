class Product {

  constructor(data = {}) {

    this.id =
      data.id || generateId();

    this.sku =
      data.sku || '';

    this.name =
      data.name || '';

    this.category =
      data.category || '';

    this.cost =
      Number(data.cost || 0);

    this.price =
      Number(data.price || 0);

    this.stock =
      Number(data.stock || 0);

    this.margin =
      Number(data.margin || 0);

    this.recipe =
      data.recipe || [];

  }

}

window.Product =
  Product;

function getProducts() {

  return APP_STATE.products || [];

}

function setProducts(products) {

  updateState(
    'products',
    () => products
  );

}

function renderProductsTable() {

  const tableBody =
    safeQuery(
      '#productsTable tbody'
    );

  if (!tableBody) return;

  const products =
    getProducts();

  tableBody.innerHTML = '';

  if (!products.length) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="8">
          No products found
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

      <td>${product.sku}</td>

      <td>${product.name}</td>

      <td>${product.category}</td>

      <td>${product.cost}</td>

      <td>${product.price}</td>

      <td>${product.margin}%</td>

      <td>${product.stock}</td>

      <td>

        <button
          class="btn btn-sm"
          onclick="editProduct('${product.id}')">

          Edit

        </button>

        <button
          class="btn btn-sm"
          onclick="deleteProduct('${product.id}')">

          Delete

        </button>

      </td>

    `;

    tableBody.appendChild(
      row
    );

  });

}

function collectRecipeItems() {

  const rows =
    document.querySelectorAll(
      '#recipeBuilder .recipe-row'
    );

  return [...rows].map(row => {

    return {

      ingredientId:
        row.querySelector(
          '.recipe-ingredient'
        )?.value || '',

      quantity:
        Number(
          row.querySelector(
            '.recipe-qty'
          )?.value || 0
        )

    };

  });

}

function saveProduct() {

  const cost =
    Number(
      safeGetById(
        'productCost'
      )?.value || 0
    );

  const price =
    Number(
      safeGetById(
        'productPrice'
      )?.value || 0
    );

  const margin =

    price > 0

      ? (

          (
            (price - cost) /
            price
          ) * 100

        ).toFixed(2)

      : 0;

  const product =

    new Product({

      sku:
        safeGetById(
          'productSKU'
        )?.value,

      name:
        safeGetById(
          'productNameInput'
        )?.value,

      category:
        safeGetById(
          'productCategory'
        )?.value,

      cost,

      price,

      stock:
        Number(
          safeGetById(
            'productStock'
          )?.value || 0
        ),

      margin,

      recipe:
        collectRecipeItems()

    });

  const products =
    getProducts();

  products.push(
    product
  );

  setProducts(
    products
  );

  renderProductsTable();

  closeModal(
    'productModal'
  );

  showNotification(
    'Product saved',
    'success'
  );

}

function editProduct(id) {

  const product =
    getProducts().find(
      item =>
        String(item.id) ===
        String(id)
    );

  if (!product) {

    return;

  }

  safeGetById(
    'productSKU'
  ).value =
    product.sku;

  safeGetById(
    'productNameInput'
  ).value =
    product.name;

  safeGetById(
    'productCategory'
  ).value =
    product.category;

  safeGetById(
    'productCost'
  ).value =
    product.cost;

  safeGetById(
    'productPrice'
  ).value =
    product.price;

  safeGetById(
    'productStock'
  ).value =
    product.stock;

  deleteProduct(id);

  openModal(
    'productModal'
  );

}

function deleteProduct(id) {

  const products =

    getProducts().filter(
      product =>

        String(
          product.id
        ) !==

        String(id)
    );

  setProducts(
    products
  );

  renderProductsTable();

}

document.addEventListener(

  'DOMContentLoaded',

  renderProductsTable

);