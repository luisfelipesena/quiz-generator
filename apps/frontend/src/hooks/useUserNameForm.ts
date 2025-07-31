import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userNameSchema, type UserNameFormData } from '@/lib/validations'
import { useQuizStore } from '@/stores/quiz-store'

export function useUserNameForm(onSuccess: () => void) {
  const { setUserName } = useQuizStore()

  const form = useForm<UserNameFormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
  })

  const onSubmit = (data: UserNameFormData) => {
    setUserName(data.name)
    onSuccess()
  }

  const handleSubmit = form.handleSubmit(onSubmit)

  return {
    form,
    handleSubmit,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  }
}