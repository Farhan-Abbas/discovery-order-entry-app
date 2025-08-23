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

// Event listener for handling form submission using the fetch API
// This listener prevents the default form submission, converts the form data to JSON,
// sends it to the server via a POST request, and dynamically updates the page content
// with the server's response (either success or error HTML).
document.getElementById("order-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const formData = new FormData(form);

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