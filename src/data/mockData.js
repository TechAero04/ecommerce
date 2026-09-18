// Mock Database for BHARAT D2C Marketplace

export const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: 'ShoppingBag' },
  { id: 'fashion', name: 'Artisanal Fashion', icon: 'Shirt' },
  { id: 'electronics', name: 'Smart Tech & Audio', icon: 'Headphones' },
  { id: 'home', name: 'Home & Living', icon: 'Home' },
  { id: 'beauty', name: 'Ayurveda & Wellness', icon: 'Sparkles' },
  { id: 'gourmet', name: 'Gourmet Organic Spices', icon: 'Utensils' }
];

export const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Handcrafted Heritage Silk Kurta',
    category: 'fashion',
    price: 3499,
    originalPrice: 5999,
    discount: '41% OFF',
    rating: 4.9,
    reviewCount: 128,
    isNew: true,
    isTrending: true,
    stock: 14,
    sku: 'BHR-FASH-001',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Exquisite hand-woven raw silk kurta crafted by master weavers in Banaras. Features intricate zari threadwork along the neckline and breathable cotton-lining.',
    details: [
      '100% Pure Banarasi Silk',
      'Dry Clean Only',
      'Mandarin collar with hand embroidered detail',
      'Side pockets included',
      'Ethically sourced craftsmanship'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Royal Crimson', hex: '#8B0000' },
      { name: 'Imperial Gold', hex: '#DAA520' },
      { name: 'Midnight Blue', hex: '#191970' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Acoustic Clarity Wireless Headphones',
    category: 'electronics',
    price: 4999,
    originalPrice: 8999,
    discount: '44% OFF',
    rating: 4.8,
    reviewCount: 340,
    isNew: false,
    isTrending: true,
    stock: 22,
    sku: 'BHR-ELEC-002',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Active Noise Cancellation (ANC) wireless over-ear headphones with 45-hour battery playback, ultra-low latency, and custom tuned 40mm beryllium drivers.',
    details: [
      'Hybrid Active Noise Cancellation (-38dB)',
      'Bluetooth v5.3 with multipoint connection',
      'Fast charge: 10 mins charge = 5 hrs playtime',
      'Built-in Quad-Mic with AI voice clarity'
    ],
    sizes: ['Standard'],
    colors: [
      { name: 'Matte Onyx', hex: '#1C1C1C' },
      { name: 'Rose Metallic', hex: '#B76E79' },
      { name: 'Silver Frost', hex: '#D3D3D3' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Hand-Carved Sheesham Wood Desk Lamp',
    category: 'home',
    price: 2299,
    originalPrice: 3499,
    discount: '34% OFF',
    rating: 4.7,
    reviewCount: 89,
    isNew: true,
    isTrending: false,
    stock: 8,
    sku: 'BHR-HOME-003',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sustainable Indian Sheesham wood base with a warm warm linen drum shade. Ideal for modern home offices, bedside reading, and ambient living room lighting.',
    details: [
      '100% Solid Indian Rosewood (Sheesham)',
      'Standard E27 brass bulb holder',
      'Woven fabric cord with inline touch dimmer',
      'Eco-friendly lacquer finish'
    ],
    sizes: ['Medium', 'Large'],
    colors: [
      { name: 'Warm Walnut', hex: '#5C4033' },
      { name: 'Natural Oak', hex: '#C19A6B' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Organic Kumkumadi Radiance Face Serum',
    category: 'beauty',
    price: 1850,
    originalPrice: 2499,
    discount: '25% OFF',
    rating: 4.9,
    reviewCount: 412,
    isNew: false,
    isTrending: true,
    stock: 45,
    sku: 'BHR-WELL-004',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597261-8332570544c0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Authentic 26-herb Ayurvedic formulation enriched with Kashmir Saffron, Sandalwood, and Lotus extracts. Brightens skin tone, reduces pigmentation, and improves elasticity.',
    details: [
      '100% Cold-Pressed Organic Base Oils',
      'Cruelty-Free & Dermatologically Tested',
      'Free from Paraben, Mineral Oil & Sulfates',
      'Suitable for all skin types'
    ],
    sizes: ['30ml', '50ml'],
    colors: []
  },
  {
    id: 'prod-5',
    name: 'Kashmiri Organic Saffron & Cardamom Gift Box',
    category: 'gourmet',
    price: 2999,
    originalPrice: 3999,
    discount: '25% OFF',
    rating: 5.0,
    reviewCount: 76,
    isNew: true,
    isTrending: true,
    stock: 19,
    sku: 'BHR-GOUR-005',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Grade A+ Mongra Kashmiri Saffron (5g) and handpicked Idukki Green Cardamom pods in a handcrafted brass gift box.',
    details: [
      'ISO 3632 Category 1 Certified Saffron',
      'Lab tested for crocin color potency',
      'Air-tight brass keepsake container',
      'Directly sourced from Pampore farmers'
    ],
    sizes: ['Standard Box'],
    colors: []
  },
  {
    id: 'prod-6',
    name: 'Pure Brass Hammered Water Vessel (1000ml)',
    category: 'home',
    price: 1599,
    originalPrice: 2200,
    discount: '27% OFF',
    rating: 4.8,
    reviewCount: 195,
    isNew: false,
    isTrending: false,
    stock: 30,
    sku: 'BHR-HOME-006',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Traditional heavy-gauge pure copper water bottle with leak-proof brass cap. Naturally alkalizes water and detoxifies your daily hydration routine.',
    details: [
      '100% Pure High Grade Copper',
      'Silicone seal leak-proof cap',
      'Capacity: 1 Litre',
      'Jointless seamless construction'
    ],
    sizes: ['750ml', '1000ml'],
    colors: [
      { name: 'Antique Copper', hex: '#B87333' },
      { name: 'Raw Matte', hex: '#CD7F32' }
    ]
  },
  {
    id: 'prod-7',
    name: 'Smart Ergonomic Fitness Watch Pro',
    category: 'electronics',
    price: 3999,
    originalPrice: 6999,
    discount: '42% OFF',
    rating: 4.6,
    reviewCount: 520,
    isNew: false,
    isTrending: true,
    stock: 60,
    sku: 'BHR-ELEC-007',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    description: '1.85-inch AMOLED curved display smartwatch with Bluetooth calling, SpO2 & Heart Rate tracking, 100+ sport modes, and 10-day battery stamina.',
    details: [
      '1.85-inch 60Hz AMOLED HD Screen',
      'IP68 Dust & Water Resistant',
      'Continuous SpO2 & Stress Monitor',
      'Over 200 custom watch faces'
    ],
    sizes: ['44mm'],
    colors: [
      { name: 'Space Black', hex: '#0F0F0F' },
      { name: 'Midnight Blue', hex: '#1E293B' },
      { name: 'Starlight Gold', hex: '#F1F5F9' }
    ]
  },
  {
    id: 'prod-8',
    name: 'Handcrafted Terracotta Ceramic Tea Set',
    category: 'home',
    price: 1499,
    originalPrice: 2199,
    discount: '31% OFF',
    rating: 4.9,
    reviewCount: 154,
    isNew: true,
    isTrending: false,
    stock: 12,
    sku: 'BHR-HOME-008',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Set of 6 kulhad tea cups with a teapot, hand-thrown by rural studio potters using non-toxic natural clay and food-safe matte glaze.',
    details: [
      'Microwave & Dishwasher Safe',
      'Lead-free natural ceramic glaze',
      'Teapot capacity: 600ml',
      'Cups: 150ml each'
    ],
    sizes: ['Set of 6'],
    colors: []
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2 days ago',
    verified: true,
    comment: 'The quality of the Banarasi silk is unbelievable for this price point! Arrived in a premium eco-friendly gift box within 48 hours.'
  },
  {
    id: 'rev-2',
    author: 'Priya Mukherjee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '1 week ago',
    verified: true,
    comment: 'BHARAT platform experience was so smooth. The active noise canceling on these headphones is as good as premium Sony/Bose ones.'
  },
  {
    id: 'rev-3',
    author: 'Vikramaditya Roy',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 4,
    date: '2 weeks ago',
    verified: true,
    comment: 'The Sheesham wood lamp has added so much warmth to my desk setup. High quality craftsmanship.'
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-98421',
    date: '2026-09-15',
    items: [
      {
        id: 'prod-1',
        name: 'Handcrafted Heritage Silk Kurta',
        price: 3499,
        quantity: 1,
        color: 'Royal Crimson',
        size: 'L',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      }
    ],
    total: 3499,
    status: 'In Transit',
    statusStep: 3, // 1: Placed, 2: Packed, 3: In Transit, 4: Delivered
    paymentMethod: 'UPI (Google Pay)',
    shippingAddress: '402 Sunrise Towers, Indiranagar, Bengaluru, KA 560038',
    trackingNumber: 'DEL-99482710'
  },
  {
    id: 'ORD-87104',
    date: '2026-08-28',
    items: [
      {
        id: 'prod-4',
        name: 'Organic Kumkumadi Radiance Face Serum',
        price: 1850,
        quantity: 2,
        size: '30ml',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
      }
    ],
    total: 3700,
    status: 'Delivered',
    statusStep: 4,
    paymentMethod: 'Credit Card (HDFC **** 8821)',
    shippingAddress: '402 Sunrise Towers, Indiranagar, Bengaluru, KA 560038',
    trackingNumber: 'BLR-10293847'
  }
];

export const MOCK_USER = {
  name: 'Rajesh Malhotra',
  email: 'rajesh.m@bharat.in',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  memberSince: 'January 2025',
  rewardPoints: 1450,
  addresses: [
    {
      id: 'addr-1',
      isDefault: true,
      label: 'Home',
      name: 'Rajesh Malhotra',
      street: '402 Sunrise Towers, 10th Main Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      phone: '+91 98765 43210'
    },
    {
      id: 'addr-2',
      isDefault: false,
      label: 'Office',
      name: 'Rajesh Malhotra',
      street: '8th Floor, TechPark One, Outer Ring Road, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      phone: '+91 98765 43210'
    }
  ]
};

export const MOCK_FAQS = [
  {
    question: 'How long does delivery take across India?',
    answer: 'Standard delivery takes 2-4 business days for metro cities and 4-6 business days for rest of India. Express 24-hour shipping is available in selected metro pincodes.'
  },
  {
    question: 'What is BHARAT’s Return and Exchange policy?',
    answer: 'We offer a hassle-free 7-day return and exchange policy. Items must be unused, unwashed, and in original packaging with intact tags.'
  },
  {
    question: 'Are all products authentic and ethically sourced?',
    answer: 'Yes! Every artisanal product, spice, and craft is directly sourced from certified weavers, GI-tagged artisan cooperatives, and verified organic farms.'
  },
  {
    question: 'Which payment methods do you accept?',
    answer: 'We accept all major Indian payment options: UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), NetBanking (50+ banks), and Cash on Delivery (COD).'
  },
  {
    question: 'How do I earn and redeem BHARAT Reward Points?',
    answer: 'You earn 10 reward points for every ₹100 spent. Points can be redeemed at checkout for instant cash discounts (100 Points = ₹10).'
  }
];

export const MOCK_COUPONS = [
  { code: 'BHARAT10', discountPercent: 10, minSpend: 1000, description: '10% OFF on orders over ₹1,000' },
  { code: 'FESTIVE20', discountPercent: 20, minSpend: 2500, description: '20% OFF on Artisanal & Fashion items' }
];
