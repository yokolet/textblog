import React from 'react'

const NoMatch = ({ location }) => {
  let styles = {
    marginTop: '20px'
  }

  return (
    <div className="row" style={styles}>
      <div className="col s12 m12">
        <div className="card-panel white">
          <div className="flow-text center">
            No match for <code>{location.pathname}</code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoMatch