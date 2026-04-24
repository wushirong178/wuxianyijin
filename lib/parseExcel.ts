import * as XLSX from 'xlsx'
import { City, Salary } from './types'

interface ParseResult {
  success: boolean
  data?: City[] | Salary[]
  error?: string
  tableName?: string
}

/**
 * 规范化字段名（去除空格、处理拼写容错）
 */
function normalizeField(row: any, fieldName: string): any {
  // 直接匹配
  if (row[fieldName] !== undefined) return row[fieldName]

  // 尝试去除空格匹配
  for (const key of Object.keys(row)) {
    const normalizedKey = key.trim().toLowerCase()
    if (normalizedKey === fieldName.toLowerCase()) {
      return row[key]
    }
    // 处理常见拼写错误
    if (fieldName === 'city_name' && normalizedKey.includes('city') && normalizedKey.includes('nam')) {
      return row[key]
    }
  }

  return undefined
}

/**
 * 解析 Excel 文件
 * @param file Excel 文件 (cities.xlsx 或 salaries.xlsx)
 * @returns 解析结果
 */
export async function parseExcelFile(file: File): Promise<ParseResult> {
  try {
    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })

    // 获取第一个 sheet 名称（应与文件名一致）
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    // 转换为 JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet)

    // 根据文件名判断表类型
    const fileName = file.name.toLowerCase()

    if (fileName.includes('cities')) {
      const cities: City[] = jsonData.map((row: any) => ({
        id: normalizeField(row, 'id') || undefined,
        city_name: String(normalizeField(row, 'city_name') || ''),
        year: String(normalizeField(row, 'year') || ''),
        base_min: Number(normalizeField(row, 'base_min') || 0),
        base_max: Number(normalizeField(row, 'base_max') || 0),
        rate: Number(normalizeField(row, 'rate') || 0)
      }))

      return { success: true, data: cities, tableName: 'cities' }
    }

    if (fileName.includes('salaries')) {
      const salaries: Salary[] = jsonData.map((row: any) => ({
        id: normalizeField(row, 'id') || undefined,
        employee_id: String(normalizeField(row, 'employee_id') || ''),
        employee_name: String(normalizeField(row, 'employee_name') || ''),
        month: String(normalizeField(row, 'month') || ''),
        salary_amount: Number(normalizeField(row, 'salary_amount') || 0)
      }))

      return { success: true, data: salaries, tableName: 'salaries' }
    }

    return { success: false, error: '无法识别文件类型，请上传 cities.xlsx 或 salaries.xlsx' }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Excel 解析失败'
    }
  }
}

/**
 * 批量插入数据到 Supabase
 */
export async function insertToSupabase(
  tableName: string,
  data: City[] | Salary[]
): Promise<{ success: boolean; count?: number; error?: string }> {
  const { supabase } = await import('./supabase')

  // 移除 id 字段，让 Supabase 自动生成
  const insertData = data.map(item => {
    const { ...rest } = item
    return rest
  })

  const { error } = await supabase
    .from(tableName)
    .insert(insertData)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, count: data.length }
}