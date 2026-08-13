export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Robustly extracts and normalizes product image URLs into an array of 1 to 3 valid strings.
 * Handles arrays, stringified JSON arrays, comma-separated lists, and legacy product fields.
 */
export const getProductImages = (product) => {
  if (!product) return [];

  let rawList = [];

  if (Array.isArray(product.images) && product.images.length > 0) {
    rawList = product.images;
  } else if (typeof product.images === 'string' && product.images.trim().length > 0) {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed)) rawList = parsed;
      else rawList = product.images.split(/[\n,]+/);
    } catch {
      rawList = product.images.split(/[\n,]+/);
    }
  }

  if (rawList.length === 0) {
    const single = product.imageUrl || product.image || product.image_url;
    if (typeof single === 'string' && single.trim().length > 0) {
      if (single.includes(',')) {
        rawList = single.split(',');
      } else {
        rawList = [single];
      }
    }
  }

  const cleanList = [];
  for (const item of rawList) {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed.length > 0 && !cleanList.includes(trimmed)) {
        cleanList.push(trimmed);
      }
    }
  }

  return cleanList.slice(0, 3);
};

/**
 * Validates whether a string is a valid HTTP/HTTPS URL.
 */
export const isValidHttpUrl = (str) => {
  if (typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};
