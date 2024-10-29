<script lang="ts">
  import Label from '$lib/components/form-controls/label.svelte'
  import Eye from 'svelte-material-icons/EyeOutline.svelte'
  import EyeOff from 'svelte-material-icons/EyeOffOutline.svelte'

  export let autocomplete: string | undefined = undefined
  export let autofocus: boolean | undefined = undefined
  export let ariaLabel: string | undefined = undefined
  export let description: string | undefined = undefined
  export let disabled = false
  export let form: string | undefined = undefined
  export let label: string | undefined = undefined
  export let labeledBy: string | undefined = undefined
  export let max: string | number | undefined = undefined
  export let min: string | number | undefined = undefined
  export let minlength: number | undefined = undefined
  export let maxlength: number | undefined = undefined
  export let name: string
  export let onBlur: ((e: HTMLInputEvent) => void) | undefined = undefined
  export let onInput: ((e: HTMLInputEvent) => void) | undefined = undefined
  export let pattern: string | undefined = undefined
  export let patternErrorMessage: string | undefined = undefined
  export let placeholder = ''
  export let required = false
  export let readonly = false
  export let step: number | undefined = undefined
  export let tooltip = ''
  export let touched = false
  export let type: 'date' | 'datetime-local' | 'email' | 'number' | 'password' | 'tel' | 'text' =
    'text'
  export let value: string | number | null | undefined = ''

  let errorMessage = ''
  let inputDescribedBy: string | undefined = undefined
  const finalPattern = maxlength && !pattern ? `^.{0,${maxlength}}$` : pattern
  const isPasswordInput = type === 'password'
  $: setDescribedBy(), description, errorMessage, errorMessage

  function handleErrorMessage(e: HTMLInputEvent) {
    const {
      badInput,
      customError,
      patternMismatch,
      rangeOverflow,
      rangeUnderflow,
      stepMismatch,
      tooShort,
      typeMismatch,
      valid,
      valueMissing,
    } = e.currentTarget.validity

    if (valid) {
      errorMessage = ''
    } else if (badInput && type === 'number') {
      errorMessage = 'Veuillez entrer un numéro.'
    } else if (customError) {
      errorMessage = e.currentTarget.validationMessage
    } else if (valueMissing) {
      errorMessage = 'Ce champ est obligatoire.'
    } else if (tooShort) {
      errorMessage = `Minimum ${minlength} lettres.`
    } else if (typeMismatch && type === 'email') {
      errorMessage = 'E-mail invalide, exemple votre-nom@domaine.com.'
    } else if (patternMismatch && maxlength) {
      errorMessage = `Maximum ${maxlength} lettres.`
    } else if (patternMismatch && type === 'tel') {
      errorMessage = 'Seuls les chiffres sont autorisés.'
    } else if (patternMismatch && patternErrorMessage) {
      errorMessage = patternErrorMessage
    } else if (patternMismatch) {
      errorMessage = e.currentTarget.validationMessage
    } else if (rangeOverflow && (type === 'date' || type === 'datetime-local')) {
      errorMessage = `La date sélectionnée ne peut pas être postérieure à ${max}.`
    } else if (rangeUnderflow && (type === 'date' || type === 'datetime-local')) {
      errorMessage = `La date sélectionnée ne peut pas être antérieure à ${min}.`
    } else if (rangeOverflow && type === 'number') {
      errorMessage = `Seulement ${max} packs disponibles.`
    } else if (rangeUnderflow && type === 'number') {
      errorMessage = `La valeur ne peut pas être inférieure à ${min}.`
    } else if (stepMismatch) {
      errorMessage = `Veuillez saisir une valeur par incréments de ${step}.`
    }
  }

  function handleOnBlur(e: HTMLInputEvent) {
    touched = true
    e.currentTarget.checkValidity()
    if (onBlur) {
      onBlur(e)
    }
  }

  function handleOnInvalid(e: HTMLInputEvent) {
    e.preventDefault() // Hides default bubble
    touched = true
    handleErrorMessage(e)
  }

  function handleOnInput(e: HTMLInputEvent) {
    const { value: newValue } = e.currentTarget

    if (type.match(/^(number|range)$/)) {
      value = newValue === '' ? null : +newValue
    } else {
      value = newValue
    }

    if (type === 'datetime-local' || type === 'date') {
      touched = true
    }

    if (onInput) {
      onInput(e)
    }

    if (touched) {
      e.currentTarget.checkValidity()
      handleErrorMessage(e)
    }
  }

  function togglePasswordVisibility() {
    if (type === 'password') {
      type = 'text'
    } else {
      type = 'password'
    }
  }

  function setDescribedBy() {
    const ids = []
    if (description) ids.push(`${name}-description`)
    if (touched && errorMessage) ids.push(`${name}-error`)
    inputDescribedBy = ids.length ? ids.join(' ') : undefined
  }
</script>

<Label {name} {label} {errorMessage} {tooltip} {touched}>
  <slot name="icon" />
  <!-- svelte-ignore a11y-autofocus -->
  <input
    aria-invalid={touched && Boolean(errorMessage) ? true : undefined}
    aria-describedby={inputDescribedBy}
    aria-label={ariaLabel}
    aria-labelledby={labeledBy}
    {autocomplete}
    {autofocus}
    class:touched
    class="read-only:opacity-70 read-only:select-none read-only:pointer-events-none"
    {disabled}
    {form}
    id={name}
    {max}
    {min}
    {minlength}
    {name}
    on:blur={handleOnBlur}
    on:invalid={handleOnInvalid}
    on:input={handleOnInput}
    on:keydown
    on:focus
    on:click
    pattern={finalPattern}
    {placeholder}
    {step}
    {readonly}
    {required}
    {type}
    {value}
  />
  {#if description}
    <span id="{name}-description">{description}</span>
  {/if}
  {#if isPasswordInput}
    <button
      class="absolute bottom-2 right-2 fill-brand stroke-brand border-transparent text-brand"
      type="button"
      on:click={togglePasswordVisibility}
    >
      {#if type === 'password'}
        <Eye size="1.5em" />
      {:else}
        <EyeOff size="1.5em" />
      {/if}
    </button>
  {/if}
</Label>

<style lang="postcss">
  input.touched:required:invalid {
    @apply outline outline-2 outline-offset-2 outline-danger;
  }
</style>
