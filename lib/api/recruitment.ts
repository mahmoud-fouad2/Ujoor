import apiClient from "@/lib/api/client";
import type {
  Applicant,
  ApplicantSearchFilters,
  ApplicationStatus,
  Interview,
  InterviewSearchFilters,
  JobOffer,
  JobPosting,
  JobSearchFilters,
  OfferStatus,
  OnboardingProcess,
  OnboardingStatus,
  OnboardingTemplate,
  RecruitmentPipeline,
  RecruitmentStats,
} from "@/lib/types/recruitment";

type ApiResult<T> = { success: boolean; data?: T; error?: string };

const dataOr = <T>(res: ApiResult<T>, fallback: T): T =>
  res.success && res.data !== undefined ? res.data : fallback;

const dataOrNull = <T>(res: ApiResult<T>): T | null =>
  res.success && res.data !== undefined ? res.data : null;

const mustData = <T>(res: ApiResult<T>): T => {
  if (res.success && res.data !== undefined) return res.data;
  throw new Error(res.error || "Request failed");
};

const jobFiltersToParams = (filters?: JobSearchFilters) =>
  filters
    ? {
        query: filters.query,
        departmentId: filters.departmentId,
        postedAfter: filters.postedAfter,
        postedBefore: filters.postedBefore,
        status: filters.status?.join(","),
        jobType: filters.jobType?.join(","),
        experienceLevel: filters.experienceLevel?.join(","),
      }
    : undefined;

const applicantFiltersToParams = (filters?: ApplicantSearchFilters) =>
  filters
    ? {
        query: filters.query,
        jobPostingId: filters.jobPostingId,
        minRating: filters.minRating,
        maxRating: filters.maxRating,
        appliedAfter: filters.appliedAfter,
        appliedBefore: filters.appliedBefore,
        status: filters.status?.join(","),
        source: filters.source?.join(","),
      }
    : undefined;

const interviewFiltersToParams = (filters?: InterviewSearchFilters) =>
  filters
    ? {
        applicantId: filters.applicantId,
        jobPostingId: filters.jobPostingId,
        interviewerId: filters.interviewerId,
        scheduledAfter: filters.scheduledAfter,
        scheduledBefore: filters.scheduledBefore,
        type: filters.type?.join(","),
        status: filters.status?.join(","),
      }
    : undefined;

// ==================== الوظائف الشاغرة ====================

export async function getJobPostings(filters?: JobSearchFilters): Promise<JobPosting[]> {
  const params = jobFiltersToParams(filters);
  const res = await apiClient.get<JobPosting[]>(
    "/recruitment/job-postings",
    params ? { params } : undefined
  );
  return dataOr(res, []);
}

export async function getJobPosting(id: string): Promise<JobPosting | null> {
  if (!id) return null;
  const res = await apiClient.get<JobPosting>(`/recruitment/job-postings/${encodeURIComponent(id)}`);
  return dataOrNull(res);
}

export async function createJobPosting(data: Partial<JobPosting>): Promise<JobPosting> {
  const res = await apiClient.post<JobPosting>("/recruitment/job-postings", data);
  return mustData(res);
}

export async function updateJobPosting(id: string, data: Partial<JobPosting>): Promise<JobPosting> {
  const res = await apiClient.put<JobPosting>(
    `/recruitment/job-postings/${encodeURIComponent(id)}`,
    data
  );
  return mustData(res);
}

export async function deleteJobPosting(id: string): Promise<void> {
  if (!id) return;
  const res = await apiClient.delete<void>(`/recruitment/job-postings/${encodeURIComponent(id)}`);
  if (!res.success) throw new Error(res.error || "Request failed");
}

// ==================== المتقدمين ====================

export async function getApplicants(filters?: ApplicantSearchFilters): Promise<Applicant[]> {
  const params = applicantFiltersToParams(filters);
  const res = await apiClient.get<Applicant[]>(
    "/recruitment/applicants",
    params ? { params } : undefined
  );
  return dataOr(res, []);
}

