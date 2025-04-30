import React, {useState , useEffect} from "react";
import ChatWindow from "./ChatWindow.tsx";
import "./App.css"
const App: React.FC = () =>{

    const [message, setMessage]=useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:5000/")
            .then(res=>res.json())
            .then(data=>setMessage(data.message));
    }, []);


    return(
        <>
          <ChatWindow/>
        </>
    )
};

export default App;