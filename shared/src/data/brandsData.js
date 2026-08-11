/**
 * Centralized Official Brand Configuration & Real Logo Image Assets
 * Uday Electrical Works Platform
 * Using exact user-provided brand logo images stored in /brands/
 */

export const BRANDS = [
  {
    id: 'anchor',
    name: 'Anchor by Panasonic',
    logo: '/brands/anchor.jpg',
    accentColor: '#004098'
  },
  {
    id: 'bajaj',
    name: 'Bajaj Electricals',
    logo: '/brands/bajaj.jpg',
    accentColor: '#E30613'
  },
  {
    id: 'cona',
    name: 'Cona Electricals',
    logo: '/brands/cona.jpg',
    accentColor: '#D32F2F'
  },
  {
    id: 'crompton',
    name: 'Crompton Greaves',
    logo: '/brands/crompton.jpg',
    accentColor: '#005CA9'
  },
  {
    id: 'finolex',
    name: 'Finolex Wires & Cables',
    logo: '/brands/finolex.jpg',
    accentColor: '#004B87'
  },
  {
    id: 'girish',
    name: 'Girish Switches',
    logo: '/brands/girish.jpg',
    accentColor: '#E53935'
  },
  {
    id: 'gm',
    name: 'GM Modular',
    logo: '/brands/GM.jpg',
    accentColor: '#000000'
  },
  {
    id: 'havells',
    name: 'Havells India',
    logo: '/brands/haveels.jpg',
    accentColor: '#E31E24'
  },
  {
    id: 'lefigaro',
    name: 'Le-Figaro',
    logo: '/brands/lefigaro.jpg',
    accentColor: '#1A237E'
  },
  {
    id: 'orient',
    name: 'Orient Electric',
    logo: '/brands/orient.jpg',
    accentColor: '#FF6F00'
  },
  {
    id: 'philips',
    name: 'Philips Lighting',
    logo: '/brands/philips.jpg',
    accentColor: '#0B5EA8'
  },
  {
    id: 'polycab',
    name: 'Polycab India',
    logo: '/brands/polycab.jpg',
    accentColor: '#E30613'
  },
  {
    id: 'roxy',
    name: 'Roxy Fans & Electricals',
    logo: '/brands/roxy.jpg',
    accentColor: '#B71C1C'
  }
];

export const getBrandMeta = (brandName) => {
  if (!brandName) return null;
  const nameLower = brandName.toLowerCase();
  return BRANDS.find((b) => b.name.toLowerCase().includes(nameLower) || nameLower.includes(b.id)) || {
    name: brandName,
    logo: null,
    accentColor: '#F59E0B'
  };
};
