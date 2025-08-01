'use client'

import { Landing } from '@/components/features/landing'

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="relative min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <Landing />
      </div>
    </div>
  )
}
