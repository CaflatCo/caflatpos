function initializeSales() {
  bindSalesLifecycle();
  renderCart();
  updateCartSummary();
  renderSalesTable();
  renderHeldOrdersBadge();
}

function bindSalesLifecycle() {
  const discountValue = document.getElementById('discountValue');
  const discountType = document.getElementById('discountType');
  const checkoutPayment = document.getElementById('checkoutPayment');
  const checkoutTendered = document.getElementById('checkoutTendered');
  const salesFromDate = document.getElementById('salesFromDate');
  const salesToDate = document.getElementById('salesToDate');
  const salesPaymentFilter = document.getElementById('salesPaymentFilter');

  if (discountValue) {
    discountValue.addEventListener('input', updateCartSummary);
  }

  if (discountType) {
    discountType.addEventListener('change', updateCartSummary);
  }

  if (checkoutPayment) {
    checkoutPayment.addEventListener('change', togglePaymentFields);
  }

  if (checkoutTendered) {
    checkoutTendered.addEventListener('input', calculateChange);
  }

  if (salesFromDate) salesFromDate.addEventListener('change', renderSalesTable);
  if (salesToDate) salesToDate.addEventListener('change', renderSalesTable);
  if (salesPaymentFilter) salesPaymentFilter.addEventListener('change', renderSalesTable);
}

function getCart() {
  return Array.isArray(APP_STATE.cart) ? APP_STATE.cart : [];
}

function setCart(cart) {
  updateState('cart', () => Array.isArray(cart) ? cart : []);
  renderCart();
  updateCartSummary();
}

function getProductById(productId) {
  return (APP_STATE.products || []).find(product => String(product.id) === String(productId));
}

function getIngredientById(ingredientId) {
  return (APP_STATE.ingredients || []).find(item => String(item.id) === String(ingredientId));
}

function getCartQuantityForProduct(productId) {
  return getCart()
    .filter(item => String(item.productId) === String(productId))
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;

  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">🛒</div>
        <div class="empty-cart-title">No items added</div>
        <div class="empty-cart-subtitle">Add a product to start the order</div>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-line-item';

    row.innerHTML = `
      <div class="cart-line-info">
        <div class="cart-line-name">${escapeHtml(item.name)}</div>
        <div class="cart-line-price">${formatCurrency(item.price)} each</div>
      </div>

      <div class="cart-line-controls">
        <button type="button" data-action="decrease-qty" data-id="${item.id}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-action="increase-qty" data-id="${item.id}">+</button>
        <button type="button" class="cart-remove-btn" data-action="remove-from-cart" data-id="${item.id}">×</button>
      </div>

      <div class="cart-line-total">${formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}</div>
    `;

    container.appendChild(row);
  });
}

function getElementByIds(ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}

