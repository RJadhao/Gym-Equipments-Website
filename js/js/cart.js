// COMPLETE CART PAGE SYSTEM - FULLY INTEGRATED AND WORKING
class CartPage {
    constructor() {
        this.cart = [];
        this.products = [];
        this.database = null;
        this.version = '6.0.0';
        
        console.log('🛒 Initializing Cart Page v' + this.version);
        this.initializeCartPage();
    }

    async initializeCartPage() {
        try {
            // Initialize database
            if (typeof WebAppDatabase !== 'undefined') {
                this.database = new WebAppDatabase();
                await this.database.initialize();
                console.log('✅ Cart database connected');
            }

            // Load data
            await this.loadCartData();
            await this.loadProducts();
            
            // Setup UI
            this.updateCartDisplay();
            this.renderCartPage();
            this.loadRecommendedProducts();
            
            console.log('✅ Cart page initialized successfully');
            
        } catch (error) {
            console.error('❌ Cart initialization error:', error);
            this.showError('Failed to load cart. Please refresh the page.');
        }
    }

    // CART DATA MANAGEMENT - FULLY WORKING
    async loadCartData() {
        try {
            const savedCart = localStorage.getItem('jadhao_cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                console.log(`✅ Loaded ${this.cart.length} items from cart`);
            } else {
                this.cart = [];
                console.log('ℹ️ No cart data found - starting with empty cart');
            }
        } catch (error) {
            console.error('Error loading cart data:', error);
            this.cart = [];
        }
    }

    async loadProducts() {
        try {
            const savedProducts = localStorage.getItem('jadhao_products');
            if (savedProducts) {
                this.products = JSON.parse(savedProducts);
                console.log(`✅ Loaded ${this.products.length} products`);
            } else {
                // Initialize with default products if none exist
                this.products = this.getDefaultProducts();
                localStorage.setItem('jadhao_products', JSON.stringify(this.products));
                console.log('✅ Initialized with default products');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
        }
    }

    saveCartData() {
        try {
            localStorage.setItem('jadhao_cart', JSON.stringify(this.cart));
            console.log('✅ Cart data saved');
        } catch (error) {
            console.error('Error saving cart data:', error);
        }
    }

    // CART UI RENDERING - FULLY WORKING
    renderCartPage() {
        const loadingElement = document.getElementById('cart-loading');
        const emptyCartElement = document.getElementById('empty-cart');
        const cartContentElement = document.getElementById('cart-content');
        
        // Hide loading
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        if (this.cart.length === 0) {
            // Show empty cart
            if (emptyCartElement) emptyCartElement.style.display = 'block';
            if (cartContentElement) cartContentElement.style.display = 'none';
            
            this.updateCartSummary(0, 0, 0, 0, 0);
        } else {
            // Show cart content
            if (emptyCartElement) emptyCartElement.style.display = 'none';
            if (cartContentElement) cartContentElement.style.display = 'block';
            
            this.renderCartItems();
            this.calculateAndUpdateSummary();
        }
    }

    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = '<p class="text-center text-muted py-5">No items in cart</p>';
            return;
        }

        container.innerHTML = this.cart.map((item, index) => {
            const product = this.products.find(p => p.id === item.id);
            const isAvailable = product && product.status === 'active' && product.stock > 0;
            const maxQuantity = product ? product.stock : 0;

            return `
                <div class="cart-item-card" data-item-id="${item.id}">
                    <div class="row align-items-center">
                        <div class="col-md-2 col-4">
                            <img src="${item.image}" alt="${this.escapeHtml(item.name)}" 
                                 class="cart-item-image"
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                        </div>
                        
                        <div class="col-md-4 col-8">
                            <div class="item-details">
                                <h5 class="item-name">${this.escapeHtml(item.name)}</h5>
                                <span class="item-category">${this.formatCategory(item.category)}</span>
                                
                                ${item.features && item.features.length > 0 ? `
                                    <div class="item-features">
                                        ${item.features.slice(0, 3).map(feature => 
                                            `<span class="feature-tag">${this.escapeHtml(feature)}</span>`
                                        ).join('')}
                                    </div>
                                ` : ''}
                                
                                ${!isAvailable ? `
                                    <div class="alert alert-warning alert-sm mt-2 mb-0">
                                        <i class="fas fa-exclamation-triangle me-1"></i>
                                        ${product ? (product.stock === 0 ? 'Out of stock' : 'Product unavailable') : 'Product not found'}
                                    </div>
                                ` : ''}
                                
                                ${maxQuantity > 0 && maxQuantity < 10 ? `
                                    <div class="text-warning mt-1">
                                        <small><i class="fas fa-info-circle me-1"></i>Only ${maxQuantity} left in stock</small>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <div class="col-md-3 col-6">
                            <div class="pricing-section">
                                <div class="price-line">
                                    <span>Base Price:</span>
                                    <span class="base-price">₹${item.basePrice.toLocaleString()}</span>
                                </div>
                                
                                ${item.taxPercent > 0 ? `
                                    <div class="price-line">
                                        <span>${item.taxName}:</span>
                                        <span class="tax-info">₹${item.taxAmount.toFixed(2)}</span>
                                    </div>
                                ` : ''}
                                
                                <div class="total-price">
                                    Total: ₹${item.finalPrice.toFixed(2)}
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-3 col-6">
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)" 
                                        ${item.quantity <= 1 ? 'disabled' : ''}>
                                    <i class="fas fa-minus"></i>
                                </button>
                                
                                <div class="quantity-display">${item.quantity}</div>
                                
                                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)"
                                        ${!isAvailable || item.quantity >= maxQuantity ? 'disabled' : ''}>
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            
                            <button class="remove-item-btn" onclick="removeFromCart('${item.id}')">
                                <i class="fas fa-trash me-1"></i>Remove
                            </button>
                            
