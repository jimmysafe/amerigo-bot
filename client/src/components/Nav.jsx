import React from 'react'
import { Link } from 'react-router-dom'

const Nav = ({ guildId, path }) => {
    return (
        <nav>
            <Link className={!path.includes('admin') ? 'green' : "not-selected"} to={`/${guildId}`}>From Youtube</Link>
            <Link className={path.includes('admin') ? 'pink' : "not-selected"} to={`/admin/${guildId}`}>Edit/Delete Audio Files</Link>
        </nav>
    )
}

export default Nav
