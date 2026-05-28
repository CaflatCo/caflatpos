function getCart() {

  return APP_STATE.cart || [];

}

function setCart(cart) {

  updateState(
    'cart',
    () => cart
  );

  renderCart();

  updateCartSummary();

}

function getProductById(
  productId
) {

  return (
    APP_STATE.products || []
  ).find(
    product =>

      String(product.id)
      ===
      String(productId)
  );

}

function getCartQuantityForProduct(
  productId
) {

  return getCart()

    .filter(
      item =>

        String(item.productId)
        ===
        String(productId)
    )

    .reduce(
      (sum, item) =>

        sum +
        Number(
          item.quantity || 0
        ),

      0
    );

}

function getElementByIds(
  ids
) {

  for (const id of ids) {

    const el =
      document.getElementById(
        id
      );

    if (el) return el;

  }

  return null;

}

function getDiscountState() {

  const discountValueEl =
    document.getElementById(
      'discountValue'
    );

  const discountTypeEl =
    document.getElementById(
      'discountType'
    );

  return {

    value:
      Number(
        discountValueEl?.value || 0
      ),

    type:
      discountTypeEl?.value ||
      'percent'

  };

}

function calculateCartSubtotal() {

  return getCart().reduce(

    (sum, item) =>

      sum +

      Number(
        item.price || 0
      )

      *

      Number(
        item.quantity || 0
      ),

    0
  );

}

function calculateCartDiscount() {

  const subtotal =
    calculateCartSubtotal();

  const {
    value,
    type
  } =
    getDiscountState();

  if (
    !value ||
    value <= 0
  ) {

    return 0;

  }

  const discount =

    type === 'percent'

      ? subtotal *
        (value / 100)

      : value;

  return Math.max(
    0,
    Math.min(
      discount,
      subtotal
    )
  );

}

function calculateCartTax() {

  const subtotal =
    calculateCartSubtotal();

  const discount =
    calculateCartDiscount();

  const taxRate =
    Number(
      APP_STATE.settings
        ?.taxRate || 0
    );

  return Math.max(

    0,

    (
      subtotal - discount
    )

    *

    (taxRate / 100)

  );

}

function calculateCartTotal() {

  const subtotal =
    calculateCartSubtotal();

  const discount =
    calculateCartDiscount();

  const tax =
    calculateCartTax();

  return Math.max(
    0,
    subtotal -
      discount +
      tax
  );

}

function updateCartSummary() {

  const subtotal =
    calculateCartSubtotal();

  const discount =
    calculateCartDiscount();

  const tax =
    calculateCartTax();

  const total =
    calculateCartTotal();

  const subtotalEl =
    document.getElementById(
      'cartSubtotal'
    );

  const discountEl =
    document.getElementById(
      'cartDiscount'
    );

  const taxEl =
    document.getElementById(
      'cartTax'
    );

  const totalEl =
    document.getElementById(
      'cartTotal'
    );

  const checkoutTotal =
    document.getElementById(
      'checkoutTotal'
    );

  if (subtotalEl) {

    subtotalEl.textContent =
      formatCurrency(
        subtotal
      );

  }

  if (discountEl) {

    discountEl.textContent =
      formatCurrency(
        discount
      );

  }

  if (taxEl) {

    taxEl.textContent =
      formatCurrency(
        tax
      );

  }

  if (totalEl) {

    totalEl.textContent =
      formatCurrency(
        total
      );

  }

  if (checkoutTotal) {

    checkoutTotal.value =
      formatCurrency(
        total
      );

  }

  return {
    subtotal,
    discount,
    tax,
    total
  };

}

function calculateChange() {

  const total =
    calculateCartTotal();

  const tenderedEl =
    getElementByIds([
      'checkoutTendered',
      'amountTendered'
    ]);

  const changeEl =
    getElementByIds([
      'checkoutChange',
      'changeAmount'
    ]);

  if (
    !tenderedEl ||
    !changeEl
  ) {

    return 0;

  }

  const tendered =
    Number(
      tenderedEl.value || 0
    );

  const change =
    Math.max(
      0,
      tendered - total
    );

  changeEl.value =
    formatCurrency(change);

  return change;

}

