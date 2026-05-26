function showNotification(
  message,
  type = 'info'
) {

  const notification =
    document.createElement('div');

  notification.className =
    `app-notification ${type}`;

  notification.textContent =
    message;

  notification.style.position =
    'fixed';

  notification.style.top =
    '20px';

  notification.style.right =
    '20px';

  notification.style.padding =
    '12px 18px';

  notification.style.background =
    '#000';

  notification.style.color =
    '#fff';

  notification.style.zIndex =
    '999999';

  notification.style.border =
    '1px solid #fff';

  notification.style.fontWeight =
    '700';

  document.body.appendChild(
    notification
  );

  setTimeout(() => {

    notification.remove();

  }, 3000);

}