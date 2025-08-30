import React from 'react'
import { Card, Table, Typography, Button, Space, Divider } from 'antd'
import { CheckCircleOutlined, ShoppingOutlined, HomeOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const OrderConfirmation = ({ orderData, onCreateAnotherOrder }) => {
  // Parse the HTML response to extract order data
  const parseOrderData = (htmlString) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')
    
    // Extract order details
    const orderIdMatch = htmlString.match(/<strong>Order ID:<\/strong>\s*(\d+)/)
    const customerNameMatch = htmlString.match(/<strong>Customer Name:<\/strong>\s*([^<]+)/)
    const currencyMatch = htmlString.match(/<strong>Currency:<\/strong>\s*([^<]+)/)
    const orderDateMatch = htmlString.match(/<strong>Order Date:<\/strong>\s*([^<]+)/)
    
    // Extract table rows for order items
    const tableRows = doc.querySelectorAll('tbody tr')
    const orderItems = []
    
    tableRows.forEach(row => {
      const cells = row.querySelectorAll('td')
      if (cells.length >= 4) {
        orderItems.push({
          key: cells[0].textContent.trim(),
          product: cells[0].textContent.trim(),
          quantity: parseInt(cells[1].textContent.trim()),
          unitPrice: cells[2].textContent.trim(),
          lineTotal: cells[3].textContent.trim()
        })
      }
    })
    
    // Extract total amount
    const totalMatch = htmlString.match(/Total Order Amount:<\/td>\s*<td[^>]*>([^<]+)<\/td>/)
    
    return {
      orderId: orderIdMatch ? orderIdMatch[1] : 'N/A',
      customerName: customerNameMatch ? customerNameMatch[1].trim() : 'N/A',
      currency: currencyMatch ? currencyMatch[1].trim() : 'N/A',
      orderDate: orderDateMatch ? orderDateMatch[1].trim() : 'N/A',
      orderItems,
      totalAmount: totalMatch ? totalMatch[1].trim() : 'N/A'
    }
  }

  const parsedData = parseOrderData(orderData)

  // Table columns for Ant Design Table
  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (text) => (
        <Space>
          <ShoppingOutlined />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (value) => <Text>{value.toLocaleString()}</Text>
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'right'
    },
    {
      title: 'Line Total',
      dataIndex: 'lineTotal',
      key: 'lineTotal',
      align: 'right',
      render: (text) => <Text strong>{text}</Text>
    }
  ]

  return (
    <div style={{ 
      padding: '50px', 
      background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card
          style={{ 
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            borderRadius: 12,
            marginBottom: 24
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <CheckCircleOutlined 
              style={{ 
                fontSize: 64, 
                color: '#52c41a', 
                marginBottom: 16 
              }} 
            />
            <Title level={1} style={{ color: '#52c41a', marginBottom: 8 }}>
              Order Confirmed!
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Your order has been successfully submitted and processed.
            </Text>
          </div>

          <Divider />

          {/* Order Details Section */}
          <div style={{ marginBottom: 32 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              📋 Order Details
            </Title>
            
            <div style={{ 
              background: '#f6ffed', 
              padding: 20, 
              borderRadius: 8,
              border: '1px solid #b7eb8f'
            }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Order ID:</Text>
                  <Text code style={{ fontSize: 16 }}>{parsedData.orderId}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Customer Name:</Text>
                  <Text>{parsedData.customerName}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Currency:</Text>
                  <Text>{parsedData.currency}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Order Date:</Text>
                  <Text>{parsedData.orderDate}</Text>
                </div>
              </Space>
            </div>
          </div>

          {/* Order Items Table */}
          <div style={{ marginBottom: 32 }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              🛒 Order Items
            </Title>
            
            <Table
              columns={columns}
              dataSource={parsedData.orderItems}
              pagination={false}
              summary={() => (
                <Table.Summary.Row style={{ background: '#f6ffed' }}>
                  <Table.Summary.Cell colSpan={3}>
                    <Text strong style={{ fontSize: 16 }}>Total Order Amount:</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="right">
                    <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                      {parsedData.totalAmount}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
              bordered
              style={{ 
                borderRadius: 8,
                overflow: 'hidden'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Button 
              type="primary" 
              size="large"
              icon={<HomeOutlined />}
              onClick={onCreateAnotherOrder}
              style={{ 
                minWidth: 200,
                height: 48,
                fontSize: 16,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              Create Another Order
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OrderConfirmation
