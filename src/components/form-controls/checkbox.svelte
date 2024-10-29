<script lang="ts">
  import { Label } from '$lib/components/form-controls'

  export let checked: boolean = false
  export let disabled = false
  export let label: string
  export let name: string
  export let required = false

  let touched = false
  let errorMessage = ''

  function handleErrorMessage(e: HTMLInputEvent) {
    const { customError, valid, valueMissing } = e.currentTarget.validity

    if (valid) {
      errorMessage = ''
    } else if (customError) {
      errorMessage = e.currentTarget.validationMessage
    } else if (valueMissing) {
      errorMessage = 'Veuillez sélectionner.'
    }
  }

  function handleOnInvalid(e: HTMLInputEvent) {
    e.preventDefault() // Hides default bubble
    touched = true
    handleErrorMessage(e)
  }

  function handleOnInput(e: HTMLInputEvent) {
    ;({ checked } = e.currentTarget)

    if (touched) {
      e.currentTarget.checkValidity()
      handleErrorMessage(e)
    }
  }
</script>

<Label {label} {name} {errorMessage} {touched}>
  <input
    aria-invalid={touched && Boolean(errorMessage) ? true : undefined}
    aria-describedby={touched && Boolean(errorMessage) ? `${name}-error` : undefined}
    class:touched
    class="h-4 w-auto px-2 accent-brand"
    {checked}
    {disabled}
    id={name}
    {name}
    on:invalid={handleOnInvalid}
    on:input={handleOnInput}
    {required}
    type="checkbox"
  />
</Label>

<style lang="postcss">
  input.touched:required:invalid {
    @apply outline outline-2 outline-offset-2 outline-danger;
  }
</style>
