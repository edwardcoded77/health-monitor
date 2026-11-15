
import Navbar from './Navbar'
import Dashboard from './Dashboard'
import { supabase } from './utils/supabase'
import './App.css'
import "@picocss/pico"




function App() {

  return (
    <>
      <Navbar/>
      <Dashboard/>
    </>
  )
}

export default App
