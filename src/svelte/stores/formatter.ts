import { derived } from 'svelte/store'
import { page } from '$app/stores'

export const formatter = derived(page, ($page) => {
  const { locale } = $page.data
  return {
    formatCurrency: (number: number, currency: Intl.NumberFormatOptions['currency'] = 'CHF') =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(number),
    formatDate: (date: Date | string | null | undefined, options?: Intl.DateTimeFormatOptions) => {
      if (!date) return '-'
      return new Intl.DateTimeFormat(locale, options).format(new Date(date))
    },
    formatNumber: (number: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(number),
    formatRelativeTime: (
      number: number,
      unit: Intl.RelativeTimeFormatUnit,
      options: Intl.RelativeTimeFormatOptions = { style: 'short' },
    ) => new Intl.RelativeTimeFormat(locale, options).format(number, unit),
    formatWeight: (
      number: number,
      unit: Intl.NumberFormatOptions['unit'],
      notation: Intl.NumberFormatOptions['notation'] = 'compact',
    ) =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: number % 1 === 0 || unit === 'gram' ? 0 : 2,
        maximumFractionDigits:
          unit === 'gram' && (notation === 'standard' || number < 1000) ? 0 : 2,
        notation,
        style: 'unit',
        unit,
        unitDisplay: 'narrow',
      }).format(number),
  }
})
