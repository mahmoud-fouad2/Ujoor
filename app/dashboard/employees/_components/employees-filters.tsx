import { IconSearch } from "@tabler/icons-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Department } from "@/lib/types/core-hr";

import { statusOptions } from "./employee-constants";

export function EmployeesFilters({
  searchQuery,
  onSearchQueryChange,
  filterDept,
  onFilterDeptChange,
  filterStatus,
  onFilterStatusChange,
  departments,
}: {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  filterDept: string;
  onFilterDeptChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  departments: Department[];
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <IconSearch className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="بحث بالاسم أو الرقم..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="ps-9"
        />
      </div>

      <Select value={filterDept} onValueChange={onFilterDeptChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="القسم" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل الأقسام</SelectItem>
          {departments.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.nameAr || d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filterStatus} onValueChange={onFilterStatusChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل الحالات</SelectItem>
          {statusOptions.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
