import React from 'react'
import { Form, Select } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'

const { Option } = Select

const CurrencySelector = ({ currency, setCurrency }) => {
  const { isDarkMode } = useTheme()
  
  const currencies = [
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' }
  ]

  return (
    <div style={{ marginTop: 24 }}>
      <Form.Item label={
        <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)' }}>
          Currency
        </span>
      }>
        <Select
          size="large"
          value={currency}
          onChange={setCurrency}
        suffixIcon={<DollarOutlined />}
      >
        {currencies.map(curr => (
          <Option key={curr.value} value={curr.value}>
            {curr.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
    </div>
  )
}

export default CurrencySelector
