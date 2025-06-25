import Link from 'next/link'
import { ArrowRight, Mic, FileText, CheckCircle2, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Meeting Summarizer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your meeting recordings into concise summaries and actionable tasks with the power of AI
          </p>
        </header>

        <div className="flex justify-center gap-4 mb-16">
          <Link
            href="/auth/signup"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/auth/login"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
          >
            Sign In
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <Mic className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload Audio</h3>
            <p className="text-gray-600">
              Upload meeting recordings or provide links to cloud recordings
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <FileText className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Summarization</h3>
            <p className="text-gray-600">
              Get concise, intelligent summaries of your meetings in seconds
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <CheckCircle2 className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Action Items</h3>
            <p className="text-gray-600">
              Automatically extract and assign tasks from meeting discussions
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Zap className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Start Free Today</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get 5 free meeting summaries every month. No credit card required.
            Upgrade anytime for more features and unlimited summaries.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold text-lg mb-2">Free Tier</h4>
              <p className="text-gray-600">5 meetings/month</p>
              <p className="text-gray-600">30 min max duration</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Pro Tier</h4>
              <p className="text-gray-600">50 meetings/month</p>
              <p className="text-gray-600">2 hour max duration</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Enterprise</h4>
              <p className="text-gray-600">Unlimited meetings</p>
              <p className="text-gray-600">Custom features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}