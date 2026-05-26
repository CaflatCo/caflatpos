function saveToStorage(key, data) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

  } catch (error) {

    console.error(
      `Storage save failed (${key}):`,
      error
    );

    showNotification(
      'Failed to save data',
      'error'
    );

  }

}

function loadFromStorage(key, fallback = null) {

  try {

    const data =
      localStorage.getItem(key);

    if (!data) {
      return fallback;
    }

    return JSON.parse(data);

  } catch (error) {

    console.error(
      `Storage load failed (${key}):`,
      error
    );

    return fallback;

  }

}

function removeFromStorage(key) {

  try {

    localStorage.removeItem(key);

  } catch (error) {

    console.error(
      `Storage removal failed (${key}):`,
      error
    );

  }

}
