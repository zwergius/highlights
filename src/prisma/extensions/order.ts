type Args = {
  customer: {
    name: string
    surname: string
  }
  items: {
    packages: { weightEffective: number | null }[]
    // Added by computeOrderItem
    totalWeight: number
    totalWeightEffective: number
    totalPrice: number
    totalPriceEffective: number
  }[]
  securityMargin: number
  serviceFee: number
  deliveryPrice: number
}

type WithComputed<T> = T & {
  customerFullName: string
  hasEffectiveWeight: boolean
  subtotal: number
  subtotalEffective: number
  total: number
  totalEffective: number
  toRefund: number
}

export function computeOrder<Type extends Args>(order: Type): WithComputed<Type> {
  const hasEffectiveWeight = !!order.items.find(
    (item) => !!item.packages.find((pack) => pack.weightEffective !== null),
  )
  const subtotal = order.items.reduce((acc, cur) => acc + cur.totalPrice, 0)
  const subtotalEffective = order.items.reduce((acc, cur) => acc + cur.totalPriceEffective, 0)
  const total = subtotal + order.serviceFee + order.securityMargin + order.deliveryPrice
  const totalEffective = subtotalEffective + order.serviceFee + order.deliveryPrice
  return {
    ...order,
    customerFullName: `${order.customer.name} ${order.customer.surname}`,
    hasEffectiveWeight,
    subtotal,
    subtotalEffective,
    total,
    totalEffective,
    toRefund: total - totalEffective,
  }
}
