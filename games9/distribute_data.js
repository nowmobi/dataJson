const fs = require('fs');

console.log('开始读取数据...');
const sourceData = JSON.parse(fs.readFileSync('games9-data.json', 'utf8'));
console.log(`总数据量: ${sourceData.length}`);

// 按分类分组
const categoryMap = {};
sourceData.forEach(item => {
    const cat = item.category || 'unknown';
    if (!categoryMap[cat]) {
        categoryMap[cat] = [];
    }
    categoryMap[cat].push(item);
});

console.log('\n分类统计:');
Object.keys(categoryMap).forEach(cat => {
    console.log(`  ${cat}: ${categoryMap[cat].length} 条`);
});

const fileCount = 20;
const minPerFile = 80;
const maxPerFile = 90;
const categories = Object.keys(categoryMap);

// 策略：
// 1. 先创建一个基础数据集（所有文件共享的核心数据）
// 2. 每个文件在基础数据上添加少量独特数据
// 3. 这样文件之间就会有高重复率（约80%）

console.log('\n生成基础共享数据集...');

// 计算基础数据集大小（约80%的文件大小）
const avgFileSize = (minPerFile + maxPerFile) / 2; // 85
const baseDataCount = Math.floor(avgFileSize * 0.8); // 约68条作为基础数据

// 创建基础数据集 - 确保每个分类都有代表
const baseData = [];
const baseIds = new Set();

// 首先确保每个分类在基础数据中都有代表
categories.forEach(cat => {
    const items = categoryMap[cat];
    // 按比例分配
    const countForCat = Math.max(1, Math.floor(baseDataCount * (items.length / sourceData.length)));
    
    let added = 0;
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    for (const item of shuffled) {
        if (added >= countForCat) break;
        if (!baseIds.has(item.id)) {
            baseData.push(item);
            baseIds.add(item.id);
            added++;
        }
    }
});

// 填充到目标数量
while (baseData.length < baseDataCount) {
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const items = categoryMap[randomCat];
    const item = items[Math.floor(Math.random() * items.length)];
    if (!baseIds.has(item.id)) {
        baseData.push(item);
        baseIds.add(item.id);
    }
}

console.log(`基础数据集大小: ${baseData.length} 条`);

console.log('\n开始生成文件...\n');

// 为每个文件生成数据
for (let fileIdx = 0; fileIdx < fileCount; fileIdx++) {
    const count = Math.floor(Math.random() * (maxPerFile - minPerFile + 1)) + minPerFile;
    const fileData = [...baseData]; // 复制基础数据
    const usedIds = new Set([...baseIds]);
    
    // 添加独特数据（约20%）
    const uniqueCount = count - baseData.length;
    
    // 按分类分配独特数据
    const uniquePerCategory = Math.floor(uniqueCount / categories.length);
    let remainingCount = uniqueCount - (uniquePerCategory * categories.length);
    
    categories.forEach(cat => {
        const items = categoryMap[cat];
        let countForThisCat = uniquePerCategory;
        
        if (remainingCount > 0 && Math.random() > 0.5) {
            countForThisCat++;
            remainingCount--;
        }
        
        // 从该分类中选择独特数据
        let added = 0;
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        
        for (const item of shuffled) {
            if (added >= countForThisCat) break;
            if (!usedIds.has(item.id)) {
                fileData.push(item);
                usedIds.add(item.id);
                added++;
            }
        }
    });
    
    // 如果还不够，继续随机添加（允许重复使用基础数据）
    while (fileData.length < count) {
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        const items = categoryMap[randomCat];
        const item = items[Math.floor(Math.random() * items.length)];
        fileData.push(item);
    }
    
    // 打乱顺序
    for (let i = fileData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fileData[i], fileData[j]] = [fileData[j], fileData[i]];
    }
    
    // 写入文件
    const fileName = `db${fileIdx + 1}.json`;
    fs.writeFileSync(fileName, JSON.stringify(fileData, null, 4), 'utf8');
    console.log(`✓ ${fileName}: ${fileData.length} 条`);
}

console.log('\n完成！所有文件已生成。');
console.log(`\n说明：`);
console.log(`- 每个文件包含 ${baseData.length} 条共享基础数据（约80%）`);
console.log(`- 其余为各文件的独特数据（约20%）`);
console.log(`- 文件之间的重复率约为 80%`);
