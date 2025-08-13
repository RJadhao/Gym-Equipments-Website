
<!--
Ownership Notice: This file is the intellectual property of Jadhao Industries.
Contact: contact@jadhaoindustries.com
Generated Timestamp (UTC): 2025-08-13T19:10:40.339031
Unique File Signature: 70208b4366057014216b0f5a5142ac13f9bc720e044f370566f8e7ec1caed7ef
Unauthorized use is prohibited under Indian and International Laws.
-->
let editor;
let currentDevice = 'Desktop';
let isLoading = false;
let autoSaveInterval;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!checkAuthentication()) {
        return;
    }
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        initializeEditor();
    }, 100);
    
    // Setup auto-save every 30 seconds
    setupAutoSave();
});

// Check if user is authenticated
function checkAuthentication() {
    try {
        const session = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');
        
        if (!session) {
            showError('Please login first through the admin panel');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 2000);
            return false;
        }

        // Try to decrypt and validate session
        if (window.CryptoJS) {
            try {
                const decryptedBytes = CryptoJS.AES.decrypt(session, 'jadhao-secure-session-key-2025');
                const sessionData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
                
                if (sessionData.expires < Date.now()) {
                    showError('Session expired. Please login again.');
                    localStorage.removeItem('adminSession');
                    sessionStorage.removeItem('adminSession');
                    setTimeout(() => {
                        window.location.href = 'admin.html';
                    }, 2000);
                    return false;
                }
            } catch (decryptError) {
                console.warn('Session validation error:', decryptError);
                // Continue anyway for demo purposes
            }
        }
        
        return true;
    } catch (error) {
        console.warn('Authentication check error:', error);
        return true; // Continue for demo
    }
}

// Initialize GrapesJS Editor
function initializeEditor() {
    try {
        showLoading(true);
        
        editor = grapesjs.init({
            container: '#gjs',
            height: '100%',
            width: 'auto',
            storageManager: false,
            
            // Plugins
            plugins: ['gjs-blocks-basic'],
            pluginsOpts: {
                'gjs-blocks-basic': {}
            },
            
            // Canvas configuration
            canvas: {
                styles: [
                    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
                    'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
                    'css/style.css'
                ],
                scripts: [
                    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
                ]
            },
            
            // Block Manager
            blockManager: {
                appendTo: '.gjs-blocks-c',
                blocks: getCustomBlocks()
            },
            
            // Style Manager
            styleManager: {
                appendTo: '.gjs-sm-c',
                sectors: [
                    {
                        name: 'General',
                        open: false,
                        properties: [
                            'display',
                            'position',
                            'top',
                            'right',
                            'left',
                            'bottom'
                        ]
                    },
                    {
                        name: 'Dimension',
                        open: true,
                        properties: [
                            'width',
                            'height',
                            'max-width',
                            'min-height',
                            'margin',
                            'padding'
                        ]
                    },
                    {
                        name: 'Typography',
                        open: false,
                        properties: [
                            'font-family',
                            'font-size',
                            'font-weight',
                            'letter-spacing',
                            'color',
                            'line-height',
                            'text-align',
                            'text-decoration',
                            'text-shadow'
                        ]
                    },
                    {
                        name: 'Decorations',
                        open: false,
                        properties: [
                            'background-color',
                            'background-image',
                            'border-radius',
                            'border',
                            'box-shadow',
                            'opacity'
                        ]
                    },
                    {
                        name: 'Extra',
                        open: false,
                        properties: [
                            'transition',
                            'perspective',
                            'transform'
                        ]
                    }
                ]
            },
            
            // Layer Manager
            layerManager: {
                appendTo: '.gjs-layers-c'
            },
            
            // Trait Manager
            traitManager: {
                appendTo: '.gjs-traits-c'
            },
            
            // Device Manager
            deviceManager: {
                devices: [
                    {
                        name: 'Desktop',
                        width: '',
                    },
                    {
                        name: 'Tablet',
                        width: '768px',
                        widthMedia: '992px',
                    },
                    {
                        name: 'Mobile',
                        width: '320px',
                        widthMedia: '768px',
                    }
                ]
            },
            
            // Rich Text Editor
            richTextEditor: {
                actions: ['bold', 'italic', 'underline', 'strikethrough', 'link']
            },
            
            // Asset Manager
            assetManager: {
                embedAsBase64: true
            }
        });

        // Load default or saved content
        loadCurrentSite();
        
        // Setup event listeners
        setupEditorEvents();
        
        // Hide loading
        showLoading(false);
        showNotification('Visual editor loaded successfully!', 'success');
        
    } catch (error) {
        console.error('Editor initialization error:', error);
        showLoading(false);
        showNotification('Error loading editor: ' + error.message, 'error');
    }
}

