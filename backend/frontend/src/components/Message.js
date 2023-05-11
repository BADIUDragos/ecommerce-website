import React from 'react'
import { Alert } from 'react-bootstrap'


function Message({variant, children, ...props}) {
  return (
    <Alert variant={variant} {...props}>
        {children}
    </Alert>
  )
}

export default Message