function parseMoney(value) {
  if (typeof value === 'number') return value;
  const raw = String(value ?? '').replace(/[^0-9.-]/g, '');
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getDiscountState() {
  const discountValueEl = getElementByIds(['discountValue']);
  const discountTypeEl = getElementByIds(['discountType']);

  return {
    value: Number(discountValueEl?.value || 0),
    type: discountTypeEl?.value || 'percent'
  };
}

function calculateCartSubtotal() {
  return getCart().reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
}

function calculateCartDiscount() {
  const subtotal = calculateCartSubtotal();
  const { value, type } = getDiscountState();

  if (!value || value <= 0) return 0;

  const discount = type === 'percent' ? subtotal * (value / 100) : value;
  return Math.max(0, Math.min(discount, subtotal));
}

function calculateCartTax() {
  const subtotal = calculateCartSubtotal();
  const discount = calculateCartDiscount();
  const taxRate = Number(APP_STATE.settings?.taxRate || 0);
  return Math.max(0, (subtotal - discount) * (taxRate / 100));
}

function calculateCartTotal() {
  const subtotal = calculateCartSubtotal();
  const discount = calculateCartDiscount();
  const tax = calculateCartTax();
  return Math.max(0, subtotal - discount + tax);
}

function updateCartSummary() {
  const subtotal = calculateCartSubtotal();
  const discount = calculateCartDiscount();
  const tax = calculateCartTax();
  const total = calculateCartTotal();

  const subtotalEl = document.getElementById('cartSubtotal');
  const discountEl = document.getElementById('cartDiscount');
  const taxEl = document.getElementById('cartTax');
  const totalEl = document.getElementById('cartTotal');
  const checkoutTotal = getElementByIds(['checkoutTotal']);

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (discountEl) discountEl.textContent = formatCurrency(discount);
  if (taxEl) taxEl.textContent = formatCurrency(tax);
  if (totalEl) totalEl.textContent = formatCurrency(total);
  if (checkoutTotal) checkoutTotal.value = formatCurrency(total);

  calculateChange();
  return { subtotal, discount, tax, total };
}

function calculateChange() {
  const total = calculateCartTotal();
  const tenderedEl = getElementByIds(['checkoutTendered', 'amountTendered']);
  const changeEl = getElementByIds(['checkoutChange', 'changeAmount']);

  if (!tenderedEl || !changeEl) return 0;

  const tendered = parseMoney(tenderedEl.value);
  const change = Math.max(0, tendered - total);

  changeEl.value = formatCurrency(change);
  return change;
}

function addToCart(productId, variant = null) {
  const product = getProductById(productId);

  if (!product) {
    showNotification('Product not found', 'error');
    return;
  }

  const stock = Number(product.stock || 0);
  if (stock <= 0) {
    showNotification('Out of stock', 'error');
    return;
  }

  const cart = getCart();
  const variantId = variant?.id || '';
  const existing = cart.find(
    item =>
      String(item.productId) === String(productId) &&
      String(item.variantId || '') === String(variantId)
  );

  const currentQty = getCartQuantityForProduct(productId);
  if (currentQty >= stock) {
    showNotification('Insufficient stock', 'error');
    return;
  }

  const lineName = variant?.name ? `${product.name} (${variant.name})` : product.name;
  const linePrice = Number(variant?.price ?? product.price ?? 0);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: generateId(),
      productId,
      variantId,
      name: lineName,
      price: linePrice,
      quantity: 1,
      recipe: Array.isArray(product.recipe) ? product.recipe : [],
      recipeMode: product.recipeMode || 'unit',
      batchYield: Number(product.batchYield || 1)
    });
  }

  setCart(cart);
}

function removeFromCart(id) {
  setCart(getCart().filter(item => String(item.id) !== String(id)));
}

function increaseQty(id) {
  const cart = getCart();
  const item = cart.find(x => String(x.id) === String(id));
  if (!item) return;

  const product = getProductById(item.productId);
  if (!product) return;

  const currentQty = getCartQuantityForProduct(item.productId);
  if (currentQty >= Number(product.stock || 0)) {
    showNotification('Insufficient stock', 'error');
    return;
  }

  item.quantity += 1;
  setCart(cart);
}

function decreaseQty(id) {
  const cart = getCart();
  const item = cart.find(x => String(x.id) === String(id));
  if (!item) return;

  item.quantity -= 1;
  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  setCart(cart);
}

function clearCart(skipConfirm = false) {
  if (!skipConfirm && getCart().length) {
    const confirmed = confirm('Clear current cart?');
    if (!confirmed) return;
  }

  setCart([]);
  showNotification('Cart cleared', 'success');
}

function holdOrder() {
  const cart = getCart();
  if (!cart.length) {
    showNotification('Cart is empty', 'error');
    return;
  }

  const heldOrders = Array.isArray(APP_STATE.heldOrders) ? APP_STATE.heldOrders : [];
  const snapshot = buildTransactionSnapshot({
    status: 'HELD',
    paymentStatus: 'PENDING',
    paymentMethod: getSelectedPaymentMethod(),
    tendered: 0,
    change: 0,
    referenceNumber: '',
    customerName: getCheckoutCustomerName(),
    cartOverride: cart
  });

  heldOrders.push(snapshot);
  updateState('heldOrders', () => heldOrders);
  clearCart(true);
  renderHeldOrdersBadge();
  showNotification('Order held', 'success');
}

function renderHeldOrdersBadge() {
  const badge = document.getElementById('heldOrdersBadge');
  if (!badge) return;
  badge.textContent = String(Array.isArray(APP_STATE.heldOrders) ? APP_STATE.heldOrders.length : 0);
}

function getSelectedPaymentMethod() {
  const el = getElementByIds(['checkoutPayment']);
  return String(el?.value || 'cash').toLowerCase();
}

function getCheckoutCustomerName() {
  const el = getElementByIds(['checkoutCustomer']);
  return String(el?.value || '').trim();
}