// Get custom blocks for Jadhao Industries
function getCustomBlocks() {
    return [
        // Hero Section Block
        {
            id: 'jadhao-hero',
            label: '🎯 Hero Section',
            category: 'Jadhao Sections',
            content: `
                <section class="hero-section modern-hero" style="min-height: 100vh; background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%); color: white; display: flex; align-items: center;">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-lg-6">
                                <div class="hero-content">
                                    <h1 class="hero-title" style="font-size: 4rem; font-weight: 700; margin-bottom: 1.5rem;">
                                        Premium Gym Equipment by 
                                        <span style="color: #e50914;">Jadhao Industries</span>
                                    </h1>
                                    <p class="hero-subtitle" style="font-size: 1.25rem; color: #b3b3b3; margin-bottom: 2rem;">
                                        Since 1988, manufacturing world-class strength training equipment.
                                    </p>
                                    <div class="hero-actions" style="display: flex; gap: 1rem;">
                                        <a href="#products" class="btn btn-primary" style="background: #e50914; border: none; padding: 1rem 2rem; border-radius: 0.75rem;">
                                            <i class="fas fa-shopping-bag me-2"></i>Shop Now
                                        </a>
                                        <a href="#contact" class="btn btn-outline-light" style="padding: 1rem 2rem; border-radius: 0.75rem;">
                                            <i class="fas fa-phone me-2"></i>Get Quote
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80" 
                                     class="img-fluid rounded-lg shadow-lg" 
                                     alt="Premium Gym Equipment">
                            </div>
                        </div>
                    </div>
                </section>
            `,
            attributes: { class: 'gjs-fonts gjs-f-hero' }
        },
        
        // Product Card Block
        {
            id: 'jadhao-product',
            label: '📦 Product Card',
            category: 'Jadhao Products',
            content: `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="product-card" style="background: #1a1a1a; border-radius: 0.75rem; overflow: hidden; border: 1px solid #333; transition: all 0.3s;">
                        <div class="product-image" style="height: 300px; overflow: hidden; position: relative;">
                            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80" 
                                 style="width: 100%; height: 100%; object-fit: cover;" 
                                 alt="Product">
                            <div class="product-badge" style="position: absolute; top: 1rem; left: 1rem; background: #28a745; color: white; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 700;">
                                NEW
                            </div>
                        </div>
                        <div class="product-content" style="padding: 1.5rem;">
                            <h5 class="product-title" style="color: white; font-weight: 600; margin-bottom: 0.5rem;">Professional Dumbbell Set</h5>
                            <p class="product-description" style="color: #737373; margin-bottom: 1.5rem;">Complete set of rubber-coated dumbbells ranging from 5kg to 50kg.</p>
                            <div class="product-footer" style="display: flex; justify-content: space-between; align-items: center;">
                                <div class="product-price">
                                    <span class="price-current" style="font-size: 1.5rem; font-weight: 700; color: #e50914;">₹25,000</span>
                                    <span class="price-original" style="font-size: 1rem; color: #737373; text-decoration: line-through;">₹30,000</span>
                                </div>
                                <button class="btn btn-primary add-to-cart-btn" 
                                        style="background: #e50914; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem;"
                                        data-id="product-1" 
                                        data-name="Professional Dumbbell Set" 
                                        data-price="25000">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            attributes: { class: 'gjs-fonts gjs-f-product' }
        },
        
        // Services Section Block
        {
            id: 'jadhao-services',
            label: '🔧 Services Section',
            category: 'Jadhao Sections',
            content: `
                <section class="services-section py-5" style="background: #2a2a2a;">
                    <div class="container">
                        <div class="text-center mb-5">
                            <h2 style="color: white; font-size: 3rem; font-weight: 700; margin-bottom: 1rem;">Our Services</h2>
                            <p style="color: #b3b3b3; font-size: 1.25rem;">Complete fitness solutions beyond just equipment</p>
                        </div>
                        <div class="row">
                            <div class="col-lg-4 col-md-6 mb-4">
                                <div class="service-card" style="background: #1a1a1a; padding: 2rem; border-radius: 0.75rem; text-align: center; border: 1px solid #333; transition: all 0.3s;">
                                    <div class="service-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #e50914, #b20710); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                                        <i class="fas fa-tools" style="font-size: 2rem; color: white;"></i>
                                    </div>
                                    <h4 style="color: white; margin-bottom: 1rem;">Equipment Installation</h4>
                                    <p style="color: #737373;">Professional installation and setup with proper calibration and safety checks.</p>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 mb-4">
                                <div class="service-card" style="background: #1a1a1a; padding: 2rem; border-radius: 0.75rem; text-align: center; border: 1px solid #333; transition: all 0.3s;">
                                    <div class="service-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #e50914, #b20710); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                                        <i class="fas fa-wrench" style="font-size: 2rem; color: white;"></i>
                                    </div>
                                    <h4 style="color: white; margin-bottom: 1rem;">Maintenance & Repair</h4>
                                    <p style="color: #737373;">Regular maintenance services and quick repair solutions.</p>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 mb-4">
                                <div class="service-card" style="background: #1a1a1a; padding: 2rem; border-radius: 0.75rem; text-align: center; border: 1px solid #333; transition: all 0.3s;">
                                    <div class="service-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #e50914, #b20710); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                                        <i class="fas fa-dumbbell" style="font-size: 2rem; color: white;"></i>
                                    </div>
                                    <h4 style="color: white; margin-bottom: 1rem;">Gym Setup Consultation</h4>
                                    <p style="color: #737373;">Complete gym layout planning and equipment selection.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            attributes: { class: 'gjs-fonts gjs-f-services' }
        },
        
        // About Section Block
        {
            id: 'jadhao-about',
            label: '📋 About Section',
            category: 'Jadhao Sections',
            content: `
                <section class="about-section py-5" style="background: #2a2a2a;">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-lg-6">
                                <h2 style="color: white; font-size: 3rem; font-weight: 700; margin-bottom: 1.5rem;">About Jadhao Industries</h2>
                                <p style="color: #b3b3b3; font-size: 1.25rem; margin-bottom: 1rem;">Established in 1988, Jadhao Industries has been a trusted name in manufacturing premium health and gym equipment.</p>
                                <p style="color: #737373; margin-bottom: 2rem;">Under the leadership of <strong style="color: white;">Mr. Nitin M. Jadhao</strong>, our company has grown from a small operation to become one of India's leading manufacturers of strength training equipment.</p>
                                <div class="about-highlights">
                                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; color: #b3b3b3;">
                                        <i class="fas fa-check-circle" style="color: #28a745; font-size: 1.2rem;"></i>
                                        <span>37+ Years of Excellence</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; color: #b3b3b3;">
                                        <i class="fas fa-check-circle" style="color: #28a745; font-size: 1.2rem;"></i>
                                        <span>10,000+ Happy Customers</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; color: #b3b3b3;">
                                        <i class="fas fa-check-circle" style="color: #28a745; font-size: 1.2rem;"></i>
                                        <span>ISO Certified Manufacturing</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80" 
                                     alt="Jadhao Industries Factory" 
                                     class="img-fluid rounded-lg shadow-lg">
                            </div>
                        </div>
                    </div>
                </section>
            `,
            attributes: { class: 'gjs-fonts gjs-f-about' }
        },
        
        // Contact Form Block
        {
            id: 'jadhao-contact',
            label: '📧 Contact Form',
            category: 'Jadhao Forms',
            content: `
                <section class="contact-section py-5" style="background: #2a2a2a;">
                    <div class="container">
                        <div class="text-center mb-5">
                            <h2 style="color: white; font-size: 3rem; font-weight: 700; margin-bottom: 1rem;">Get In Touch</h2>
                            <p style="color: #b3b3b3; font-size: 1.25rem;">Ready to transform your fitness space? Contact us today!</p>
                        </div>
                        <div class="row">
                            <div class="col-lg-8 mx-auto">
                                <div style="background: #1a1a1a; padding: 2rem; border-radius: 0.75rem; border: 1px solid #333;">
                                    <form class="row g-3">
                                        <div class="col-md-6">
                                            <label style="color: white; font-weight: 500; margin-bottom: 0.5rem; display: block;">Full Name *</label>
                                            <input type="text" style="background: #2a2a2a; border: 2px solid #333; color: white; border-radius: 0.5rem; padding: 1rem; width: 100%;" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label style="color: white; font-weight: 500; margin-bottom: 0.5rem; display: block;">Email Address *</label>
                                            <input type="email" style="background: #2a2a2a; border: 2px solid #333; color: white; border-radius: 0.5rem; padding: 1rem; width: 100%;" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label style="color: white; font-weight: 500; margin-bottom: 0.5rem; display: block;">Phone Number *</label>
                                            <input type="tel" style="background: #2a2a2a; border: 2px solid #333; color: white; border-radius: 0.5rem; padding: 1rem; width: 100%;" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label style="color: white; font-weight: 500; margin-bottom: 0.5rem; display: block;">Subject</label>
                                            <select style="background: #2a2a2a; border: 2px solid #333; color: white; border-radius: 0.5rem; padding: 1rem; width: 100%;">
                                                <option>General Inquiry</option>
                                                <option>Product Quote</option>
                                                <option>Installation Service</option>
                                            </select>
                                        </div>
                                        <div class="col-12">
                                            <label style="color: white; font-weight: 500; margin-bottom: 0.5rem; display: block;">Message *</label>
                                            <textarea style="background: #2a2a2a; border: 2px solid #333; color: white; border-radius: 0.5rem; padding: 1rem; width: 100%; min-height: 120px;" required></textarea>
                                        </div>
                                        <div class="col-12 text-center">
                                            <button type="submit" style="background: #e50914; color: white; border: none; padding: 1rem 2rem; border-radius: 0.5rem; font-size: 1.1rem; font-weight: 600;">
                                                <i class="fas fa-paper-plane me-2"></i>Send Message
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            attributes: { class: 'gjs-fonts gjs-f-contact' }
        },
        
        // Testimonial Block
        {
            id: 'jadhao-testimonial',
            label: '💬 Testimonial',
            category: 'Jadhao Content',
            content: `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div style="background: #1a1a1a; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #333; height: 100%;">
                        <div style="display: flex; gap: 0.25rem; margin-bottom: 1rem;">
                            <i class="fas fa-star" style="color: #ffd700; font-size: 1.2rem;"></i>
                            <i class="fas fa-star" style="color: #ffd700; font-size: 1.2rem;"></i>
                            <i class="fas fa-star" style="color: #ffd700; font-size: 1.2rem;"></i>
                            <i class="fas fa-star" style="color: #ffd700; font-size: 1.2rem;"></i>
                            <i class="fas fa-star" style="color: #ffd700; font-size: 1.2rem;"></i>
                        </div>
                        <p style="color: #b3b3b3; font-style: italic; margin-bottom: 1.5rem; line-height: 1.6;">"Excellent quality equipment! We've been using Jadhao Industries equipment for over 5 years. Durable and reliable."</p>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="width: 50px; height: 50px; background: #e50914; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <strong style="color: white; font-weight: 600; display: block;">Rahul Sharma</strong>
                                <span style="color: #737373; font-size: 0.9rem;">Fitness Plus Gym</span>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            attributes: { class: 'gjs-fonts gjs-f-testimonial' }
        },
        
        // Basic Bootstrap Components
        {
            id: 'bs-container',
            label: '📦 Container',
            category: 'Bootstrap',
            content: '<div class="container" style="color: white; padding: 2rem;"><p>Container content here. Add your content inside this container.</p></div>',
            attributes: { class: 'gjs-fonts gjs-f-container' }
        },
        
        {
            id: 'bs-row',
            label: '📊 Row',
            category: 'Bootstrap',
            content: '<div class="row"><div class="col" style="color: white; padding: 1rem; background: #1a1a1a; border-radius: 0.5rem; border: 1px solid #333;"><p>Column content here</p></div></div>',
            attributes: { class: 'gjs-fonts gjs-f-row' }
        },
        
        {
            id: 'bs-button',
            label: '🔘 Button',
            category: 'Bootstrap',
            content: '<button class="btn" style="background: #e50914; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600;">Click Me</button>',
            attributes: { class: 'gjs-fonts gjs-f-button' }
        },
        
        {
            id: 'text-block',
            label: '📝 Text Block',
            category: 'Basic',
            content: '<div style="color: white; padding: 1rem;"><h3>Heading Text</h3><p>Your paragraph text goes here. Edit this text to add your own content.</p></div>',
            attributes: { class: 'gjs-fonts gjs-f-text' }
        },
        
        {
            id: 'image-block',
            label: '🖼️ Image',
            category: 'Basic',
            content: '<div style="text-align: center; padding: 1rem;"><img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80" alt="Image" style="max-width: 100%; border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>',
            attributes: { class: 'gjs-fonts gjs-f-image' }
        }
    ];
}

