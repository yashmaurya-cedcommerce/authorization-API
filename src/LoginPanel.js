import React from 'react'

export default function LoginPanel(props) {
  return (
    <div className='loginContainer'>

        <form onSubmit={(event)=>props.check(event)}>
        <div className='inputDiv'>
            <p>Username: </p>
            <input type="text" id='usernameID' value={props.name} onChange={(event)=>props.nameHandler(event)} required />
        </div>

        <div className='inputDiv'>
            <p>Password: </p>
            <input type="password" id='passwordID' value={props.password} onChange={(event)=>props.passwordHandler(event)} required />
        </div>

        <div className='buttonDiv'>
          <button type='submit' className='submitBtn' >Submit</button>
        </div>

        {(props.wrong === 1)?<p className='errorMsg'>Wrong Credentials</p>:''}
        </form>

    </div>
  )
}
