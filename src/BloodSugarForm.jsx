
import { useState, useEffect } from "react"
import { supabase } from './utils/supabase'


function BloodSugarForm({ savedReading, setSavedReading, editingIndex, setEditingIndex }) {
    const [bloodSugar, setBloodSugar] = useState("")
    const [error, setError] = useState("")

        // Editing logic
        useEffect(() => {
        if (editingIndex !== null) {
            const reading = savedReading[editingIndex]
            setBloodSugar(reading.value)
            }
        }, [editingIndex, savedReading])


    
        const handleSave = async () => {
                if (!bloodSugar) {
                setError("Please enter a blood sugar value.")
                    return
                }

                setError("")
                
               // UPDATE existing reading
                if (editingIndex !== null) {
                    const databaseId = savedReading[editingIndex].id

                    const { error: supabaseErrorUpd } = await supabase.from('health_readings').update({
                        blood_sugar: Number(bloodSugar)
                    }).eq('id', databaseId)

                    if ( supabaseErrorUpd ) {
                        setError(supabaseErrorUpd.message)
                        return
                    }
                
                    const updateReading = {...savedReading[editingIndex],
                        value: String(bloodSugar)
                    }

                    const updateReadings = savedReading.map((reading, index) => 
                        index === editingIndex ? updateReading : reading 
                    )
                        setSavedReading(updateReadings)

                // Exit editing mode
                setEditingIndex(null)

                // Clear the input
                setBloodSugar("")

                return
            }

                // Insert query
                const { data, error: supabaseError } = await supabase.from('health_readings').insert([{
                    measurement_type: "Blood Sugar",
                    blood_sugar: Number(bloodSugar)
                }]).select()

                if (supabaseError) {
                    setError(supabaseError.message)
                    return
                }

                // Get the new Supabase record
                const newReading = { id: data[0].id, type: data[0].measurement_type, value: String(data[0]
                    .blood_sugar), date: data[0].recorded_at ?? data[0].created_at
                }

                setSavedReading([...savedReading, newReading])
            
                // Clear the input
                    setBloodSugar("")
            }


    return (
        <div>
            <h2>Add Blood Sugar</h2>
            <label>Blood Sugar</label>
            <input className="syslab" type="number" value={bloodSugar}
                onChange={(event) => setBloodSugar(event.target.value)}
                placeholder="Enter sugar value"
            />
            <button className="savBtn" onClick={handleSave}>Save Reading</button>
            <p>{error}</p>
        </div>
    )
    
}

export default BloodSugarForm