import React, { useState } from 'react'
import './Signup.css'
import { useNavigate } from 'react-router-dom'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { authentication, db } from '../../Firebase/FirebaseConfig'
import { setDoc,doc } from 'firebase/firestore'
import { Link } from 'react-router-dom'

const Signup = () => {
  const navigate=useNavigate()
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [role,setRole]=useState("")
    const handleSignup=async (e)=>{
     e.preventDefault()
     try{
          const Saverole=role==="owner"?"Owners":"Tenants"
          const UserCredentials=await createUserWithEmailAndPassword(authentication,email,password);
          console.log(UserCredentials)
          const docref=doc(db,`${Saverole}`,name)
          await setDoc(docref,{
            name:name,
            email:email,
            role:role,
            userId:UserCredentials.user.uid
          })
      navigate("/login")
     }
     catch(err){
        console.log(err)
     }
    }
  return (
    <div className='signup-container'>
      <form action="" onSubmit={handleSignup} className='signup-form'>
        <h2>SignUp Form</h2>
        <input type="text" placeholder='Name' onChange={(e)=>setName(e.target.value)} required/>
        <input type="email" placeholder='Email' onChange={(e)=>setEmail(e.target.value)} required/>
        <input type="Password"  placeholder='Password' onChange={(e)=>setPassword(e.target.value)} required/>
        <select name="" id="role" onClick={(e)=>setRole(e.target.value)} required>
            <option value="" selected disabled>--choose Role--</option>
            <option value="owner">Owner</option>
            <option value="tenant">Tenant</option>
        </select>
        <button type='submit'>SignUp</button>

        <p>If you have an Account?<Link to="/Login">LogIN</Link></p>
      </form>
    </div>
  )
}

export default Signup

