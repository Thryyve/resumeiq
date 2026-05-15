import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FileSearch, History, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const analyses = await prisma.analysis.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalAnalyses = await prisma.analysis.count({
    where: { userId: session!.user.id },
  });

  const avgScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((acc, a) => acc + a.matchScore, 0) / analyses.length
        )
      : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {session?.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-400 mt-1">
          Here&apos;s your resume analysis overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Total Analyses</span>
            <FileSearch className="text-blue-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{totalAnalyses}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Avg Match Score</span>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{avgScore}%</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Credits Left</span>
            <Zap className="text-yellow-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">
            {session?.user.plan === "PRO" ? "∞" : session?.user.credits}
          </p>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold">Recent Analyses</h2>
          <Link
            href="/history"
            className="text-blue-400 text-sm hover:underline"
          >
            View all
          </Link>
        </div>

        {analyses.length === 0 ? (
          <div className="text-center py-12">
            <FileSearch className="text-gray-600 mx-auto mb-3" size={40} />
            <p className="text-gray-400">No analyses yet</p>
            <Link
              href="/analyze"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Analyze your first resume
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="text-white text-sm font-medium">
                    Resume Analysis
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {new Date(analysis.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    analysis.matchScore >= 70
                      ? "bg-green-500/20 text-green-400"
                      : analysis.matchScore >= 40
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {analysis.matchScore}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}