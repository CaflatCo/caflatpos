/* =========================
   GLOBAL UNIT SYSTEM
========================= */

window.UNITS = {

  CONVERSIONS: {

    g: 1,

    kg: 1000,

    mg: 0.001,

    ml: 1,

    l: 1000,

    pc: 1,

    pcs: 1

  }

};

/* =========================
   GLOBAL HELPERS
========================= */

window.normalizeUnitValue =
  function(
    value,
    unit
  ) {

    const safeUnit =
      String(unit || '')
        .toLowerCase();

    const multiplier =
      window.UNITS.CONVERSIONS[
        safeUnit
      ];

    if (!multiplier) {

      console.warn(
        'Unknown unit:',
        unit
      );

      return Number(value || 0);

    }

    return (
      Number(value || 0) *
      multiplier
    );

  };