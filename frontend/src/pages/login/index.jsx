import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/AuthReducer'
import styles from './style.module.css'

function LoginComponent() {
  const authState = useSelector((state) => state.auth)
  const router = useRouter()

  const [isLoginMethod, setIsLoginMethod] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")

  // Auto-redirect if logged in or token exists in localStorage
  useEffect(() => {
    if (authState?.loggedIn || localStorage.getItem("token")) {
      router.push("/dashboard")
    }
  }, [authState?.loggedIn, router])

  // Clear messages when switching between Sign In and Sign Up
  useEffect(() => {
    dispatch(emptyMessage())
    setErrorMessage("")
  }, [isLoginMethod, dispatch])

  const handleRegister = () => {
    if (!name || !username || !email || !password) {
      setErrorMessage("All fields are required")
      return
    }
    setErrorMessage("")
    dispatch(registerUser({ name, username, email, password }))
  }

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage("All fields are required")
      return
    }
    setErrorMessage("")
    dispatch(loginUser({ email, password }))
  }

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardleft__heading}>{isLoginMethod ? "Sign In" : "Sign Up"}</p>

            {/* Error / Feedback display area */}
            <p style={{ color: errorMessage || authState?.isError ? "red" : "green", minHeight: "20px" }}>
              {errorMessage ? errorMessage : (typeof authState?.message === 'string' ? authState?.message : authState?.message?.message)}
            </p>

            <div className={styles.inputContainers}>
              {!isLoginMethod && (
                <div className={styles.inputRow}>
                  <input 
                    value={username} 
                    onChange={(e) => {
                      setUsername(e.target.value)
                      if (errorMessage) setErrorMessage("")
                    }} 
                    className={styles.inputField} 
                    type="text" 
                    placeholder="Username" 
                  />
                  <input 
                    value={name} 
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errorMessage) setErrorMessage("")
                    }} 
                    className={styles.inputField} 
                    type="text" 
                    placeholder="Name" 
                  />
                </div>
              )}

              <input 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errorMessage) setErrorMessage("")
                }} 
                className={styles.inputField} 
                type="text" 
                placeholder="Email" 
              />
              <input 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errorMessage) setErrorMessage("")
                }} 
                className={styles.inputField} 
                type="password" 
                placeholder="Password" 
              />

              <div 
                onClick={() => {
                  if (isLoginMethod) {
                    handleLogin()
                  } else {
                    handleRegister()
                  }
                }} 
                className={styles.buttonWithOutline}
              >
                <p>{isLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer__right}>
            <div>
              {isLoginMethod ? (
                <p>Don't have an account?</p>
              ) : (
                <p>Already Have an Account?</p>
              )}

              <div 
                onClick={() => setIsLoginMethod(!isLoginMethod)} 
                style={{ color: "black", cursor: "pointer" }} 
                className={styles.buttonWithOutline}
              >
                <p>{isLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default LoginComponent;