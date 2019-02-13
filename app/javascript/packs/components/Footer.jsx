import React from 'react'

export default () => {
  let footer_style = {
    backgroundColor: '#3a4f59'
  }
  return (
    <footer className="page-footer" style={footer_style}>
      <div className="footer-copyright">
        <div className="container">
          © 2019 Yoko Harada
          <a
            className="grey-text text-lighten-4 right"
            href="https://github.com/yokolet/textblog/blob/master/PRIVACY.md"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}