window.APP_PERMISSIONS = {

  admin: [
    'view_dashboard',
    'manage_products',
    'manage_inventory',
    'manage_ingredients',
    'view_reports',
    'manage_settings',
    'process_sales'
  ],

  cashier: [
    'process_sales'
  ]

};

function hasPermission(permission) {

  const currentRole =
    APP_STATE.currentUserRole || 'cashier';

  const permissions =
    APP_PERMISSIONS[currentRole] || [];

  return permissions.includes(
    permission
  );

}
