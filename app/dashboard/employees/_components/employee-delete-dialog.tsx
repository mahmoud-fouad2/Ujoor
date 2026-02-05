import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Employee } from "@/lib/types/core-hr";
import { getEmployeeFullName } from "@/lib/types/core-hr";

export function EmployeeDeleteDialog({
  open,
  onOpenChange,
  employee,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onConfirm: () => void;
}) {
  const isTerminated = employee?.status === "terminated";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription>
            {isTerminated ? (
              <>
                سيتم حذف الموظف &quot;{employee ? getEmployeeFullName(employee, "ar") : ""}&quot; نهائياً.
                لا يمكن التراجع عن هذا الإجراء.
              </>
            ) : (
              <>
                سيتم إنهاء خدمة الموظف &quot;{employee ? getEmployeeFullName(employee, "ar") : ""}&quot;.
                يمكنك الضغط على حذف مرة أخرى لاحقاً للحذف النهائي.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground"
            disabled={!employee}
          >
            {isTerminated ? "حذف نهائي" : "إنهاء الخدمة"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
