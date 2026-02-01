import type { Dispatch, SetStateAction } from 'react';
import { Globe } from 'lucide-react';

import type { SystemSettings } from '@/lib/types/settings';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LocalizationSection({
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
          <Globe className="h-5 w-5" />
          اللغة والتنسيق
        </CardTitle>
        <CardDescription>إعدادات اللغة والتقويم</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>اللغة الافتراضية</Label>
            <Select
              value={settings.localization.defaultLanguage}
              onValueChange={(value: 'ar' | 'en') =>
                setSettings({
                  ...settings,
                  localization: { ...settings.localization, defaultLanguage: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>نوع التقويم</Label>
            <Select
              value={settings.localization.calendarType}
              onValueChange={(value: 'gregorian' | 'hijri' | 'both') =>
                setSettings({
                  ...settings,
                  localization: { ...settings.localization, calendarType: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gregorian">ميلادي</SelectItem>
                <SelectItem value="hijri">هجري</SelectItem>
                <SelectItem value="both">كلاهما</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
