import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from "react"
import '../css/index.css'
import Header from '../partials/Header.jsx'
import TrailCard from '../components/TrailCard.jsx';

function Suggestions() {
    const [searchParams, setSearchParams] = useSearchParams();
    const country = searchParams.get("country");
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const activity = searchParams.get("activity");
    const [trails, setTrails] = useState([]);
    
    useEffect(() => {
        const fetchTrails = async () => { // CHANGE HERE WHEN DEPLOYING http://localhost:7003/suggestions? OR https://terp-trailfinder.onrender.com/suggestions?
            const endpoint = `https://terp-trailfinder.onrender.com/suggestions?country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}&activity=${activity}`; // URL to send request to
            
            try {
                const response = await fetch(endpoint); // returns a Response object with type 'cors'
                let result = await response.json(); // parses Response object for json
                
                let trailArr = [];

                if (!result.hasOwnProperty("code")) {
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
                }

                setTrails(trailArr);
            } catch (error) {
                console.error(error);
            }
        }

        fetchTrails();
    }, []);

    return (
        <div className="mainContainer">
            <Header />

            <div className="display">
                {trails.length == 0 ? ( // Conditional rendering
                    <p>No results found...</p>
                ) : (
                    <div className="flex flex-col justify-center items-center">
                        {trails.map((trail) => ( // Has to be map since foor loop isn't considered a JS expression
                            <TrailCard trail={trail} activity={activity} key={trail.name} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Suggestions
