import { NextRequest, NextResponse } from 'next/server'
import { parseExcelFile, insertToSupabase } from '@/lib/parseExcel'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: '未提供文件' },
        { status: 400 }
      )
    }

    // 解析 Excel 文件
    const parseResult = await parseExcelFile(file)

    if (!parseResult.success || !parseResult.data || !parseResult.tableName) {
      return NextResponse.json(
        { success: false, error: parseResult.error },
        { status: 400 }
      )
    }

    // 先清空该表的旧数据
    const { supabase } = await import('@/lib/supabase')
    await supabase.from(parseResult.tableName).delete().neq('id', 0)

    // 插入新数据
    const insertResult = await insertToSupabase(
      parseResult.tableName,
      parseResult.data
    )

    if (!insertResult.success) {
      return NextResponse.json(
        { success: false, error: insertResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `成功上传 ${insertResult.count} 条数据到 ${parseResult.tableName} 表`,
      tableName: parseResult.tableName,
      count: insertResult.count
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : '上传失败' },
      { status: 500 }
    )
  }
}