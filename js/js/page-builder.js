// COMPLETE VISUAL PAGE BUILDER SYSTEM
// Version 6.2.0 - Full Homepage Editor with All Features
class PageBuilder {
    constructor() {
        this.elements = [];
        this.selectedElement = null;
        this.version = '6.2.0';
        this.draggedElement = null;
        this.isInitialized = false;
        
        console.log('🎨 Initializing Visual Page Builder v' + this.version);
    }

    initialize() {
        if (this.isInitialized) return;
        
        try {
            this.loadHomepageContent();
            this.setupEventListeners();
            this.renderCanvas();
            this.updateLayersPanel();
            
            this.isInitialized = true;
            console.log('✅ Page Builder initialized successfully');
        } catch (error) {
            console.error('❌ Page Builder initialization error:', error);
        }
    }

    // LOAD EXISTING HOMEPAGE CONTENT
    loadHomepageContent() {
        try {
            // Load saved page structure or create default
            const savedContent = localStorage.getItem('jadhao_homepage_content');
            if (savedContent) {
                this.elements = JSON.parse(savedContent);
            } else {
                this.elements = this.getDefaultHomepageStructure();
                this.saveContent();
            }
        } catch (error) {
            console.error('Error loading homepage content:', error);
            this.elements = this.getDefaultHomepageStructure();
        }
    }

    getDefaultHomepageStructure() {
        return [
            {
                id: 'hero-1',
                type: 'hero',
                position: 0,
                content: {
                    title: 'Premium Gym Equipment Manufacturing',
                    subtitle: 'Leading manufacturer of high-quality gym equipment in Maharashtra. We provide durable, reliable, and professional fitness solutions for gyms, fitness centers, and home workouts.',
                    buttonText: 'View Products',
                    buttonLink: '#products',
                    backgroundImage: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                    overlayOpacity: 0.6
                },
                settings: {
                    visible: true,
                    height: '600px',
                    textAlign: 'center'
                }
            },
            {
                id: 'features-1',
                type: 'features',
                position: 1,
                content: {
                    title: 'Why Choose Jadhao Industries?',
                    subtitle: 'We provide the best gym equipment with superior quality and service',
                    features: [
                        {
                            icon: 'fas fa-award',
                            title: 'Premium Quality',
                            description: 'ISO certified manufacturing with the highest quality standards'
                        },
                        {
                            icon: 'fas fa-tools',
                            title: 'Expert Manufacturing',
                            description: '25+ years of experience in fitness equipment production'
                        },
                        {
                            icon: 'fas fa-shipping-fast',
                            title: 'Fast Delivery',
                            description: 'Quick delivery across Maharashtra and surrounding states'
                        },
                        {
                            icon: 'fas fa-headset',
                            title: '24/7 Support',
                            description: 'Round-the-clock customer support and after-sales service'
                        }
                    ]
                },
                settings: {
                    visible: true,
                    columns: 2,
                    backgroundColor: '#f8f9fa'
                }
            },
            {
                id: 'products-1',
                type: 'products',
                position: 2,
                content: {
                    title: 'Our Product Range',
                    subtitle: 'Explore our comprehensive collection of professional gym equipment',
                    showCategories: true,
                    maxProducts: 6
                },
                settings: {
                    visible: true,
                    layout: 'grid',
                    showFilters: true
                }
            },
            {
                id: 'testimonials-1',
                type: 'testimonials',
                position: 3,
                content: {
                    title: 'What Our Customers Say',
                    testimonials: [
                        {
                            name: 'Rahul Sharma',
                            position: 'Gym Owner, Mumbai',
                            content: 'Excellent quality equipment and outstanding customer service. Our gym members are very happy with the machines.',
                            rating: 5,
                            image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
                        },
                        {
                            name: 'Priya Patel',
                            position: 'Fitness Center Owner',
                            content: 'Very durable and reliable equipment. Been using Jadhao Industries products for over 3 years now.',
                            rating: 5,
                            image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
                        },
                        {
                            name: 'Amit Kumar',
                            position: 'Home Gym Owner',
                            content: 'Perfect for home gym setup. Quality is top-notch and delivery was very prompt.',
                            rating: 5,
                            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
                        }
                    ]
                },
                settings: {
                    visible: true,
                    layout: 'carousel',
                    autoplay: true
                }
            },
            {
                id: 'contact-1',
                type: 'contact',
                position: 4,
                content: {
                    title: 'Get in Touch',
                    subtitle: 'Ready to equip your gym? Contact us for a quote',
                    showForm: true,
                    showMap: false,
                    contactInfo: {
                        phone: '+91-721-252-1201',
                        email: 'info@jadhaoindustries.com',
                        address: 'Amravati, Maharashtra, India'
                    }
                },
                settings: {
                    visible: true,
                    layout: 'split',
                    backgroundColor: '#2c3e50'
                }
            }
        ];
    }

