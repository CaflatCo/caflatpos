function isValidNumber(value) {

  return (
    !isNaN(value) &&
    value !== null &&
    value !== ''
  );

}

function isPositiveNumber(value) {

  return (
    isValidNumber(value) &&
    Number(value) >= 0
  );

}

function isNonEmptyString(value) {

  return (
    typeof value === 'string' &&
    value.trim().length > 0
  );

}

function validateProductData(product) {

  if (!isNonEmptyString(product.name)) {

    showNotification(
      'Product name is required',
      'error'
    );

    return false;

  }

  if (!isPositiveNumber(product.price)) {

    showNotification(
      'Invalid product price',
      'error'
    );

    return false;

  }

  if (!isPositiveNumber(product.cost)) {

    showNotification(
      'Invalid product cost',
      'error'
    );

    return false;

  }

  return true;

}
