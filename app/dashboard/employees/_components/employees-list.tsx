import { IconEye, IconPencil, IconPlus, IconTrash, IconUser } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableEmptyRow } from "@/components/empty-states/table-empty-row";

import type { Employee } from "@/lib/types/core-hr";
import { getEmployeeFullName } from "@/lib/types/core-hr";

import { EmployeeStatusBadge } from "./employee-status-badge";

export function EmployeesList({
  employees,
  getDeptName,
  getJobName,
  onAdd,
  onView,
  onEdit,
  onDelete,
}: {
  employees: Employee[];
  getDeptName: (departmentId: string) => string;
  getJobName: (jobTitleId: string) => string;
  onAdd: () => void;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}) {
  return (
    <>
      <div className="md:hidden space-y-3">
        {employees.length === 0 ? (
          <Empty className="border rounded-lg">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconUser className="size-5" />
              </EmptyMedia>
              <EmptyTitle>لا يوجد موظفون</EmptyTitle>
              <EmptyDescription>ابدأ بإضافة أول موظف لعرض البيانات هنا.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={onAdd}>
                <IconPlus className="ms-2 h-4 w-4" />
                إضافة موظف
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          employees.map((emp) => (
            <Card key={emp.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <IconUser className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{getEmployeeFullName(emp, "ar")}</div>
                        <div className="text-sm text-muted-foreground truncate">{emp.email}</div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                      <div className="text-muted-foreground">الرقم</div>
                      <div className="text-start">
                        <Badge variant="outline">{emp.employeeNumber}</Badge>
                      </div>

                      <div className="text-muted-foreground">القسم</div>
                      <div className="text-start truncate">{getDeptName(emp.departmentId)}</div>

                      <div className="text-muted-foreground">المسمى</div>
                      <div className="text-start truncate">{getJobName(emp.jobTitleId)}</div>

                      <div className="text-muted-foreground">الحالة</div>
                      <div className="text-start">
                        <EmployeeStatusBadge status={emp.status} />
                      </div>

                      <div className="text-muted-foreground">تاريخ التعيين</div>
                      <div className="text-start">{emp.hireDate}</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => onView(emp)} title="عرض">
                      <IconEye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(emp)} title="تعديل">
                      <IconPencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(emp)} title="حذف">
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">الرقم</TableHead>
              <TableHead className="text-start">الاسم</TableHead>
              <TableHead className="text-start">القسم</TableHead>
              <TableHead className="text-start">المسمى</TableHead>
              <TableHead className="text-start">الحالة</TableHead>
              <TableHead className="text-start">تاريخ التعيين</TableHead>
              <TableHead className="text-start w-[120px]">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableEmptyRow
                colSpan={7}
                title="لا يوجد موظفون"
                description="ابدأ بإضافة أول موظف لعرض البيانات هنا."
                icon={<IconUser className="size-5" />}
                actionLabel="إضافة موظف"
                onAction={onAdd}
              />
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <Badge variant="outline">{emp.employeeNumber}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                        <IconUser className="size-4" />
                      </div>
                      <div>
                        <div className="font-medium">{getEmployeeFullName(emp, "ar")}</div>
                        <div className="text-sm text-muted-foreground">{emp.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getDeptName(emp.departmentId)}</TableCell>
                  <TableCell>{getJobName(emp.jobTitleId)}</TableCell>
                  <TableCell>
                    <EmployeeStatusBadge status={emp.status} />
                  </TableCell>
                  <TableCell>{emp.hireDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onView(emp)} title="عرض">
                        <IconEye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(emp)} title="تعديل">
                        <IconPencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(emp)} title="حذف">
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