// Setup editor events
function setupEditorEvents() {
    // Listen for changes
    editor.on('component:update', () => {
        showSaveStatus('unsaved');
    });
    
    editor.on('style:update', () => {
        showSaveStatus('unsaved');
    });
    
    // Listen for selection changes
    editor.on('component:selected', (component) => {
        console.log('Selected component:', component.get('tagName'));
    });
}

// Load current site content
function loadCurrentSite() {
    try {
        const savedHtml = localStorage.getItem('jadhao_site_html');
        const savedCss = localStorage.getItem('jadhao_site_css');
        
        if (savedHtml && savedHtml.trim() !== '') {
            editor.setComponents(savedHtml);
            showNotification('Saved content loaded successfully!', 'success');
        } else {
            // Load default content
            const defaultContent = getDefaultContent();
            editor.setComponents(defaultContent);
            showNotification('Default content loaded', 'info');
        }
        
        if (savedCss && savedCss.trim() !== '') {
            editor.setStyle(savedCss);
        } else {
            const defaultStyles = getDefaultStyles();
            editor.setStyle(defaultStyles);
        }
        
        showSaveStatus('saved');
        
    } catch (error) {
        console.error('Load error:', error);
        showNotification('Error loading content: ' + error.message, 'error');
        
        // Fallback to default content
        const defaultContent = getDefaultContent();
        const defaultStyles = getDefaultStyles();
        editor.setComponents(defaultContent);
        editor.setStyle(defaultStyles);
    }
}

