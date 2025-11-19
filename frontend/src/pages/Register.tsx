import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Schema } from "zod/v3";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

const Register: React.FC = () => {
  const { register: registerUser, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (form: FormData) => {
    const success = await registerUser(form);
    if (success) navigate("/chat");
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-lime-300 via-lime-400 to-green-500
"
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <div className="flex justify-center mb-6">
          <div className="bg-green-500 text-white font-bold text-2xl rounded-full w-16 h-16 flex items-center justify-center">
            RG
          </div>
        </div>

        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Register to start chatting with your friends
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mty-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-500 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
