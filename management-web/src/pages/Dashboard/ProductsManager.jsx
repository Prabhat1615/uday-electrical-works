import React, { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Tag, Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useErpQueries';
import { bulkImportProductsApi } from '../../api/productApi';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, getProductImages, isValidHttpUrl } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { EmptyProducts } from '../../components/ui/EmptyState';
import { StaggerContainer, StaggerItem } from '../../components/motion/PageTransition';

export const ProductsManager = () => {
  const [search, setSearch] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit' | 'bulk'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Bulk import state
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Havells');
  const [category, setCategory] = useState('Ceiling Fans');
  const [sku, setSku] = useState('');
  const [mrp, setMrp] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(10);
  const [description, setDescription] = useState('');
  
  // Multi-image fields (1 to 3 images per product)
  const [imageUrls, setImageUrls] = useState(['']);
  const [previewErrors, setPreviewErrors] = useState({});

  const { data: res, isLoading, refetch } = useProducts({ search });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = res?.data || [];

  const categories = [
    'Ceiling Fans',
    'Exhaust Fans',
    'LED Bulbs',
    'LED Battens',
    'Modular Switches',
    'Wires & Cables',
    'MCBs & DB Boxes',
    'Water Heaters & Geysers',
    'Home Appliances',
    'Electrical Accessories'
  ];

  const brands = [
    'Havells',
    'Crompton',
    'Polycab',
    'Philips',
    'Anchor by Panasonic',
    'Orient Electric',
    'Finolex',
    'Bajaj',
    'V-Guard',
    'Legrand',
    'Schneider Electric'
  ];

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setName('');
    setBrand('Havells');
    setCategory('Ceiling Fans');
    setSku(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
    setMrp(0);
    setPrice(0);
    setStock(10);
    setDescription('');
    setImageUrls(['']);
    setPreviewErrors({});
    setActiveModal('create');
  };

  const handleOpenEdit = (p) => {
    setSelectedProduct(p);
    setName(p.name);
    setBrand(p.brand || 'Havells');
    setCategory(p.category);
    setSku(p.sku || `SKU-${Date.now().toString().slice(-6)}`);
    setMrp(p.mrp || p.price);
    setPrice(p.price);
    setStock(p.stock);
    setDescription(p.description);

    // Populate images array (supports legacy single imageUrl or new images[])
    const existingImgs = getProductImages(p);
    setImageUrls(existingImgs.length > 0 ? existingImgs : ['']);
    setPreviewErrors({});
    setActiveModal('edit');
  };

  const handleImageUrlChangeAt = (idx, value) => {
    setImageUrls((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    setPreviewErrors((prev) => ({ ...prev, [idx]: false }));
  };

  const addImageField = () => {
    if (imageUrls.length < 3) {
      setImageUrls((prev) => [...prev, '']);
    }
  };

  const removeImageField = (idx) => {
    if (imageUrls.length > 1) {
      setImageUrls((prev) => prev.filter((_, i) => i !== idx));
      setPreviewErrors((prev) => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
    }
  };

  const setPreviewErrorFor = (idx, isErr) => {
    setPreviewErrors((prev) => ({ ...prev, [idx]: isErr }));
  };

  const handleBulkImport = async (e) => {
    e.preventDefault();
    setBulkLoading(true);
    setBulkResult('');
    try {
      let itemsToImport = [];
      if (bulkCsvText.trim().startsWith('[') || bulkCsvText.trim().startsWith('{')) {
        itemsToImport = JSON.parse(bulkCsvText);
      } else {
        const lines = bulkCsvText.split('\n').filter((l) => l.trim().length > 0);
        const hasHeader = lines[0].toLowerCase().includes('name');
        const dataLines = hasHeader ? lines.slice(1) : lines;

        itemsToImport = dataLines.map((line) => {
          const parts = line.split(',').map((p) => p.trim());
          return {
            name: parts[0] || 'Bulk Product',
            brand: parts[1] || 'Havells',
            category: parts[2] || 'Electrical Accessories',
            sku: parts[3] || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
            mrp: Number(parts[4] || 0),
            price: Number(parts[5] || 0),
            stock: Number(parts[6] || 10),
            warranty: parts[7] || '1 Year Warranty'
          };
        });
      }

      const res = await bulkImportProductsApi(itemsToImport);
      setBulkResult(`✅ ${res.data?.message || 'Bulk products imported successfully!'}`);
      refetch();
    } catch (err) {
      setBulkResult(`❌ Import failed: ${err.message}`);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter valid image URLs
    const validUrls = imageUrls
      .filter((url) => typeof url === 'string' && url.trim().length > 0)
      .map((url) => url.trim());

    if (validUrls.length === 0) {
      alert('Please provide at least one product image URL.');
      return;
    }

    // Validate HTTP/HTTPS protocol
    for (const url of validUrls) {
      if (!isValidHttpUrl(url)) {
        alert(`Invalid image URL: "${url}". Please provide a valid http:// or https:// image URL.`);
        return;
      }
    }

    try {
      const payload = {
        name,
        brand,
        category,
        sku,
        mrp: Number(mrp),
        price: Number(price),
        stock: Number(stock),
        description,
        imageUrl: validUrls[0],
        images: validUrls.slice(0, 3)
      };

      if (activeModal === 'create') {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({
          id: selectedProduct._id,
          data: payload
        });
      }
      setActiveModal(null);
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete product item?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Products</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your electrical product inventory and pricing</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={FileSpreadsheet}
            onClick={() => {
              setBulkCsvText('');
              setBulkResult('');
              setActiveModal('bulk');
            }}
          >
            Bulk Import CSV
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <LoadingSpinner message="Loading products..." />
      ) : products.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyProducts onAdd={handleOpenCreate} />
          </CardBody>
        </Card>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => {
            const productImgs = getProductImages(p);
            const primaryImg = productImgs[0] || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60';
            return (
              <StaggerItem key={p._id}>
                <Card hover>
                  <CardBody className="p-4">
                    <div className="relative aspect-square rounded-lg bg-white p-2 mb-4 overflow-hidden flex items-center justify-center border border-surface-200">
                      <img
                        src={primaryImg}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                      {productImgs.length > 1 && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                          {productImgs.length} Images
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-brand-600 uppercase">{p.brand || 'Havells'}</span>
                        <h3 className="font-medium text-text-primary text-sm line-clamp-2">{p.name}</h3>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted font-mono">SKU: {p.sku}</span>
                        <StatusBadge status={p.status} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-text-muted line-through">₹{p.mrp || p.price}</p>
                          <p className="text-lg font-bold text-text-primary font-mono">{formatCurrency(p.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-text-muted">Stock</p>
                          <p className="font-semibold text-text-primary">{p.stock}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          icon={Edit2}
                          onClick={() => handleOpenEdit(p)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(p._id)}
                          className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      {/* Bulk CSV Import Modal */}
      <Modal isOpen={activeModal === 'bulk'} onClose={() => setActiveModal(null)} title="Bulk Import Products" size="lg">
        <form onSubmit={handleBulkImport} className="space-y-4">
          <p className="text-sm text-text-secondary">
            Paste CSV formatted text or JSON array to bulk upload products into inventory.
          </p>

          <div className="p-4 rounded-lg bg-surface-100 border border-surface-200 font-mono text-xs text-text-secondary space-y-1">
            <span className="text-brand-600 font-semibold block">CSV Format Sample:</span>
            <code>Name,Brand,Category,SKU,MRP,Price,Stock,Warranty</code><br/>
            <code>Havells Fan,Havells,Ceiling Fans,HAV-101,3500,2999,20,2 Years Warranty</code>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">CSV / JSON Payload</label>
            <textarea
              rows={6}
              required
              value={bulkCsvText}
              onChange={(e) => setBulkCsvText(e.target.value)}
              placeholder="Paste CSV lines or JSON array here..."
              className="input font-mono text-xs"
            />
          </div>

          {bulkResult && (
            <div className="p-3 rounded-lg bg-surface-100 border border-surface-200 text-xs font-semibold">
              {bulkResult}
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={bulkLoading || !bulkCsvText.trim()}
            >
              {bulkLoading ? 'Importing...' : 'Import Products'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create / Edit Modal with Multi-Image Support */}
      <Modal isOpen={activeModal === 'create' || activeModal === 'edit'} onClose={() => setActiveModal(null)} title={activeModal === 'create' ? 'Create Product' : 'Edit Product'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Brand"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              options={brands.map((b) => ({ value: b, label: b }))}
            />
            <Select
              label="Category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categories.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="SKU Code"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="SKU-123456"
              className="font-mono"
            />
            <Input
              label="MRP (₹)"
              type="number"
              min="0"
              required
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              placeholder="0"
            />
            <Input
              label="Selling Price (₹)"
              type="number"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Stock Quantity"
              type="number"
              min="0"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* DYNAMIC PRODUCT IMAGES SECTION (Max 3 Images) */}
          <div className="space-y-3 pt-2 border-t border-surface-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-text-primary">
                  Product Images <span className="text-text-muted text-xs font-normal">(Up to 3 external URLs)</span>
                </label>
                <p className="text-[11px] text-text-secondary">Paste direct HTTP/HTTPS image links for product gallery</p>
              </div>

              {imageUrls.length < 3 && (
                <button
                  type="button"
                  onClick={addImageField}
                  className="px-3 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-bold transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Image</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-surface-50 border border-surface-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-brand-500" />
                      <span>Image URL {idx + 1}</span>
                      {idx === 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 text-[10px] font-bold">
                          Primary Card Image
                        </span>
                      )}
                    </span>

                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(idx)}
                        className="text-xs text-danger-600 hover:text-danger-700 font-semibold flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChangeAt(idx, e.target.value)}
                    placeholder={`https://example.com/images/product-image-${idx + 1}.jpg`}
                  />

                  {/* Live Thumbnail Preview */}
                  {url.trim().length > 0 && (
                    <div className="relative h-28 w-full rounded-lg bg-white border border-surface-200 p-2 flex items-center justify-center overflow-hidden">
                      {!previewErrors[idx] ? (
                        <div className="relative h-full flex items-center justify-center">
                          <img
                            src={url.trim()}
                            alt={`Preview ${idx + 1}`}
                            onError={() => setPreviewErrorFor(idx, true)}
                            onLoad={() => setPreviewErrorFor(idx, false)}
                            className="max-h-full max-w-full object-contain"
                          />
                          <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-bold flex items-center gap-1 shadow-xs">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Preview</span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-rose-500 text-xs font-semibold px-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Image unavailable or blocked by external host. You can still save or replace this link.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description..."
              className="input"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Save Product
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
