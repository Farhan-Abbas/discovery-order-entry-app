import React from 'react'
import { Form, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const CustomerForm = ({ customerName, setCustomerName }) => {
  return (
    <Form.Item
      label="Customer Name"
      rules={[
        { required: true, message: 'Please input customer name!' },
        { max: 50, message: 'Customer name cannot exceed 50 characters!' },
        { pattern: /^[a-zA-Z ]+$/, message: 'Customer name can only contain letters and spaces!' }
      ]}
    >
      <Input
        size="large"
        prefix={<UserOutlined />}
        placeholder="Enter customer name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />
    </Form.Item>
  )
}

export default CustomerForm
