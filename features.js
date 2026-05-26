window.APP_FEATURES = {

  ENABLE_PRINTING: false,

  ENABLE_CLOUD_SYNC: false,

  ENABLE_MULTI_BRANCH: false,

  ENABLE_ANALYTICS: true,

  ENABLE_ADVANCED_REPORTS: true,

  ENABLE_INVENTORY_WARNINGS: true,

  ENABLE_AUDIT_LOGS: true,

  ENABLE_EMPLOYEE_ACCOUNTS: false

};

function isFeatureEnabled(feature) {

  return !!APP_FEATURES[feature];

}