import '../css/index.css'
import Header from '../partials/Header'
import { useEffect } from 'react'

function ProcessRemoved() {
    useEffect(() => {
        const deleteTrails = async () => {
            const endpoint = `${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/processremoved`;

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
