import { NextRequest, NextResponse } from 'next/server'
import { calculateAndStore } from '@/lib/calculate'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const cityName = body.cityName || '佛山'

    const result = await calculateAndStore(cityName)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        resultsCount: result.resultsCount
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error || result.message },
        { status: 400 }
      )
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : '计算失败' },
      { status: 500 }
    )
  }
}