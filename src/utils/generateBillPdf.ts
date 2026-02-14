export const generateBillPdf = (bill: any) => {
  const html = `
    <html>
    <head>
      <title>Bill - ${bill.bill_number}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body { padding: 40px; color: #1a1a2e; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #3b82f6; }
        .logo span { color: #10b981; }
        .bill-title { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px; }
        .bill-number { font-size: 18px; font-weight: bold; margin-top: 4px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-box { padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
        .info-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
        .info-value { font-size: 16px; font-weight: 600; }
        .total-box { padding: 20px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border-radius: 12px; text-align: center; margin: 30px 0; }
        .total-label { font-size: 14px; opacity: 0.9; }
        .total-amount { font-size: 36px; font-weight: bold; margin-top: 4px; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .status-paid { background: #dcfce7; color: #16a34a; }
        .status-unpaid { background: #fee2e2; color: #dc2626; }
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
          <div class="bill-title">Electricity Bill</div>
          <div class="bill-number">${bill.bill_number}</div>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Billing Month</div>
          <div class="info-value">${bill.billing_month}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Due Date</div>
          <div class="info-value">${new Date(bill.due_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Units Consumed</div>
          <div class="info-value">${Number(bill.units_consumed).toLocaleString()} kWh</div>
        </div>
        <div class="info-box">
          <div class="info-label">Status</div>
          <div class="info-value"><span class="status ${bill.status === 'paid' ? 'status-paid' : 'status-unpaid'}">${bill.status}</span></div>
        </div>
      </div>

      <div class="total-box">
        <div class="total-label">Total Amount</div>
        <div class="total-amount">₹${Number(bill.amount).toFixed(2)}</div>
      </div>

      <div class="footer">
        <p>This is a computer-generated bill and does not require a signature.</p>
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
