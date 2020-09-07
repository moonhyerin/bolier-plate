//1. HOC에 모든 컴포넌트를 담는다.
//2. HOC에서 해당 유저가 해당 페이지에 들어갈 자격이 되는지를 알아낸 후에
//   자격이 된다면 해당 페이지에 가게 해주고 아니라면 다른 페이지로 보내버린다.
import React, { useEffect } from 'react'
import Axios from 'axios'
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'

export default function (SpecificComponent, option, adminRoute = null) {

    // option 
    //1. null : 아무나 출입 가능 
    //2. true : 로그인한 유저만 출입 가능 
    //3. false : 로그인한 유저는 출입 불가능

    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response);

                //로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) {
                        props.history.push('/login')
                    }
                } else {
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        props.history.push('/')
                    }else {
                        if(option === false) {
                            props.history.push('/')
                        }
                    }
                }
            })

            //Axios.get(`/api/users/auth`)
        })

        return(
            <SpecificComponent />
        )
    }







    return AuthenticationCheck
}