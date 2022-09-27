import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import LoginPanel from './LoginPanel';
import { useNavigate } from "react-router-dom";

function App() {

  const [post, setPost] = useState();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [wrong, setWrong] = useState(0);
  const navigate = useNavigate();

  var nameHandler = (event) => {
    setName(event.currentTarget.value);
  }

  var passwordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }


  var check = (event) => {
    event.preventDefault();
    setPost();
    var opt = {
      method: "POST",
      headers: {
        authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInJvbGUiOiJhcHAiLCJpYXQiOjE1MzkwNTk5NzgsImlzcyI6Imh0dHBzOlwvXC9hcHBzLmNlZGNvbW1lcmNlLmNvbSIsImF1ZCI6ImV4YW1wbGUuY29tIiwibmJmIjoxNTM5MDU5OTc4LCJ0b2tlbl9pZCI6MTUzOTA1OTk3OH0.GRSNBwvFrYe4H7FBkDISVee27fNfd1LiocugSntzxAUq_PIioj4-fDnuKYh-WHsTdIFMHIbtyt-uNI1uStVPJQ4K2oYrR_OmVe5_zW4fetHyFmoOuoulR1htZlX8pDXHeybRMYlkk95nKZZAYQDB0Lpq8gxnTCOSITTDES0Jbs9MENwZWVLfyZk6vkMhMoIAtETDXdElIdWjP6W_Q1kdzhwqatnUyzOBTdjd_pt9ZkbHHYnv6gUWiQV1bifWpMO5BYsSGR-MW3VzLqsH4QetZ-DC_AuF4W2FvdjMRpHrsCgqlDL4I4ZgHJVp-iXGfpug3sJKx_2AJ_2aT1k5sQYOMA"
      }
    }

    fetch(`https://fbapi.sellernext.com/user/login?username=${name}&password=${password}`, opt)
      .then(res => res.json())
      .then(temp => {
        console.log(temp)
        if (temp.success === true) {
          setPost(temp);
          navigate("/home");
          var tempToken = temp.data.token;
          console.log(tempToken);
          sessionStorage.setItem('mySessionToken', tempToken);
        }
        else {
          setWrong(1);
        }
      })
  }

  return (
    <div className="App">

      <Routes>

        <Route path="/" element={<LoginPanel nameHandler={nameHandler} passwordHandler={passwordHandler} name={name} password={password} post={post} check={check} wrong={wrong} />} />

        <Route path="/home" element={<Home  />} />

      </Routes>

    </div>
  );
}

export default App;
