import { useState } from 'react'

const useOrderManagement = (predefinedProducts, exchangeRates, setShowOrderConfirmation, setOrderConfirmationData) => {
  const [customerName, setCustomerName] = useState('')
  const [currency, setCurrency] = useState('CAD')
  const [orderItems, setOrderItems] = useState([
    { productName: '', quantity: 1 }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Add a new order item
  const addOrderItem = () => {
    setOrderItems([...orderItems, { productName: '', quantity: 1 }])
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Client-side validation
      if (!customerName.trim()) {
        setSubmitError("Customer name is required.")
        return
      }
      
      if (customerName.length > 50) {
        setSubmitError("Customer name cannot exceed 50 characters.")
        return
      }
      
      if (!/^[a-zA-Z ]+$/.test(customerName)) {
        setSubmitError("Customer name can only contain alphabetic characters and spaces.")
        return
      }

      // Validate order items
      const productNames = new Set()
      let totalQuantity = 0

      for (const item of orderItems) {
        if (!item.productName.trim()) {
          setSubmitError("Please select a product for all order items.")
          return
        }
        
        if (productNames.has(item.productName)) {
          setSubmitError(`Duplicate product name detected: '${item.productName}'.`)
          return
        }
        productNames.add(item.productName)
        totalQuantity += item.quantity
      }

      if (totalQuantity > 1000000) {
        setSubmitError("The total quantity for the order cannot exceed 1,000,000.")
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
        setOrderConfirmationData(result) // Store the HTML response
        setShowOrderConfirmation(true) // Show order confirmation component
      } else {
        const errorText = await response.text()
        setSubmitError("Order submission failed: " + errorText)
      }

    } catch (error) {
      console.error("Error submitting order:", error)
      setSubmitError("An unexpected error occurred while submitting the order.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
  }
}

export default useOrderManagement
