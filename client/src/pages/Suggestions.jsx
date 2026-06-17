import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from "react"
import '../css/index.css'
import Header from '../partials/Header.jsx'
import TrailCard from '../components/TrailCard.jsx';
import { getTrails } from '../services/api.js'

function Suggestions() {
    const [searchParams, setSearchParams] = useSearchParams();
    const country = searchParams.get("country");
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const activity = searchParams.get("activity");
    const [trails, setTrails] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getTrails(country, state, city, activity);
                let trailArr = [];

                for (const id in result) {
                    const trail = result[id];

                    const trailObj = {
                        name: trail.name,
                        city: trail.city,
                        state: trail.state,
                        country: trail.country
                    };
                
                    trailArr.push(trailObj);
                }

                setTrails(trailArr);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            <div className="mainContainer">
                <Header />

                <div className="display">
                    {trails.map((trail) => ( // Has to be map since foor loop isn't considered a JS expression
                        <TrailCard trail={trail} key={trail.name} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Suggestions
