import React from 'react'

const CustomerForm = ({ customerName, setCustomerName }) => {
  return (
    <div>
      <label htmlFor="customer-name">Customer Name:</label>
      <input
        type="text"
        id="customer-name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      />
    </div>
  )
}

export default CustomerForm
