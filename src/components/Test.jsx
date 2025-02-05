import axios from 'axios'
import React from 'react'

function Test() {

const res = axios.get("/api/test").then((response) => console.log(response.data)).catch((error) => console.log(error)  )
console.log(res)
  return (
    <div>Test</div>
  )
}

export default Test