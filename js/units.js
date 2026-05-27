/* =========================
   Units System
========================= */

window.UNITS = {

  SOLID_BASE: 'g',

  LIQUID_BASE: 'ml',

  CONVERSIONS: {

    g: 1,

    kg: 1000,

    ml: 1,

    l: 1000

  }

};

function normalizeUnitValue(
  value,
  unit
) {

  const multiplier =
    UNITS.CONVERSIONS[
      String(unit || '')
        .toLowerCase()
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

}