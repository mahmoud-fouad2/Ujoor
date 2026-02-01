import { Plus, Users, Edit } from 'lucide-react';

import type { Role } from '@/lib/types/settings';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function RolesSection({ roles }: { roles: Role[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              الأدوار والصلاحيات
            </CardTitle>
            <CardDescription>إدارة أدوار المستخدمين وصلاحياتهم</CardDescription>
          </div>
          <Button disabled onClick={() => toast.message('إدارة الأدوار التفصيلية قيد التطوير')}>
            <Plus className="h-4 w-4 ms-2" />
            دور جديد
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roles.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">لا توجد أدوار</div>
          ) : (
            roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{role.name}</h4>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{role.usersCount} مستخدم</Badge>
                  {role.isSystem && <Badge variant="outline">نظام</Badge>}
                  <Button variant="outline" size="sm" disabled>
                    <Edit className="h-4 w-4 ms-1" />
                    تعديل
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
