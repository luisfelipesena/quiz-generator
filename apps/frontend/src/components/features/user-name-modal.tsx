'use client'

import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalContent, 
  ModalFooter 
} from '@/components/ui/modal'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useUserNameForm } from '@/hooks/useUserNameForm'

interface UserNameModalProps {
  isOpen: boolean
  onSuccess: () => void
}

export function UserNameModal({ isOpen, onSuccess }: UserNameModalProps) {
  const { form, handleSubmit, isValid, isSubmitting } = useUserNameForm()

  const onSubmit = async () => {
    try {
      await handleSubmit()
      onSuccess()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isSubmitting) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {}}
      className="max-w-md"
    >
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <ModalTitle className="text-left">
              Welcome to your quiz results!
            </ModalTitle>
            <p className="text-sm text-gray-500 mt-1">
              Let&apos;s personalize your experience
            </p>
          </div>
        </div>
      </ModalHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-0">
          <ModalContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    What&apos;s your name?
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your full name"
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="h-12 text-base"
                      aria-describedby="name-description"
                    />
                  </FormControl>
                  <FormMessage />
                  <p 
                    id="name-description" 
                    className="text-xs text-gray-500 mt-1"
                  >
                    This will help us personalize your quiz results
                  </p>
                </FormItem>
              )}
            />
          </ModalContent>

          <ModalFooter>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              size="lg"
              className="w-full h-12 text-base font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Continue to Results'
              )}
            </Button>
          </ModalFooter>
        </form>
      </Form>
    </Modal>
  )
}