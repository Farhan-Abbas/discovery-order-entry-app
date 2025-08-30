// Event listener for adding a new order item dynamically to the form
// This listener creates a new set of input fields for product name, quantity, unit price,
// and net price, and appends them to the order items container when the 'Add Order Item' button is clicked.
document.getElementById("add-order-item").addEventListener("click", function () {
    const orderItemsContainer = document.getElementById("order-items");
    const orderItemCount = orderItemsContainer.getElementsByClassName("order-item").length;

    // Create a new order item div
    const newOrderItem = document.createElement("div");
    newOrderItem.classList.add("order-item");

    // Add product name input
    const productNameLabel = document.createElement("label");
    productNameLabel.setAttribute("for", `product-name-${orderItemCount + 1}`);
    productNameLabel.textContent = `Product Name ${orderItemCount + 1}:`;
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

    // Add unit price input
    const unitPriceLabel = document.createElement("label");
    unitPriceLabel.setAttribute("for", `unit-price-${orderItemCount + 1}`);
    unitPriceLabel.textContent = "Unit Price:";
    const unitPriceInput = document.createElement("input");
    unitPriceInput.setAttribute("type", "number");
    unitPriceInput.setAttribute("id", `unit-price-${orderItemCount + 1}`);
    unitPriceInput.setAttribute("name", `order_items[${orderItemCount}][unit_price]`);
    unitPriceInput.setAttribute("min", "0");
    unitPriceInput.setAttribute("step", "0.01");
    unitPriceInput.required = true;

    // Add net price display
    const netPriceLabel = document.createElement("label");
    netPriceLabel.setAttribute("for", `net-price-${orderItemCount + 1}`);
    netPriceLabel.textContent = "Net Price:";
    const netPriceSpan = document.createElement("span");
    netPriceSpan.setAttribute("id", `net-price-${orderItemCount + 1}`);
    netPriceSpan.classList.add("net-price");
    netPriceSpan.textContent = "0.00";

    // Append inputs to the new order item div
    newOrderItem.appendChild(productNameLabel);
    newOrderItem.appendChild(productNameInput);
    newOrderItem.appendChild(quantityLabel);
    newOrderItem.appendChild(quantityInput);
    newOrderItem.appendChild(unitPriceLabel);
    newOrderItem.appendChild(unitPriceInput);
    newOrderItem.appendChild(netPriceLabel);
    newOrderItem.appendChild(netPriceSpan);

    // Append the new order item to the container
    orderItemsContainer.appendChild(newOrderItem);
});

// Event listener for removing the last order item dynamically from the form
document.getElementById("remove-order-item").addEventListener("click", function () {
    const orderItemsContainer = document.getElementById("order-items");
    const orderItems = orderItemsContainer.getElementsByClassName("order-item");

    // Ensure at least one order item remains
    if (orderItems.length > 1) {
        orderItemsContainer.removeChild(orderItems[orderItems.length - 1]);
    } else {
        alert("At least one order item must remain.");
    }
});

// Function to calculate and update net price for a product
function updateNetPrice(orderItem) {
    const quantityInput = orderItem.querySelector("input[name*='[quantity]']");
    const unitPriceInput = orderItem.querySelector("input[name*='[unit_price]']");
    const netPriceSpan = orderItem.querySelector(".net-price");

    const quantity = parseFloat(quantityInput.value) || 0;
    const unitPrice = parseFloat(unitPriceInput.value) || 0;
    const netPrice = quantity * unitPrice;

    netPriceSpan.textContent = netPrice.toFixed(2);
    updateTotalOrderNetPrice();
}

// Function to calculate and update total order net price
function updateTotalOrderNetPrice() {
    const orderItems = document.getElementsByClassName("order-item");
    let totalNetPrice = 0;

    for (let i = 0; i < orderItems.length; i++) {
        const netPriceSpan = orderItems[i].querySelector(".net-price");
        totalNetPrice += parseFloat(netPriceSpan.textContent) || 0;
    }

    document.getElementById("order-net-price").textContent = totalNetPrice.toFixed(2);
}

// Update event listeners for quantity and unit price inputs
document.getElementById("order-items").addEventListener("input", function (event) {
    const orderItem = event.target.closest(".order-item");
    if (orderItem) {
        updateNetPrice(orderItem);
    }
});

// Event listener for handling form submission using the fetch API
// This listener prevents the default form submission, validates the form fields,
// converts the form data to JSON, sends it to the server via a POST request,
// and dynamically updates the page content with the server's response (either success or error HTML).
document.getElementById("order-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const formData = new FormData(form);

    // Client-side validation
    const orderItems = document.getElementsByClassName("order-item");
    const productNames = new Set();
    let totalQuantity = 0;

    // Validate maximum number of line items
    if (orderItems.length > 100) {
        alert("You cannot add more than 100 line items.");
        return;
    }

    // Validate customer name
    const customerName = formData.get("customer_name").trim();
    if (!customerName) {
        alert("Customer name is required.");
        return;
    }
    if (customerName.length > 50) {
        alert("Customer name cannot exceed 50 characters.");
        return;
    }
    if (!/^[a-zA-Z ]+$/.test(customerName)) {
        alert("Customer name can only contain alphabetic characters and spaces.");
        return;
    }

    for (let i = 0; i < orderItems.length; i++) {
        const productName = orderItems[i].querySelector("input[name*='[product_name]']").value.trim();
        const quantity = parseInt(orderItems[i].querySelector("input[name*='[quantity]']").value, 10);

        // Check for empty or whitespace-only product names
        if (!productName) {
            alert(`Product name is required for item ${i + 1}.`);
            return;
        }

        // Check for duplicate product names
        if (productNames.has(productName)) {
            alert(`Duplicate product name detected: "${productName}" for item ${i + 1}.`);
            return;
        }
        productNames.add(productName);

        // Check for character limit on product name
        if (productName.length > 100) {
            alert(`Product name for item ${i + 1} cannot exceed 100 characters.`);
            return;
        }

        // Check for disallowed characters in product name
        if (!/^[a-zA-Z0-9 ]+$/.test(productName)) {
            alert(`Product name for item ${i + 1} can only contain alphanumeric characters and spaces.`);
            return;
        }

        // Check for quantity exceeding the maximum limit
        if (quantity > 1000000) {
            alert(`Quantity for item ${i + 1} cannot exceed 1,000,000.`);
            return;
        }

        // Add to total quantity
        totalQuantity += quantity;
    }

    // Validate total order quantity
    if (totalQuantity > 1000000) {
        alert("The total quantity for the order cannot exceed 1,000,000.");
        return;
    }

    // Convert form data to JSON
    const data = {};
    formData.forEach((value, key) => {
        const keys = key.split(/\[|\]/).filter(k => k); // Handle nested keys like order_items[0][product_name]
        let current = data;
        while (keys.length > 1) {
            const k = keys.shift();
            if (!current[k]) current[k] = isNaN(keys[0]) ? {} : [];
            current = current[k];
        }
        current[keys[0]] = value;
    });

    try {
        const response = await fetch(form.action, {
            method: form.method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.text();

        if (!response.ok) {
            // Display error HTML
            document.body.innerHTML = result;
            return;
        }

        // Display confirmation HTML
        document.body.innerHTML = result;
    } catch (error) {
        document.body.innerHTML = `<h1>Error</h1><p>An unexpected error occurred: ${error.message}</p>`;
    }
});