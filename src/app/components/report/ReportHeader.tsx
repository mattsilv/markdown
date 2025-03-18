"use client";

interface ReportHeaderProps {
  title: string;
  date: string;
}

export default function ReportHeader({ title, date }: ReportHeaderProps) {
  return (
    <div className="report-header text-center mb-8 print:mb-12">
      <h1 id="report-title" className="text-3xl font-bold mb-2 print:text-4xl">
        {title}
      </h1>
      <div className="subheader text-gray-600 print:text-gray-800">{date}</div>
    </div>
  );
}
