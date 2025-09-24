import React, { useEffect, useState } from 'react'
import Mainpage from './Mainpage/Mainpage'
import Navbar from './Navbar/Navbar'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import { Route, Routes, useNavigate } from 'react-router-dom'
import OwnerDash from './DashBoards/Owner/OwnerDash'
import OwnerBooking from './DashBoards/Owner/OwnerBooking/Ownerbooking'
import Events from './pages/Events/Events'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import MyBookings from './DashBoards/Tenant/TenantBooking/Tenantbooking'





function App() {
  const [role, setRole] = useState(localStorage.getItem('role'))

  useEffect(() => {

    const storedRole = localStorage.getItem('role')
    if (storedRole !== role) {
      setRole(storedRole)
    }
  }, [])

  return (
    <div>
      <Navbar role={role} setRole={setRole} />
      <Routes>
        <Route path='/' element={<Mainpage />} />
        <Route path='/signup' element={<Signup />} />
  
        <Route path='/login' element={<Login setRole={setRole} />} />
        <Route path='/myevents' element={<OwnerDash />} />
       <Route path="/events" element={<Events />} />
       <Route path='/bookings' element={<OwnerBooking/>}/>
       <Route path='/mybookings' element={<MyBookings/>}/>

      </Routes>
    </div>
  )
}

export default App

