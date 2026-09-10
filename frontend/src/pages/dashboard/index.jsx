import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getAllposts } from '@/config/redux/action/postAction'
import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'

export default function Dashboard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const authState = useSelector((state) => state.auth)

  const [isTokenThere, setIsTokenThere] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      setIsTokenThere(true)
    }
  }, [router])

  useEffect(() => {
    if (isTokenThere) {
      const token = localStorage.getItem('token')
      if (token) {
        dispatch(getAllposts())
        dispatch(getAboutUser({ token }))
      }
      if(!authState.all_profiles_fetched){
        dispatch(getAllUsers())
      }
    }
  }, [isTokenThere, dispatch])

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Dashboard</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}