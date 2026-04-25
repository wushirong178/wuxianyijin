"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Result } from "@/lib/types";

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 筛选状态
  const [filterName, setFilterName] = useState("");
  const [filterId, setFilterId] = useState("");

  // 排序状态
  const [sortField, setSortField] = useState("employee_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 获取数据
  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filterName) params.append("employeeName", filterName);
      if (filterId) params.append("employeeId", filterId);
      params.append("sortField", sortField);
      params.append("sortOrder", sortOrder);

      const response = await fetch(`/api/results?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setResults(result.data);
      } else {
        setError(result.error || "获取数据失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取数据失败");
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchResults();
  }, [sortField, sortOrder]);

  // 应用筛选
  const handleFilter = () => {
    fetchResults();
  };

  // 清空筛选
  const handleClearFilter = () => {
    setFilterName("");
    setFilterId("");
    fetchResults();
  };

  // 排序切换
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // 格式化金额
  const formatMoney = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">计算结果</h1>
            <p className="text-sm text-gray-500 mt-1">员工社保公积金计算结果</p>
          </div>
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            返回首页
          </Link>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8">
        {/* 筛选区域 */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                员工姓名
              </label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="输入姓名筛选"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                员工工号
              </label>
              <input
                type="text"
                value={filterId}
                onChange={(e) => setFilterId(e.target.value)}
                placeholder="输入工号筛选"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFilter}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                筛选
              </button>
              <button
                onClick={handleClearFilter}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
              >
                清空
              </button>
            </div>
          </div>
        </div>

        {/* 表格区域 */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">加载中...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              暂无数据，请先上传数据并执行计算
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort("employee_id")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    工号
                    {sortField === "employee_id" && (
                      <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort("employee_name")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    姓名
                    {sortField === "employee_name" && (
                      <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort("avg_salary")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    月平均工资
                    {sortField === "avg_salary" && (
                      <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort("contribution_base")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    缴费基数
                    {sortField === "contribution_base" && (
                      <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort("company_fee")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    公司缴纳金额
                    {sortField === "company_fee" && (
                      <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.employee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.employee_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{formatMoney(result.avg_salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{formatMoney(result.contribution_base)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      ¥{formatMoney(result.company_fee)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 统计 */}
        {!loading && !error && results.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            共 {results.length} 条记录
          </div>
        )}
      </main>
    </div>
  );
}