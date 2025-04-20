const DB_NAME = 'pdfHighlighterDB';
const STORE_NAME = 'pdfFiles';
const CONTENT_STORE_NAME = 'pdfContent';
const VERSION = 1;

// Initialize the database
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'url' });
      }
      if (!db.objectStoreNames.contains(CONTENT_STORE_NAME)) {
        db.createObjectStore(CONTENT_STORE_NAME, { keyPath: 'url' });
      }
    };
  });
};

// Save a PDF file to IndexedDB
export const savePDF = async (fileData, fileContent) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME, CONTENT_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const contentStore = transaction.objectStore(CONTENT_STORE_NAME);
    
    // Save metadata
    await new Promise((resolve, reject) => {
      const request = store.put(fileData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Save content
    await new Promise((resolve, reject) => {
      const request = contentStore.put({
        url: fileData.url,
        content: fileContent
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    return fileData;
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw error;
  }
};

// Get all PDF files from IndexedDB
export const getAllPDFs = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting PDFs:', error);
    throw error;
  }
};

// Get a specific PDF file from IndexedDB
export const getPDF = async (url) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME, CONTENT_STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const contentStore = transaction.objectStore(CONTENT_STORE_NAME);
    
    // Get metadata
    const metadata = await new Promise((resolve, reject) => {
      const request = store.get(url);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    // Get content
    const content = await new Promise((resolve, reject) => {
      const request = contentStore.get(url);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (!metadata || !content) {
      throw new Error('PDF not found');
    }

    // Create a new Blob URL for the content
    const blob = new Blob([content.content], { type: 'application/pdf' });
    const newUrl = URL.createObjectURL(blob);

    return {
      ...metadata,
      url: newUrl
    };
  } catch (error) {
    console.error('Error getting PDF:', error);
    throw error;
  }
};

// Delete a PDF file from IndexedDB
export const deletePDF = async (url) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME, CONTENT_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const contentStore = transaction.objectStore(CONTENT_STORE_NAME);
    
    // Delete metadata
    await new Promise((resolve, reject) => {
      const request = store.delete(url);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Delete content
    await new Promise((resolve, reject) => {
      const request = contentStore.delete(url);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    throw error;
  }
}; 