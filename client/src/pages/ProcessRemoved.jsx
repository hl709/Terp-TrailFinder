import '../css/index.css'
import Header from '../partials/Header'
import { useEffect } from 'react'

function ProcessRemoved() {
    useEffect(() => {
        const deleteTrails = async () => {
            const endpoint = 'http://localhost:7003/processremoved'; // CHANGE HERE WHEN DEPLOYING http://localhost:7003/processremoved OR https://terp-trailfinder.onrender.com/processremoved

            try {
                const response = await fetch(endpoint); // Need to fetch
            } catch (error) {
                console.error(error);
            }
        }

        deleteTrails();
    }, []);

    return (
        <div>
            <Header />
            <p>Cleared history successfully...</p>
        </div>
    )
}

export default ProcessRemoved
