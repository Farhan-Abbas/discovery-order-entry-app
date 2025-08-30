import React from 'react'
import { Card, Button, Space, Typography } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'
import OrderItem from './OrderItem'

const { Title } = Typography

const OrderItems = ({
  orderItems,
  predefinedProducts,
  currency,
  updateOrderItem,
  calculatePrices,
  addOrderItem,
  removeLastOrderItem
}) => {
  const { isDarkMode } = useTheme()
  
  return (
    <Card 
      title={
        <Title level={4} style={{ 
          margin: 0, 
          color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)' 
        }}>
          Order Items
        </Title>
      }
      style={{ marginTop: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {orderItems.map((item, index) => (
          <OrderItem
            key={index}
            index={index}
            item={item}
            predefinedProducts={predefinedProducts}
            currency={currency}
            updateOrderItem={updateOrderItem}
            calculatePrices={calculatePrices}
          />
        ))}
        
        <Space style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} wrap>
          <Button 
            type="dashed" 
            icon={<PlusOutlined />} 
            onClick={addOrderItem}
            size="default"
          >
            Add Item
          </Button>
          <Button 
            icon={<MinusOutlined />} 
            onClick={removeLastOrderItem}
            disabled={orderItems.length <= 1}
            size="default"
            style={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : undefined
            }}
          >
            Remove Last Item
          </Button>
        </Space>
      </Space>
    </Card>
  )
}

export default OrderItems
