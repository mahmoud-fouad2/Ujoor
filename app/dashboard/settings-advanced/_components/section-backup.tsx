import type { Dispatch, SetStateAction } from 'react';
import { Database } from 'lucide-react';

import type { SystemSettings } from '@/lib/types/settings';

import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';

export function BackupSection({
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
          <Database className="h-5 w-5" />
          النسخ الاحتياطي
        </CardTitle>
        <CardDescription>إعدادات النسخ الاحتياطي التلقائي</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between py-2">
          <div>
            <Label>النسخ الاحتياطي التلقائي</Label>
            <p className="text-sm text-muted-foreground">تفعيل النسخ الاحتياطي الدوري</p>
          </div>
          <Switch
            checked={settings.backup.autoBackup}
            onCheckedChange={(checked) =>
              setSettings({
                ...settings,
                backup: { ...settings.backup, autoBackup: checked },
              })
            }
          />
        </div>

        {settings.backup.autoBackup && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>التكرار</Label>
                <Select
                  value={settings.backup.frequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
                    setSettings({
                      ...settings,
                      backup: { ...settings.backup, frequency: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">يومياً</SelectItem>
                    <SelectItem value="weekly">أسبوعياً</SelectItem>
                    <SelectItem value="monthly">شهرياً</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>مدة الاحتفاظ (أيام)</Label>
                <Input
                  type="number"
                  value={settings.backup.retentionDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      backup: {
                        ...settings.backup,
                        retentionDays: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label>تضمين المرفقات</Label>
                <p className="text-sm text-muted-foreground">نسخ الملفات والمستندات</p>
              </div>
              <Switch
                checked={settings.backup.includeAttachments}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    backup: { ...settings.backup, includeAttachments: checked },
                  })
                }
              />
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">آخر نسخة احتياطية</p>
                  <p className="font-medium">
                    {settings.backup.lastBackup
                      ? new Date(settings.backup.lastBackup).toLocaleString('ar-SA')
                      : 'لم يتم بعد'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">النسخة التالية</p>
                  <p className="font-medium">
                    {settings.backup.nextBackup
                      ? new Date(settings.backup.nextBackup).toLocaleString('ar-SA')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <Button variant="outline">
          <Database className="h-4 w-4 ms-2" />
          إنشاء نسخة احتياطية الآن
        </Button>
      </CardContent>
    </Card>
  );
}
