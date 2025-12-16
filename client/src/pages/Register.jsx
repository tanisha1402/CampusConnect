import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import registerIllustration from "../assets/login-illustration.png"; // same image

export default function Register() {
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.message || "Registration failed");
        return;
      }

      // Automatically login after register
      const loginRes = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setLoading(false);
        setError("Account created but login failed!");
        return;
      }

      login(loginData.user, loginData.token);
      window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
      setError("Server error. Check backend.");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#dbe4ff] overflow-hidden">

      {/* Floating bubbles (same style as Login) */}
      <div className="absolute w-40 h-40 rounded-full top-10 left-10 bg-white/20 blur-2xl" />
      <div className="absolute w-32 h-32 rounded-full bottom-20 right-20 bg-white/20 blur-xl" />
      <div className="absolute w-24 h-24 rounded-full top-1/2 left-1/3 bg-white/10 blur-lg" />

      <div className="relative z-10 flex items-center w-full max-w-4xl gap-10 p-10 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-white/40">

        {/* Form (LEFT side) */}
        <div className="flex-1">
          <h1 className="mb-2 text-4xl font-bold text-slate-800">Create Account</h1>

          <p className="mb-6 text-slate-600">
            Join CampusConnect and start exploring!
          </p>

          {error && <p className="mb-4 text-red-600">{error}</p>}

          <form className="space-y-4" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full name"
              className="w-full p-4 border rounded-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 border rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 border rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <select
              className="w-full p-4 border rounded-xl"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-indigo-500 rounded-xl"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-slate-600">
            Already have an account?{" "}
            <a href="/login" className="font-bold text-indigo-600 hover:underline">
              Login
            </a>
          </p>
        </div>

        {/* Illustration (RIGHT side) */}
        <div className="items-center justify-center flex-1 hidden md:flex">
          <img
            src={registerIllustration}
            alt="register illustration"
            className="select-none w-72 drop-shadow-xl"
          />
        </div>

      </div>
    </div>
  );
}
