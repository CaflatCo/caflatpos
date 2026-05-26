window.APP_SNAPSHOTS =
  window.APP_SNAPSHOTS || [];

function createSnapshot(
  label = 'snapshot'
) {

  const snapshot = {

    label,

    timestamp:
      new Date().toISOString(),

    state:
      JSON.parse(
        JSON.stringify(APP_STATE)
      )

  };

  APP_SNAPSHOTS.push(
    snapshot
  );

  return snapshot;

}

function restoreSnapshot(index) {

  const snapshot =
    APP_SNAPSHOTS[index];

  if (!snapshot) {

    console.warn(
      'Snapshot not found'
    );

    return false;

  }

  window.APP_STATE =
    JSON.parse(
      JSON.stringify(snapshot.state)
    );

  saveState();

  console.info(
    `Snapshot restored: ${snapshot.label}`
  );

  return true;

}
