import Link from "next/link";
import { Brain, CheckCircle, Zap, Shield, TrendingUp, FileSearch } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="text-blue-500" size={24} />
            <span className="font-bold text-xl">ResumeIQ</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-400 hover:text-white text-sm transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm px-4 py-2 rounded-full mb-8">
          <Zap size={14} />
          AI-Powered Resume Analysis
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Land Your Dream Job with{" "}
          <span className="text-blue-500">AI Resume Analysis</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Upload your resume, paste a job description, and get instant AI feedback
          on your match score, skill gaps, and ATS optimization tips.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition"
          >
            Analyze Your Resume Free
          </Link>
          <Link
            href="/login"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold px-8 py-4 rounded-xl text-lg transition"
          >
            Sign In
          </Link>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          Free plan includes 3 analyses. No credit card required.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          Everything you need to get hired
        </h2>
        <p className="text-gray-400 text-center mb-12">
          ResumeIQ gives you the unfair advantage in your job search
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              color: "text-green-400",
              bg: "bg-green-500/10",
              title: "Match Score",
              desc: "Get an instant percentage score showing how well your resume matches the job description.",
            },
            {
              icon: FileSearch,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
              title: "ATS Keywords",
              desc: "Discover the exact keywords ATS systems look for and make sure your resume includes them.",
            },
            {
              icon: Shield,
              color: "text-purple-400",
              bg: "bg-purple-500/10",
              title: "Skill Gap Analysis",
              desc: "Know exactly what skills you are missing and get actionable suggestions to improve.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className={`${feature.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={feature.color} size={24} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-gray-400 text-center mb-12">
          Start free, upgrade when you need more
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h3 className="text-white font-bold text-xl mb-2">Free</h3>
            <p className="text-4xl font-bold text-white mb-1">₹0</p>
            <p className="text-gray-400 text-sm mb-6">Forever free</p>
            <ul className="space-y-3 mb-8">
              {["3 resume analyses", "Match score", "Basic feedback", "History tracking"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle size={16} className="text-green-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block text-center border border-gray-700 hover:border-gray-500 text-white font-semibold py-3 rounded-lg transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-blue-600 rounded-xl p-8 relative">
            <div className="absolute top-4 right-4 bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
              POPULAR
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Pro</h3>
            <p className="text-4xl font-bold text-white mb-1">₹499</p>
            <p className="text-blue-200 text-sm mb-6">One-time payment</p>
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited analyses",
                "Advanced AI feedback",
                "ATS keyword analysis",
                "Skill gap analysis",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-white text-sm">
                  <CheckCircle size={16} className="text-blue-200" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block text-center bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition"
            >
              Get Pro Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="text-blue-500" size={20} />
            <span className="font-bold">ResumeIQ</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 ResumeIQ. Built with Next.js & AI.
          </p>
        </div>
      </footer>
    </div>
  );
}