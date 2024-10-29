<script lang="ts">
  import { enhance } from '$app/forms'
  import type { ActionResult, SubmitFunction } from '@sveltejs/kit'
  import { notifications } from '$lib/stores/notifications'

  export let action: string | undefined = undefined
  export let disableFeedback: boolean = false
  export let enctype: string | undefined = undefined
  export let errorMessage = "Erreur lors de l'enregistrement"
  export let hideButtonsBorder = false
  export let id: string | undefined = undefined
  export let onSuccess: (() => void) | ((result: ActionResult) => void) | undefined = undefined
  export let ref: HTMLFormElement | undefined = undefined
  export let reset = false
  export let successMessage = 'Enregistré avec succès'

  let showMessage: ActionResult['type'] | null
  let isSubmitting = false

  const handleSubmit: SubmitFunction = ({ cancel, formElement }) => {
    const isValid = formElement.reportValidity()

    if (!isValid) {
      const elements = Array.from(formElement.elements) as HTMLInputElement[]
      const firstInvalidField = elements.find((element) => !element.validity.valid)
      if (firstInvalidField) {
        firstInvalidField.focus()
        firstInvalidField.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
      }
      isSubmitting = false
      cancel()
      return
    }
    if (isSubmitting) cancel()
    isSubmitting = true

    return async ({ result, update }) => {
      showMessage = result.type
      if (showMessage === 'success' || showMessage === 'redirect') {
        if (!disableFeedback) notifications.add(successMessage)
        if (onSuccess) onSuccess(result)
      } else if (!disableFeedback) {
        notifications.add(errorMessage, true)
      }
      isSubmitting = false
      update({ reset })
    }
  }
</script>

<form
  {action}
  bind:this={ref}
  class="flex flex-col items-start gap-4"
  {enctype}
  {id}
  method="POST"
  novalidate
  use:enhance={handleSubmit}
>
  <slot />

  {#if $$slots.buttons}
    <div
      class="flex justify-end w-full {hideButtonsBorder
        ? 'mt-4'
        : 'pt-4 mt-12 border-t border-slate-300 border-solid'}"
    >
      <slot name="buttons" />
    </div>
  {/if}
</form>
