import React from 'react'

const PayloadLogger = ({ payload }) => (
  <div>
    <h6>RAW</h6>
    <p>{JSON.stringify(payload)}</p>
  </div>
)

export default PayloadLogger;
