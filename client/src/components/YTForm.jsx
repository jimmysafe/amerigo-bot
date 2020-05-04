import React, { useState } from 'react'
import axios from 'axios'
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VideoDisplay from './VideoDisplay';
import Nav from '../components/Nav'
import Header from '../components/Header'

const YTForm = (props) => {
    const { guildId } = props.match.params
    const [isLoading, setIsLoading] = useState(false) 
    const formik = useFormik({
        initialValues: {
          url: '',
          start_h: '',
          start_m: '',
          start_s: '',
          end_h: '',
          end_m: '',
          end_s: '',
          name: '',
        },
        onSubmit: async(values) => {
            setIsLoading(true)
            const { url, name } = values
            const vals = Object.values(values)
            const formattedValues = []
            vals.forEach(v => {
                if(v.length === 0){
                    formattedValues.push('00')
                }
                else if(v.length === 1){
                    formattedValues.push(`0${v}`)
                }
                else formattedValues.push(v)
            })

            let fileName = name.replace(/\s/g, "-");
            
            const startTime = `${formattedValues[1]}:${formattedValues[2]}:${formattedValues[3]}`
            const endTime = `${formattedValues[4]}:${formattedValues[5]}:${formattedValues[6]}`

            let res = await axios.post('/youtube', { guildId, fileName, url, startTime, endTime })
            if(res.data === "success") setIsLoading(false)
            toast("File caricato con successo!")
            values.url = ''
            values.start_h = ''
            values.start_m = ''
            values.start_s = ''
            values.end_h = ''
            values.end_m = ''
            values.end_s = ''
            values.name = ''
        },
      });

    return (
        <>
        <Header />
        <Nav guildId={guildId} path={props.match.path}/>
        <div className="page-youtube">
            <form className="youtube-form" onSubmit={formik.handleSubmit}>

            <h2 style={{ marginBottom: "1rem" }}>Youtube Url</h2>
            <input required id="url" name="url" type="text" onChange={formik.handleChange} value={formik.values.url} placeholder="https://www.youtube.com..."/>

            <h2 style={{ marginBottom: "1rem" }}>File Name</h2>
            <input required id="name" name="name" type="text" onChange={formik.handleChange} value={formik.values.name} placeholder="e.g hello"/>

            <h2>Start Time</h2>
            <div className="input-container">
                <div>
                    <label htmlFor="start_h">Hours</label>
                    <input id="start_h" name="start_h" type="text" onChange={formik.handleChange} value={formik.values.start_h} placeholder="00"/>
                </div>

                <div>
                    <label htmlFor="start_m">Mins</label>
                    <input id="start_m" name="start_m" type="text" onChange={formik.handleChange} value={formik.values.start_m} placeholder="00"/>
                </div>
            
                <div>
                    <label htmlFor="start_s">Secs</label>
                    <input id="start_s" name="start_s" type="text" onChange={formik.handleChange} value={formik.values.start_s} placeholder="00"/>
                </div>
            </div>

            <h2>End Time</h2>
            <div className="input-container">
                <div>
                    <label htmlFor="end_h">Hours</label>
                    <input id="end_h" name="end_h" type="text" onChange={formik.handleChange} value={formik.values.end_h} placeholder="00"/>
                </div>
                
                <div>
                    <label htmlFor="end_m">Mins</label>
                    <input id="end_m" name="end_m" type="text" onChange={formik.handleChange} value={formik.values.end_m} placeholder="00"/>
                </div>
                
                <div>
                    <label htmlFor="end_s">Secs</label>
                    <input id="end_s" name="end_s" type="text" onChange={formik.handleChange} value={formik.values.end_s} placeholder="00"/>
                </div>
            </div>

            <button className={`yt-button ${isLoading ? "loading":""}`} type="submit">{isLoading ? "Uploading.." : "Upload"}</button>
        </form>
            <ToastContainer 
                bodyClassName="toast-body"
                progressClassName="toast-progress"
                toastClassName="toast"
                closeButton={false}
            />
            <VideoDisplay videoUrl={formik.values.url}/>
        </div>
        </>
    )
}

export default YTForm
