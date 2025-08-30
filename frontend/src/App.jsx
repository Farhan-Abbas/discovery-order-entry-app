import React, { useState } from 'react'
import { Layout, Typography, Card, Spin, Alert, Button, ConfigProvider } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

// Import components
import CustomerForm from './components/CustomerForm'
import OrderItems from './components/OrderItems'
import CurrencySelector from './components/CurrencySelector'
import PricingSummary from './components/PricingSummary'
import OrderConfirmation from './components/OrderConfirmation'

// Import custom hooks
import useApiData from './hooks/useApiData'
import useOrderManagement from './hooks/useOrderManagement'

const { Header, Content } = Layout
const { Title } = Typography

// Enterprise theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 6,
    colorBgContainer: '#ffffff',
  },
  components: {
    Card: {
      borderRadiusLG: 8,
    },
    Button: {
      borderRadius: 6,
    },
  },
}

function App() {
  // State for order confirmation
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const [orderConfirmationData, setOrderConfirmationData] = useState(null)

  // Get API data (products and exchange rates)
  const { predefinedProducts, exchangeRates, loading, error, retryLoad } = useApiData()
  
  // Get order management functions and state
  const {
    customerName,
    setCustomerName,
    currency,
    setCurrency,
    orderItems,
    addOrderItem,
    removeLastOrderItem,
    updateOrderItem,
    calculatePrices,
    calculateTotalPrice,
    handleSubmit,
    isSubmitting,
    submitError
  } = useOrderManagement(predefinedProducts, exchangeRates, setShowOrderConfirmation, setOrderConfirmationData)

  // Function to handle creating another order
  const handleCreateAnotherOrder = () => {
    setShowOrderConfirmation(false)
    setOrderConfirmationData(null)
    // Reset form state if needed
  }

  // Show order confirmation if order was submitted successfully
  if (showOrderConfirmation && orderConfirmationData) {
    return (
      <ConfigProvider theme={theme}>
        <OrderConfirmation 
          orderData={orderConfirmationData}
          onCreateAnotherOrder={handleCreateAnotherOrder}
        />
      </ConfigProvider>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <ConfigProvider theme={theme}>
        <Layout style={{ minHeight: '100vh' }}>
          <Content style={{ 
            padding: '50px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <Card style={{ textAlign: 'center', minWidth: 300 }}>
              <Spin size="large" />
              <div style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
                Loading products and exchange rates...
              </div>
            </Card>
          </Content>
        </Layout>
      </ConfigProvider>
    )
  }

  // Show error state with retry option
  if (error) {
    return (
      <ConfigProvider theme={theme}>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ 
            background: '#fff', 
            padding: '0 50px', 
            boxShadow: '0 2px 8px #f0f1f2',
            borderBottom: '1px solid #e8e8e8'
          }}>
            <Title level={2} style={{ 
              margin: '16px 0', 
              color: '#1890ff',
              fontWeight: 600
            }}>
              📋 Enterprise Order Entry System
            </Title>
          </Header>
          <Content style={{ 
            padding: '50px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <Alert
                message="Failed to Load Application Data"
                description={error}
                type="error"
                showIcon
                action={
                  <Button 
                    size="small" 
                    danger 
                    icon={<ReloadOutlined />}
                    onClick={retryLoad}
                  >
                    Retry
                  </Button>
                }
              />
            </div>
          </Content>
        </Layout>
      </ConfigProvider>
    )
  }

  const totalOrderPrice = calculateTotalPrice()

  return (
    <ConfigProvider theme={theme}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 50px', 
          boxShadow: '0 2px 8px #f0f1f2',
          borderBottom: '1px solid #e8e8e8'
        }}>
          <Title level={2} style={{ 
            margin: '16px 0', 
            color: '#1890ff',
            fontWeight: 600
          }}>
            📋 Enterprise Order Entry System
          </Title>
        </Header>
        
        <Content style={{ 
          padding: '50px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {submitError && (
              <Alert
                message="Order Submission Error"
                description={submitError}
                type="error"
                showIcon
                style={{ marginBottom: 24 }}
                closable
              />
            )}
            
            <Card 
              title={
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                  🛒 Create New Order
                </span>
              }
              style={{ 
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                borderRadius: 12,
                background: '#fff'
              }}
              headStyle={{
                background: 'linear-gradient(90deg, #f0f2ff 0%, #f9f0ff 100%)',
                borderRadius: '12px 12px 0 0'
              }}
            >
              <form onSubmit={handleSubmit}>
                <CustomerForm 
                  customerName={customerName} 
                  setCustomerName={setCustomerName} 
                />

                <OrderItems
                  orderItems={orderItems}
                  predefinedProducts={predefinedProducts}
                  currency={currency}
                  updateOrderItem={updateOrderItem}
                  calculatePrices={calculatePrices}
                  addOrderItem={addOrderItem}
                  removeLastOrderItem={removeLastOrderItem}
                />

                <CurrencySelector 
                  currency={currency} 
                  setCurrency={setCurrency} 
                />

                <PricingSummary 
                  totalOrderPrice={totalOrderPrice} 
                  currency={currency} 
                />

                <div style={{ marginTop: 32, textAlign: 'center' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large"
                    loading={isSubmitting}
                    style={{ 
                      minWidth: 240,
                      height: 48,
                      fontSize: 16,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  >
                    {isSubmitting ? '🔄 Submitting Order...' : '✅ Submit Order'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default App