export async function getApplicant(id: string): Promise<Applicant | null> {
  if (!id) return null;
  const res = await apiClient.get<Applicant>(`/recruitment/applicants/${encodeURIComponent(id)}`);
  return dataOrNull(res);
}

export async function updateApplicantStatus(id: string, status: ApplicationStatus): Promise<Applicant> {
  const res = await apiClient.patch<Applicant>(
    `/recruitment/applicants/${encodeURIComponent(id)}/status`,
    { status }
  );
  return mustData(res);
}

export async function updateApplicantRating(id: string, rating: number): Promise<Applicant> {
  const res = await apiClient.patch<Applicant>(
    `/recruitment/applicants/${encodeURIComponent(id)}/rating`,
    { rating }
  );
  return mustData(res);
}

// ==================== المقابلات ====================

export async function getInterviews(filters?: InterviewSearchFilters): Promise<Interview[]> {
  const params = interviewFiltersToParams(filters);
  const res = await apiClient.get<Interview[]>(
    "/recruitment/interviews",
    params ? { params } : undefined
  );
  return dataOr(res, []);
}

export async function getInterview(id: string): Promise<Interview | null> {
  if (!id) return null;
  const res = await apiClient.get<Interview>(`/recruitment/interviews/${encodeURIComponent(id)}`);
  return dataOrNull(res);
}

export async function scheduleInterview(data: Partial<Interview>): Promise<Interview> {
  const res = await apiClient.post<Interview>("/recruitment/interviews", data);
  return mustData(res);
}

export async function updateInterviewStatus(id: string, status: Interview["status"]): Promise<Interview> {
  const res = await apiClient.patch<Interview>(
    `/recruitment/interviews/${encodeURIComponent(id)}/status`,
    { status }
  );
  return mustData(res);
}

export async function submitInterviewFeedback(
  interviewId: string,
  feedback: Interview["feedback"]
): Promise<Interview> {
  const res = await apiClient.post<Interview>(
    `/recruitment/interviews/${encodeURIComponent(interviewId)}/feedback`,
    { feedback }
  );
  return mustData(res);
}

// ==================== العروض الوظيفية ====================

export async function getJobOffers(status?: OfferStatus[]): Promise<JobOffer[]> {
  const res = await apiClient.get<JobOffer[]>(
    "/recruitment/job-offers",
    status ? { params: { status: status.join(",") } } : undefined
  );
  return dataOr(res, []);
}

export async function getJobOffer(id: string): Promise<JobOffer | null> {
  if (!id) return null;
  const res = await apiClient.get<JobOffer>(`/recruitment/job-offers/${encodeURIComponent(id)}`);
  return dataOrNull(res);
}

export async function createJobOffer(data: Partial<JobOffer>): Promise<JobOffer> {
  const res = await apiClient.post<JobOffer>("/recruitment/job-offers", data);
  return mustData(res);
}

export async function updateOfferStatus(id: string, status: OfferStatus): Promise<JobOffer> {
  const res = await apiClient.patch<JobOffer>(
    `/recruitment/job-offers/${encodeURIComponent(id)}/status`,
    { status }
  );
  return mustData(res);
}

// ==================== الإلحاق ====================

export async function getOnboardingProcesses(status?: OnboardingStatus[]): Promise<OnboardingProcess[]> {
  const res = await apiClient.get<OnboardingProcess[]>(
    "/recruitment/onboarding-processes",
    status ? { params: { status: status.join(",") } } : undefined
  );
  return dataOr(res, []);
}

export async function getOnboardingProcess(id: string): Promise<OnboardingProcess | null> {
  if (!id) return null;
  const res = await apiClient.get<OnboardingProcess>(
    `/recruitment/onboarding-processes/${encodeURIComponent(id)}`
  );
  return dataOrNull(res);
}

export async function createOnboardingProcess(
  employeeId: string,
  templateId?: string
): Promise<OnboardingProcess> {
  const res = await apiClient.post<OnboardingProcess>("/recruitment/onboarding-processes", {
    employeeId,
    templateId,
  });
  return mustData(res);
}

