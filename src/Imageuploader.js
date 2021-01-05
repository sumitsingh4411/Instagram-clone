import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import "./Imageuploader.css"
import db,{storage} from "./firebase"
import firebase from "firebase"
function Imageuploader({username}) {
    const[caption,setcation]=useState('');
    const[image,setimage]=useState(null);
    const[progress,setprogress]=useState(0);
   
    const handlechange=(e)=>{
        if(e.target.files[0])
        {
            setimage(e.target.files[0]);
        }
    }
    const handleupload=()=>{
           const uploadtime=storage.ref(`images/${image.name}`).put(image);
           uploadtime.on(
               "state_changed",
               (snapshot)=>{
                   const progress=Math.round(
                       (snapshot.bytesTransferred/snapshot.totalBytes)*100
                   )
                   setprogress(progress)
               },
           (error)=>{
               alert(error.message);
           },
           ()=>{
               storage.ref("images").child(image.name).getDownloadURL()
               .then(url=>{
                   db.collection("posts").add({
                       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                       caption :caption,
                       imageurl :url,
                       username:username
                   });
                   setprogress(0);
                   setcation("");
                   setimage(null);
               })
           }
           )
    }
    return (
        <div className="imageuploader">
        <progress className="imageprogress" value={progress} max="100"/>
            <input type="text" placeholder="enter a caption"
                value={caption}
                onChange={event=>setcation(event.target.value)}
            />
            <input type="file"
                onChange={handlechange}
            />
            <Button onClick={handleupload}
            >upload</Button>
        </div>
    )
}

export default Imageuploader
