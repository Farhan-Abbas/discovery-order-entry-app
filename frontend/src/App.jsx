import React from 'react'
import './App.css'

// Import components
import CustomerForm from './components/CustomerForm'
import OrderItems from './components/OrderItems'
import CurrencySelector from './components/CurrencySelector'
import PricingSummary from './components/PricingSummary'

// Import custom hooks
import useApiData from './hooks/useApiData'
import useOrderManagement from './hooks/useOrderManagement'

function App() {
  // Get API data (products and exchange rates)
  const { predefinedProducts, exchangeRates, loading, error } = useApiData()
  
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
    handleSubmit
  } = useOrderManagement(predefinedProducts, exchangeRates)

  // Show loading state
  if (loading) {
    return (
      <div>
        <h1>Order Entry Form</h1>
        <p>Loading products and exchange rates...</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div>
        <h1>Order Entry Form</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  const totalOrderPrice = calculateTotalPrice()

  return (
    <div>
      <h1>Order Entry Form</h1>
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

        <button type="submit">Submit Order</button>
      </form>
    </div>
  )
}

export default App
