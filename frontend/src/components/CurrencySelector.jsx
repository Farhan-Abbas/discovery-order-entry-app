import React from 'react'
import { Form, Select } from 'antd'
import { DollarOutlined } from '@ant-design/icons'

const { Option } = Select

const CurrencySelector = ({ currency, setCurrency }) => {
  const currencies = [
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' }
  ]

  return (
    <Form.Item label="Currency">
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
  )
}

export default CurrencySelector
