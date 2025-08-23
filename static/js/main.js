document.getElementById("add-order-item").addEventListener("click", function () {
    const orderItemsContainer = document.getElementById("order-items");
    const orderItemCount = orderItemsContainer.getElementsByClassName("order-item").length;

    // Create a new order item div
    const newOrderItem = document.createElement("div");
    newOrderItem.classList.add("order-item");

    // Add product name input
    const productNameLabel = document.createElement("label");
    productNameLabel.setAttribute("for", `product-name-${orderItemCount + 1}`);
    productNameLabel.textContent = "Product Name:";
    const productNameInput = document.createElement("input");
    productNameInput.setAttribute("type", "text");
    productNameInput.setAttribute("id", `product-name-${orderItemCount + 1}`);
    productNameInput.setAttribute("name", `order_items[${orderItemCount}][product_name]`);
    productNameInput.required = true;

    // Add quantity input
    const quantityLabel = document.createElement("label");
    quantityLabel.setAttribute("for", `quantity-${orderItemCount + 1}`);
    quantityLabel.textContent = "Quantity:";
    const quantityInput = document.createElement("input");
    quantityInput.setAttribute("type", "number");
    quantityInput.setAttribute("id", `quantity-${orderItemCount + 1}`);
    quantityInput.setAttribute("name", `order_items[${orderItemCount}][quantity]`);
    quantityInput.setAttribute("min", "1");
    quantityInput.required = true;

    // Append inputs to the new order item div
    newOrderItem.appendChild(productNameLabel);
    newOrderItem.appendChild(productNameInput);
    newOrderItem.appendChild(quantityLabel);
    newOrderItem.appendChild(quantityInput);

    // Append the new order item to the container
    orderItemsContainer.appendChild(newOrderItem);
});