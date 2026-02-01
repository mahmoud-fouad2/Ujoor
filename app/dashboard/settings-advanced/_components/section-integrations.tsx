import type { Dispatch, SetStateAction } from 'react';
import { Link, RefreshCw } from 'lucide-react';

import type { SystemSettings } from '@/lib/types/settings';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function IntegrationsSection({
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
          <Link className="h-5 w-5" />
          التكاملات
        </CardTitle>
        <CardDescription>ربط النظام مع الخدمات الحكومية والأنظمة الأخرى</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          {
            key: 'gosi',
            name: 'التأمينات الاجتماعية (GOSI)',
            field: 'subscriberNumber',
            fieldLabel: 'رقم المشترك',
          },
          {
            key: 'mol',
            name: 'وزارة العمل',
            field: 'establishmentNumber',
            fieldLabel: 'رقم المنشأة',
          },
          { key: 'muqeem', name: 'مقيم', field: 'username', fieldLabel: 'اسم المستخدم' },
          {
            key: 'mudad',
            name: 'مدد',
            field: 'organizationId',
            fieldLabel: 'رقم المنظمة',
          },
        ].map((integration) => (
          <div key={integration.key} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    settings.integrations[integration.key as keyof typeof settings.integrations] &&
                    (
                      settings.integrations[
                        integration.key as keyof typeof settings.integrations
                      ] as { enabled: boolean }
                    ).enabled
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <Link
                    className={`h-5 w-5 ${
                      settings.integrations[integration.key as keyof typeof settings.integrations] &&
                      (
                        settings.integrations[
                          integration.key as keyof typeof settings.integrations
                        ] as { enabled: boolean }
                      ).enabled
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{integration.name}</h4>
                  <Badge
                    variant={
                      settings.integrations[integration.key as keyof typeof settings.integrations] &&
                      (
                        settings.integrations[
                          integration.key as keyof typeof settings.integrations
                        ] as { enabled: boolean }
                      ).enabled
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {settings.integrations[integration.key as keyof typeof settings.integrations] &&
                    (
                      settings.integrations[
                        integration.key as keyof typeof settings.integrations
                      ] as { enabled: boolean }
                    ).enabled
                      ? 'مفعل'
                      : 'غير مفعل'}
                  </Badge>
                </div>
              </div>
              <Switch
                checked={
                  settings.integrations[integration.key as keyof typeof settings.integrations]
                    ? (
                        settings.integrations[
                          integration.key as keyof typeof settings.integrations
                        ] as { enabled: boolean }
                      ).enabled
                    : false
                }
                onCheckedChange={(checked) => {
                  const key = integration.key as keyof typeof settings.integrations;
                  const current = settings.integrations[key] as any;
                  if (!current) return;
                  setSettings({
                    ...settings,
                    integrations: {
                      ...settings.integrations,
                      [key]: { ...current, enabled: checked },
                    },
                  });
                }}
              />
            </div>
            {settings.integrations[integration.key as keyof typeof settings.integrations] &&
              (
                settings.integrations[
                  integration.key as keyof typeof settings.integrations
                ] as { enabled: boolean }
              ).enabled && (
                <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>{integration.fieldLabel}</Label>
                    <Input placeholder={`أدخل ${integration.fieldLabel}`} />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 ms-2" />
                      مزامنة الآن
                    </Button>
                  </div>
                </div>
              )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
