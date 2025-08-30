import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [customerName, setCustomerName] = useState('')
  const [currency, setCurrency] = useState('CAD')
  const [orderItems, setOrderItems] = useState([
    { productName: '', quantity: 1 }
  ])
  const [predefinedProducts, setPredefinedProducts] = useState({})
  const [exchangeRates, setExchangeRates] = useState({})

  // Fetch predefined products and exchange rates on component mount
  useEffect(() => {
    fetchPredefinedProducts()
    fetchExchangeRates()
  }, [])

  const fetchPredefinedProducts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products")
      if (response.ok) {
        const products = await response.json()
        setPredefinedProducts(products)
      }
    } catch (error) {
      console.error("Error fetching predefined products:", error)
    }
  }

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/exchange-rates")
      if (response.ok) {
        const rates = await response.json()
        setExchangeRates(rates)
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error)
    }
  }

  return (
    <div>
      <h1>Order Entry Form</h1>
      <form>
        <label htmlFor="customer-name">Customer Name:</label>
        <input
          type="text"
          id="customer-name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />

        <div id="order-items">
          <h3>Order Items</h3>
          <div className="order-item">
            <label htmlFor="product-name-1">Product 1:</label>
            <select
              id="product-name-1"
              value={orderItems[0]?.productName || ''}
              onChange={(e) => {
                const newItems = [...orderItems]
                newItems[0] = { ...newItems[0], productName: e.target.value }
                setOrderItems(newItems)
              }}
              required
            >
              <option value="">Select a product</option>
              {Object.keys(predefinedProducts).map(productName => (
                <option key={productName} value={productName}>
                  {productName}
                </option>
              ))}
            </select>

            <label htmlFor="quantity-1">Quantity:</label>
            <input
              type="number"
              id="quantity-1"
              value={orderItems[0]?.quantity || 1}
              onChange={(e) => {
                const newItems = [...orderItems]
                newItems[0] = { ...newItems[0], quantity: parseInt(e.target.value) }
                setOrderItems(newItems)
              }}
              min="1"
              required
            />

            <label htmlFor="unit-price-1">Unit Price:</label>
            <span id="unit-price-1" className="unit-price">0.00</span>
            <span className="currency-label">{currency}</span>

            <label htmlFor="net-price-1">Net Price:</label>
            <span id="net-price-1" className="net-price">0.00</span>
            <span className="currency-label">{currency}</span>
          </div>
        </div>

        <div id="currency-selector">
          <label htmlFor="currency">Select Currency:</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="CAD">CAD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div id="total-order-net-price">
          <h3>Total Order Net Price: <span id="order-net-price">0.00</span> <span id="selected-currency">{currency}</span></h3>
        </div>

        <button type="button">Add Item</button>
        <button type="button">Remove Last Item</button>
        <button type="submit">Submit Order</button>
      </form>
    </div>
  )
}

export default App
