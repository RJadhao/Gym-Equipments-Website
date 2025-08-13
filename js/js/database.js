// COMPLETE DATABASE SYSTEM - WORKING WITH BOTH INDEXEDDB AND LOCALSTORAGE
class WebAppDatabase {
    constructor() {
        this.dbName = 'JadhaoIndustriesDB';
        this.version = 1;
        this.db = null;
        this.isInitialized = false;
        this.useIndexedDB = typeof window !== 'undefined' && 'indexedDB' in window;
        
        console.log('Database system initialized - Using:', this.useIndexedDB ? 'IndexedDB' : 'localStorage');
    }

    async initialize() {
        if (this.isInitialized) return true;

        try {
            if (this.useIndexedDB) {
                await this.initIndexedDB();
            } else {
                this.initLocalStorage();
            }
            this.isInitialized = true;
            console.log('✅ Database initialized successfully');
            return true;
        } catch (error) {
            console.error('Database initialization failed:', error);
            this.useIndexedDB = false;
            this.initLocalStorage();
            this.isInitialized = true;
            return true;
        }
    }

    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const stores = [
                    'users', 'products', 'orders', 'contacts', 
                    'settings', 'categories', 'newsletter', 'pages'
                ];

                stores.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, { keyPath: 'id' });
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                });
            };
        });
    }

    initLocalStorage() {
        const defaultStores = {
            'jadhao_users': [],
            'jadhao_products': [],
            'jadhao_orders': [],
            'jadhao_contact_inquiries': [],
            'jadhao_settings': {},
            'jadhao_product_categories': [],
            'jadhao_newsletter_subscribers': [],
            'jadhao_pages': [],
            'jadhao_cart': [],
            'jadhao_wishlist': []
        };

        Object.keys(defaultStores).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(defaultStores[key]));
            }
        });
    }

    async store(storeName, data) {
        try {
            data.timestamp = data.timestamp || new Date().toISOString();
            data.id = data.id || this.generateId();

            if (this.useIndexedDB && this.db) {
                return await this.indexedDBStore(storeName, data);
            } else {
                return this.localStorageStore(storeName, data);
            }
        } catch (error) {
            console.error('Store operation failed:', error);
            return this.localStorageStore(storeName, data);
        }
    }

    async indexedDBStore(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(request.error);
        });
    }

    localStorageStore(storeName, data) {
        const key = `jadhao_${storeName}`;
        let items = JSON.parse(localStorage.getItem(key) || '[]');
        
        if (Array.isArray(items)) {
            const existingIndex = items.findIndex(item => item.id === data.id);
            if (existingIndex !== -1) {
                items[existingIndex] = data;
            } else {
                items.unshift(data);
            }
        } else {
            items = data;
        }

        localStorage.setItem(key, JSON.stringify(items));
        return data;
    }

    async retrieve(storeName, id = null) {
        try {
            if (this.useIndexedDB && this.db) {
                return await this.indexedDBRetrieve(storeName, id);
            } else {
                return this.localStorageRetrieve(storeName, id);
            }
        } catch (error) {
            console.error('Retrieve operation failed:', error);
            return this.localStorageRetrieve(storeName, id);
        }
    }

    async indexedDBRetrieve(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            
            if (id) {
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } else {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            }
        });
    }

    localStorageRetrieve(storeName, id) {
        const key = `jadhao_${storeName}`;
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        
        if (id) {
            return Array.isArray(items) ? items.find(item => item.id === id) : null;
        }
        return items;
    }

    async delete(storeName, id) {
        try {
            if (this.useIndexedDB && this.db) {
                return await this.indexedDBDelete(storeName, id);
            } else {
                return this.localStorageDelete(storeName, id);
            }
        } catch (error) {
            console.error('Delete operation failed:', error);
            return this.localStorageDelete(storeName, id);
        }
    }

    async indexedDBDelete(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    localStorageDelete(storeName, id) {
        const key = `jadhao_${storeName}`;
        let items = JSON.parse(localStorage.getItem(key) || '[]');
        
        if (Array.isArray(items)) {
            items = items.filter(item => item.id !== id);
            localStorage.setItem(key, JSON.stringify(items));
        }
        
        return true;
    }

    generateId() {
        return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    async clear(storeName) {
        try {
            if (this.useIndexedDB && this.db) {
                return await this.indexedDBClear(storeName);
            } else {
                return this.localStorageClear(storeName);
            }
        } catch (error) {
            console.error('Clear operation failed:', error);
            return this.localStorageClear(storeName);
        }
    }

    async indexedDBClear(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    localStorageClear(storeName) {
        const key = `jadhao_${storeName}`;
        localStorage.setItem(key, JSON.stringify([]));
        return true;
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.WebAppDatabase = WebAppDatabase;
}
