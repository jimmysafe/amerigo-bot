import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initAudioFiles, editAudioFile, deleteAudioFile } from '../store/actions'
import Nav from '../components/Nav'
import Header from '../components/Header'
import axios from 'axios'

const Admin = (props) => {
    const { guildId } = props.match.params
    const [editing, setEditing] = useState(false)
    const [editedName, setEditedName] = useState()
    const [fileIndex, setFileIndex] = useState()
    const [prevName, setPrevName] = useState()

    const dispatch = useDispatch()
    const audioFiles = useSelector(state => state.audioFiles)

    useEffect(() => {
        dispatch(initAudioFiles(guildId))
    }, [])

    const handleChangeName = (e) => {
        setEditedName(e.target.value)
    }

    const handlePopup = (i, name) => {
        setEditing(true)
        setPrevName(name)
        setFileIndex(i)
    }

    const handleConfirm = async(i, newName, prevName) => {
        await dispatch(editAudioFile(i, newName))
        let res = await axios.post('/api/admin/rename', { id: guildId, prevName, newName })
        console.log(res)
        setEditing(false)
        setEditedName('')
        setPrevName('')
    }

    const handleDelete = async(i, name) => {
        await dispatch(deleteAudioFile(i, name))
        let res = await axios.post('/api/admin/delete', { id: guildId, fileName: name })
        console.log(res)
    }

    const dismiss = () => {
        setEditing(false)
        setFileIndex(null)
        setEditedName('')
        setPrevName('')
    }

    return (
        <>
        <Header />
        <Nav guildId={guildId} path={props.match.path}/>
        <div className="audio-files-container">
            {audioFiles.map((file, i) => (
                <div key={i} className="audio-file">
                    <audio src={`/files/${guildId}/${file.name}.mp3`} controls></audio>
                    <p style={{ minWidth: "156px", textAlign: "center" }}>{file.name}</p>
                    <p>{file.created_at}</p>
                    <div className="actions">
                        <img src="/images/edit.svg" alt="" onClick={() => handlePopup(i, file.name)}/>
                        <img src="/images/x.svg" alt="" onClick={() => handleDelete(i, file.name)}/>
                    </div>
                </div>
            ))}
        </div>
        {editing &&
            <div className="pop-up">
                <div className="pop-up--inner">
                    <input type="text" onChange={handleChangeName} value={editedName} placeholder="new name (no spaces)"/>
                    <div className="pop-up--buttons">
                        <button disabled={!editedName} className="btn green" onClick={() => handleConfirm(fileIndex, editedName, prevName)}>Confirm</button>
                        <button className="btn pink" onClick={() => dismiss()}>Cancel</button>
                    </div>
                </div>
            </div>
        }
        </>
    )
}

export default Admin
