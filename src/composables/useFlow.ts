import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export type FlowStep = 'phone' | 'iframe'
export type ValidationStatus = 'idle' | 'processing' | 'success' | 'failed'

export function useFlow() {
  const step = ref<FlowStep>('phone')
  const phone = ref('')
  const countryCode = ref('+57')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const status = ref<ValidationStatus>('idle')
  const userId = ref<string | null>(null)

  const fullPhone = computed(() => `${countryCode.value}${phone.value}`)

  const validatePhone = async () => {
    if (!phone.value.trim()) {
      error.value = 'Por favor ingresa tu número de WhatsApp'
      return false
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: functionError } = await supabase.functions.invoke('validate-phone', {
        body: {
          country_code: countryCode.value,
          phone_number: phone.value,
        },
      })

      if (functionError) {
        console.error('Function error:', functionError)
        error.value = 'Error al validar el teléfono. Por favor intenta nuevamente.'
        return false
      }

      if (data.exists) {
        error.value = 'Este número de teléfono ya está registrado'
        return false
      }

      if (data.can_proceed) {
        userId.value = data.user_id
        step.value = 'iframe'
        status.value = 'processing'
        return true
      }

      return false
    } catch (err) {
      console.error('Unexpected error:', err)
      error.value = 'Error inesperado. Por favor intenta nuevamente.'
      return false
    } finally {
      loading.value = false
    }
  }

  const setStatus = (newStatus: ValidationStatus) => {
    status.value = newStatus
  }

  const reset = () => {
    step.value = 'phone'
    phone.value = ''
    countryCode.value = '+57'
    loading.value = false
    error.value = null
    status.value = 'idle'
    userId.value = null
  }

  return {
    step,
    phone,
    countryCode,
    loading,
    error,
    status,
    userId,
    fullPhone,
    validatePhone,
    setStatus,
    reset,
  }
}
