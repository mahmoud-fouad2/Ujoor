import {
  Bell,
  Building2,
  Calendar,
  Database,
  Globe,
  Link,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export type SettingsSectionId =
  | 'general'
  | 'localization'
  | 'security'
  | 'notifications'
  | 'integrations'
  | 'backup'
  | 'roles'
  | 'leaves'
  | 'workflows';

const SECTIONS: Array<{ id: SettingsSectionId; label: string; icon: LucideIcon }> = [
  { id: 'general', label: 'الإعدادات العامة', icon: Building2 },
  { id: 'localization', label: 'اللغة والتنسيق', icon: Globe },
  { id: 'security', label: 'الأمان', icon: Shield },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
  { id: 'integrations', label: 'التكاملات', icon: Link },
  { id: 'backup', label: 'النسخ الاحتياطي', icon: Database },
  { id: 'roles', label: 'الأدوار والصلاحيات', icon: Users },
  { id: 'leaves', label: 'أنواع الإجازات', icon: Calendar },
  { id: 'workflows', label: 'سير العمل', icon: Settings },
];

export function SettingsSidebar({
  activeSection,
  onChange,
}: {
  activeSection: SettingsSectionId;
  onChange: (section: SettingsSectionId) => void;
}) {
  return (
    <Card className="lg:col-span-1">
      <CardContent className="p-2">
        <nav className="space-y-1">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => onChange(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}
