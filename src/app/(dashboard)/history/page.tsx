import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileSearch } from "lucide-react";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  const analyses = await prisma.analysis.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analysis History</h1>
        <p className="text-gray-400 mt-1">All your past resume analyses</p>
      </div>

      {analyses.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <FileSearch className="text-gray-600 mx-auto mb-3" size={40} />
          <p className="text-gray-400">No analyses yet</p>
          <Link
            href="/analyze"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Start your first analysis
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <Link key={analysis.id} href={`/history/${analysis.id}`}>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Resume Analysis</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(analysis.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <div
                    className={`text-lg font-bold px-4 py-2 rounded-full ${
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}