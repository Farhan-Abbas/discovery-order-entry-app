// Global variables
let predefinedProducts = {};
let exchangeRates = {};
let currentCurrency = "CAD";

// Function to fetch predefined products from the backend
async function fetchPredefinedProducts() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/products");
        if (!response.ok) {
            throw new Error("Failed to fetch predefined products.");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching predefined products:", error);
        return null;
    }
}

// Function to populate product dropdown
function populateProductDropdown(selectElement) {
    // Clear existing options except the first one
    selectElement.innerHTML = '<option value="">Select a product</option>';
    
    // Add predefined products as options
    Object.keys(predefinedProducts).forEach(productName => {
        const option = document.createElement("option");
        option.value = productName;
        option.textContent = productName;
        selectElement.appendChild(option);
    });
}

// Function to initialize the application
async function initializeApp() {
    // Fetch predefined products and exchange rates
    predefinedProducts = await fetchPredefinedProducts();
    exchangeRates = await fetchExchangeRates();
    
    if (!predefinedProducts) {
        alert("Failed to load product data.");
        return;
    }
    
    if (!exchangeRates) {
        alert("Failed to load exchange rate data.");
        return;
    }
    
    // Populate the first product dropdown
    const firstProductSelect = document.getElementById("product-name-1");
    populateProductDropdown(firstProductSelect);
}

// Event listener for adding a new order item dynamically to the form
// This listener creates a new set of input fields for product selection, quantity,
// unit price display, and net price display, and appends them to the order items container.
document.getElementById("add-order-item").addEventListener("click", function () {
    const orderItemsContainer = document.getElementById("order-items");
    const orderItemCount = orderItemsContainer.getElementsByClassName("order-item").length;

    // Create a new order item div
    const newOrderItem = document.createElement("div");
    newOrderItem.classList.add("order-item");

    // Add product selection dropdown
    const productNameLabel = document.createElement("label");
    productNameLabel.setAttribute("for", `product-name-${orderItemCount + 1}`);
    productNameLabel.textContent = `Product ${orderItemCount + 1}:`;
    const productNameSelect = document.createElement("select");
    productNameSelect.setAttribute("id", `product-name-${orderItemCount + 1}`);
    productNameSelect.setAttribute("name", `order_items[${orderItemCount}][product_name]`);
    productNameSelect.required = true;
    
    // Populate the dropdown
    populateProductDropdown(productNameSelect);

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

    // Add unit price display
    const unitPriceLabel = document.createElement("label");
    unitPriceLabel.setAttribute("for", `unit-price-${orderItemCount + 1}`);
    unitPriceLabel.textContent = "Unit Price:";
    const unitPriceSpan = document.createElement("span");
    unitPriceSpan.setAttribute("id", `unit-price-${orderItemCount + 1}`);
    unitPriceSpan.classList.add("unit-price");
    unitPriceSpan.textContent = "0.00";
    const unitPriceCurrency = document.createElement("span");
    unitPriceCurrency.classList.add("currency-label");
    unitPriceCurrency.textContent = currentCurrency;

    // Add net price display
    const netPriceLabel = document.createElement("label");
    netPriceLabel.setAttribute("for", `net-price-${orderItemCount + 1}`);
    netPriceLabel.textContent = "Net Price:";
    const netPriceSpan = document.createElement("span");
    netPriceSpan.setAttribute("id", `net-price-${orderItemCount + 1}`);
    netPriceSpan.classList.add("net-price");
    netPriceSpan.textContent = "0.00";
    const netPriceCurrency = document.createElement("span");
    netPriceCurrency.classList.add("currency-label");
    netPriceCurrency.textContent = currentCurrency;

    // Append inputs to the new order item div
    newOrderItem.appendChild(productNameLabel);
    newOrderItem.appendChild(productNameSelect);
    newOrderItem.appendChild(quantityLabel);
    newOrderItem.appendChild(quantityInput);
    newOrderItem.appendChild(unitPriceLabel);
    newOrderItem.appendChild(unitPriceSpan);
    newOrderItem.appendChild(document.createTextNode(" "));
    newOrderItem.appendChild(unitPriceCurrency);
    newOrderItem.appendChild(netPriceLabel);
    newOrderItem.appendChild(netPriceSpan);
    newOrderItem.appendChild(document.createTextNode(" "));
    newOrderItem.appendChild(netPriceCurrency);

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
        updateTotalOrderNetPrice(); // Recalculate total after removing item
    } else {
        alert("At least one order item must remain.");
    }
});

