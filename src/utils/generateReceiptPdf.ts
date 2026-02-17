export const generateReceiptPdf = (receipt: {
  transactionId: string;
  amount: number;
  billNumber: string;
  billingMonth: string;
  paymentMethod: string;
  date: string;
}) => {
  const html = `
    <html>
    <head>
      <title>Payment Receipt - ${receipt.transactionId}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body { padding: 40px; color: #1a1a2e; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #3b82f6; }
        .logo span { color: #10b981; }
        .receipt-title { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px; }
        .txn-id { font-size: 14px; font-weight: bold; margin-top: 4px; color: #333; }
        .success-banner { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
        .success-banner h2 { font-size: 22px; margin-bottom: 4px; }
        .success-banner p { opacity: 0.9; font-size: 14px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
        .info-box { padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
        .info-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
        .info-value { font-size: 16px; font-weight: 600; }
        .amount-box { padding: 24px; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 12px; text-align: center; margin-bottom: 30px; }
        .amount-label { font-size: 14px; opacity: 0.9; }
        .amount-value { font-size: 40px; font-weight: bold; margin-top: 4px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #999; font-size: 12px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">⚡ Esya<span>soft</span></div>
          <p style="font-size: 12px; color: #666; margin-top: 4px;">Smart Energy Management</p>
        </div>
        <div style="text-align: right;">
          <div class="receipt-title">Payment Receipt</div>
          <div class="txn-id">${receipt.transactionId}</div>
        </div>
      </div>

      <div class="success-banner">
        <h2>✓ Payment Successful</h2>
        <p>Your payment has been processed successfully</p>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Bill Number</div>
          <div class="info-value">${receipt.billNumber}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Billing Month</div>
          <div class="info-value">${receipt.billingMonth}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Payment Method</div>
          <div class="info-value" style="text-transform: uppercase;">${receipt.paymentMethod}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Payment Date</div>
          <div class="info-value">${receipt.date}</div>
        </div>
      </div>

      <div class="amount-box">
        <div class="amount-label">Amount Paid</div>
        <div class="amount-value">₹${Number(receipt.amount).toFixed(2)}</div>
      </div>

      <div class="footer">
        <p>This is a computer-generated receipt and does not require a signature.</p>
        <p style="margin-top: 8px;">© 2024 Esyasoft Energy • support@esyasoft.com</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  }
};