// Get default content
function getDefaultContent() {
    return `
        <div class="page-content">
            <!-- Navigation -->
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top modern-nav" style="backdrop-filter: blur(10px); background: rgba(15, 15, 15, 0.95) !important; border-bottom: 1px solid #333;">
                <div class="container">
                    <a class="navbar-brand brand-logo" href="#" style="font-size: 1.5rem; font-weight: 700; color: white;">
                        <strong>Jadhao Industries</strong>
                    </a>
                    <div class="navbar-nav ms-auto" style="display: flex; gap: 1rem;">
                        <a class="nav-link" href="#home" style="color: #b3b3b3;">Home</a>
                        <a class="nav-link" href="#products" style="color: #b3b3b3;">Products</a>
                        <a class="nav-link" href="#services" style="color: #b3b3b3;">Services</a>
                        <a class="nav-link" href="#about" style="color: #b3b3b3;">About</a>
                        <a class="nav-link" href="#contact" style="color: #b3b3b3;">Contact</a>
                    </div>
                </div>
            </nav>

            <!-- Hero Section -->
            <section id="home" class="hero-section modern-hero" style="min-height: 100vh; background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%); color: white; display: flex; align-items: center; padding-top: 56px;">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-6">
                            <div class="hero-content">
                                <h1 class="hero-title" style="font-size: 4rem; font-weight: 700; margin-bottom: 1.5rem; line-height: 1.1;">
                                    Premium Gym Equipment by 
                                    <span style="color: #e50914;">Jadhao Industries</span>
                                </h1>
                                <p class="hero-subtitle" style="font-size: 1.25rem; color: #b3b3b3; margin-bottom: 2rem; line-height: 1.6;">
                                    Since 1988, we've been manufacturing world-class strength training equipment. Transform your fitness journey with our durable equipment.
                                </p>
                                <div class="hero-actions" style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                                    <a href="#products" class="btn btn-primary" style="background: linear-gradient(135deg, #e50914, #b20710); border: none; padding: 1rem 2rem; border-radius: 0.75rem; color: white; text-decoration: none; font-weight: 600;">
                                        <i class="fas fa-shopping-bag me-2"></i>Shop Now
                                    </a>
                                    <a href="#contact" class="btn btn-outline-light" style="border: 2px solid #b3b3b3; color: white; padding: 1rem 2rem; border-radius: 0.75rem; text-decoration: none; font-weight: 600;">
                                        <i class="fas fa-phone me-2"></i>Get Quote
                                    </a>
                                </div>
                                <div class="hero-stats" style="display: flex; gap: 2rem;">
                                    <div class="stat-item" style="text-align: center;">
                                        <span style="display: block; font-size: 2.5rem; font-weight: 700; color: #e50914; line-height: 1;">37+</span>
                                        <span style="display: block; font-size: 0.9rem; color: #737373; text-transform: uppercase; letter-spacing: 1px;">Years</span>
                                    </div>
                                    <div class="stat-item" style="text-align: center;">
                                        <span style="display: block; font-size: 2.5rem; font-weight: 700; color: #e50914; line-height: 1;">10K+</span>
                                        <span style="display: block; font-size: 0.9rem; color: #737373; text-transform: uppercase; letter-spacing: 1px;">Customers</span>
                                    </div>
                                    <div class="stat-item" style="text-align: center;">
                                        <span style="display: block; font-size: 2.5rem; font-weight: 700; color: #e50914; line-height: 1;">50+</span>
                                        <span style="display: block; font-size: 0.9rem; color: #737373; text-transform: uppercase; letter-spacing: 1px;">Products</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="hero-visual" style="position: relative;">
                                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80" 
                                     class="hero-image" 
                                     style="width: 100%; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);"
                                     alt="Premium Gym Equipment">
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Products Section -->
            <section id="products" class="py-5 products-section" style="background: #0f0f0f;">
                <div class="container">
                    <div class="text-center mb-5">
                        <h2 style="color: white; font-size: 3rem; font-weight: 700; margin-bottom: 1rem;">Our Products</h2>
                        <p style="color: #b3b3b3; font-size: 1.25rem;">Professional-grade equipment for serious fitness enthusiasts</p>
                    </div>
                    
                    <div class="row">
                        <div class="col-lg-4 col-md-6 mb-4">
                            <div class="product-card" style="background: #1a1a1a; border-radius: 0.75rem; overflow: hidden; border: 1px solid #333; transition: all 0.3s;">
                                <div style="height: 300px; overflow: hidden; position: relative;">
                                    <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80" 
                                         style="width: 100%; height: 100%; object-fit: cover;" 
                                         alt="Dumbbells">
                                </div>
                                <div style="padding: 1.5rem;">
                                    <h5 style="color: white; font-weight: 600; margin-bottom: 0.5rem;">Professional Dumbbell Set</h5>
                                    <p style="color: #737373; margin-bottom: 1.5rem;">Complete set of rubber-coated dumbbells ranging from 5kg to 50kg.</p>
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 1.5rem; font-weight: 700; color: #e50914;">₹25,000</span>
                                        <button style="background: #e50914; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; color: white; font-weight: 600;">Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
}

// Get default styles
function getDefaultStyles() {
    return `
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f0f0f;
            color: #b3b3b3;
        }
        
        .hero-section {
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%) !important;
        }
        
        .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 25px -5px rgba(229, 9, 20, 0.3);
            border-color: #e50914;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(229, 9, 20, 0.3);
        }
        
        .nav-link:hover {
            color: #e50914 !important;
        }
        
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem !important;
            }
            
            .hero-stats {
                justify-content: center;
            }
            
            .hero-actions {
                flex-direction: column;
            }
        }
    `;
}

// Save site content
function saveSite() {
    if (isLoading) return;
    
    try {
        isLoading = true;
        showSaveStatus('saving');
        
        const html = editor.getHtml();
        const css = editor.getCss();
        
        if (!html || html.trim() === '') {
            showNotification('No content to save', 'warning');
            isLoading = false;
            return;
        }
        
        // Save with new keys to avoid conflicts
        localStorage.setItem('jadhao_site_html', html);
        localStorage.setItem('jadhao_site_css', css);
        localStorage.setItem('jadhao_site_updated', new Date().toISOString());
        
        // Also save to the main site storage for integration
        localStorage.setItem('site_html', html);
        localStorage.setItem('site_css', css);
        
        showSaveStatus('saved');
        showNotification('Site saved successfully! Changes will appear on the live site.', 'success');
        
        console.log('Content saved:', {
            htmlLength: html.length,
            cssLength: css.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Save error:', error);
        showSaveStatus('error');
        showNotification('Error saving site: ' + error.message, 'error');
    } finally {
        isLoading = false;
    }
}

// Preview site in new window
function previewSite() {
    try {
        const html = editor.getHtml();
        const css = editor.getCss();
        
        if (!html || html.trim() === '') {
            showNotification('No content to preview', 'warning');
            return;
        }
        
        const fullHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview - Jadhao Industries</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
                <style>
                    ${css}
                    
                    /* Additional preview styles */
                    body { margin: 0; padding: 0; }
                    .hero-section { margin-top: 0 !important; }
                    
                    /* Smooth scrolling */
                    html { scroll-behavior: smooth; }
                    
                    /* Button hover effects */
                    .btn:hover {
                        transform: translateY(-2px);
                        transition: all 0.3s ease;
                    }
                </style>
            </head>
            <body>
                ${html}
                
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                <script>
                    // Basic functionality for preview
                    document.addEventListener('DOMContentLoaded', function() {
                        // Smooth scrolling for navigation links
                        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                            anchor.addEventListener('click', function(e) {
                                e.preventDefault();
                                const targetId = this.getAttribute('href');
                                const target = document.querySelector(targetId);
                                if (target) {
                                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            });
                        });
                        
                        // Add to cart button functionality
                        document.querySelectorAll('button').forEach(btn => {
                            if (btn.textContent.includes('Add to Cart')) {
                                btn.addEventListener('click', function() {
                                    this.textContent = 'Added!';
                                    this.style.background = '#28a745';
                                    setTimeout(() => {
                                        this.textContent = 'Add to Cart';
                                        this.style.background = '#e50914';
                                    }, 2000);
                                });
                            }
                        });
                        
                        // Form submission
                        document.querySelectorAll('form').forEach(form => {
                            form.addEventListener('submit', function(e) {
                                e.preventDefault();
                                alert('Form submitted! (This is a preview)');
                            });
                        });
                    });
                </script>
            </body>
            </html>
        `;
        
        const previewWindow = window.open('', '_blank', 'width=1200,height=800');
        previewWindow.document.write(fullHTML);
        previewWindow.document.close();
        
        showNotification('Preview opened in new tab with full functionality!', 'success');
        
    } catch (error) {
        console.error('Preview error:', error);
        showNotification('Error creating preview: ' + error.message, 'error');
    }
}

