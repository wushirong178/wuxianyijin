import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 获取筛选参数
    const employeeName = searchParams.get('employeeName')
    const employeeId = searchParams.get('employeeId')

    // 获取排序参数
    const sortField = searchParams.get('sortField') || 'employee_name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // 构建查询
    let query = supabase
      .from('results')
      .select('*')

    // 应用筛选
    if (employeeName) {
      query = query.ilike('employee_name', `%${employeeName}%`)
    }
    if (employeeId) {
      query = query.ilike('employee_id', `%${employeeId}%`)
    }

    // 应用排序
    query = query.order(sortField, { ascending: sortOrder === 'asc' })

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : '查询失败' },
      { status: 500 }
    )
  }
}