function buildReceiptText(
  transaction
) {

  const lines = [];

  lines.push(
    APP_CONFIG.APP_NAME
  );

  lines.push(
    '----------------------'
  );

  lines.push(
    `Receipt #${transaction.id}`
  );

  lines.push(
    formatDate(
      transaction.createdAt
    )
  );

  lines.push('');

  transaction.items.forEach(
    item => {

      lines.push(
        `${item.name}`
      );

      lines.push(
        `${item.quantity} × ${formatCurrency(item.price)}`
      );

    }
  );

  lines.push(
    '----------------------'
  );

  lines.push(
    `TOTAL: ${formatCurrency(transaction.total)}`
  );

  lines.push('');

  lines.push(
    'Thank you!'
  );

  return lines.join('\n');

}
