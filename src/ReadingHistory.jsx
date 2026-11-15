import ReadingCard from './ReadingCard'

function ReadingHistory({ savedReading , handleDelete , handleEdit}) {
    return (
        <section>
            <h2 className='hist-Btn'>Reading History</h2>
            {savedReading.map((reading, index) => (
                <ReadingCard
                    key={index}
                    type={reading.type}
                    value={reading.value}
                    date={reading.date}
                    handleDelete={handleDelete}
                    index={index}
                    handleEdit={handleEdit}
                />
            ))}
        </section>
    )
}

export default ReadingHistory