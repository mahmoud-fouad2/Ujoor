import type { Dispatch, SetStateAction } from 'react';
import { Building2 } from 'lucide-react';

import type { SystemSettings } from '@/lib/types/settings';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function GeneralSettingsSection({
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
          <Building2 className="h-5 w-5" />
          الإعدادات العامة
        </CardTitle>
        <CardDescription>معلومات الشركة والإعدادات الأساسية</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>اسم الشركة (عربي)</Label>
            <Input
              value={settings.general.companyName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, companyName: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>اسم الشركة (إنجليزي)</Label>
            <Input
              value={settings.general.companyNameEn || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, companyNameEn: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>المنطقة الزمنية</Label>
            <Select
              value={settings.general.timezone}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, timezone: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                <SelectItem value="Asia/Kuwait">الكويت (GMT+3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>العملة</Label>
            <Select
              value={settings.general.currency}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, currency: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                <SelectItem value="KWD">دينار كويتي (KWD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>تنسيق التاريخ</Label>
            <Select
              value={settings.general.dateFormat}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, dateFormat: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>تنسيق الوقت</Label>
            <Select
              value={settings.general.timeFormat}
              onValueChange={(value: '12h' | '24h') =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, timeFormat: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12 ساعة (AM/PM)</SelectItem>
                <SelectItem value="24h">24 ساعة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
