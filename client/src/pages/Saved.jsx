import { useState, useEffect } from 'react'
import { useNavigate } from "react-router";
import '../css/index.css'
import Header from '../partials/Header.jsx'
import TrailCard from '../components/TrailCard.jsx'

function Saved() {
    const [trails, setTrails] = useState([]);
    const navigate = useNavigate();

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

                setTrails(trailArr);
            } catch (err) {
                console.error(err);
            }
        }

        fetchTrails();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate("/processremoved");
    }

    return (
        <div className="mainContainer">
            <Header />
                <form action="/processremoved" method="get" onSubmit={handleSubmit}>
                    <input type="submit" value="Clear history"/>
                </form>

                {trails.length == 0 ? (
                    <p>No trails saved...</p>
                ) : (
                    <div className="w-full flex flex-col justify-center items-center">
                        {trails.map((trail) => ( // Has to be map since foor loop isn't considered a JS expression
                            <TrailCard trail={trail} activity={"any"} key={trail.name} />
                        ))}
                    </div>
                )}
            </div>
    )
}

export default Saved
