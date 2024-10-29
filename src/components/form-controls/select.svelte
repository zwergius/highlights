<script lang="ts">
  import Select from 'svelte-select'
  import { onMount } from 'svelte'
  import { Label } from '$lib/components/form-controls'

  export let disabled = false
  export let label = ''
  export let multiple = false
  export let name: string
  export let options: Array<{ label: string; value: string }>
  export let placeholder = ''
  export let required = false
  export let clearable = true
  export let value: string | string[] | undefined = ''
  export let justValue: string | undefined = undefined

  let touched = false
  let errorMessage = ''
  let selectWrapper: HTMLElement
  let selectElement: HTMLSelectElement | null = null

  function handleErrorMessage(e: HTMLSelectElement) {
    const { customError, valid, valueMissing } = e.validity

    if (valid || (multiple && value && value?.length > 0)) {
      errorMessage = ''
    } else if (customError) {
      errorMessage = e.validationMessage
      e.setAttribute('aria-invalid', 'true')
      e.setAttribute('aria-describedby', `${name}-error`)
    } else if (valueMissing) {
      errorMessage = 'Veuillez sélectionner.'
      e.setAttribute('aria-invalid', 'true')
      e.setAttribute('aria-describedby', `${name}-error`)
    }
  }

  function handleOnBlur() {
    touched = true
    if (selectElement && required) {
      selectElement.checkValidity()
    }
  }

  function handleOnInvalid(e: Event) {
    e.preventDefault() // Hides default bubble
    touched = true
    if (selectElement && required) {
      handleErrorMessage(selectElement)
      if (value || value?.length) {
        selectElement.removeEventListener('invalid', handleOnInvalid)
      }
    }
  }

  function handleOnInput() {
    if (touched && selectElement && required) {
      selectElement.checkValidity()
      handleErrorMessage(selectElement)
    }
  }

  function handleOnClear() {
    touched = true
    if (!value || !value?.length) {
      errorMessage = 'Veuillez sélectionner.'
    }
  }

  function setupMutationObserver(): MutationObserver {
    return new MutationObserver(() => {
      if (selectElement) return
      const element = selectWrapper.querySelector('select')
      if (element) {
        selectElement = element
        selectElement.addEventListener('invalid', handleOnInvalid)
        selectElement.checkValidity()
      }
    })
  }

  onMount(() => {
    let observer: MutationObserver
    if (required) {
      observer = setupMutationObserver()
      observer.observe(selectWrapper, { subtree: true, childList: true })
    }

    return () => {
      if (observer) {
        observer.disconnect()
        selectElement?.removeEventListener('invalid', handleOnInvalid)
      }
    }
  })
</script>

<Label {name} {label} {errorMessage} {touched}>
  <div bind:this={selectWrapper} class="select-wrapper" class:touched data-name={name}>
    <Select
      bind:value
      bind:justValue
      {disabled}
      {clearable}
      items={options}
      {multiple}
      {name}
      on:blur={handleOnBlur}
      on:clear={handleOnClear}
      on:invalid={handleOnInvalid}
      on:input={handleOnInput}
      {placeholder}
      {required}
      showChevron={!multiple || !value?.length}
    ></Select>
  </div>
</Label>

<style lang="postcss">
  .select-wrapper {
    @apply w-full max-w-lg border rounded text-sm outline-none bg-white;
    --border: none;
    --border-hover: none;
    --border-focused: none;
    --chevron-height: theme(size.4);
    --clear-icon-width: theme(size.4);
    --font-size: theme(fontSize.sm);
    --height: calc(theme(fontSize.sm) + theme(spacing.4) + 2);
    --multi-item-height: calc(theme(fontSize.sm) * theme(lineHeight.5));
    --item-padding: theme(spacing.1) theme(spacing.2);
    --multi-select-padding: 0 0 0 theme(spacing.3);
    --multi-select-input-padding: 0;
    --multi-select-input-margin: 0;
    --padding: 0 0 0 theme(spacing.3);
    --placeholder-color: theme(textColor.slate.400);
    --value-container-padding: theme(spacing.2) 0;
  }

  .select-wrapper > :global(.svelte-select) {
    @apply pl-3;
  }

  .select-wrapper.touched:has(select:required:invalid) {
    @apply outline outline-2 outline-offset-2 outline-danger;
  }

  .select-wrapper:has(input:focus) {
    @apply outline outline-sky-300;
  }
</style>
