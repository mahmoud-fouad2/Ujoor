/**
 * Employees Data Hook - Centralized employee data management
 * TODO: Replace mock data with actual API calls when backend is ready
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Employee, Department } from "@/lib/types/core-hr";
import { employeesService, departmentsService } from "@/lib/api";

// Temporary initial data - will be fetched from API
const INITIAL_EMPLOYEES: Employee[] = [];
const INITIAL_DEPARTMENTS: Department[] = [];

interface UseEmployeesOptions {
  departmentId?: string;
  status?: "active" | "inactive" | "on_leave" | "terminated";
  search?: string;
}

interface UseEmployeesReturn {
  employees: Employee[];
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getEmployeeById: (id: string) => Employee | undefined;
  getEmployeeFullName: (employeeId: string) => string;
  getDepartmentById: (id: string) => Department | undefined;
  getEmployeesByDepartment: (departmentId: string) => Employee[];
}

export function useEmployees(options: UseEmployeesOptions = {}): UseEmployeesReturn {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API calls
      const [empResponse, deptResponse] = await Promise.all([
        employeesService.getAll({
          departmentId: options.departmentId,
          status: options.status,
          search: options.search,
        }),
        departmentsService.getAll(),
      ]);

      if (empResponse.success && empResponse.data) {
        setEmployees(empResponse.data.employees);
      }
      if (deptResponse.success && deptResponse.data) {
        setDepartments(deptResponse.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  }, [options.departmentId, options.status, options.search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getEmployeeById = useCallback(
    (id: string) => employees.find((e) => e.id === id),
    [employees]
  );

  const getEmployeeFullName = useCallback(
    (employeeId: string): string => {
      const emp = employees.find((e) => e.id === employeeId);
      if (!emp) return "غير معروف";
      return `${emp.firstName} ${emp.lastName}`;
    },
    [employees]
  );

  const getDepartmentById = useCallback(
    (id: string) => departments.find((d) => d.id === id),
    [departments]
  );

  const getEmployeesByDepartment = useCallback(
    (departmentId: string) => employees.filter((e) => e.departmentId === departmentId),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    let result = employees;

    if (options.departmentId) {
      result = result.filter((e) => e.departmentId === options.departmentId);
    }
    if (options.status) {
      result = result.filter((e) => e.status === options.status);
    }
    if (options.search) {
      const search = options.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.firstName.toLowerCase().includes(search) ||
          e.lastName.toLowerCase().includes(search) ||
          e.email.toLowerCase().includes(search) ||
          e.employeeNumber?.toLowerCase().includes(search)
      );
    }

    return result;
  }, [employees, options.departmentId, options.status, options.search]);

  return {
    employees: filteredEmployees,
    departments,
    isLoading,
    error,
    refetch: fetchData,
    getEmployeeById,
    getEmployeeFullName,
    getDepartmentById,
    getEmployeesByDepartment,
  };
}

export default useEmployees;
