import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema
const schema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

// TypeScript type inferred from Zod schema
type FormData = z.infer<typeof schema>;

const Login: React.FC = () => {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Submit handler with proper type
  const onSubmit = async (form: FormData) => {
    const success = await login(form);
    if (success) navigate("/chat");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-500 text-white font-bold text-2xl rounded-full w-16 h-16 flex items-center justify-center">
            LC
          </div>
        </div>

        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to start chatting with your friends
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="email"
              {...register("email")}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-purple-500 font-medium hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
