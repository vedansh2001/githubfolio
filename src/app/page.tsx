"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
 
import React, { useState } from "react";
import { Search, BarChart3, User, ArrowRight, Code, ChevronRight, LogIn, Award } from "lucide-react";
import FabarComponent from "./components/FabarComponent/FabarComponet";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [barisopen, setBarisopen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      router.push(`/${username.trim()}`);
    }
  };
  const handleViewMyPortfolio = () => {
    if (session?.user?.githubUsername) {
      router.push(`/${session.user.githubUsername}`);
    } else {
      router.push("/login");
    }
  };
  const handleViewMyGitHubAnalysis = () => {
    if (session?.user?.githubUsername) {
      router.push(`/${session?.user?.githubUsername}/GitHubAnalysis`);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <FabarComponent barisopen={barisopen} setBarisopen={setBarisopen}  />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptLTEyLTJjLTcuNzMyIDAtMTQgNi4yNjgtMTQgMTRzNi4yNjggMTQgMTQgMTQgMTQtNi4yNjggMTQtMTQtNi4yNjgtMTQtMTQtMTR6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')",
            backgroundSize: "60px 60px", 
          }} />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-5xl md:text-6xl font-bold">GitHubFolio</h1>
            </div>
            
            <p className="text-xl md:text-2xl mt-6 mb-8 max-w-3xl mx-auto">
              Transform your GitHub profile into a professional portfolio and get AI-powered insights on your coding habits
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              {session?.user ? (
                <button
                  onClick={handleViewMyPortfolio}
                  className="px-6 py-3 bg-white text-blue-700 rounded-lg shadow-lg hover:shadow-xl transition font-medium flex items-center gap-2"
                >
                  View My Portfolio <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="px-6 py-3 bg-white text-blue-700 rounded-lg shadow-lg hover:shadow-xl transition font-medium flex items-center gap-2"
                >
                  Sign In With GitHub <LogIn size={18} />
                </button>
              )}
              
              <button
                onClick={handleViewMyGitHubAnalysis}
                className="px-6 py-3 bg-indigo-900 text-white rounded-lg shadow-lg hover:shadow-xl transition font-medium flex items-center gap-2"
              >
                AI Analysis <BarChart3 size={18} />
              </button>
            </div>

            <div className="mt-16">
              <div className="bg-white/10 rounded-lg p-5 backdrop-blur-sm">
                <h2 className="text-xl font-medium mb-3">Browse GitHub Profiles</h2>
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter a GitHub username to explore"
                      className="w-full px-4 py-3 pl-12 pr-24 border border-white/20 bg-white/10 backdrop-blur-md rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search size={20} className="text-white/70" />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-white text-blue-700 rounded-md hover:bg-blue-50 transition duration-300 flex items-center gap-1"
                    >
                      {isLoading ? "Loading..." : "Explore"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Value Proposition */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Elevate Your GitHub Presence</h2>
          <p className="text-lg text-gray-600">
            GitHubFolio transforms your GitHub repositories and activity into a professional developer portfolio and provides AI-powered insights to help you improve your coding practices.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <User size={28} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional Portfolio</h3>
            <p className="text-gray-600">
              Create a stunning developer portfolio automatically from your GitHub profile. Highlight your projects, contributions, and coding languages.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-blue-600 font-medium flex items-center">
                <span>Sign in to create yours</span>
                <ChevronRight size={16} className="ml-1" />
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Award size={28} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Code Rating</h3>
            <p className="text-gray-600">
              Get your code rated by AI. Receive insights on code quality, security practices, documentation standards, and overall project health.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-blue-600 font-medium flex items-center">
                <span>Powered by Gemini 1.5 Pro</span>
                <ChevronRight size={16} className="ml-1" />
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Code size={28} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Repository Showcase</h3>
            <p className="text-gray-600">
              Highlight your best work with detailed repository cards, language breakdowns, and contribution statistics all in one place.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-blue-600 font-medium flex items-center">
                <span>Pin your best projects</span>
                <ChevronRight size={16} className="ml-1" />
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center relative">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3">Sign In With GitHub</h3>
              <p className="text-gray-600">Connect your GitHub account securely with one click</p>
              
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-8 left-[60%] w-full h-1 bg-blue-200"></div>
            </div>
            
            <div className="text-center relative">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3">Customize Portfolio</h3>
              <p className="text-gray-600">Your portfolio is created instantly, with options to customize</p>
              
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-8 left-[60%] w-full h-1 bg-blue-200"></div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3">Get AI Analysis</h3>
              <p className="text-gray-600">Request in-depth AI evaluation of your code repositories</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 rounded-2xl p-8 max-w-5xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to showcase your code?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who use GitHubFolio to present their work and improve their coding practices
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => router.push("/signup")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium"
            >
              Create account
            </button>
            <button 
              onClick={() => router.push(`/${session?.user?.githubUsername}/GitHubAnalysis`)}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-50 transition font-medium"
            >
              Try AI Analysis
            </button>
          </div>
        </div>

        {/* Example Profile Preview */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-16">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Example Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">VM</div>
                  <div>
                    <h3 className="font-semibold">Vedansh Mishra</h3>
                    <p className="text-sm text-gray-500">@vedansh2001</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">Full-stack developer passionate about building innovative applications</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">JavaScript</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">CSS</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">TypeScript</span>
                </div>
                <button 
                  onClick={() => router.push("/vedansh2001")}
                  className="mt-3 w-full py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center justify-center gap-1"
                >
                  View Profile <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => router.push("/vedansh2001/GitHubAnalysis")}
                  className="mt-3 w-full py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center justify-center gap-1"
                >
                  View AI GitHubAnalysis <ArrowRight size={16} />
                </button>
              </div>
              
              <div>
              <p className="text-md text-gray-500 pb-2 text-center border rounded-lg border-b-0">Preview of a generated AI GitHub Analizer page</p>
              <img 
                src="/lib/ai_analizer_photo.png" 
                alt="Portfolio preview" 
                className="w-full h-auto rounded-lg border border-t-0"
              />

              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 pt-8 pb-4">
          <p>© {new Date().getFullYear()} GitHubFolio - Powered by Next.js and Gemini 1.5 Pro</p>
          <div className="flex justify-center gap-6 mt-3">
            <a href="#" className="text-gray-500 hover:text-gray-700">About</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Terms</a>
            <a href="https://github.com/vedansh2001" className="text-gray-500 hover:text-gray-700">GitHub</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;