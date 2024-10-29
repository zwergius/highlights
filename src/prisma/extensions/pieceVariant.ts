import type { PieceName, VariantName } from '@prisma/client'
import { piece, pieceVariant } from '$lib/helpers/translations'

type Args = {
  name: VariantName | null
  piece: {
    name: PieceName
  }
}

type WithTranslatedName<T> = T & {
  translatedName: string
}

export function computePieceVariant<Type extends Args>(variant: Type): WithTranslatedName<Type> {
  const translatedName = variant.name
    ? `${piece[variant.piece.name]} - ${pieceVariant[variant.name]}`
    : piece[variant.piece.name]
  return {
    ...variant,
    translatedName,
  }
}
