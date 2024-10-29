type Args = {
  packages: {
    weight: number
    weightEffective: number | null
    price: number
  }[]
}

type WithComputed<T> = T & {
  totalWeight: number
  totalWeightEffective: number
  totalPrice: number
  totalPriceEffective: number
}

export function computeOrderItem<Type extends Args>(item: Type): WithComputed<Type> {
  const totalWeight = item.packages.reduce((acc, cur) => acc + cur.weight, 0)
  const totalWeightEffective = item.packages.reduce(
    (acc, cur) => acc + (cur.weightEffective ?? 0),
    0,
  )
  const totalPrice = item.packages.reduce((acc, cur) => acc + cur.price, 0)
  const totalPriceEffective = item.packages.reduce(
    (acc, cur) => acc + ((cur.weightEffective ?? 0) / cur.weight) * cur.price,
    0,
  )
  return {
    ...item,
    totalWeight,
    totalWeightEffective,
    totalPrice,
    totalPriceEffective,
  }
}
