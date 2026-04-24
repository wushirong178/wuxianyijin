import { supabase } from './supabase'
import { Salary, City, ResultInput } from './types'

interface CalculateResult {
  success: boolean
  message: string
  resultsCount?: number
  error?: string
}

/**
 * 核心计算函数
 * @param cityName 城市名，默认为"佛山"
 * @returns 计算结果信息
 */
export async function calculateAndStore(cityName: string = '佛山'): Promise<CalculateResult> {
  try {
    // 1. 从 salaries 表读取所有数据
    const { data: salaries, error: salariesError } = await supabase
      .from('salaries')
      .select('*')

    if (salariesError) {
      return { success: false, message: '读取工资数据失败', error: salariesError.message }
    }

    if (!salaries || salaries.length === 0) {
      return { success: false, message: '工资表中没有数据' }
    }

    // 2. 从 cities 表获取城市标准
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .eq('city_name', cityName)
      .single()

    if (citiesError) {
      return { success: false, message: '读取城市标准失败', error: citiesError.message }
    }

    if (!cities) {
      return { success: false, message: `未找到城市 ${cityName} 的社保标准` }
    }

    const city: City = cities

    // 3. 按员工分组，计算月平均工资
    const employeeMap = new Map<string, { employee_id: string; employee_name: string; salaries: number[] }>()

    for (const salary of salaries as Salary[]) {
      const key = salary.employee_id
      if (!employeeMap.has(key)) {
        employeeMap.set(key, {
          employee_id: salary.employee_id,
          employee_name: salary.employee_name,
          salaries: []
        })
      }
      employeeMap.get(key)!.salaries.push(salary.salary_amount)
    }

    // 4. 计算每位员工的缴费基数和公司缴纳金额
    const results: ResultInput[] = []

    for (const [employeeId, data] of employeeMap) {
      // 计算月平均工资
      const avgSalary = data.salaries.reduce((sum, s) => sum + s, 0) / data.salaries.length

      // 确定缴费基数
      let contributionBase: number
      if (avgSalary < city.base_min) {
        contributionBase = city.base_min
      } else if (avgSalary > city.base_max) {
        contributionBase = city.base_max
      } else {
        contributionBase = avgSalary
      }

      // 计算公司缴纳金额
      const companyFee = contributionBase * city.rate

      results.push({
        employee_id: employeeId,
        employee_name: data.employee_name,
        avg_salary: avgSalary,
        contribution_base: contributionBase,
        company_fee: companyFee
      })
    }

    // 5. 清空旧结果并插入新结果
    const { error: deleteError } = await supabase
      .from('results')
      .delete()
      .neq('id', 0) // 删除所有记录

    if (deleteError) {
      return { success: false, message: '清空旧结果失败', error: deleteError.message }
    }

    const { error: insertError } = await supabase
      .from('results')
      .insert(results)

    if (insertError) {
      return { success: false, message: '插入计算结果失败', error: insertError.message }
    }

    return {
      success: true,
      message: `计算完成，已存储 ${results.length} 条结果`,
      resultsCount: results.length
    }
  } catch (err) {
    return {
      success: false,
      message: '计算过程发生异常',
      error: err instanceof Error ? err.message : '未知错误'
    }
  }
}