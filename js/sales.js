function getCart() {

  return APP_STATE.cart || [];

}

function setCart(
  cart
) {

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

          : []

    });

  }

  setCart(cart);

}

window.getCart =
  getCart;

window.setCart =
  setCart;

window.addToCart =
  addToCart;

window.calculateChange =
  calculateChange;

window.calculateCartTotal =
  calculateCartTotal;

window.calculateCartSubtotal =
  calculateCartSubtotal;

window.calculateCartDiscount =
  calculateCartDiscount;

window.calculateCartTax =
  calculateCartTax;

window.updateCartSummary =
  updateCartSummary;