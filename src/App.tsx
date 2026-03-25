import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ShoppingBag, X, Plus, Minus, MapPin, User, Info, Phone, Settings, Trash2, Upload, Edit2, PlayCircle } from 'lucide-react';

const CATEGORIES = ["Tous", "Visage", "Corps", "Sérums", "Packs & Coffrets"];

const DEFAULT_VIDEOS = [
  { id: 1, title: "Routine Soin du Visage", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Découvrez notre routine complète pour une peau éclatante." }
];

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Sérum Éclat à la Vitamine C", category: "Sérums", price: 15000, description: "Illumine le teint et réduit les taches.", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Sérum Anti-Âge Nuit", category: "Sérums", price: 18000, description: "Répare et régénère la peau pendant le sommeil.", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Crème Hydratante Essentielle", category: "Visage", price: 12000, description: "Hydratation profonde 24h pour peaux sèches.", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Gel Nettoyant Purifiant", category: "Visage", price: 8500, description: "Nettoie en douceur et élimine les impuretés.", image: "https://images.unsplash.com/photo-1541823709867-1b206113eafd?auto=format&fit=crop&q=80&w=800" },
];

const DELIVERY_ZONES = [
  { id: 'abidjan', name: "Abidjan (Commune à préciser)", price: 2000 },
  { id: 'interieur', name: "Intérieur de la Côte d'Ivoire", price: 4000 },
  { id: 'international', name: "International (Europe/Afrique/USA)", price: 0, note: "Frais de port calculés après commande" }
];

const WHATSAPP_NUMBER = "2250758826786";
const BRAND_NAME = "WAB Store";

