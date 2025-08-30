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
        console.log("Products loaded:", products)
      } else {
        console.error("Failed to fetch products:", response.status)
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
        console.log("Exchange rates loaded:", rates)
      } else {
        console.error("Failed to fetch exchange rates:", response.status)
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error)
    }
  }

  // Add a new order item
  const addOrderItem = () => {
    setOrderItems([...orderItems, { productName: '', quantity: 1 }])
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Client-side validation
      if (!customerName.trim()) {
        alert("Customer name is required.")
        return
      }
      
      if (customerName.length > 50) {
        alert("Customer name cannot exceed 50 characters.")
        return
      }
      
      if (!/^[a-zA-Z ]+$/.test(customerName)) {
        alert("Customer name can only contain alphabetic characters and spaces.")
        return
      }

      // Validate order items
      const productNames = new Set()
      let totalQuantity = 0

      for (const item of orderItems) {
        if (!item.productName.trim()) {
          alert("Please select a product for all order items.")
          return
        }
        
        if (productNames.has(item.productName)) {
          alert(`Duplicate product name detected: '${item.productName}'.`)
          return
        }
        productNames.add(item.productName)
        totalQuantity += item.quantity
      }

      if (totalQuantity > 1000000) {
        alert("The total quantity for the order cannot exceed 1,000,000.")
        return
      }

      // Prepare order data
      const orderData = {
        customer_name: customerName,
        currency: currency,
        order_items: orderItems.map(item => ({
          product_name: item.productName,
          quantity: item.quantity
        }))
      }

      // Submit order
      const response = await fetch("http://127.0.0.1:8000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const result = await response.text() // Get HTML response
        document.body.innerHTML = result // Replace page content with confirmation
      } else {
        const errorText = await response.text()
        alert("Order submission failed: " + errorText)
      }

    } catch (error) {
      console.error("Error submitting order:", error)
      alert("An unexpected error occurred while submitting the order.")
    }
  }

  // Remove the last order item
  const removeLastOrderItem = () => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.slice(0, -1))
    } else {
      alert("At least one order item must remain.")
    }
  }

  // Update a specific order item
  const updateOrderItem = (index, field, value) => {
    const newItems = [...orderItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setOrderItems(newItems)
  }

  // Calculate unit price and net price for an order item
  const calculatePrices = (productName, quantity) => {
    if (!productName || !predefinedProducts[productName] || !exchangeRates[currency]) {
      return { unitPrice: 0, netPrice: 0 }
    }
    
    const basePrice = predefinedProducts[productName]
    const conversionRate = exchangeRates[currency] || 1
    const unitPrice = basePrice * conversionRate
    const netPrice = unitPrice * quantity
    
    return { unitPrice, netPrice }
  }

  // Calculate total order price
  const calculateTotalPrice = () => {
    return orderItems.reduce((total, item) => {
      const { netPrice } = calculatePrices(item.productName, item.quantity)
      return total + netPrice
    }, 0)
  }

  // Get prices for the first item (for display)
  const totalOrderPrice = calculateTotalPrice()

  return (
    <div>
      <h1>Order Entry Form</h1>
      <form onSubmit={handleSubmit}>
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
          {orderItems.map((item, index) => {
            const itemPrices = calculatePrices(item.productName, item.quantity)
            return (
              <div key={index} className="order-item">
                <label htmlFor={`product-name-${index + 1}`}>Product {index + 1}:</label>
                <select
                  id={`product-name-${index + 1}`}
                  value={item.productName}
                  onChange={(e) => updateOrderItem(index, 'productName', e.target.value)}
                  required
                >
                  <option value="">Select a product</option>
                  {Object.keys(predefinedProducts).map(productName => (
                    <option key={productName} value={productName}>
                      {productName}
                    </option>
                  ))}
                </select>

                <label htmlFor={`quantity-${index + 1}`}>Quantity:</label>
                <input
                  type="number"
                  id={`quantity-${index + 1}`}
                  value={item.quantity}
                  onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  min="1"
                  required
                />

                <label htmlFor={`unit-price-${index + 1}`}>Unit Price:</label>
                <span id={`unit-price-${index + 1}`} className="unit-price">{itemPrices.unitPrice.toFixed(2)}</span>
                <span className="currency-label">{currency}</span>

                <label htmlFor={`net-price-${index + 1}`}>Net Price:</label>
                <span id={`net-price-${index + 1}`} className="net-price">{itemPrices.netPrice.toFixed(2)}</span>
                <span className="currency-label">{currency}</span>
              </div>
            )
          })}
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
          <h3>Total Order Net Price: <span id="order-net-price">{totalOrderPrice.toFixed(2)}</span> <span id="selected-currency">{currency}</span></h3>
        </div>

        <button type="button" onClick={addOrderItem}>Add Item</button>
        <button type="button" onClick={removeLastOrderItem}>Remove Last Item</button>
        <button type="submit">Submit Order</button>
      </form>
    </div>
  )
}

export default App
