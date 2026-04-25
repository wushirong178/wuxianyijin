"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [calculateStatus, setCalculateStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [calculateError, setCalculateError] = useState<string | null>(null);

  const citiesFileRef = useRef<HTMLInputElement>(null);
  const salariesFileRef = useRef<HTMLInputElement>(null);

  const handleUploadCities = async () => {
    const fileInput = citiesFileRef.current;
    if (!fileInput?.files?.[0]) {
      setUploadError("请先选择 cities.xlsx 文件");
      return;
    }

    setUploading(true);
    setUploadStatus(null);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus(result.message);
      } else {
        setUploadError(result.error || "上传失败");
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadSalaries = async () => {
    const fileInput = salariesFileRef.current;
    if (!fileInput?.files?.[0]) {
      setUploadError("请先选择 salaries.xlsx 文件");
      return;
    }

    setUploading(true);
    setUploadStatus(null);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus(result.message);
      } else {
        setUploadError(result.error || "上传失败");
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    setCalculateStatus(null);
    setCalculateError(null);

    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cityName: "佛山" }),
      });

      const result = await response.json();

      if (result.success) {
        setCalculateStatus(result.message);
      } else {
        setCalculateError(result.error || "计算失败");
      }
    } catch (err) {
      setCalculateError(err instanceof Error ? err.message : "计算失败");
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">数据上传</h1>
            <p className="text-sm text-gray-500 mt-1">上传数据并执行计算</p>
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
      <main className="flex-1 max-w-4xl mx-auto px-6 py-8">
        {/* 上传区域 */}
        <section className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">上传数据文件</h2>

          {/* Cities 上传 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              城市社保标准文件 (cities.xlsx)
            </label>
            <div className="flex gap-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                ref={citiesFileRef}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
              <button
                onClick={handleUploadCities}
                disabled={uploading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? "上传中..." : "上传"}
              </button>
            </div>
          </div>

          {/* Salaries 上传 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              员工工资文件 (salaries.xlsx)
            </label>
            <div className="flex gap-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                ref={salariesFileRef}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
              <button
                onClick={handleUploadSalaries}
                disabled={uploading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? "上传中..." : "上传"}
              </button>
            </div>
          </div>

          {/* 上传状态 */}
          {uploadStatus && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {uploadStatus}
            </div>
          )}
          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {uploadError}
            </div>
          )}
        </section>

        {/* 计算区域 */}
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">执行计算</h2>
          <p className="text-sm text-gray-600 mb-4">
            根据上传的数据，计算每位员工的社保公积金缴纳金额（当前城市：佛山）
          </p>
          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {calculating ? "计算中..." : "执行计算并存储结果"}
          </button>

          {/* 计算状态 */}
          {calculateStatus && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {calculateStatus}
            </div>
          )}
          {calculateError && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {calculateError}
            </div>
          )}
        </section>

        {/* 说明 */}
        <div className="mt-6 text-sm text-gray-500">
          <p className="mb-2">文件格式说明：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>cities.xlsx：包含城市社保标准数据，sheet 名称应为 "cities"</li>
            <li>salaries.xlsx：包含员工工资数据，sheet 名称应为 "salaries"</li>
          </ul>
        </div>
      </main>
    </div>
  );
}