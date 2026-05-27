function getCart() {

  return APP_STATE.cart || [];

}

function setCart(cart) {

  updateState(
    'cart',
    () => cart
  );

  renderCart();

}

function addToCart(productId) {

  const product =
    getProducts().find(

      item =>

        String(item.id) ===
        String(productId)
    );

  if (!product) {

    return;

  }

  if (
    Number(product.stock || 0)
    <= 0
  ) {

    showNotification(
      'Out of stock',
      'error'
    );

    return;

  }

  const cart =
    getCart();

  const existing =
    cart.find(

      item =>

        String(item.id) ===
        String(product.id)
    );

  if (existing) {

    if (
      existing.quantity >=
      product.stock
    ) {

      showNotification(
        'Insufficient stock',
        'error'
      );

      return;

    }

    existing.quantity += 1;

  }

  else {

    cart.push({

      ...product,

      quantity: 1

    });

  }

  setCart(cart);

  showNotification(
    `${product.name} added`,
    'success'
  );

}

function removeFromCart(productId) {

  const updated =

    getCart().filter(

      item =>

        String(item.id) !==
        String(productId)
    );

  setCart(updated);

}

function increaseCartQty(
  productId
) {

  const cart =
    getCart();

  const item =
    cart.find(

      item =>

        String(item.id) ===
        String(productId)
    );

  if (!item) return;

  const product =
    getProducts().find(

      p =>

        String(p.id) ===
        String(productId)
    );

  if (!product) return;

  if (
    item.quantity >=
    product.stock
  ) {

    showNotification(
      'Insufficient stock',
      'error'
    );

    return;

  }

  item.quantity += 1;

  setCart(cart);

}

function decreaseCartQty(
  productId
) {

  const cart =
    getCart();

  const item =
    cart.find(

      item =>

        String(item.id) ===
        String(productId)
    );

  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {

    removeFromCart(
      productId
    );

    return;

  }

  setCart(cart);

}

function clearCart() {

  const confirmed =
    confirm(
      'Clear current order?'
    );

  if (!confirmed) {

    return;

  }

  setCart([]);

}

function holdCurrentOrder() {

  const cart =
    getCart();

  if (!cart.length) {

    showNotification(
      'Cart is empty',
      'error'
    );

    return;

  }

  const heldOrders =
    APP_STATE.heldOrders || [];

  heldOrders.push({

    id:
      generateId(),

    items:
      [...cart],

    createdAt:
      new Date()
        .toISOString()

  });

  updateState(
    'heldOrders',
    () => heldOrders
  );

  setCart([]);

  renderHeldOrders();

  showNotification(
    'Order placed on hold',
    'success'
  );

}

function restoreHeldOrder(
  orderId
) {

  const heldOrders =
    APP_STATE.heldOrders || [];

  const order =
    heldOrders.find(

      item =>

        String(item.id) ===
        String(orderId)
    );

  if (!order) {

    return;

  }

  setCart(order.items);

  const updated =

    heldOrders.filter(

      item =>

        String(item.id) !==
        String(orderId)
    );

  updateState(
    'heldOrders',
    () => updated
  );

  renderHeldOrders();

  showNotification(
    'Held order restored',
    'success'
  );

}

function renderHeldOrders() {

  const container =
    safeGetById(
      'heldOrdersList'
    );

  if (!container) return;

  const heldOrders =
    APP_STATE.heldOrders || [];

  container.innerHTML = '';

  if (!heldOrders.length) {

    container.innerHTML = `

      <div class="empty-state">

        No held orders

      </div>

    `;

    return;

  }

  heldOrders.forEach(order => {

    const total =

      order.items.reduce(

        (sum, item) => {

          return (

            sum +

            (
              Number(item.price || 0)

              *

              Number(item.quantity || 0)
            )

          );

        },

        0

      );

    const card =
      document.createElement(
        'div'
      );

    card.className =
      'held-order-card';

    card.innerHTML = `

      <div>

        <div class="held-order-title">

          Held Order

        </div>

        <div class="held-order-meta">

          ${order.items.length}
          items

          •

          ${formatCurrency(total)}

        </div>

      </div>

      <button
        class="btn btn-sm"
        onclick="restoreHeldOrder('${order.id}')">

        Restore

      </button>

    `;

    container.appendChild(card);

  });

}

function calculateCartSubtotal() {

  return getCart().reduce(

    (total, item) => {

      return (

        total +

        (
          Number(item.price || 0)

          *

          Number(item.quantity || 0)
        )

      );

    },

    0

  );

}

function calculateCartTax(subtotal) {

  const taxRate =

    Number(
      APP_STATE.settings
        ?.taxRate || 0
    );

  return subtotal *

    (taxRate / 100);

}

