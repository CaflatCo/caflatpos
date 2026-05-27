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

function addToCart(
  productId,
  variant = null
) {

  const products =
    APP_STATE.products || [];

  const product =
    products.find(

      item =>

        String(item.id)
        ===
        String(productId)
    );

  if (!product) return;

  const cart =
    getCart();

  const existing =
    cart.find(item => {

      return (

        String(item.productId)
        ===
        String(productId)

      );

    });

  const finalPrice =

    variant
      ? variant.price
      : product.price;

  if (existing) {

    existing.quantity += 1;

  }

  else {

    cart.push({

      id:
        generateId(),

      productId,

      name:
        variant
          ? `${product.name} (${variant.name})`
          : product.name,

      price:
        finalPrice,

      quantity: 1

    });

  }

  setCart(cart);

}

function renderCart() {

  const container =
    document.getElementById(
      'cartItems'
    );

  if (!container) return;

  const cart =
    getCart();

  if (!cart.length) {

    container.innerHTML = `

      <div class="empty-cart-state">

        <div class="empty-cart-title">

          No items yet

        </div>

      </div>

    `;

    return;

  }

  container.innerHTML = '';

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

          ${formatCurrency(item.price)}

        </div>

      </div>

      <div class="cart-line-controls">

        <button
          onclick="decreaseQty('${item.id}')">

          −

        </button>

        <span>

          ${item.quantity}

        </span>

        <button
          onclick="increaseQty('${item.id}')">

          +

        </button>

      </div>

      <div class="cart-line-total">

        ${formatCurrency(
          item.price * item.quantity
        )}

      </div>

    `;

    container.appendChild(row);

  });

}

function increaseQty(id) {

  const cart =
    getCart();

  const item =
    cart.find(

      item =>

        String(item.id)
        ===
        String(id)
    );

  if (!item) return;

  item.quantity += 1;

  setCart(cart);

}

function decreaseQty(id) {

  let cart =
    getCart();

  const item =
    cart.find(

      item =>

        String(item.id)
        ===
        String(id)
    );

  if (!item) return;

  item.quantity -= 1;

  cart =
    cart.filter(
      item => item.quantity > 0
    );

  setCart(cart);

}

document.addEventListener(

  'DOMContentLoaded',

  () => {

    renderCart();

  }

);