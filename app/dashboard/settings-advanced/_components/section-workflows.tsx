import { ChevronLeft, Plus, Settings } from 'lucide-react';

import type { ApprovalWorkflow } from '@/lib/types/settings';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function WorkflowsSection({ workflows }: { workflows: ApprovalWorkflow[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              سير العمل والموافقات
            </CardTitle>
            <CardDescription>إدارة مسارات الموافقة والتصعيد</CardDescription>
          </div>
          <Button disabled onClick={() => toast.message('إدارة سير العمل قيد التطوير')}>
            <Plus className="h-4 w-4 ms-2" />
            سير عمل جديد
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workflows.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">لا يوجد سير عمل</div>
          ) : (
            workflows.map((workflow) => (
              <div key={workflow.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{workflow.name}</h4>
                    <Badge variant="outline">{workflow.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                      {workflow.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                    <Button variant="outline" size="sm" disabled>
                      تعديل
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {workflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                        <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                          {step.order}
                        </span>
                        <span className="text-sm">
                          {step.approverType === 'direct-manager'
                            ? 'المدير المباشر'
                            : step.approverType === 'department-head'
                              ? 'مدير القسم'
                              : step.approverType === 'hr'
                                ? 'الموارد البشرية'
                                : step.approverType}
                        </span>
                      </div>
                      {index < workflow.steps.length - 1 && (
                        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
