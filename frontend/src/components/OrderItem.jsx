import React, { useState } from 'react'
import { Row, Col, Form, Select, InputNumber, Statistic, Card } from 'antd'
import { ShoppingOutlined, NumberOutlined, DollarOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'

const { Option } = Select

const OrderItem = ({ 
  index, 
  item, 
  predefinedProducts, 
  currency, 
  updateOrderItem, 
  calculatePrices 
}) => {
  const { isDarkMode } = useTheme()
  const [quantityError, setQuantityError] = useState('')
  const itemPrices = calculatePrices(item.productName, item.quantity)

  // Validate quantity input
  const validateQuantity = (value) => {
    if (value === null || value === undefined || value === '') {
      setQuantityError('Quantity is required')
      return false
    }
    
    const numValue = Number(value)
    
    if (isNaN(numValue)) {
      setQuantityError('Please enter numbers only')
      return false
    }
    
    if (!Number.isInteger(numValue)) {
      setQuantityError('Quantity must be a whole number')
      return false
    }
    
    if (numValue < 1) {
      setQuantityError('Quantity must be at least 1')
      return false
    }
    
    if (numValue > 1000000) {
      setQuantityError('Quantity cannot exceed 1,000,000')
      return false
    }
    
    setQuantityError('')
    return true
  }

  // Handle quantity change with validation
  const handleQuantityChange = (value) => {
    if (validateQuantity(value)) {
      updateOrderItem(index, 'quantity', Number(value))
    }
  }

  // Prevent non-numeric input on keypress
  const handleKeyPress = (e) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
      setQuantityError('Only numbers are allowed')
      setTimeout(() => setQuantityError(''), 2000) // Clear error after 2 seconds
    }
  }

  return (
    <Card 
      size="small" 
      style={{ 
        background: isDarkMode ? '#141414' : '#fafafa',
        border: isDarkMode ? '1px solid #424242' : '1px solid #d9d9d9'
      }}
    >
      <Row gutter={[16, 12]} align="top">
        <Col xs={24} sm={24} md={10} lg={9} xl={9}>
          <Form.Item
            label={
              <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)' }}>
                Product {index + 1}
              </span>
            }
            style={{ marginBottom: 8 }}
          >
            <Select
              size="default"
              value={item.productName}
              onChange={(value) => updateOrderItem(index, 'productName', value)}
              placeholder="Select a product"
              suffixIcon={<ShoppingOutlined />}
              style={{ width: '100%' }}
            >
              <Option value="">Select a product</Option>
              {Object.keys(predefinedProducts).map(productName => (
                <Option key={productName} value={productName}>
                  {productName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={8} md={5} lg={5} xl={5}>
          <Form.Item
            label={
              <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)' }}>
                Quantity
              </span>
            }
            style={{ marginBottom: 8 }}
            validateStatus={quantityError ? 'error' : ''}
            help={quantityError}
          >
            <InputNumber
              size="default"
              min={1}
              max={1000000}
              value={item.quantity}
              onChange={handleQuantityChange}
              onKeyDown={handleKeyPress}
              style={{ width: '100%' }}
              prefix={<NumberOutlined />}
              controls={true}
              precision={0}
              keyboard={true}
              placeholder="Enter quantity"
            />
          </Form.Item>
        </Col>
        
        <Col xs={12} sm={8} md={4} lg={5} xl={5}>
          <div style={{ padding: '4px 8px' }}>
            <Statistic
              title={
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)' }}>
                  Unit Price
                </span>
              }
              value={itemPrices.unitPrice}
              precision={2}
              prefix={<DollarOutlined />}
              suffix={currency}
              valueStyle={{ 
                fontSize: 13,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)'
              }}
            />
          </div>
        </Col>
        
        <Col xs={12} sm={8} md={5} lg={5} xl={5}>
          <div style={{ padding: '4px 8px' }}>
            <Statistic
              title={
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)' }}>
                  Net Price
                </span>
              }
              value={itemPrices.netPrice}
              precision={2}
              prefix={<DollarOutlined />}
              suffix={currency}
              valueStyle={{ 
                fontSize: 13, 
                color: isDarkMode ? '#4db8ff' : '#1890ff', 
                fontWeight: 'bold' 
              }}
            />
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default OrderItem
