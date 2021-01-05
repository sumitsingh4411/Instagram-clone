import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import db from './firebase';
import firebase from "firebase"
import "./Post.css"
function Post({username,caption,imageurl,postId,user}) {
    const[comments,setcomments]=useState([]);
    const[comment,setcomment]=useState('');
    useEffect(()=>{
         let subscribe;
         if(postId)
         {
             subscribe=db.collection('posts').doc(postId)
             .collection('comments').orderBy('timestamp','desc').
             onSnapshot((snapshot)=>{
                 setcomments(snapshot.docs.map((doc)=>doc.data()))
             })
         }
         return ()=>{
             subscribe();
         }
    },[postId])
    const postcomment=(event)=>{
            event.preventDefault();
            db.collection('posts').doc(postId).collection('comments').add({
                comment:comment,
                username:user.displayName,
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            })
            setcomment('');
    }
    return (
        <div className="post">
        <div className="post_header">
        <Avatar
        className="post_avatar"
        alt="sumit singh"
            src="/logo.svg"
        />
            <h1>{username}</h1>
            </div>
           <img src={imageurl}
            className="post_image"/>
           <h4 className="post_text">
               <strong>{username}</strong>
               {caption}
           </h4>
           <div className="post_com">
               {
                   comments.map((com)=>(
                       <p>
                       <strong>{com.username}</strong>
                       {" : "}
                       {com.comment}
                       </p>
                   ))
               }
           </div>
           {
               user && (
                <form className="post_comment">
               <input

                   className="post_input"
                   type="text"
                   placeholder="Add a comment..."
                   value={comment}
                   onChange={(e)=>setcomment(e.target.value)}
               />
               <button className="post_buttom"
                 disabled={!comment}
                 type="submit"
                 onClick={postcomment}
               >
                   Post
               </button>
           </form>
               )
           }
       
        </div>
    )
}

export default Post
