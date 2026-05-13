const fs = require('fs');

console.log('所有20个文件的分类分布:\n');
console.log('='.repeat(80));

for (let i = 1; i <= 20; i++) {
    const fileName = `db${i}.json`;
    const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    
    // 统计分类
    const categoryCount = {};
    data.forEach(item => {
        const cat = item.category || 'unknown';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    console.log(`\n${fileName} (${data.length}条):`);
    console.log('-'.repeat(60));
    
    // 按分类名称排序显示
    Object.keys(categoryCount).sort().forEach(cat => {
        const count = categoryCount[cat];
        const percentage = ((count / data.length) * 100).toFixed(1);
        const bar = '█'.repeat(Math.floor(count / 2));
        console.log(`  ${cat.padEnd(12)}: ${count.toString().padStart(3)} 条 (${percentage}%) ${bar}`);
    });
}

console.log('\n' + '='.repeat(80));
console.log('\n图例说明:');
console.log('- 每个文件都包含7个分类: action, adventure, girl, kids, puzzle, racing, sports');
console.log('- 由于源数据中puzzle最多(91条)，所以各文件中puzzle占比最高');
console.log('- girl和sports在源数据中只有5条，所以占比较低');
