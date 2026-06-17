import '../css/index.css'
import Header from '../partials/Header.jsx'

function Saved() {
    return (
        <>
            <div className="mainContainer">
                <Header />
                    <form action="http://localhost:5173/saved" method="post">
                        <input type="submit" value="Clear history"/>
                    </form>

                    {/* <%- content %> */}
            </div>
        </>
    )
}

export default Saved
