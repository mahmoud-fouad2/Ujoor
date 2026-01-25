"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePasswordForm({ locale }: { locale: "ar" | "en" }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const copy = useMemo(() => {
    if (locale === "ar") {
      return {
        title: "تحديث كلمة المرور",
        current: "كلمة المرور الحالية",
        next: "كلمة المرور الجديدة",
        confirm: "تأكيد كلمة المرور الجديدة",
        save: "حفظ",
        saving: "جارٍ الحفظ...",
        required: "يرجى تعبئة جميع الحقول.",
        mismatch: "كلمتا المرور غير متطابقتين.",
        success: "تم حفظ كلمة المرور (تجريبيًا).",
      };
    }

    return {
      title: "Update password",
      current: "Current password",
      next: "New password",
      confirm: "Confirm new password",
      save: "Save",
      saving: "Saving...",
      required: "Please fill in all fields.",
      mismatch: "Passwords do not match.",
      success: "Password saved (demo).",
    };
  }, [locale]);

  const onSave = async () => {
    if (!current || !next || !confirm) {
      toast.error(copy.required);
      return;
    }

    if (next !== confirm) {
      toast.error(copy.mismatch);
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Replace with API call to change password
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      toast.success(copy.success);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
      toast.error(locale === "ar" ? "تعذر الحفظ." : "Could not save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current">{copy.current}</Label>
          <Input
            id="current"
            type="password"
            value={current}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrent(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="next">{copy.next}</Label>
          <Input
            id="next"
            type="password"
            value={next}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNext(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">{copy.confirm}</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button type="button" onClick={onSave} disabled={isSaving}>
            {isSaving ? copy.saving : copy.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