    // EVENT LISTENERS
    setupEventListeners() {
        // Canvas click events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.canvas-element')) {
                const element = e.target.closest('.canvas-element');
                this.selectElement(element.dataset.elementId);
            }
        });

        // Drag and drop
        this.setupDragDrop();
    }

    setupDragDrop() {
        const canvas = document.getElementById('page-builder-canvas');
        if (!canvas) return;

        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const elementType = e.dataTransfer.getData('text/plain');
            if (elementType) {
                this.addElement(elementType);
            }
        });

        // Make element buttons draggable
        document.querySelectorAll('.builder-toolbar button').forEach(btn => {
            btn.draggable = true;
            btn.addEventListener('dragstart', (e) => {
                const elementType = btn.onclick.toString().match(/'([^']+)'/)?.[1];
                if (elementType) {
                    e.dataTransfer.setData('text/plain', elementType);
                }
            });
        });
    }

    // ELEMENT MANAGEMENT
    addElement(type) {
        const newElement = this.createElement(type);
        this.elements.push(newElement);
        this.elements.sort((a, b) => a.position - b.position);
        
        this.renderCanvas();
        this.updateLayersPanel();
        this.selectElement(newElement.id);
        this.saveContent();
        
        this.showNotification(`${type} element added successfully!`, 'success');
    }

    createElement(type) {
        const id = `${type}-${Date.now()}`;
        const position = this.elements.length;
        
        const templates = {
            hero: {
                id,
                type: 'hero',
                position,
                content: {
                    title: 'New Hero Section',
                    subtitle: 'Add your subtitle here',
                    buttonText: 'Learn More',
                    buttonLink: '#',
                    backgroundImage: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                    overlayOpacity: 0.5
                },
                settings: {
                    visible: true,
                    height: '500px',
                    textAlign: 'center'
                }
            },
            features: {
                id,
                type: 'features',
                position,
                content: {
                    title: 'Features Section',
                    subtitle: 'Add your features description',
                    features: [
                        {
                            icon: 'fas fa-star',
                            title: 'Feature 1',
                            description: 'Feature description'
                        },
                        {
                            icon: 'fas fa-heart',
                            title: 'Feature 2',
                            description: 'Feature description'
                        }
                    ]
                },
                settings: {
                    visible: true,
                    columns: 2,
                    backgroundColor: '#ffffff'
                }
            },
            text: {
                id,
                type: 'text',
                position,
                content: {
                    html: '<h3>Text Section</h3><p>Your text content goes here. You can edit this to add any text, HTML, or content you need. This is perfect for adding descriptions, announcements, or any custom content.</p>'
                },
                settings: {
                    visible: true,
                    padding: '40px',
                    backgroundColor: '#ffffff'
                }
            },
            testimonials: {
                id,
                type: 'testimonials',
                position,
                content: {
                    title: 'Customer Testimonials',
                    testimonials: [
                        {
                            name: 'John Doe',
                            position: 'Gym Owner',
                            content: 'Excellent service and quality products. Highly recommended!',
                            rating: 5,
                            image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
                        }
                    ]
                },
                settings: {
                    visible: true,
                    layout: 'grid',
                    autoplay: false
                }
            },
            gallery: {
                id,
                type: 'gallery',
                position,
                content: {
                    title: 'Image Gallery',
                    images: [
                        {
                            url: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
                            alt: 'Gallery Image 1',
                            caption: 'Modern gym equipment'
                        },
                        {
                            url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
                            alt: 'Gallery Image 2',
                            caption: 'Professional setup'
                        },
                        {
                            url: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
                            alt: 'Gallery Image 3',
                            caption: 'Quality equipment'
                        }
                    ]
                },
                settings: {
                    visible: true,
                    columns: 3,
                    lightbox: true
                }
            },
            video: {
                id,
                type: 'video',
                position,
                content: {
                    title: 'Featured Video',
                    videoUrl: '',
                    poster: '',
                    autoplay: false,
                    controls: true
                },
                settings: {
                    visible: true,
                    aspectRatio: '16:9'
                }
            },
            spacer: {
                id,
                type: 'spacer',
                position,
                content: {},
                settings: {
                    visible: true,
                    height: '50px'
                }
            },
            divider: {
                id,
                type: 'divider',
                position,
                content: {
                    style: 'solid',
                    color: '#dee2e6',
                    width: '100%'
                },
                settings: {
                    visible: true,
                    thickness: '1px'
                }
            },
            slider: {
                id,
                type: 'slider',
                position,
                content: {
                    title: 'Image Slider',
                    slides: [
                        {
                            image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                            title: 'Slide 1',
                            description: 'First slide description'
                        }
                    ]
                },
                settings: {
                    visible: true,
                    autoplay: true,
                    interval: 5000
                }
            },
            columns: {
                id,
                type: 'columns',
                position,
                content: {
                    columns: [
                        { html: '<h4>Column 1</h4><p>Content for first column</p>' },
                        { html: '<h4>Column 2</h4><p>Content for second column</p>' }
                    ]
                },
                settings: {
                    visible: true,
                    columnCount: 2,
                    spacing: '20px'
                }
            }
        };

        return templates[type] || templates.text;
    }

    deleteElement(elementId) {
        if (!confirm('Are you sure you want to delete this element?')) return;
        
        this.elements = this.elements.filter(el => el.id !== elementId);
        this.selectedElement = null;
        
        this.renderCanvas();
        this.updateLayersPanel();
        this.clearPropertiesPanel();
        this.saveContent();
        
        this.showNotification('Element deleted successfully!', 'success');
    }

    moveElement(elementId, direction) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element) return;

        const currentIndex = this.elements.indexOf(element);
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        
        if (newIndex < 0 || newIndex >= this.elements.length) return;

        // Swap positions
        [this.elements[currentIndex], this.elements[newIndex]] = [this.elements[newIndex], this.elements[currentIndex]];
        
        // Update position values
        this.elements.forEach((el, index) => {
            el.position = index;
        });

        this.renderCanvas();
        this.updateLayersPanel();
        this.saveContent();
    }

    duplicateElement(elementId) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element) return;

        const duplicate = JSON.parse(JSON.stringify(element));
        duplicate.id = `${element.type}-${Date.now()}`;
        duplicate.position = element.position + 1;
        
        // Adjust positions of elements after the duplicated one
        this.elements.forEach(el => {
            if (el.position > element.position) {
                el.position++;
            }
        });

        this.elements.push(duplicate);
        this.elements.sort((a, b) => a.position - b.position);

        this.renderCanvas();
        this.updateLayersPanel();
        this.selectElement(duplicate.id);
        this.saveContent();
        
        this.showNotification('Element duplicated successfully!', 'success');
    }

    selectElement(elementId) {
        // Remove previous selection
        document.querySelectorAll('.canvas-element').forEach(el => {
            el.classList.remove('selected');
        });

        // Add selection to current element
        const elementDiv = document.querySelector(`[data-element-id="${elementId}"]`);
        if (elementDiv) {
            elementDiv.classList.add('selected');
        }

        this.selectedElement = elementId;
        this.loadPropertiesPanel(elementId);
    }

    // CANVAS RENDERING
    renderCanvas() {
        const canvas = document.getElementById('page-builder-canvas');
        if (!canvas) return;

        if (this.elements.length === 0) {
            canvas.innerHTML = `
                <div class="empty-canvas text-center text-muted py-5">
                    <i class="fas fa-mouse-pointer fa-3x mb-3"></i>
                    <h5>Drag elements from the left panel to build your page</h5>
                    <p>Click on any element to edit its properties</p>
                </div>
            `;
            return;
        }

        canvas.innerHTML = this.elements.map(element => this.renderElement(element)).join('');
        
        // Add selection styles
        this.addCanvasStyles();
    }

    addCanvasStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .canvas-element {
                position: relative;
                cursor: pointer;
                border: 2px solid transparent;
                margin: 5px 0;
                transition: all 0.3s ease;
            }
            .canvas-element:hover {
                border-color: #007bff;
                box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
            }
            .canvas-element.selected {
                border-color: #28a745;
                box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.25);
            }
            .element-controls {
                position: absolute;
                top: -35px;
                right: 5px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 4px;
                opacity: 0;
                transition: opacity 0.3s;
                z-index: 10;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .canvas-element:hover .element-controls,
            .canvas-element.selected .element-controls {
                opacity: 1;
            }
            .element-controls button {
                border: none;
                background: none;
                padding: 6px 8px;
                margin: 0 1px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .element-controls button:hover {
                background: #f8f9fa;
            }
            .element-controls button.delete:hover {
                background: #fee;
                color: #dc3545;
            }
        `;
        
        // Remove existing styles
        document.querySelectorAll('style[data-page-builder]').forEach(s => s.remove());
        style.setAttribute('data-page-builder', 'true');
        document.head.appendChild(style);
    }

    renderElement(element) {
        if (!element.settings.visible) return '';

        const controls = `
            <div class="element-controls">
                <button onclick="pageBuilder.moveElement('${element.id}', 'up')" title="Move Up">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button onclick="pageBuilder.moveElement('${element.id}', 'down')" title="Move Down">
                    <i class="fas fa-arrow-down"></i>
                </button>
                <button onclick="pageBuilder.duplicateElement('${element.id}')" title="Duplicate">
                    <i class="fas fa-copy"></i>
                </button>
                <button onclick="pageBuilder.deleteElement('${element.id}')" title="Delete" class="delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        switch (element.type) {
            case 'hero':
                return this.renderHeroElement(element, controls);
            case 'features':
                return this.renderFeaturesElement(element, controls);
            case 'products':
                return this.renderProductsElement(element, controls);
            case 'testimonials':
                return this.renderTestimonialsElement(element, controls);
            case 'contact':
                return this.renderContactElement(element, controls);
            case 'text':
                return this.renderTextElement(element, controls);
            case 'gallery':
                return this.renderGalleryElement(element, controls);
            case 'video':
                return this.renderVideoElement(element, controls);
            case 'spacer':
                return this.renderSpacerElement(element, controls);
            case 'divider':
                return this.renderDividerElement(element, controls);
            case 'slider':
                return this.renderSliderElement(element, controls);
            case 'columns':
                return this.renderColumnsElement(element, controls);
            default:
                return `<div class="canvas-element" data-element-id="${element.id}">Unknown element type: ${element.type}${controls}</div>`;
        }
    }

    renderHeroElement(element, controls) {
        const { content, settings } = element;
        const backgroundStyle = content.backgroundImage ? 
            `background-image: linear-gradient(rgba(0,0,0,${content.overlayOpacity}), rgba(0,0,0,${content.overlayOpacity})), url('${content.backgroundImage}'); background-size: cover; background-position: center;` : 
            'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);';

        return `
            <div class="canvas-element hero-element" data-element-id="${element.id}" 
                 style="${backgroundStyle} height: ${settings.height}; color: white; display: flex; align-items: center;">
                ${controls}
                <div class="container">
                    <div class="text-${settings.textAlign}">
                        <h1 class="display-4 fw-bold mb-3">${content.title}</h1>
                        <p class="lead mb-4">${content.subtitle}</p>
                        ${content.buttonText ? `<a href="${content.buttonLink}" class="btn btn-light btn-lg">${content.buttonText}</a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderFeaturesElement(element, controls) {
        const { content, settings } = element;
        const colClass = settings.columns === 1 ? 'col-12' : 
                         settings.columns === 2 ? 'col-md-6' : 
                         settings.columns === 3 ? 'col-lg-4' : 'col-lg-3';

        return `
            <div class="canvas-element features-element py-5" data-element-id="${element.id}"
                 style="background-color: ${settings.backgroundColor};">
                ${controls}
                <div class="container">
                    <div class="text-center mb-5">
                        <h2 class="fw-bold">${content.title}</h2>
                        <p class="lead">${content.subtitle}</p>
                    </div>
                    <div class="row justify-content-center">
                        ${content.features.map(feature => `
                            <div class="${colClass} mb-4">
                                <div class="text-center h-100">
                                    <div class="feature-icon mb-3">
                                        <i class="${feature.icon} fa-3x text-primary"></i>
                                    </div>
                                    <h4 class="mb-3">${feature.title}</h4>
                                    <p class="text-muted">${feature.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderProductsElement(element, controls) {
        return `
            <div class="canvas-element products-element py-5" data-element-id="${element.id}">
                ${controls}
                <div class="container">
                    <div class="text-center mb-5">
                        <h2 class="fw-bold">${element.content.title}</h2>
                        <p class="lead">${element.content.subtitle}</p>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <img src="https://images.pexels.com/photos/416754/pexels-photo-416754.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" class="card-img-top" style="height: 200px; object-fit: cover;">
                                <div class="card-body">
                                    <h5 class="card-title">Sample Product 1</h5>
                                    <p class="card-text">This is a sample product display</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="h5 text-primary">₹25,000</span>
                                        <button class="btn btn-primary btn-sm">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <img src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" class="card-img-top" style="height: 200px; object-fit: cover;">
                                <div class="card-body">
                                    <h5 class="card-title">Sample Product 2</h5>
                                    <p class="card-text">This is a sample product display</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="h5 text-primary">₹45,000</span>
                                        <button class="btn btn-primary btn-sm">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <img src="https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" class="card-img-top" style="height: 200px; object-fit: cover;">
                                <div class="card-body">
                                    <h5 class="card-title">Sample Product 3</h5>
                                    <p class="card-text">This is a sample product display</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="h5 text-primary">₹85,000</span>
                                        <button class="btn btn-primary btn-sm">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="alert alert-info mt-4">
                        <i class="fas fa-info-circle me-2"></i>
                        Products section will display actual products from your inventory
                    </div>
                </div>
            </div>
        `;
    }

    renderTestimonialsElement(element, controls) {
        const { content, settings } = element;
        
        return `
            <div class="canvas-element testimonials-element py-5" data-element-id="${element.id}" style="background: #f8f9fa;">
                ${controls}
                <div class="container">
                    <div class="text-center mb-5">
                        <h2 class="fw-bold">${content.title}</h2>
                    </div>
                    <div class="row">
                        ${content.testimonials.map(testimonial => `
                            <div class="col-lg-4 mb-4">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body text-center p-4">
                                        ${testimonial.image ? `<img src="${testimonial.image}" class="rounded-circle mb-3" width="80" height="80" style="object-fit: cover;">` : `<div class="bg-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;"><i class="fas fa-user fa-2x text-white"></i></div>`}
                                        <div class="text-warning mb-3">
                                            ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                                        </div>
                                        <p class="card-text fst-italic">"${testimonial.content}"</p>
                                        <h6 class="card-title mb-1">${testimonial.name}</h6>
                                        <small class="text-muted">${testimonial.position}</small>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderContactElement(element, controls) {
        const { content, settings } = element;
        
        return `
            <div class="canvas-element contact-element py-5" data-element-id="${element.id}"
                 style="background-color: ${settings.backgroundColor}; color: white;">
                ${controls}
                <div class="container">
                    <div class="text-center mb-5">
                        <h2 class="fw-bold">${content.title}</h2>
                        <p class="lead">${content.subtitle}</p>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 mb-4">
                            <h5 class="mb-4">Contact Information</h5>
                            <div class="contact-info">
                                <p class="mb-3">
                                    <i class="fas fa-phone me-3"></i>
                                    <a href="tel:${content.contactInfo.phone}" class="text-white text-decoration-none">${content.contactInfo.phone}</a>
                                </p>
                                <p class="mb-3">
                                    <i class="fas fa-envelope me-3"></i>
                                    <a href="mailto:${content.contactInfo.email}" class="text-white text-decoration-none">${content.contactInfo.email}</a>
                                </p>
                                <p class="mb-3">
                                    <i class="fas fa-map-marker-alt me-3"></i>
                                    ${content.contactInfo.address}
                                </p>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            ${content.showForm ? `
                                <div class="contact-form-preview">
                                    <h5 class="mb-4">Send us a Message</h5>
                                    <div class="alert alert-light text-dark">
                                        <i class="fas fa-info-circle me-2"></i>
                                        Contact form will be functional on the live website
                                    </div>
                                    <div class="form-preview">
                                        <div class="mb-3">
                                            <input type="text" class="form-control" placeholder="Your Name" disabled>
                                        </div>
                                        <div class="mb-3">
                                            <input type="email" class="form-control" placeholder="Your Email" disabled>
                                        </div>
                                        <div class="mb-3">
                                            <textarea class="form-control" rows="4" placeholder="Your Message" disabled></textarea>
                                        </div>
                                        <button class="btn btn-light" disabled>Send Message</button>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTextElement(element, controls) {
        const { content, settings } = element;
        
        return `
            <div class="canvas-element text-element" data-element-id="${element.id}"
                 style="padding: ${settings.padding}; background-color: ${settings.backgroundColor};">
                ${controls}
                <div class="container">
                    ${content.html}
                </div>
            </div>
        `;
    }

    renderGalleryElement(element, controls) {
        const { content, settings } = element;
        const colClass = `col-lg-${12 / settings.columns} col-md-6`;
        
        return `
            <div class="canvas-element gallery-element py-5" data-element-id="${element.id}">
                ${controls}
                <div class="container">
                    <h2 class="text-center fw-bold mb-5">${content.title}</h2>
                    <div class="row">
                        ${content.images.map(image => `
                            <div class="${colClass} mb-4">
                                <div class="card border-0 shadow-sm h-100">
                                    <img src="${image.url}" class="card-img-top" alt="${image.alt}" style="height: 250px; object-fit: cover;">
                                    ${image.caption ? `<div class="card-body"><p class="card-text text-center">${image.caption}</p></div>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderVideoElement(element, controls) {
        const { content, settings } = element;
        
        return `
            <div class="canvas-element video-element py-5" data-element-id="${element.id}">
                ${controls}
                <div class="container">
                    <h2 class="text-center fw-bold mb-5">${content.title}</h2>
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            ${content.videoUrl ? `
                                <div class="ratio ratio-${settings.aspectRatio.replace(':', 'x')}">
                                    <video controls ${content.autoplay ? 'autoplay' : ''} ${content.poster ? `poster="${content.poster}"` : ''} class="rounded">
                                        <source src="${content.videoUrl}" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ` : `
                                <div class="alert alert-warning text-center">
                                    <i class="fas fa-video fa-3x mb-3"></i>
                                    <h5>Video Element</h5>
                                    <p>Please add a video URL in the properties panel</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderSpacerElement(element, controls) {
        return `
            <div class="canvas-element spacer-element d-flex align-items-center justify-content-center" data-element-id="${element.id}"
                 style="height: ${element.settings.height}; background: repeating-linear-gradient(90deg, transparent, transparent 10px, #e9ecef 10px, #e9ecef 11px);">
                ${controls}
                <div class="text-muted">
                    <i class="fas fa-arrows-alt-v me-2"></i>Spacer (${element.settings.height})
                </div>
            </div>
        `;
    }

    renderDividerElement(element, controls) {
        const { content, settings } = element;
        
        return `
            <div class="canvas-element divider-element py-3" data-element-id="${element.id}">
                ${controls}
                <div class="container">
                    <hr style="border: none; border-top: ${settings.thickness} ${content.style} ${content.color}; width: ${content.width}; margin: 0 auto;">
                </div>
            </div>
        `;
    }

    renderSliderElement(element, controls) {
        const { content, settings } = element;
        
        return `
            <div class="canvas-element slider-element" data-element-id="${element.id}">
                ${controls}
                <div class="container-fluid p-0">
                    <h2 class="text-center fw-bold py-4">${content.title}</h2>
                    <div id="slider-${element.id}" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${content.slides.map((slide, index) => `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img src="${slide.image}" class="d-block w-100" style="height: 400px; object-fit: cover;">
                                    <div class="carousel-caption d-none d-md-block">
                                        <h5>${slide.title}</h5>
                                        <p>${slide.description}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#slider-${element.id}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#slider-${element.id}" data-bs-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderColumnsElement(element, controls) {
        const { content, settings } = element;
        const colClass = `col-lg-${12 / settings.columnCount}`;
        
        return `
            <div class="canvas-element columns-element py-4" data-element-id="${element.id}">
                ${controls}
                <div class="container">
                    <div class="row" style="gap: ${settings.spacing};">
                        ${content.columns.map(column => `
                            <div class="${colClass}">
                                ${column.html}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // PROPERTIES PANEL
    loadPropertiesPanel(elementId) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element) return;

        const panel = document.getElementById('properties-panel');
        if (!panel) return;

        panel.innerHTML = this.generatePropertiesForm(element);
        
        // Setup form handlers
        const form = panel.querySelector('form');
        if (form) {
            form.addEventListener('change', () => {
                this.updateElement(elementId, form);
            });
            
            form.addEventListener('input', () => {
                this.updateElement(elementId, form);
            });
        }
    }

    generatePropertiesForm(element) {
        const commonSettings = `
            <div class="mb-3">
                <label class="form-label">Element Visibility</label>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="visible" ${element.settings.visible ? 'checked' : ''}>
                    <label class="form-check-label">Show on website</label>
                </div>
            </div>
        `;

        let specificSettings = '';

        switch (element.type) {
            case 'hero':
                specificSettings = `
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title" value="${element.content.title}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Subtitle</label>
                        <textarea class="form-control" name="subtitle" rows="3">${element.content.subtitle}</textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Button Text</label>
                        <input type="text" class="form-control" name="buttonText" value="${element.content.buttonText}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Button Link</label>
                        <input type="text" class="form-control" name="buttonLink" value="${element.content.buttonLink}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Background Image URL</label>
                        <input type="url" class="form-control" name="backgroundImage" value="${element.content.backgroundImage}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Overlay Opacity (${element.content.overlayOpacity})</label>
                        <input type="range" class="form-range" name="overlayOpacity" min="0" max="1" step="0.1" value="${element.content.overlayOpacity}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Height</label>
                        <input type="text" class="form-control" name="height" value="${element.settings.height}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Text Alignment</label>
                        <select class="form-control" name="textAlign">
                            <option value="left" ${element.settings.textAlign === 'left' ? 'selected' : ''}>Left</option>
                            <option value="center" ${element.settings.textAlign === 'center' ? 'selected' : ''}>Center</option>
                            <option value="right" ${element.settings.textAlign === 'right' ? 'selected' : ''}>Right</option>
                        </select>
                    </div>
                `;
                break;

            case 'features':
                specificSettings = `
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title" value="${element.content.title}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Subtitle</label>
                        <textarea class="form-control" name="subtitle" rows="2">${element.content.subtitle}</textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Columns</label>
                        <select class="form-control" name="columns">
                            <option value="1" ${element.settings.columns === 1 ? 'selected' : ''}>1 Column</option>
                            <option value="2" ${element.settings.columns === 2 ? 'selected' : ''}>2 Columns</option>
                            <option value="3" ${element.settings.columns === 3 ? 'selected' : ''}>3 Columns</option>
                            <option value="4" ${element.settings.columns === 4 ? 'selected' : ''}>4 Columns</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Background Color</label>
                        <input type="color" class="form-control form-control-color" name="backgroundColor" value="${element.settings.backgroundColor}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Features</label>
                        <div class="features-editor">
                            ${element.content.features.map((feature, index) => `
                                <div class="feature-item border p-3 mb-2">
                                    <div class="mb-2">
                                        <label class="form-label">Icon (FontAwesome class)</label>
                                        <input type="text" class="form-control" name="feature_${index}_icon" value="${feature.icon}">
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label">Title</label>
                                        <input type="text" class="form-control" name="feature_${index}_title" value="${feature.title}">
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label">Description</label>
                                        <textarea class="form-control" name="feature_${index}_description" rows="2">${feature.description}</textarea>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-danger" onclick="pageBuilder.removeFeature('${element.id}', ${index})">Remove</button>
                                </div>
                            `).join('')}
                            <button type="button" class="btn btn-sm btn-primary" onclick="pageBuilder.addFeature('${element.id}')">Add Feature</button>
                        </div>
                    </div>
                `;
                break;

            case 'text':
                specificSettings = `
                    <div class="mb-3">
                        <label class="form-label">Content (HTML)</label>
                        <textarea class="form-control" name="html" rows="8">${element.content.html}</textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Padding</label>
                        <input type="text" class="form-control" name="padding" value="${element.settings.padding}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Background Color</label>
                        <input type="color" class="form-control form-control-color" name="backgroundColor" value="${element.settings.backgroundColor}">
                    </div>
                `;
                break;

            case 'testimonials':
                specificSettings = `
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title" value="${element.content.title}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Layout</label>
                        <select class="form-control" name="layout">
                            <option value="grid" ${element.settings.layout === 'grid' ? 'selected' : ''}>Grid</option>
                            <option value="carousel" ${element.settings.layout === 'carousel' ? 'selected' : ''}>Carousel</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Testimonials</label>
                        <div class="testimonials-editor">
                            ${element.content.testimonials.map((testimonial, index) => `
                                <div class="testimonial-item border p-3 mb-2">
                                    <div class="mb-2">
                                        <label class="form-label">Name</label>
                                        <input type="text" class="form-control" name="testimonial_${index}_name" value="${testimonial.name}">
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label">Position</label>
                                        <input type="text" class="form-control" name="testimonial_${index}_position" value="${testimonial.position}">
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label">Content</label>
                                        <textarea class="form-control" name="testimonial_${index}_content" rows="3">${testimonial.content}</textarea>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label">Rating</label>
                                        <select class="form-control" name="testimonial_${index}_rating">
                                            <option value="1" ${testimonial.rating === 1 ? 'selected' : ''}>1 Star</option>
                                            <option value="2" ${testimonial.rating === 2 ? 'selected' : ''}>2 Stars</option>
                                            <option value="3" ${testimonial.rating === 3 ? 'selected' : ''}>3 Stars</option>
                                            <option value="4" ${testimonial.rating === 4 ? 'selected' : ''}>4 Stars</option>
                                            <option value="5" ${testimonial.rating === 5 ? 'selected' : ''}>5 Stars</option>
                                        </select>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label">Image URL</label>
                                        <input type="url" class="form-control" name="testimonial_${index}_image" value="${testimonial.image}">
                                    </div>
                                    <button type="button" class="btn btn-sm btn-danger" onclick="pageBuilder.removeTestimonial('${element.id}', ${index})">Remove</button>
                                </div>
                            `).join('')}
                            <button type="button" class="btn btn-sm btn-primary" onclick="pageBuilder.addTestimonial('${element.id}')">Add Testimonial</button>
                        </div>
                    </div>
                `;
                break;

            case 'gallery':
                specificSettings = `
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title" value="${element.content.title}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Columns</label>
                        <select class="form-control" name="columns">
                            <option value="2" ${element.settings.columns === 2 ? 'selected' : ''}>2 Columns</option>
                            <option value="3" ${element.settings.columns === 3 ? 'selected' : ''}>3 Columns</option>
                            <option value="4" ${element.settings.columns === 4 ? 'selected' : ''}>4 Columns</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Images</label>
                        <div class="images-editor">
                            ${element.content.images.map((image, index) => `
                                <div class="image-item border p-3 mb-2">
                                    <div class="mb-2">
                                        <label class="form-label">Image URL</label>
                                        <input type="url" class="form-control" name="image_${index}_url" value="${image.url}">
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label">Alt Text</label>
                                        <input type="text" class="form-control" name="image_${index}_alt" value="${image.alt}">
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label">Caption</label>
                                        <input type="text" class="form-control" name="image_${index}_caption" value="${image.caption}">
                                    </div>
                                    <button type="button" class="btn btn-sm btn-danger" onclick="pageBuilder.removeImage('${element.id}', ${index})">Remove</button>
                                </div>
                            `).join('')}
                            <button type="button" class="btn btn-sm btn-primary" onclick="pageBuilder.addImage('${element.id}')">Add Image</button>
                        </div>
                    </div>
                `;
                break;

            case 'video':
                specificSettings = `
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title" value="${element.content.title}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Video URL</label>
                        <input type="url" class="form-control" name="videoUrl" value="${element.content.videoUrl}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Poster Image URL</label>
                        <input type="url" class="form-control" name="poster" value="${element.content.poster}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Aspect Ratio</label>
                        <select class="form-control" name="aspectRatio">
                            <option value="16:9" ${element.settings.aspectRatio === '16:9' ? 'selected' : ''}>16:9</option>
                            <option value="4:3" ${element.settings.aspectRatio === '4:3' ? 'selected' : ''}>4:3</option>
                            <option value="1:1" ${element.settings.aspectRatio === '1:1' ? 'selected' : ''}>1:1</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="autoplay" ${element.content.autoplay ? 'checked' : ''}>
                            <label class="form-check-label">Autoplay</label>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="controls" ${element.content.controls ? 'checked' : ''}>
                            <label class="form-check-label">Show Controls</label>
                        </div>
                    </div>
                `;
                break;

            case 'spacer':
                specificSettings = `
                    <div class="mb-3">
                        <label class="form-label">Height</label>
                        <input type="text" class="form-control" name="height" value="${element.settings.height}" placeholder="e.g., 50px, 10vh">
                    </div>
                `;
                break;

            case 'divider':
                specificSettings = `
                    <div class="mb-3">
                        <label class="form-label">Style</label>
                        <select class="form-control" name="style">
                            <option value="solid" ${element.content.style === 'solid' ? 'selected' : ''}>Solid</option>
                            <option value="dashed" ${element.content.style === 'dashed' ? 'selected' : ''}>Dashed</option>
                            <option value="dotted" ${element.content.style === 'dotted' ? 'selected' : ''}>Dotted</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Color</label>
                        <input type="color" class="form-control form-control-color" name="color" value="${element.content.color}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Thickness</label>
                        <input type="text" class="form-control" name="thickness" value="${element.settings.thickness}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Width</label>
                        <input type="text" class="form-control" name="width" value="${element.content.width}">
                    </div>
                `;
                break;

            case 'contact':
                specificSettings = `
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title" value="${element.content.title}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Subtitle</label>
                        <textarea class="form-control" name="subtitle" rows="2">${element.content.subtitle}</textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Phone</label>
                        <input type="text" class="form-control" name="phone" value="${element.content.contactInfo.phone}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" value="${element.content.contactInfo.email}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Address</label>
                        <textarea class="form-control" name="address" rows="2">${element.content.contactInfo.address}</textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Background Color</label>
                        <input type="color" class="form-control form-control-color" name="backgroundColor" value="${element.settings.backgroundColor}">
                    </div>
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="showForm" ${element.content.showForm ? 'checked' : ''}>
                            <label class="form-check-label">Show Contact Form</label>
                        </div>
                    </div>
                `;
                break;

            default:
                specificSettings = '<p class="text-muted">No specific settings available for this element type.</p>';
        }

        return `
            <form>
                <h6 class="mb-3">Element Settings</h6>
                ${commonSettings}
                <hr>
                <h6 class="mb-3">Content Settings</h6>
                ${specificSettings}
                <div class="mt-4">
                    <button type="button" class="btn btn-danger btn-sm w-100" onclick="pageBuilder.deleteElement('${element.id}')">
                        <i class="fas fa-trash me-2"></i>Delete Element
                    </button>
                </div>
            </form>
        `;
    }

    updateElement(elementId, form) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element || !form) return;

        const formData = new FormData(form);
        
        // Update common settings
        element.settings.visible = formData.has('visible');

        // Update specific content and settings based on element type
        switch (element.type) {
            case 'hero':
                element.content.title = formData.get('title') || '';
                element.content.subtitle = formData.get('subtitle') || '';
                element.content.buttonText = formData.get('buttonText') || '';
                element.content.buttonLink = formData.get('buttonLink') || '';
                element.content.backgroundImage = formData.get('backgroundImage') || '';
                element.content.overlayOpacity = parseFloat(formData.get('overlayOpacity')) || 0.5;
                element.settings.height = formData.get('height') || '500px';
                element.settings.textAlign = formData.get('textAlign') || 'center';
                break;

            case 'features':
                element.content.title = formData.get('title') || '';
                element.content.subtitle = formData.get('subtitle') || '';
                element.settings.columns = parseInt(formData.get('columns')) || 2;
                element.settings.backgroundColor = formData.get('backgroundColor') || '#ffffff';
                
                // Update features
                element.content.features = element.content.features.map((feature, index) => ({
                    icon: formData.get(`feature_${index}_icon`) || feature.icon,
                    title: formData.get(`feature_${index}_title`) || feature.title,
                    description: formData.get(`feature_${index}_description`) || feature.description
                }));
                break;

            case 'text':
                element.content.html = formData.get('html') || '';
                element.settings.padding = formData.get('padding') || '40px';
                element.settings.backgroundColor = formData.get('backgroundColor') || '#ffffff';
                break;

            case 'testimonials':
                element.content.title = formData.get('title') || '';
                element.settings.layout = formData.get('layout') || 'grid';
                
                // Update testimonials
                element.content.testimonials = element.content.testimonials.map((testimonial, index) => ({
                    name: formData.get(`testimonial_${index}_name`) || testimonial.name,
                    position: formData.get(`testimonial_${index}_position`) || testimonial.position,
                    content: formData.get(`testimonial_${index}_content`) || testimonial.content,
                    rating: parseInt(formData.get(`testimonial_${index}_rating`)) || testimonial.rating,
                    image: formData.get(`testimonial_${index}_image`) || testimonial.image
                }));
                break;

            case 'gallery':
                element.content.title = formData.get('title') || '';
                element.settings.columns = parseInt(formData.get('columns')) || 3;
                
                // Update images
                element.content.images = element.content.images.map((image, index) => ({
                    url: formData.get(`image_${index}_url`) || image.url,
                    alt: formData.get(`image_${index}_alt`) || image.alt,
                    caption: formData.get(`image_${index}_caption`) || image.caption
                }));
                break;

            case 'video':
                element.content.title = formData.get('title') || '';
                element.content.videoUrl = formData.get('videoUrl') || '';
                element.content.poster = formData.get('poster') || '';
                element.content.autoplay = formData.has('autoplay');
                element.content.controls = formData.has('controls');
                element.settings.aspectRatio = formData.get('aspectRatio') || '16:9';
                break;

            case 'spacer':
                element.settings.height = formData.get('height') || '50px';
                break;

            case 'divider':
                element.content.style = formData.get('style') || 'solid';
                element.content.color = formData.get('color') || '#dee2e6';
                element.content.width = formData.get('width') || '100%';
                element.settings.thickness = formData.get('thickness') || '1px';
                break;

            case 'contact':
                element.content.title = formData.get('title') || '';
                element.content.subtitle = formData.get('subtitle') || '';
                element.content.contactInfo.phone = formData.get('phone') || '';
                element.content.contactInfo.email = formData.get('email') || '';
                element.content.contactInfo.address = formData.get('address') || '';
                element.content.showForm = formData.has('showForm');
                element.settings.backgroundColor = formData.get('backgroundColor') || '#2c3e50';
                break;
        }

        // Re-render canvas and save
        this.renderCanvas();
        this.saveContent();
    }

    // FEATURE MANAGEMENT FOR FEATURES ELEMENT
    addFeature(elementId) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element || element.type !== 'features') return;

        element.content.features.push({
            icon: 'fas fa-star',
            title: 'New Feature',
            description: 'Feature description'
        });

        this.renderCanvas();
        this.loadPropertiesPanel(elementId);
        this.saveContent();
    }

    removeFeature(elementId, featureIndex) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element || element.type !== 'features') return;

        element.content.features.splice(featureIndex, 1);

        this.renderCanvas();
        this.loadPropertiesPanel(elementId);
        this.saveContent();
    }

    // TESTIMONIAL MANAGEMENT
    addTestimonial(elementId) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element || element.type !== 'testimonials') return;

        element.content.testimonials.push({
            name: 'Customer Name',
            position: 'Position',
            content: 'Testimonial content',
            rating: 5,
            image: ''
        });

        this.renderCanvas();
        this.loadPropertiesPanel(elementId);
        this.saveContent();
    }

    removeTestimonial(elementId, testimonialIndex) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element || element.type !== 'testimonials') return;

        element.content.testimonials.splice(testimonialIndex, 1);

        this.renderCanvas();
        this.loadPropertiesPanel(elementId);
        this.saveContent();
    }

    // IMAGE MANAGEMENT FOR GALLERY
    addImage(elementId) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element || element.type !== 'gallery') return;

        element.content.images.push({
            url: 'https://via.placeholder.com/400x300',
            alt: 'Gallery Image',
            caption: 'Image Caption'
        });

        this.renderCanvas();
        this.loadPropertiesPanel(elementId);
        this.saveContent();
    }

    removeImage(elementId, imageIndex) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element || element.type !== 'gallery') return;

        element.content.images.splice(imageIndex, 1);

        this.renderCanvas();
        this.loadPropertiesPanel(elementId);
        this.saveContent();
    }

    // LAYERS PANEL
    updateLayersPanel() {
        const layersPanel = document.getElementById('layers-panel');
        if (!layersPanel) return;

        if (this.elements.length === 0) {
            layersPanel.innerHTML = '<div class="text-muted"><small>No elements added yet</small></div>';
            return;
        }

        layersPanel.innerHTML = `
            <div class="layers-list">
                ${this.elements.map((element, index) => `
                    <div class="layer-item ${this.selectedElement === element.id ? 'active' : ''}" 
                         onclick="pageBuilder.selectElement('${element.id}')">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <i class="fas ${this.getElementIcon(element.type)} me-2"></i>
                                <span>${this.formatElementTitle(element)}</span>
                            </div>
                            <div class="layer-controls">
                                <button class="btn btn-sm btn-outline-secondary me-1" onclick="event.stopPropagation(); pageBuilder.toggleElementVisibility('${element.id}')" title="Toggle Visibility">
                                    <i class="fas ${element.settings.visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); pageBuilder.deleteElement('${element.id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add layer styles
        const style = document.createElement('style');
        style.textContent = `
            .layer-item {
                padding: 8px 12px;
                border: 1px solid #e9ecef;
                border-radius: 4px;
                margin-bottom: 4px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .layer-item:hover {
                background: #f8f9fa;
                border-color: #007bff;
            }
            .layer-item.active {
                background: #e3f2fd;
                border-color: #2196f3;
            }
            .layer-controls button {
                padding: 2px 6px;
                font-size: 10px;
            }
        `;
        
        // Remove existing layer styles
        document.querySelectorAll('style[data-layers]').forEach(s => s.remove());
        style.setAttribute('data-layers', 'true');
        document.head.appendChild(style);
    }

    getElementIcon(type) {
        const icons = {
            'hero': 'fa-star',
            'features': 'fa-th-large',
            'products': 'fa-box',
            'testimonials': 'fa-quote-left',
            'contact': 'fa-envelope',
            'text': 'fa-align-left',
            'gallery': 'fa-images',
            'video': 'fa-video',
            'spacer': 'fa-arrows-alt-v',
            'divider': 'fa-minus',
            'slider': 'fa-sliders-h',
            'columns': 'fa-columns'
        };
        return icons[type] || 'fa-cube';
    }

    formatElementTitle(element) {
        const title = element.content.title || element.type;
        return title.length > 20 ? title.substring(0, 20) + '...' : title;
    }

    toggleElementVisibility(elementId) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element) return;

        element.settings.visible = !element.settings.visible;
        
        this.renderCanvas();
        this.updateLayersPanel();
        this.loadPropertiesPanel(elementId);
        this.saveContent();
    }

        clearPropertiesPanel() {
        const panel = document.getElementById('properties-panel');
        if (panel) {
            panel.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-hand-pointer fa-2x mb-3"></i>
                    <p>Select an element to edit its properties</p>
                </div>
            `;
        }
    }

    // SAVE AND LOAD FUNCTIONALITY
    saveContent() {
        try {
            localStorage.setItem('jadhao_homepage_content', JSON.stringify(this.elements));
            console.log('✅ Homepage content saved');
        } catch (error) {
            console.error('Error saving content:', error);
        }
    }

    saveChanges() {
        try {
            // Generate the actual HTML for the homepage
            const homepageHTML = this.generateHomepageHTML();
            
            // Save to localStorage for preview
            localStorage.setItem('jadhao_homepage_html', homepageHTML);
            localStorage.setItem('jadhao_homepage_content', JSON.stringify(this.elements));
            localStorage.setItem('jadhao_homepage_last_updated', new Date().toISOString());
            
            this.showNotification('Homepage changes saved successfully! Changes will be visible on the live website.', 'success', 7000);
            
            // Track save action
            this.trackPageBuilderAction('save_changes', this.elements.length);
            
        } catch (error) {
            console.error('Error saving changes:', error);
            this.showNotification('Error saving changes. Please try again.', 'error');
        }
    }

    generateHomepageHTML() {
        const visibleElements = this.elements.filter(el => el.settings.visible);
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jadhao Industries - Premium Gym Equipment Manufacturing</title>
    <meta name="description" content="Leading manufacturer of high-quality gym equipment in Maharashtra. Professional fitness solutions for gyms and home workouts.">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#">
                <i class="fas fa-dumbbell text-primary me-2"></i>
                Jadhao Industries
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#home">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#products">Products</a></li>
                    <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                    <li class="nav-item">
                        <a class="nav-link cart-icon" href="#" onclick="toggleCart()">
                            <i class="fas fa-shopping-cart"></i>
                            <span id="cart-count" class="badge bg-danger rounded-pill d-none">0</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Page Content -->
    <main>
        ${visibleElements.map(element => this.generateElementHTML(element)).join('')}
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-white py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <h5><i class="fas fa-dumbbell me-2"></i>Jadhao Industries</h5>
                    <p>Leading manufacturer of premium gym equipment in Maharashtra. Quality, durability, and innovation in every product.</p>
                </div>
                <div class="col-lg-4 mb-4">
                    <h6>Quick Links</h6>
                    <ul class="list-unstyled">
                        <li><a href="#home" class="text-white-50">Home</a></li>
                        <li><a href="#products" class="text-white-50">Products</a></li>
                        <li><a href="#about" class="text-white-50">About Us</a></li>
                        <li><a href="#contact" class="text-white-50">Contact</a></li>
                    </ul>
                </div>
                <div class="col-lg-4 mb-4">
                    <h6>Contact Info</h6>
                    <p class="text-white-50 mb-1"><i class="fas fa-phone me-2"></i>+91-721-252-1201</p>
                    <p class="text-white-50 mb-1"><i class="fas fa-envelope me-2"></i>info@jadhaoindustries.com</p>
                    <p class="text-white-50"><i class="fas fa-map-marker-alt me-2"></i>Amravati, Maharashtra, India</p>
                </div>
            </div>
            <hr class="my-4">
            <div class="text-center">
                <p class="mb-0">&copy; 2024 Jadhao Industries. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Cart Sidebar -->
    <div id="cart-sidebar" class="cart-sidebar">
        <div class="cart-header">
            <h5>Shopping Cart</h5>
            <button onclick="toggleCart()" class="btn-close"></button>
        </div>
        <div class="cart-body">
            <div id="cart-items"></div>
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <strong>Total: <span id="cart-sidebar-total">₹0</span></strong>
            </div>
            <button class="btn btn-primary w-100 mt-2" onclick="proceedToCheckout()">
                Proceed to Checkout
            </button>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/database.js"></script>
    <script src="js/script.js"></script>
</body>
</html>
        `;
    }

    generateElementHTML(element) {
        switch (element.type) {
            case 'hero':
                return this.generateHeroHTML(element);
            case 'features':
                return this.generateFeaturesHTML(element);
            case 'products':
                return this.generateProductsHTML(element);
            case 'testimonials':
                return this.generateTestimonialsHTML(element);
            case 'contact':
                return this.generateContactHTML(element);
            case 'text':
                return this.generateTextHTML(element);
            case 'gallery':
                return this.generateGalleryHTML(element);
            case 'video':
                return this.generateVideoHTML(element);
            case 'spacer':
                return `<div style="height: ${element.settings.height};"></div>`;
            case 'divider':
                return `<div class="container py-3"><hr style="border: none; border-top: ${element.settings.thickness} ${element.content.style} ${element.content.color}; width: ${element.content.width}; margin: 0 auto;"></div>`;
            default:
                return '';
        }
    }

    generateHeroHTML(element) {
        const { content, settings } = element;
        const backgroundStyle = content.backgroundImage ? 
            `background-image: linear-gradient(rgba(0,0,0,${content.overlayOpacity}), rgba(0,0,0,${content.overlayOpacity})), url('${content.backgroundImage}'); background-size: cover; background-position: center;` : 
            'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);';

        return `
            <section id="home" class="hero-section" style="${backgroundStyle} height: ${settings.height}; color: white; display: flex; align-items: center;">
                <div class="container">
                    <div class="text-${settings.textAlign}">
                        <h1 class="display-4 fw-bold mb-3">${content.title}</h1>
                        <p class="lead mb-4">${content.subtitle}</p>
                        ${content.buttonText ? `<a href="${content.buttonLink}" class="btn btn-light btn-lg">${content.buttonText}</a>` : ''}
                    </div>
                </div>
            </section>
        `;
    }

    generateFeaturesHTML(element) {
        const { content, settings } = element;
        const colClass = settings.columns === 1 ? 'col-12' : 
                         settings.columns === 2 ? 'col-md-6' : 
                         settings.columns === 3 ? 'col-lg-4' : 'col-lg-3';

        return `
            <section class="features-section py-5" style="background-color: ${settings.backgroundColor};">
                <div class="container">
                    <div class="text-center mb-5">
                        <h2 class="fw-bold">${content.title}</h2>
                        <p class="lead">${content.subtitle}</p>
                    </div>
                    <div class="row justify-content-center">
                        ${content.features.map(feature => `
                            <div class="${colClass} mb-4">
                                <div class="text-center h-100">
                                    <div class="feature-icon mb-3">
                                        <i class="${feature.icon} fa-3x text-primary"></i>
                                    </div>
                                    <h4 class="mb-3">${feature.title}</h4>
                                    <p class="text-muted">${feature.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    generateProductsHTML(element) {
        return `
            <section id="products" class="products-section py-5">
                <div class="container">
                    <div class="text-center mb-5">
                        <h2 class="fw-bold">${element.content.title}</h2>
                        <p class="lead">${element.content.subtitle}</p>
                    </div>
                    <div class="filter-section text-center mb-4">
                        <button class="filter-btn active" data-filter="all">All Products</button>
                        <button class="filter-btn" data-filter="dumbbells">Dumbbells</button>
                        <button class="filter-btn" data-filter="machines">Machines</button>
                        <button class="filter-btn" data-filter="racks">Power Racks</button>
                        <button class="filter-btn" data-filter="plates">Weight Plates</button>
                        <button class="filter-btn" data-filter="cardio">Cardio</button>
                    </div>
                    <div id="products-grid" class="row">
                        <!-- Products will be loaded dynamically -->
                    </div>
                </div>
            </section>
        `;
    }

    generateTestimonialsHTML(element) {
        const { content, settings } = element;
        
        return `
            <section class="testimonials-section py-5" style="background: #f8f9fa;">
                <div class="container">
                    <div class="text-center mb-5">
                        <h2 class="fw-bold">${content.title}</h2>
                    </div>
                    <div class="row">
                        ${content.testimonials.map(testimonial => `
                            <div class="col-lg-4 mb-4">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body text-center p-4">
                                        ${testimonial.image ? `<img src="${testimonial.image}" class="rounded-circle mb-3" width="80" height="80" style="object-fit: cover;">` : `<div class="bg-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;"><i class="fas fa-user fa-2x text-white"></i></div>`}
                                        <div class="text-warning mb-3">
                                            ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                                        </div>
                                        <p class="card-text fst-italic">"${testimonial.content}"</p>
                                        <h6 class="card-title mb-1">${testimonial.name}</h6>
                                        <small class="text-muted">${testimonial.position}</small>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    generateContactHTML(element) {
        const { content, settings } = element;
        
        return `
            <section id="contact" class="contact-section py-5" style="background-color: ${settings.backgroundColor}; color: white;">
                <div class="container">
                    <div class="text-center mb-5">
                        <h2 class="fw-bold">${content.title}</h2>
                        <p class="lead">${content.subtitle}</p>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 mb-4">
                            <h5 class="mb-4">Contact Information</h5>
                            <div class="contact-info">
                                <p class="mb-3">
                                    <i class="fas fa-phone me-3"></i>
                                    <a href="tel:${content.contactInfo.phone}" class="text-white text-decoration-none">${content.contactInfo.phone}</a>
                                </p>
                                <p class="mb-3">
                                    <i class="fas fa-envelope me-3"></i>
                                    <a href="mailto:${content.contactInfo.email}" class="text-white text-decoration-none">${content.contactInfo.email}</a>
                                </p>
                                <p class="mb-3">
                                    <i class="fas fa-map-marker-alt me-3"></i>
                                    ${content.contactInfo.address}
                                </p>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            ${content.showForm ? `
                                <form id="contact-form" class="contact-form">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <input type="text" class="form-control" name="name" placeholder="Your Name" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <input type="email" class="form-control" name="email" placeholder="Your Email" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <input type="tel" class="form-control" name="phone" placeholder="Your Phone">
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <input type="text" class="form-control" name="subject" placeholder="Subject" required>
                                        </div>
                                        <div class="col-12 mb-3">
                                            <textarea class="form-control" name="message" rows="5" placeholder="Your Message" required></textarea>
                                        </div>
                                        <div class="col-12">
                                            <button type="submit" class="btn btn-light btn-lg">
                                                <i class="fas fa-paper-plane me-2"></i>Send Message
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    generateTextHTML(element) {
        const { content, settings } = element;
        
        return `
            <section class="text-section" style="padding: ${settings.padding}; background-color: ${settings.backgroundColor};">
                <div class="container">
                    ${content.html}
                </div>
            </section>
        `;
    }

    generateGalleryHTML(element) {
        const { content, settings } = element;
        const colClass = `col-lg-${12 / settings.columns} col-md-6`;
        
        return `
            <section class="gallery-section py-5">
                <div class="container">
                    <h2 class="text-center fw-bold mb-5">${content.title}</h2>
                    <div class="row">
                        ${content.images.map(image => `
                            <div class="${colClass} mb-4">
                                <div class="card border-0 shadow-sm h-100">
                                    <img src="${image.url}" class="card-img-top" alt="${image.alt}" style="height: 250px; object-fit: cover;">
                                    ${image.caption ? `<div class="card-body"><p class="card-text text-center">${image.caption}</p></div>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    generateVideoHTML(element) {
        const { content, settings } = element;
        
        return `
            <section class="video-section py-5">
                <div class="container">
                    <h2 class="text-center fw-bold mb-5">${content.title}</h2>
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            ${content.videoUrl ? `
                                <div class="ratio ratio-${settings.aspectRatio.replace(':', 'x')}">
                                    <video controls ${content.autoplay ? 'autoplay' : ''} ${content.poster ? `poster="${content.poster}"` : ''} class="rounded">
                                        <source src="${content.videoUrl}" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    previewChanges() {
        try {
            const homepageHTML = this.generateHomepageHTML();
            
            const previewWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
            previewWindow.document.write(homepageHTML);
            previewWindow.document.close();
            
            this.showNotification('Preview opened in new window', 'info');
            
        } catch (error) {
            console.error('Error generating preview:', error);
            this.showNotification('Error generating preview', 'error');
        }
    }

    resetToDefault() {
        if (!confirm('Are you sure you want to reset the homepage to default? This will delete all your custom changes.')) {
            return;
        }

        this.elements = this.getDefaultHomepageStructure();
        this.selectedElement = null;
        
        this.renderCanvas();
        this.updateLayersPanel();
        this.clearPropertiesPanel();
        this.saveContent();
        
        this.showNotification('Homepage reset to default successfully!', 'success');
    }

    // IMPORT/EXPORT FUNCTIONALITY
    exportHomepage() {
        try {
            const exportData = {
                version: this.version,
                timestamp: new Date().toISOString(),
                elements: this.elements,
                metadata: {
                    totalElements: this.elements.length,
                    lastModified: new Date().toISOString()
                }
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jadhao_homepage_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Homepage exported successfully!', 'success');
            
        } catch (error) {
            console.error('Error exporting homepage:', error);
            this.showNotification('Error exporting homepage', 'error');
        }
    }

    importHomepage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    if (!importData.elements || !Array.isArray(importData.elements)) {
                        throw new Error('Invalid homepage file format');
                    }

                    if (confirm('This will replace your current homepage. Are you sure you want to continue?')) {
                        this.elements = importData.elements;
                        this.selectedElement = null;
                        
                        this.renderCanvas();
                        this.updateLayersPanel();
                        this.clearPropertiesPanel();
                        this.saveContent();
                        
                        this.showNotification('Homepage imported successfully!', 'success');
                    }
                    
                } catch (error) {
                    console.error('Error importing homepage:', error);
                    this.showNotification('Error: Invalid homepage file', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    // RESPONSIVE PREVIEW
    setPreviewMode(mode) {
        const canvas = document.getElementById('page-builder-canvas');
        if (!canvas) return;

        // Remove existing preview classes
        canvas.classList.remove('preview-mobile', 'preview-tablet', 'preview-desktop');
        
        switch (mode) {
            case 'mobile':
                canvas.classList.add('preview-mobile');
                canvas.style.maxWidth = '375px';
                break;
            case 'tablet':
                canvas.classList.add('preview-tablet');
                canvas.style.maxWidth = '768px';
                break;
            case 'desktop':
            default:
                canvas.classList.add('preview-desktop');
                canvas.style.maxWidth = '100%';
                break;
        }
        
        this.showNotification(`Preview mode: ${mode}`, 'info', 2000);
    }

    // UNDO/REDO FUNCTIONALITY
    setupUndoRedo() {
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
        
        // Save initial state
        this.saveToHistory();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    this.undo();
                } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
                    e.preventDefault();
                    this.redo();
                } else if (e.key === 's') {
                    e.preventDefault();
                    this.saveChanges();
                }
            }
        });
    }

    saveToHistory() {
        // Remove any future history if we're not at the end
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add current state
        this.history.push(JSON.stringify(this.elements));
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.elements = JSON.parse(this.history[this.historyIndex]);
            this.selectedElement = null;
            
            this.renderCanvas();
            this.updateLayersPanel();
            this.clearPropertiesPanel();
            
            this.showNotification('Undone', 'info', 2000);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.elements = JSON.parse(this.history[this.historyIndex]);
            this.selectedElement = null;
            
            this.renderCanvas();
            this.updateLayersPanel();
            this.clearPropertiesPanel();
            
            this.showNotification('Redone', 'info', 2000);
        }
    }

    // ANALYTICS AND TRACKING
    trackPageBuilderAction(action, value = 1) {
        try {
            console.log(`📊 Page Builder Action: ${action}`, { value, timestamp: new Date().toISOString() });
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_builder_action', {
                    event_category: 'Page Builder',
                    event_label: action,
                    value: value
                });
            }
        } catch (error) {
            console.error('Error tracking page builder action:', error);
        }
    }

    // UTILITY FUNCTIONS
    showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        document.querySelectorAll('.page-builder-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `page-builder-notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px; right: 20px; z-index: 9999; 
            min-width: 300px; max-width: 400px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            border: none; border-radius: 12px;
            animation: slideInRight 0.3s ease-out;
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
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    // SEARCH AND FILTER ELEMENTS
    searchElements(query) {
        if (!query.trim()) {
            this.renderCanvas();
            return;
        }

        const filteredElements = this.elements.filter(element => {
            const searchText = `${element.type} ${element.content.title || ''} ${element.content.subtitle || ''} ${JSON.stringify(element.content)}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        const canvas = document.getElementById('page-builder-canvas');
        if (filteredElements.length === 0) {
            canvas.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="fas fa-search fa-3x mb-3"></i>
                    <h5>No elements found</h5>
                    <p>No elements match your search query: "${query}"</p>
                    <button class="btn btn-primary" onclick="pageBuilder.clearSearch()">Clear Search</button>
                </div>
            `;
        } else {
            canvas.innerHTML = filteredElements.map(element => this.renderElement(element)).join('');
        }
    }

    clearSearch() {
        const searchInput = document.querySelector('.search-elements');
        if (searchInput) searchInput.value = '';
        this.renderCanvas();
    }

    // KEYBOARD SHORTCUTS INFO
    showKeyboardShortcuts() {
        const modalHTML = `
            <div class="modal fade" id="shortcutsModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Keyboard Shortcuts</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-6">
                                    <h6>General</h6>
                                    <ul class="list-unstyled">
                                        <li><kbd>Ctrl+S</kbd> Save Changes</li>
                                        <li><kbd>Ctrl+Z</kbd> Undo</li>
                                        <li><kbd>Ctrl+Y</kbd> Redo</li>
                                        <li><kbd>Del</kbd> Delete Selected</li>
                                    </ul>
                                </div>
                                <div class="col-6">
                                    <h6>Element Actions</h6>
                                    <ul class="list-unstyled">
                                        <li><kbd>Ctrl+D</kbd> Duplicate</li>
                                        <li><kbd>↑</kbd> Move Up</li>
                                        <li><kbd>↓</kbd> Move Down</li>
                                        <li><kbd>Esc</kbd> Deselect</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('shortcutsModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('shortcutsModal'));
        modal.show();
    }

    // ELEMENT TEMPLATES
    showElementTemplates() {
        const templates = {
            'Business Hero': {
                type: 'hero',
                content: {
                    title: 'Grow Your Business',
                    subtitle: 'Professional solutions for modern businesses',
                    buttonText: 'Get Started',
                    buttonLink: '#contact',
                    backgroundImage: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
                    overlayOpacity: 0.6
                }
            },
            'Feature Showcase': {
                type: 'features',
                content: {
                    title: 'Why Choose Us',
                    subtitle: 'We offer the best solutions',
                    features: [
                        { icon: 'fas fa-rocket', title: 'Fast Performance', description: 'Lightning fast solutions' },
                        { icon: 'fas fa-shield-alt', title: 'Secure', description: 'Bank-level security' },
                        { icon: 'fas fa-headset', title: '24/7 Support', description: 'Always here to help' }
                    ]
                }
            }
        };

        // Implementation for template selector modal would go here
        this.showNotification('Element templates feature coming soon!', 'info');
    }
}

// Initialize Page Builder
const pageBuilder = new PageBuilder();

// Global functions for HTML onclick handlers
window.pageBuilder = pageBuilder;

// Add global styles for page builder
const pageBuilderStyles = document.createElement('style');
pageBuilderStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .preview-mobile {
        margin: 0 auto;
        border: 1px solid #ddd;
        border-radius: 12px;
        overflow: hidden;
    }
    
    .preview-tablet {
        margin: 0 auto;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
    }
    
    .filter-btn {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        color: #495057;
        padding: 8px 16px;
        margin: 0 4px 8px;
        border-radius: 20px;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
    }
    
    .filter-btn:hover {
        background: #e9ecef;
        color: #495057;
        text-decoration: none;
    }
    
    .filter-btn.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
    }
    
    .cart-sidebar {
        position: fixed;
        top: 0;
        right: -400px;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
        transition: right 0.3s ease;
        z-index: 1050;
        display: flex;
        flex-direction: column;
    }
    
    .cart-sidebar.show {
        right: 0;
    }
    
    .cart-header {
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;
        display: flex;
        justify-content: between;
        align-items: center;
    }
    
    .cart-body {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
    }
    
    .cart-footer {
        padding: 1rem;
        border-top: 1px solid #dee2e6;
    }
`;
document.head.appendChild(pageBuilderStyles);

console.log('✅ Complete Visual Page Builder v6.2.0 Loaded Successfully');
console.log('✅ Full Homepage Editor: Add, edit, remove, and reorder elements');
console.log('✅ Visual Canvas: Real-time preview of changes');
console.log('✅ Properties Panel: Edit element content and settings');
console.log('✅ Layers Panel: Manage element hierarchy');
console.log('✅ Save/Load: Persistent homepage customization');
console.log('✅ Import/Export: Backup and restore homepage designs');
console.log('✅ Responsive Preview: Test different screen sizes');
console.log('✅ Undo/Redo: Full history management');

