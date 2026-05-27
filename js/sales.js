function getCart() {
  return APP_STATE.cart || [];
}

function setCart(cart) {
  updateState('cart', () => cart);

  renderCart();
  updateCartSummary();
}

function getProductById(productId) {
  return (APP_STATE.products || []).find(
    product =>
      String(product.id) ===
      String(productId)
  );
}

function getCartQuantityForProduct(productId) {
  return getCart()
    .filter(
      item =>
        String(item.productId) ===
        String(productId)
    )
    .reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0),
      0
    );
}

function addToCart(
  productId,
  variant = null
) {
  const product =
    getProductById(productId);

  if (!product) {
    showNotification(
      'Product not found',
      'error'
    );

    return;
  }

  if (
    Number(product.stock || 0) <= 0
  ) {
    showNotification(
      'Out of stock',
      'error'
    );

    return;
  }

  const cart = getCart();

  const variantId =
    variant?.id || '';

  const existing = cart.find(
    item =>
      String(item.productId) ===
        String(productId) &&
      String(item.variantId || '') ===
        String(variantId)
  );

  const currentQty =
    getCartQuantityForProduct(
      productId
    );

  if (
    currentQty >=
    Number(product.stock || 0)
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

  const linePrice = Number(
    variant?.price ??
      product.price ??
      0
  );

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

      recipe: Array.isArray(
        product.recipe
      )
        ? product.recipe
        : [],

      recipeMode:
        product.recipeMode ||
        'unit',

      batchYield: Number(
        product.batchYield || 1
      )
    });
  }

  setCart(cart);
}

function removeFromCart(
  cartItemId
) {
  const updated = getCart().filter(
    item =>
      String(item.id) !==
      String(cartItemId)
  );

  setCart(updated);
}

function increaseQty(cartItemId) {
  const cart = getCart();

  const item = cart.find(
    i =>
      String(i.id) ===
      String(cartItemId)
  );

  if (!item) return;

  const product =
    getProductById(item.productId);

  if (!product) return;

  const totalQty =
    getCartQuantityForProduct(
      item.productId
    );

  if (
    totalQty >=
    Number(product.stock || 0)
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
  let cart = getCart();

  const item = cart.find(
    i =>
      String(i.id) ===
      String(cartItemId)
  );

  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter(
      i =>
        String(i.id) !==
        String(cartItemId)
    );
  }

  setCart(cart);
}

function clearCart() {
  const cart = getCart();

  if (!cart.length) {
    setCart([]);

    return;
  }

  const confirmed = confirm(
    'Clear current order?'
  );

  if (!confirmed) return;

  setCart([]);

  updateCartSummary();

  showNotification(
    'Cart cleared',
    'success'
  );
}

function holdOrder() {
  const cart = getCart();

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
    id: generateId(),

    items: cart.map(item => ({
      ...item
    })),

    createdAt:
      new Date().toISOString()
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

function calculateCartSubtotal() {
  return getCart().reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );
}

function calculateCartTotal() {
  return calculateCartSubtotal();
}

function updateCartSummary() {
  const subtotal =
    calculateCartSubtotal();

  const total =
    calculateCartTotal();

  const subtotalEl =
    document.getElementById(
      'cartSubtotal'
    );

  const totalEl =
    document.getElementById(
      'cartTotal'
    );

  if (subtotalEl) {
    subtotalEl.textContent =
      formatCurrency(subtotal);
  }

  if (totalEl) {
    totalEl.textContent =
      formatCurrency(total);
  }

  const checkoutTotal =
    document.getElementById(
      'checkoutTotal'
    );

  if (checkoutTotal) {
    checkoutTotal.value =
      formatCurrency(total);
  }
}

function calculateChange() {
  const total =
    calculateCartTotal();

  const tenderedInput =
    document.getElementById(
      'amountTendered'
    );

  const changeInput =
    document.getElementById(
      'changeAmount'
    );

  if (
    !tenderedInput ||
    !changeInput
  )
    return;

  const tendered = Number(
    tenderedInput.value || 0
  );

  const change =
    tendered - total;

  changeInput.value =
    formatCurrency(
      Math.max(0, change)
    );
}

