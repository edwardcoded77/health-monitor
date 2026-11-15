
import { useState, useEffect } from "react"
import { supabase } from './utils/supabase'

// functions from Dashboard
function ReadingForm({ savedReading, setSavedReading , editingIndex, setEditingIndex }) {

    const [saveSystolic, setSystolic] = useState("")
    const [saveDiastolic, setDiastolic] = useState("")
    const [error, setError] = useState("")

    
    // Run when either editingIndex or savedReading changes.
    useEffect(() => {
        if (editingIndex !== null) {
            const reading = savedReading[editingIndex]
            console.log("Database ID:", reading.id)
            const [systolic, diastolic] = reading.value.split(" / ")

            setSystolic(systolic)
            setDiastolic(diastolic)
        }
    }, [editingIndex, savedReading])


    // Runs when user clicks the save reading button
    const handleSave = async () => {
        if (!saveSystolic  ||  !saveDiastolic) {
            setError("Please enter value.")
            return
        }
        
                setError("")
                
                // Supabase UPDATE
                if (editingIndex !== null) {
                const databaseId = savedReading[editingIndex].id

                const { error: supabaseErrorUpd } = await supabase.from('health_readings').update({
                        systolic: Number(saveSystolic),
                        diastolic: Number(saveDiastolic)
                    }).eq('id', databaseId)

                    if(supabaseErrorUpd){
                        setError(supabaseErrorUpd.message)
                    return 
                    }
                
                

                // Create a copy of the reading with the new values
                    const updatedReading = {...savedReading[editingIndex],
                        value: `${saveSystolic} / ${saveDiastolic}`
                    }

                    // Replace the old reading with the updated reading
                    const updatedReadings = savedReading.map((reading, index) =>
                        index === editingIndex ? updatedReading : reading
                    )

                    // Update React's state
                    setSavedReading(updatedReadings)

                    // Exit editing mode
                    setEditingIndex(null)

                    // Clear the input fields
                    setSystolic("")
                    setDiastolic("")

                    return
                }


                // Create blood pressure reading to Supabase
                const { data, error: supabaseError } = await supabase.from ('health_readings').insert([{
                    measurement_type: "Blood Pressure",
                    systolic: Number(saveSystolic),
                    diastolic: Number(saveDiastolic)
                }
                ]).select()

                if (supabaseError) {
                    setError(supabaseError.message)
                    return
                }

                // Convert Supabase record into react format
                const newReading = {
                id: data[0].id,
                type: data[0].measurement_type,
                value: `${data[0].systolic} / ${data[0].diastolic}`,
                date: data[0].recorded_at ?? data[0].created_at
                }
                
                setSavedReading([...savedReading, newReading])
                setSystolic("")
                setDiastolic("")
    }

    return ( 
        <div>
            <h2>Add Blood Pressure</h2>
            <label >Systolic</label>
                <input className="syslab" type="number" value={saveSystolic} 
                onChange={(event) => setSystolic (event.target.value) }
                placeholder="Enter diastolic value" />

            <label>Diastolic</label>
                <input className="syslab" type="number" value={saveDiastolic} 
                onChange={(event) => setDiastolic (event.target.value)} 
                placeholder="Enter diastolic value"/>

            <button className="savBtn" onClick={handleSave}>Save Reading</button>

            <p>{error}</p>
        </div>

    )
}


export default ReadingForm