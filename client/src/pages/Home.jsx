import { useState } from 'react';
import { useNavigate } from "react-router";
import '../css/index.css'
import Header from '../partials/Header.jsx'

function Home() {
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [activity, setActivity] = useState("");
    const navigate = useNavigate(); // Returns a function to navigate in browser in response to user interaction

    const handleSubmit = async (event) => {
        event.preventDefault();
        navigate(`/suggestions?country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}&activity=${activity}`);
    };

    return (
        <div className="mainContainer">
            <Header />
            <div className="bannerContainer">
            <img src="Lake-Artemesia-Natural-Area.jpg" id="mainPageImg" alt="Lake Artemesia Photo"/>
                <div className="bannerTextContainer">
                    <h1 className="bannerText">Find your next good time!</h1>
                </div>

                <div className="formContainer">
                    <form id="indexForm" action="/suggestions" method="get" onSubmit={handleSubmit}>
                    <div className="countrySubdivisionContainer">
                            <div className="scfieldContainer">
                                <b>Country:&nbsp;</b><input type="text" name="country" id="country" placeholder="country"
                                                    onChange = {event => setCountry(event.target.value)} required/>
                            </div>
                            <div className="scfieldContainer">
                                <b>State/Province:&nbsp;</b><input type="text" name="state" id="state" placeholder="state/province"
                                                            onChange = {event => setState(event.target.value)} required/>
                            </div>
                            <p>US state or Canadian Provinces only</p>
                        </div>

                        <div className="cityActivityContainer">
                            <div className="cafieldContainer">
                                <b>City:&nbsp;</b><input type="text" name="city" id="city" placeholder="city"
                                                onChange = {event => setCity(event.target.value)} required/>
                            </div>
                            <div className="cafieldContainer">
                                <b>Activity Type:&nbsp;</b><input type="text" name="activity" id="activity" placeholder="activity"
                                                        onChange = {event => setActivity(event.target.value)} required/>
                            </div>
                        </div>
                        <p id="activityText">Activity type limited to hiking, mountain biking, camping, caving, trail running, snow sports, atv, or horseback riding</p>

                        <div className="buttonsContainer">
                            <input type="submit" value="Search"/>
                            <input type="reset" value="Clear"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Home
