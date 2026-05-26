window.APP_TRANSACTIONS =
  window.APP_TRANSACTIONS || [];

async function runTransaction(
  name,
  callback
) {

  const transaction = {

    name,

    startedAt:
      new Date().toISOString(),

    status: 'running'

  };

  APP_TRANSACTIONS.push(
    transaction
  );

  try {

    const result =
      await callback();

    transaction.status =
      'completed';

    transaction.completedAt =
      new Date().toISOString();

    return result;

  } catch (error) {

    transaction.status =
      'failed';

    transaction.error =
      error;

    console.error(
      `Transaction failed: ${name}`,
      error
    );

    return null;

  }

}
