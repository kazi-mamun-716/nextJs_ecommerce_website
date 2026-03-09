import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>{children}</div>
  )
}

export default AuthLayout