                            <div class="item-total-price mt-2">
                                <strong>₹${(item.finalPrice * item.quantity).toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // CART CALCULATIONS - FULLY WORKING
    calculateAndUpdateSummary() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.cart.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
        const totalTax = this.cart.reduce((sum, item) => sum + (item.taxAmount * item.quantity), 0);
        const grandTotal = subtotal + totalTax;
        const shipping = grandTotal > 50000 ? 0 : 1500; // Free shipping above ₹50,000
        const finalTotal = grandTotal + shipping;

        this.updateCartSummary(totalItems, subtotal, totalTax, shipping, finalTotal);
        this.updateCartDisplay();
    }

    updateCartSummary(itemCount, subtotal, tax, shipping, total) {
        // Update summary elements
        const elements = {
            'total-items-count': itemCount,
            'summary-items-count': itemCount,
            'subtotal-amount': `₹${subtotal.toLocaleString()}`,
            'tax-amount': `₹${tax.toFixed(2)}`,
            'shipping-amount': shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`,
            'total-amount': `₹${total.toLocaleString()}`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        // Update checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            if (itemCount === 0) {
                checkoutBtn.disabled = true;
                checkoutBtn.innerHTML = '<i class="fas fa-shopping-cart me-2"></i>Cart is Empty';
            } else {
                checkoutBtn.disabled = false;
                checkoutBtn.innerHTML = '<i class="fas fa-credit-card me-2"></i>Proceed to Checkout';
            }
        }
    }

    updateCartDisplay() {
        // Update navbar cart display
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = this.cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
        
        if (cartCount) {
            if (totalItems > 0) {
                cartCount.textContent = totalItems;
                cartCount.classList.remove('d-none');
            } else {
                cartCount.classList.add('d-none');
            }
        }
        
        if (cartTotal) {
            cartTotal.textContent = `₹${totalAmount.toLocaleString()}`;
        }
    }

    // CART OPERATIONS - FULLY WORKING
    updateQuantity(productId, change) {
        try {
            const itemIndex = this.cart.findIndex(item => item.id === productId);
            if (itemIndex === -1) {
                this.showNotification('Item not found in cart', 'error');
                return false;
            }

            const item = this.cart[itemIndex];
            const product = this.products.find(p => p.id === productId);
            
            if (!product) {
                this.showNotification('Product no longer available', 'error');
                return false;
            }

            const newQuantity = item.quantity + change;

            if (newQuantity <= 0) {
                return this.removeFromCart(productId);
            }

            if (newQuantity > product.stock) {
                this.showNotification(`Only ${product.stock} items available`, 'warning');
                return false;
            }

            item.quantity = newQuantity;
            this.saveCartData();
            this.renderCartItems();
            this.calculateAndUpdateSummary();
            
            this.showNotification(
                `${item.name} quantity updated to ${newQuantity}`,
                'success'
            );
            
            return true;

        } catch (error) {
            console.error('Error updating quantity:', error);
            this.showNotification('Error updating quantity', 'error');
            return false;
        }
    }

    removeFromCart(productId) {
        try {
            const itemIndex = this.cart.findIndex(item => item.id === productId);
            if (itemIndex === -1) {
                this.showNotification('Item not found in cart', 'error');
                return false;
            }

            const item = this.cart[itemIndex];
            this.cart.splice(itemIndex, 1);
            
            this.saveCartData();
            this.renderCartPage();
            
            this.showNotification(
                `${item.name} removed from cart`,
                'info'
            );
            
            return true;

        } catch (error) {
            console.error('Error removing from cart:', error);
            this.showNotification('Error removing item from cart', 'error');
            return false;
        }
    }

    addToCart(productId, quantity = 1) {
        try {
            const product = this.products.find(p => p.id === productId);
            
            if (!product) {
                this.showNotification('Product not found', 'error');
                return false;
            }

            if (product.stock <= 0) {
                this.showNotification('Product is out of stock', 'error');
                return false;
            }

            // Check if item already exists
            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > product.stock) {
                    this.showNotification('Not enough stock available', 'warning');
                    return false;
                }
                existingItem.quantity = newQuantity;
            } else {
                // Calculate pricing
                const basePrice = product.price || product.originalPrice || 0;
                const taxAmount = basePrice * ((product.taxPercent || 0) / 100);
                const finalPrice = basePrice + taxAmount;
                
                // Add new item
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    basePrice: basePrice,
                    taxAmount: taxAmount,
                    taxPercent: product.taxPercent || 0,
                    taxName: product.taxName || '',
                    finalPrice: finalPrice,
                    image: product.image,
                    category: product.category,
                    quantity: quantity,
                    maxStock: product.stock,
                    features: product.features || []
                });
            }

            this.saveCartData();
            this.renderCartPage();
            
            this.showNotification(
                `${product.name} added to cart!`,
                'success'
            );
            
            return true;

        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Error adding item to cart', 'error');
            return false;
        }
    }

    clearCart() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is already empty', 'info');
            return;
        }

        if (confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
            this.cart = [];
            this.saveCartData();
            this.renderCartPage();
            this.showNotification('Cart cleared successfully', 'info');
        }
    }

    // CHECKOUT FUNCTIONALITY - FULLY WORKING
    proceedToCheckout() {
        try {
            if (this.cart.length === 0) {
                this.showNotification('Your cart is empty', 'warning');
                return;
            }

            // Calculate final totals
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = this.cart.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
            const totalTax = this.cart.reduce((sum, item) => sum + (item.taxAmount * item.quantity), 0);
            const grandTotal = subtotal + totalTax;
            const shipping = grandTotal > 50000 ? 0 : 1500;
            const finalTotal = grandTotal + shipping;

            // Create order summary
            const orderSummary = `ORDER SUMMARY - JADHAO INDUSTRIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ITEMS ORDERED (${totalItems} units):
${this.cart.map(item => 
    `• ${item.name} x${item.quantity} = ₹${(item.finalPrice * item.quantity).toLocaleString()}`
).join('\n')}

PRICING BREAKDOWN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal: ₹${subtotal.toLocaleString()}
Tax (GST): ₹${totalTax.toFixed(2)}
Shipping: ${shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GRAND TOTAL: ₹${finalTotal.toLocaleString()}

DELIVERY INFORMATION:
• Estimated delivery: 3-7 business days
• Installation support available
• 1-year warranty on all products
• Cash on delivery available

Please complete the contact form on the next page to place your order. Our team will contact you within 2 hours to confirm order details and arrange delivery.

Thank you for choosing Jadhao Industries!`;

            // Store pending order
            const orderData = {
                id: 'order-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
                items: [...this.cart],
                totals: {
                    subtotal,
                    tax: totalTax,
                    shipping,
                    total: finalTotal
                },
                summary: orderSummary,
                timestamp: new Date().toISOString(),
                status: 'pending_contact'
            };

            localStorage.setItem('pending_order', JSON.stringify(orderData));

            // Redirect to contact page with order info
            const contactUrl = `index.html#contact?order=${orderData.id}&total=${finalTotal}`;
            
            this.showNotification(
                'Redirecting to contact form to complete your order...',
                'info',
                3000
            );

            setTimeout(() => {
                window.location.href = contactUrl;
            }, 2000);

        } catch (error) {
            console.error('Error during checkout:', error);
            this.showNotification('Error processing checkout. Please try again.', 'error');
        }
    }

    // RECOMMENDED PRODUCTS - FULLY WORKING
    loadRecommendedProducts() {
        try {
            const recommendedSection = document.getElementById('recently-viewed');
            const container = document.getElementById('recommended-products');
            
            if (!container || !recommendedSection) return;

            // Get products that are not in cart
            const cartProductIds = this.cart.map(item => item.id);
            const availableProducts = this.products.filter(product => 
                product.status === 'active' && 
                product.stock > 0 && 
                !cartProductIds.includes(product.id)
            );

            if (availableProducts.length === 0) {
                recommendedSection.style.display = 'none';
                return;
            }

            // Show random 4 products
            const selectedProducts = availableProducts
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);

            container.innerHTML = selectedProducts.map(product => {
                const basePrice = product.price || product.originalPrice || 0;
                const discount = product.originalPrice && product.originalPrice > basePrice ? 
                    Math.round(((product.originalPrice - basePrice) / product.originalPrice) * 100) : 0;

                return `
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="product-card">
                            <div class="product-image">
                                <img src="${product.image}" alt="${this.escapeHtml(product.name)}">
                                ${discount > 0 ? `
                                    <div class="position-absolute top-0 end-0 m-2">
                                        <span class="badge bg-danger">-${discount}%</span>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="product-info">
                                <h6 class="product-name">${this.escapeHtml(product.name)}</h6>
                                <div class="product-price">
                                    ₹${basePrice.toLocaleString()}
                                    ${product.originalPrice && product.originalPrice > basePrice ? 
                                        ` <small class="text-muted text-decoration-line-through">₹${product.originalPrice.toLocaleString()}</small>` : ''}
                                </div>
                                <button class="btn-add-cart" onclick="addToCart('${product.id}')">
                                    <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            recommendedSection.style.display = 'block';

        } catch (error) {
            console.error('Error loading recommended products:', error);
        }
    }

    // UTILITY FUNCTIONS
    getDefaultProducts() {
        return [
            {
                id: 'prod-001',
                name: 'Professional Dumbbell Set',
                category: 'dumbbells',
                originalPrice: 30000,
                price: 25000,
                taxPercent: 18,
                taxName: 'GST 18%',
                stock: 15,
                status: 'active',
                description: 'Complete set of rubber-coated dumbbells ranging from 5kg to 50kg.',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0MDcwZjQ7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzQ1NWRkO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2EpIi8+PHRleHQgeD0iMjAwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5EdW1iYmVsbCBTZXQ8L3RleHQ+PC9zdmc+',
                features: ['Rubber Coated', 'Anti-Slip Grip', '5kg-50kg Range', '2 Year Warranty'],
                rating: 4.8,
                reviews: 127
            },
            {
                id: 'prod-002',
                name: 'Multi-Station Gym Machine',
                category: 'machines',
                originalPrice: 95000,
                price: 85000,
                taxPercent: 18,
                taxName: 'GST 18%',
                stock: 8,
                status: 'active',
                description: 'Complete body workout machine with multiple exercise stations.',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxMGI5ODE7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGY3Njc2O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2IpIi8+PHRleHQgeD0iMjAwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5HeW0gTWFjaGluZTwvdGV4dD48L3N2Zz4=',
                features: ['6 Exercise Stations', 'Heavy Duty Steel', 'Smooth Cable System', '5 Year Warranty'],
                rating: 4.9,
                reviews: 89
            }
        ];
    }

    escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&#039;'
        };
        return text.toString().replace(/[&<>"']/g, m => map[m]);
    }

    formatCategory(categoryId) {
        const names = {
            'dumbbells': 'Dumbbells',
            'machines': 'Gym Machines', 
            'racks': 'Power Racks',
            'plates': 'Weight Plates',
            'cardio': 'Cardio Equipment'
        };
        return names[categoryId] || categoryId;
    }

    showError(message) {
        const container = document.querySelector('.cart-container .container');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                        <h4>Error</h4>
                        <p>${message}</p>
                        <button class="btn btn-primary" onclick="location.reload()">
                            <i class="fas fa-sync me-2"></i>Refresh Page
                        </button>
                    </div>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        document.querySelectorAll('.cart-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `cart-notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 100px; right: 20px; z-index: 9999; 
            min-width: 300px; max-width: 400px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            border: none; border-radius: 12px;
        `;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas ${icons[type] || icons.info} me-2 fa-lg"></i>
                <div class="flex-grow-1">${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }
}

// Initialize cart page
const cartPage = new CartPage();

// Global functions for HTML onclick handlers
window.updateQuantity = (id, change) => cartPage.updateQuantity(id, change);
window.removeFromCart = (id) => cartPage.removeFromCart(id);
window.addToCart = (id, qty) => cartPage.addToCart(id, qty);
window.clearCart = () => cartPage.clearCart();
window.proceedToCheckout = () => cartPage.proceedToCheckout();

// Make cart page globally available
window.cartPage = cartPage;

console.log('🛒 Complete Cart Page System Loaded Successfully');

// Add link to cart icon in navbar
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon && !cartIcon.onclick) {
        cartIcon.style.cursor = 'pointer';
        cartIcon.onclick = () => {
            if (window.location.pathname.includes('cart.html')) {
                // Already on cart page, just scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Navigate to cart page
                window.location.href = 'cart.html';
            }
        };
    }
});
