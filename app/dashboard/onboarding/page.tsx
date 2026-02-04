import { OnboardingManagerNew } from "./onboarding-manager-new";

export default function OnboardingPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إلحاق الموظفين</h1>
          <p className="text-muted-foreground">متابعة إجراءات الموظفين الجدد</p>
        </div>
      </div>
      <OnboardingManagerNew />
    </div>
  );
}
