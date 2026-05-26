window.APP_AUDIT_LOGS =
  window.APP_AUDIT_LOGS || [];

function createAuditEntry(
  action,
  details = {}
) {

  const entry = {

    action,

    details,

    timestamp:
      new Date().toISOString(),

    user:
      APP_STATE.currentUserRole ||
      'unknown'

  };

  APP_AUDIT_LOGS.push(
    entry
  );

  logInfo(
    `Audit: ${action}`,
    details
  );

}
