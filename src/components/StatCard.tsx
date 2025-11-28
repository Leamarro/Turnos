"use client";

export default function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow border">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
