function TrailCard({ trail }) {
    return (
        <div className="trailContent">
            <p>Name: {trail.name}</p>
            <p>City: {trail.city}</p>
            <p>State: {trail.state}</p>
            <p>Country: {trail.country}</p>
        </div>
    )
}

export default TrailCard
