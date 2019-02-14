import React, { Component } from 'react'
import FacebookLoginButton from './FacebookLoginButton'

class SignIn extends Component {
  render () {
    let styles = {
      marginTop: '20px'
    }

    let panel_style = {
      padding: '24px'
    }

    let prev = this.props.location.state ? this.props.location.state.prevPath : "/"

    return (
      <div className="row" style={styles}>
        <div className="col s12 m12">
          <div className="card-panel white" style={panel_style}>
            <div  className="sign_in_container">
              <FacebookLoginButton prevPath={prev}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SignIn
