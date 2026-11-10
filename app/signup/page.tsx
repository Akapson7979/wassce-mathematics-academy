"use client";

import { useState } from "react";
import { supabase } from "@/supabase/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      setMessage("Registration successful! You can now sign in.");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setMessage(
        "Registration successful! Please check your email to confirm your account before signing in."
      );
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6fa",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "35px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ color: "#17365d", textAlign: "center" }}>
          Student Registration
        </h1>

        <p style={{ textAlign: "center", color: "#666" }}>
          Create your WASSCE Mathematics Academy account.
        </p>

        <form onSubmit={handleSignup}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={inputStyle}
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: "#17365d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "15px",
              fontSize: "16px",
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {error && (
          <p style={{ color: "red", marginTop: "15px" }}>{error}</p>
        )}

        {message && (
          <p style={{ color: "green", marginTop: "15px" }}>{message}</p>
        )}

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#17365d" }}>
            Sign In
          </a>
        </p>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "18px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxSizing: "border-box",
};