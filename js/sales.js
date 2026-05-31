Caflat.CoPOS v1 - sales.js Multiplier Fix

1) In addToCart(), replace:

batchYield: Number(product.batchYield || 1)

with:

batchYield: Number(product.batchYield || 1),
multiplier: Number(variant?.multiplier || 1)

2) In buildTransactionSnapshot(), add:

multiplier: Number(item.multiplier || 1),

under:

variantId: item.variantId || '',

3) In deductProductStockForCart(), replace:

return sum + Number(line.quantity || 0);

with:

return sum + (
  Number(line.quantity || 0) *
  Number(line.multiplier || 1)
);

Expected result:
Box of 4 -> deducts 4 stock
Box of 12 -> deducts 12 stock
