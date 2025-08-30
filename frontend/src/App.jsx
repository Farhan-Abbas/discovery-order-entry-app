import React, { useState } from 'react'
import { Layout, Typography, Card, Spin, Alert, Button, ConfigProvider } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

// Import components
import CustomerForm from './components/CustomerForm'
import OrderItems from './components/OrderItems'
import CurrencySelector from './components/CurrencySelector'
import PricingSummary from './components/PricingSummary'
import OrderConfirmation from './components/OrderConfirmation'
import ThemeToggle from './components/ThemeToggle'

// Import custom hooks and contexts
import useApiData from './hooks/useApiData'
import useOrderManagement from './hooks/useOrderManagement'
import { useTheme } from './contexts/ThemeContext'

const { Header, Content } = Layout
const { Title } = Typography

function App() {
  // Get theme from context
  const { currentTheme, isDarkMode } = useTheme()
  
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
    submitError,
    resetForm
  } = useOrderManagement(predefinedProducts, exchangeRates, setShowOrderConfirmation, setOrderConfirmationData)

  // Function to handle creating another order
  const handleCreateAnotherOrder = () => {
    setShowOrderConfirmation(false)
    setOrderConfirmationData(null)
    resetForm() // Clear all form fields
  }

  // Show order confirmation if order was submitted successfully
  if (showOrderConfirmation && orderConfirmationData) {
    return (
      <ConfigProvider theme={currentTheme}>
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
      <ConfigProvider theme={currentTheme}>
        <Layout style={{ minHeight: '100vh' }}>
          <Content style={{ 
            padding: '16px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            background: isDarkMode 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #0d1117 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <Card style={{ 
              textAlign: 'center', 
              margin: '0 auto',
              width: '100%',
              maxWidth: 400
            }}>
              <Spin size="large" />
              <div style={{ 
                marginTop: 16, 
                fontSize: 16, 
                color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#666' 
              }}>
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
      <ConfigProvider theme={currentTheme}>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ 
            background: currentTheme.components.Layout.colorBgHeader, 
            padding: '0 16px', 
            boxShadow: '0 2px 8px #f0f1f2',
            borderBottom: `1px solid ${currentTheme.token.colorBorder}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Title level={3} style={{ 
              margin: '16px 0', 
              color: isDarkMode ? '#4db8ff' : '#1890ff',
              fontWeight: 600,
              fontSize: '18px'
            }}>
              📋 Enterprise Order Entry System
            </Title>
            <ThemeToggle />
          </Header>
          <Content style={{ 
            padding: '16px',
            background: isDarkMode 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #0d1117 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
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
    <ConfigProvider theme={currentTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          background: currentTheme.components.Layout.colorBgHeader, 
          padding: '0 16px', 
          boxShadow: '0 2px 8px #f0f1f2',
          borderBottom: `1px solid ${currentTheme.token.colorBorder}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Title level={3} style={{ 
            margin: '16px 0', 
            color: isDarkMode ? '#4db8ff' : '#1890ff',
            fontWeight: 600,
            fontSize: '18px'
          }}>
            📋 Enterprise Order Entry System
          </Title>
          <ThemeToggle />
        </Header>
        
        <Content style={{ 
          padding: '16px', 
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #0d1117 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            {submitError && (
              <Alert
                message="Order Submission Error"
                description={submitError}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
                closable
              />
            )}
            
            <Card 
              title={
                <span style={{ 
                  fontSize: 18, 
                  fontWeight: 600,
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}>
                  🛒 Create New Order
                </span>
              }
              style={{ 
                boxShadow: isDarkMode 
                  ? '0 8px 24px rgba(0,0,0,0.6)'
                  : '0 8px 24px rgba(0,0,0,0.12)',
                borderRadius: 12,
                background: isDarkMode ? '#141414' : '#fff',
                border: isDarkMode ? '1px solid #424242' : 'none'
              }}
              headStyle={{
                background: isDarkMode 
                  ? 'linear-gradient(90deg, #1e1e1e 0%, #2d2d2d 100%)'
                  : 'linear-gradient(90deg, #f0f2ff 0%, #f9f0ff 100%)',
                borderRadius: '12px 12px 0 0',
                borderBottom: isDarkMode ? '1px solid #424242' : 'none'
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

                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="default"
                    loading={isSubmitting}
                    style={{ 
                      minWidth: 200,
                      height: 44,
                      fontSize: 14,
                      fontWeight: 600,
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: isDarkMode 
                        ? '0 4px 15px rgba(0,0,0,0.5)'
                        : '0 4px 15px rgba(0,0,0,0.2)',
                      color: '#ffffff'
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