function getPaymentReference() {
  const el = getElementByIds(['paymentReference']);
  return String(el?.value || '').trim();
}

function openCheckoutModal() {
  if (!getCart().length) {
    showNotification('Cart is empty', 'error');
    return;
  }

  updateCartSummary();
  togglePaymentFields();
  calculateChange();
  openModal('checkoutModal');
}

function togglePaymentFields() {
  const method = getSelectedPaymentMethod();
  const qrphSection = document.getElementById('qrphSection');
  const referenceWrap = document.getElementById('referenceWrap');
  const tenderedWrap = document.getElementById('tenderedWrap');

  const isCash = method === 'cash';
  const isDigital = ['gcash', 'maya', 'bank', 'qrph'].includes(method);
  const isQR = method === 'qrph';

  if (tenderedWrap) tenderedWrap.style.display = isCash ? 'block' : 'none';
  if (referenceWrap) referenceWrap.style.display = isDigital ? 'block' : 'none';
  if (qrphSection) qrphSection.style.display = isQR ? 'block' : 'none';

  calculateChange();
}

function buildTransactionSnapshot({
  status,
  paymentStatus,
  paymentMethod,
  tendered,
  change,
  referenceNumber,
  customerName,
  cartOverride = null
}) {
  const cart = Array.isArray(cartOverride) ? cartOverride : getCart();
  const items = cart.map(item => ({
    id: item.id,
    productId: item.productId,
    variantId: item.variantId || '',
    name: item.name,
    quantity: Number(item.quantity || 0),
    price: Number(item.price || 0),
    total: Number(item.price || 0) * Number(item.quantity || 0),
    recipe: Array.isArray(item.recipe) ? item.recipe : [],
    recipeMode: item.recipeMode || 'unit',
    batchYield: Number(item.batchYield || 1)
  }));

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discount = calculateCartDiscount();
  const tax = calculateCartTax();
  const total = Math.max(0, subtotal - discount + tax);
  const timestamp = new Date().toISOString();
  const receiptNumber = `RCPT-${Date.now()}`;

  return {
    id: generateId(),
    receiptNumber,
    status,
    paymentStatus,
    customer: {
      name: customerName || 'Walk-in Customer'
    },
    payment: {
      method: paymentMethod,
      tendered: Number(tendered || 0),
      change: Number(change || 0),
      referenceNumber: referenceNumber || ''
    },
    totals: {
      subtotal,
      discount,
      tax,
      total
    },
    items,
    audit: {
      createdAt: timestamp,
      completedAt: status === 'COMPLETED' ? timestamp : null,
      completedBy: APP_STATE.currentUserRole || 'STAFF'
    },

    customerName: customerName || 'Walk-in Customer',
    paymentMethod,
    subtotal,
    discount,
    tax,
    total,
    tendered: Number(tendered || 0),
    change: Number(change || 0),
    referenceNumber: referenceNumber || '',
    createdAt: timestamp,
    completedAt: status === 'COMPLETED' ? timestamp : null
  };
}

function deductInventoryForCart(cart) {
  const ingredientDeltas = new Map();

  cart.forEach(line => {
    const product = getProductById(line.productId);
    if (!product) return;

    const recipeItems = Array.isArray(product.recipe) ? product.recipe : [];
    const batchYield = Math.max(1, Number(product.batchYield || 1));
    const recipeMode = String(product.recipeMode || 'unit');

    recipeItems.forEach(recipeItem => {
      const ingredient = getIngredientById(recipeItem.ingredientId);
      if (!ingredient) return;

      const perProduct = Number(recipeItem.quantity || 0);
      const usagePerUnit = recipeMode === 'batch' ? perProduct / batchYield : perProduct;
      const totalUsage = usagePerUnit * Number(line.quantity || 0);
      const currentDelta = ingredientDeltas.get(ingredient.id) || 0;
      ingredientDeltas.set(ingredient.id, currentDelta + totalUsage);
    });
  });

  if (!ingredientDeltas.size) return;

  const updatedIngredients = getIngredients().map(ingredient => {
    if (!ingredientDeltas.has(ingredient.id)) return ingredient;
    const nextStock = Math.max(0, Number(ingredient.stock || 0) - ingredientDeltas.get(ingredient.id));
    return {
      ...ingredient,
      stock: nextStock
    };
  });

  if (typeof setIngredients === 'function') {
    setIngredients(updatedIngredients);
  }

  const movements = Array.isArray(APP_STATE.inventoryMovements) ? APP_STATE.inventoryMovements : [];
  ingredientDeltas.forEach((usedQty, ingredientId) => {
    const ingredient = getIngredientById(ingredientId);
    if (!ingredient) return;

    movements.push({
      id: generateId(),
      ingredientId,
      ingredientName: ingredient.name,
      type: 'sale-deduction',
      quantityAdded: 0,
      quantityUsed: usedQty,
      reason: 'Sale deduction',
      previousStock: Number(ingredient.stock || 0),
      newStock: Math.max(0, Number(ingredient.stock || 0) - usedQty),
      createdAt: new Date().toISOString(),
      createdBy: APP_STATE.currentUserRole || 'STAFF'
    });
  });

  if (typeof setInventoryMovements === 'function') {
    setInventoryMovements(movements);
  } else {
    updateState('inventoryMovements', () => movements);
  }
}


