import React from 'react'

function Footer() {
    const year = (new Date()).getFullYear()
  return (
    <div>
      <div className="container">
  <footer className="py-3 my-4">
    
    <p className="text-center text-body-secondary">© {year} Company, Inc</p>
  </footer>
</div>
    </div>
  )
}

export default Footer
