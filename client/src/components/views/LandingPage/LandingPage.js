import React, { useEffect } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

function LandingPage(props) {
    //useEffect : 랜딩페이지에 들어오자마자 해당 메소드를 실행한다
    useEffect(() => {
        //axios로 get request를 보낸다. '/api/hello'는 end-point
        //then은 request를 보낸 뒤 돌아오는 response로 실행할 작업
        axios.get('/api/hello')
        .then(response => console.log(response.data))
    }, [])

    const onClickHandler = () => {
        axios.get(`/api/users/logout`)
        .then(response => {
            if(response.data.success) {
                props.history.push('/login')
            } else {
                alert('로그아웃 하는데 실패 했습니다.')
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default withRouter(LandingPage)
