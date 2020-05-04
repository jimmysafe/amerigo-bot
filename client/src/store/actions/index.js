import axios from 'axios'

export const initAudioFiles = (id) => {
    return async(dispatch) => {
        let res = await axios.post('/admin', { id })
        if(res.data){
            dispatch(initAudioFileSuccess(res.data));
        }
        else console.log("ERROR in INIT_AUDIO_FILES action")
    };
}

const initAudioFileSuccess = (data) => {
    return {
        type: "INIT_AUDIO_FILES",
        data
    }
}

export const editAudioFile = (index, newName) => {
    return {
        type: "EDIT_AUDIO_FILE",
        index,
        newName
    }
}

export const deleteAudioFile = (index, newName) => {
    return {
        type: "DELETE_AUDIO_FILE",
        index,
        newName
    }
}