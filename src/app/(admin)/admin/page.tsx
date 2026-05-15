import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, FileSearch, CreditCard, TrendingUp } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const totalUsers = await prisma.user.count();
  const totalAnalyses = await prisma.analysis.count();
  const proUsers = await prisma.user.count({ where: { plan: "PRO" } });
  const totalRevenue = await prisma.payment.aggregate({
    where: { status: "success" },
    _sum: { amount: true },
  });

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      credits: true,
      createdAt: true,
      _count: { select: { analyses: true } },
    },
  });

  const revenue = (totalRevenue._sum.amount || 0) / 100;

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 mt-1">Platform overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Total Users</span>
              <Users className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{totalUsers}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Total Analyses</span>
              <FileSearch className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{totalAnalyses}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Pro Users</span>
              <TrendingUp className="text-purple-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{proUsers}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Revenue</span>
              <CreditCard className="text-yellow-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">₹{revenue}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-6">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-gray-800">
                  <th className="text-left pb-3">Name</th>
                  <th className="text-left pb-3">Email</th>
                  <th className="text-left pb-3">Plan</th>
                  <th className="text-left pb-3">Analyses</th>
                  <th className="text-left pb-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="text-sm">
                    <td className="py-3 text-white">{user.name}</td>
                    <td className="py-3 text-gray-400">{user.email}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.plan === "PRO"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {user._count.analyses}
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}