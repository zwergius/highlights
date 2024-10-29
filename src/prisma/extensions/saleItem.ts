import { type OrderStatus } from '@prisma/client'
import { orderSuccessStates } from '$lib/constants'

type Args = {
  units: number
  orderItems: Array<{ units: number; order: { status: OrderStatus } }>
}

type WithComputed<T> = T & {
  unitsSold: number
}

export function computeSaleItem<Type extends Args>(saleItem: Type): WithComputed<Type> {
  const unitsSold = saleItem.orderItems
    .filter((orderItem) => orderSuccessStates.includes(orderItem.order.status))
    .reduce((sum, orderItem) => sum + orderItem.units, 0)

  return {
    ...saleItem,
    unitsSold,
  }
}
