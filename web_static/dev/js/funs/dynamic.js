import React from 'react'
import L from 'react-loadable'
import Loading from '../els/loading'

export default what => L({
  loader: () => what,
  loading: Loading 
})
