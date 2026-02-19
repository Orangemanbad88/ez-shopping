import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, SlidersHorizontal, Search, ShoppingBag, ChevronRight, Sparkles, Home, Palette, DollarSign, Star, ExternalLink, Ruler, Eye, Grid3X3, Sofa, Sun, Plus, Trash2, Edit3, Settings, Link, Package, ChevronLeft, Image, Check, Layers, Paintbrush, Droplet, DoorClosed, TreePine, Wallet, Bell, FolderHeart, PanelTop, Heart, User, Scan } from 'lucide-react';
import homeStyles from './HomeScreen.module.css';
import { CardCalibrationOverlay } from './components/card-calibration-overlay';
import { TapToMeasureOverlay } from './components/tap-to-measure-overlay';
import { useZoneDetection } from './hooks/use-zone-detection';

// ============================================
// TOP 10 HOME IMPROVEMENT STORES (Pre-loaded)
// Based on 2024 rankings: Home Depot, Lowe's, 
// Menards, Ace Hardware, IKEA, Wayfair, Amazon,
// Target, Walmart, Costco
// ============================================

// Default product data with REAL search links to top stores
const defaultProducts = {
  blinds: [
    { id: 1, name: 'Cellular Shades', brand: 'Home Depot', price: 79, rating: 4.7, color: 'White', image: '🧡', link: 'https://www.homedepot.com/s/cellular%20shades', size: 'Custom', store: 'Home Depot' },
    { id: 2, name: 'Faux Wood Blinds', brand: 'Home Depot', price: 45, rating: 4.6, color: 'White', image: '🧡', link: 'https://www.homedepot.com/s/faux%20wood%20blinds', size: 'Various', store: 'Home Depot' },
    { id: 3, name: 'Cordless Blinds', brand: "Lowe's", price: 65, rating: 4.5, color: 'White', image: '🔷', link: 'https://www.lowes.com/search?searchTerm=cordless%20blinds', size: 'Various', store: "Lowe's" },
    { id: 4, name: 'Blackout Shades', brand: "Lowe's", price: 89, rating: 4.7, color: 'Gray', image: '🔷', link: 'https://www.lowes.com/search?searchTerm=blackout%20shades', size: 'Custom', store: "Lowe's" },
    { id: 5, name: 'Roller Shades', brand: 'Amazon', price: 35, rating: 4.4, color: 'White', image: '📦', link: 'https://www.amazon.com/s?k=roller+shades', size: 'Various', store: 'Amazon' },
    { id: 6, name: 'Roman Shades', brand: 'Wayfair', price: 55, rating: 4.5, color: 'Beige', image: '💜', link: 'https://www.wayfair.com/decor-pillows/sb0/roman-shades-c215598.html', size: 'Various', store: 'Wayfair' },
    { id: 7, name: 'Light Filtering Blinds', brand: 'Target', price: 29, rating: 4.3, color: 'White', image: '🎯', link: 'https://www.target.com/s?searchTerm=window+blinds', size: 'Standard', store: 'Target' },
    { id: 8, name: 'Mini Blinds', brand: 'Walmart', price: 15, rating: 4.2, color: 'White', image: '🔵', link: 'https://www.walmart.com/search?q=mini+blinds', size: 'Various', store: 'Walmart' },
  ],
  rugs: [
    { id: 10, name: 'Area Rugs', brand: 'Wayfair', price: 150, rating: 4.6, color: 'Multi', image: '💜', link: 'https://www.wayfair.com/rugs/sb0/area-rugs-c215385.html', size: '8x10', store: 'Wayfair' },
    { id: 11, name: 'Shag Rugs', brand: 'Wayfair', price: 199, rating: 4.5, color: 'Ivory', image: '💜', link: 'https://www.wayfair.com/rugs/sb0/shag-rugs-c1870731.html', size: '5x7', store: 'Wayfair' },
    { id: 12, name: 'Persian Style Rugs', brand: 'Amazon', price: 89, rating: 4.4, color: 'Multi', image: '📦', link: 'https://www.amazon.com/s?k=persian+area+rug', size: '8x10', store: 'Amazon' },
    { id: 13, name: 'Outdoor Rugs', brand: 'Amazon', price: 45, rating: 4.3, color: 'Navy', image: '📦', link: 'https://www.amazon.com/s?k=outdoor+patio+rug', size: '5x7', store: 'Amazon' },
    { id: 14, name: 'Modern Rugs', brand: 'Target', price: 120, rating: 4.4, color: 'Gray', image: '🎯', link: 'https://www.target.com/s?searchTerm=area+rugs', size: 'Various', store: 'Target' },
    { id: 15, name: 'Indoor/Outdoor Rugs', brand: 'Home Depot', price: 79, rating: 4.5, color: 'Natural', image: '🧡', link: 'https://www.homedepot.com/s/indoor%20outdoor%20rugs', size: '8x10', store: 'Home Depot' },
    { id: 16, name: 'Flatwoven Rugs', brand: 'IKEA', price: 69, rating: 4.3, color: 'Multi', image: '🟡', link: 'https://www.ikea.com/us/en/cat/rugs-10653/', size: 'Various', store: 'IKEA' },
    { id: 17, name: 'Budget Area Rugs', brand: 'Walmart', price: 49, rating: 4.2, color: 'Gray', image: '🔵', link: 'https://www.walmart.com/search?q=area+rugs', size: '5x7', store: 'Walmart' },
    { id: 18, name: 'Premium Wool Rugs', brand: 'Costco', price: 299, rating: 4.7, color: 'Multi', image: '🏪', link: 'https://www.costco.com/rugs.html', size: '8x10', store: 'Costco' },
    { id: 19, name: 'Area Rugs', brand: 'Raymour & Flanigan', price: 179, rating: 4.5, color: 'Multi', image: '🏬', link: 'https://www.raymourflanigan.com/area-rugs', size: '8x10', store: 'Raymour & Flanigan' },
    { id: 50, name: 'Handcrafted Rugs', brand: 'Restoration Hardware', price: 1295, rating: 4.7, color: 'Natural', image: '🏛️', link: 'https://rh.com/catalog/category/collections.jsp?categoryId=cat10410048', size: '8x10', store: 'Restoration Hardware' },
    { id: 53, name: 'Area Rugs', brand: 'Safavieh', price: 159, rating: 4.6, color: 'Multi', image: '👑', link: 'https://www.safavieh.com/rugs/area-rugs', size: '8x10', store: 'Safavieh' },
    { id: 54, name: 'Vintage Rugs', brand: 'Safavieh', price: 199, rating: 4.7, color: 'Multi', image: '👑', link: 'https://www.safavieh.com/rugs/vintage-rugs', size: '8x10', store: 'Safavieh' },
    { id: 55, name: 'Area Rugs', brand: 'Ashley Furniture', price: 129, rating: 4.4, color: 'Gray', image: '🛋️', link: 'https://www.ashleyfurniture.com/c/rugs/', size: '8x10', store: 'Ashley Furniture' },
  ],
  furniture: [
    { id: 20, name: 'Sofas & Sectionals', brand: 'IKEA', price: 499, rating: 4.5, color: 'Gray', image: '🟡', link: 'https://www.ikea.com/us/en/cat/sofas-fu003/', size: 'Various', store: 'IKEA' },
    { id: 21, name: 'Dining Tables', brand: 'IKEA', price: 199, rating: 4.4, color: 'Oak', image: '🟡', link: 'https://www.ikea.com/us/en/cat/dining-tables-21825/', size: 'Various', store: 'IKEA' },
    { id: 22, name: 'Bedroom Sets', brand: 'IKEA', price: 599, rating: 4.5, color: 'White', image: '🟡', link: 'https://www.ikea.com/us/en/cat/bedroom-furniture-bm003/', size: 'Various', store: 'IKEA' },
    { id: 23, name: 'Accent Chairs', brand: 'Wayfair', price: 299, rating: 4.6, color: 'Beige', image: '💜', link: 'https://www.wayfair.com/furniture/sb0/accent-chairs-c413892.html', size: 'Standard', store: 'Wayfair' },
    { id: 24, name: 'Coffee Tables', brand: 'Wayfair', price: 179, rating: 4.5, color: 'Walnut', image: '💜', link: 'https://www.wayfair.com/furniture/sb0/coffee-tables-c413702.html', size: 'Various', store: 'Wayfair' },
    { id: 25, name: 'Bookshelves', brand: 'Amazon', price: 89, rating: 4.4, color: 'White', image: '📦', link: 'https://www.amazon.com/s?k=bookshelf', size: 'Various', store: 'Amazon' },
    { id: 26, name: 'TV Stands', brand: 'Amazon', price: 129, rating: 4.3, color: 'Black', image: '📦', link: 'https://www.amazon.com/s?k=tv+stand', size: 'Various', store: 'Amazon' },
    { id: 27, name: 'Patio Furniture', brand: 'Home Depot', price: 599, rating: 4.5, color: 'Brown', image: '🧡', link: 'https://www.homedepot.com/s/patio%20furniture', size: 'Set', store: 'Home Depot' },
    { id: 28, name: 'Modern Furniture', brand: 'Target', price: 249, rating: 4.4, color: 'Gray', image: '🎯', link: 'https://www.target.com/s?searchTerm=furniture', size: 'Various', store: 'Target' },
    { id: 29, name: 'Budget Furniture', brand: 'Walmart', price: 159, rating: 4.2, color: 'Gray', image: '🔵', link: 'https://www.walmart.com/search?q=living+room+furniture', size: 'Various', store: 'Walmart' },
    { id: 30, name: 'Premium Recliners', brand: 'Costco', price: 799, rating: 4.7, color: 'Leather Brown', image: '🏪', link: 'https://www.costco.com/recliners.html', size: 'Standard', store: 'Costco' },
    { id: 41, name: 'Living Room Sets', brand: 'Raymour & Flanigan', price: 999, rating: 4.6, color: 'Gray', image: '🏬', link: 'https://www.raymourflanigan.com/living-room/sofas', size: 'Set', store: 'Raymour & Flanigan' },
    { id: 42, name: 'Dining Room Furniture', brand: 'Raymour & Flanigan', price: 799, rating: 4.5, color: 'Brown', image: '🏬', link: 'https://www.raymourflanigan.com/dining-room', size: 'Set', store: 'Raymour & Flanigan' },
    { id: 43, name: 'Luxury Sofas', brand: 'Restoration Hardware', price: 3995, rating: 4.8, color: 'Gray', image: '🏛️', link: 'https://rh.com/catalog/category/collections.jsp?categoryId=cat160001', size: 'Various', store: 'Restoration Hardware' },
    { id: 44, name: 'Dining Collections', brand: 'Restoration Hardware', price: 2495, rating: 4.7, color: 'Oak', image: '🏛️', link: 'https://rh.com/catalog/category/collections.jsp?categoryId=cat10220001', size: 'Various', store: 'Restoration Hardware' },
    { id: 56, name: 'Living Room Furniture', brand: 'Ashley Furniture', price: 599, rating: 4.5, color: 'Gray', image: '🛋️', link: 'https://www.ashleyfurniture.com/c/living-room/sofas/', size: 'Various', store: 'Ashley Furniture' },
    { id: 57, name: 'Bedroom Furniture', brand: 'Ashley Furniture', price: 499, rating: 4.4, color: 'Brown', image: '🛋️', link: 'https://www.ashleyfurniture.com/c/bedroom/beds/', size: 'Various', store: 'Ashley Furniture' },
    { id: 58, name: 'Accent Furniture', brand: 'Safavieh', price: 349, rating: 4.5, color: 'Multi', image: '👑', link: 'https://www.safavieh.com/furniture', size: 'Various', store: 'Safavieh' },
  ],
  lighting: [
    { id: 31, name: 'Ceiling Fans', brand: 'Home Depot', price: 149, rating: 4.6, color: 'Bronze', image: '🧡', link: 'https://www.homedepot.com/s/ceiling%20fans', size: '52"', store: 'Home Depot' },
    { id: 32, name: 'Chandeliers', brand: 'Home Depot', price: 199, rating: 4.5, color: 'Black', image: '🧡', link: 'https://www.homedepot.com/s/chandeliers', size: 'Various', store: 'Home Depot' },
    { id: 33, name: 'Pendant Lights', brand: "Lowe's", price: 89, rating: 4.5, color: 'Brass', image: '🔷', link: 'https://www.lowes.com/search?searchTerm=pendant%20lights', size: 'Various', store: "Lowe's" },
    { id: 34, name: 'Table Lamps', brand: 'Amazon', price: 45, rating: 4.4, color: 'White', image: '📦', link: 'https://www.amazon.com/s?k=table+lamp', size: 'Various', store: 'Amazon' },
    { id: 35, name: 'Floor Lamps', brand: 'Amazon', price: 79, rating: 4.3, color: 'Black', image: '📦', link: 'https://www.amazon.com/s?k=floor+lamp', size: 'Various', store: 'Amazon' },
    { id: 36, name: 'Modern Lighting', brand: 'Wayfair', price: 159, rating: 4.5, color: 'Gold', image: '💜', link: 'https://www.wayfair.com/lighting/sb0/chandeliers-c215386.html', size: 'Various', store: 'Wayfair' },
    { id: 37, name: 'LED Lighting', brand: 'IKEA', price: 29, rating: 4.4, color: 'White', image: '🟡', link: 'https://www.ikea.com/us/en/cat/lighting-li001/', size: 'Various', store: 'IKEA' },
    { id: 38, name: 'Decorative Lamps', brand: 'Target', price: 39, rating: 4.3, color: 'Multi', image: '🎯', link: 'https://www.target.com/s?searchTerm=lamps', size: 'Various', store: 'Target' },
    { id: 39, name: 'Shop Lights', brand: 'Menards', price: 49, rating: 4.4, color: 'White', image: '🟢', link: 'https://www.menards.com/main/lighting-ceiling-fans/c-7493.htm', size: 'Various', store: 'Menards' },
    { id: 40, name: 'Outdoor Lighting', brand: 'Ace Hardware', price: 59, rating: 4.5, color: 'Black', image: '🔴', link: 'https://www.acehardware.com/departments/lighting-and-electrical/outdoor-lighting', size: 'Various', store: 'Ace Hardware' },
    { id: 51, name: 'Lamps & Lighting', brand: 'Raymour & Flanigan', price: 129, rating: 4.4, color: 'Multi', image: '🏬', link: 'https://www.raymourflanigan.com/lamps-and-lighting', size: 'Various', store: 'Raymour & Flanigan' },
    { id: 52, name: 'Luxury Chandeliers', brand: 'Restoration Hardware', price: 1895, rating: 4.8, color: 'Brass', image: '🏛️', link: 'https://rh.com/catalog/category/collections.jsp?categoryId=cat10410003', size: 'Various', store: 'Restoration Hardware' },
    { id: 59, name: 'Table & Floor Lamps', brand: 'Ashley Furniture', price: 89, rating: 4.3, color: 'Multi', image: '🛋️', link: 'https://www.ashleyfurniture.com/c/lighting/', size: 'Various', store: 'Ashley Furniture' },
    { id: 60, name: 'Lighting Collection', brand: 'Safavieh', price: 149, rating: 4.5, color: 'Gold', image: '👑', link: 'https://www.safavieh.com/lighting', size: 'Various', store: 'Safavieh' },
  ],
  flooring: [
    { id: 100, name: 'Luxury Vinyl Plank', brand: 'Home Depot', price: 89, rating: 4.7, color: 'Oak', image: '🧡', link: 'https://www.homedepot.com/s/luxury%20vinyl%20plank', size: 'Per Box', store: 'Home Depot' },
    { id: 101, name: 'Laminate Flooring', brand: "Lowe's", price: 59, rating: 4.5, color: 'Gray', image: '🔷', link: 'https://www.lowes.com/search?searchTerm=laminate%20flooring', size: 'Per Box', store: "Lowe's" },
    { id: 102, name: 'Hardwood Flooring', brand: 'Home Depot', price: 299, rating: 4.8, color: 'Natural', image: '🧡', link: 'https://www.homedepot.com/s/hardwood%20flooring', size: 'Per Box', store: 'Home Depot' },
    { id: 103, name: 'Tile Flooring', brand: 'Wayfair', price: 79, rating: 4.4, color: 'White', image: '💜', link: 'https://www.wayfair.com/home-improvement/sb0/floor-tile-c1824164.html', size: 'Per Sq Ft', store: 'Wayfair' },
    { id: 104, name: 'Carpet Tiles', brand: 'Amazon', price: 45, rating: 4.3, color: 'Gray', image: '📦', link: 'https://www.amazon.com/s?k=carpet+tiles', size: 'Per Box', store: 'Amazon' },
    { id: 105, name: 'Engineered Wood', brand: 'IKEA', price: 69, rating: 4.5, color: 'Oak', image: '🟡', link: 'https://www.ikea.com/us/en/cat/laminate-flooring-11466/', size: 'Per Box', store: 'IKEA' },
  ],
  paint: [
    { id: 110, name: 'Interior Paint', brand: 'Home Depot', price: 45, rating: 4.8, color: 'White', image: '🧡', link: 'https://www.homedepot.com/s/interior%20paint', size: 'Gallon', store: 'Home Depot' },
    { id: 111, name: 'Exterior Paint', brand: "Lowe's", price: 55, rating: 4.7, color: 'White', image: '🔷', link: 'https://www.lowes.com/search?searchTerm=exterior%20paint', size: 'Gallon', store: "Lowe's" },
    { id: 112, name: 'Cabinet Paint', brand: 'Amazon', price: 39, rating: 4.5, color: 'White', image: '📦', link: 'https://www.amazon.com/s?k=cabinet+paint', size: 'Quart', store: 'Amazon' },
    { id: 113, name: 'Peel & Stick Wallpaper', brand: 'Wayfair', price: 35, rating: 4.4, color: 'Multi', image: '💜', link: 'https://www.wayfair.com/decor-pillows/sb0/peel-and-stick-wallpaper-c1866046.html', size: 'Roll', store: 'Wayfair' },
    { id: 114, name: 'Traditional Wallpaper', brand: 'Home Depot', price: 49, rating: 4.3, color: 'Multi', image: '🧡', link: 'https://www.homedepot.com/s/wallpaper', size: 'Roll', store: 'Home Depot' },
    { id: 115, name: 'Interior Paint', brand: 'Sherwin-Williams', price: 79, rating: 4.9, color: 'White', image: '🎨', link: 'https://www.sherwin-williams.com/en-us/products/interior-paint', size: 'Gallon', store: 'Sherwin-Williams' },
    { id: 116, name: 'Exterior Paint', brand: 'Sherwin-Williams', price: 89, rating: 4.8, color: 'White', image: '🎨', link: 'https://www.sherwin-williams.com/en-us/products/exterior-paint', size: 'Gallon', store: 'Sherwin-Williams' },
    { id: 117, name: 'Interior Paint', brand: 'Benjamin Moore', price: 85, rating: 4.9, color: 'White', image: '🖌️', link: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/product-catalog/isp/interior-paint', size: 'Gallon', store: 'Benjamin Moore' },
    { id: 118, name: 'Exterior Paint', brand: 'Benjamin Moore', price: 95, rating: 4.8, color: 'White', image: '🖌️', link: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/product-catalog/esp/exterior-paint', size: 'Gallon', store: 'Benjamin Moore' },
  ],
  countertops: [
    { id: 120, name: 'Quartz Countertops', brand: 'Home Depot', price: 75, rating: 4.8, color: 'White', image: '🧡', link: 'https://www.homedepot.com/s/quartz%20countertops', size: 'Per Sq Ft', store: 'Home Depot' },
    { id: 121, name: 'Granite Countertops', brand: "Lowe's", price: 65, rating: 4.7, color: 'Gray', image: '🔷', link: 'https://www.lowes.com/search?searchTerm=granite%20countertops', size: 'Per Sq Ft', store: "Lowe's" },
    { id: 122, name: 'Butcher Block', brand: 'IKEA', price: 129, rating: 4.5, color: 'Natural', image: '🟡', link: 'https://www.ikea.com/us/en/cat/countertops-24264/', size: 'Per Piece', store: 'IKEA' },
    { id: 123, name: 'Laminate Countertops', brand: 'Home Depot', price: 25, rating: 4.3, color: 'White', image: '🧡', link: 'https://www.homedepot.com/s/laminate%20countertops', size: 'Per Sq Ft', store: 'Home Depot' },
    { id: 124, name: 'Marble Countertops', brand: 'Wayfair', price: 95, rating: 4.6, color: 'White', image: '💜', link: 'https://www.wayfair.com/home-improvement/sb0/countertops-c1867261.html', size: 'Per Sq Ft', store: 'Wayfair' },
  ],
  cabinets: [
    { id: 130, name: 'Kitchen Cabinets', brand: 'Home Depot', price: 199, rating: 4.6, color: 'White', image: '🧡', link: 'https://www.homedepot.com/s/kitchen%20cabinets', size: 'Per Unit', store: 'Home Depot' },
    { id: 131, name: 'Base Cabinets', brand: "Lowe's", price: 159, rating: 4.5, color: 'White', image: '🔷', link: 'https://www.lowes.com/search?searchTerm=kitchen%20cabinets', size: 'Per Unit', store: "Lowe's" },
    { id: 132, name: 'Wall Cabinets', brand: 'IKEA', price: 89, rating: 4.7, color: 'White', image: '🟡', link: 'https://www.ikea.com/us/en/cat/kitchen-cabinets-ka002/', size: 'Per Unit', store: 'IKEA' },
    { id: 133, name: 'Pantry Cabinets', brand: 'Amazon', price: 249, rating: 4.4, color: 'White', image: '📦', link: 'https://www.amazon.com/s?k=pantry+cabinet', size: 'Per Unit', store: 'Amazon' },
    { id: 134, name: 'Bathroom Vanities', brand: 'Wayfair', price: 299, rating: 4.5, color: 'Gray', image: '💜', link: 'https://www.wayfair.com/home-improvement/sb0/bathroom-vanities-c414382.html', size: '36"', store: 'Wayfair' },
  ],
  plumbing: [
    { id: 140, name: 'Kitchen Faucets', brand: 'Home Depot', price: 149, rating: 4.7, color: 'Brass', image: '🧡', link: 'https://www.homedepot.com/s/kitchen%20faucets', size: 'Standard', store: 'Home Depot' },
    { id: 141, name: 'Bathroom Faucets', brand: "Lowe's", price: 89, rating: 4.6, color: 'Brass', image: '🔷', link: 'https://www.lowes.com/search?searchTerm=bathroom%20faucets', size: 'Standard', store: "Lowe's" },
    { id: 142, name: 'Toilets', brand: 'Home Depot', price: 199, rating: 4.5, color: 'White', image: '🧡', link: 'https://www.homedepot.com/s/toilets', size: 'Standard', store: 'Home Depot' },
    { id: 143, name: 'Showerheads', brand: 'Amazon', price: 45, rating: 4.6, color: 'Brass', image: '📦', link: 'https://www.amazon.com/s?k=rain+showerhead', size: 'Various', store: 'Amazon' },
    { id: 144, name: 'Kitchen Sinks', brand: 'Wayfair', price: 249, rating: 4.5, color: 'White', image: '💜', link: 'https://www.wayfair.com/home-improvement/sb0/kitchen-sinks-c414408.html', size: '33"', store: 'Wayfair' },
  ],
  appliances: [
    { id: 150, name: 'Refrigerators', brand: 'Home Depot', price: 999, rating: 4.6, color: 'White', image: '🧡', link: 'https://www.homedepot.com/s/refrigerators', size: 'Standard', store: 'Home Depot' },
    { id: 151, name: 'Dishwashers', brand: "Lowe's", price: 549, rating: 4.5, color: 'White', image: '🔷', link: 'https://www.lowes.com/search?searchTerm=dishwashers', size: 'Standard', store: "Lowe's" },
    { id: 152, name: 'Ranges & Ovens', brand: 'Home Depot', price: 799, rating: 4.7, color: 'Black', image: '🧡', link: 'https://www.homedepot.com/s/ranges', size: '30"', store: 'Home Depot' },
    { id: 153, name: 'Microwaves', brand: 'Amazon', price: 149, rating: 4.4, color: 'White', image: '📦', link: 'https://www.amazon.com/s?k=over+the+range+microwave', size: 'Various', store: 'Amazon' },
    { id: 154, name: 'Washers & Dryers', brand: 'Costco', price: 899, rating: 4.7, color: 'White', image: '🏪', link: 'https://www.costco.com/washers-dryers.html', size: 'Standard', store: 'Costco' },
  ],
  doors: [
    { id: 160, name: 'Interior Doors', brand: 'Home Depot', price: 129, rating: 4.5, color: 'White', image: '🧡', link: 'https://www.homedepot.com/s/interior%20doors', size: '32"', store: 'Home Depot' },
    { id: 161, name: 'Exterior Doors', brand: "Lowe's", price: 349, rating: 4.6, color: 'White', image: '🔷', link: 'https://www.lowes.com/search?searchTerm=exterior%20doors', size: '36"', store: "Lowe's" },
    { id: 162, name: 'Door Hardware', brand: 'Amazon', price: 45, rating: 4.5, color: 'Brass', image: '📦', link: 'https://www.amazon.com/s?k=door+handles+and+locks', size: 'Standard', store: 'Amazon' },
    { id: 163, name: 'Sliding Doors', brand: 'Home Depot', price: 599, rating: 4.4, color: 'White', image: '🧡', link: 'https://www.homedepot.com/s/sliding%20patio%20doors', size: '72"', store: 'Home Depot' },
    { id: 164, name: 'Barn Doors', brand: 'Wayfair', price: 249, rating: 4.6, color: 'Natural', image: '💜', link: 'https://www.wayfair.com/home-improvement/sb0/barn-doors-c1789274.html', size: '36"', store: 'Wayfair' },
  ],
  outdoor: [
    { id: 170, name: 'Patio Furniture Sets', brand: 'Home Depot', price: 599, rating: 4.6, color: 'Gray', image: '🧡', link: 'https://www.homedepot.com/s/patio%20furniture%20sets', size: 'Set', store: 'Home Depot' },
    { id: 171, name: 'Outdoor Rugs', brand: 'Wayfair', price: 89, rating: 4.5, color: 'Multi', image: '💜', link: 'https://www.wayfair.com/outdoor/sb0/outdoor-rugs-c215387.html', size: '8x10', store: 'Wayfair' },
    { id: 172, name: 'Grills & Smokers', brand: "Lowe's", price: 399, rating: 4.7, color: 'Black', image: '🔷', link: 'https://www.lowes.com/search?searchTerm=grills', size: 'Various', store: "Lowe's" },
    { id: 173, name: 'Outdoor Lighting', brand: 'Amazon', price: 45, rating: 4.4, color: 'Black', image: '📦', link: 'https://www.amazon.com/s?k=outdoor+string+lights', size: 'Various', store: 'Amazon' },
    { id: 174, name: 'Planters & Pots', brand: 'Target', price: 35, rating: 4.3, color: 'Multi', image: '🎯', link: 'https://www.target.com/s?searchTerm=planters', size: 'Various', store: 'Target' },
    { id: 175, name: 'Deck & Fence', brand: 'Home Depot', price: 25, rating: 4.5, color: 'Natural', image: '🧡', link: 'https://www.homedepot.com/s/decking', size: 'Per Board', store: 'Home Depot' },
    { id: 176, name: 'Outdoor Furniture', brand: 'Restoration Hardware', price: 2995, rating: 4.7, color: 'Gray', image: '🏛️', link: 'https://rh.com/catalog/category/collections.jsp?categoryId=cat10410015', size: 'Set', store: 'Restoration Hardware' },
  ],
};

const categories = [
  // Featured - spans 2 columns
  { id: 'furniture', name: 'Furniture', icon: Sofa, color: '#c2725b' },
  // Living Spaces row - 3 across
  { id: 'lighting', name: 'Lighting', icon: Sparkles, color: '#d4917d' },
  { id: 'rugs', name: 'Rugs & Carpets', icon: Grid3X3, color: '#b8856f' },
  { id: 'blinds', name: 'Blinds & Shades', icon: Sun, color: '#c98a5a' },
  // Kitchen & Bath
  { id: 'cabinets', name: 'Cabinets', icon: Package, color: '#8b7355' },
  { id: 'countertops', name: 'Countertops', icon: PanelTop, color: '#9a8578' },
  { id: 'appliances', name: 'Appliances', icon: Home, color: '#a85a44' },
  { id: 'plumbing', name: 'Plumbing', icon: Droplet, color: '#7a9b8a' },
  // Featured - spans 2 columns
  { id: 'flooring', name: 'Flooring', icon: Layers, color: '#c2725b' },
  // Structure & Finishes
  { id: 'paint', name: 'Paint & Wallpaper', icon: Paintbrush, color: '#d4917d' },
  { id: 'doors', name: 'Doors & Hardware', icon: DoorClosed, color: '#8b7355' },
  { id: 'outdoor', name: 'Outdoor & Patio', icon: TreePine, color: '#7a9b8a' },
];

const colorOptions = ['All', 'White', 'Black', 'Gray', 'Beige', 'Navy', 'Natural', 'Multi', 'Oak', 'Ivory', 'Charcoal', 'Brass', 'Cream'];

// Embedded store database with search URLs for each category
const storeDatabase = {
  // Big Box Retailers
  bigBox: [
    { name: 'Amazon', logo: '📦', baseUrl: 'https://www.amazon.com/s?k=', color: '#FF9900' },
    { name: 'Walmart', logo: '🔵', baseUrl: 'https://www.walmart.com/search?q=', color: '#0071CE' },
    { name: 'Target', logo: '🎯', baseUrl: 'https://www.target.com/s?searchTerm=', color: '#CC0000' },
    { name: 'Costco', logo: '🏪', baseUrl: 'https://www.costco.com/CatalogSearch?keyword=', color: '#E31837' },
  ],
  // Home Improvement
  homeImprovement: [
    { name: 'Home Depot', logo: '🧡', baseUrl: 'https://www.homedepot.com/s/', color: '#F96302' },
    { name: 'Lowes', logo: '🔷', baseUrl: 'https://www.lowes.com/search?searchTerm=', color: '#004990' },
    { name: 'Menards', logo: '🟢', baseUrl: 'https://www.menards.com/main/search.html?search=', color: '#2E7D32' },
    { name: 'Ace Hardware', logo: '🔴', baseUrl: 'https://www.acehardware.com/search?query=', color: '#D32F2F' },
    { name: 'Sherwin-Williams', logo: '🎨', baseUrl: 'https://www.sherwin-williams.com/en-us/search/', color: '#0047AB' },
    { name: 'Benjamin Moore', logo: '🖌️', baseUrl: 'https://www.benjaminmoore.com/en-us/paint-colors/color/', color: '#C41230' },
  ],
  // Furniture Specialists
  furniture: [
    { name: 'IKEA', logo: '🟡', baseUrl: 'https://www.ikea.com/us/en/search/?q=', color: '#0058A3' },
    { name: 'Wayfair', logo: '💜', baseUrl: 'https://www.wayfair.com/keyword.html?keyword=', color: '#7B68AE' },
    { name: 'Ashley Furniture', logo: '🛋️', baseUrl: 'https://www.ashleyfurniture.com/search/?q=', color: '#8B4513' },
    { name: 'Rooms To Go', logo: '🏠', baseUrl: 'https://www.roomstogo.com/search/', color: '#1E3A5F' },
    { name: 'Bob\'s Discount', logo: '😊', baseUrl: 'https://www.mybobs.com/search?q=', color: '#E53935' },
    { name: 'Nebraska Furniture', logo: '🌾', baseUrl: 'https://www.nfm.com/search?q=', color: '#B8860B' },
    { name: 'RC Willey', logo: '🏔️', baseUrl: 'https://www.rcwilley.com/search?q=', color: '#1565C0' },
    { name: 'Article', logo: '🪑', baseUrl: 'https://www.article.com/search?q=', color: '#2D3436' },
    { name: 'Joybird', logo: '🐦', baseUrl: 'https://joybird.com/search/?q=', color: '#FF6B35' },
    { name: 'Burrow', logo: '🛋️', baseUrl: 'https://burrow.com/search?q=', color: '#2C3E50' },
    { name: 'Raymour & Flanigan', logo: '🏬', baseUrl: 'https://www.raymourflanigan.com/search?query=', color: '#003DA5' },
  ],
  // High-End / Designer
  designer: [
    { name: 'West Elm', logo: '✨', baseUrl: 'https://www.westelm.com/search/?q=', color: '#1C1C1C' },
    { name: 'Pottery Barn', logo: '🏺', baseUrl: 'https://www.potterybarn.com/search/?q=', color: '#8B4513' },
    { name: 'Crate & Barrel', logo: '📦', baseUrl: 'https://www.crateandbarrel.com/search?query=', color: '#333333' },
    { name: 'CB2', logo: '⬜', baseUrl: 'https://www.cb2.com/search?query=', color: '#000000' },
    { name: 'Restoration Hardware', logo: '🏛️', baseUrl: 'https://rh.com/search/?q=', color: '#4A4A4A' },
    { name: 'Arhaus', logo: '🌿', baseUrl: 'https://www.arhaus.com/search?q=', color: '#556B2F' },
    { name: 'Ethan Allen', logo: '🪵', baseUrl: 'https://www.ethanallen.com/en_US/search?q=', color: '#8B4513' },
    { name: 'Design Within Reach', logo: '💎', baseUrl: 'https://www.dwr.com/search?q=', color: '#E74C3C' },
  ],
  // Rugs & Carpets
  rugs: [
    { name: 'Ruggable', logo: '🔷', baseUrl: 'https://ruggable.com/search?q=', color: '#4A90A4' },
    { name: 'Rugs USA', logo: '🇺🇸', baseUrl: 'https://www.rugsusa.com/rugsusa/control/search?q=', color: '#002868' },
    { name: 'Boutique Rugs', logo: '🎨', baseUrl: 'https://boutiquerugs.com/search?q=', color: '#E91E63' },
    { name: 'Loloi Rugs', logo: '🌸', baseUrl: 'https://www.loloirugs.com/search?q=', color: '#9C27B0' },
    { name: 'Safavieh', logo: '👑', baseUrl: 'https://www.safavieh.com/catalogsearch/result/?q=', color: '#D4AF37' },
    { name: 'The Rug Company', logo: '💫', baseUrl: 'https://www.therugcompany.com/search?q=', color: '#1A237E' },
  ],
  // Blinds & Window Treatments
  blinds: [
    { name: 'Blinds.com', logo: '🪟', baseUrl: 'https://www.blinds.com/search?q=', color: '#FF5722' },
    { name: 'SelectBlinds', logo: '🌅', baseUrl: 'https://www.selectblinds.com/search?q=', color: '#FFA000' },
    { name: 'Budget Blinds', logo: '💰', baseUrl: 'https://www.budgetblinds.com/search?q=', color: '#4CAF50' },
    { name: 'The Shade Store', logo: '🌤️', baseUrl: 'https://www.theshadestore.com/search?q=', color: '#795548' },
    { name: 'Smith & Noble', logo: '🎩', baseUrl: 'https://www.smithandnoble.com/search?q=', color: '#37474F' },
    { name: 'Levolor', logo: '📐', baseUrl: 'https://www.levolor.com/search?q=', color: '#607D8B' },
    { name: 'Bali Blinds', logo: '🌴', baseUrl: 'https://www.baliblinds.com/search?q=', color: '#009688' },
  ],
  // Lighting
  lighting: [
    { name: 'Lumens', logo: '💡', baseUrl: 'https://www.lumens.com/search/?q=', color: '#FFC107' },
    { name: 'Lamps Plus', logo: '🔆', baseUrl: 'https://www.lampsplus.com/sfind/', color: '#FF9800' },
    { name: '1800Lighting', logo: '✨', baseUrl: 'https://www.1800lighting.com/search?q=', color: '#FFEB3B' },
    { name: 'YLighting', logo: '💫', baseUrl: 'https://www.ylighting.com/search/?q=', color: '#FDD835' },
    { name: 'Lighting Direct', logo: '⚡', baseUrl: 'https://www.lightingdirect.com/search?q=', color: '#FF6F00' },
    { name: 'Build.com', logo: '🔧', baseUrl: 'https://www.build.com/search?term=', color: '#F57C00' },
  ],
  // Budget / Discount
  budget: [
    { name: 'Overstock', logo: '📦', baseUrl: 'https://www.overstock.com/search?keywords=', color: '#D32F2F' },
    { name: 'At Home', logo: '🏡', baseUrl: 'https://www.athome.com/search?q=', color: '#E65100' },
    { name: 'Big Lots', logo: '🛒', baseUrl: 'https://www.biglots.com/search?q=', color: '#F57C00' },
    { name: 'HomeGoods', logo: '🏷️', baseUrl: 'https://www.homegoods.com/search?q=', color: '#E91E63' },
    { name: 'Tuesday Morning', logo: '☀️', baseUrl: 'https://www.tuesdaymorning.com/search?q=', color: '#FF9800' },
    { name: 'World Market', logo: '🌍', baseUrl: 'https://www.worldmarket.com/search?q=', color: '#795548' },
  ],
  // Online Only / Direct to Consumer
  online: [
    { name: 'AllModern', logo: '🔲', baseUrl: 'https://www.allmodern.com/keyword.html?keyword=', color: '#37474F' },
    { name: 'Hayneedle', logo: '🧵', baseUrl: 'https://www.hayneedle.com/search?q=', color: '#8BC34A' },
    { name: 'Houzz', logo: '🏠', baseUrl: 'https://www.houzz.com/products/query/', color: '#4DB6AC' },
    { name: 'Chairish', logo: '💺', baseUrl: 'https://www.chairish.com/shop/search?q=', color: '#E57373' },
    { name: '1stDibs', logo: '💎', baseUrl: 'https://www.1stdibs.com/search/?q=', color: '#000000' },
    { name: 'Apt2B', logo: '🏢', baseUrl: 'https://www.apt2b.com/search?q=', color: '#26A69A' },
  ],
};

// Flatten stores for easy searching
const allStores = Object.values(storeDatabase).flat();

// Store name -> domain mapping for logo fetching
const storeDomains = {
  'Amazon': 'amazon.com',
  'Walmart': 'walmart.com',
  'Target': 'target.com',
  'Costco': 'costco.com',
  'Home Depot': 'homedepot.com',
  'Lowes': 'lowes.com',
  "Lowe's": 'lowes.com',
  'Menards': 'menards.com',
  'Ace Hardware': 'acehardware.com',
  'Sherwin-Williams': 'sherwin-williams.com',
  'Benjamin Moore': 'benjaminmoore.com',
  'IKEA': 'ikea.com',
  'Wayfair': 'wayfair.com',
  'Ashley Furniture': 'ashleyfurniture.com',
  'Rooms To Go': 'roomstogo.com',
  "Bob's Discount": 'mybobs.com',
  'Nebraska Furniture': 'nfm.com',
  'RC Willey': 'rcwilley.com',
  'Article': 'article.com',
  'Joybird': 'joybird.com',
  'Burrow': 'burrow.com',
  'Raymour & Flanigan': 'raymourflanigan.com',
  'West Elm': 'westelm.com',
  'Pottery Barn': 'potterybarn.com',
  'Crate & Barrel': 'crateandbarrel.com',
  'CB2': 'cb2.com',
  'Restoration Hardware': 'rh.com',
  'Arhaus': 'arhaus.com',
  'Ethan Allen': 'ethanallen.com',
  'Design Within Reach': 'dwr.com',
  'Ruggable': 'ruggable.com',
  'Rugs USA': 'rugsusa.com',
  'Boutique Rugs': 'boutiquerugs.com',
  'Loloi Rugs': 'loloirugs.com',
  'Safavieh': 'safavieh.com',
  'The Rug Company': 'therugcompany.com',
  'Blinds.com': 'blinds.com',
  'SelectBlinds': 'selectblinds.com',
  'Budget Blinds': 'budgetblinds.com',
  'The Shade Store': 'theshadestore.com',
  'Smith & Noble': 'smithandnoble.com',
  'Levolor': 'levolor.com',
  'Bali Blinds': 'baliblinds.com',
  'Lumens': 'lumens.com',
  'Lamps Plus': 'lampsplus.com',
  '1800Lighting': '1800lighting.com',
  'YLighting': 'ylighting.com',
  'Lighting Direct': 'lightingdirect.com',
  'Build.com': 'build.com',
  'Overstock': 'overstock.com',
  'At Home': 'athome.com',
  'Big Lots': 'biglots.com',
  'HomeGoods': 'homegoods.com',
  'Tuesday Morning': 'tuesdaymorning.com',
  'World Market': 'worldmarket.com',
  'AllModern': 'allmodern.com',
  'Hayneedle': 'hayneedle.com',
  'Houzz': 'houzz.com',
  'Chairish': 'chairish.com',
  '1stDibs': '1stdibs.com',
  'Apt2B': 'apt2b.com',
};

// Get logo URL for a store
const getStoreLogo = (storeName) => {
  const domain = storeDomains[storeName];
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
};

const getStoreFaviconFallback = (storeName) => {
  const domain = storeDomains[storeName];
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

// Reusable store logo component - tries Clearbit logo, then Google favicon, then initials
const StoreLogo = ({ storeName, size = 'md', className = '' }) => {
  const [logoFailed, setLogoFailed] = React.useState(false);
  const [fallbackFailed, setFallbackFailed] = React.useState(false);
  const logoUrl = getStoreLogo(storeName);
  const fallbackUrl = getStoreFaviconFallback(storeName);
  const initials = storeName ? storeName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const imgSrc = !logoFailed && logoUrl ? logoUrl : (!fallbackFailed && fallbackUrl ? fallbackUrl : null);
  const handleError = !logoFailed ? () => setLogoFailed(true) : () => setFallbackFailed(true);

  if (imgSrc) {
    return (
      <div className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-white flex items-center justify-center p-0.5 ${className}`}>
        <img
          src={imgSrc}
          alt={storeName}
          className="w-full h-full object-contain"
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-xl flex items-center justify-center bg-gray-700 text-gray-300 font-medium text-xs ${className}`}>
      {initials}
    </div>
  );
};

// Store category labels
const storeCategories = [
  { id: 'bigBox', name: 'Big Box Retailers' },
  { id: 'homeImprovement', name: 'Home Improvement' },
  { id: 'furniture', name: 'Furniture Stores' },
  { id: 'designer', name: 'Designer / High-End' },
  { id: 'rugs', name: 'Rugs & Carpets' },
  { id: 'blinds', name: 'Blinds & Shades' },
  { id: 'lighting', name: 'Lighting' },
  { id: 'budget', name: 'Budget / Discount' },
  { id: 'online', name: 'Online / DTC' },
];

// ProductImage component - shows image URL if available, falls back to emoji
const ProductImage = ({ product, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  const imgSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const storeLogoSize = size === 'lg' ? 'xl' : size === 'md' ? 'xl' : 'md';

  if (product.imageUrl && !imgError) {
    return (
      <div className="relative shrink-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`${imgSizeClasses[size]} rounded-lg object-cover bg-gray-100`}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className="shrink-0">
      <StoreLogo storeName={product.store} size={storeLogoSize} />
    </div>
  );
};

export default function EZShoppingApp() {
  // Load products from localStorage or use defaults
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('ez-shopping-products');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge any missing categories from defaults
        const merged = { ...defaultProducts };
        for (const key of Object.keys(parsed)) {
          if (parsed[key] && parsed[key].length > 0) {
            merged[key] = parsed[key];
          }
        }
        return merged;
      }
      return defaultProducts;
    } catch {
      return defaultProducts;
    }
  });
  
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [detectedArea, setDetectedArea] = useState(null);
  const [hoveredArea, setHoveredArea] = useState(null);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    color: 'All',
    minRating: 0,
    brand: 'All',
    size: 'All',
    features: [], // Category-specific features
    sortBy: 'relevance', // relevance, price-low, price-high, rating
  });
  const [measurements, setMeasurements] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adminCategory, setAdminCategory] = useState('blinds');
  const [showMeasurePopup, setShowMeasurePopup] = useState(false);
  const [measureMode, setMeasureMode] = useState('manual'); // 'manual' or 'reference'
  const [manualDimensions, setManualDimensions] = useState({ width: '', height: '' });
  const [referenceStep, setReferenceStep] = useState(0);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const popularRowRef = useRef(null);

  // Reference measurement calibration state
  const [referenceCalibration, setReferenceCalibration] = useState(null); // { pixelsPerInch }
  const [showCardCalibration, setShowCardCalibration] = useState(false);
  const [showTapMeasure, setShowTapMeasure] = useState(false);
  const [tapMeasureTarget, setTapMeasureTarget] = useState(null); // 'width' | 'height'

  // AI Smart Scan state
  const [smartScanActive, setSmartScanActive] = useState(false);
  const {
    modelStatus,
    aiZones,
    isScanning: aiIsScanning,
    initModel: initAIModel,
    startContinuousScanning,
    stopContinuousScanning,
    resetZones,
  } = useZoneDetection();

  // WebXR AR Measurement
  const [arMeasureTarget, setArMeasureTarget] = useState(null); // 'width' | 'height' | null
  const arCanvasRef = useRef(null);
  const arOverlayRef = useRef(null);
  const arSessionRef = useRef(null);
  const arPointsRef = useRef([]);
  const arDistanceRef = useRef(null);
  // DOM refs for direct manipulation (no React re-renders in XR loop)
  const arReticleRef = useRef(null);
  const arReticleDotRef = useRef(null);
  const arStatusRef = useRef(null);
  const arDot1Ref = useRef(null);
  const arDot2Ref = useRef(null);
  const arLineRef = useRef(null);
  const arResultRef = useRef(null);
  const arBottomRef = useRef(null);

  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Saved Rooms - persist room measurements by name
  const [savedRooms, setSavedRooms] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ez-shopping-saved-rooms')) || [];
    } catch { return []; }
  });
  const [roomName, setRoomName] = useState('');
  const [showSaveRoomModal, setShowSaveRoomModal] = useState(false);

  // Price Alerts - notify when prices drop
  const [priceAlerts, setPriceAlerts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ez-shopping-price-alerts')) || [];
    } catch { return []; }
  });
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertProduct, setAlertProduct] = useState(null);
  const [alertTargetPrice, setAlertTargetPrice] = useState('');

  // Budget Tracker - track spending against budgets
  const [budgets, setBudgets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ez-shopping-budgets')) || [];
    } catch { return []; }
  });
  const [activeBudgetId, setActiveBudgetId] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  // Color Matching - extract colors from camera
  const [colorMatchEnabled, setColorMatchEnabled] = useState(false);
  const [customColors, setCustomColors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ez-shopping-custom-colors')) || [];
    } catch { return []; }
  });
  const [sampledColor, setSampledColor] = useState(null);

  // Theme - light or dark mode (persisted to localStorage)
  // eslint-disable-next-line no-unused-vars
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('ez-shopping-theme') || 'light';
    } catch { return 'light'; }
  });

  useEffect(() => {
    localStorage.setItem('ez-shopping-theme', theme);
  }, [theme]);


  // Splash screen timer
  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 2400);
    const hideTimer = setTimeout(() => setShowSplash(false), 3000);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  // Theme classes with teal accents - Premium styling
  const themeClasses = {
    bg: '',
    bgStyle: theme === 'light'
      ? { background: '#f2ebe4' }
      : { background: '#1a1917' },
    card: theme === 'light'
      ? 'bg-[#fffbf8] border-[#e5dbd3] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
      : 'bg-[#242320] border-[#3d3a34] shadow-sm',
    cardHover: theme === 'light'
      ? 'hover:border-[#c2725b]'
      : 'hover:border-teal-600',
    cardElevated: theme === 'light'
      ? 'bg-[#fffbf8] border-[#e5dbd3] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
      : 'bg-[#2a2924] border-[#3d3a34] shadow-sm',
    text: theme === 'light' ? 'text-[#2c2420]' : 'text-[#e8e4dc]',
    textSecondary: theme === 'light' ? 'text-[#7a6b60]' : 'text-[#a09a90]',
    textMuted: theme === 'light' ? 'text-[#b0a298]' : 'text-[#6b665e]',
    border: theme === 'light' ? 'border-[#e5dbd3]' : 'border-[#3d3a34]',
    input: theme === 'light' ? 'bg-[#fffbf8] border-[#e5dbd3] text-[#2c2420] focus:border-[#c2725b] focus:ring-1 focus:ring-[#c2725b]/20' : 'bg-[#1a1917] border-[#4a463e] text-[#e8e4dc] focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20',
    button: theme === 'light'
      ? 'bg-[#c2725b] text-white hover:bg-[#a85a44]'
      : 'bg-teal-600 text-white hover:bg-teal-500',
    buttonSecondary: theme === 'light'
      ? 'bg-[#fffbf8]/80 backdrop-blur-sm text-[#7a6b60] border border-[#e5dbd3] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:bg-[#fffbf8] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#c2725b]'
      : 'bg-[#2a2924] text-[#c8c2b8] border border-[#4a463e] hover:bg-[#33312b] hover:text-teal-400 hover:border-teal-600',
    badge: theme === 'light' ? 'bg-[#fdf0ea] text-[#7a6b60] border border-[#e5dbd3]' : 'bg-[#2a2924] text-[#a09a90] border border-[#4a463e]',
    accent: 'text-[#c2725b]',
    accentBg: theme === 'light' ? 'bg-[#fdf0ea]' : 'bg-teal-900/30',
    accentBorder: theme === 'light' ? 'border-[#e5dbd3]' : 'border-teal-800',
    iconBg: theme === 'light' ? 'bg-[#fdf0ea] text-[#c2725b]' : 'bg-teal-900/30 text-teal-400',
    glow: '',
  };

  // Save products to localStorage whenever they change
  useEffect(() => {
    try { localStorage.setItem('ez-shopping-products', JSON.stringify(products)); } catch { /* localStorage full or unavailable */ }
  }, [products]);

  // Save rooms to localStorage
  useEffect(() => {
    try { localStorage.setItem('ez-shopping-saved-rooms', JSON.stringify(savedRooms)); } catch { /* localStorage full or unavailable */ }
  }, [savedRooms]);

  // Save price alerts to localStorage
  useEffect(() => {
    try { localStorage.setItem('ez-shopping-price-alerts', JSON.stringify(priceAlerts)); } catch { /* localStorage full or unavailable */ }
  }, [priceAlerts]);

  // Save budgets to localStorage
  useEffect(() => {
    try { localStorage.setItem('ez-shopping-budgets', JSON.stringify(budgets)); } catch { /* localStorage full or unavailable */ }
  }, [budgets]);

  // Save custom colors to localStorage
  useEffect(() => {
    try { localStorage.setItem('ez-shopping-custom-colors', JSON.stringify(customColors)); } catch { /* localStorage full or unavailable */ }
  }, [customColors]);

  // Connect camera stream to video element when available
  useEffect(() => {
    if (cameraStream && videoRef.current && currentView === 'camera') {
      videoRef.current.srcObject = cameraStream;
      // iOS Safari requires explicit play() after srcObject assignment
      videoRef.current.play().catch(() => {});
    }
  }, [cameraStream, currentView]);

  const detectionZones = [
    { id: 'window', x: 15, y: 15, width: 30, height: 35, category: 'blinds', label: 'Window Area' },
    { id: 'ceiling', x: 35, y: 2, width: 30, height: 15, category: 'lighting', label: 'Ceiling / Lighting' },
    { id: 'floor', x: 10, y: 75, width: 80, height: 22, category: 'rugs', label: 'Floor Space' },
    { id: 'corner', x: 70, y: 25, width: 25, height: 35, category: 'furniture', label: 'Furniture Area' },
    { id: 'wall', x: 48, y: 20, width: 20, height: 30, category: 'paint', label: 'Wall / Paint' },
    { id: 'counter', x: 5, y: 52, width: 40, height: 18, category: 'countertops', label: 'Counter Area' },
    { id: 'door', x: 75, y: 62, width: 20, height: 35, category: 'doors', label: 'Door Area' },
  ];

  const startCamera = async () => {
    try {
      // iOS Safari ignores ideal resolution constraints and may fail — use simple constraints
      const constraints = isIOS
        ? { video: { facingMode: 'environment' } }
        : { video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } };
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch {
        // Fallback: bare minimum constraints
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      setCameraStream(stream);
      setCameraActive(true);
      setCurrentView('camera');
    } catch {
      setCameraStream(null);
      setCameraActive(true);
      setCurrentView('camera');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
    setCurrentView('home');
    // Clean up Smart Scan
    stopContinuousScanning();
    setSmartScanActive(false);
    resetZones();
  };

  // ── WebXR AR Measurement ──
  const formatARDistance = (dist) => {
    if (!dist) return '';
    const ft = Math.floor(dist.inches / 12);
    const inches = Math.round(dist.inches % 12);
    if (ft === 0) return `${inches}"`;
    if (inches === 0) return `${ft}'`;
    return `${ft}' ${inches}"`;
  };

  // Direct DOM update helper — zero React re-renders
  const arUpdateUI = (surfaceFound, points, distance) => {
    const color = surfaceFound ? '#e07850' : 'rgba(255,255,255,0.3)';
    if (arReticleRef.current) arReticleRef.current.style.borderColor = color;
    if (arReticleDotRef.current) arReticleDotRef.current.style.display = surfaceFound ? 'block' : 'none';
    // crosshair lines
    arReticleRef.current?.querySelectorAll('[data-xhair]').forEach(el => { el.style.background = color; });

    if (arStatusRef.current) {
      if (points.length === 0) arStatusRef.current.textContent = surfaceFound ? 'Tap to set first point' : 'Scanning for surfaces...';
      else if (points.length === 1) arStatusRef.current.textContent = 'Tap to set second point';
      else if (distance) arStatusRef.current.textContent = formatARDistance(distance);
    }
    if (arDot1Ref.current) {
      arDot1Ref.current.style.background = points.length >= 1 ? '#e07850' : 'rgba(255,255,255,0.15)';
      arDot1Ref.current.style.boxShadow = points.length >= 1 ? '0 0 10px rgba(224,120,80,0.5)' : 'none';
    }
    if (arDot2Ref.current) {
      arDot2Ref.current.style.background = points.length >= 2 ? '#e07850' : 'rgba(255,255,255,0.15)';
      arDot2Ref.current.style.boxShadow = points.length >= 2 ? '0 0 10px rgba(224,120,80,0.5)' : 'none';
    }
    if (arLineRef.current) arLineRef.current.style.background = points.length >= 2 ? '#e07850' : 'rgba(255,255,255,0.1)';

    if (arResultRef.current) {
      if (distance) {
        arResultRef.current.innerHTML = `
          <div style="font-size:36px;font-weight:700;font-family:'Cormorant Garamond',serif;color:#e07850;text-shadow:0 2px 12px rgba(0,0,0,0.5)">${formatARDistance(distance)}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:6px">${distance.inches}" (${distance.meters.toFixed(2)}m)</div>
        `;
      } else {
        arResultRef.current.innerHTML = `<div style="font-size:14px;color:rgba(255,255,255,0.6)">${surfaceFound ? 'Surface detected — tap to place a point' : 'Move your phone slowly to detect surfaces...'}</div>`;
      }
    }
    if (arBottomRef.current) arBottomRef.current.style.display = distance ? 'flex' : 'none';
  };

  const startCameraFallback = (measureTarget) => {
    setArMeasureTarget(measureTarget);
    if (!referenceCalibration) {
      if (cameraStream) {
        setShowCardCalibration(true);
      }
    } else {
      setTapMeasureTarget(measureTarget || 'width');
      setShowTapMeasure(true);
    }
  };

  const startARMeasure = (measureTarget = null) => {
    // Always use camera-based flow — WebXR immersive-ar freezes on many Android devices
    startCameraFallback(measureTarget);
  };

  const stopARMeasure = () => {
    if (arSessionRef.current) {
      arSessionRef.current.end();
    }
  };

  const useARMeasurement = () => {
    const dist = arDistanceRef.current;
    if (!dist) return;
    const val = String(dist.inches);
    if (arMeasureTarget === 'width') {
      setManualDimensions(d => ({ ...d, width: val }));
    } else if (arMeasureTarget === 'height') {
      setManualDimensions(d => ({ ...d, height: val }));
    }
    stopARMeasure();
  };

  const handleZoneHover = (zone) => {
    setHoveredArea(zone);
  };

  const handleZoneClick = (zone) => {
    setDetectedArea(zone);
    setSelectedCategory(zone.category);
    setShowMeasurePopup(true); // Show measurement popup first
    setMeasurements(null); // Reset measurements
    setManualDimensions({ width: '', height: '' });
    setReferenceCalibration(null); // Reset calibration for new zone
  };

  const confirmMeasurements = () => {
    if (manualDimensions.width && manualDimensions.height) {
      setMeasurements({
        width: parseInt(manualDimensions.width),
        height: parseInt(manualDimensions.height),
        unit: selectedCategory === 'rugs' ? 'ft' : 'in'
      });
    }
    setShowMeasurePopup(false);
    setShowProductPopup(true);
  };

  const skipMeasurements = () => {
    setMeasurements(null);
    setShowMeasurePopup(false);
    setShowProductPopup(true);
  };

  const getFilteredProducts = () => {
    if (!selectedCategory) return [];

    let filtered = products[selectedCategory]?.filter(product => {
      // Price filter
      const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

      // Color filter
      const colorMatch = filters.color === 'All' || product.color === filters.color;

      // Rating filter
      const ratingMatch = product.rating >= filters.minRating;

      // Brand/Store filter
      const brandMatch = filters.brand === 'All' ||
        product.brand?.toLowerCase().includes(filters.brand.toLowerCase()) ||
        product.store?.toLowerCase().includes(filters.brand.toLowerCase());

      // Size filter
      const sizeMatch = filters.size === 'All' || product.size === filters.size;

      // Features filter (all selected features must be present)
      const featuresMatch = filters.features.length === 0 ||
        filters.features.every(feature =>
          product.features?.includes(feature) ||
          product.name?.toLowerCase().includes(feature.toLowerCase()) ||
          product.description?.toLowerCase().includes(feature.toLowerCase())
        );

      return priceMatch && colorMatch && ratingMatch && brandMatch && sizeMatch && featuresMatch;
    }) || [];

    // Apply sorting
    if (filters.sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }
    // 'relevance' keeps original order

    return filtered;
  };

  // Admin functions
  const addProduct = (category) => {
    const newProduct = {
      id: Date.now(),
      name: 'New Product',
      brand: 'Brand',
      price: 99,
      rating: 4.0,
      color: 'White',
      image: '📦',
      link: 'https://',
      size: 'Standard'
    };
    setProducts(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), newProduct]
    }));
    setEditingProduct(newProduct.id);
  };

  const updateProduct = (category, productId, updates) => {
    setProducts(prev => ({
      ...prev,
      [category]: prev[category].map(p => 
        p.id === productId ? { ...p, ...updates } : p
      )
    }));
  };

  const deleteProduct = (category, productId) => {
    setProducts(prev => ({
      ...prev,
      [category]: prev[category].filter(p => p.id !== productId)
    }));
  };

  const resetToDefaults = () => {
    if (confirm('Reset all products to defaults? This will remove any custom products.')) {
      setProducts(defaultProducts);
    }
  };

  // Room Functions
  const saveRoom = () => {
    if (roomName.trim() && manualDimensions.width && manualDimensions.height) {
      const newRoom = {
        id: Date.now(),
        name: roomName.trim(),
        width: parseInt(manualDimensions.width),
        height: parseInt(manualDimensions.height),
        unit: selectedCategory === 'rugs' ? 'ft' : 'in',
        category: selectedCategory,
        createdAt: new Date().toISOString()
      };
      setSavedRooms(prev => [...prev, newRoom]);
      setRoomName('');
      setShowSaveRoomModal(false);
    }
  };

  const loadRoom = (room) => {
    setManualDimensions({ width: room.width.toString(), height: room.height.toString() });
    setSelectedCategory(room.category);
  };

  const deleteRoom = (roomId) => {
    setSavedRooms(prev => prev.filter(r => r.id !== roomId));
  };

  // Price Alert Functions
  const addPriceAlert = () => {
    if (alertProduct && alertTargetPrice) {
      const newAlert = {
        id: Date.now(),
        productId: alertProduct.id,
        category: selectedCategory,
        targetPrice: parseFloat(alertTargetPrice),
        productName: alertProduct.name,
        currentPrice: alertProduct.price,
        createdAt: new Date().toISOString()
      };
      setPriceAlerts(prev => [...prev, newAlert]);
      setShowAlertModal(false);
      setAlertProduct(null);
      setAlertTargetPrice('');
    }
  };

  const deletePriceAlert = (alertId) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const getTriggeredAlerts = () => {
    return priceAlerts.filter(alert => {
      const product = products[alert.category]?.find(p => p.id === alert.productId);
      return product && product.price <= alert.targetPrice;
    });
  };

  // Budget Functions
  const createBudget = () => {
    if (newBudgetName.trim() && newBudgetAmount) {
      const newBudget = {
        id: Date.now(),
        name: newBudgetName.trim(),
        totalBudget: parseFloat(newBudgetAmount),
        savedProducts: [],
        createdAt: new Date().toISOString()
      };
      setBudgets(prev => [...prev, newBudget]);
      setActiveBudgetId(newBudget.id);
      setShowBudgetModal(false);
      setNewBudgetName('');
      setNewBudgetAmount('');
    }
  };

  const addProductToBudget = (product, budgetId) => {
    setBudgets(prev => prev.map(budget => {
      if (budget.id === budgetId) {
        const existing = budget.savedProducts.find(p => p.productId === product.id);
        if (existing) {
          return {
            ...budget,
            savedProducts: budget.savedProducts.map(p =>
              p.productId === product.id ? { ...p, quantity: p.quantity + 1 } : p
            )
          };
        }
        return {
          ...budget,
          savedProducts: [...budget.savedProducts, {
            productId: product.id,
            category: selectedCategory,
            name: product.name,
            price: product.price,
            quantity: 1
          }]
        };
      }
      return budget;
    }));
  };

  const removeProductFromBudget = (productId, budgetId) => {
    setBudgets(prev => prev.map(budget => {
      if (budget.id === budgetId) {
        return {
          ...budget,
          savedProducts: budget.savedProducts.filter(p => p.productId !== productId)
        };
      }
      return budget;
    }));
  };

  const deleteBudget = (budgetId) => {
    setBudgets(prev => prev.filter(b => b.id !== budgetId));
    if (activeBudgetId === budgetId) setActiveBudgetId(null);
  };

  const getBudgetSpent = (budget) => budget.savedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const getBudgetRemaining = (budget) => budget.totalBudget - getBudgetSpent(budget);

  // Color Matching Functions
  const extractColorFromVideo = () => {
    if (!videoRef.current || !cameraStream) return null;
    // iOS may report 0 dimensions before video metadata loads
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) return null;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 50;
    canvas.height = 50;
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    const centerX = videoWidth / 2 - 25;
    const centerY = videoHeight / 2 - 25;
    ctx.drawImage(videoRef.current, centerX, centerY, 50, 50, 0, 0, 50, 50);
    const imageData = ctx.getImageData(0, 0, 50, 50);
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i];
      g += imageData.data[i + 1];
      b += imageData.data[i + 2];
    }
    const pixels = imageData.data.length / 4;
    r = Math.round(r / pixels);
    g = Math.round(g / pixels);
    b = Math.round(b / pixels);
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    return hex;
  };

  const findClosestColorName = (hex) => {
    const colorMap = {
      'White': '#FFFFFF', 'Black': '#000000', 'Gray': '#808080',
      'Beige': '#F5F5DC', 'Navy': '#000080', 'Natural': '#D2B48C',
      'Multi': '#FF00FF', 'Oak': '#C19A6B', 'Ivory': '#FFFFF0',
      'Charcoal': '#36454F', 'Brass': '#B5A642', 'Cream': '#FFFDD0'
    };
    const hexToRgb = (h) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    const inputRgb = hexToRgb(hex);
    if (!inputRgb) return 'Multi';
    let closest = 'Multi';
    let minDist = Infinity;
    for (const [name, colorHex] of Object.entries(colorMap)) {
      const c = hexToRgb(colorHex);
      const dist = Math.sqrt(
        Math.pow(inputRgb.r - c.r, 2) +
        Math.pow(inputRgb.g - c.g, 2) +
        Math.pow(inputRgb.b - c.b, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        closest = name;
      }
    }
    return closest;
  };

  const sampleColor = () => {
    const hex = extractColorFromVideo();
    if (hex) {
      const name = findClosestColorName(hex);
      setSampledColor({ hex, name });
    }
  };

  const addCustomColor = () => {
    if (sampledColor) {
      const newColor = {
        id: Date.now(),
        hex: sampledColor.hex,
        name: sampledColor.name,
        createdAt: new Date().toISOString()
      };
      setCustomColors(prev => [...prev, newColor]);
      setSampledColor(null);
    }
  };

  const deleteCustomColor = (colorId) => {
    setCustomColors(prev => prev.filter(c => c.id !== colorId));
  };

  // Home Screen
  // Map category IDs to CSS module icon class names
  const catIconClassMap = {
    furniture: 'catIconFurniture', lighting: 'catIconLighting', rugs: 'catIconRugs',
    blinds: 'catIconBlinds', cabinets: 'catIconCabinets', countertops: 'catIconCountertops',
    appliances: 'catIconAppliances', plumbing: 'catIconPlumbing', flooring: 'catIconFlooring',
    paint: 'catIconPaint', doors: 'catIconDoors', outdoor: 'catIconOutdoor',
  };

  const HomeScreen = () => (
    <div className={homeStyles.app}>
      {/* Header */}
      <header className={homeStyles.header}>
        <div className={homeStyles.logo}>
          <div className={homeStyles.logoMark}>EZ</div>
          <div className={homeStyles.logoText}>EZ Shopping</div>
        </div>
        <div className={homeStyles.headerRight}>
          <button className={homeStyles.iconBtn} onClick={() => setCurrentView('admin')} aria-label="Settings">
            <Settings size={20} />
          </button>
          <button className={homeStyles.iconBtn} aria-label="Notifications">
            <Bell size={20} />
          </button>
          <div className={homeStyles.avatar}>T</div>
        </div>
      </header>

      {/* Scroll Content */}
      <main className={homeStyles.scroll}>
        {/* Hero */}
        <section className={`${homeStyles.hero} ${homeStyles.animHero}`}>
          <div className={homeStyles.heroGreeting}>
            See it. Scan it.<br />
            <span className={homeStyles.heroAccent}>Style it.</span>
          </div>

          <button className={homeStyles.cameraCta} onClick={startCamera}>
            <div className={homeStyles.cameraCtaIcon}>
              <Camera size={22} />
            </div>
            <div className={homeStyles.cameraCtaText}>
              <div className={homeStyles.cameraCtaTitle}>Scan Any Room</div>
              <div className={homeStyles.cameraCtaSub}>Point your camera to find matching products</div>
            </div>
            <div className={homeStyles.cameraCtaArrow}>
              <ChevronRight size={20} />
            </div>
          </button>

          <div className={homeStyles.searchRow}>
            <div className={homeStyles.searchBar}>
              <Search size={17} />
              <input
                className={homeStyles.searchInput}
                type="text"
                placeholder="Search furniture, decor, lighting..."
              />
            </div>
          </div>
        </section>

        {/* Trending */}
        <div className={`${homeStyles.sectionHeader} ${homeStyles.anim1}`}>
          <div className={homeStyles.sectionEyebrow}>TRENDING NOW</div>
        </div>

        <div
          ref={popularRowRef}
          className={`${homeStyles.featuredRow} ${homeStyles.anim2}`}
        >
          {[
            { id: 'furniture', name: 'Furniture', badge: 'Popular', badgeClass: 'badgePopular', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=250&fit=crop', timestamp: 'Updated 2m ago' },
            { id: 'lighting', name: 'Lighting', badge: 'Trending', badgeClass: 'badgeTrending', img: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=250&fit=crop', timestamp: 'Updated 5m ago' },
            { id: 'outdoor', name: 'Outdoor', badge: 'New', badgeClass: 'badgeNew', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=250&fit=crop' },
            { id: 'rugs', name: 'Rugs', badge: 'Popular', badgeClass: 'badgePopular', img: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=250&fit=crop' },
            { id: 'blinds', name: 'Blinds & Shades', badge: 'Trending', badgeClass: 'badgeTrending', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=250&fit=crop' },
          ].map((cat, idx) => (
            <div
              key={cat.id}
              className={`${homeStyles.featuredCard} ${idx === 0 ? homeStyles.featuredCardHero : ''}`}
              onClick={() => { setSelectedCategory(cat.id); setCurrentView('results'); }}
            >
              <img className={`${homeStyles.featuredImg} ${idx === 0 ? homeStyles.featuredImgHero : ''}`} src={cat.img} alt={cat.name} />
              <div className={homeStyles.featuredBody}>
                <div className={homeStyles.featuredName}>{cat.name}</div>
                <div className={homeStyles.featuredMeta}>
                  <span className={homeStyles.featuredCount}>{products[cat.id]?.length || 0} links</span>
                  <span className={`${homeStyles.featuredBadge} ${homeStyles[cat.badgeClass]}`}>{cat.badge}</span>
                </div>
                {cat.timestamp && <div className={homeStyles.timestamp}>{cat.timestamp}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Spotlight */}
        <div
          className={`${homeStyles.spotlight} ${homeStyles.anim3}`}
          onClick={() => { setSelectedCategory('furniture'); setCurrentView('results'); }}
        >
          <img
            className={homeStyles.spotlightImg}
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=400&fit=crop"
            alt="Refresh Your Living Room"
          />
          <div className={homeStyles.spotlightOverlay} />
          <div className={homeStyles.spotlightContent}>
            <div className={homeStyles.spotlightEyebrow}>EDITOR'S PICK</div>
            <div className={homeStyles.spotlightTitle}>Refresh Your Living Room</div>
            <div className={homeStyles.spotlightSub}>Scan trending furniture styles this season</div>
          </div>
        </div>

        {/* Browse All */}
        <div className={`${homeStyles.sectionHeader} ${homeStyles.anim4}`}>
          <div className={homeStyles.sectionEyebrow}>CATEGORIES</div>
          <button className={homeStyles.sectionLink} onClick={() => { setSelectedCategory('furniture'); setCurrentView('results'); }}>See all &rarr;</button>
        </div>

        <div className={homeStyles.catPillRow}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={homeStyles.catPill}
              onClick={() => { setSelectedCategory(cat.id); setCurrentView('results'); }}
            >
              <div className={`${homeStyles.catPillIcon} ${homeStyles[catIconClassMap[cat.id]] || ''}`}>
                <cat.icon size={14} strokeWidth={1.8} />
              </div>
              <span className={homeStyles.catPillName}>{cat.name}</span>
            </button>
          ))}
        </div>

      </main>

      {/* Floating Camera FAB */}
      <button className={homeStyles.fab} aria-label="Scan room" onClick={startCamera}>
        <Camera size={24} />
      </button>

      {/* Bottom Nav */}
      <nav className={homeStyles.nav}>
        <button className={`${homeStyles.navBtn} ${homeStyles.navBtnActive}`}>
          <Home size={22} />
          <span>Home</span>
        </button>
        <button className={homeStyles.navBtn} onClick={() => setCurrentView('stores')}>
          <Search size={22} />
          <span>Explore</span>
        </button>
        <div className={homeStyles.navSpacer} />
        <button className={homeStyles.navBtn} onClick={() => setCurrentView('rooms')}>
          <Heart size={22} />
          <span>Saved</span>
        </button>
        <button className={homeStyles.navBtn} onClick={() => setCurrentView('admin')}>
          <User size={22} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );

  // Admin Panel
  const AdminPanel = () => {
    const [editForm, setEditForm] = useState({});
    
    const startEdit = (product) => {
      setEditingProduct(product.id);
      setEditForm({ ...product });
    };
    
    const saveEdit = () => {
      updateProduct(adminCategory, editingProduct, editForm);
      setEditingProduct(null);
      setEditForm({});
    };
    
    const cancelEdit = () => {
      setEditingProduct(null);
      setEditForm({});
    };

    return (
      <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-200`} style={themeClasses.bgStyle}>
        <div className="px-6 py-8 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setCurrentView('home')}
              className={`w-11 h-11 rounded-xl ${theme === 'light' ? 'bg-[#fffbf8] border-[#e5dbd3]' : 'bg-white/5 border-white/10'} border flex items-center justify-center`}
            >
              <ChevronLeft className={`w-5 h-5 ${theme === 'light' ? 'text-[#2c2420]' : 'text-gray-300'}`} />
            </button>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold">Manage Products</h1>
            <button 
              onClick={resetToDefaults}
              className={`text-xs ${theme === 'light' ? 'text-[#b0a298] hover:text-red-500' : 'text-gray-400 hover:text-red-400'} transition-colors`}
            >
              Reset
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setAdminCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  adminCategory === cat.id
                    ? `${theme === 'light' ? 'bg-[#c2725b] text-white' : 'bg-teal-500 text-white'}`
                    : `${theme === 'light' ? 'bg-[#fffbf8] text-[#7a6b60] border border-[#e5dbd3]' : 'bg-white/5 text-gray-300 border border-white/10'}`
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => addProduct(adminCategory)}
            className={`w-full mb-4 py-3 rounded-xl border-2 border-dashed ${theme === 'light' ? 'border-[#e5dbd3] text-[#b0a298] hover:border-[#c2725b]/50 hover:text-[#c2725b]' : 'border-white/20 text-gray-400 hover:border-teal-500/50 hover:text-teal-400'} transition-all flex items-center justify-center gap-2`}
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>

          {/* Product List */}
          <div className="space-y-3">
            {products[adminCategory]?.map((product) => (
              <div 
                key={product.id}
                className={`${theme === 'light' ? 'bg-[#fffbf8] rounded-2xl border border-[#e5dbd3]' : 'bg-white/5 rounded-2xl border border-white/10'} overflow-hidden`}
              >
                {editingProduct === product.id ? (
                  // Edit Mode
                  <div className="p-4 space-y-4">
                    <div className="flex gap-3">
                      {/* Store Badge Preview */}
                      <div className="shrink-0">
                        <label className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} block mb-1`}>Store</label>
                        <StoreLogo storeName={editForm.store || ''} size="xl" />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <label className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} block mb-1`}>Product Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className={`w-full px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-[#fffbf8] border border-[#e5dbd3] text-[#2c2420]' : 'bg-white/10 border border-white/20 text-white'} text-sm ${theme === 'light' ? 'focus:border-[#c2725b]' : 'focus:border-teal-500'} outline-none`}
                          />
                        </div>
                        <div>
                          <label className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} block mb-1`}>Brand</label>
                          <input
                            type="text"
                            value={editForm.brand}
                            onChange={(e) => setEditForm(f => ({ ...f, brand: e.target.value }))}
                            className={`w-full px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-[#fffbf8] border border-[#e5dbd3] text-[#2c2420]' : 'bg-white/10 border border-white/20 text-white'} text-sm ${theme === 'light' ? 'focus:border-[#c2725b]' : 'focus:border-teal-500'} outline-none`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} block mb-1 flex items-center gap-1`}>
                        <Image className="w-3 h-3" /> Product Image URL (optional)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={editForm.imageUrl || ''}
                          onChange={(e) => setEditForm(f => ({ ...f, imageUrl: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                          className={`flex-1 px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-[#fffbf8] border border-[#e5dbd3] text-[#2c2420]' : 'bg-white/10 border border-white/20 text-white'} text-sm ${theme === 'light' ? 'focus:border-[#c2725b]' : 'focus:border-teal-500'} outline-none`}
                        />
                        {editForm.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setEditForm(f => ({ ...f, imageUrl: '' }))}
                            className="px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {editForm.imageUrl && (
                        <div className="mt-2 flex items-center gap-2">
                          <img
                            src={editForm.imageUrl}
                            alt="Preview"
                            className="w-12 h-12 rounded-lg object-cover bg-white/10"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <span className="text-xs text-green-400">Image URL set (store badge will be fallback)</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Link - With Store Picker */}
                    <div>
                      <label className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} block mb-2 flex items-center gap-1`}>
                        <Link className="w-3 h-3" /> Product Link (URL)
                      </label>
                      
                      {/* Quick Store Picker */}
                      <div className="mb-3">
                        <p className={`text-xs ${theme === 'light' ? 'text-[#7a6b60]' : 'text-gray-400'} mb-2`}>Quick pick a store:</p>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {allStores.slice(0, 20).map((store) => (
                            <button
                              key={store.name}
                              type="button"
                              onClick={() => setEditForm(f => ({ 
                                ...f, 
                                link: store.baseUrl + encodeURIComponent(f.name || 'product'),
                                store: store.name
                              }))}
                              className={`px-2.5 py-1.5 rounded-md text-xs font-medium ${theme === 'light' ? 'bg-[#fdf0ea] border border-[#e5dbd3] text-[#7a6b60] hover:bg-[#f8e6dd] hover:text-[#2c2420]' : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'} transition-colors`}
                            >
                              {store.name}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditForm(f => ({ ...f, showAllStores: !f.showAllStores }))}
                          className={`text-xs ${theme === 'light' ? 'text-[#c2725b]' : 'text-teal-400'} mt-2 hover:underline`}
                        >
                          {editForm.showAllStores ? 'Show less' : `Show all ${allStores.length} stores →`}
                        </button>
                        
                        {/* Expanded Store List */}
                        {editForm.showAllStores && (
                          <div className={`mt-3 p-3 rounded-xl ${theme === 'light' ? 'bg-[#f2ebe4] border border-[#e5dbd3]' : 'bg-black/30 border border-white/10'} max-h-60 overflow-y-auto`}>
                            {storeCategories.map((category) => (
                              <div key={category.id} className="mb-4 last:mb-0">
                                <h5 className={`text-xs font-semibold ${theme === 'light' ? 'text-[#7a6b60]' : 'text-gray-400'} uppercase tracking-wider mb-2`}>
                                  {category.name}
                                </h5>
                                <div className="flex flex-wrap gap-1.5">
                                  {storeDatabase[category.id].map((store) => (
                                    <button
                                      key={store.name}
                                      type="button"
                                      onClick={() => setEditForm(f => ({ 
                                        ...f, 
                                        link: store.baseUrl + encodeURIComponent(f.name || 'product'),
                                        store: store.name,
                                        showAllStores: false
                                      }))}
                                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium ${theme === 'light' ? 'bg-[#fdf0ea] border border-[#e5dbd3] text-[#7a6b60] hover:bg-[#f8e6dd] hover:text-[#2c2420]' : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'} transition-colors`}
                                    >
                                      {store.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Manual URL Input */}
                      <input
                        type="url"
                        value={editForm.link}
                        onChange={(e) => setEditForm(f => ({ ...f, link: e.target.value }))}
                        placeholder="https://www.store.com/product"
                        className={`w-full px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-[#fdf0ea] border border-[#c2725b]/30' : 'bg-teal-500/10 border border-teal-500/30'} ${theme === 'light' ? 'text-[#2c2420]' : 'text-white'} text-sm ${theme === 'light' ? 'focus:border-[#c2725b]' : 'focus:border-teal-500'} outline-none`}
                      />
                      {editForm.store && (
                        <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Linked to {editForm.store}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} block mb-1`}>Price ($)</label>
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                          className={`w-full px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-[#fffbf8] border border-[#e5dbd3] text-[#2c2420]' : 'bg-white/10 border border-white/20 text-white'} text-sm ${theme === 'light' ? 'focus:border-[#c2725b]' : 'focus:border-teal-500'} outline-none`}
                        />
                      </div>
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} block mb-1`}>Rating (0-5)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={editForm.rating}
                          onChange={(e) => setEditForm(f => ({ ...f, rating: parseFloat(e.target.value) || 0 }))}
                          className={`w-full px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-[#fffbf8] border border-[#e5dbd3] text-[#2c2420]' : 'bg-white/10 border border-white/20 text-white'} text-sm ${theme === 'light' ? 'focus:border-[#c2725b]' : 'focus:border-teal-500'} outline-none`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} block mb-1`}>Color</label>
                        <select
                          value={editForm.color}
                          onChange={(e) => setEditForm(f => ({ ...f, color: e.target.value }))}
                          className={`w-full px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-[#fffbf8] border border-[#e5dbd3] text-[#2c2420]' : 'bg-white/10 border border-white/20 text-white'} text-sm ${theme === 'light' ? 'focus:border-[#c2725b]' : 'focus:border-teal-500'} outline-none appearance-none`}
                        >
                          {colorOptions.filter(c => c !== 'All').map(color => (
                            <option key={color} value={color}>{color}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} block mb-1`}>Size</label>
                        <input
                          type="text"
                          value={editForm.size}
                          onChange={(e) => setEditForm(f => ({ ...f, size: e.target.value }))}
                          placeholder="e.g. 8x10, Custom"
                          className={`w-full px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-[#fffbf8] border border-[#e5dbd3] text-[#2c2420]' : 'bg-white/10 border border-white/20 text-white'} text-sm ${theme === 'light' ? 'focus:border-[#c2725b]' : 'focus:border-teal-500'} outline-none`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={cancelEdit}
                        className={`flex-1 py-2 rounded-lg ${theme === 'light' ? 'bg-[#f2ebe4] text-[#7a6b60]' : 'bg-white/10 text-gray-300'} text-sm font-medium hover:bg-white/20 transition-colors`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className={`flex-1 py-2 rounded-lg ${theme === 'light' ? 'bg-[#c2725b] hover:bg-[#a85a44]' : 'bg-teal-500 hover:bg-teal-600'} text-white text-sm font-medium transition-colors flex items-center justify-center gap-2`}
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="p-4 flex items-center gap-4">
                    <ProductImage product={product} size="md" />
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold ${theme === 'light' ? 'text-[#2c2420]' : 'text-white'} truncate`}>{product.name}</h4>
                      <p className={`text-sm ${theme === 'light' ? 'text-[#7a6b60]' : 'text-gray-400'}`}>{product.brand} • ${product.price}</p>
                      <p className={`text-xs ${theme === 'light' ? 'text-[#c2725b]/70' : 'text-teal-400/70'} truncate flex items-center gap-1 mt-1`}>
                        <Link className="w-3 h-3 shrink-0" />
                        {product.link}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(product)}
                        className={`w-9 h-9 rounded-lg ${theme === 'light' ? 'bg-[#f2ebe4]' : 'bg-white/10'} flex items-center justify-center ${theme === 'light' ? 'hover:bg-[#c2725b]/20' : 'hover:bg-teal-500/20'} transition-colors`}
                      >
                        <Edit3 className={`w-4 h-4 ${theme === 'light' ? 'text-[#2c2420]' : 'text-gray-300'}`} />
                      </button>
                      <button
                        onClick={() => deleteProduct(adminCategory, product.id)}
                        className={`w-9 h-9 rounded-lg ${theme === 'light' ? 'bg-[#f2ebe4]' : 'bg-white/10'} flex items-center justify-center hover:bg-red-500/20 transition-colors`}
                      >
                        <Trash2 className={`w-4 h-4 ${theme === 'light' ? 'text-[#2c2420]' : 'text-gray-300'}`} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {products[adminCategory]?.length === 0 && (
            <div className="text-center py-12">
              <Package className={`w-12 h-12 ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-600'} mx-auto mb-3`} />
              <p className={`${theme === 'light' ? 'text-[#7a6b60]' : 'text-gray-400'}`}>No products yet</p>
              <p className={`text-sm ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'}`}>Add your first product above</p>
            </div>
          )}

          {/* Store Directory Button */}
          <button
            onClick={() => setCurrentView('stores')}
            className={`w-full mt-4 p-3.5 rounded-lg border flex items-center justify-between transition-colors ${theme === 'light' ? 'bg-white border-stone-300 hover:border-teal-400' : 'bg-[#1a1a1e] border-zinc-600 hover:border-teal-600'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${theme === 'light' ? 'bg-[#c2725b]/20' : 'bg-purple-500/20'} flex items-center justify-center`}>
                <ShoppingBag className={`w-5 h-5 ${theme === 'light' ? 'text-[#c2725b]' : 'text-purple-400'}`} />
              </div>
              <div className="text-left">
                <h4 className={`font-semibold ${theme === 'light' ? 'text-[#2c2420]' : 'text-white'}`}>Store Directory</h4>
                <p className={`text-xs ${theme === 'light' ? 'text-[#7a6b60]' : 'text-gray-400'}`}>{allStores.length} stores available</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 ${theme === 'light' ? 'text-[#7a6b60]' : 'text-gray-400'}`} />
          </button>

          {/* Help Text */}
          <div className={`mt-6 p-4 rounded-xl ${theme === 'light' ? 'bg-[#fdf0ea] border border-[#e5dbd3]' : 'bg-purple-500/10 border border-purple-500/20'}`}>
            <h4 className={`font-semibold ${theme === 'light' ? 'text-[#c2725b]' : 'text-purple-300'} mb-2 flex items-center gap-2`}>
              <Link className="w-4 h-4" />
              How to add product links
            </h4>
            <ol className={`text-sm ${theme === 'light' ? 'text-[#7a6b60]' : 'text-gray-400'} space-y-2`}>
              <li>1. Click "Add New Product" and enter product details</li>
              <li>2. Use the <span className={`${theme === 'light' ? 'text-[#c2725b]' : 'text-teal-400'}`}>quick store picker</span> to auto-generate a search link</li>
              <li>3. Or paste a specific product URL directly</li>
              <li>4. Users will click through to purchase</li>
            </ol>
          </div>
        </div>
      </div>
    );
  };

  // Store Directory View
  const StoreDirectory = () => (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-200`} style={themeClasses.bgStyle}>
      <div className="px-6 py-8 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className={`w-11 h-11 rounded-xl ${theme === 'light' ? 'bg-[#fffbf8] border-[#e5dbd3]' : 'bg-white/5 border-white/10'} border flex items-center justify-center`}
          >
            <ChevronLeft className={`w-5 h-5 ${theme === 'light' ? 'text-[#2c2420]' : 'text-gray-300'}`} />
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold">Store Directory</h1>
          <div className="w-11" />
        </div>

        <p className={`${themeClasses.textSecondary} text-sm mb-6`}>
          Browse {allStores.length} partner stores. Tap any store to visit their website.
        </p>

        <div className="space-y-6">
          {storeCategories.map((category) => (
            <div key={category.id}>
              <h3 className={`text-xs font-medium ${themeClasses.textMuted} uppercase tracking-wider mb-3`}>
                {category.name}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {storeDatabase[category.id].map((store) => (
                  <a
                    key={store.name}
                    href={store.baseUrl.replace(/[?&].*$/, '').replace(/\/s\/?$/, '').replace(/\/search$/, '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg flex items-center gap-3 ${themeClasses.card} ${themeClasses.cardHover} transition-colors`}
                  >
                    <StoreLogo storeName={store.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <span className={`font-medium ${themeClasses.text} text-sm block truncate`}>{store.name}</span>
                    </div>
                    <ExternalLink className={`w-4 h-4 ${themeClasses.textMuted}`} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Affiliate Note */}
        <div className={`mt-8 p-4 rounded-lg ${themeClasses.card}`}>
          <h4 className={`font-medium ${themeClasses.text} mb-1 text-sm`}>Pro Tip</h4>
          <p className={`text-sm ${themeClasses.textSecondary}`}>
            If you have affiliate accounts with these stores, replace the base URLs with your affiliate links in the product settings to earn commissions on sales.
          </p>
        </div>
      </div>
    </div>
  );

  // Camera View
  const CameraView = () => (
    <div className="fixed inset-0 bg-black">
      <div className="absolute inset-0">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        {!cameraStream && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900" />
        )}
      </div>

      {/* Detection zones — conditional on camera stream + Smart Scan */}
      {smartScanActive && aiZones.length > 0 ? (
        /* AI-detected zones (Smart Scan active) */
        <div className="absolute inset-0">
          {aiZones.map((zone) => (
            <div
              key={zone.id}
              className="absolute cursor-pointer transition-all duration-300 rounded-xl bg-purple-500/15 border border-purple-400/50 hover:bg-purple-500/25"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
              }}
              onClick={() => handleZoneClick(zone)}
            >
              <div className="absolute -top-7 left-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/80 text-white backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {zone.label}
              </div>
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-400 rounded-tl" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-400 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-400 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-400 rounded-br" />
            </div>
          ))}
          {/* Scanning indicator */}
          {aiIsScanning && (
            <div className="absolute top-20 left-0 right-0 flex justify-center pointer-events-none">
              <div className="bg-purple-500/20 backdrop-blur-md rounded-full px-4 py-1.5 border border-purple-500/30 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-purple-300 text-xs font-medium">Scanning...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Room scanner zones — shown on both live camera and mock room */
        <div className="absolute inset-0">
          {detectionZones.map((zone) => (
            <div
              key={zone.id}
              className={`absolute cursor-pointer transition-all duration-300 rounded-xl ${
                hoveredArea?.id === zone.id
                  ? 'bg-teal-500/30 border-2 border-teal-400'
                  : 'bg-white/10 border border-white/30 hover:bg-white/20'
              }`}
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
              }}
              onMouseEnter={() => handleZoneHover(zone)}
              onMouseLeave={() => handleZoneHover(null)}
              onClick={() => handleZoneClick(zone)}
            >
              <div className={`absolute -top-8 left-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md transition-all duration-300 ${
                hoveredArea?.id === zone.id ? 'bg-teal-500 text-white' : 'bg-black/50 text-white/80'
              }`}>
                {zone.label}
              </div>

              {hoveredArea?.id === zone.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/80 backdrop-blur-md rounded-2xl p-5 text-white text-center shadow-2xl border border-teal-500/30">
                    <Ruler className="w-6 h-6 mx-auto mb-2 text-teal-400" />
                    <div className="text-lg font-bold mb-1">Tap to Measure</div>
                    <div className="text-xs text-gray-400 mb-4">Enter dimensions or use reference object</div>

                    <div className="bg-teal-500 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-center gap-2 text-white font-semibold">
                        <Search className="w-4 h-4" />
                        <span>Find {categories.find(c => c.id === zone.category)?.name}</span>
                      </div>
                      <div className="text-teal-100 text-xs mt-1">
                        {allStores.length} stores with size-matched results
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-400 rounded-tl" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-teal-400 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-teal-400 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-400 rounded-br" />
            </div>
          ))}
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <button onClick={stopCamera} className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-3">
          {/* Color Match Toggle */}
          <button
            onClick={() => setColorMatchEnabled(!colorMatchEnabled)}
            className={`px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 border text-sm transition-all ${
              colorMatchEnabled
                ? 'bg-pink-500/30 border-pink-500/50 text-pink-300'
                : 'bg-white/10 border-white/20 text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            Color
          </button>
          {/* Smart Scan Toggle */}
          {cameraStream && (
            <button
              onClick={async () => {
                if (smartScanActive) {
                  stopContinuousScanning();
                  setSmartScanActive(false);
                  resetZones();
                } else {
                  setSmartScanActive(true);
                  if (modelStatus !== 'ready') {
                    await initAIModel();
                  }
                  if (videoRef.current) {
                    startContinuousScanning(videoRef.current);
                  }
                }
              }}
              className={`px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 border text-sm transition-all ${
                smartScanActive
                  ? 'bg-purple-500/30 border-purple-500/50 text-purple-300'
                  : 'bg-white/10 border-white/20 text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              {modelStatus === 'loading' ? 'Loading AI...' : 'Smart Scan'}
            </button>
          )}
          <button
            onClick={() => setCurrentView('filters')}
            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md flex items-center gap-2 border border-white/20 text-white text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => startARMeasure(null)}
            className="px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 border text-sm bg-teal-500/30 border-teal-500/50 text-teal-300"
          >
            <Ruler className="w-4 h-4" />
            Measure
          </button>
        </div>
      </div>

      {/* Color Matching UI */}
      {colorMatchEnabled && cameraStream && (
        <>
          {/* Center Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 border-2 border-pink-400 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border border-pink-300/50" />
            </div>
          </div>

          {/* Color Sample Panel */}
          <div className="absolute bottom-24 left-0 right-0 flex justify-center">
            <div className="bg-black/80 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              {sampledColor ? (
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-white/30"
                    style={{ backgroundColor: sampledColor.hex }}
                  />
                  <div>
                    <p className="text-white font-medium">{sampledColor.name}</p>
                    <p className="text-xs text-gray-400">{sampledColor.hex}</p>
                  </div>
                  <button
                    onClick={addCustomColor}
                    className="px-3 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition-colors"
                  >
                    Add Filter
                  </button>
                  <button
                    onClick={() => setSampledColor(null)}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={sampleColor}
                  className="px-6 py-3 rounded-xl bg-pink-500 text-white font-medium flex items-center gap-2 hover:bg-pink-600 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  Sample Color
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{colorMatchEnabled ? 'Point at a color and tap Sample' : smartScanActive && aiZones.length > 0 ? `${aiZones.length} zone${aiZones.length !== 1 ? 's' : ''} detected — tap to measure & shop` : 'Tap highlighted areas to measure & shop'}</span>
        </div>
      </div>

      {/* Card Calibration Overlay */}
      {showCardCalibration && (
        <CardCalibrationOverlay
          videoRef={videoRef}
          onCalibrated={(cal) => {
            setReferenceCalibration(cal);
            setShowCardCalibration(false);
          }}
          onCancel={() => setShowCardCalibration(false)}
        />
      )}

      {/* Tap-to-Measure Overlay */}
      {showTapMeasure && referenceCalibration && (
        <TapToMeasureOverlay
          pixelsPerInch={referenceCalibration.pixelsPerInch}
          targetLabel={tapMeasureTarget === 'width' ? 'Width' : 'Height'}
          onMeasured={({ inches }) => {
            if (tapMeasureTarget === 'width') {
              setManualDimensions(d => ({ ...d, width: String(inches) }));
            } else {
              setManualDimensions(d => ({ ...d, height: String(inches) }));
            }
            setShowTapMeasure(false);
          }}
          onCancel={() => setShowTapMeasure(false)}
        />
      )}

      {/* Measurement Input Popup */}
      {showMeasurePopup && detectedArea && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div 
            className="w-full max-w-md bg-[#242320] rounded-lg border border-[#3d3a34] overflow-hidden"
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 flex items-center justify-center mx-auto mb-3">
                <Ruler className="w-8 h-8 text-teal-400" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold text-white">
                Measure Your {detectedArea.label}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Enter dimensions for size-matched results
              </p>
            </div>

            {/* Measurement Options */}
            <div className="p-5">
              {/* Saved Rooms Dropdown */}
              {savedRooms.length > 0 && (
                <div className="mb-5">
                  <label className="text-xs text-gray-400 block mb-2">Load from saved room</label>
                  <select
                    onChange={(e) => {
                      const room = savedRooms.find(r => r.id === parseInt(e.target.value));
                      if (room) {
                        loadRoom(room);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-teal-500 outline-none appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a saved room...</option>
                    {savedRooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} ({room.width}×{room.height} {room.unit})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tab Buttons */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setMeasureMode('manual')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    measureMode === 'manual'
                      ? 'bg-teal-500 text-white'
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  ✏️ Manual
                </button>
                <button
                  onClick={() => { setMeasureMode('reference'); setReferenceStep(0); }}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    measureMode === 'reference'
                      ? 'bg-teal-500 text-white'
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  💳 Reference
                </button>
                <button
                  onClick={() => setMeasureMode('ar')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    measureMode === 'ar'
                      ? 'bg-teal-500 text-white'
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  📱 AR Scan
                </button>
              </div>

              {/* Manual Input */}
              {measureMode === 'manual' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-2">
                        Width {selectedCategory === 'rugs' ? '(feet)' : '(inches)'}
                      </label>
                      <input
                        type="number"
                        value={manualDimensions.width}
                        onChange={(e) => setManualDimensions(d => ({ ...d, width: e.target.value }))}
                        placeholder={selectedCategory === 'rugs' ? 'e.g. 8' : 'e.g. 36'}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg text-center focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-2">
                        {selectedCategory === 'rugs' || selectedCategory === 'furniture' ? 'Length' : 'Height'} {selectedCategory === 'rugs' ? '(feet)' : '(inches)'}
                      </label>
                      <input
                        type="number"
                        value={manualDimensions.height}
                        onChange={(e) => setManualDimensions(d => ({ ...d, height: e.target.value }))}
                        placeholder={selectedCategory === 'rugs' ? 'e.g. 10' : 'e.g. 72'}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg text-center focus:border-teal-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  {/* Common Sizes Quick Select */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Quick select common sizes:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory === 'blinds' && (
                        <>
                          {['23×36', '27×64', '31×64', '35×64', '36×72', '48×72'].map(size => (
                            <button
                              key={size}
                              onClick={() => {
                                const [w, h] = size.split('×');
                                setManualDimensions({ width: w, height: h });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all"
                            >
                              {size}"
                            </button>
                          ))}
                        </>
                      )}
                      {selectedCategory === 'rugs' && (
                        <>
                          {['3×5', '4×6', '5×7', '5×8', '6×9', '8×10', '9×12'].map(size => (
                            <button
                              key={size}
                              onClick={() => {
                                const [w, h] = size.split('×');
                                setManualDimensions({ width: w, height: h });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all"
                            >
                              {size} ft
                            </button>
                          ))}
                        </>
                      )}
                      {selectedCategory === 'furniture' && (
                        <>
                          {['36×30', '48×30', '60×36', '72×36', '84×40'].map(size => (
                            <button
                              key={size}
                              onClick={() => {
                                const [w, h] = size.split('×');
                                setManualDimensions({ width: w, height: h });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all"
                            >
                              {size}"
                            </button>
                          ))}
                        </>
                      )}
                      {selectedCategory === 'lighting' && (
                        <>
                          {['12', '18', '24', '30', '36', '48'].map(size => (
                            <button
                              key={size}
                              onClick={() => {
                                setManualDimensions({ width: size, height: size });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all"
                            >
                              {size}" dia
                            </button>
                          ))}
                        </>
                      )}
                      {selectedCategory === 'flooring' && (
                        <>
                          {['10×10', '12×12', '15×15', '20×20', '25×25'].map(size => (
                            <button
                              key={size}
                              onClick={() => {
                                const [w, h] = size.split('×');
                                setManualDimensions({ width: w, height: h });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all"
                            >
                              {size} sq ft
                            </button>
                          ))}
                        </>
                      )}
                      {selectedCategory === 'countertops' && (
                        <>
                          {['25×2', '30×2', '36×2', '48×2', '60×2', '72×2'].map(size => (
                            <button
                              key={size}
                              onClick={() => {
                                const [w, h] = size.split('×');
                                setManualDimensions({ width: w, height: h });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all"
                            >
                              {size.split('×')[0]}" × 2ft
                            </button>
                          ))}
                        </>
                      )}
                      {selectedCategory === 'cabinets' && (
                        <>
                          {['12×30', '15×30', '18×30', '24×30', '30×30', '36×30'].map(size => (
                            <button
                              key={size}
                              onClick={() => {
                                const [w, h] = size.split('×');
                                setManualDimensions({ width: w, height: h });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all"
                            >
                              {size}"
                            </button>
                          ))}
                        </>
                      )}
                      {selectedCategory === 'doors' && (
                        <>
                          {['24×80', '28×80', '30×80', '32×80', '36×80', '36×96'].map(size => (
                            <button
                              key={size}
                              onClick={() => {
                                const [w, h] = size.split('×');
                                setManualDimensions({ width: w, height: h });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all"
                            >
                              {size}"
                            </button>
                          ))}
                        </>
                      )}
                      {(selectedCategory === 'paint' || selectedCategory === 'plumbing' || selectedCategory === 'appliances' || selectedCategory === 'outdoor') && (
                        <p className="text-xs text-gray-500 italic">No standard sizes - enter dimensions above</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* AR Scan Method */}
              {measureMode === 'ar' && (
                <div className="space-y-4">
                  <div className="text-center">
                    {!referenceCalibration ? (
                      <>
                        <div className="bg-white/5 rounded-2xl p-6 mb-4">
                          <div className="text-4xl mb-3">📏</div>
                          <p className="text-white font-medium mb-2">Camera Measurement</p>
                          <p className="text-sm text-gray-400">
                            Calibrate with a credit card, then tap two points on the camera feed to measure.
                          </p>
                        </div>
                        {cameraStream ? (
                          <button
                            onClick={() => setShowCardCalibration(true)}
                            className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold"
                          >
                            Start Calibration
                          </button>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Open the camera first to use this measurement mode.
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
                          <p className="text-green-400 font-medium text-sm">Calibrated ({Math.round(referenceCalibration.pixelsPerInch)} px/in)</p>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Tap two points on the camera feed to measure each dimension</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setTapMeasureTarget('width'); setShowTapMeasure(true); }}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                              manualDimensions.width ? 'bg-white/10 text-green-400 border border-green-500/30' : 'bg-teal-500 text-white'
                            }`}
                          >
                            {manualDimensions.width ? `Width: ${manualDimensions.width}"` : 'Measure Width'}
                          </button>
                          <button
                            onClick={() => { setTapMeasureTarget('height'); setShowTapMeasure(true); }}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                              manualDimensions.height ? 'bg-white/10 text-green-400 border border-green-500/30' : 'bg-teal-500 text-white'
                            }`}
                          >
                            {manualDimensions.height ? `Height: ${manualDimensions.height}"` : 'Measure Height'}
                          </button>
                        </div>
                        <button
                          onClick={() => setReferenceCalibration(null)}
                          className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          Re-calibrate
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Reference Object Method — Visual Card Calibration + Tap-to-Measure */}
              {measureMode === 'reference' && (
                <div className="space-y-4">
                  {!referenceCalibration ? (
                    <div className="text-center">
                      <div className="bg-white/5 rounded-2xl p-6 mb-4">
                        <div className="text-4xl mb-3">💳</div>
                        <p className="text-white font-medium mb-2">Credit Card Calibration</p>
                        <p className="text-sm text-gray-400">
                          Place a credit card next to the area to measure, then align the on-screen outline to match it.
                        </p>
                      </div>
                      {cameraStream ? (
                        <button
                          onClick={() => setShowCardCalibration(true)}
                          className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold"
                        >
                          Start Calibration
                        </button>
                      ) : (
                        <>
                          <p className="text-xs text-gray-500 mb-3">
                            Camera not active — using manual card-count method instead
                          </p>
                          <button
                            onClick={() => setReferenceStep(1)}
                            className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold"
                          >
                            Use Card-Count Method
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
                        <p className="text-green-400 font-medium text-sm">Calibrated ({Math.round(referenceCalibration.pixelsPerInch)} px/in)</p>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">Tap two points on the camera feed to measure each dimension</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setTapMeasureTarget('width'); setShowTapMeasure(true); }}
                          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                            manualDimensions.width ? 'bg-white/10 text-green-400 border border-green-500/30' : 'bg-teal-500 text-white'
                          }`}
                        >
                          {manualDimensions.width ? `Width: ${manualDimensions.width}"` : 'Tap Width'}
                        </button>
                        <button
                          onClick={() => { setTapMeasureTarget('height'); setShowTapMeasure(true); }}
                          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                            manualDimensions.height ? 'bg-white/10 text-green-400 border border-green-500/30' : 'bg-teal-500 text-white'
                          }`}
                        >
                          {manualDimensions.height ? `Height: ${manualDimensions.height}"` : 'Tap Height'}
                        </button>
                      </div>
                      <button
                        onClick={() => setReferenceCalibration(null)}
                        className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        Re-calibrate
                      </button>
                    </div>
                  )}
                  {/* Fallback card-count steps when camera not active */}
                  {!cameraStream && referenceStep === 1 && (
                    <div className="text-center">
                      <div className="bg-white/5 rounded-2xl p-6 mb-4">
                        <div className="text-4xl mb-3">📏</div>
                        <p className="text-white font-medium mb-2">How many card-widths across?</p>
                        <p className="text-sm text-gray-400">
                          Estimate how many credit cards would fit across the width
                        </p>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[5, 8, 10, 12, 15, 18, 20, 24].map(num => (
                          <button
                            key={num}
                            onClick={() => {
                              const widthInches = Math.round(num * 3.37);
                              setManualDimensions(d => ({ ...d, width: widthInches.toString() }));
                              setReferenceStep(2);
                            }}
                            className="py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-teal-500/20 hover:border-teal-500/50 transition-all"
                          >
                            {num}x
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {!cameraStream && referenceStep === 2 && (
                    <div className="text-center">
                      <div className="bg-white/5 rounded-2xl p-6 mb-4">
                        <div className="text-4xl mb-3">📐</div>
                        <p className="text-white font-medium mb-2">How many card-heights tall?</p>
                        <p className="text-sm text-gray-400">
                          Estimate how many credit cards would fit vertically
                        </p>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[10, 15, 20, 25, 30, 35, 40, 45].map(num => (
                          <button
                            key={num}
                            onClick={() => {
                              const heightInches = Math.round(num * 2.13);
                              setManualDimensions(d => ({ ...d, height: heightInches.toString() }));
                            }}
                            className="py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-teal-500/20 hover:border-teal-500/50 transition-all"
                          >
                            {num}x
                          </button>
                        ))}
                      </div>
                      {manualDimensions.height && (
                        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mt-4">
                          <p className="text-green-400 font-medium">
                            Estimated: {manualDimensions.width}" x {manualDimensions.height}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-5 border-t border-white/10 space-y-3">
              {(manualDimensions.width && manualDimensions.height) ? (
                <button
                  onClick={confirmMeasurements}
                  className="w-full py-3.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors"
                >
                  <Search className="w-5 h-5" />
                  Search {manualDimensions.width}{selectedCategory === 'rugs' ? '×' + manualDimensions.height + ' ft' : '"×' + manualDimensions.height + '"'} {categories.find(c => c.id === selectedCategory)?.name}
                </button>
              ) : (
                <button
                  onClick={confirmMeasurements}
                  disabled
                  className="w-full py-4 rounded-xl bg-white/10 text-gray-500 font-semibold text-lg cursor-not-allowed"
                >
                  Enter dimensions above
                </button>
              )}
              {/* Save Room Button */}
              {manualDimensions.width && manualDimensions.height && (
                <div className="flex gap-2">
                  {showSaveRoomModal ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Room name..."
                        className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:border-teal-500 outline-none"
                        autoFocus
                      />
                      <button
                        onClick={saveRoom}
                        disabled={!roomName.trim()}
                        className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setShowSaveRoomModal(false); setRoomName(''); }}
                        className="px-3 py-2 rounded-xl bg-white/10 text-gray-400 text-sm hover:bg-white/20 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowSaveRoomModal(true)}
                      className="flex-1 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <FolderHeart className="w-4 h-4" />
                      Save Room
                    </button>
                  )}
                </div>
              )}
              <button
                onClick={skipMeasurements}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm hover:bg-white/10 transition-all"
              >
                Skip — search all sizes
              </button>
              <button
                onClick={() => { setShowMeasurePopup(false); setDetectedArea(null); setShowSaveRoomModal(false); setRoomName(''); }}
                className="w-full py-2 text-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showProductPopup && detectedArea && (
        <div className="absolute inset-0 bg-black/80 flex items-end justify-center z-50">
          <div 
            className="w-full max-w-lg bg-[#242320] rounded-t-lg border border-[#3d3a34] max-h-[85vh] overflow-hidden"
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            <div className="sticky top-0 bg-[#242320] p-5 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-teal-400 uppercase tracking-wider mb-1">
                    {measurements ? '📏 Size-Matched Results' : 'Best Matches For You'}
                  </p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold text-white">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {measurements ? (
                      <>
                        <span className="text-green-400 font-medium">
                          {measurements.width}{measurements.unit === 'ft' ? "'" : '"'} × {measurements.height}{measurements.unit === 'ft' ? "'" : '"'}
                        </span>
                        {' • '}
                      </>
                    ) : null}
                    Budget: ${filters.priceRange[0]}-${filters.priceRange[1]}
                  </p>
                </div>
                <button 
                  onClick={() => { setShowProductPopup(false); setDetectedArea(null); setMeasurements(null); }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              {measurements && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                    <Ruler className="w-3 h-3" />
                    Showing {measurements.width}×{measurements.height} {measurements.unit === 'ft' ? 'ft' : 'inch'} options
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 overflow-y-auto max-h-[65vh]">
              {/* Your Saved Products */}
              {getFilteredProducts().length > 0 && (
                <div className="mb-6 pb-4 border-b border-white/10">
                  <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    Your saved products ({getFilteredProducts().length})
                  </p>
                  <div className="space-y-2">
                    {getFilteredProducts().slice(0, 3).map((product) => (
                      <a
                        key={product.id}
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                      >
                        <ProductImage product={product} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand} • ${product.price}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Top 3 Stores for this Category */}
              <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" />
                Top stores for {categories.find(c => c.id === selectedCategory)?.name}
              </p>

              {(() => {
                // Get the first filtered product to use for specific search links
                const filteredProducts = products[selectedCategory]?.filter(product => {
                  const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
                  const colorMatch = filters.color === 'All' || product.color === filters.color;
                  const ratingMatch = product.rating >= filters.minRating;
                  return priceMatch && colorMatch && ratingMatch;
                }) || [];
                const firstProduct = filteredProducts[0];
                const searchTerm = firstProduct?.name || categories.find(c => c.id === selectedCategory)?.name || selectedCategory;

                // Helper to build product-specific search URLs
                const buildSearchUrl = (store, baseUrl) => {
                  const sizeStr = measurements ? `${measurements.width}x${measurements.height}` : '';
                  const query = sizeStr ? `${searchTerm} ${sizeStr}` : searchTerm;

                  // Store-specific URL patterns
                  const storeUrls = {
                    // Big Box Retailers
                    'Walmart': `https://www.walmart.com/search?q=${encodeURIComponent(query)}`,
                    'Target': `https://www.target.com/s?searchTerm=${encodeURIComponent(query)}`,
                    'Amazon': `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
                    'Costco': `https://www.costco.com/CatalogSearch?keyword=${encodeURIComponent(query)}`,
                    // Home Improvement
                    'Home Depot': `https://www.homedepot.com/s/${encodeURIComponent(query)}`,
                    "Lowe's": `https://www.lowes.com/search?searchTerm=${encodeURIComponent(query)}`,
                    'Menards': `https://www.menards.com/main/search.html?search=${encodeURIComponent(query)}`,
                    'Ace Hardware': `https://www.acehardware.com/search?query=${encodeURIComponent(query)}`,
                    // Furniture Stores
                    'IKEA': `https://www.ikea.com/us/en/search/?q=${encodeURIComponent(query)}`,
                    'Wayfair': `https://www.wayfair.com/keyword.html?keyword=${encodeURIComponent(query)}`,
                    'Ashley': `https://www.ashleyfurniture.com/search/?q=${encodeURIComponent(query)}`,
                    'Rooms To Go': `https://www.roomstogo.com/search?query=${encodeURIComponent(query)}`,
                    'Article': `https://www.article.com/search?q=${encodeURIComponent(query)}`,
                    'Joybird': `https://joybird.com/search/?q=${encodeURIComponent(query)}`,
                    'Burrow': `https://burrow.com/search?q=${encodeURIComponent(query)}`,
                    // Designer/High-End
                    'West Elm': `https://www.westelm.com/search/results.html?words=${encodeURIComponent(query)}`,
                    'Pottery Barn': `https://www.potterybarn.com/search/results.html?words=${encodeURIComponent(query)}`,
                    'Crate & Barrel': `https://www.crateandbarrel.com/search?query=${encodeURIComponent(query)}`,
                    'CB2': `https://www.cb2.com/search?query=${encodeURIComponent(query)}`,
                    'Restoration Hardware': `https://rh.com/search/results.jsp?Ntt=${encodeURIComponent(query)}`,
                    'Arhaus': `https://www.arhaus.com/search?q=${encodeURIComponent(query)}`,
                    'Ethan Allen': `https://www.ethanallen.com/en_US/search?q=${encodeURIComponent(query)}`,
                    // Rugs & Carpets
                    'Ruggable': `https://ruggable.com/search?q=${encodeURIComponent(query)}`,
                    'Rugs USA': `https://www.rugsusa.com/rugsusa/control/search?q=${encodeURIComponent(query)}`,
                    'Boutique Rugs': `https://www.boutiquerugs.com/search?q=${encodeURIComponent(query)}`,
                    'Loloi': `https://www.loloirugs.com/search?q=${encodeURIComponent(query)}`,
                    'Safavieh': `https://www.safavieh.com/catalogsearch/result/?q=${encodeURIComponent(query)}`,
                    // Blinds & Shades
                    'Blinds.com': `https://www.blinds.com/search?q=${encodeURIComponent(query)}`,
                    'SelectBlinds': `https://www.selectblinds.com/search?q=${encodeURIComponent(query)}`,
                    'Budget Blinds': `https://budgetblinds.com/search?q=${encodeURIComponent(query)}`,
                    'The Shade Store': `https://www.theshadestore.com/search?q=${encodeURIComponent(query)}`,
                    'Levolor': `https://www.levolor.com/search?q=${encodeURIComponent(query)}`,
                    // Lighting
                    'Lumens': `https://www.lumens.com/search/?q=${encodeURIComponent(query)}`,
                    'Lamps Plus': `https://www.lampsplus.com/sfind/${encodeURIComponent(query)}`,
                    '1800Lighting': `https://www.1800lighting.com/search/?q=${encodeURIComponent(query)}`,
                    'YLighting': `https://www.ylighting.com/search/?q=${encodeURIComponent(query)}`,
                    'Build.com': `https://www.build.com/search?term=${encodeURIComponent(query)}`,
                    // Budget/Discount
                    'Overstock': `https://www.overstock.com/search?keywords=${encodeURIComponent(query)}`,
                    'At Home': `https://www.athome.com/search/?q=${encodeURIComponent(query)}`,
                    'Big Lots': `https://www.biglots.com/search?q=${encodeURIComponent(query)}`,
                    'HomeGoods': `https://www.homegoods.com/search?q=${encodeURIComponent(query)}`,
                    'World Market': `https://www.worldmarket.com/search?q=${encodeURIComponent(query)}`,
                    // Online/DTC
                    'AllModern': `https://www.allmodern.com/keyword.html?keyword=${encodeURIComponent(query)}`,
                    'Houzz': `https://www.houzz.com/products/query/${encodeURIComponent(query)}`,
                    'Chairish': `https://www.chairish.com/search?q=${encodeURIComponent(query)}`,
                    '1stDibs': `https://www.1stdibs.com/search/?q=${encodeURIComponent(query)}`,
                    'Best Buy': `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(query)}`,
                  };
                  return storeUrls[store] || baseUrl;
                };

                // Category-specific top stores (same as ResultsView)
                const categoryStores = {
                  blinds: [
                    { name: 'Blinds.com', logo: '🪟', color: '#1E88E5', tagline: '#1 online blinds store' },
                    { name: 'SelectBlinds', logo: '🪟', color: '#43A047', tagline: 'Quality blinds for less' },
                    { name: 'The Shade Store', logo: '🎨', color: '#5D4037', tagline: 'Custom luxury window treatments' },
                  ],
                  rugs: [
                    { name: 'Ruggable', logo: '🧹', color: '#FF6B6B', tagline: 'Machine washable rugs' },
                    { name: 'Rugs USA', logo: '🏷️', color: '#3949AB', tagline: 'Affordable trendy rugs' },
                    { name: 'Boutique Rugs', logo: '✨', color: '#7E57C2', tagline: 'Designer rugs at great prices' },
                  ],
                  furniture: [
                    { name: 'IKEA', logo: '🟡', color: '#0058A3', tagline: 'Scandinavian design for less' },
                    { name: 'Wayfair', logo: '💜', color: '#7B68AE', tagline: 'A zillion things home' },
                    { name: 'Article', logo: '🪑', color: '#263238', tagline: 'Modern furniture direct' },
                  ],
                  lighting: [
                    { name: 'Lumens', logo: '💡', color: '#FFC107', tagline: 'Modern lighting experts' },
                    { name: 'Lamps Plus', logo: '🔦', color: '#FF9800', tagline: 'Largest lighting retailer' },
                    { name: 'YLighting', logo: '💫', color: '#FFB300', tagline: 'Designer lighting' },
                  ],
                  flooring: [
                    { name: 'Home Depot', logo: '🧡', color: '#F96302', tagline: '#1 home improvement' },
                    { name: "Lowe's", logo: '🔷', color: '#004990', tagline: 'Home improvement done right' },
                    { name: 'Build.com', logo: '🔧', color: '#607D8B', tagline: 'Home improvement specialists' },
                  ],
                  paint: [
                    { name: 'Home Depot', logo: '🧡', color: '#F96302', tagline: '#1 home improvement' },
                    { name: "Lowe's", logo: '🔷', color: '#004990', tagline: 'Home improvement done right' },
                    { name: 'Menards', logo: '🟢', color: '#2E7D32', tagline: 'Save big money' },
                  ],
                  countertops: [
                    { name: 'Home Depot', logo: '🧡', color: '#F96302', tagline: '#1 home improvement' },
                    { name: "Lowe's", logo: '🔷', color: '#004990', tagline: 'Home improvement done right' },
                    { name: 'IKEA', logo: '🟡', color: '#0058A3', tagline: 'Scandinavian design for less' },
                  ],
                  cabinets: [
                    { name: 'Home Depot', logo: '🧡', color: '#F96302', tagline: '#1 home improvement' },
                    { name: "Lowe's", logo: '🔷', color: '#004990', tagline: 'Home improvement done right' },
                    { name: 'IKEA', logo: '🟡', color: '#0058A3', tagline: 'Scandinavian design for less' },
                  ],
                  plumbing: [
                    { name: 'Home Depot', logo: '🧡', color: '#F96302', tagline: '#1 home improvement' },
                    { name: "Lowe's", logo: '🔷', color: '#004990', tagline: 'Home improvement done right' },
                    { name: 'Build.com', logo: '🔧', color: '#607D8B', tagline: 'Home improvement specialists' },
                  ],
                  appliances: [
                    { name: 'Home Depot', logo: '🧡', color: '#F96302', tagline: '#1 home improvement' },
                    { name: "Lowe's", logo: '🔷', color: '#004990', tagline: 'Home improvement done right' },
                    { name: 'Costco', logo: '🏪', color: '#E31837', tagline: 'Premium quality, member prices' },
                  ],
                  doors: [
                    { name: 'Home Depot', logo: '🧡', color: '#F96302', tagline: '#1 home improvement' },
                    { name: "Lowe's", logo: '🔷', color: '#004990', tagline: 'Home improvement done right' },
                    { name: 'Menards', logo: '🟢', color: '#2E7D32', tagline: 'Save big money' },
                  ],
                  outdoor: [
                    { name: 'Home Depot', logo: '🧡', color: '#F96302', tagline: '#1 home improvement' },
                    { name: 'Wayfair', logo: '💜', color: '#7B68AE', tagline: 'A zillion things home' },
                    { name: 'At Home', logo: '🏡', color: '#8BC34A', tagline: 'Home decor superstore' },
                  ],
                };

                const topStores = categoryStores[selectedCategory] || [];

                return (
                  <div className="space-y-2">
                    {topStores.map((store, index) => (
                      <a
                        key={store.name}
                        href={buildSearchUrl(store.name, '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group block p-4 rounded-xl border transition-all duration-200 ${themeClasses.card} ${themeClasses.cardHover}`}
                      >
                        <div className="flex items-center gap-4">
                          <StoreLogo storeName={store.name} size="lg" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {index === 0 && (
                                <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded font-semibold">
                                  Top Pick
                                </span>
                              )}
                              <h4 className={`font-semibold ${themeClasses.text}`}>{store.name}</h4>
                            </div>
                            <p className={`text-sm ${themeClasses.textSecondary}`}>{store.tagline}</p>
                          </div>
                          <div className="text-right">
                            <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${themeClasses.button} flex items-center gap-1.5`}>
                              Shop
                              <ExternalLink className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                );
              })()}

              {/* View All Stores */}
              <button
                onClick={() => { setShowProductPopup(false); setCurrentView('stores'); }}
                className="w-full mt-4 py-3 rounded-xl border border-white/20 text-gray-300 text-sm font-medium hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                Browse all {allStores.length} stores
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  // Filters View
  const FiltersView = () => (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-200`} style={themeClasses.bgStyle}>
      <div className="px-6 py-8 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setCurrentView(cameraActive ? 'camera' : 'home')}
            className={`w-11 h-11 rounded-xl ${theme === 'light' ? 'bg-[#fffbf8] border-[#e5dbd3]' : 'bg-white/5 border-white/10'} border flex items-center justify-center`}
          >
            <X className={`w-5 h-5 ${theme === 'light' ? 'text-[#2c2420]' : 'text-gray-300'}`} />
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold">Filters</h1>
          <button 
            onClick={() => setFilters({ priceRange: [0, 2000], color: 'All', minRating: 0, brand: 'All', size: 'All', features: [], sortBy: 'relevance' })}
            className={`${theme === 'light' ? 'text-[#c2725b]' : 'text-teal-400'} text-sm font-medium`}
          >
            Reset
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-[#c2725b]/15' : 'bg-green-500/20'} flex items-center justify-center`}>
              <DollarSign className={`w-5 h-5 ${theme === 'light' ? 'text-[#c2725b]' : 'text-green-400'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${theme === 'light' ? 'text-[#2c2420]' : 'text-white'}`}>Price Range</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-[#7a6b60]' : 'text-gray-400'}`}>${filters.priceRange[0]} - ${filters.priceRange[1]}</p>
            </div>
          </div>
          
          <div className="space-y-4 px-2">
            <div>
              <label className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} uppercase tracking-wider`}>Minimum</label>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters(f => ({ ...f, priceRange: [parseInt(e.target.value), f.priceRange[1]] }))}
                className={`w-full h-2 ${theme === 'light' ? 'bg-[#e5dbd3]' : 'bg-white/10'} rounded-full appearance-none cursor-pointer ${theme === 'light' ? 'accent-[#c2725b]' : 'accent-teal-500'}`}
              />
            </div>
            <div>
              <label className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} uppercase tracking-wider`}>Maximum</label>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(f => ({ ...f, priceRange: [f.priceRange[0], parseInt(e.target.value)] }))}
                className={`w-full h-2 ${theme === 'light' ? 'bg-[#e5dbd3]' : 'bg-white/10'} rounded-full appearance-none cursor-pointer ${theme === 'light' ? 'accent-[#c2725b]' : 'accent-teal-500'}`}
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-[#c2725b]/15' : 'bg-purple-500/20'} flex items-center justify-center`}>
              <Palette className={`w-5 h-5 ${theme === 'light' ? 'text-[#c2725b]' : 'text-purple-400'}`} />
            </div>
            <h3 className={`font-semibold ${theme === 'light' ? 'text-[#2c2420]' : 'text-white'}`}>Color</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => setFilters(f => ({ ...f, color }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filters.color === color
                    ? `${theme === 'light' ? 'bg-[#c2725b] text-white' : 'bg-teal-500 text-white'}`
                    : `${theme === 'light' ? 'bg-[#fffbf8] text-[#7a6b60] border border-[#e5dbd3] hover:bg-[#fdf0ea]' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`
                }`}
              >
                {color}
              </button>
            ))}
          </div>

          {/* Custom Colors from Camera */}
          {customColors.length > 0 && (
            <div className={`mt-4 pt-4 border-t ${theme === 'light' ? 'border-[#e5dbd3]' : 'border-white/10'}`}>
              <p className={`text-xs ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'} uppercase tracking-wider mb-3`}>Custom Colors (from camera)</p>
              <div className="flex flex-wrap gap-2">
                {customColors.map((customColor) => (
                  <div key={customColor.id} className="flex items-center gap-1">
                    <button
                      onClick={() => setFilters(f => ({ ...f, color: customColor.name }))}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        filters.color === customColor.name
                          ? `${theme === 'light' ? 'bg-[#c2725b] text-white' : 'bg-pink-500 text-white'}`
                          : `${theme === 'light' ? 'bg-[#fffbf8] text-[#7a6b60] border border-[#e5dbd3] hover:bg-[#fdf0ea]' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border ${theme === 'light' ? 'border-[#e5dbd3]' : 'border-white/30'}`}
                        style={{ backgroundColor: customColor.hex }}
                      />
                      {customColor.name}
                    </button>
                    <button
                      onClick={() => deleteCustomColor(customColor.id)}
                      className={`w-6 h-6 rounded-full ${theme === 'light' ? 'bg-[#f2ebe4] hover:bg-red-500/20' : 'bg-white/5 hover:bg-red-500/20'} flex items-center justify-center transition-colors`}
                    >
                      <X className={`w-3 h-3 ${theme === 'light' ? 'text-[#b0a298]' : 'text-gray-500'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-[#c2725b]/15' : 'bg-teal-500/20'} flex items-center justify-center`}>
              <Star className={`w-5 h-5 ${theme === 'light' ? 'text-[#c2725b]' : 'text-teal-400'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${theme === 'light' ? 'text-[#2c2420]' : 'text-white'}`}>Minimum Rating</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-[#7a6b60]' : 'text-gray-400'}`}>{filters.minRating > 0 ? `${filters.minRating}+ stars` : 'Any rating'}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {[0, 3, 3.5, 4, 4.5].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilters(f => ({ ...f, minRating: rating }))}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filters.minRating === rating
                    ? `${theme === 'light' ? 'bg-[#c2725b] text-white' : 'bg-teal-500 text-white'}`
                    : `${theme === 'light' ? 'bg-[#fffbf8] text-[#7a6b60] border border-[#e5dbd3] hover:bg-[#fdf0ea]' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`
                }`}
              >
                {rating === 0 ? 'All' : `${rating}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-[#c2725b]/15' : 'bg-blue-500/20'} flex items-center justify-center`}>
              <Package className={`w-5 h-5 ${theme === 'light' ? 'text-[#c2725b]' : 'text-blue-400'}`} />
            </div>
            <h3 className={`font-semibold ${theme === 'light' ? 'text-[#2c2420]' : 'text-white'}`}>Brand / Store</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'Home Depot', "Lowe's", 'IKEA', 'Wayfair', 'Amazon', 'Target', 'Walmart', 'Costco'].map((brand) => (
              <button
                key={brand}
                onClick={() => setFilters(f => ({ ...f, brand }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filters.brand === brand
                    ? `${theme === 'light' ? 'bg-[#c2725b] text-white' : 'bg-blue-500 text-white'}`
                    : `${theme === 'light' ? 'bg-[#fffbf8] text-[#7a6b60] border border-[#e5dbd3] hover:bg-[#fdf0ea]' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-[#c2725b]/15' : 'bg-orange-500/20'} flex items-center justify-center`}>
              <Ruler className={`w-5 h-5 ${theme === 'light' ? 'text-[#c2725b]' : 'text-orange-400'}`} />
            </div>
            <h3 className={`font-semibold ${theme === 'light' ? 'text-[#2c2420]' : 'text-white'}`}>Size</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'Standard', 'Custom', 'Various', 'Small', 'Medium', 'Large'].map((size) => (
              <button
                key={size}
                onClick={() => setFilters(f => ({ ...f, size }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filters.size === size
                    ? `${theme === 'light' ? 'bg-[#c2725b] text-white' : 'bg-orange-500 text-white'}`
                    : `${theme === 'light' ? 'bg-[#fffbf8] text-[#7a6b60] border border-[#e5dbd3] hover:bg-[#fdf0ea]' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Category-Specific Features */}
        {selectedCategory && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-[#c2725b]/15' : 'bg-pink-500/20'} flex items-center justify-center`}>
                <Sparkles className={`w-5 h-5 ${theme === 'light' ? 'text-[#c2725b]' : 'text-pink-400'}`} />
              </div>
              <h3 className={`font-semibold ${theme === 'light' ? 'text-[#2c2420]' : 'text-white'}`}>Features</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const categoryFeatures = {
                  blinds: ['Cordless', 'Blackout', 'Light Filtering', 'Motorized', 'Room Darkening', 'Energy Efficient'],
                  rugs: ['Machine Washable', 'Indoor/Outdoor', 'Shag', 'Flatwoven', 'Non-Slip', 'Pet Friendly'],
                  furniture: ['Assembly Required', 'White Glove Delivery', 'In Stock', 'Sustainable', 'Modular'],
                  lighting: ['Dimmable', 'LED', 'Smart Home', 'Energy Star', 'Remote Control'],
                  flooring: ['Waterproof', 'Scratch Resistant', 'Pet Friendly', 'DIY Install', 'Underlayment Included'],
                  paint: ['Low VOC', 'One Coat', 'Washable', 'Mold Resistant', 'Primer Included'],
                  countertops: ['Heat Resistant', 'Stain Resistant', 'Pre-Cut', 'Custom Cut'],
                  cabinets: ['Soft Close', 'Ready to Assemble', 'Pre-Assembled', 'Dovetail Drawers'],
                  plumbing: ['WaterSense', 'Touchless', 'Pull-Down', 'High Arc', 'Low Flow'],
                  appliances: ['Energy Star', 'Smart', 'Stainless Steel', 'Counter Depth', 'French Door'],
                  doors: ['Pre-Hung', 'Solid Core', 'Hollow Core', 'Fire Rated', 'Weatherstrip'],
                  outdoor: ['Weather Resistant', 'UV Protected', 'Rust Proof', 'Cushions Included', 'Cover Included'],
                };
                const features = categoryFeatures[selectedCategory] || [];
                return features.map((feature) => (
                  <button
                    key={feature}
                    onClick={() => setFilters(f => ({
                      ...f,
                      features: f.features.includes(feature)
                        ? f.features.filter(ft => ft !== feature)
                        : [...f.features, feature]
                    }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      filters.features.includes(feature)
                        ? `${theme === 'light' ? 'bg-[#c2725b] text-white' : 'bg-pink-500 text-white'}`
                        : `${theme === 'light' ? 'bg-[#fffbf8] text-[#7a6b60] border border-[#e5dbd3] hover:bg-[#fdf0ea]' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`
                    }`}
                  >
                    {feature}
                  </button>
                ));
              })()}
            </div>
            {filters.features.length > 0 && (
              <p className={`text-xs ${theme === 'light' ? 'text-[#c2725b]' : 'text-pink-400'} mt-2`}>{filters.features.length} feature(s) selected</p>
            )}
          </div>
        )}

        {/* Sort By */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-[#c2725b]/15' : 'bg-cyan-500/20'} flex items-center justify-center`}>
              <SlidersHorizontal className={`w-5 h-5 ${theme === 'light' ? 'text-[#c2725b]' : 'text-cyan-400'}`} />
            </div>
            <h3 className={`font-semibold ${theme === 'light' ? 'text-[#2c2420]' : 'text-white'}`}>Sort By</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'relevance', label: 'Relevance' },
              { id: 'price-low', label: 'Price: Low to High' },
              { id: 'price-high', label: 'Price: High to Low' },
              { id: 'rating', label: 'Highest Rated' },
            ].map((sort) => (
              <button
                key={sort.id}
                onClick={() => setFilters(f => ({ ...f, sortBy: sort.id }))}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filters.sortBy === sort.id
                    ? `${theme === 'light' ? 'bg-[#c2725b] text-white' : 'bg-cyan-500 text-white'}`
                    : `${theme === 'light' ? 'bg-[#fffbf8] text-[#7a6b60] border border-[#e5dbd3] hover:bg-[#fdf0ea]' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentView(cameraActive ? 'camera' : 'home')}
          className={`w-full py-3.5 rounded-lg ${theme === 'light' ? 'bg-[#c2725b] hover:bg-[#a85a44]' : 'bg-teal-600 hover:bg-teal-700'} text-white font-semibold text-base transition-colors`}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Results View
  const ResultsView = () => {
    const currentCategory = categories.find(c => c.id === selectedCategory);
    const categoryColor = currentCategory?.color || '#14B8A6';
    const CategoryIcon = currentCategory?.icon || Sparkles;

    return (
    <div className={homeStyles.app}>
      {/* Header — matches homepage */}
      <header className={homeStyles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className={homeStyles.iconBtn}
            onClick={() => { setSelectedCategory(null); setCurrentView('home'); }}
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${categoryColor}cc, ${categoryColor})`,
              boxShadow: `0 2px 10px ${categoryColor}40`,
              display: 'grid', placeItems: 'center',
            }}
          >
            <CategoryIcon size={18} color="#fff" strokeWidth={1.8} />
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 20, letterSpacing: -0.5 }}>
            {currentCategory?.name || 'Products'}
          </span>
          <span style={{ fontSize: 11, color: '#7a9490', fontWeight: 500 }}>
            {getFilteredProducts().length}
          </span>
        </div>
        <div className={homeStyles.headerRight}>
          <button className={homeStyles.iconBtn} onClick={() => setCurrentView('filters')} aria-label="Filters">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Scroll Content */}
      <main className={homeStyles.scroll}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Products grouped by store */}
          {selectedCategory && (() => {
            const categoryStores = {
              blinds: [
                { name: 'Blinds.com', logo: '🪟', color: '#1E88E5', url: 'https://www.blinds.com', tagline: '#1 online blinds store' },
                { name: 'SelectBlinds', logo: '🪟', color: '#43A047', url: 'https://www.selectblinds.com', tagline: 'Quality blinds for less' },
                { name: 'The Shade Store', logo: '🎨', color: '#5D4037', url: 'https://www.theshadestore.com', tagline: 'Custom luxury window treatments' },
              ],
              rugs: [
                { name: 'Ruggable', logo: '🧹', color: '#FF6B6B', url: 'https://ruggable.com', tagline: 'Machine washable rugs' },
                { name: 'Rugs USA', logo: '🏷️', color: '#3949AB', url: 'https://www.rugsusa.com', tagline: 'Affordable trendy rugs' },
                { name: 'Boutique Rugs', logo: '✨', color: '#7E57C2', url: 'https://www.boutiquerugs.com', tagline: 'Designer rugs at great prices' },
                { name: 'Safavieh', logo: '👑', color: '#D4AF37', url: 'https://www.safavieh.com/rugs/area-rugs', tagline: 'Premium rugs & home decor' },
                { name: 'Ashley Furniture', logo: '🛋️', color: '#8B4513', url: 'https://www.ashleyfurniture.com/c/rugs/', tagline: '#1 furniture retailer in America' },
                { name: 'Raymour & Flanigan', logo: '🏬', color: '#003DA5', url: 'https://www.raymourflanigan.com/area-rugs', tagline: 'Quality furniture since 1947' },
                { name: 'Restoration Hardware', logo: '🏛️', color: '#4A4A4A', url: 'https://rh.com/catalog/category/collections.jsp?categoryId=cat10410048', tagline: 'Luxury home furnishings' },
              ],
              furniture: [
                { name: 'IKEA', logo: '🟡', color: '#0058A3', url: 'https://www.ikea.com', tagline: 'Scandinavian design for less' },
                { name: 'Wayfair', logo: '💜', color: '#7B68AE', url: 'https://www.wayfair.com', tagline: 'A zillion things home' },
                { name: 'Ashley Furniture', logo: '🛋️', color: '#8B4513', url: 'https://www.ashleyfurniture.com', tagline: '#1 furniture retailer in America' },
                { name: 'Raymour & Flanigan', logo: '🏬', color: '#003DA5', url: 'https://www.raymourflanigan.com', tagline: 'Quality furniture since 1947' },
                { name: 'Restoration Hardware', logo: '🏛️', color: '#4A4A4A', url: 'https://rh.com', tagline: 'Luxury home furnishings' },
                { name: 'Safavieh', logo: '👑', color: '#D4AF37', url: 'https://www.safavieh.com/furniture', tagline: 'Premium rugs & home decor' },
                { name: 'Article', logo: '🪑', color: '#263238', url: 'https://www.article.com', tagline: 'Modern furniture direct' },
              ],
              lighting: [
                { name: 'Lumens', logo: '💡', color: '#FFC107', url: 'https://www.lumens.com', tagline: 'Modern lighting experts' },
                { name: 'Lamps Plus', logo: '🔦', color: '#FF9800', url: 'https://www.lampsplus.com', tagline: 'Largest lighting retailer' },
                { name: 'YLighting', logo: '💫', color: '#FFB300', url: 'https://www.ylighting.com', tagline: 'Designer lighting' },
                { name: 'Ashley Furniture', logo: '🛋️', color: '#8B4513', url: 'https://www.ashleyfurniture.com/c/lighting/', tagline: '#1 furniture retailer in America' },
                { name: 'Safavieh', logo: '👑', color: '#D4AF37', url: 'https://www.safavieh.com/lighting', tagline: 'Premium rugs & home decor' },
                { name: 'Raymour & Flanigan', logo: '🏬', color: '#003DA5', url: 'https://www.raymourflanigan.com/lamps-and-lighting', tagline: 'Quality furniture since 1947' },
                { name: 'Restoration Hardware', logo: '🏛️', color: '#4A4A4A', url: 'https://rh.com/catalog/category/collections.jsp?categoryId=cat10410003', tagline: 'Luxury home furnishings' },
              ],
              flooring: [
                { name: 'Home Depot', logo: '🧡', color: '#F96302', url: 'https://www.homedepot.com/b/Flooring/N-5yc1vZaq7r', tagline: '#1 home improvement' },
                { name: "Lowe's", logo: '🔷', color: '#004990', url: 'https://www.lowes.com/pl/Flooring/4294760488', tagline: 'Home improvement done right' },
                { name: 'Build.com', logo: '🔧', color: '#607D8B', url: 'https://www.build.com/flooring/c113312', tagline: 'Home improvement specialists' },
              ],
              paint: [
                { name: 'Sherwin-Williams', logo: '🎨', color: '#0047AB', url: 'https://www.sherwin-williams.com/en-us/products/interior-paint', tagline: 'America\'s #1 paint brand' },
                { name: 'Benjamin Moore', logo: '🖌️', color: '#C41230', url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains', tagline: 'Premium quality since 1883' },
                { name: 'Home Depot', logo: '🧡', color: '#F96302', url: 'https://www.homedepot.com/b/Paint/N-5yc1vZaq1t', tagline: '#1 home improvement' },
                { name: "Lowe's", logo: '🔷', color: '#004990', url: 'https://www.lowes.com/pl/Paint/4294823558', tagline: 'Home improvement done right' },
                { name: 'Menards', logo: '🟢', color: '#2E7D32', url: 'https://www.menards.com/main/paint/c-7106.htm', tagline: 'Save big money' },
              ],
              countertops: [
                { name: 'Home Depot', logo: '🧡', color: '#F96302', url: 'https://www.homedepot.com/b/Kitchen-Countertops/N-5yc1vZc8a1', tagline: '#1 home improvement' },
                { name: "Lowe's", logo: '🔷', color: '#004990', url: 'https://www.lowes.com/pl/Countertops-accessories-Kitchen/4294825598', tagline: 'Home improvement done right' },
                { name: 'IKEA', logo: '🟡', color: '#0058A3', url: 'https://www.ikea.com/us/en/cat/countertops-24264/', tagline: 'Scandinavian design for less' },
              ],
              cabinets: [
                { name: 'Home Depot', logo: '🧡', color: '#F96302', url: 'https://www.homedepot.com/b/Kitchen-Kitchen-Cabinets/N-5yc1vZas87', tagline: '#1 home improvement' },
                { name: "Lowe's", logo: '🔷', color: '#004990', url: 'https://www.lowes.com/pl/Kitchen-cabinets-Kitchen/4294857979', tagline: 'Home improvement done right' },
                { name: 'IKEA', logo: '🟡', color: '#0058A3', url: 'https://www.ikea.com/us/en/cat/kitchen-cabinets-ka002/', tagline: 'Scandinavian design for less' },
              ],
              plumbing: [
                { name: 'Home Depot', logo: '🧡', color: '#F96302', url: 'https://www.homedepot.com/b/Plumbing/N-5yc1vZbqew', tagline: '#1 home improvement' },
                { name: "Lowe's", logo: '🔷', color: '#004990', url: 'https://www.lowes.com/pl/Plumbing/4294776487', tagline: 'Home improvement done right' },
                { name: 'Build.com', logo: '🔧', color: '#607D8B', url: 'https://www.build.com/plumbing/c113310', tagline: 'Home improvement specialists' },
              ],
              appliances: [
                { name: 'Home Depot', logo: '🧡', color: '#F96302', url: 'https://www.homedepot.com/b/Appliances/N-5yc1vZbv1w', tagline: '#1 home improvement' },
                { name: "Lowe's", logo: '🔷', color: '#004990', url: 'https://www.lowes.com/pl/Appliances/4294857974', tagline: 'Home improvement done right' },
                { name: 'Costco', logo: '🏪', color: '#E31837', url: 'https://www.costco.com/appliances.html', tagline: 'Premium quality, member prices' },
              ],
              doors: [
                { name: 'Home Depot', logo: '🧡', color: '#F96302', url: 'https://www.homedepot.com/b/Doors-Windows/N-5yc1vZaqge', tagline: '#1 home improvement' },
                { name: "Lowe's", logo: '🔷', color: '#004990', url: 'https://www.lowes.com/pl/Doors-windows/4294634825', tagline: 'Home improvement done right' },
                { name: 'Menards', logo: '🟢', color: '#2E7D32', url: 'https://www.menards.com/main/doors-windows-millwork/c-7973.htm', tagline: 'Save big money' },
              ],
              outdoor: [
                { name: 'Home Depot', logo: '🧡', color: '#F96302', url: 'https://www.homedepot.com/b/Outdoors-Patio-Furniture/N-5yc1vZbx5z', tagline: '#1 home improvement' },
                { name: 'Wayfair', logo: '💜', color: '#7B68AE', url: 'https://www.wayfair.com/outdoor/sb0/patio-furniture-c531454.html', tagline: 'A zillion things home' },
                { name: 'Restoration Hardware', logo: '🏛️', color: '#4A4A4A', url: 'https://rh.com/catalog/category/collections.jsp?categoryId=cat10410015', tagline: 'Luxury home furnishings' },
                { name: 'At Home', logo: '🏡', color: '#8BC34A', url: 'https://www.athome.com/outdoor/', tagline: 'Home decor superstore' },
              ],
            };

            const filteredProducts = getFilteredProducts();
            const stores = categoryStores[selectedCategory] || [];

            // Group products by store name
            const productsByStore = {};
            filteredProducts.forEach(product => {
              const storeName = product.store || product.brand;
              if (!productsByStore[storeName]) {
                productsByStore[storeName] = [];
              }
              productsByStore[storeName].push(product);
            });

            // Build ordered list: categoryStores first, then any remaining stores from products
            const storeOrder = stores.map(s => s.name);
            const remainingStores = Object.keys(productsByStore).filter(name => !storeOrder.includes(name));
            const allStoreNames = [...storeOrder, ...remainingStores];

            // Build a lookup for store metadata
            const storeMeta = {};
            stores.forEach(s => { storeMeta[s.name] = s; });

            return allStoreNames.map(storeName => {
              const storeProducts = productsByStore[storeName];
              if (!storeProducts || storeProducts.length === 0) return null;

              const store = storeMeta[storeName] || {
                name: storeName,
                color: '#6B7280',
                url: storeProducts[0]?.link,
                tagline: '',
              };

              return (
                <div
                  key={storeName}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}
                >
                  {/* Store header */}
                  <a
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 4px',
                      textDecoration: 'none', color: '#f0ebe5',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      transition: 'opacity 0.15s ease',
                    }}
                  >
                    <StoreLogo storeName={store.name} size="lg" />
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#f0ebe5', flex: 1 }}>{store.name}</span>
                    <span style={{ fontSize: 11.5, color: '#7a9490' }}>{storeProducts.length} product{storeProducts.length !== 1 ? 's' : ''}</span>
                    <ChevronRight size={16} style={{ color: '#5a7a76' }} />
                  </a>

                  {/* Store's products */}
                  {storeProducts.map((product) => {
                    const isHighRated = product.rating >= 4.5;
                    return (
                      <a
                        key={product.id}
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: 12, borderRadius: 14,
                          background: '#224848',
                          textDecoration: 'none', color: '#f0ebe5',
                          transition: 'transform 0.15s ease',
                        }}
                      >
                        <ProductImage product={product} size="lg" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontWeight: 600, fontSize: 13.5, color: '#f0ebe5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
                          <p style={{ fontSize: 12, color: '#7a9490', marginTop: 2 }}>{product.brand}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                            <span style={{ fontWeight: 700, fontSize: 16, color: '#e07850' }}>
                              ${product.price}
                            </span>
                            <span style={{
                              display: 'flex', alignItems: 'center', gap: 3,
                              fontSize: 11, color: isHighRated ? '#e07850' : '#7a9490',
                            }}>
                              <Star size={11} style={isHighRated ? { fill: '#e07850', color: '#e07850' } : {}} />
                              {product.rating}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setAlertProduct(product);
                              setAlertTargetPrice((product.price * 0.9).toFixed(0));
                              setShowAlertModal(true);
                            }}
                            style={{
                              width: 34, height: 34, borderRadius: 10, border: 'none',
                              display: 'grid', placeItems: 'center', cursor: 'pointer',
                              background: 'rgba(255,255,255,0.06)', color: '#7a9490',
                              fontFamily: 'inherit', transition: 'background 0.15s',
                              padding: 0,
                            }}
                            aria-label="Set price alert"
                          >
                            <Bell size={14} />
                          </button>
                          {activeBudgetId && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addProductToBudget(product, activeBudgetId);
                              }}
                              style={{
                                width: 34, height: 34, borderRadius: 10, border: 'none',
                                display: 'grid', placeItems: 'center', cursor: 'pointer',
                                background: 'rgba(224,120,80,0.15)', color: '#e07850',
                                fontFamily: 'inherit', transition: 'background 0.15s',
                                padding: 0,
                              }}
                              aria-label="Add to budget"
                            >
                              <Plus size={14} />
                            </button>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              );
            }).filter(Boolean);
          })()}
        </div>

        {/* Price Alert Modal */}
        {showAlertModal && alertProduct && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: 16,
          }}>
            <div style={{
              width: '100%', maxWidth: 380, background: '#1c4242',
              borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)',
              padding: 24,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f0ebe5', marginBottom: 6, fontFamily: "'Cormorant Garamond', serif" }}>Set Price Alert</h3>
              <p style={{ color: '#7a9490', fontSize: 13, marginBottom: 16 }}>{alertProduct.name}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#7a9490', display: 'block', marginBottom: 4 }}>Current Price</label>
                  <p style={{ fontSize: 26, fontWeight: 700, color: '#e07850' }}>${alertProduct.price}</p>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#7a9490', display: 'block', marginBottom: 4 }}>Alert me when price drops to ($)</label>
                  <input
                    type="number"
                    value={alertTargetPrice}
                    onChange={(e) => setAlertTargetPrice(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: 14,
                      background: '#224848', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#f0ebe5', fontSize: 20, fontWeight: 600,
                      outline: 'none', fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                  <button
                    onClick={() => {
                      setShowAlertModal(false);
                      setAlertProduct(null);
                      setAlertTargetPrice('');
                    }}
                    style={{
                      flex: 1, padding: '12px 0', borderRadius: 14, border: 'none',
                      background: 'rgba(255,255,255,0.06)', color: '#b8c4c0',
                      fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
                      transition: 'background 0.15s',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addPriceAlert}
                    disabled={!alertTargetPrice}
                    style={{
                      flex: 1, padding: '12px 0', borderRadius: 14, border: 'none',
                      background: !alertTargetPrice ? 'rgba(224,120,80,0.3)' : 'linear-gradient(135deg, #d06840, #e07850)',
                      color: 'white', fontWeight: 600, cursor: alertTargetPrice ? 'pointer' : 'default',
                      fontFamily: 'inherit', fontSize: 14,
                      boxShadow: alertTargetPrice ? '0 2px 10px rgba(224,120,80,0.3)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    Set Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {getFilteredProducts().length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <Search size={32} style={{ color: '#5a7a76', margin: '0 auto 12px', display: 'block' }} />
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f0ebe5', marginBottom: 4, fontFamily: "'Cormorant Garamond', serif" }}>No products yet</h3>
            <p style={{ color: '#7a9490', fontSize: 12.5, marginBottom: 14 }}>Add products or adjust filters</p>
            <button
              onClick={() => setCurrentView('admin')}
              style={{
                padding: '8px 20px', borderRadius: 30, border: 'none',
                background: 'linear-gradient(135deg, #d06840, #e07850)',
                color: 'white', fontSize: 12.5, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 2px 10px rgba(224,120,80,0.3)',
              }}
            >
              Add Products
            </button>
          </div>
        )}
      </main>

      {/* Floating Camera FAB */}
      <button className={homeStyles.fab} aria-label="Scan room" onClick={startCamera}>
        <Camera size={24} />
      </button>

      {/* Bottom Nav */}
      <nav className={homeStyles.nav}>
        <button className={homeStyles.navBtn} onClick={() => setCurrentView('home')}>
          <Home size={22} />
          <span>Home</span>
        </button>
        <button className={homeStyles.navBtn} onClick={() => setCurrentView('stores')}>
          <Search size={22} />
          <span>Explore</span>
        </button>
        <div className={homeStyles.navSpacer} />
        <button className={homeStyles.navBtn} onClick={() => setCurrentView('rooms')}>
          <Heart size={22} />
          <span>Saved</span>
        </button>
        <button className={homeStyles.navBtn} onClick={() => setCurrentView('admin')}>
          <User size={22} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
    );
  };

  // Room Manager View
  const RoomManagerView = () => (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-200`} style={themeClasses.bgStyle}>
      <div className="px-6 py-8 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className={`w-11 h-11 rounded-xl ${theme === 'light' ? 'bg-[#fffbf8] border-[#e5dbd3]' : 'bg-white/5 border-white/10'} border flex items-center justify-center`}
          >
            <ChevronLeft className={`w-5 h-5 ${theme === 'light' ? 'text-[#2c2420]' : 'text-gray-300'}`} />
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold">My Rooms</h1>
          <div className="w-11" />
        </div>

        <p className={`${themeClasses.textSecondary} text-sm mb-6`}>
          Save room measurements for quick access when shopping.
        </p>

        {savedRooms.length === 0 ? (
          <div className="text-center py-12">
            <FolderHeart className={`w-16 h-16 ${themeClasses.textMuted} mx-auto mb-4`} />
            <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>No saved rooms</h3>
            <p className={`${themeClasses.textSecondary} text-sm mb-4`}>
              Measure a space using the camera to save room dimensions.
            </p>
            <button
              onClick={startCamera}
              className={`px-6 py-2 rounded-full ${themeClasses.button} text-sm font-medium`}
            >
              Open Camera
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {savedRooms.map((room) => (
              <div
                key={room.id}
                className={`p-4 rounded-2xl ${themeClasses.card}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${themeClasses.text}`}>{room.name}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        loadRoom(room);
                        setCurrentView('results');
                      }}
                      className={`px-3 py-1 rounded-lg ${theme === 'light' ? 'bg-[#c2725b]/20 text-[#c2725b]' : 'bg-teal-500/20 text-teal-400'} text-xs font-medium hover:opacity-80 transition-colors`}
                    >
                      Shop
                    </button>
                    <button
                      onClick={() => deleteRoom(room.id)}
                      className={`w-8 h-8 rounded-lg ${theme === 'light' ? 'bg-[#f2ebe4]' : 'bg-white/5'} flex items-center justify-center hover:bg-red-500/20 transition-colors`}
                    >
                      <Trash2 className={`w-4 h-4 ${themeClasses.textMuted}`} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`flex items-center gap-1 ${themeClasses.textSecondary}`}>
                    <Ruler className="w-4 h-4" />
                    {room.width} × {room.height} {room.unit}
                  </span>
                  <span className={themeClasses.textMuted}>
                    {categories.find(c => c.id === room.category)?.name}
                  </span>
                </div>
                <p className={`text-xs ${themeClasses.textMuted} mt-2`}>
                  Saved {new Date(room.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Budget Manager View
  const BudgetManagerView = () => (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-200`} style={themeClasses.bgStyle}>
      <div className="px-6 py-8 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className={`w-11 h-11 rounded-xl ${theme === 'light' ? 'bg-[#fffbf8] border-[#e5dbd3]' : 'bg-white/5 border-white/10'} border flex items-center justify-center`}
          >
            <ChevronLeft className={`w-5 h-5 ${theme === 'light' ? 'text-[#2c2420]' : 'text-gray-300'}`} />
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold">Budget Tracker</h1>
          <button
            onClick={() => setShowBudgetModal(true)}
            className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center hover:bg-teal-500/30 transition-colors"
          >
            <Plus className="w-5 h-5 text-teal-400" />
          </button>
        </div>

        {budgets.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No budgets yet</h3>
            <p className="text-gray-400 text-sm mb-4">
              Create a budget to track your spending on home projects.
            </p>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="px-6 py-2 rounded-full bg-teal-500 text-white text-sm font-medium"
            >
              Create Budget
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const spent = getBudgetSpent(budget);
              const remaining = getBudgetRemaining(budget);
              const pct = Math.min((spent / budget.totalBudget) * 100, 100);
              const isActive = activeBudgetId === budget.id;

              return (
                <div
                  key={budget.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-teal-500/10 border-teal-500/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-teal-500 text-white text-xs font-medium">
                          Active
                        </span>
                      )}
                      <h4 className="font-semibold text-white">{budget.name}</h4>
                    </div>
                    <div className="flex gap-2">
                      {!isActive && (
                        <button
                          onClick={() => setActiveBudgetId(budget.id)}
                          className="px-3 py-1 rounded-lg bg-teal-500/20 text-teal-400 text-xs font-medium hover:bg-teal-500/30 transition-colors"
                        >
                          Set Active
                        </button>
                      )}
                      <button
                        onClick={() => deleteBudget(budget.id)}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">
                        ${spent.toFixed(2)} of ${budget.totalBudget.toFixed(2)}
                      </span>
                      <span className={remaining >= 0 ? 'text-green-400' : 'text-red-400'}>
                        ${remaining.toFixed(2)} left
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: pct > 90 ? '#EF4444' : pct > 70 ? '#F59E0B' : '#22C55E'
                        }}
                      />
                    </div>
                  </div>

                  {budget.savedProducts.length > 0 && (
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-xs text-gray-500 mb-2">Products ({budget.savedProducts.length})</p>
                      <div className="space-y-1">
                        {budget.savedProducts.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between text-sm">
                            <span className="text-gray-300 truncate flex-1">{item.name}</span>
                            <span className="text-gray-400 mx-2">×{item.quantity}</span>
                            <span className="text-teal-400">${(item.price * item.quantity).toFixed(2)}</span>
                            <button
                              onClick={() => removeProductFromBudget(item.productId, budget.id)}
                              className="ml-2 text-gray-500 hover:text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Create Budget Modal */}
        {showBudgetModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-[#242320] rounded-lg border border-[#3d3a34] p-6">
              <h3 className="text-xl font-bold text-white mb-4">Create Budget</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Budget Name</label>
                  <input
                    type="text"
                    value={newBudgetName}
                    onChange={(e) => setNewBudgetName(e.target.value)}
                    placeholder="e.g., Kitchen Renovation"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Total Budget ($)</label>
                  <input
                    type="number"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                    placeholder="e.g., 5000"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-teal-500 outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowBudgetModal(false);
                      setNewBudgetName('');
                      setNewBudgetAmount('');
                    }}
                    className="flex-1 py-3 rounded-xl bg-white/10 text-gray-300 font-medium hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createBudget}
                    disabled={!newBudgetName.trim() || !newBudgetAmount}
                    className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Alerts View
  const AlertsView = () => (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-200`} style={themeClasses.bgStyle}>
      <div className="px-6 py-8 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className={`w-11 h-11 rounded-xl ${theme === 'light' ? 'bg-[#fffbf8] border-[#e5dbd3]' : 'bg-white/5 border-white/10'} border flex items-center justify-center`}
          >
            <ChevronLeft className={`w-5 h-5 ${theme === 'light' ? 'text-[#2c2420]' : 'text-gray-300'}`} />
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold">Price Alerts</h1>
          <div className="w-11" />
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Get notified when products drop to your target price.
        </p>

        {/* Triggered Alerts */}
        {getTriggeredAlerts().length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-widest text-green-400 mb-3 font-medium flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Price Dropped!
            </h3>
            <div className="space-y-3">
              {getTriggeredAlerts().map((alert) => {
                const product = products[alert.category]?.find(p => p.id === alert.productId);
                return (
                  <div
                    key={alert.id}
                    className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{alert.productName}</h4>
                        <p className="text-sm text-gray-400">
                          Target: ${alert.targetPrice} • Now: ${product?.price || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {product && (
                          <a
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors"
                          >
                            Buy Now
                          </a>
                        )}
                        <button
                          onClick={() => deletePriceAlert(alert.id)}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Alerts */}
        {priceAlerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No price alerts</h3>
            <p className="text-gray-400 text-sm mb-4">
              Set alerts on products to track price drops.
            </p>
            <button
              onClick={() => setCurrentView('home')}
              className="px-6 py-2 rounded-full bg-teal-500 text-white text-sm font-medium"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3 font-medium">Active Alerts</h3>
            <div className="space-y-3">
              {priceAlerts.filter(a => !getTriggeredAlerts().find(t => t.id === a.id)).map((alert) => {
                const product = products[alert.category]?.find(p => p.id === alert.productId);
                return (
                  <div
                    key={alert.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{alert.productName}</h4>
                        <p className="text-sm text-gray-400">
                          Alert when ≤ ${alert.targetPrice}
                        </p>
                        <p className="text-xs text-gray-500">
                          Current: ${product?.price || 'N/A'}
                        </p>
                      </div>
                      <button
                        onClick={() => deletePriceAlert(alert.id)}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (showSplash) {
    return (
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-600 ${splashFading ? 'opacity-0' : 'opacity-100'}`}
        style={{ background: '#1a3a3a' }}
      >
        {/* Subtle teal accent line */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px opacity-30" style={{ background: '#e07850' }} />

        {/* Logo mark */}
        <div
          className="relative mb-8"
          style={{ animation: 'splashLogoIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        >
          <div className="w-20 h-20 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d06840, #e07850, #e8916e)' }}>
            <span className="text-3xl font-bold text-white tracking-tight">EZ</span>
          </div>
          {/* Shine sweep */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ animation: 'splashShine 1.5s 0.5s ease-in-out forwards' }}
          >
            <div
              className="absolute inset-0 -translate-x-full"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                animation: 'splashShineSweep 1.5s 0.5s ease-in-out forwards',
              }}
            />
          </div>
        </div>

        {/* Text */}
        <div
          className="relative text-center"
          style={{ animation: 'splashTextIn 0.7s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            EZ Shopping
          </h1>
          <div
            className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[#e07850] to-transparent"
            style={{ animation: 'splashLineExpand 0.8s 0.7s ease-out both' }}
          />
        </div>

        {/* Loading dots */}
        <div
          className="absolute bottom-16 flex gap-1.5"
          style={{ animation: 'splashTextIn 0.5s 1.2s ease-out both' }}
        >
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#e07850]/60"
              style={{ animation: `splashDot 1.4s ${i * 0.2}s ease-in-out infinite` }}
            />
          ))}
        </div>

        <style>{`
          @keyframes splashLogoIn {
            from { opacity: 0; transform: scale(0.5) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes splashTextIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes splashLineExpand {
            from { opacity: 0; width: 0; }
            to { opacity: 1; width: 4rem; }
          }
          @keyframes splashPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
            50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.25; }
          }
          @keyframes splashShineSweep {
            from { transform: translateX(-100%); }
            to { transform: translateX(100%); }
          }
          @keyframes splashDot {
            0%, 80%, 100% { opacity: 0.3; transform: scale(1); }
            40% { opacity: 1; transform: scale(1.4); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {currentView === 'home' && <HomeScreen />}
      {currentView === 'camera' && <CameraView />}
      {currentView === 'filters' && <FiltersView />}
      {currentView === 'results' && <ResultsView />}
      {currentView === 'admin' && <AdminPanel />}
      {currentView === 'stores' && <StoreDirectory />}
      {currentView === 'rooms' && <RoomManagerView />}
      {currentView === 'budgets' && <BudgetManagerView />}
      {currentView === 'alerts' && <AlertsView />}

      {/* WebXR AR — hidden canvas for GL base layer */}
      <canvas ref={arCanvasRef} style={{ position: 'fixed', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }} />

      {/* WebXR AR — DOM overlay (browser shows fullscreen during XR session) */}
      {/* All updates via refs + direct DOM manipulation — zero React re-renders during XR */}
      <div
        ref={arOverlayRef}
        style={{
          display: 'none',
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          fontFamily: "'DM Sans', -apple-system, sans-serif",
          color: 'white',
        }}
      >
        {/* Close button */}
        <button
          onClick={stopARMeasure}
          style={{
            position: 'absolute', top: 16, left: 16, zIndex: 10,
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(12px)',
            display: 'grid', placeItems: 'center',
            cursor: 'pointer', color: 'white', padding: 0,
          }}
        >
          <X size={20} />
        </button>

        {/* Center reticle */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}>
          <div
            ref={arReticleRef}
            style={{
              width: 44, height: 44,
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: 8,
              transition: 'border-color 0.15s',
              position: 'relative',
            }}
          >
            <div data-xhair="1" style={{ position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', width: 2, height: 10, background: 'rgba(255,255,255,0.3)', transition: 'background 0.15s' }} />
            <div data-xhair="1" style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', width: 2, height: 10, background: 'rgba(255,255,255,0.3)', transition: 'background 0.15s' }} />
            <div data-xhair="1" style={{ position: 'absolute', left: -7, top: '50%', transform: 'translateY(-50%)', width: 10, height: 2, background: 'rgba(255,255,255,0.3)', transition: 'background 0.15s' }} />
            <div data-xhair="1" style={{ position: 'absolute', right: -7, top: '50%', transform: 'translateY(-50%)', width: 10, height: 2, background: 'rgba(255,255,255,0.3)', transition: 'background 0.15s' }} />
          </div>
          <div
            ref={arReticleDotRef}
            style={{
              display: 'none',
              position: 'absolute', top: '50%', left: '50%',
              width: 6, height: 6, borderRadius: '50%',
              background: '#e07850',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 10px rgba(224,120,80,0.6)',
            }}
          />
        </div>

        {/* Status bar at top */}
        <div style={{
          position: 'absolute', top: 16, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div
            ref={arStatusRef}
            style={{
              padding: '10px 20px', borderRadius: 30,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 14, fontWeight: 500,
            }}
          >
            Scanning for surfaces...
          </div>
        </div>

        {/* Point progress indicators */}
        <div style={{
          position: 'absolute', bottom: 140, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12,
          pointerEvents: 'none',
        }}>
          <div ref={arDot1Ref} style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', transition: 'all 0.3s' }} />
          <div ref={arLineRef} style={{ width: 28, height: 2, background: 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
          <div ref={arDot2Ref} style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', transition: 'all 0.3s' }} />
        </div>

        {/* Result display (updated via innerHTML) */}
        <div style={{
          position: 'absolute', bottom: 80, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div ref={arResultRef} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Move your phone slowly to detect surfaces...</div>
          </div>
        </div>

        {/* Action buttons at bottom (shown after measurement) */}
        <div
          ref={arBottomRef}
          style={{
            display: 'none',
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '20px 20px calc(20px + env(safe-area-inset-bottom))',
            background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
            justifyContent: 'center', gap: 10,
          }}
        >
          <button
            onClick={() => {
              arPointsRef.current = [];
              arDistanceRef.current = null;
              arUpdateUI(true, [], null);
              if (arBottomRef.current) arBottomRef.current.style.display = 'none';
            }}
            style={{
              flex: 1, maxWidth: 160, padding: '14px 0', borderRadius: 14, border: 'none',
              background: 'rgba(255,255,255,0.1)', color: 'white',
              fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
              backdropFilter: 'blur(4px)',
            }}
          >
            Measure Again
          </button>
          <button
            onClick={useARMeasurement}
            style={{
              flex: 1, maxWidth: 160, padding: '14px 0', borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, #d06840, #e07850)',
              color: 'white', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 14,
              boxShadow: '0 4px 16px rgba(224,120,80,0.4)',
            }}
          >
            Use Measurement
          </button>
        </div>
      </div>
    </>
  );
}
