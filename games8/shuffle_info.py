import json
import random

# 需要处理的文件列表
db_files = ['db7.json', 'db8.json', 'db9.json', 'db10.json', 'db11.json', 'db12.json']

for db_file in db_files:
    # 读取文件
    with open(db_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if len(data) > 0:
        # 获取第一条数据
        first_item = data[0]
        
        # 提取 info1 到 info5
        info_keys = ['info1', 'info2', 'info3', 'info4', 'info5']
        info_values = [first_item[key] for key in info_keys if key in first_item]
        
        # 打乱顺序
        random.shuffle(info_values)
        
        # 重新赋值
        for i, key in enumerate(info_keys):
            if i < len(info_values):
                first_item[key] = info_values[i]
        
        # 写回文件
        with open(db_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        
        print(f"已打乱 {db_file} 第一条数据的 info 顺序")
    else:
        print(f"{db_file} 为空,跳过")

print("\n完成！所有文件的 info 顺序都已打乱。")