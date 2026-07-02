import { useState, useEffect } from 'react'
import { useNavigate } from "react-router";
import '../css/index.css'
import Header from '../partials/Header.jsx'
import TrailCard from '../components/TrailCard.jsx'
import { UseTrailCardContext } from '../context/TrailCardContext.jsx';

function Saved() {
    const { saved } = UseTrailCardContext(); // Using saved trails from context
    const navigate = useNavigate();

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

                {saved.length == 0 ? (
                    <p>No trails saved...</p>
                ) : (
                    <div className="w-full flex flex-col justify-center items-center">
                        {saved.map((trail) => ( // Has to be map since foor loop isn't considered a JS expression
                            <TrailCard trail={trail} activity={"any"} key={trail.name} />
                        ))}
                    </div>
                )}
            </div>
    )
}

export default Saved
