"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  locale: "ar" | "en";
  labels: {
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    submit: string;
  };
};

export function LoginForm({ locale, labels }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError(locale === "ar" ? "يرجى إدخال البريد وكلمة المرور" : "Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: trimmedEmail,
        password,
        redirect: false,
      });

      if (!res || res.error) {
		const raw = res?.error;
		if (raw === "CredentialsSignin") {
			setError(locale === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password");
		} else {
			setError(raw || (locale === "ar" ? "تعذر تسجيل الدخول" : "Unable to sign in"));
		}
        return;
      }

    const session = await getSession();
    const role = (session?.user as any)?.role as string | undefined;
    router.push(role === "SUPER_ADMIN" ? "/dashboard/super-admin" : "/dashboard");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          {labels.email}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={labels.emailPlaceholder}
          className="h-11"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          {labels.password}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder={labels.passwordPlaceholder}
          className="h-11"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="h-11 w-full bg-black text-white hover:bg-black/90" disabled={isLoading}>
        {isLoading ? (locale === "ar" ? "جاري تسجيل الدخول..." : "Signing in...") : labels.submit}
      </Button>
    </form>
  );
}
