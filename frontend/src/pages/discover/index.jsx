import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'

export default function Discoverpage() {
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers())
    }
  }, [authState.all_profiles_fetched, dispatch])

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Discover</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}