function renderCart() {
  const container =
    document.getElementById(
      'cartItems'
    );

  if (!container) return;

  const cart = getCart();

  container.innerHTML = '';

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
          Number(item.price || 0) *
            Number(item.quantity || 0)
        )}
      </div>

      <button
        type="button"
        class="cart-remove-btn"
        onclick="removeFromCart('${item.id}')">
        ×
      </button>
    `;

    container.appendChild(row);
  });

  updateCartSummary();
}

function deductProductInventory(
  cart
) {
  const products =
    getProducts().map(product => {
      const soldQty = cart
        .filter(
          item =>
            String(item.productId) ===
            String(product.id)
        )
        .reduce(
          (sum, item) =>
            sum +
            Number(item.quantity || 0),
          0
        );

      if (!soldQty) {
        return product;
      }

      return {
        ...product,

        stock: Math.max(
          0,
          Number(product.stock || 0) -
            soldQty
        )
      };
    });

  updateState(
    'products',
    () => products
  );
}

function deductIngredients(
  cart
) {
  const ingredients =
    (
      APP_STATE.ingredients || []
    ).map(ingredient => {
      let deduction = 0;

      cart.forEach(cartItem => {
        const product =
          getProductById(
            cartItem.productId
          );

        if (
          !product ||
          !Array.isArray(
            product.recipe
          )
        ) {
          return;
        }

        product.recipe.forEach(
          recipeItem => {
            if (
              String(
                recipeItem.ingredientId
              ) !==
              String(ingredient.id)
            ) {
              return;
            }

            deduction +=
              Number(
                recipeItem.quantity || 0
              ) *
              Number(
                cartItem.quantity || 0
              );
          }
        );
      });

      return {
        ...ingredient,

        stock: Math.max(
          0,
          Number(
            ingredient.stock || 0
          ) - deduction
        )
      };
    });

  updateState(
    'ingredients',
    () => ingredients
  );
}

function openCheckout() {
  const cart = getCart();

  if (!cart.length) {
    showNotification(
      'Cart is empty',
      'error'
    );

    return;
  }

  updateCartSummary();

  openModal(
    'checkoutModal'
  );
}

function completeSale() {
  const cart = getCart();

  if (!cart.length) {
    showNotification(
      'Cart is empty',
      'error'
    );

    return;
  }

  const subtotal =
    calculateCartSubtotal();

  const total =
    calculateCartTotal();

  const sale = {
    id: generateId(),

    receiptNumber:
      `RCPT-${Date.now()}`,

    items: cart.map(item => ({
      ...item
    })),

    subtotal,

    total,

    createdAt:
      new Date().toISOString()
  };

  updateState(
    'sales',
    currentSales => [
      ...(currentSales || []),
      sale
    ]
  );

  deductProductInventory(
    cart
  );

  deductIngredients(cart);

  setCart([]);

  closeModal(
    'checkoutModal'
  );

  renderProductsTable();

  renderPOSProducts();

  renderIngredientsTable();

  if (
    typeof renderSalesTable ===
    'function'
  ) {
    renderSalesTable();
  }

  showNotification(
    'Payment completed',
    'success'
  );
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    renderCart();

    const clearBtn =
      document.getElementById(
        'clearCartBtn'
      );

    const holdBtn =
      document.getElementById(
        'holdOrderBtn'
      );

    const checkoutBtn =
      document.getElementById(
        'checkoutBtn'
      );

    const tenderedInput =
      document.getElementById(
        'amountTendered'
      );

    if (clearBtn) {
      clearBtn.addEventListener(
        'click',
        clearCart
      );
    }

    if (holdBtn) {
      holdBtn.addEventListener(
        'click',
        holdOrder
      );
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener(
        'click',
        openCheckout
      );
    }

    if (tenderedInput) {
      tenderedInput.addEventListener(
        'input',
        calculateChange
      );
    }
  }
);

window.getCart = getCart;
window.setCart = setCart;
window.addToCart = addToCart;
window.removeFromCart =
  removeFromCart;
window.increaseQty =
  increaseQty;
window.decreaseQty =
  decreaseQty;
window.clearCart = clearCart;
window.holdOrder = holdOrder;
window.openCheckout =
  openCheckout;
window.completeSale =
  completeSale;
window.calculateChange =
  calculateChange;
window.renderCart = renderCart;