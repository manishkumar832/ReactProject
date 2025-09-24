import React, { useState } from 'react'
import './Login.css'
import { authentication } from '../../Firebase/FirebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
const Login = ({ setRole }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, selectRole] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(authentication, email, password)
      localStorage.setItem('role', role)
      setRole(role) 
      navigate(`/${role}Dashboard`)
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <div className='login'>
      <form onSubmit={handleLogin} className='loginForm'>
        <h2>Login Form</h2>
        <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
        <select onChange={(e) => selectRole(e.target.value)} required>
          <option value="" disabled selected>--choose Role--</option>
          <option value="owner">Owner</option>
          <option value="tenant">Tenant</option>
        </select>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}


export default Login