// Function to calculate and update net price for a product
function updateNetPrice(orderItem) {
    const quantityInput = orderItem.querySelector("input[name*='[quantity]']");
    const productSelect = orderItem.querySelector("select[name*='[product_name]']");
    const unitPriceSpan = orderItem.querySelector(".unit-price");
    const netPriceSpan = orderItem.querySelector(".net-price");

    const quantity = parseFloat(quantityInput.value) || 0;
    const selectedProduct = productSelect.value;
    
    if (!selectedProduct || !predefinedProducts[selectedProduct]) {
        unitPriceSpan.textContent = "0.00";
        netPriceSpan.textContent = "0.00";
        updateTotalOrderNetPrice();
        return;
    }

    // Get the base price in CAD
    const baseUnitPrice = predefinedProducts[selectedProduct];
    
    // Convert to current currency
    const conversionRate = exchangeRates[currentCurrency] || 1;
    const convertedUnitPrice = baseUnitPrice * conversionRate;
    const netPrice = quantity * convertedUnitPrice;

    unitPriceSpan.textContent = convertedUnitPrice.toFixed(2);
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

// Update event listeners for quantity inputs and product selection
document.getElementById("order-items").addEventListener("input", function (event) {
    const orderItem = event.target.closest(".order-item");
    if (orderItem) {
        updateNetPrice(orderItem);
    }
});

// Update event listeners for product selection changes
document.getElementById("order-items").addEventListener("change", function (event) {
    const orderItem = event.target.closest(".order-item");
    if (orderItem && event.target.tagName === "SELECT") {
        updateNetPrice(orderItem);
    }
});

// Function to fetch exchange rates from the backend
async function fetchExchangeRates() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/exchange-rates"); // Updated URL
        if (!response.ok) {
            throw new Error("Failed to fetch exchange rates.");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        return null;
    }
}

// Function to update all prices when currency changes
async function updateCurrency() {
    const currency = document.getElementById("currency").value;
    currentCurrency = currency;
    
    if (!exchangeRates || !exchangeRates[currency]) {
        alert("Unable to fetch exchange rate for the selected currency.");
        return;
    }

    // Update currency labels
    const currencyLabels = document.querySelectorAll(".currency-label");
    currencyLabels.forEach(label => {
        label.textContent = currency;
    });
    
    // Update selected currency display
    document.getElementById("selected-currency").textContent = currency;

    // Recalculate all prices
    const orderItems = document.getElementsByClassName("order-item");
    for (let i = 0; i < orderItems.length; i++) {
        updateNetPrice(orderItems[i]);
    }
}

// Event listener for currency selection change
document.getElementById("currency").addEventListener("change", updateCurrency);

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
        const productSelect = orderItems[i].querySelector("select[name*='[product_name]']");
        const productName = productSelect.value.trim();
        const quantity = parseInt(orderItems[i].querySelector("input[name*='[quantity]']").value, 10);

        // Check for empty product selection
        if (!productName) {
            alert(`Product selection is required for item ${i + 1}.`);
            return;
        }

        // Check for duplicate product names
        if (productNames.has(productName)) {
            alert(`Duplicate product selected: "${productName}" for item ${i + 1}.`);
            return;
        }
        productNames.add(productName);

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

// Initialize the application when the page loads
document.addEventListener("DOMContentLoaded", initializeApp);