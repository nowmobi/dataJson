const fs = require('fs');

console.log('验证文件之间的重复率...\n');

// 读取所有文件
const files = [];
for (let i = 1; i <= 20; i++) {
    const data = JSON.parse(fs.readFileSync(`db${i}.json`, 'utf8'));
    files.push({ name: `db${i}.json`, data: data, ids: new Set(data.map(item => item.id)) });
}

// 检查几个文件对之间的重复率
const testPairs = [
    [0, 1], [0, 5], [0, 10], [0, 15], [0, 19],
    [1, 2], [5, 10], [10, 15], [15, 19]
];

console.log('文件对之间的重复率:\n');
testPairs.forEach(([i, j]) => {
    const file1 = files[i];
    const file2 = files[j];
    
    // 计算交集
    let commonCount = 0;
    file1.ids.forEach(id => {
        if (file2.ids.has(id)) {
            commonCount++;
        }
    });
    
    // 计算重复率（相对于较小的文件）
    const minSize = Math.min(file1.data.length, file2.data.length);
    const overlapRate = ((commonCount / minSize) * 100).toFixed(2);
    
    console.log(`${file1.name} vs ${file2.name}:`);
    console.log(`  共同数据: ${commonCount} 条`);
    console.log(`  重复率: ${overlapRate}%`);
    console.log('');
});

// 统计每个文件的分类分布
console.log('\n各文件分类分布示例（前3个文件）:\n');
for (let i = 0; i < 3; i++) {
    const file = files[i];
    const categoryCount = {};
    file.data.forEach(item => {
        const cat = item.category || 'unknown';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    console.log(`${file.name} (${file.data.length}条):`);
    Object.keys(categoryCount).sort().forEach(cat => {
        console.log(`  ${cat}: ${categoryCount[cat]}`);
    });
    console.log('');
}
