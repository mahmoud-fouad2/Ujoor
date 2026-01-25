/**
 * Payroll Data Hook - Centralized payroll management
 * TODO: Replace with actual API calls when backend is ready
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import type { Payslip, SalaryStructure } from "@/lib/types/payroll";
import { payrollService } from "@/lib/api";

interface PayrollRun {
  id: string;
  month: string;
  year: number;
  status: "draft" | "processing" | "completed" | "paid";
  totalAmount: number;
  employeeCount: number;
  createdAt: string;
}

interface UsePayrollOptions {
  employeeId?: string;
  departmentId?: string;
  month?: string;
  year?: number;
  status?: "draft" | "processing" | "completed" | "paid";
}

interface PayrollSummary {
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  employeeCount: number;
}

interface UsePayrollReturn {
  payslips: Payslip[];
  salaryStructures: SalaryStructure[];
  payrollRuns: PayrollRun[];
  summary: PayrollSummary;
  isLoading: boolean;
  error: string | null;
  runPayroll: (month: string, year: number) => Promise<void>;
  generatePayslip: (employeeId: string, month: string, year: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function usePayroll(options: UsePayrollOptions = {}): UsePayrollReturn {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [structuresRes, periodsRes] = await Promise.all([
        payrollService.getStructures(),
        payrollService.getPeriods({
          month: options.month ? parseInt(options.month) : undefined,
          year: options.year,
        }),
      ]);

      if (structuresRes.success && structuresRes.data) {
        setSalaryStructures(structuresRes.data);
      }
      if (periodsRes.success && periodsRes.data) {
        // Convert periods to our PayrollRun format
        const runs = periodsRes.data.map((p): PayrollRun => ({
          id: p.id,
          month: p.name,
          year: options.year || new Date().getFullYear(),
          status: p.status as PayrollRun["status"],
          totalAmount: 0,
          employeeCount: 0,
          createdAt: p.createdAt,
        }));
        setPayrollRuns(runs);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحميل بيانات الرواتب");
    } finally {
      setIsLoading(false);
    }
  }, [options.month, options.year]);

  const runPayroll = useCallback(async (month: string, year: number) => {
    try {
      // TODO: Create period then process it
      const createResponse = await payrollService.createPeriod({
        name: `${month}-${year}`,
        nameAr: `${month}-${year}`,
        startDate: `${year}-${month.padStart(2, "0")}-01`,
        endDate: `${year}-${month.padStart(2, "0")}-28`,
        paymentDate: `${year}-${month.padStart(2, "0")}-28`,
      });
      if (createResponse.success && createResponse.data) {
        await payrollService.processPeriod(createResponse.data.id);
        await fetchData();
      } else {
        setError(createResponse.error || "فشل تشغيل مسير الرواتب");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تشغيل مسير الرواتب");
    }
  }, [fetchData]);

  const generatePayslip = useCallback(async (_employeeId: string, _month: string, _year: number) => {
    try {
      // TODO: Implement when API is ready
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إنشاء كشف الراتب");
    }
  }, [fetchData]);

  const filteredPayslips = useMemo(() => {
    let result = payslips;

    if (options.employeeId) {
      result = result.filter((p) => p.employeeId === options.employeeId);
    }
    if (options.status) {
      result = result.filter((p) => p.status === options.status);
    }

    return result;
  }, [payslips, options.employeeId, options.status]);

  const summary = useMemo((): PayrollSummary => {
    const totalGross = filteredPayslips.reduce((sum, p) => sum + (p.totalEarnings || 0), 0);
    const totalDeductions = filteredPayslips.reduce((sum, p) => sum + (p.totalDeductions || 0), 0);
    const totalNet = filteredPayslips.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    const employeeCount = filteredPayslips.length;

    return { totalGross, totalDeductions, totalNet, employeeCount };
  }, [filteredPayslips]);

  return {
    payslips: filteredPayslips,
    salaryStructures,
    payrollRuns,
    summary,
    isLoading,
    error,
    runPayroll,
    generatePayslip,
    refetch: fetchData,
  };
}

export default usePayroll;
