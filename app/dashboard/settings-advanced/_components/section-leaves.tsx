import { Calendar, Edit, Plus } from 'lucide-react';

import type { Dispatch, SetStateAction } from 'react';

import type { LeaveTypeConfig } from '@/lib/types/settings';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export function LeaveTypesSection({
  leaveTypes,
  setLeaveTypes,
  isLoading,
  error,
}: {
  leaveTypes: LeaveTypeConfig[];
  setLeaveTypes: Dispatch<SetStateAction<LeaveTypeConfig[]>>;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              أنواع الإجازات
            </CardTitle>
            <CardDescription>إدارة أنواع الإجازات وسياساتها</CardDescription>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 ms-2" />
            نوع إجازة جديد
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground">جارٍ التحميل...</div>
        ) : (
          <div className="space-y-4">
            {leaveTypes.map((leaveType) => (
              <div
                key={leaveType.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      leaveType.isActive ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  >
                    <Calendar
                      className={`h-5 w-5 ${
                        leaveType.isActive ? 'text-green-600' : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{leaveType.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{leaveType.annualEntitlement} يوم سنوياً</span>
                      <span>•</span>
                      <span>{leaveType.isPaid ? 'مدفوعة' : 'غير مدفوعة'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={leaveType.isActive ? 'default' : 'secondary'}>
                    {leaveType.isActive ? 'نشط' : 'غير نشط'}
                  </Badge>
                  <Switch
                    checked={leaveType.isActive}
                    onCheckedChange={async (checked) => {
                      const previous = leaveTypes;
                      setLeaveTypes(
                        leaveTypes.map((lt) =>
                          lt.id === leaveType.id ? { ...lt, isActive: checked } : lt,
                        ),
                      );

                      try {
                        const res = await fetch(
                          `/api/leave-types/${encodeURIComponent(leaveType.id)}`,
                          {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ isActive: checked }),
                          },
                        );
                        const json = (await res.json()) as { data?: any; error?: string };
                        if (!res.ok) {
                          throw new Error(json.error || 'فشل تحديث الحالة');
                        }
                      } catch (err) {
                        setLeaveTypes(previous);
                        toast.error(err instanceof Error ? err.message : 'فشل تحديث الحالة');
                      }
                    }}
                  />
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