export default function App() {
  // --- State ---
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [cart, setCart] = useState<{product: any, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout form state
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [deliveryZone, setDeliveryZone] = useState("abidjan");

  // Main Tabs State
  const [activeMainTab, setActiveMainTab] = useState("Boutique");
  const [videos, setVideos] = useState<any[]>([]);

  // CMS State
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [cmsTab, setCmsTab] = useState("Produits");
  const [showAuth, setShowAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [secretClicks, setSecretClicks] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const ADMIN_CODE = "wab2026"; // Code d'accès au CMS

  // New Product Form State
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Visage");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("");

  // New Video Form State
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
  const [newVidTitle, setNewVidTitle] = useState("");
  const [newVidUrl, setNewVidUrl] = useState("");
  const [newVidDesc, setNewVidDesc] = useState("");

  // --- Effects ---
  useEffect(() => {
    // Load products from localStorage on mount
    const savedProducts = localStorage.getItem('wab_store_products');
    if (savedProducts) {
      try {
        let parsed = JSON.parse(savedProducts);
        let updated = false;
        
        // Migration: update old placeholder images to new cosmetic images
        parsed = parsed.map((p: any) => {
          if (p.id === 1 && p.image.includes('picsum.photos')) { updated = true; return { ...p, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800" }; }
          if (p.id === 2 && p.image.includes('picsum.photos')) { updated = true; return { ...p, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=800" }; }
          if (p.id === 3 && (p.image.includes('picsum.photos') || p.image.includes('1611078489935-0cb964de46d6'))) { updated = true; return { ...p, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800" }; }
          if (p.id === 4 && (p.image.includes('picsum.photos') || p.image.includes('1556228578-0d85b1a4d571') || p.image.includes('1531123897727-8f129e1bf98c'))) { updated = true; return { ...p, image: "https://images.unsplash.com/photo-1541823709867-1b206113eafd?auto=format&fit=crop&q=80&w=800" }; }
          return p;
        });

        setProducts(parsed);
        
        if (updated) {
          localStorage.setItem('wab_store_products', JSON.stringify(parsed));
        }
      } catch (e) {
        setProducts(DEFAULT_PRODUCTS);
      }
    } else {
      setProducts(DEFAULT_PRODUCTS);
    }

    // Load videos
    const savedVideos = localStorage.getItem('wab_store_videos');
    if (savedVideos) {
      try {
        setVideos(JSON.parse(savedVideos));
      } catch (e) {
        setVideos(DEFAULT_VIDEOS);
      }
    } else {
      setVideos(DEFAULT_VIDEOS);
    }
  }, []);

  const saveProducts = (updatedProducts: any[]) => {
    setProducts(updatedProducts);
    try {
      localStorage.setItem('wab_store_products', JSON.stringify(updatedProducts));
    } catch (e) {
      alert("Erreur: L'image est peut-être trop volumineuse pour le stockage local. Essayez une image plus petite.");
    }
  };

  // --- Secret CMS Trigger ---
  const handleSecretClick = () => {
    setSecretClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowAuth(true);
        return 0;
      }
      return newCount;
    });

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => setSecretClicks(0), 2000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_CODE) {
      setShowAuth(false);
      setIsCmsOpen(true);
      setAdminPassword("");
    } else {
      alert("Code incorrect");
    }
  };

  // --- CMS Functions ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setNewProdName("");
    setNewProdCategory("Visage");
    setNewProdPrice("");
    setNewProdDesc("");
    setNewProdImage("");
    setEditingProductId(null);
  };

  const handleEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setNewProdName(product.name);
    setNewProdCategory(product.category);
    setNewProdPrice(product.price.toString());
    setNewProdDesc(product.description || "");
    setNewProdImage(product.image);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdImage) {
      alert("Veuillez remplir le nom, le prix et ajouter une image.");
      return;
    }

    if (editingProductId) {
      const updatedProducts = products.map(p => 
        p.id === editingProductId 
          ? { ...p, name: newProdName, category: newProdCategory, price: parseInt(newProdPrice, 10), description: newProdDesc, image: newProdImage }
          : p
      );
      saveProducts(updatedProducts);
      
      setCart(prev => prev.map(item => 
        item.product.id === editingProductId 
          ? { ...item, product: { ...item.product, name: newProdName, category: newProdCategory, price: parseInt(newProdPrice, 10), description: newProdDesc, image: newProdImage } }
          : item
      ));
    } else {
      const newProduct = {
        id: Date.now(),
        name: newProdName,
        category: newProdCategory,
        price: parseInt(newProdPrice, 10),
        description: newProdDesc,
        image: newProdImage
      };
      saveProducts([newProduct, ...products]);
    }
    
    resetForm();
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Supprimer ce produit ?")) {
      saveProducts(products.filter(p => p.id !== id));
      // Remove from cart if exists
      setCart(prev => prev.filter(item => item.product.id !== id));
    }
  };

  const saveVideos = (updatedVideos: any[]) => {
    setVideos(updatedVideos);
    localStorage.setItem('wab_store_videos', JSON.stringify(updatedVideos));
  };

  const resetVideoForm = () => {
    setNewVidTitle("");
    setNewVidUrl("");
    setNewVidDesc("");
    setEditingVideoId(null);
  };

  const handleEditVideo = (video: any) => {
    setEditingVideoId(video.id);
    setNewVidTitle(video.title);
    setNewVidUrl(video.url);
    setNewVidDesc(video.description || "");
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVidTitle || !newVidUrl) {
      alert("Veuillez remplir le titre et l'URL de la vidéo.");
      return;
    }

    let embedUrl = newVidUrl;
    if (embedUrl.includes("youtube.com/watch?v=")) {
      embedUrl = embedUrl.replace("youtube.com/watch?v=", "youtube.com/embed/");
      const ampersandPosition = embedUrl.indexOf('&');
      if(ampersandPosition !== -1) {
        embedUrl = embedUrl.substring(0, ampersandPosition);
      }
    } else if (embedUrl.includes("youtu.be/")) {
      embedUrl = embedUrl.replace("youtu.be/", "youtube.com/embed/");
    }

    if (editingVideoId) {
      const updatedVideos = videos.map(v => 
        v.id === editingVideoId 
          ? { ...v, title: newVidTitle, url: embedUrl, description: newVidDesc }
          : v
      );
      saveVideos(updatedVideos);
    } else {
      const newVideo = {
        id: Date.now(),
        title: newVidTitle,
        url: embedUrl,
        description: newVidDesc
      };
      saveVideos([newVideo, ...videos]);
    }
    
    resetVideoForm();
  };

  const handleDeleteVideo = (id: number) => {
    if (window.confirm("Supprimer cette vidéo ?")) {
      saveVideos(videos.filter(v => v.id !== id));
    }
  };

  // --- Shop Functions ---
  const filteredProducts = useMemo(() => {
    if (activeCategory === "Tous") return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  const selectedZone = DELIVERY_ZONES.find(z => z.id === deliveryZone);
  const total = subtotal + (selectedZone?.price || 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!customerName || !customerAddress) {
      alert("Veuillez remplir votre nom et adresse de livraison.");
      return;
    }

    let message = `Bonjour ${BRAND_NAME}, Nouvelle commande de : ${customerName}\n---\nProduits :\n`;
    
    cart.forEach(item => {
      message += `- ${item.quantity} x ${item.product.name} (${item.product.price.toLocaleString('fr-FR')} FCFA)\n`;
    });
    
    message += `---\nSous-total : ${subtotal.toLocaleString('fr-FR')} FCFA\n`;
    message += `Livraison : ${selectedZone?.name}\n`;
    
    if (selectedZone?.id === 'international') {
      message += `TOTAL : ${subtotal.toLocaleString('fr-FR')} FCFA + Frais de port à calculer\n`;
    } else {
      message += `TOTAL : ${total.toLocaleString('fr-FR')} FCFA\n`;
    }
    
    message += `Adresse : ${customerAddress}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-20 md:pb-0">
      {/* Top Banner */}
      <div className="bg-brand-accent text-white text-xs md:text-sm text-center py-2 px-4 font-medium tracking-wide">
        Expédition Côte d'Ivoire & International 🌍
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-bg/90 backdrop-blur-md border-b border-brand-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-text tracking-tight">
            {BRAND_NAME}
          </h1>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-brand-text hover:text-brand-accent transition-colors"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20 max-w-7xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-text mb-4 leading-tight">
          Révélez votre <br className="md:hidden" />
          <span className="text-brand-accent italic">beauté naturelle</span>
        </h2>
        <p className="text-brand-text/80 max-w-2xl mx-auto mb-8 text-sm md:text-base">
          Des soins luxueux formulés pour sublimer votre peau. 
          Commandez facilement via WhatsApp et faites-vous livrer partout dans le monde.
        </p>
      </section>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Main Tabs */}
        <div className="flex justify-center gap-8 mb-8 border-b border-brand-accent/10">
          <button 
            onClick={() => setActiveMainTab("Boutique")}
            className={`font-serif text-lg pb-3 px-2 border-b-2 transition-colors ${activeMainTab === "Boutique" ? "border-brand-accent text-brand-text font-medium" : "border-transparent text-brand-text/50 hover:text-brand-text"}`}
          >
            Boutique
          </button>
          <button 
            onClick={() => setActiveMainTab("Tutoriels")}
            className={`font-serif text-lg pb-3 px-2 border-b-2 transition-colors ${activeMainTab === "Tutoriels" ? "border-brand-accent text-brand-text font-medium" : "border-transparent text-brand-text/50 hover:text-brand-text"}`}
          >
            Vidéos Tutoriels
          </button>
        </div>

        {activeMainTab === "Boutique" ? (
          <>
            {/* Categories */}
            <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar gap-3 snap-x">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-start whitespace-nowrap px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-brand-accent text-white shadow-md' 
                  : 'bg-white/50 text-brand-text hover:bg-white border border-brand-accent/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-brand-text/60">
            <p>Aucun produit dans cette catégorie.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
            {filteredProducts.map(product => (
              <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-brand-accent/10">
                <div className="relative aspect-square overflow-hidden bg-brand-bg/50">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-[10px] uppercase tracking-wider text-brand-accent font-semibold mb-1">
                    {product.category}
                  </span>
                  <h3 className="font-serif text-sm md:text-base font-medium text-brand-text mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-brand-text/70 mb-3 line-clamp-2 flex-grow">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="font-semibold text-brand-text">
                      {product.price.toLocaleString('fr-FR')} <span className="text-xs">FCFA</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full bg-brand-bg text-brand-text border border-brand-accent/30 py-2 rounded-xl text-sm font-medium hover:bg-brand-accent hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        ) : (
          <div className="mb-12">
            {videos.length === 0 ? (
              <div className="text-center py-12 text-brand-text/60">
                <p>Aucun tutoriel vidéo pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                  <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-accent/10 flex flex-col">
                    <div className="relative w-full pt-[56.25%] bg-gray-100">
                      <iframe 
                        src={video.url} 
                        title={video.title}
                        className="absolute top-0 left-0 w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-serif text-lg font-medium text-brand-text mb-2">{video.title}</h3>
                      {video.description && (
                         <p className="text-sm text-brand-text/70">{video.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cart Sidebar/Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-brand-text/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          
          <div className="relative w-full max-w-md bg-brand-bg h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-brand-accent/20 bg-white/50">
              <h2 className="font-serif text-xl font-semibold text-brand-text flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Mon Panier
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-brand-text/60 hover:text-brand-text bg-white rounded-full shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-brand-text/60">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Votre panier est vide.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-brand-accent/10">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-20 h-20 object-cover rounded-xl bg-brand-bg/50 mix-blend-multiply"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-sm font-medium text-brand-text line-clamp-2">
                              {item.product.name}
                            </h4>
                            <p className="text-brand-accent font-semibold text-sm mt-1">
                              {item.product.price.toLocaleString('fr-FR')} FCFA
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <button 
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="w-7 h-7 rounded-full bg-brand-bg flex items-center justify-center text-brand-text hover:bg-brand-accent hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="w-7 h-7 rounded-full bg-brand-bg flex items-center justify-center text-brand-text hover:bg-brand-accent hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-accent/10 space-y-4">
                    <h3 className="font-serif font-medium text-brand-text border-b border-brand-accent/10 pb-2">
                      Informations de livraison
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-brand-text/70 mb-1 ml-1">Nom complet</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text/40" />
                          <input 
                            type="text" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ex: Marie Koné"
                            className="w-full pl-9 pr-4 py-2.5 bg-brand-bg/50 border border-brand-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-brand-text/70 mb-1 ml-1">Zone de livraison</label>
                        <select 
                          value={deliveryZone}
                          onChange={(e) => setDeliveryZone(e.target.value)}
                          className="w-full px-4 py-2.5 bg-brand-bg/50 border border-brand-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all appearance-none"
                        >
                          {DELIVERY_ZONES.map(zone => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name} {zone.price > 0 ? `(+${zone.price} FCFA)` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-brand-text/70 mb-1 ml-1">Adresse détaillée</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-brand-text/40" />
                          <textarea 
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            placeholder="Ville, Quartier, Repères..."
                            rows={2}
                            className="w-full pl-9 pr-4 py-2.5 bg-brand-bg/50 border border-brand-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="bg-white border-t border-brand-accent/20 p-4 md:p-6 space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-brand-text/80">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-brand-text/80">
                    <span>Livraison</span>
                    {selectedZone?.id === 'international' ? (
                      <span className="text-xs italic">À calculer</span>
                    ) : (
                      <span>{selectedZone?.price.toLocaleString('fr-FR')} FCFA</span>
                    )}
                  </div>
                  {selectedZone?.id === 'international' && (
                    <div className="flex items-start gap-2 text-[10px] text-brand-accent bg-brand-accent/10 p-2 rounded-lg">
                      <Info className="w-3 h-3 shrink-0 mt-0.5" />
                      <p>Les frais de port internationaux vous seront communiqués sur WhatsApp après validation.</p>
                    </div>
                  )}
                  <div className="flex justify-between font-serif text-lg font-semibold text-brand-text pt-2 border-t border-brand-accent/10">
                    <span>Total</span>
                    <span>
                      {selectedZone?.id === 'international' 
                        ? `${subtotal.toLocaleString('fr-FR')} FCFA` 
                        : `${total.toLocaleString('fr-FR')} FCFA`
                      }
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/20"
                >
                  <Phone className="w-5 h-5" />
                  Commander via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Mobile Floating Cart Button */}
      {!isCartOpen && cartItemCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-text text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-30 animate-in slide-in-from-bottom-10"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="font-medium">{cartItemCount} article(s)</span>
          <div className="w-px h-4 bg-white/30 mx-1" />
          <span className="font-semibold">{subtotal.toLocaleString('fr-FR')} FCFA</span>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-brand-accent/20 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-brand-text/60">
          <p>
            &copy; {new Date().getFullYear()} {BRAND_NAME}. Tous droits réservés.{" "}
            <span 
              onClick={handleSecretClick} 
              className="cursor-pointer select-none hover:text-brand-accent transition-colors"
              title="Mentions Légales"
            >
              Mentions Légales
            </span>
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAuth(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4">Accès Restreint</h3>
            <form onSubmit={handleAuthSubmit}>
              <input 
                type="password" 
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="Code d'accès"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-brand-accent/50 outline-none"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAuth(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm bg-brand-text text-white rounded-lg hover:bg-gray-800">Valider</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden CMS Modal */}
      {isCmsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCmsOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
              <h2 className="font-serif text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5" /> CMS WAB Store (Admin)
              </h2>
              <button onClick={() => setIsCmsOpen(false)} className="p-2 text-gray-400 hover:text-gray-800 bg-white rounded-full shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CMS Tabs */}
            <div className="flex border-b border-gray-100 px-6 pt-2 bg-gray-50">
              <button 
                onClick={() => setCmsTab("Produits")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${cmsTab === "Produits" ? "border-brand-text text-brand-text" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                Produits
              </button>
              <button 
                onClick={() => setCmsTab("Vidéos")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${cmsTab === "Vidéos" ? "border-brand-text text-brand-text" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                Vidéos Tutoriels
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
              {cmsTab === "Produits" ? (
                <>
                  {/* Add Product Form */}
                  <div className="w-full md:w-1/3 space-y-4">
                <h3 className="font-medium text-gray-800 border-b pb-2">
                  {editingProductId ? "Modifier le produit" : "Ajouter un produit"}
                </h3>
                <form onSubmit={handleSaveProduct} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nom du produit</label>
                    <input type="text" required value={newProdName} onChange={e => setNewProdName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-accent/50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Catégorie</label>
                    <select value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-accent/50 outline-none">
                      {CATEGORIES.filter(c => c !== "Tous").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Prix (FCFA)</label>
                    <input type="number" required min="0" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-accent/50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea rows={2} value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-accent/50 outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Image (Upload)</label>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      {newProdImage ? (
                        <div className="flex flex-col items-center">
                          <img src={newProdImage} alt="Preview" className="h-16 object-contain mb-2 rounded" />
                          <span className="text-xs text-green-600 font-medium">Image chargée</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <Upload className="w-6 h-6 mb-1" />
                          <span className="text-xs">Cliquez pour choisir une image</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 bg-brand-text text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                      {editingProductId ? "Mettre à jour" : "Ajouter au catalogue"}
                    </button>
                    {editingProductId && (
                      <button type="button" onClick={resetForm} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Annuler
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Product List */}
              <div className="w-full md:w-2/3 space-y-4">
                <h3 className="font-medium text-gray-800 border-b pb-2">Catalogue actuel ({products.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
                  {products.map(p => (
                    <div key={p.id} className="flex gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                      <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-lg bg-gray-50" />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 truncate">{p.name}</h4>
                        <p className="text-xs text-gray-500">{p.category} • {p.price.toLocaleString('fr-FR')} FCFA</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => handleEditProduct(p)} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                            <Edit2 className="w-3 h-3" /> Modifier
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                </>
              ) : (
                <>
                  {/* Add Video Form */}
                  <div className="w-full md:w-1/3 space-y-4">
                    <h3 className="font-medium text-gray-800 border-b pb-2">
                      {editingVideoId ? "Modifier la vidéo" : "Ajouter une vidéo"}
                    </h3>
                    <form onSubmit={handleSaveVideo} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Titre de la vidéo</label>
                        <input type="text" required value={newVidTitle} onChange={e => setNewVidTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-accent/50 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">URL (YouTube, Vimeo, etc.)</label>
                        <input type="url" required value={newVidUrl} onChange={e => setNewVidUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-accent/50 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea rows={3} value={newVidDesc} onChange={e => setNewVidDesc(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-accent/50 outline-none resize-none" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-brand-text text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                          {editingVideoId ? "Mettre à jour" : "Ajouter la vidéo"}
                        </button>
                        {editingVideoId && (
                          <button type="button" onClick={resetVideoForm} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            Annuler
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Video List */}
                  <div className="w-full md:w-2/3 space-y-4">
                    <h3 className="font-medium text-gray-800 border-b pb-2">Vidéos actuelles ({videos.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
                      {videos.map(v => (
                        <div key={v.id} className="flex gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                          <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <PlayCircle className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 truncate">{v.title}</h4>
                            <p className="text-xs text-gray-500 truncate">{v.url}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button onClick={() => handleEditVideo(v)} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                                <Edit2 className="w-3 h-3" /> Modifier
                              </button>
                              <button onClick={() => handleDeleteVideo(v.id)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                                <Trash2 className="w-3 h-3" /> Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