function deductProductStockForCart(cart) {
  const updatedProducts = getProducts().map(product => {
    const quantitySold = cart.reduce((sum, line) => {
      if (String(line.productId) !== String(product.id)) return sum;
      return sum + Number(line.quantity || 0);
    }, 0);

    if (!quantitySold) return product;

    return {
      ...product,
      stock: Math.max(0, Number(product.stock || 0) - quantitySold)
    };
  });

  if (typeof setProducts === 'function') {
    setProducts(updatedProducts);
  } else {
    updateState('products', () => updatedProducts);
  }
}

function pushSale(transaction) {
  const sales = Array.isArray(APP_STATE.sales) ? APP_STATE.sales : [];
  sales.push(transaction);
  updateState('sales', () => sales);
  if (typeof refreshDashboard === 'function') refreshDashboard();
}

function completeSale(forceStatus = 'COMPLETED') {
  const cart = getCart();
  if (!cart.length) {
    showNotification('Cart is empty', 'error');
    return;
  }

  const method = getSelectedPaymentMethod();
  const customerName = getCheckoutCustomerName();
  const referenceNumber = getPaymentReference();
  const subtotal = calculateCartSubtotal();
  const discount = calculateCartDiscount();
  const tax = calculateCartTax();
  const total = Math.max(0, subtotal - discount + tax);
  const isPending = String(forceStatus).toUpperCase() === 'PENDING';
  const paymentStatus = isPending ? 'PENDING' : 'PAID';

  let tendered = 0;
  let change = 0;

  if (!isPending && method === 'cash') {
    const tenderedEl = getElementByIds(['checkoutTendered', 'amountTendered']);
    tendered = parseMoney(tenderedEl?.value);
    if (tendered <= 0) tendered = total;
    if (tendered < total) {
      showNotification('Amount tendered is not enough', 'error');
      return;
    }
    change = tendered - total;
  } else if (!isPending) {
    tendered = total;
    change = 0;
  }

  if (!isPending && ['bank', 'qrph'].includes(method) && !referenceNumber) {
    showNotification('Reference number is required for this payment method', 'error');
    return;
  }

  const transaction = buildTransactionSnapshot({
    status: isPending ? 'PENDING' : 'COMPLETED',
    paymentStatus,
    paymentMethod: method,
    tendered,
    change,
    referenceNumber,
    customerName,
    cartOverride: cart
  });

  pushSale(transaction);

  if (!isPending) {
    deductProductStockForCart(cart);
    deductInventoryForCart(cart);
  }

  clearCart(true);
  closeModal('checkoutModal');
  renderReceipt(transaction);
  openModal('receiptModal');
  showNotification(isPending ? 'Order marked pending' : 'Sale completed', 'success');
  renderSalesTable();
  renderHeldOrdersBadge();
}

