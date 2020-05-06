import React from 'react'
import Header from './Header'

const Home = () => {
    return (
        <div className="wrapper home">
            <Header />
            <div className="container">
                <div>
                    <h1>Amerigo.</h1>
                    <h3>The FUN bot for Discord</h3>
                    <a href="https://discord.com/oauth2/authorize?client_id=690257793286013050&scope=bot" target="_blank" className="btn">
                        Add To Discord
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Home
