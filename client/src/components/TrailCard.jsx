import { useState, useEffect } from "react";
import { useTrailCardContext } from "../context/TrailCardContext";

function TrailCard({ trail, activity }) { // "activity": "hiking", "camping", etc or "any"
    const [trailLength, setTrailLength] = useState("0");
    const [description, setDescription] = useState("No description available"); // Trail description for a specific activity may differ from the trail in general
    const [rating, setRating] = useState("0.00");

    const { addToSaved, removeFromSaved, isSaved } = useTrailCardContext();
    const saved = isSaved(trail.name);
    
    useEffect(() => { // useEffect synchronizes component with external system
        // Gets values from keys from "activity" (e.g. hiking, camping) key
        const setData = () => {
            if (activity != "any") {
                setTrailLength(trail.activities[activity]["length"]);
                setDescription(trail.activities[activity].description);
                setRating(trail.activities[activity].rating);
            } else {
                const activityType = Object.keys(trail.activities)[0];
                
                setTrailLength(trail.activities[activityType]["length"]);
                setDescription(trail.activities[activityType].description);
                setRating(trail.activities[activityType].rating);
            }
        }

        setData();
    }, [])

    const onSaveClick = (event) => {
        event.preventDefault();
        saved ? removeFromSaved(trail.name) : addToSaved(trail);
    }

    return (
        <div className="bg-green-200 w-95/100 rounded-2xl mt-8">
            <div className="px-8 py-4">
                <p className="text-2xl font-bold">{trail.name}</p>
                <p className="">{trail.city}, {trail.state}, {trail.country}</p>
                <div className="flex justify-start">
                    <p className="mr-4">Length {trailLength} miles</p>
                    <p>Rating {rating} </p>
                </div>
                <p>Description: {trail.description}</p>
            </div>

            <button className={`save-btn ${saved ? "active" : ""}`} onClick={onSaveClick}>
                Save ♡
            </button>
        </div>
    )
}

export default TrailCard
