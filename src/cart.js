import gsap from 'gsap';

class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cea_cart')) || [];
    this.isOpen = false;
    this.initDOM();
    this.bindEvents();
    this.updateUI();
  }

  save() {
    localStorage.setItem('cea_cart', JSON.stringify(this.items));
    this.updateUI();
  }

  addItem(product) {
    const existing = this.items.find(i => i.id === product.id && i.size === product.size);
    if (existing) {
      existing.quantity += product.quantity;
    } else {
      this.items.push(product);
    }
    this.save();
    this.open();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.save();
  }

  updateQuantity(index, delta) {
    if (this.items[index]) {
      this.items[index].quantity += delta;
      if (this.items[index].quantity <= 0) {
        this.removeItem(index);
      } else {
        this.save();
      }
    }
  }

  initDOM() {
    // Inject Sidebar HTML globally
    const sidebarHTML = `
      <div id="cart-overlay" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:99990; opacity:0; pointer-events:none; backdrop-filter:blur(5px);"></div>
      <div id="cart-sidebar" style="position:fixed; top:0; right:0; width:400px; max-width:100vw; height:100vh; background:var(--olive-darker); color:var(--beige-light); z-index:99991; transform:translateX(100%); display:flex; flex-direction:column; box-shadow:-20px 0 50px rgba(0,0,0,0.5);">
         <div style="padding: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center;">
           <h2 class="font-serif" style="font-size: 2rem;">Your Bag</h2>
           <button id="close-cart" style="background:none; border:none; color:inherit; font-size: 2rem; cursor:pointer;">&times;</button>
         </div>
         <div id="cart-items" style="flex:1; overflow-y:auto; padding: 2rem; display:flex; flex-direction:column; gap: 1.5rem;">
           <!-- items injected here -->
         </div>
         <div style="padding: 2rem; border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2);">
           <div class="flex justify-between text-sans" style="margin-bottom: 1.5rem; font-size: 1.1rem;">
             <span>Subtotal</span>
             <strong id="cart-total"><svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' style='vertical-align: middle; margin-right: 3px;'><path d='M7 5h5a7 7 0 0 1 0 14H7V5z'/><path d='M4 10h16'/><path d='M4 14h16'/></svg>0.00</strong>
           </div>
            <button id="checkout-btn" class="btn" style="width:100%; background:var(--beige-light); color:var(--olive-darker); border:none; padding:1.2rem; font-weight:500;">Checkout &nbsp; &rarr;</button>
         </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', sidebarHTML);
    this.overlay = document.getElementById('cart-overlay');
    this.sidebar = document.getElementById('cart-sidebar');
    this.itemsContainer = document.getElementById('cart-items');
    this.totalDOM = document.getElementById('cart-total');

    // Add badge to header carts
    const cartBtns = document.querySelectorAll('.cart-trigger');
    cartBtns.forEach(btn => {
      if(!btn.querySelector('.cart-badge')) {
        btn.style.position = 'relative';
        btn.insertAdjacentHTML('beforeend', `<span class="cart-badge text-sans" style="position:absolute; top:-5px; right:-8px; background:var(--gold-accent); color:var(--olive-darker); width:18px; height:18px; border-radius:50%; font-size:0.65rem; display:flex; align-items:center; justify-content:center; font-weight:600;">0</span>`);
      }
    });
  }

  bindEvents() {
    const cartBtns = document.querySelectorAll('.cart-trigger');
    cartBtns.forEach(btn => btn.addEventListener('click', () => this.open()));
    
    document.getElementById('close-cart').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());
    document.getElementById('checkout-btn').addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });

    // Event delegation for items
    this.itemsContainer.addEventListener('click', (e) => {
      const idx = e.target.closest('.cart-item')?.dataset?.index;
      if (idx === undefined) return;
      
      if (e.target.classList.contains('cart-plus')) {
        this.updateQuantity(parseInt(idx), 1);
      } else if (e.target.classList.contains('cart-minus')) {
        this.updateQuantity(parseInt(idx), -1);
      } else if (e.target.closest('.cart-remove')) {
        this.removeItem(parseInt(idx));
      }
    });
  }

  open() {
    if(this.isOpen) return;
    this.isOpen = true;
    gsap.to(this.overlay, { opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' });
    gsap.to(this.sidebar, { x: '0%', duration: 0.5, ease: 'power4.out' });
  }

  close() {
    if(!this.isOpen) return;
    this.isOpen = false;
    gsap.to(this.overlay, { opacity: 0, pointerEvents: 'none', duration: 0.4, ease: 'power2.in' });
    gsap.to(this.sidebar, { x: '100%', duration: 0.4, ease: 'power3.in' });
  }

  updateUI() {
    let totalItems = 0;
    let totalPrice = 0;

    if (this.items.length === 0) {
      this.itemsContainer.innerHTML = `<div class="text-sans" style="opacity:0.5; text-align:center; margin-top:2rem;">Your bag is empty.</div>`;
    } else {
      this.itemsContainer.innerHTML = this.items.map((item, index) => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
        return `
          <div class="cart-item flex" data-index="${index}" style="gap: 1.5rem; align-items:center;">
             <div style="width: 80px; height: 100px; background:#e8e8e8; border-radius:8px; overflow:hidden;">
               <img src="${item.image}" style="width:100%; height:100%; object-fit:cover;" />
             </div>
             <div style="flex:1;">
               <div class="flex justify-between" style="margin-bottom:0.2rem;">
                  <strong class="font-serif" style="font-size:1.2rem;">${item.name}</strong>
                  <button class="cart-remove" style="background:none; border:none; color:inherit; opacity:0.5; cursor:pointer; font-size:1.2rem;">&times;</button>
               </div>
               <div class="text-sans" style="font-size:0.8rem; opacity:0.6; margin-bottom: 0.8rem;">${item.size}</div>
               <div class="flex justify-between items-center">
                  <div style="display:flex; align-items:center; border:1px solid rgba(255,255,255,0.1); border-radius:2rem; padding: 0.2rem 0.5rem; gap:0.5rem;">
                     <button class="cart-minus" style="background:none; border:none; color:inherit; cursor:pointer;">&minus;</button>
                     <span class="text-sans" style="font-size:0.85rem; width:20px; text-align:center;">${item.quantity}</span>
                     <button class="cart-plus" style="background:none; border:none; color:inherit; cursor:pointer;">&plus;</button>
                  </div>
                  <strong class="text-sans"><svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' style='vertical-align: middle; margin-right: 3px;'><path d='M7 5h5a7 7 0 0 1 0 14H7V5z'/><path d='M4 10h16'/><path d='M4 14h16'/></svg>${(item.price * item.quantity).toFixed(2)}</strong>
               </div>
             </div>
          </div>
        `;
      }).join('');
    }

    this.totalDOM.innerHTML = `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' style='vertical-align: middle; margin-right: 3px;'><path d='M7 5h5a7 7 0 0 1 0 14H7V5z'/><path d='M4 10h16'/><path d='M4 14h16'/></svg>${totalPrice.toFixed(2)}`;
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.innerText = totalItems;
      if(totalItems > 0) {
        gsap.fromTo(badge, {scale:1.5}, {scale:1, duration:0.4, ease:"back.out(2)"});
      }
    });
  }
}

// Instantiate globally
window.CartManager = new Cart();
