import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login'

class FacebookLoginButton extends Component {
    responseFacebook = (response) => {
        console.log(response)
        window.localStorage.setItem('_textblog:access_token', response.accessToken)
        window.localStorage.setItem('_textblog:uid', response.id)
        window.localStorage.setItem('_textblog:name', response.name)
        window.localStorage.setItem('_textblog:email', response.email)
    }

    componentClicked = (e) => {
        console.log(e)
    }

    render() {
        return (
            <FacebookLogin
                appId="2334273453512956"
                autoLoad={true}
                fields="id,name,email"
                onClick={this.componentClicked}
                callback={this.responseFacebook}
            />
        )
    }
}

export default FacebookLoginButton