import React from 'react'

const OrderItem = ({ 
  item, 
  index, 
  predefinedProducts, 
  currency, 
  updateOrderItem, 
  calculatePrices 
}) => {
  const itemPrices = calculatePrices(item.productName, item.quantity)

  return (
    <div className="order-item">
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
      <span id={`unit-price-${index + 1}`} className="unit-price">
        {itemPrices.unitPrice.toFixed(2)}
      </span>
      <span className="currency-label">{currency}</span>

      <label htmlFor={`net-price-${index + 1}`}>Net Price:</label>
      <span id={`net-price-${index + 1}`} className="net-price">
        {itemPrices.netPrice.toFixed(2)}
      </span>
      <span className="currency-label">{currency}</span>
    </div>
  )
}

export default OrderItem
