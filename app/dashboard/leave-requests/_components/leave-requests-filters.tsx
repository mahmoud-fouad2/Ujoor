import type { LeaveRequestStatus } from "@/lib/types/leave";

import { IconSearch } from "@tabler/icons-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LeaveRequestsFilters({
  activeTab,
  onActiveTabChange,
  searchQuery,
  onSearchQueryChange,
  filterDepartment,
  onFilterDepartmentChange,
  departments,
}: {
  activeTab: LeaveRequestStatus | "all";
  onActiveTabChange: (value: LeaveRequestStatus | "all") => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  filterDepartment: string;
  onFilterDepartmentChange: (value: string) => void;
  departments: Array<{ id: string; name: string }>;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <Tabs value={activeTab} onValueChange={(v) => onActiveTabChange(v as LeaveRequestStatus | "all")}>
        <TabsList>
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
          <TabsTrigger value="approved">موافق عليها</TabsTrigger>
          <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
          <TabsTrigger value="taken">تم أخذها</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2">
        <div className="relative">
          <IconSearch className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-[200px] ps-9"
          />
        </div>

        <Select value={filterDepartment} onValueChange={onFilterDepartmentChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="جميع الأقسام" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأقسام</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
