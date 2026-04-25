import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">五险一金计算器</h1>
          <p className="text-sm text-gray-500 mt-1">员工社保公积金费用计算工具</p>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* 数据上传卡片 */}
          <Link
            href="/upload"
            className="block bg-white rounded-lg shadow-md border border-gray-200 p-8 hover:shadow-lg hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">数据上传</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              上传城市社保标准（cities.xlsx）和员工工资数据（salaries.xlsx），为计算准备基础数据。
            </p>
            <div className="mt-4 text-blue-500 text-sm font-medium group-hover:text-blue-600">
              点击进入 →
            </div>
          </Link>

          {/* 结果查询卡片 */}
          <Link
            href="/results"
            className="block bg-white rounded-lg shadow-md border border-gray-200 p-8 hover:shadow-lg hover:border-green-300 transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">结果查询</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              查看计算结果，包括员工的月平均工资、缴费基数和公司应缴纳金额，支持排序和筛选。
            </p>
            <div className="mt-4 text-green-500 text-sm font-medium group-hover:text-green-600">
              点击进入 →
            </div>
          </Link>
        </div>

        {/* 使用说明 */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">使用流程</h3>
          <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>上传数据文件</span>
            </div>
            <div className="hidden md:block text-gray-300">→</div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>执行计算</span>
            </div>
            <div className="hidden md:block text-gray-300">→</div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>查看结果</span>
            </div>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        五险一金计算器 © 2024
      </footer>
    </div>
  );
}