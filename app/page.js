// 'use client';

// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
// import { 
//   Sparkles, 
//   Zap, 
//   BarChart3, 
//   MessageSquare, 
//   Target, 
//   TrendingUp,
//   ChevronRight,
//   Star,
//   Users,
//   Clock,
//   Award
// } from 'lucide-react';

// export default function Home() {
//   const { data: session } = useSession();

//   const features = [
//     {
//       icon: <Sparkles className="w-8 h-8" />,
//       title: "Adaptive Questions",
//       description: "AI generates relevant questions based on your role, experience, and skills.",
//       color: "from-blue-500 to-blue-600"
//     },
//     {
//       icon: <Zap className="w-8 h-8" />,
//       title: "Real-time Feedback",
//       description: "Get immediate, detailed feedback on your answers with actionable insights.",
//       color: "from-purple-500 to-purple-600"
//     },
//     {
//       icon: <TrendingUp className="w-8 h-8" />,
//       title: "Track Progress",
//       description: "Monitor your improvement over time with detailed analytics and reports.",
//       color: "from-emerald-500 to-emerald-600"
//     }
//   ];

//   const stats = [
//     { icon: <Users className="w-5 h-5" />, value: "10K+", label: "Users" },
//     { icon: <MessageSquare className="w-5 h-5" />, value: "50K+", label: "Interviews" },
//     { icon: <Award className="w-5 h-5" />, value: "95%", label: "Satisfaction" },
//     { icon: <Clock className="w-5 h-5" />, value: "24/7", label: "Available" }
//   ];

//   return (
//     <div className="space-y-20 pb-20">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden pt-10">
//         <div className="absolute inset-0 -z-10">
//           <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
//           <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
//           <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
//         </div>
        
//         <div className="text-center max-w-4xl mx-auto">
//           <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-full mb-6">
//             {/* <span className="relative flex h-3 w-3">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
//             </span> */}
//             {/* <span className="text-sm font-medium text-blue-700">AI-Powered Interview Practice</span> */}
//           </div>
          
//           <h1 className="text-5xl md:text-4xl font-extrabold leading-tight">
//             Master Your
//             <span className="gradient-text block mt-1">Interview Skills</span>
//             {/* <span className="text-slate-700 block mt-2 text-3xl md:text-5xl">with AI</span> */}
//           </h1>
          
//           <p className="text-xl text-slate-600 mt-6 max-w-2xl mx-auto leading-relaxed">
//             Practice with our intelligent AI interviewer, get real-time feedback, 
//             and boost your confidence for your next big opportunity.
//           </p>
          
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
//             {session ? (
//               <Link href="/dashboard" className="btn-primary text-lg px-8 py-4 flex items-center justify-center group">
//                 Go to Dashboard
//                 <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             ) : (
//               <Link href="/auth/signin" className="btn-primary text-lg px-8 py-4 flex items-center justify-center group">
//                 Get Started Free
//                 <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             )}
//             <Link href="#features" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center">
//               Learn More
//             </Link>
//           </div>
          
//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
//             {stats.map((stat, index) => (
//               <div key={index} className="glass-card rounded-2xl p-4 text-center">
//                 <div className="flex justify-center mb-2 text-blue-500">
//                   {stat.icon}
//                 </div>
//                 <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
//                 <div className="text-sm text-slate-500">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="scroll-mt-20">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
//             Why Choose <span className="gradient-text">SkillPilot AI</span>
//           </h2>
//           <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
//             Everything you need to ace your next interview
//           </p>
//         </div>
        
//         <div className="grid md:grid-cols-3 gap-6">
//           {features.map((feature, index) => (
//             <div 
//               key={index} 
//               className="glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
//             >
//               <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform`}>
//                 {feature.icon}
//               </div>
//               <h3 className="text-xl font-semibold text-slate-800 mt-4">
//                 {feature.title}
//               </h3>
//               <p className="text-slate-600 mt-2 leading-relaxed">
//                 {feature.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12">
//         <div className="absolute inset-0 bg-[url('/next.svg')] opacity-10"></div>
//         <div className="relative z-10 text-center text-white">
//           {/* <Star className="w-12 h-12 mx-auto mb-4 text-yellow-300 fill-yellow-300" /> */}
//           <h2 className="text-2xl md:text-3xl font-bold">
//             Ready to Ace Your Interview?
//           </h2>
//           <p className="text-blue-100 mt-3 max-w-2xl mx-auto">
//             Join thousands of users who have improved their interview skills with AI-powered practice.
//           </p>
//           <Link
//             href={session ? "/dashboard" : "/auth/signin"}
//             className="inline-block mt-6 px-8 py-4 bg-white text-slate-800 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl"
//           >
//             {session ? "Go to Dashboard " : "Start Practicing Now "}
//           </Link>
        
//         </div>
//       </section>
      
//     </div>
//   );
// }
// 
// 
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Zap, TrendingUp, ArrowRight, Star, ChevronRight } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();

  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI-Powered Interviews",
      description: "Practice with our warm, human-like AI interviewer that adapts to your skill level.",
      color: "from-[#6c5ce7] to-[#a29bfe]"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-time Feedback",
      description: "Get gentle, constructive feedback immediately after each answer to help you grow.",
      color: "from-[#fd79a8] to-[#fdcb6e]"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Track Progress",
      description: "Watch your confidence and skills grow with detailed analytics and insights.",
      color: "from-[#6c5ce7] to-[#fd79a8]"
    }
  ];

  const stats = [
    { icon: "👥", value: "10K+", label: "Users" },
    { icon: "💬", value: "50K+", label: "Interviews" },
    { icon: "🏆", value: "95%", label: "Satisfaction" },
    { icon: "🕐", value: "24/7", label: "Available" }
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="text-center max-w-3xl px-4">
        {/* <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#fd79a8] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#6c5ce7]/20">
          <Image
            src="/logo.svg"
            alt="SkillPilot AI"
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </div> */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          <span className="gradient-text">SkillPilot AI</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Practice interviews with AI-powered guidance. Get real-time feedback and build confidence.
        </p>
        <Link
          href={session ? "/dashboard" : "/auth/signin"}
          className="inline-block bg-gradient-to-r from-[#6c5ce7] to-[#fd79a8] text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-[#6c5ce7]/25 transition-all"
        >
          {session ? "Go to Dashboard" : "Start Practicing"}
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full px-4">
        {features.map((feature, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-md`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mt-4">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl w-full px-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA Section - Redesigned with Gradient Background */}
      <div className="w-full max-w-5xl px-4 mt-16">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-14">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6c5ce7] via-[#a29bfe] to-[#fd79a8]"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10 text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Star className="w-8 h-8 text-white fill-white/30" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Ready to Ace Your Interview?
            </h2>
            
            <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
              Join thousands of users who have improved their interview skills with AI-powered practice.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={session ? "/dashboard" : "/auth/signin"}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#6c5ce7] font-semibold rounded-xl hover:bg-white/95 hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                {session ? "Go to Dashboard" : "Start Practicing Now"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/20"
              >
                Learn More
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <p className="text-white/70 text-sm mt-4">
              No credit card required. Start practicing in seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}