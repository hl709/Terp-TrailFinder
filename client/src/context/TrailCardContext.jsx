import { useState, useEffect, createContext, useContext } from "react";

const TrailCardContext = createContext(); // Passes TrailCard data deeply throughout the tree 

// useContext is a Hook and like other hooks, you can only call a Hook inside a component, not
// inside loops or conditions.
export const UseTrailCardContext = () => useContext(TrailCardContext);

// Passes data to children which is anything inside the component you rerendered
export const TrailCardProvider = ({children}) => {
    const [saved, setSaved] = useState([]);
    const [hasBeenSaved, setHasBeenSaved] = useState(true);

    // Retrieve from DB
    useEffect(() => {
        const fetchTrails = async () => {
            const endpoint = 'http://localhost:7003/saved';

            try {
                const response = await fetch(endpoint); // Returns a Response object
                const result = await response.json(); // Parses Response for JSON

                let trailArr = [];

                for (const id in result) {
                    const trail = result[id];

                    const trailObj = {
                        name: trail.name,
                        city: trail.city,
                        state: trail.state,
                        country: trail.country,
                        description: trail.description,
                        directions: trail.directions,
                        activities: trail.activities
                    };
                
                    trailArr.push(trailObj);
                }

                setSaved(trailArr);
            } catch (err) {
                console.error(err);
            }
        }

        fetchTrails();
    }, []); // Saved trails is loaded immediately after page is rendered

    // Add or remove from DB
    useEffect(() => { // Only called when the "saved" array is changed
        const updateTrails = async () => {
            const endpoint = 'http://localhost:7003/add-to-saved';
            
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    // VERY IMPORTANT. Tells Express that. you're sending JSON. You must specify data type.
                    // Rest API server needs a valid Content-Type header to interpret the request body message correctly.
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        saved: saved,
                        hasBeenSaved: hasBeenSaved
                    })     // Must send a string
                }); // saved array is changed so update db
            } catch (err) {
                console.error(err);
            }
        }

        updateTrails();
    }, [saved]);

    // Add to save
    const addToSaved = (trail) => {
        /*
            - "prev" gives previous value
            - Use previous value and add trail
        */
        setHasBeenSaved(true);
        setSaved(prev => [...prev, trail]);
    }

    // Delete from save
    const removeFromSaved = (trailName) => { // trailId is the same as trail.name        
        let newArr = saved.filter(trail => trail.name !== trailName);
        
        setHasBeenSaved(false);
        setSaved(newArr);
    }

    // Check if saved
    const isSaved = (trailName) => {
        return saved.some(trail => trail.name === trailName);
    }

    const value = {
        saved,
        addToSaved,
        removeFromSaved,
        isSaved
    }

    return (
        // "dot Provider" means React context accessed with dot notation
        <TrailCardContext.Provider value={value}>
            {children}
        </TrailCardContext.Provider>
    )
}