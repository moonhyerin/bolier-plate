import React, { useState } from 'react'
import Axios from 'axios'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'

function LoginPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        //preventDefault() 를 해주는 이유? 페이지 refresh를 막기 위해
        event.preventDefault();

        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => {
                //로그인이 완료되면
                if(response.payload.loginSuccess) {
                    props.history.push('/')         //리액트에서 페이지를 넘겨주는 방법
                } else {
                    alert('Login Error!')
                }
            });
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}>
                <h2>LOGIN</h2>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default withRouter(LoginPage)
