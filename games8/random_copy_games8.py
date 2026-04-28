import json
import random

# 读取原始数据
with open('games8-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 过滤掉第一个元素（info 数组），只保留游戏数据
games_data = [item for item in data if 'id' in item]

print(f"总共有 {len(games_data)} 条游戏数据")

# 为每个 db 文件随机抽取 80-90 条数据
db_files = ['db7.json', 'db8.json', 'db9.json', 'db10.json', 'db11.json', 'db12.json']

for db_file in db_files:
    # 随机抽取 80-90 条数据
    num_items = random.randint(80, 90)
    selected_data = random.sample(games_data, num_items)
    
    # 写入到对应的文件
    with open(db_file, 'w', encoding='utf-8') as f:
        json.dump(selected_data, f, ensure_ascii=False, indent=4)
    
    print(f"已写入 {len(selected_data)} 条数据到 {db_file}")

print("\n完成！所有文件都已随机填充数据。")