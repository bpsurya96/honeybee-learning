const fs = require('fs');
let page = fs.readFileSync('src/app/admin/orders/[orderId]/page.tsx', 'utf8');

page = page.replace('payment_status,\n      total,', 'payment_status,\n      total,\n      notes,\n      age_group,');

const newSidebarSection = `          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Order Extras</h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-slate-500 block text-xs uppercase font-bold mb-1">Age Group</span>
                <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-bold">{order.age_group || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase font-bold mb-1">Customer Notes</span>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-900 text-sm whitespace-pre-wrap">
                  {order.notes || 'No notes provided.'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Personalisation Data</h3>`;

page = page.replace(/<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">\s+<h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Personalisation Data<\/h3>/, newSidebarSection);

page = page.replace(/â† /g, '←');
page = page.replace(/â€¢/g, '•');

fs.writeFileSync('src/app/admin/orders/[orderId]/page.tsx', page, 'utf8');
console.log("Updated order detail page");
