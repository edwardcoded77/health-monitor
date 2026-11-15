
function ReadingCard(data) {

    // Convert the database timestamp into a readable date and time
    const formattedDate = data.date
        ? new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(data.date))
        : "Date unavailable"

    return (
        <div className="reading-card">

            {/* Display the measurement type */}
            <span>{data.type}</span>

            {/* Display the actual reading */}
            <strong>{data.value}</strong>

            {/* Display the formatted date */}
            <time dateTime={data.date}>
                {formattedDate}
            </time>

            {/* Delete and Edit buttons */}
            <div className="reading-actions">
                <button onClick={() => data.handleDelete(data.index)}>
                    Delete
                </button>
                <button onClick={() => data.handleEdit(data.index)}>
                    Edit
                </button>
            </div>

        </div>
    )
}

export default ReadingCard