function renderReceipt(transaction) {
  const body = document.getElementById('receiptBody');
  if (!body) return;

  const brand = APP_STATE.settings?.brandName || 'Caflat.CoPOS v1';
  const footer = APP_STATE.settings?.receiptFooter || '';
  const dateText = new Date(transaction.audit.completedAt || transaction.audit.createdAt).toLocaleString();

  const itemsHtml = transaction.items.map(item => `
    <div class="receipt-line">
      <span>${escapeHtml(item.name)} x${item.quantity}</span>
      <span>${formatCurrency(item.total)}</span>
    </div>
  `).join('');

  const referenceLine = transaction.payment.referenceNumber
    ? `<div class="receipt-line"><span>Reference</span><span>${escapeHtml(transaction.payment.referenceNumber)}</span></div>`
    : '';

  body.innerHTML = `
    <div class="receipt-header">
      <div class="receipt-brand">${escapeHtml(brand)}</div>
      <div>${dateText}</div>
      <div>${escapeHtml(transaction.receiptNumber)}</div>
      <div>${escapeHtml(transaction.status)}</div>
    </div>

    <div class="receipt-line"><span>Customer</span><span>${escapeHtml(transaction.customer.name || 'Walk-in Customer')}</span></div>
    <div class="receipt-line"><span>Payment</span><span>${escapeHtml(transaction.payment.method || 'cash')}</span></div>
    ${referenceLine}
    <div class="receipt-divider"></div>

    ${itemsHtml}

    <div class="receipt-divider"></div>
    <div class="receipt-line"><span>Subtotal</span><span>${formatCurrency(transaction.totals.subtotal)}</span></div>
    <div class="receipt-line"><span>Discount</span><span>${formatCurrency(transaction.totals.discount)}</span></div>
    <div class="receipt-line"><span>Tax</span><span>${formatCurrency(transaction.totals.tax)}</span></div>
    <div class="receipt-line receipt-total"><span>Total</span><span>${formatCurrency(transaction.totals.total)}</span></div>
    <div class="receipt-line"><span>Tendered</span><span>${formatCurrency(transaction.payment.tendered)}</span></div>
    <div class="receipt-line"><span>Change</span><span>${formatCurrency(transaction.payment.change)}</span></div>
    ${footer ? `<div class="receipt-divider"></div><div class="receipt-line"><span>${escapeHtml(footer)}</span><span></span></div>` : ''}
  `;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function openSaleReceipt(saleId) {
  const sale = getSales().find(item => String(item.id) === String(saleId));
  if (!sale) return;
  renderReceipt(sale);
  openModal('receiptModal');
}

function getSales() {
  return Array.isArray(APP_STATE.sales) ? APP_STATE.sales : [];
}

function renderSalesTable() {
  const tableBody = document.querySelector('#salesTable tbody');
  if (!tableBody) return;

  const fromDateEl = document.getElementById('salesFromDate');
  const toDateEl = document.getElementById('salesToDate');
  const paymentFilterEl = document.getElementById('salesPaymentFilter');

  const fromDate = fromDateEl?.value ? new Date(`${fromDateEl.value}T00:00:00`) : null;
  const toDate = toDateEl?.value ? new Date(`${toDateEl.value}T23:59:59`) : null;
  const paymentFilter = String(paymentFilterEl?.value || '').toLowerCase();

  const sales = getSales().filter(sale => {
    const saleDate = new Date(sale.audit?.completedAt || sale.completedAt || sale.createdAt || Date.now());
    const matchesFrom = !fromDate || saleDate >= fromDate;
    const matchesTo = !toDate || saleDate <= toDate;
    const matchesPayment = !paymentFilter || paymentFilter === 'all' || String(sale.paymentMethod || sale.payment?.method || '').toLowerCase() === paymentFilter;
    return matchesFrom && matchesTo && matchesPayment;
  });

  tableBody.innerHTML = '';

  if (!sales.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">No sales found</td>
      </tr>
    `;
    return;
  }

  sales.slice().reverse().forEach(sale => {
    const saleDate = new Date(sale.audit?.completedAt || sale.completedAt || sale.createdAt || Date.now());
    const itemSummary = Array.isArray(sale.items)
      ? sale.items.map(item => `${item.name} x${item.quantity}`).join(', ')
      : '';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(sale.receiptNumber || sale.id || '')}</td>
      <td>${saleDate.toLocaleString()}</td>
      <td>${escapeHtml(itemSummary)}</td>
      <td>${formatCurrency(sale.subtotal ?? sale.totals?.subtotal ?? 0)}</td>
      <td>${formatCurrency(sale.total ?? sale.totals?.total ?? 0)}</td>
      <td>${escapeHtml(sale.status || 'COMPLETED')}</td>
      <td>
        <div class="table-actions">
          ${String(sale.status||'').toUpperCase()==='PENDING'
          ? `<button type="button" class="btn btn-sm" data-action="complete-pending-sale" data-id="${sale.id}">Complete</button>
             <button type="button" class="btn btn-sm" data-action="cancel-pending-sale" data-id="${sale.id}">Cancel</button>`
          : `<button type="button" class="btn btn-sm" data-action="open-sale-receipt" data-id="${sale.id}">View</button>`}
        </div>
      </td>
    `;
    row.querySelector('[data-action="open-sale-receipt"]')?.addEventListener('click', () => openSaleReceipt(sale.id));
    tableBody.appendChild(row);
  });
}

