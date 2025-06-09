import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AI Consulting
            </span>
            <br />
            Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your business with cutting-edge AI solutions. Manage, deploy, and optimize 
            AI agents tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-4 border border-gray-600 hover:border-gray-500 text-white rounded-lg text-lg font-semibold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Our AI Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <div className="text-blue-400 text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Agent Development</h3>
              <p className="text-gray-300">
                Custom AI agents tailored to your business processes and requirements. 
                Deploy intelligent automation solutions that work 24/7.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <div className="text-blue-400 text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-white mb-4">Analytics & Monitoring</h3>
              <p className="text-gray-300">
                Real-time monitoring and analytics for your AI agents. Track performance, 
                optimize efficiency, and get actionable insights.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <div className="text-blue-400 text-4xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Agent Management</h3>
              <p className="text-gray-300">
                Comprehensive dashboard to manage all your AI agents. Start, stop, 
                configure, and scale your AI workforce with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Enterprise-Grade Security
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  End-to-end encryption for all data
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  Role-based access control
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  Compliance with industry standards
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  Regular security audits and updates
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Scalable Architecture
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  Auto-scaling based on demand
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  Multi-region deployment
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  99.9% uptime guarantee
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  Real-time performance monitoring
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of companies already using our AI consulting platform 
            to automate processes and drive growth.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-xl font-semibold transition-all transform hover:scale-105"
          >
            Start Your AI Journey
          </Link>
        </div>
      </section>
    </div>
  )
}