export async function updateOnboardingTask(
  processId: string,
  taskId: string,
  status: "pending" | "in-progress" | "completed"
): Promise<OnboardingProcess> {
  const res = await apiClient.patch<OnboardingProcess>(
    `/recruitment/onboarding-processes/${encodeURIComponent(processId)}/tasks/${encodeURIComponent(taskId)}`,
    { status }
  );
  return mustData(res);
}

// ==================== قوالب الإلحاق ====================

export async function getOnboardingTemplates(): Promise<OnboardingTemplate[]> {
  const res = await apiClient.get<OnboardingTemplate[]>("/recruitment/onboarding-templates");
  return dataOr(res, []);
}

export async function getOnboardingTemplate(id: string): Promise<OnboardingTemplate | null> {
  if (!id) return null;
  const res = await apiClient.get<OnboardingTemplate>(
    `/recruitment/onboarding-templates/${encodeURIComponent(id)}`
  );
  return dataOrNull(res);
}

export async function createOnboardingTemplate(
  data: Partial<OnboardingTemplate>
): Promise<OnboardingTemplate> {
  const res = await apiClient.post<OnboardingTemplate>("/recruitment/onboarding-templates", data);
  return mustData(res);
}

// ==================== الإحصائيات ====================

export async function getRecruitmentStats(): Promise<RecruitmentStats> {
  const res = await apiClient.get<RecruitmentStats>("/recruitment/stats");
  return mustData(res);
}

export async function getRecruitmentPipeline(): Promise<RecruitmentPipeline[]> {
  const res = await apiClient.get<RecruitmentPipeline[]>("/recruitment/pipeline");
  return dataOr(res, []);
}

