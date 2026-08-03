export const processAiQuery = (queryText) => {
  const q = (queryText || '').toLowerCase();

  if (q.includes('motor') && (q.includes('trip') || q.includes('heat') || q.includes('burnt'))) {
    return {
      reply: 'Motor tripping or overheating is usually caused by phase imbalance, stator winding inter-turn short circuits, or bearing failure. We recommend requesting our 3-Phase Stator Rewinding & Vacuum Pressure Impregnation (VPI) service.',
      recommendedService: 'Motor Rewinding (3-Phase Induction)',
      actionText: 'Book Stator Rewinding'
    };
  }

  if (q.includes('transformer') || q.includes('oil') || q.includes('spark') || q.includes('bdv')) {
    return {
      reply: 'Transformer sparking or dielectric degradation requires oil filtration and Break Down Voltage (BDV) testing. Uday Electrical Works performs online oil dehydration & 66kV BDV testing at your factory plant.',
      recommendedService: 'Transformer Oil Filtration & Testing',
      actionText: 'Request Oil Testing'
    };
  }

  if (q.includes('panel') || q.includes('pf') || q.includes('bill') || q.includes('power factor')) {
    return {
      reply: 'Low power factor incurs heavy electricity board penalty charges. Installing an Automatic Power Factor Correction (APFC) Panel with heavy-duty capacitor banks will optimize your power factor above 0.98 lag.',
      recommendedService: 'APFC Panel Fabrication & Installation',
      actionText: 'Inquire APFC Panel'
    };
  }

  if (q.includes('invoice') || q.includes('gst') || q.includes('pay') || q.includes('razorpay')) {
    return {
      reply: 'You can download official 18% GST tax invoices with CGST/SGST/IGST breakdown and pay directly via UPI / Razorpay in your Customer Dashboard portal.',
      recommendedService: null,
      actionText: 'Go to Invoices'
    };
  }

  return {
    reply: 'Uday Electrical Works is a Class-A licensed contractor specializing in HT/LT motor rewinding, distribution transformer overhauling, APFC panel manufacturing, and plant AMC contracts in Hyderabad.',
    recommendedService: 'General Electrical Maintenance Audit',
    actionText: 'Explore Services'
  };
};
