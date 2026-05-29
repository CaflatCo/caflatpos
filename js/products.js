function getProducts() {
  return Array.isArray(APP_STATE.products) ? APP_STATE.products : [];
}

function setProducts(products) {
  updateState('products', () => Array.isArray(products) ? products : []);
  renderProductsTable();
  renderPOSProducts();
  refreshDashboard();
}

function getProductFormData() {
  return {
    id: getElementValue('productId') || generateId(),
    name: sanitizeText(getElementValue('productName')),
    category: sanitizeText(getElementValue('productCategory')),
    description: sanitizeText(getElementValue('productDescription')),
    price: safeNumber(getElementValue('productPrice')),
    stock: safeNumber(getElementValue('productStock')),
    reorderLevel: safeNumber(getElementValue('productReorderLevel')),
    variants: collectVariants(),
    recipe: collectRecipeRows(),
    createdAt: new Date().toISOString()
  };
}

function collectVariants() {
  const rows = document.querySelectorAll('.variant-row');
  return Array.from(rows)
    .map(row => {
      const name = sanitizeText(row.querySelector('.variant-name')?.value);
      const price = safeNumber(row.querySelector('.variant-price')?.value);
      if (!name) return null;
      return { id: generateId(), name, price };
    })
    .filter(Boolean);
}

function collectRecipeRows() {
  const rows = document.querySelectorAll('.recipe-row');
  return Array.from(rows)
    .map(row => {
      const ingredientId = row.querySelector('.recipe-ingredient')?.value;
      const quantity = safeNumber(row.querySelector('.recipe-qty')?.value);
      if (!ingredientId) return null;
      return { ingredientId, quantity };
    })
    .filter(Boolean);
}

function saveProduct() {
  const data = getProductFormData();

  if (!data.name) {
    showNotification('Product name is required', 'error');
    return;
  }

  if (!data.category) {
    showNotification('Category is required', 'error');
    return;
  }

  const products = getProducts();
  const existingIndex = products.findIndex(product => String(product.id) === String(data.id));

  if (existingIndex >= 0) {
    products[existingIndex] = data;
  } else {
    products.push(data);
  }

  setProducts(products);
  closeModal('productModal');
  clearProductForm();
  showNotification('Product saved successfully', 'success');
}

function clearProductForm() {
  setElementValue('productId', '');
  setElementValue('productName', '');
  setElementValue('productCategory', '');
  setElementValue('productDescription', '');
  setElementValue('productPrice', '');
  setElementValue('productStock', '');
  setElementValue('productReorderLevel', '');

  const variantContainer = document.getElementById('variantBuilder');
  if (variantContainer) variantContainer.innerHTML = '';

  const recipeContainer = document.getElementById('recipeBuilder');
  if (recipeContainer) recipeContainer.innerHTML = '';
}

function openProductModal(productId = null) {
  clearProductForm();

  if (productId) {
    const product = getProducts().find(item => String(item.id) === String(productId));
    if (product) hydrateProductForm(product);
  }

  openModal('productModal');
}

function hydrateProductForm(product) {
  setElementValue('productId', product.id);
  setElementValue('productName', product.name);
  setElementValue('productCategory', product.category);
  setElementValue('productDescription', product.description);
  setElementValue('productPrice', product.price);
  setElementValue('productStock', product.stock);
  setElementValue('productReorderLevel', product.reorderLevel);

  if (Array.isArray(product.variants)) {
    product.variants.forEach(variant => addVariantRow(variant));
  }

  if (Array.isArray(product.recipe)) {
    product.recipe.forEach(recipeItem => addRecipeRow(recipeItem));
  }
}

function deleteProduct(productId) {
  const confirmed = confirm('Delete this product?');
  if (!confirmed) return;

  const filtered = getProducts().filter(product => String(product.id) !== String(productId));
  setProducts(filtered);
  showNotification('Product deleted', 'success');
}

function renderProductsTable() {
  const tableBody = document.querySelector('#productsTable tbody');
  if (!tableBody) return;

  const search = sanitizeText(getElementValue('productSearch')).toLowerCase();
  const category = getElementValue('productCategoryFilter');

  const products = getProducts().filter(product => {
    const matchesSearch = !search || product.name.toLowerCase().includes(search);
    const matchesCategory = !category || category === 'All' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  tableBody.innerHTML = '';

  if (!products.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">No products found</td>
      </tr>
    `;
    return;
  }

  products.forEach(product => {
    const soldOut = Number(product.stock || 0) <= 0;
    const lowStock = !soldOut && Number(product.stock || 0) <= Number(product.reorderLevel || 0);
    const row = document.createElement('tr');
    if (lowStock || soldOut) row.classList.add('low-stock-row');

    row.innerHTML = `
      <td>${escapeHtml(product.name)}</td>
      <td>${escapeHtml(product.category)}</td>
      <td>${formatCurrency(product.price)}</td>
      <td>${product.stock}</td>
      <td>${product.reorderLevel}</td>
      <td>
        ${soldOut
          ? `<span class="badge-low-stock">SOLD OUT</span>`
          : lowStock
            ? `<span class="badge-low-stock">Low Stock</span>`
            : `<span class="badge dark">OK</span>`
        }
      </td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn btn-sm" data-action="edit-product" data-id="${product.id}">Edit</button>
          <button type="button" class="btn btn-sm btn-secondary" data-action="delete-product" data-id="${product.id}">Delete</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function renderPOSProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const activeCategory = APP_STATE.ui?.activeCategory || 'All';
  const products = getProducts().filter(product => activeCategory === 'All' || product.category === activeCategory);

  grid.innerHTML = '';

  if (!products.length) {
    grid.innerHTML = `<div class="empty-state">No products found</div>`;
    return;
  }

  products.forEach(product => {
    const soldOut = Number(product.stock || 0) <= 0;
    const lowStock = !soldOut && Number(product.stock || 0) <= Number(product.reorderLevel || 0);
    const card = document.createElement('div');
    card.className = `pos-product-card ${lowStock ? 'low-stock' : ''} ${soldOut ? 'out-of-stock' : ''}`;

    card.innerHTML = `
      <div class="pos-card-top">
        <div class="pos-category-badge">${escapeHtml(product.category)}</div>
        ${soldOut
          ? `<div class="pos-low-stock-pill">SOLD OUT</div>`
          : lowStock
            ? `<div class="pos-low-stock-pill">Low</div>`
            : ''
        }
      </div>

      <div class="pos-product-body">
        <div class="pos-product-name">${escapeHtml(product.name)}</div>
        <div class="pos-product-description">${escapeHtml(product.description || '')}</div>
      </div>

      <div class="pos-product-footer">
        <div class="pos-product-price">${formatCurrency(product.price)}</div>
        <div class="pos-product-stock">${soldOut ? 'SOLD OUT' : `${product.stock} left`}</div>
      </div>
    `;

    if (!soldOut) {
      card.addEventListener('click', () => {
        if (Array.isArray(product.variants) && product.variants.length) {
          openVariantSelector(product.id);
        } else {
          addToCart(product.id);
        }
      });
    }

    grid.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

window.getProducts = getProducts;
window.setProducts = setProducts;
window.saveProduct = saveProduct;
window.openProductModal = openProductModal;
window.deleteProduct = deleteProduct;
window.renderProductsTable = renderProductsTable;
window.renderPOSProducts = renderPOSProducts;
window.clearProductForm = clearProductForm;
