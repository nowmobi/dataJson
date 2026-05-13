const fs = require('fs');

console.log('验证各文件分类分布...\n');

for (let i = 1; i <= 20; i++) {
    const fileName = `db${i}.json`;
    const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    
    // 统计分类
    const categoryCount = {};
    data.forEach(item => {
        const cat = item.category || 'unknown';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    console.log(`${fileName} (${data.length}条):`);
    Object.keys(categoryCount).sort().forEach(cat => {
        console.log(`  ${cat}: ${categoryCount[cat]}`);
    });
    console.log('');
}

// 检查重复率
console.log('\n检查重复率...');
const allIds = new Set();
let totalItems = 0;
let duplicateCount = 0;

for (let i = 1; i <= 20; i++) {
    const data = JSON.parse(fs.readFileSync(`db${i}.json`, 'utf8'));
    totalItems += data.length;
    
    data.forEach(item => {
        if (allIds.has(item.id)) {
            duplicateCount++;
        } else {
            allIds.add(item.id);
        }
    });
}

const duplicateRate = ((duplicateCount / totalItems) * 100).toFixed(2);
console.log(`总数据量: ${totalItems} 条`);
console.log(`唯一ID数: ${allIds.size}`);
console.log(`重复数量: ${duplicateCount}`);
console.log(`重复率: ${duplicateRate}%`);
