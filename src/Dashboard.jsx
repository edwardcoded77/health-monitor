import { useState, useEffect } from "react"
import ReadingForm from './ReadingForm'
import ReadingHistory from './ReadingHistory'
import BloodSugarForm from './BloodSugarForm'
import { supabase } from './utils/supabase'




function Dashboard() {
    const [savedReading, setSavedReading] = useState([])
    const [selectedMeasurement, setSelectedMeasurement] = useState("")
    const [editingIndex, setEditingIndex] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")


    // Number of readings to retrieve per page
        const pageSize = 1
    

    // Fetch readings
        const fetchReadings = async () => {
            const { data, error } = await supabase.from('health_readings').select()
            .order('created_at', { ascending: false})
            .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1)

            if (error) {
            console.log("Error fetching readings:", error.message)
            return
            }
        
            const loadReadings = data.map((row)  => ({
            id: row.id, 
            type: row.measurement_type,
            value: row.measurement_type === "Blood Pressure"
            ? `${row.systolic} / ${row.diastolic}`
            : String(row.blood_sugar),
            date: row.recorded_at ?? row.created_at
        }))

            setSavedReading(loadReadings)
    }
    
        
        
            
    // Search readings
        const searchField = async () => {
            const searchValue = searchTerm.trim()

            if (!searchValue) {
                fetchReadings()
                return
            }

            let query = supabase.from('health_readings').select('*')

            if (!isNaN(Number(searchValue))) {
                const numberValue = Number(searchValue)

                query = query.or(
                    `measurement_type.ilike.%${searchValue}%,systolic.eq.${numberValue},diastolic.eq.${numberValue},blood_sugar.eq.${numberValue}`
                )
            } else {
                query = query.ilike('measurement_type', `%${searchValue}%`)
            }

            const { data, error } = await query.order('created_at', { ascending: false })

            if (error) {
                console.log("Error searching readings:", error.message)
                return
            }

            const loadReadings = data.map((row) => ({
                id: row.id,
                type: row.measurement_type,
                value: row.measurement_type === "Blood Pressure"
                    ? `${row.systolic} / ${row.diastolic}`
                    : String(row.blood_sugar),
                date: row.recorded_at ?? row.created_at
            }))

            setSavedReading(loadReadings)
        }

    
        const filterByDate = async () => {
            if (!startDate || !endDate) {
                console.log("Please select both start and end dates.")
            return
            }

            if (startDate > endDate) {
                console.log("Start date cannot be later than end date.")
                return
                }

                const {data, error} = await supabase.from('health_readings').select()
                    .gte('created_at', `${startDate}T00:00:00`)
                    .lt('created_at',  `${endDate}T23:59:59.999`)
                    .order('created_at',  {ascending: false})

                if (error) {
                    console.log("Error filtering readings:", error.message)
                    return
                    }  
                    const loadReadings = data.map((row) => ({
                        id: row.id,
                        type: row.measurement_type,
                        value: row.measurement_type === "Blood Pressure"
                            ? `${row.systolic} / ${row.diastolic}`
                            : String(row.blood_sugar),
                        date: row.recorded_at ?? row.created_at
                    }))
                    setSavedReading(loadReadings)
                }
            
        
                    useEffect(() => {fetchReadings()}, [])
            
                
                        const bP = () => {
                        setSelectedMeasurement("Blood Pressure")
                        }
                
                        const bS =() => { 
                        setSelectedMeasurement("Blood Sugar")
                        }
                    
                        const handleDelete = (index) => {
                            setSavedReading(savedReading.filter((reading, currentIndex) => currentIndex !== index))
                        }
                
                        const handleEdit = (index) => {
                            setEditingIndex(index)
                            setSelectedMeasurement(savedReading[index].type)
                        }
                
                    // Clear search 
                    const clearFilters = () => {
                        setSearchTerm("")
                        fetchReadings()
                        setStartDate("")
                        setEndDate("")
                        }
        

    
    return (
        <main className='app-container'>
            <header>
                <h1>Health Monitor</h1>
                <p><strong>Your daily health readings</strong></p>
            </header>
    
            <div className="measurement-section">
                <h2>Choose a reading to add</h2>
                <div className="measurement-options">
                <button  onClick={bP} className="bp-button">Blood Pressure</button>
                <button  onClick={bS} className="sugar-button">Blood Sugar</button>
                </div>
            </div>
    
            <section className="search-section">
                <h2>Search Readings</h2>
                
				<div className="search-controls">
					<input 
						type='text'
						placeholder="Search by reading type or value"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
					/>
						<button  className="search-btn" type="button" onClick={searchField}>Search</button>
					</div>
				</section>
    
            <section className="date-filter">
                <h2>Filter by Date</h2>
				
            <div className="date-inputs">

                <div className="date-field">
                    <label>Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                    />
                    </div>

                <div className="date-field">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(event) => setEndDate(event.target.value)}
                        />
                </div>
            </div>
			
			
			<div className="date-buttons">
                <button className="search-btn" type="button" onClick={filterByDate}>Search</button>
                <button  className="clear-btn" type="button" onClick={clearFilters}>Clear Search</button>
			</div>
            </section>         
    
            <section className="recent-readings">
                {/* <h2>Recent Readings</h2> */}
            
                {selectedMeasurement === "Blood Pressure" && (
                    <ReadingForm
                        savedReading={savedReading}
                        setSavedReading={setSavedReading}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex}
                    />
                )}
    
                {selectedMeasurement === "Blood Sugar" && (
                    <BloodSugarForm
                        savedReading={savedReading}
                        setSavedReading={setSavedReading}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex}
                    />
                )}
                </section>
                        
                {savedReading.length === 0 ? (
                    <p>No readings yet. Add your first reading to get started.</p>
                ) : (
                    <ReadingHistory savedReading={savedReading} handleDelete={handleDelete} handleEdit={handleEdit} />
                )}
    
            {/* <button className="history-button">View All Readings</button> */}
        </main>
            )
        }
    
    export default Dashboard





        
    

    

