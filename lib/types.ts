// 数据类型定义

export interface City {
  id: number
  city_name: string
  year: string
  base_min: number
  base_max: number
  rate: number
}

export interface Salary {
  id: number
  employee_id: string
  employee_name: string
  month: string
  salary_amount: number
}

export interface Result {
  id: number
  employee_id: string
  employee_name: string
  avg_salary: number
  contribution_base: number
  company_fee: number
}

// 用于插入的结果数据
export interface ResultInput {
  employee_id: string
  employee_name: string
  avg_salary: number
  contribution_base: number
  company_fee: number
}