// Export code as downloadable file
function exportCode() {
    try {
        const html = editor.getHtml();
        const css = editor.getCss();
        
        if (!html || html.trim() === '') {
            showNotification('No content to export', 'warning');
            return;
        }
        
        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jadhao Industries - Premium Gym Equipment</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
${css}
    </style>
</head>
<body>
${html}
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
</body>
</html>`;
        
        // Create and download file
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jadhao-industries-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('HTML file exported successfully!', 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting code: ' + error.message, 'error');
    }
}

// Device management
function setDevice(device) {
    if (!editor) return;
    
    try {
        editor.setDevice(device);
        currentDevice = device;
        
        // Update button states
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const deviceBtn = document.getElementById(`${device.toLowerCase()}-btn`);
        if (deviceBtn) {
            deviceBtn.classList.add('active');
        }
        
        showNotification(`Switched to ${device} view`, 'info');
    } catch (error) {
        console.error('Device switch error:', error);
    }
}

// Auto-save functionality
function setupAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (editor && !isLoading) {
            const saveStatus = document.getElementById('save-status');
            if (saveStatus && !saveStatus.textContent.includes('Saved')) {
                saveSiteAuto();
            }
        }
    }, 30000); // Auto-save every 30 seconds
}

function saveSiteAuto() {
    try {
        const html = editor.getHtml();
        const css = editor.getCss();
        
        if (html && html.trim() !== '') {
            localStorage.setItem('jadhao_site_html_backup', html);
            localStorage.setItem('jadhao_site_css_backup', css);
            localStorage.setItem('jadhao_site_autosave', new Date().toISOString());
            console.log('Auto-saved at:', new Date().toLocaleTimeString());
        }
    } catch (error) {
        console.warn('Auto-save error:', error);
    }
}

// Show save status
function showSaveStatus(status) {
    const saveStatusEl = document.getElementById('save-status');
    if (!saveStatusEl) return;
    
    saveStatusEl.style.display = 'block';
    
    switch (status) {
        case 'saving':
            saveStatusEl.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Saving...';
            saveStatusEl.style.background = 'rgba(255, 193, 7, 0.1)';
            saveStatusEl.style.borderColor = 'rgba(255, 193, 7, 0.3)';
            saveStatusEl.style.color = '#ffc107';
            break;
        case 'saved':
            saveStatusEl.innerHTML = '<i class="fas fa-check-circle me-1"></i>Saved';
            saveStatusEl.style.background = 'rgba(40, 167, 69, 0.1)';
            saveStatusEl.style.borderColor = 'rgba(40, 167, 69, 0.3)';
            saveStatusEl.style.color = '#28a745';
            break;
        case 'unsaved':
            saveStatusEl.innerHTML = '<i class="fas fa-exclamation-circle me-1"></i>Unsaved';
            saveStatusEl.style.background = 'rgba(229, 9, 20, 0.1)';
            saveStatusEl.style.borderColor = 'rgba(229, 9, 20, 0.3)';
            saveStatusEl.style.color = '#e50914';
            break;
        case 'error':
            saveStatusEl.innerHTML = '<i class="fas fa-times-circle me-1"></i>Error';
            saveStatusEl.style.background = 'rgba(220, 53, 69, 0.1)';
            saveStatusEl.style.borderColor = 'rgba(220, 53, 69, 0.3)';
            saveStatusEl.style.color = '#dc3545';
            break;
    }
}

// Show loading state
function showLoading(show) {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// Show notifications
function showNotification(message, type = 'info') {
    try {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        // Remove existing notifications
        container.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        const bgColor = {
            success: 'alert-success',
            error: 'alert-danger',
            info: 'alert-info',
            warning: 'alert-warning'
        }[type] || 'alert-info';
        
        const iconClass = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        }[type] || 'fa-info-circle';
        
        notification.className = `alert ${bgColor} notification d-flex align-items-center`;
        notification.innerHTML = `
            <i class="fas ${iconClass} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.remove()"></button>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

function showError(message) {
    showNotification(message, 'error');
}

// Handle page unload - save automatically
window.addEventListener('beforeunload', function(e) {
    if (editor && !isLoading) {
        try {
            const html = editor.getHtml();
            const css = editor.getCss();
            if (html && html.trim() !== '') {
                localStorage.setItem('jadhao_site_html_emergency', html);
                localStorage.setItem('jadhao_site_css_emergency', css);
            }
        } catch (error) {
            console.warn('Emergency save failed:', error);
        }
    }
    
    // Clear auto-save interval
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 's':
                e.preventDefault();
                saveSite();
                break;
            case 'p':
                e.preventDefault();
                previewSite();
                break;
            case 'e':
                e.preventDefault();
                exportCode();
                break;
        }
    }
});

// Expose functions globally
window.loadCurrentSite = loadCurrentSite;
window.saveSite = saveSite;
window.previewSite = previewSite;
window.exportCode = exportCode;
window.setDevice = setDevice;

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('Admin Builder initialized successfully');
aveSite();
                break;
            case 'p':
                e.preventDefault();
                previewSite();
                break;
            case 'e':
                e.preventDefault();
                exportCode();
                break;
        }
    }
});

// Expose functions globally
window.loadCurrentSite = loadCurrentSite;
window.saveSite = saveSite;
window.previewSite = previewSite;
window.exportCode = exportCode;
window.setDevice = setDevice;

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('Admin Builder initialized successfully');
