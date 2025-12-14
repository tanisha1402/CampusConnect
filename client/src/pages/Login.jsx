import loginIllustration from "../assets/login-illustration.png";

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#a8b8ff] overflow-hidden">

      {/* Floating bubbles */}
      <div className="absolute w-40 h-40 rounded-full top-10 left-10 bg-white/20 blur-2xl" />
      <div className="absolute w-32 h-32 rounded-full bottom-20 right-20 bg-white/20 blur-xl" />
      <div className="absolute w-24 h-24 rounded-full top-1/2 left-1/3 bg-white/10 blur-lg" />

      {/* Main Card */}
      <div className="relative z-10 flex items-center w-full max-w-4xl gap-10 p-10 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-white/40">

        {/* Illustration */}
        <div className="items-center justify-center flex-1 hidden md:flex">
          <img
            src={loginIllustration}
            alt="illustration"
            className="select-none w-72 drop-shadow-xl"
          />
        </div>

        {/* Form */}
        <div className="flex-1">
          <h1 className="mb-2 text-4xl font-bold text-slate-800">CampusConnect</h1>

          <p className="mb-8 text-slate-600">
            Welcome back! Please login to continue.
          </p>

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email address"
              className="w-full p-4 bg-white border shadow-sm rounded-xl border-slate-300 text-slate-700 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 bg-white border shadow-sm rounded-xl border-slate-300 text-slate-700 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
            />

            <button
              className="w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold text-lg
                         shadow-md hover:scale-[1.02] hover:bg-indigo-600 transition"
            >
              Login
            </button>

          </div>

          <p className="mt-6 text-sm text-center text-slate-600">
            Not registered?{" "}
            <a href="/register" className="font-semibold text-indigo-600 hover:underline">
              Create Account
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