function addToCart(
  productId,
  variant = null
) {

  const product =
    getProductById(
      productId
    );

  if (!product) {

    showNotification(
      'Product not found',
      'error'
    );

    return;

  }

  if (
    Number(
      product.stock || 0
    ) <= 0
  ) {

    showNotification(
      'Out of stock',
      'error'
    );

    return;

  }

  const cart =
    getCart();

  const variantId =
    variant?.id || '';

  const existing =
    cart.find(
      item =>

        String(item.productId)
        ===
        String(productId)

        &&

        String(
          item.variantId || ''
        )

        ===

        String(variantId)
    );

  const currentQty =
    getCartQuantityForProduct(
      productId
    );

  if (
    currentQty >=
    Number(
      product.stock || 0
    )
  ) {

    showNotification(
      'Insufficient stock',
      'error'
    );

    return;

  }

  const lineName =
    variant?.name

      ? `${product.name} (${variant.name})`

      : product.name;

  const linePrice =
    Number(

      variant?.price ??

      product.price ??

      0

    );

  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({

      id:
        generateId(),

      productId,

      variantId,

      name:
        lineName,

      price:
        linePrice,

      quantity: 1,

      recipe:
        Array.isArray(
          product.recipe
        )

          ? product.recipe

          : [],

      recipeMode:
        product.recipeMode ||
        'unit',

      batchYield:
        Number(
          product.batchYield || 1
        )

    });

  }

  setCart(cart);

}

function removeFromCart(
  cartItemId
) {

  const updated =
    getCart().filter(
      item =>

        String(item.id)
        !==
        String(cartItemId)
    );

  setCart(updated);

}

function increaseQty(
  cartItemId
) {

  const cart =
    getCart();

  const item =
    cart.find(
      i =>

        String(i.id)
        ===
        String(cartItemId)
    );

  if (!item) return;

  const product =
    getProductById(
      item.productId
    );

  if (!product) return;

  const totalQty =
    getCartQuantityForProduct(
      item.productId
    );

  if (
    totalQty >=
    Number(
      product.stock || 0
    )
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

function decreaseQty(
  cartItemId
) {

  let cart =
    getCart();

  const item =
    cart.find(
      i =>

        String(i.id)
        ===
        String(cartItemId)
    );

  if (!item) return;

  item.quantity -= 1;

  if (
    item.quantity <= 0
  ) {

    cart =
      cart.filter(
        i =>

          String(i.id)
          !==
          String(cartItemId)
      );

  }

  setCart(cart);

}

function clearCart() {

  const cart =
    getCart();

  if (!cart.length) {

    setCart([]);

    return;

  }

  const confirmed =
    confirm(
      'Clear current order?'
    );

  if (!confirmed)
    return;

  setCart([]);

  showNotification(
    'Cart cleared',
    'success'
  );

}

function holdOrder() {

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

    Array.isArray(
      APP_STATE.heldOrders
    )

      ? APP_STATE.heldOrders

      : [];

  heldOrders.push({

    id:
      generateId(),

    items:
      cart.map(
        item => ({
          ...item
        })
      ),

    createdAt:
      new Date()
        .toISOString()

  });

  updateState(
    'heldOrders',
    () => heldOrders
  );

  setCart([]);

  showNotification(
    'Order held',
    'success'
  );

}

function renderCart() {

  const container =
    document.getElementById(
      'cartItems'
    );

  if (!container)
    return;

  const cart =
    getCart();

  container.innerHTML =
    '';

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

    const row =
      document.createElement(
        'div'
      );

    row.className =
      'cart-line-item';

    row.innerHTML = `

      <div class="cart-line-info">

        <div class="cart-line-name">

          ${item.name}

        </div>

        <div class="cart-line-price">

          ${formatCurrency(
            item.price
          )}

        </div>

      </div>

      <div class="cart-line-controls">

        <button
          type="button"
          onclick="decreaseQty('${item.id}')">

          −

        </button>

        <span>

          ${item.quantity}

        </span>

        <button
          type="button"
          onclick="increaseQty('${item.id}')">

          +

        </button>

      </div>

      <div class="cart-line-total">

        ${formatCurrency(

          Number(
            item.price || 0
          )

          *

          Number(
            item.quantity || 0
          )

        )}

      </div>

      <button
        type="button"
        class="cart-remove-btn"
        onclick="removeFromCart('${item.id}')">

        ×

      </button>

    `;

    container.appendChild(
      row
    );

  });

  updateCartSummary();

}