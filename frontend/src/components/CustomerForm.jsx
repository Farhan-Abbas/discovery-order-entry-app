import React from 'react'
import { Form, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'

const CustomerForm = ({ customerName, setCustomerName }) => {
  const { isDarkMode } = useTheme()
  
  return (
    <Form.Item
      label={
        <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)' }}>
          Customer Name
        </span>
      }
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
