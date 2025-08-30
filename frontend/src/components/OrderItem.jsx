import React from 'react'
import { Row, Col, Form, Select, InputNumber, Statistic, Card } from 'antd'
import { ShoppingOutlined, NumberOutlined, DollarOutlined } from '@ant-design/icons'

const { Option } = Select

const OrderItem = ({ 
  index, 
  item, 
  predefinedProducts, 
  currency, 
  updateOrderItem, 
  calculatePrices 
}) => {
  const itemPrices = calculatePrices(item.productName, item.quantity)

  return (
    <Card 
      size="small" 
      style={{ 
        background: '#fafafa',
        border: '1px solid #d9d9d9'
      }}
    >
      <Row gutter={16} align="middle">
        <Col xs={24} sm={8}>
          <Form.Item
            label={`Product ${index + 1}`}
            style={{ marginBottom: 0 }}
          >
            <Select
              size="large"
              value={item.productName}
              onChange={(value) => updateOrderItem(index, 'productName', value)}
              placeholder="Select a product"
              suffixIcon={<ShoppingOutlined />}
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
        
        <Col xs={24} sm={4}>
          <Form.Item
            label="Quantity"
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              size="large"
              min={1}
              value={item.quantity}
              onChange={(value) => updateOrderItem(index, 'quantity', value || 1)}
              style={{ width: '100%' }}
              prefix={<NumberOutlined />}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={6}>
          <Statistic
            title="Unit Price"
            value={itemPrices.unitPrice}
            precision={2}
            prefix={<DollarOutlined />}
            suffix={currency}
            valueStyle={{ fontSize: 16 }}
          />
        </Col>
        
        <Col xs={24} sm={6}>
          <Statistic
            title="Net Price"
            value={itemPrices.netPrice}
            precision={2}
            prefix={<DollarOutlined />}
            suffix={currency}
            valueStyle={{ fontSize: 16, color: '#1890ff', fontWeight: 'bold' }}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default OrderItem
