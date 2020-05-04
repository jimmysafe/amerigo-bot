import React from 'react'
import YouTube from 'react-youtube';

const VideoDisplay = ({ videoUrl }) => {
    let v = videoUrl.split('=')
    let videoId = v[1]
    return (
        <div className="video-display-container">
            <div className="video-display">
                {videoId ? 
                <YouTube
                    videoId={videoId}
                    opts={{
                        height: '390px',
                        width: '100%'
                    }}
                />
                : 
                <img src="/images/amerigo_face.png" width="250px" alt=""/>
                }
            </div>
        </div>
    )
}

export default VideoDisplay
