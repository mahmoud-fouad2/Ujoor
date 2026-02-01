import type { Dispatch, SetStateAction } from 'react';
import { Shield } from 'lucide-react';

import type { SystemSettings } from '@/lib/types/settings';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SecuritySettingsSection({
  settings,
  setSettings,
}: {
  settings: SystemSettings;
  setSettings: Dispatch<SetStateAction<SystemSettings>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          إعدادات الأمان
        </CardTitle>
        <CardDescription>سياسات كلمة المرور والحماية</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold">سياسة كلمة المرور</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>الحد الأدنى للأحرف</Label>
              <Input
                type="number"
                value={settings.security.passwordPolicy.minLength}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      passwordPolicy: {
                        ...settings.security.passwordPolicy,
                        minLength: parseInt(e.target.value),
                      },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>انتهاء الصلاحية (أيام)</Label>
              <Input
                type="number"
                value={settings.security.passwordPolicy.expiryDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      passwordPolicy: {
                        ...settings.security.passwordPolicy,
                        expiryDays: parseInt(e.target.value),
                      },
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: 'requireUppercase', label: 'يتطلب أحرف كبيرة' },
              { key: 'requireLowercase', label: 'يتطلب أحرف صغيرة' },
              { key: 'requireNumbers', label: 'يتطلب أرقام' },
              { key: 'requireSpecialChars', label: 'يتطلب رموز خاصة' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <Label>{item.label}</Label>
                <Switch
                  checked={
                    settings.security.passwordPolicy[
                      item.key as keyof typeof settings.security.passwordPolicy
                    ] as boolean
                  }
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        passwordPolicy: {
                          ...settings.security.passwordPolicy,
                          [item.key]: checked,
                        },
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-semibold">إعدادات الجلسة</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>مهلة الجلسة (دقائق)</Label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      sessionTimeout: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>الحد الأقصى لمحاولات تسجيل الدخول</Label>
              <Input
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      maxLoginAttempts: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label>المصادقة الثنائية</Label>
              <p className="text-sm text-muted-foreground">تفعيل المصادقة بخطوتين</p>
            </div>
            <Select
              value={settings.security.twoFactorAuth}
              onValueChange={(value: 'disabled' | 'optional' | 'required') =>
                setSettings({
                  ...settings,
                  security: { ...settings.security, twoFactorAuth: value },
                })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disabled">معطل</SelectItem>
                <SelectItem value="optional">اختياري</SelectItem>
                <SelectItem value="required">إلزامي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label>سجل التدقيق</Label>
              <p className="text-sm text-muted-foreground">تسجيل جميع العمليات</p>
            </div>
            <Switch
              checked={settings.security.auditLogging}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  security: { ...settings.security, auditLogging: checked },
                })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
