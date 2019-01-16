import React, { Component } from 'react'
import FacebookLoginButton from './FacebookLoginButton'

class SignIn extends Component {
  render () {
    let styles = {
      marginTop: '20px'
    }

    return (
      <div className="row" style={styles}>
        <div className="col s12 m12">
          <div className="card-panel white">
            <div  className="sign_in_container">
              <FacebookLoginButton/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SignIn