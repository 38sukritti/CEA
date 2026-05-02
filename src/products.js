import gsap from 'gsap';

export function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'p1';

  const productData = {
    p1: {
      name: "Rainy Flowers",
      notes: "Floral · Fresh · Calm",
      price: "99",
      quantityInfo: "1 Bottle",
      shippingInfo: "Free delivery northern UAE- Dubai, Sharjah, Ajman, Umm Al Khaimmah, Umm Al Quwain. Delivery Charges- 30 aed for rest of UAE.",
      desc: "A delicate blend of fresh flowers and soft citrus notes that brings the feeling of rain-kissed petals into your home.",
      img: "/images/rainyflowers.jpeg",
      gallery: ["/images/rainyflowers.jpeg", "/images/rainyflowers2.jpeg", "/images/rainyflowers3.jpeg", "/images/rainyflowers4.jpeg"],
      reviews: [
        { user: "Sarah J.", text: '"The Rainy Flowers scent is absolutely divine! It freshens up my entire home with such a natural vibe."' },
        { user: "James L.", text: '"Warm Pearl is my favorite for cozy evenings. So calming and elegant. Highly recommended!"' },
        { user: "Priya M.", text: '"Musk Rivers gives such a luxurious and soothing vibe. The quality is unmatched by any other spray."' }
      ]
    },
    p2: {
      name: "Musk Rivers",
      notes: "Woody · Musk · Warm",
      price: "99",
      quantityInfo: "1 Bottle",
      shippingInfo: "Free delivery northern UAE- Dubai, Sharjah, Ajman, Umm Al Khaimmah, Umm Al Quwain. Delivery Charges- 30 aed for rest of UAE.",
      desc: "A sophisticated, deep woodland essence intertwining raw musk with twilight amber for a truly relaxing atmosphere.",
      img: "/images/muskrivers.jpeg",
      gallery: ["/images/muskrivers.jpeg", "/images/muskrivers2.jpeg", "/images/muskrivers3.jpeg", "/images/muskrivers4.jpeg"],
      reviews: [
        { user: "Michael R.", text: '"Musk Rivers is the most sophisticated spray I have ever used. It feels like a high-end spa in my living room."' },
        { user: "Elena P.", text: '"I love how the musk isn\'t overpowering. It\'s perfectly balanced with the woody notes."' },
        { user: "David S.", text: '"Simply the best. Long-lasting and very high quality. Will definitely buy again."' }
      ]
    },
    p3: {
      name: "Warm Pearl",
      notes: "Soft · Warm · Elegant",
      price: "99",
      quantityInfo: "1 Bottle",
      shippingInfo: "Free delivery northern UAE- Dubai, Sharjah, Ajman, Umm Al Khaimmah, Umm Al Quwain. Delivery Charges- 30 aed for rest of UAE.",
      desc: "A luxurious caress of vanilla pearl and soft cashmere woods, transforming any space into an elegant retreat.",
      img: "/images/warmPearl.jpeg",
      gallery: ["/images/warmPearl.jpeg", "/images/warmpearl2.jpeg", "/images/warmpearl3.jpeg", "/images/warmPearl4.jpeg"],
      reviews: [
        { user: "Sophia K.", text: '"Warm Pearl is exactly as described—soft, warm, and extremely elegant. It\'s my go-to for reading sessions."' },
        { user: "Liam T.", text: '"Best gift I ever received. The vanilla notes are so natural, not synthetic at all."' },
        { user: "Ava N.", text: '"I use it in my bedroom every night. It creates such a calming environment."' }
      ]
    },
    p4: {
      name: "Based on Musk",
      notes: "Signature · Collection · Musk",
      price: "280",
      quantityInfo: "Set of 3 Perfumes",
      shippingInfo: "Free delivery northern UAE- Dubai, Sharjah, Ajman, Umm Al Khaimmah, Umm Al Quwain. Delivery Charges- 30 aed for rest of UAE.",
      desc: "Our exclusive 'Based on Musk' collection features three unique interpretations of musk, curated to provide a layered and long-lasting aromatic experience.",
      img: "/images/all.jpeg",
      gallery: ["/images/all.jpeg", "/images/rainyflowers.jpeg", "/images/muskrivers.jpeg", "/images/warmPearl.jpeg"],
      reviews: [
        { user: "Nora A.", text: '"Getting three perfumes at this price is a steal! Each one is better than the last."' },
        { user: "Omar K.", text: '"The perfect gift set. The musk notes are so refined and high-end."' },
        { user: "Fatima S.", text: '"I love the variety in this collection. It covers every mood and occasion."' }
      ]
    }
  };

  const data = productData[productId];
  if (!data) return;

  // Populate basic info
  document.getElementById('breadcrumb-current').textContent = data.name;
  document.getElementById('detail-title').innerHTML = data.name.split(' ').join('<br>') + (data.name.includes('Collection') ? '' : '<br>Home Spray');
  document.getElementById('detail-notes').textContent = data.notes;
  document.getElementById('detail-desc').textContent = data.desc;
  document.getElementById('main-product-img').src = data.img;

  // New info: Price & Shipping
  if (document.getElementById('detail-price')) {
    document.getElementById('detail-price').innerHTML = `<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' style='vertical-align: middle; margin-right: 5px;'><path d='M7 5h5a7 7 0 0 1 0 14H7V5z'/><path d='M4 10h16'/><path d='M4 14h16'/></svg>${data.price}`;
  }
  if (document.getElementById('detail-shipping')) {
    document.getElementById('detail-shipping').textContent = data.shippingInfo;
  }
  if (document.getElementById('detail-qty-info')) {
    document.getElementById('detail-qty-info').textContent = data.quantityInfo;
  }

  // Update gallery thumbnails
  const thumbs = document.querySelectorAll('.gallery-thumb');
  thumbs.forEach((thumb, i) => {
    if (data.gallery[i]) {
      thumb.style.display = 'block'; // Ensure they are visible
      thumb.querySelector('img').src = data.gallery[i];
      thumb.addEventListener('click', () => {
        document.getElementById('main-product-img').src = data.gallery[i];
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        
        // Animation
        gsap.fromTo('#main-product-img', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
      });
    } else {
      thumb.style.display = 'none'; // Hide if no image
    }
  });

  // Update reviews
  data.reviews.forEach((review, i) => {
    const textEl = document.getElementById(`review-text-${i+1}`);
    const userEl = document.getElementById(`review-user-${i+1}`);
    if (textEl) textEl.textContent = review.text;
    if (userEl) userEl.textContent = review.user;
  });

  // Quantity control
  let qty = 1;
  const qtyVal = document.getElementById('qty-val');
  if (qtyVal) {
    document.getElementById('qty-plus').addEventListener('click', () => {
      qty++;
      qtyVal.textContent = qty;
    });
    document.getElementById('qty-minus').addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        qtyVal.textContent = qty;
      }
    });
  }


  // Size selection toggle
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => {
        b.classList.remove('active');
        b.style.borderColor = 'rgba(0,0,0,0.1)';
        b.style.opacity = '0.6';
      });
      btn.classList.add('active');
      btn.style.borderColor = '#2B2C21';
      btn.style.opacity = '1';
    });
  });

  // Add to cart logic
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      if (window.CartManager) {
        const selectedSize = document.querySelector('.size-btn.active')?.textContent || '100ml';
        const cleanPrice = parseFloat(data.price.replace(/[^\d.]/g, ''));
        
        window.CartManager.addItem({
          id: productId,
          name: data.name,
          price: cleanPrice,
          image: data.img,
          size: selectedSize,
          quantity: qty
        });
        
        // Visual feedback
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = 'Added! &nbsp; &check;';
        addToCartBtn.style.background = '#4A5D23';
        setTimeout(() => {
          addToCartBtn.innerHTML = originalText;
          addToCartBtn.style.background = '#3C4223';
        }, 2000);
      }
    });
  }

  // Buy Now logic
  const buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      if (window.CartManager) {
        const selectedSize = document.querySelector('.size-btn.active')?.textContent || '100ml';
        const cleanPrice = parseFloat(data.price.replace(/[^\d.]/g, ''));
        
        window.CartManager.addItem({
          id: productId,
          name: data.name,
          price: cleanPrice,
          image: data.img,
          size: selectedSize,
          quantity: qty
        });
        
        // Redirect to checkout immediately
        window.location.href = 'checkout.html';
      }
    });
  }

  // GSAP Entrance
  gsap.from('.reveal-up', {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: '.container',
      start: 'top 80%'
    }
  });
}
