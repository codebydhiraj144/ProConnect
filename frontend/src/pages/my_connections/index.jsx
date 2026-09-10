import React from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout' // Fixed import

export default function MyConnectionPage() {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>My Connections</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}