# 五险一金计算器 Web 应用 — 项目上下文中枢

## 项目目标

构建一个迷你"五险一金"计算器 Web 应用。核心功能：根据员工工资数据和城市社保标准，计算公司为每位员工应缴纳的社保公积金费用，并清晰展示结果。当前以佛山为默认城市，架构需支持未来扩展到其他城市。

## 技术栈

- **前端框架**: Next.js (App Router)
- **UI/样式**: Tailwind CSS
- **数据库/后端**: Supabase (PostgreSQL + REST API + Auth)
- **Excel 解析**: xlsx (SheetJS) 库
- **部署目标**: 本地开发为主，后续考虑 Vercel

## 数据库设计 (Supabase)

### cities (城市社保标准表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键，自增 |
| city_name | text | 城市名，如 "佛山" |
| year | text | 年份，如 "2024" |
| base_min | int | 社保基数下限 |
| base_max | int | 社保基数上限 |
| rate | float | 简化综合缴纳比例，如 0.15 |

### salaries (员工工资表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键，自增 |
| employee_id | text | 员工工号 |
| employee_name | text | 员工姓名 |
| month | text | 年份月份，YYYYMM 格式 |
| salary_amount | int | 该月工资金额 |

### results (计算结果表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键，自增 |
| employee_id | text | 员工工号 |
| employee_name | text | 员工姓名 |
| avg_salary | float | 年度月平均工资 |
| contribution_base | float | 最终缴费基数 |
| company_fee | float | 公司缴纳金额 |

## 核心业务逻辑

计算函数执行步骤：

1. 从 `salaries` 表读取所有数据
2. 按 `employee_name` 分组，对每位员工所有月份的 `salary_amount` 求平均值，得到"年度月平均工资"
3. 从 `cities` 表获取佛山标准（当前默认城市）：`year`、`base_min`、`base_max`、`rate`
4. 对每位员工，将月平均工资与基数上下限比较：
   - 低于 `base_min` → 缴费基数 = `base_min`
   - 高于 `base_max` → 缴费基数 = `base_max`
   - 在中间 → 缴费基数 = 月平均工资本身
5. 公司缴纳金额 = 缴费基数 × `rate`
6. 将结果（employee_id、姓名、平均工资、缴费基数、公司缴纳金额）写入 `results` 表

**扩展性设计**：计算函数接收城市名参数，默认为"佛山"，未来可传入其他城市名。

## 前端页面设计

### `/` 主页 — 导航中枢

- 两个功能卡片，垂直或并排排列
- 卡片一："数据上传" → 点击跳转 `/upload`
- 卡片二："结果查询" → 点击跳转 `/results`
- 风格：简洁卡片，有标题和简要说明

### `/upload` 数据上传与操作页

- 按钮"上传数据"：选择本地 Excel 文件上传
  - 两个独立的 Excel 文件，分别对应 cities 和 salaries
  - sheet 命名与文件名一致（如 cities.xlsx 中 sheet 名为 cities）
  - 解析后向 Supabase 对应表插入数据
- 按钮"执行计算并存储结果"：触发核心计算逻辑，结果写入 results 表

### `/results` 结果查询与展示页

- 页面加载时自动从 Supabase `results` 表获取所有数据
- Tailwind CSS 表格展示，表头与 results 字段一一对应
- 支持排序（按各列升降序）和筛选（按姓名、工号等）

## Todolist — 分步开发任务

### Phase 1: 项目初始化与环境搭建 ✅

- [x] 1.1 使用 create-next-app 初始化 Next.js 项目 (App Router, Tailwind CSS)
- [x] 1.2 安装依赖：@supabase/supabase-js、xlsx
- [ ] 1.3 创建 .env.local，配置 Supabase URL 和 anon key
- [ ] 1.4 创建 lib/supabase.ts，初始化 Supabase 客户端

### Phase 2: Supabase 数据库建表

- [ ] 2.1 在 Supabase Dashboard 中创建 cities 表
- [ ] 2.2 在 Supabase Dashboard 中创建 salaries 表
- [ ] 2.3 在 Supabase Dashboard 中创建 results 表
- [ ] 2.4 确认表结构与需求一致，记录建表 SQL 语句备用

### Phase 3: 核心业务逻辑实现

- [ ] 3.1 创建 lib/calculate.ts，实现核心计算函数
- [ ] 3.2 函数签名：接收城市名参数（默认"佛山"），返回计算结果数组
- [ ] 3.3 实现计算步骤
- [ ] 3.4 编写测试数据验证计算逻辑正确性

### Phase 4: Excel 解析功能

- [ ] 4.1 创建 lib/parseExcel.ts，实现 Excel 文件解析
- [ ] 4.2 支持解析 cities.xlsx
- [ ] 4.3 支持解析 salaries.xlsx
- [ ] 4.4 处理数据类型转换和异常数据

### Phase 5: API 路由开发

- [ ] 5.1 创建 app/api/upload/route.ts
- [ ] 5.2 创建 app/api/calculate/route.ts
- [ ] 5.3 创建 app/api/results/route.ts

### Phase 6: 前端页面开发

- [ ] 6.1 创建 app/layout.tsx — 根布局
- [ ] 6.2 创建 app/page.tsx — 主页
- [ ] 6.3 创建 components/NavCard.tsx
- [ ] 6.4 创建 app/upload/page.tsx — 上传页
- [ ] 6.5 创建 app/results/page.tsx — 结果页
- [ ] 6.6 创建 components/ResultsTable.tsx

### Phase 7: 联调与完善

- [ ] 7.1 全流程联调
- [ ] 7.2 排序和筛选功能验证
- [ ] 7.3 样式打磨
- [ ] 7.4 错误处理
- [ ] 7.5 加载状态 UI 反馈