/*
import apiClient from '@/lib/api/client';
import type {
  Applicant,
  ApplicantSearchFilters,
  ApplicationStatus,
  Interview,
  InterviewSearchFilters,
  JobOffer,
  JobPosting,
  JobSearchFilters,
  OfferStatus,
  OnboardingProcess,
  OnboardingStatus,
  OnboardingTemplate,
  RecruitmentPipeline,
  RecruitmentStats,
} from '@/lib/types/recruitment';

const dataOr = <T>(
  res: { success: boolean; data?: T; error?: string },
  fallback: T
): T => (res.success && res.data !== undefined ? res.data : fallback);

const dataOrNull = <T>(
  res: { success: boolean; data?: T; error?: string }
): T | null => (res.success && res.data !== undefined ? res.data : null);

const mustData = <T>(res: { success: boolean; data?: T; error?: string }): T => {
  if (res.success && res.data !== undefined) return res.data;
  throw new Error(res.error || 'Request failed');
};

// ==================== الوظائف الشاغرة ====================
  const res = await apiClient.get<JobPosting[]>('/recruitment/job-postings', filters);
  return dataOr(res, []);
  await delay(300);
  let jobs = [...mockJobPostings];
import apiClient from '@/lib/api/client';
import type {
  Applicant,
  ApplicantSearchFilters,
  ApplicationStatus,
  Interview,
  InterviewSearchFilters,
  JobOffer,
  JobPosting,
  JobSearchFilters,
  OfferStatus,
  OnboardingProcess,
  OnboardingStatus,
  OnboardingTemplate,
  RecruitmentPipeline,
  RecruitmentStats,
} from '@/lib/types/recruitment';
  if (!id) return null;
  const res = await apiClient.get<JobPosting>(`/recruitment/job-postings/${encodeURIComponent(id)}`);
  return dataOrNull(res);
    jobs = jobs.filter(j => 
      j.title.toLowerCase().includes(q) ||
      j.departmentName.toLowerCase().includes(q) ||
  const res = await apiClient.post<JobPosting>('/recruitment/job-postings', data);
  return mustData(res);
}

export async function createJobPosting(data: Partial<JobPosting>): Promise<JobPosting> {
  const res = await apiClient.put<JobPosting>(`/recruitment/job-postings/${encodeURIComponent(id)}`, data);
  return mustData(res);
    description: data.description || '',
    departmentId: data.departmentId || '',
    departmentName: data.departmentName || '',
  if (!id) return;
  const res = await apiClient.delete<void>(`/recruitment/job-postings/${encodeURIComponent(id)}`);
  if (!res.success) throw new Error(res.error || 'Request failed');
    currency: data.currency || 'SAR',
    showSalary: data.showSalary || false,
    status: 'draft',
  const res = await apiClient.get<Applicant[]>('/recruitment/applicants', filters);
  return dataOr(res, []);
    requirements: data.requirements || [],
    responsibilities: data.responsibilities || [],
    openPositions: data.openPositions || 1,
  if (!id) return null;
  const res = await apiClient.get<Applicant>(`/recruitment/applicants/${encodeURIComponent(id)}`);
  return dataOrNull(res);
    createdBy: 'current-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  const res = await apiClient.patch<Applicant>(
    `/recruitment/applicants/${encodeURIComponent(id)}/status`,
    { status }
  );
  return mustData(res);

export async function updateJobPosting(id: string, data: Partial<JobPosting>): Promise<JobPosting> {
  await delay(400);
  const res = await apiClient.patch<Applicant>(
    `/recruitment/applicants/${encodeURIComponent(id)}/rating`,
    { rating }
  );
  return mustData(res);

export async function deleteJobPosting(id: string): Promise<void> {
  await delay(300);
  const res = await apiClient.get<Interview[]>('/recruitment/interviews', filters);
  return dataOr(res, []);
}

// ==================== المتقدمين ====================
  if (!id) return null;
  const res = await apiClient.get<Interview>(`/recruitment/interviews/${encodeURIComponent(id)}`);
  return dataOrNull(res);
  await delay(300);
  let applicants = [...mockApplicants];
  
  const res = await apiClient.post<Interview>('/recruitment/interviews', data);
  return mustData(res);
  }
  
  return applicants;
  const res = await apiClient.patch<Interview>(
    `/recruitment/interviews/${encodeURIComponent(id)}/status`,
    { status }
  );
  return mustData(res);
  return mockApplicants.find(a => a.id === id) || null;
}

export async function updateApplicantStatus(id: string, status: ApplicationStatus): Promise<Applicant> {
  await delay(300);
  const applicant = mockApplicants.find(a => a.id === id);
  const res = await apiClient.post<Interview>(
    `/recruitment/interviews/${encodeURIComponent(interviewId)}/feedback`,
    { feedback }
  );
  return mustData(res);
  return { ...applicant, rating, updatedAt: new Date().toISOString() };
}

  const res = await apiClient.get<JobOffer[]>('/recruitment/job-offers', status ? { status } : undefined);
  return dataOr(res, []);
  await delay(300);
  let interviews = [...mockInterviews];
  
  if (!id) return null;
  const res = await apiClient.get<JobOffer>(`/recruitment/job-offers/${encodeURIComponent(id)}`);
  return dataOrNull(res);
  }
  
  if (filters?.jobPostingId) {
  const res = await apiClient.post<JobOffer>('/recruitment/job-offers', data);
  return mustData(res);
    applicantName: data.applicantName || '',
    jobPostingId: data.jobPostingId || '',
    jobTitle: data.jobTitle || '',
  const res = await apiClient.patch<JobOffer>(
    `/recruitment/job-offers/${encodeURIComponent(id)}/status`,
    { status }
  );
  return mustData(res);
    scheduledDate: data.scheduledDate || '',
    scheduledTime: data.scheduledTime || '',
    duration: data.duration || 60,
  const res = await apiClient.get<OnboardingProcess[]>(
    '/recruitment/onboarding-processes',
    status ? { status } : undefined
  );
  return dataOr(res, []);
    updatedAt: new Date().toISOString(),
    ...data,
  };
  if (!id) return null;
  const res = await apiClient.get<OnboardingProcess>(
    `/recruitment/onboarding-processes/${encodeURIComponent(id)}`
  );
  return dataOrNull(res);

export async function updateInterviewStatus(id: string, status: Interview['status']): Promise<Interview> {
  await delay(300);
  const interview = mockInterviews.find(i => i.id === id);
  if (!interview) throw new Error('المقابلة غير موجودة');
  return { ...interview, status, updatedAt: new Date().toISOString() };
  const res = await apiClient.post<OnboardingProcess>('/recruitment/onboarding-processes', {
    employeeId,
    templateId,
  });
  return mustData(res);
// ==================== العروض الوظيفية ====================

export async function getJobOffers(status?: OfferStatus[]): Promise<JobOffer[]> {
  await delay(300);
  // بيانات وهمية
  return [];
}
  const res = await apiClient.patch<OnboardingProcess>(
    `/recruitment/onboarding-processes/${encodeURIComponent(processId)}/tasks/${encodeURIComponent(taskId)}`,
    { status }
  );
  return mustData(res);
  await delay(200);
  return null;
}
  const res = await apiClient.get<OnboardingTemplate[]>('/recruitment/onboarding-templates');
  return dataOr(res, []);
  await delay(400);
  const newOffer: JobOffer = {
    id: `offer-${Date.now()}`,
  if (!id) return null;
  const res = await apiClient.get<OnboardingTemplate>(
    `/recruitment/onboarding-templates/${encodeURIComponent(id)}`
  );
  return dataOrNull(res);
    applicantEmail: data.applicantEmail || '',
    jobPostingId: data.jobPostingId || '',
    jobTitle: data.jobTitle || '',
    departmentId: data.departmentId || '',
    departmentName: data.departmentName || '',
  const res = await apiClient.post<OnboardingTemplate>('/recruitment/onboarding-templates', data);
  return mustData(res);
}

export async function updateOfferStatus(id: string, status: OfferStatus): Promise<JobOffer> {
  const res = await apiClient.get<RecruitmentStats>('/recruitment/stats');
  return mustData(res);
}

export async function getRecruitmentPipeline(): Promise<RecruitmentPipeline[]> {
  const res = await apiClient.get<RecruitmentPipeline[]>('/recruitment/pipeline');
  return dataOr(res, []);
  await delay(200);
  return null;
}

export async function createOnboardingProcess(
  employeeId: string,
  templateId?: string
): Promise<OnboardingProcess> {
  await delay(400);
  const newProcess: OnboardingProcess = {
    id: `onb-${Date.now()}`,
    employeeId,
    employeeName: '',
    jobTitle: '',
    departmentName: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'not-started',
    progress: 0,
    tasks: [],
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newProcess;
}

export async function updateOnboardingTask(
  processId: string,
  taskId: string,
  status: 'pending' | 'in-progress' | 'completed'
): Promise<OnboardingProcess> {
  await delay(300);
  throw new Error('العملية غير موجودة');
}

// ==================== قوالب الإلحاق ====================

export async function getOnboardingTemplates(): Promise<OnboardingTemplate[]> {
  await delay(300);
  return [];
}

export async function getOnboardingTemplate(id: string): Promise<OnboardingTemplate | null> {
  await delay(200);
  return null;
}

export async function createOnboardingTemplate(
  data: Partial<OnboardingTemplate>
): Promise<OnboardingTemplate> {
  await delay(400);
  const newTemplate: OnboardingTemplate = {
    id: `temp-${Date.now()}`,
    name: data.name || '',
    isDefault: data.isDefault || false,
    tasks: data.tasks || [],
    documents: data.documents || [],
    duration: data.duration || 30,
    createdBy: 'current-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
  return newTemplate;
}

// ==================== الإحصائيات ====================

export async function getRecruitmentStats(): Promise<RecruitmentStats> {
  await delay(300);
  return mockRecruitmentStats;
}

export async function getRecruitmentPipeline() {
  await delay(200);
  return mockRecruitmentStats.applicationsByStatus.map(item => ({
    stage: item.status,
    count: item.count,
    percentage: Math.round((item.count / mockRecruitmentStats.totalApplications) * 100),
  }));
}

*/
