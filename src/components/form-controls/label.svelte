<script lang="ts">
  import { fade } from 'svelte/transition'
  import Tooltip from '$lib/components/tooltip/tooltip.svelte'

  export let errorMessage: string | undefined = undefined
  export let label: string | undefined = undefined
  export let name: string
  export let title = ''
  export let tooltip = ''
  export let touched: boolean = false
</script>

<div class="wrapper relative w-full">
  <label class="max-w-lg group flex items-center gap-1" for={name} {title}>
    <slot name="icon" />
    {#if label}
      <span class="truncate">
        {@html label}
      </span>
    {/if}
    {#if Boolean(tooltip)}
      <Tooltip>{tooltip}</Tooltip>
    {/if}
  </label>
  <div class="flex gap-1 items-center">
    <slot />
  </div>
  {#if touched && Boolean(errorMessage)}
    <span
      id="{name}-error"
      class="absolute -bottom-5 right-0 text-danger text-xs text-right whitespace-nowrap"
      transition:fade
      role="alert"
    >
      {errorMessage}
    </span>
  {/if}
</div>

<style lang="postcss">
  .wrapper:has(input[type='radio']),
  .wrapper:has(input[type='checkbox']) {
    @apply flex flex-row-reverse items-center gap-2 justify-end px-1;
  }

  .wrapper:has(input + .slider) {
    @apply flex-row justify-between;
  }

  .wrapper:has(input[type='checkbox']:disabled) label {
    @apply opacity-70 cursor-not-allowed;
  }

  .wrapper:has(input[type='checkbox'].touched:required:invalid) span[id$='-error'] {
    @apply left-0 right-auto;
  }
</style>