function exportSalesReport() {
  const sales = getSales();
  const lines = [
    ['Receipt', 'Date', 'Payment', 'Status', 'Subtotal', 'Discount', 'Tax', 'Total'].join(',')
  ];

  sales.forEach(sale => {
    const saleDate = new Date(sale.audit?.completedAt || sale.completedAt || sale.createdAt || Date.now());
    lines.push([
      sale.receiptNumber || sale.id || '',
      saleDate.toISOString(),
      sale.paymentMethod || sale.payment?.method || '',
      sale.status || '',
      Number(sale.subtotal ?? sale.totals?.subtotal ?? 0),
      Number(sale.discount ?? sale.totals?.discount ?? 0),
      Number(sale.tax ?? sale.totals?.tax ?? 0),
      Number(sale.total ?? sale.totals?.total ?? 0)
    ].join(','));
  });

  downloadTextFile(`sales-report-${Date.now()}.csv`, lines.join('\n'));
  showNotification('Sales report exported', 'success');
}

function renderHeldOrdersBadge() {
  const badge = document.getElementById('heldOrdersBadge');
  if (!badge) return;
  badge.textContent = String(Array.isArray(APP_STATE.heldOrders) ? APP_STATE.heldOrders.length : 0);
}

function initializeSalesCompatibility() {
  window.completeSale = completeSale;
  window.togglePaymentFields = togglePaymentFields;
  window.clearCart = clearCart;
  window.holdOrder = holdOrder;
  window.openCheckoutModal = openCheckoutModal;
  window.renderSalesTable = renderSalesTable;
  window.renderCart = renderCart;
  window.exportSalesReport = exportSalesReport;
  window.exportSalesCSV = exportSalesReport;
  window.calculateChange = calculateChange;
  window.calculateCartTotal = calculateCartTotal;
  window.calculateCartSubtotal = calculateCartSubtotal;
  window.calculateCartDiscount = calculateCartDiscount;
  window.calculateCartTax = calculateCartTax;
  window.updateCartSummary = updateCartSummary;
  window.removeFromCart = removeFromCart;
  window.increaseQty = increaseQty;
  window.decreaseQty = decreaseQty;
  window.openSaleReceipt = openSaleReceipt;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeSales();
    initializeSalesCompatibility();
  });
} else {
  initializeSales();
  initializeSalesCompatibility();
}

window.initializeSales = initializeSales;
window.getCart = getCart;
window.setCart = setCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.renderCart = renderCart;
window.completeSale = completeSale;
window.holdOrder = holdOrder;
window.openCheckoutModal = openCheckoutModal;
window.renderSalesTable = renderSalesTable;
window.exportSalesReport = exportSalesReport;
window.togglePaymentFields = togglePaymentFields;
window.calculateChange = calculateChange;
window.calculateCartTotal = calculateCartTotal;
window.calculateCartSubtotal = calculateCartSubtotal;
window.calculateCartDiscount = calculateCartDiscount;
window.calculateCartTax = calculateCartTax;
window.updateCartSummary = updateCartSummary;
window.renderHeldOrdersBadge = renderHeldOrdersBadge;
window.openSaleReceipt = openSaleReceipt;

function completePendingSale(saleId){
 const sales=getSales();
 const sale=sales.find(s=>String(s.id)===String(saleId));
 if(!sale)return;
 sale.status='COMPLETED';
 sale.paymentStatus='PAID';
 sale.audit=sale.audit||{};
 sale.audit.completedAt=new Date().toISOString();
 updateState('sales',()=>sales);
 renderSalesTable();
 showNotification('Pending sale completed','success');
}

function cancelPendingSale(saleId){
 const sales=getSales().filter(s=>String(s.id)!==String(saleId));
 updateState('sales',()=>sales);
 renderSalesTable();
 showNotification('Pending sale cancelled','success');
}

window.completePendingSale=completePendingSale;
window.cancelPendingSale=cancelPendingSale;
