export const getTrails = async (country, state, city, activity) => {
    const URL = `https://trailapi-trailapi.p.rapidapi.com/activity/?lat=1&limit=5&lon=1&q-city_cont=${city}&q-country_cont=${country}&q-state_cont=${state}&radius=25&q-activities_activity_type_name_eq=${activity}`;
    const OPTIONS = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'ce7d3eb001msh889da79cb4259cdp17eed4jsn5f04e454a884',
            'x-rapidapi-host': 'trailapi-trailapi.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };
    
    const promise = await fetch(URL, OPTIONS);
    const json = await promise.json();
    const resultString = JSON.stringify(json);
    const result = JSON.parse(resultString);

    return result;
}