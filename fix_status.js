const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    
    // Inbound.html
    content = content.replace(/\{ label: \.Status,/g, "{ label: po.Status,");
    
    // Outbound.html 
    // ${s.Status === 'PICKING' ? 'Chờ soạn hàng' : .Status === 'IN_PROGRESS' ? 'Đang soạn hàng' : .Status === 'PACKING' ? '<span class=\"text-amber-600 font-bold\">Chờ phê duyệt</span>' : .Status}
    content = content.replace(/: \.Status ===/g, ": s.Status ===");
    content = content.replace(/: \.Status\}/g, ": s.Status}");
    content = content.replace(/&& \.Status/g, "&& so.Status");
    
    // Delivery.html
    // .filter(so => so.Status === 'PACKING' || .Status === 'COMPLETED')
    content = content.replace(/\|\| \.Status ===/g, "|| so.Status ===");
    
    // QA-approval.html
    content = content.replace(/: \.Status ===/g, ": h.Status ===");
    
    // Purchase-order.html
    content = content.replace(/\{ l: \.Status,/g, "{ l: po.Status,");
    content = content.replace(/: \.Status ===/g, ": po.Status ===");
    
    // Sales-order.html
    content = content.replace(/\|\| \.Status\}/g, "|| so.Status}");
    
    fs.writeFileSync(path.join(pagesDir, file), content, 'utf8');
});
console.log('Final fixes applied.');
