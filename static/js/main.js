// Event listener for adding a new order item dynamically to the form
// This listener creates a new set of input fields for product name and quantity
// and appends them to the order items container when the 'Add Order Item' button is clicked.
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

    // Append inputs to the new order item div
    newOrderItem.appendChild(productNameLabel);
    newOrderItem.appendChild(productNameInput);
    newOrderItem.appendChild(quantityLabel);
    newOrderItem.appendChild(quantityInput);

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