function calculateCartTotal() {

  const subtotal =
    calculateCartSubtotal();

  const tax =
    calculateCartTax(
      subtotal
    );

  let discount = 0;

  const discountValue =
    Number(
      safeGetById(
        'discountValue'
      )?.value || 0
    );

  const discountType =
    safeGetById(
      'discountType'
    )?.value || 'percent';

  if (discountValue > 0) {

    if (
      discountType ===
      'percent'
    ) {

      discount =
        subtotal *

        (
          discountValue / 100
        );

    }

    else {

      discount =
        discountValue;

    }

  }

  return (

    subtotal +

    tax -

    discount

  );

}

function updateCartSummary() {

  const subtotal =
    calculateCartSubtotal();

  const tax =
    calculateCartTax(
      subtotal
    );

  const total =
    calculateCartTotal();

  let discount = 0;

  const discountValue =
    Number(
      safeGetById(
        'discountValue'
      )?.value || 0
    );

  const discountType =
    safeGetById(
      'discountType'
    )?.value || 'percent';

  if (discountValue > 0) {

    if (
      discountType ===
      'percent'
    ) {

      discount =
        subtotal *

        (
          discountValue / 100
        );

    }

    else {

      discount =
        discountValue;

    }

  }

  safeGetById(
    'cartSubtotal'
  ).textContent =

    formatCurrency(
      subtotal
    );

  safeGetById(
    'cartDiscount'
  ).textContent =

    formatCurrency(
      discount
    );

  safeGetById(
    'cartTax'
  ).textContent =

    formatCurrency(
      tax
    );

  safeGetById(
    'cartTotal'
  ).textContent =

    formatCurrency(
      total
    );

}

function renderCart() {

  const container =
    safeGetById(
      'cartItems'
    );

  if (!container) return;

  container.innerHTML = '';

  const cart =
    getCart();

  if (!cart.length) {

    container.innerHTML = `

      <div class="empty-cart-state">

        <div class="empty-cart-icon">

          🛒

        </div>

        <div class="empty-cart-title">

          No items yet

        </div>

        <div class="empty-cart-subtitle">

          Products added will appear here

        </div>

      </div>

    `;

    updateCartSummary();

    return;

  }

  cart.forEach(item => {

    const total =

      Number(item.price || 0)

      *

      Number(item.quantity || 0);

    const card =
      document.createElement(
        'div'
      );

    card.className =
      'cart-item-card';

    card.innerHTML = `

      <div class="cart-item-top">

        <div>

          <div class="cart-item-name">

            ${item.name}

          </div>

          <div class="cart-item-price">

            ${formatCurrency(item.price)}

          </div>

        </div>

        <button
          class="cart-remove-btn"
          onclick="removeFromCart('${item.id}')">

          ✕

        </button>

      </div>

      <div class="cart-item-bottom">

        <div class="qty-controls">

          <button
            onclick="decreaseCartQty('${item.id}')">

            −

          </button>

          <span>

            ${item.quantity}

          </span>

          <button
            onclick="increaseCartQty('${item.id}')">

            +

          </button>

        </div>

        <div class="cart-item-total">

          ${formatCurrency(total)}

        </div>

      </div>

    `;

    container.appendChild(card);

  });

  updateCartSummary();

}

function deductProductInventory(
  cart
) {

  const updated =
    getProducts().map(product => {

      const sold =
        cart.find(

          item =>

            String(item.id) ===
            String(product.id)
        );

      if (!sold) {

        return product;

      }

      return {

        ...product,

        stock:

          Number(product.stock || 0)

          -

          Number(sold.quantity || 0)

      };

    });

  setProducts(updated);

}

function deductIngredients(
  cart
) {

  const updated =
    getIngredients().map(
      ingredient => {

        let deduction = 0;

        cart.forEach(product => {

          if (
            !Array.isArray(
              product.recipe
            )
          ) return;

          product.recipe.forEach(
            recipeItem => {

              if (

                String(
                  recipeItem.ingredientId
                ) ===

                String(
                  ingredient.id
                )

              ) {

                let qty =

                  Number(
                    recipeItem.quantity || 0
                  ) *

                  Number(
                    product.quantity || 0
                  );

                if (
                  product.recipeMode ===
                  'batch'
                ) {

                  qty =

                    qty /

                    Number(
                      product.batchYield || 1
                    );

                }

                deduction += qty;

              }

            }
          );

        });

        return {

          ...ingredient,

          stock:

            Number(
              ingredient.stock || 0
            ) - deduction

        };

      }
    );

  setIngredients(updated);

}

function checkout() {

  const cart =
    getCart();

  if (!cart.length) {

    showNotification(
      'Cart is empty',
      'error'
    );

    return;

  }

  safeGetById(
    'checkoutTotal'
  ).value =

    formatCurrency(
      calculateCartTotal()
    );

  safeGetById(
    'checkoutTendered'
  ).value = '';

  safeGetById(
    'checkoutChange'
  ).value = '';

  safeGetById(
    'paymentReference'
  ).value = '';

  safeGetById(
    'checkoutCustomer'
  ).value = '';

  safeGetById(
    'checkoutPayment'
  ).value = 'cash';

  togglePaymentFields();

  openModal(
    'checkoutModal'
  );

}

