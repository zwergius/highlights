type Args = {
  pieceVariant: {
    priceKgDifference: number
  } | null
  saleItem: {
    priceKg: number
    unitWeight: number
  } | null
}

type WithComputed<T> = T & {
  unitPrice: number
}

export function computeCartItem<Type extends Args>(cartItem: Type): WithComputed<Type> {
  const pricePerGram =
    (cartItem.saleItem!.priceKg + cartItem.pieceVariant!.priceKgDifference) / 1000
  const unitPrice = pricePerGram * cartItem.saleItem!.unitWeight
  return {
    ...cartItem,
    unitPrice,
  }
}
