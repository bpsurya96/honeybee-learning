const fs = require('fs');
let page = fs.readFileSync('src/app/admin/orders/page.tsx', 'utf8');

// 1. Add fields to query
page = page.replace(
  'total_amount,\n      created_at,',
  'total_amount,\n      notes,\n      age_group,\n      created_at,'
);

// 2. Add Export button
page = page.replace(
  '<h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>\n          </div>',
  `<h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
            <a href="/api/admin/orders/export" className="inline-flex bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </a>
          </div>`
);

// 3. Add Notes indicator
page = page.replace(
  '<td className="p-4">\n                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">\n                        {order.status.replace(/_/g, \' \')}\n                      </span>\n                      {order.order_modification_requests.length > 0 && (\n                        <div className="text-xs font-bold text-red-500 mt-1">Mods: {order.order_modification_requests.length}</div>\n                      )}\n                    </td>',
  `<td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      {order.notes && (
                        <div className="text-xs font-bold text-slate-500 mt-1">📝 Has Notes</div>
                      )}
                      {order.order_modification_requests.length > 0 && (
                        <div className="text-xs font-bold text-red-500 mt-1">Mods: {order.order_modification_requests.length}</div>
                      )}
                    </td>`
);

// 4. Fix broken characters
page = page.replace(/ðŸ  /g, '🐝');
page = page.replace(/â‚¹/g, '₹');

fs.writeFileSync('src/app/admin/orders/page.tsx', page, 'utf8');
console.log("Updated admin orders list page");
