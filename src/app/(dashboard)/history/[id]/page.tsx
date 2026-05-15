import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AnalysisDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const analysis = await prisma.analysis.findFirst({
    where: {
      id: params.id,
      userId: session!.user.id,
    },
  });

  if (!analysis) notFound();

  const feedback = analysis.feedback as any;

  return (
    <div>
      <Link
        href="/history"
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={16} />
        Back to History
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis Result</h1>
          <p className="text-gray-400 mt-1">
            {new Date(analysis.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Score Circle */}
        <div
          className={`text-center px-8 py-4 rounded-xl border-2 ${
            analysis.matchScore >= 70
              ? "border-green-500 bg-green-500/10"
              : analysis.matchScore >= 40
              ? "border-yellow-500 bg-yellow-500/10"
              : "border-red-500 bg-red-500/10"
          }`}
        >
          <p className="text-4xl font-bold text-white">{analysis.matchScore}%</p>
          <p className="text-gray-400 text-sm mt-1">Match Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-400" size={20} />
            Strengths
          </h2>
          <ul className="space-y-2">
            {feedback?.strengths?.map((item: string, i: number) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <XCircle className="text-red-400" size={20} />
            Gaps / Missing Skills
          </h2>
          <ul className="space-y-2">
            {feedback?.gaps?.map((item: string, i: number) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="text-blue-400" size={20} />
            Suggestions
          </h2>
          <ul className="space-y-2">
            {feedback?.suggestions?.map((item: string, i: number) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Keywords */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">ATS Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {feedback?.keywords?.map((keyword: string, i: number) => (
              <span
                key={i}
                className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Summary */}
      {feedback?.summary && (
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-3">Overall Summary</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{feedback.summary}</p>
        </div>
      )}
    </div>
  );
}