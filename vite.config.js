import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        contact: resolve(__dirname, 'contact.html'),
        story: resolve(__dirname, 'story.html'),
        sustainability: resolve(__dirname, 'sustainability.html'),
        productDetail: resolve(__dirname, 'product-detail.html'),
        checkout: resolve(__dirname, 'checkout.html')
      }
    }
  }
});
