import React from 'react';
import { Printer, ShieldCheck, Zap } from 'lucide-react';
import { Modal } from './Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { QRCodeGenerator } from './QRCodeGenerator';

export const PrintableInvoiceModal = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const isInterstate = invoice.isInterstate;
  const subtotal = invoice.subtotal || invoice.items.reduce((s, i) => s + (i.amount || 0), 0);
  const cgstAmt = invoice.cgstAmount || (isInterstate ? 0 : subtotal * 0.09);
  const sgstAmt = invoice.sgstAmount || (isInterstate ? 0 : subtotal * 0.09);
  const igstAmt = invoice.igstAmount || (isInterstate ? subtotal * 0.18 : 0);
  const totalTax = invoice.taxAmount || (cgstAmt + sgstAmt + igstAmt);
  const grandTotal = invoice.totalAmount || (subtotal + totalTax);

  const qrPayload = `upi://pay?pa=udayelectrical@sbi&pn=UdayElectricalWorks&am=${grandTotal}&tn=Invoice_${invoice.invoiceNumber}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Tax Invoice: ${invoice.invoiceNumber}`}>
      <div className="space-y-6 text-xs font-sans text-slate-100 print:text-black">
        
        {/* Printable Card */}
        <div id="printable-invoice" className="bg-slate-950 print:bg-white border border-slate-800 print:border-black p-6 rounded-2xl space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-800 print:border-black pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-400 print:text-black fill-current" />
                <h2 className="text-lg font-black text-white print:text-black uppercase tracking-wide">
                  UDAY ELECTRICAL WORKS
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 print:text-black mt-1">
                Govt. Licensed Industrial Electrical Contractors & Engineers
              </p>
              <p className="text-[10px] text-slate-400 print:text-black">
                Plot 42, Industrial Development Area, Balanagar, Hyderabad, TS - 500037
              </p>
              <p className="text-[10px] font-bold text-amber-400 print:text-black mt-0.5">
                GSTIN: {invoice.gstNumber || '36AAAAA0000A1Z5'}
              </p>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="px-2.5 py-1 rounded bg-amber-500/10 print:bg-gray-200 text-amber-400 print:text-black font-extrabold text-xs uppercase border border-amber-500/20">
                GST Tax Invoice
              </span>
              <p className="font-mono font-bold text-white print:text-black mt-2 text-sm">
                {invoice.invoiceNumber}
              </p>
              <p className="text-slate-400 print:text-black text-[11px]">
                Date: {formatDate(invoice.createdAt)}
              </p>
            </div>
          </div>

          {/* Customer info & QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-black">
            <div className="md:col-span-8 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 print:text-black block">Billed To Customer:</span>
              <p className="font-bold text-white print:text-black text-sm">{invoice.customer?.name}</p>
              <p className="text-slate-300 print:text-black">{invoice.customer?.address || 'Site Location, Hyderabad'}</p>
              <p className="text-slate-400 print:text-black">Phone: {invoice.customer?.phone || 'N/A'}</p>
              <p className="text-[11px] text-sky-400 print:text-black font-mono mt-1">
                Customer GSTIN: {invoice.customerGstNumber || 'URP (Unregistered Purchaser)'}
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col items-end justify-center border-t md:border-t-0 md:border-l border-slate-800 print:border-black pt-3 md:pt-0 md:pl-4">
              <QRCodeGenerator value={qrPayload} size={85} />
              <span className="text-[9px] text-slate-400 print:text-black mt-1 font-semibold">Scan to Pay via UPI</span>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 print:border-black bg-slate-900 print:bg-gray-200 text-slate-300 print:text-black font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3">HSN Code</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-black">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-3 font-semibold text-white print:text-black">{item.description}</td>
                  <td className="py-3 px-3 font-mono text-slate-400 print:text-black">{item.hsnCode || '8501'}</td>
                  <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-3 px-3 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 px-3 text-right font-bold">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* GST Calculation Ledger */}
          <div className="border-t border-slate-800 print:border-black pt-4 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 print:text-black">
                <span>Taxable Subtotal:</span>
                <span className="font-bold text-white print:text-black">{formatCurrency(subtotal)}</span>
              </div>

              {!isInterstate ? (
                <>
                  <div className="flex justify-between text-slate-400 print:text-black">
                    <span>CGST (9%):</span>
                    <span className="font-bold">{formatCurrency(cgstAmt)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 print:text-black">
                    <span>SGST (9%):</span>
                    <span className="font-bold">{formatCurrency(sgstAmt)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-400 print:text-black">
                  <span>IGST (18%):</span>
                  <span className="font-bold">{formatCurrency(igstAmt)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-800 print:border-black pt-2 text-sm font-extrabold text-amber-400 print:text-black">
                <span>Grand Total:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 print:text-black flex justify-between">
            <p>Authorized Signatory: Uday Electrical Works</p>
            <p>Computer Generated GST Tax Invoice</p>
          </div>

        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-2 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
