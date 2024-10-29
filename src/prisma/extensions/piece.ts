import type { PieceName } from '@prisma/client'
import { piece as pieceName } from '$lib/helpers/translations'

type Args = {
  name: PieceName
}

type WithTranslatedName<T> = T & {
  translatedName: string
}

export function computePiece<Type extends Args>(piece: Type): WithTranslatedName<Type> {
  return {
    ...piece,
    translatedName: pieceName[piece.name],
  }
}
