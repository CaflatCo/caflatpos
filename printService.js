function printReceipt(
  transaction
) {

  const receiptText =
    buildReceiptText(
      transaction
    );

  createAuditEntry(
    'receipt_printed',

    {

      transactionId:
        transaction.id

    }
  );

  trackMetric(
    'receipt_printed',

    {

      transactionId:
        transaction.id

    }
  );

  const printWindow =
    window.open(
      '',
      '_blank',
      'width=400,height=700'
    );

  if (!printWindow) {

    showNotification(
      'Popup blocked',
      'error'
    );

    return;

  }

  printWindow.document.write(`
    <html>

      <head>

        <title>
          Receipt
        </title>

        <style>

          body {

            font-family:
              monospace;

            white-space:
              pre-wrap;

            padding: 20px;

          }

        </style>

      </head>

      <body>

${receiptText}

      </body>

    </html>
  `);

  printWindow.document.close();

  printWindow.print();

}