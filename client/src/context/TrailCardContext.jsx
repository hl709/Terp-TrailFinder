import { useState, useEffect, createContext, useContext } from "react";

const TrailCardContext = createContext(); // Passes TrailCard data deeply throughout the tree 

// useContext is a Hook and like other hooks, you can only call a Hook inside a component, not
// inside loops or conditions.
export const useTrailCardContext = () => useContext(TrailCardContext);

// Passes data to children which is anything inside the component you rerendered
export const TrailCardProvider = ({children}) => {
    const [saved, setSaved] = useState([]);

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
    }, []);

    // Add or remove from DB
    useEffect(() => { // Only called when the "saved" array is changed

    }, [saved]);

    // Add to save
    const addToSaved = (trail) => {
        /*
            - "prev" gives previous value
            - Use previous value and add movie
        */
        setSaved(prev => [...prev, trail]);
    }

    // Delete from save
    const removeFromSaved = (trailName) => { // trailId is the same as trail.name
        setSaved(prev => prev.filter(trail => trail.name !== trailName));
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