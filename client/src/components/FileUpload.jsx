import React, { useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FileUpload = () => {
    const [audioFile, setAudioFile] = useState()
    const [text, setText] = useState()

    const handleChange = e => {
      setAudioFile(e.target.files[0])
      setText(e.target.files[0].name)
    }
  
    const handleSubmit = async(e) => {
      e.preventDefault()
      const formData = new FormData();
      formData.append('image', audioFile);
      try {
        const res = await axios.post('/upload', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
        })
        toast("File caricato con successo!")
        console.log(res)
        setAudioFile()
        setText()
      } catch(err) {
        console.log(err)
      }    
    }
    return (
        <>
        <form className="file-upload-form" onSubmit={handleSubmit}>
            <label htmlFor="fileUpload" className={`${audioFile ? 'ready' : ''}`}>{text ? 'Pronto' : 'Scegli un file'}</label>
            <input id="fileUpload" type="file" onChange={handleChange}/>
            {audioFile && <button type="submit" disabled={!audioFile}>Carica</button>}
        </form>   
        <ToastContainer 
            bodyClassName="toast-body"
            progressClassName="toast-progress"
            toastClassName="toast"
            closeButton={false}
        />
        </>
    )
}

export default FileUpload
