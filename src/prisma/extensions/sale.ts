type Args = {
  stock: Array<{
    units: number
    unitsSold: number // added by computeSaleItem
  }>
}

type WithComputed<T> = T & {
  percentageSold: number
}

export function computeSale<Type extends Args>(sale: Type): WithComputed<Type> {
  let percentageSold = 0
  const { sold, total } = sale.stock.reduce(
    (dict, saleItem) => {
      dict.total += saleItem.units
      dict.sold += saleItem.unitsSold
      return dict
    },
    { total: 0, sold: 0 },
  )
  percentageSold = sold / total

  return {
    ...sale,
    percentageSold,
  }
}
