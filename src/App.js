import './App.css';
import Post from './Post';
import React,{useEffect, useState} from "react"
import db, { auth } from "./firebase"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Imageuploader from './Imageuploader';
import InstagramEmbed from 'react-instagram-embed';
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  
  const[posts,setposts]=useState([])
  const[open,setopen]=useState(false);
  const[username,setusername]=useState();
  const[email,setemail]=useState();
  const[password,setpassword]=useState();
  const[opensignin,setopensignin]=useState(false);
  const classes = useStyles();
  const[user,setuser]=useState(null);
  const [modalStyle] = React.useState(getModalStyle);
  useEffect(()=>{
      db.collection('posts').orderBy("timestamp",'desc').onSnapshot(snapshot=>{
        setposts(snapshot.docs.map(
          doc=>({
            post:doc.data(),
            id:doc.id
          })
          ))
      })
  },[posts])
  useEffect(()=>{
    const unscribe= auth.onAuthStateChanged((authuser)=>{
        if(authuser)
        {
        setuser(authuser);
        }
        else{
          setuser(null);
        }
      })
      return ()=>{

        unscribe();
      }
  },[user,username])
  const signup=(e)=>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authuser)=>{
      return authuser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message))
    setopen(false);
  }
  const signin=(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch(error=>alert(error.message))
    setopensignin(false);
  }
  return (
    <div className="app">
   
     <Modal
        open={open}
        onClose={()=>setopen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
        <from className="app_signup">
      <center>
      <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="" className="app_logo"/>
      </center>
      <Input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e)=>setusername(e.target.value)}
      />
      <Input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e)=>setemail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e)=>setpassword(e.target.value)}
      />
      <Button onClick={signup}>Sign Up</Button>
      </from>
      </div>
      </Modal>
      <Modal
        open={opensignin}
        onClose={()=>setopensignin(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
        <from className="app_signup">
      <center>
      <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="" className="app_logo"/>
      </center>
      <Input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e)=>setemail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e)=>setpassword(e.target.value)}
      />
      <Button onClick={signin}>Sign Up</Button>
      </from>
      </div>
      </Modal>
     <div className="app_header">
       <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="" className="app_logo"/>
      {
       user ? (
        <Button onClick={()=>auth.signOut()}>log out</Button>
       ):
       (
         <div className="app_login">
         <Button onClick={()=>setopensignin(true)}>Sign In</Button>
         <Button onClick={()=>setopen(true)}>Sign up</Button>
         </div>
        
       )
     }
     </div>
 
      <div className="app_postt">
      <div className="app_postleft">
      {
       posts.map(({post,id})=>(
         <Post
           key={id}
           user={user}
           postId={id}
           imageurl={post.imageurl}
           username={post.username}
           caption={post.caption}
           
         />
       ))
     }
     </div>
     <div className="app_postright">
     <InstagramEmbed
  url='https://www.instagram.com/p/B_uf9dmAGPw/'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
   />
   </div>
      </div>
  
   
     {
      user?.displayName ? (
        <Imageuploader username={user.displayName}/>
      ):
      (
        <h1></h1>
      )
    }
    </div>
  );
}

export default App;