function calculateChange() {

  const tendered =
    Number(
      safeGetById(
        'checkoutTendered'
      )?.value || 0
    );

  const total =
    calculateCartTotal();

  const change =
    tendered - total;

  safeGetById(
    'checkoutChange'
  ).value =

    change >= 0

      ? formatCurrency(change)

      : 'Insufficient';

}

function togglePaymentFields() {

  const paymentMethod =
    safeGetById(
      'checkoutPayment'
    )?.value;

  const tenderedWrap =
    safeGetById(
      'tenderedWrap'
    );

  const referenceWrap =
    safeGetById(
      'referenceWrap'
    );

  const qrSection =
    safeGetById(
      'qrphSection'
    );

  const paymentBadge =
    safeGetById(
      'paymentBadge'
    );

  const paymentQR =
    safeGetById(
      'paymentQRImage'
    );

  if (
    paymentMethod === 'cash'
  ) {

    tenderedWrap.style.display =
      'block';

    referenceWrap.style.display =
      'none';

    qrSection.style.display =
      'none';

  }

  else {

    tenderedWrap.style.display =
      'none';

    referenceWrap.style.display =
      'block';

    qrSection.style.display =
      'block';

  }

  if (
    paymentMethod === 'gcash'
  ) {

    paymentBadge.textContent =
      'GCASH PAYMENT';

    paymentQR.src =
      safeGetById(
        'gcashQR'
      )?.src;

  }

  if (
    paymentMethod === 'maya'
  ) {

    paymentBadge.textContent =
      'MAYA PAYMENT';

    paymentQR.src =
      safeGetById(
        'mayaQR'
      )?.src;

  }

  if (
    paymentMethod === 'bank'
  ) {

    paymentBadge.textContent =
      'BANK TRANSFER';

    paymentQR.src =
      safeGetById(
        'rcbcQR'
      )?.src;

  }

  if (
    paymentMethod === 'qrph'
  ) {

    paymentBadge.textContent =
      'QR PH PAYMENT';

    paymentQR.src =
      safeGetById(
        'rcbcQR'
      )?.src;

  }

}

function completeSale(
  status = 'completed'
) {

  const cart =
    getCart();

  if (!cart.length) {

    return;

  }

  const paymentMethod =
    safeGetById(
      'checkoutPayment'
    )?.value;

  const tendered =
    Number(
      safeGetById(
        'checkoutTendered'
      )?.value || 0
    );

  const total =
    calculateCartTotal();

  if (
    paymentMethod === 'cash'
  ) {

    if (tendered < total) {

      showNotification(
        'Insufficient cash',
        'error'
      );

      return;

    }

  }

  const subtotal =
    calculateCartSubtotal();

  const tax =
    calculateCartTax(
      subtotal
    );

  let discount = 0;

  const discountValue =
    Number(
      safeGetById(
        'discountValue'
      )?.value || 0
    );

  const discountType =
    safeGetById(
      'discountType'
    )?.value || 'percent';

  if (discountValue > 0) {

    if (
      discountType ===
      'percent'
    ) {

      discount =
        subtotal *

        (
          discountValue / 100
        );

    }

    else {

      discount =
        discountValue;

    }

  }

  const sales =
    getSales();

  sales.push({

    id:
      generateId(),

    receiptNumber:

      'RCPT-' +

      Date.now(),

    items:
      [...cart],

    subtotal,

    tax,

    discount,

    total,

    paymentMethod,

    tendered,

    change:

      paymentMethod === 'cash'

        ? tendered - total

        : 0,

    customer:

      safeGetById(
        'checkoutCustomer'
      )?.value || '',

    paymentReference:

      safeGetById(
        'paymentReference'
      )?.value || '',

    status,

    createdAt:
      new Date()
        .toISOString()

  });

  updateState(
    'sales',
    () => sales
  );

  deductProductInventory(
    cart
  );

  deductIngredients(
    cart
  );

  setCart([]);

  closeModal(
    'checkoutModal'
  );

  renderProductsTable();

  renderPOSProducts();

  renderIngredientsTable();

  refreshDashboard();

  renderHeldOrders();

  showNotification(

    status === 'pending'

      ? 'Sale marked pending'

      : 'Payment successful',

    'success'
  );

}

function initializeSalesEventListeners() {

  safeGetById(
    'clearCartBtn'
  )?.addEventListener(
    'click',
    clearCart
  );

  safeGetById(
    'checkoutBtn'
  )?.addEventListener(
    'click',
    checkout
  );

  safeGetById(
    'holdOrderBtn'
  )?.addEventListener(
    'click',
    holdCurrentOrder
  );

  safeGetById(
    'applyDiscountBtn'
  )?.addEventListener(
    'click',
    updateCartSummary
  );

}

document.addEventListener(

  'DOMContentLoaded',

  () => {

    renderCart();

    renderHeldOrders();

    initializeSalesEventListeners();

  }

);