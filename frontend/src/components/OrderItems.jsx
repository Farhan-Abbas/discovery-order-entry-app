import React from 'react'
import OrderItem from './OrderItem'

const OrderItems = ({ 
  orderItems, 
  predefinedProducts, 
  currency, 
  updateOrderItem, 
  calculatePrices,
  addOrderItem,
  removeLastOrderItem 
}) => {
  return (
    <div id="order-items">
      <h3>Order Items</h3>
      {orderItems.map((item, index) => (
        <OrderItem
          key={index}
          item={item}
          index={index}
          predefinedProducts={predefinedProducts}
          currency={currency}
          updateOrderItem={updateOrderItem}
          calculatePrices={calculatePrices}
        />
      ))}
      
      <button type="button" onClick={addOrderItem}>Add Item</button>
      <button type="button" onClick={removeLastOrderItem}>Remove Last Item</button>
    </div>
  )
}

export default OrderItems
