'use client';

import { useState } from 'react';
import { 
  Settings, Building2, Globe, Shield, Bell, Link, Database,
  Users, Calendar, Wallet, Clock, ChevronLeft, Save, RefreshCw,
  Plus, Edit, Trash2, Check, X, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  mockSystemSettings,
  mockRoles,
  mockLeaveTypes,
  mockWorkflows,
  type SystemSettings,
  type Role,
  type LeaveTypeConfig,
  type ApprovalWorkflow,
  moduleLabels,
} from '@/lib/types/settings';

export default function SettingsManager() {
  const [settings, setSettings] = useState<SystemSettings>(mockSystemSettings);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeConfig[]>(mockLeaveTypes);
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>(mockWorkflows);
  const [activeSection, setActiveSection] = useState('general');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isLeaveTypeDialogOpen, setIsLeaveTypeDialogOpen] = useState(false);

  const sections = [
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">الإعدادات</h1>
          <p className="text-muted-foreground">إعدادات النظام والتكوينات</p>
        </div>
        <Button>
          <Save className="h-4 w-4 ms-2" />
          حفظ جميع التغييرات
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
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

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  الإعدادات العامة
                </CardTitle>
                <CardDescription>معلومات الشركة والإعدادات الأساسية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>اسم الشركة (عربي)</Label>
                    <Input 
                      value={settings.general.companyName}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: {...settings.general, companyName: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم الشركة (إنجليزي)</Label>
                    <Input 
                      value={settings.general.companyNameEn || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: {...settings.general, companyNameEn: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المنطقة الزمنية</Label>
                    <Select 
                      value={settings.general.timezone}
                      onValueChange={(value) => setSettings({
                        ...settings,
                        general: {...settings.general, timezone: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                        <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                        <SelectItem value="Asia/Kuwait">الكويت (GMT+3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>العملة</Label>
                    <Select 
                      value={settings.general.currency}
                      onValueChange={(value) => setSettings({
                        ...settings,
                        general: {...settings.general, currency: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                        <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                        <SelectItem value="KWD">دينار كويتي (KWD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>تنسيق التاريخ</Label>
                    <Select 
                      value={settings.general.dateFormat}
                      onValueChange={(value) => setSettings({
                        ...settings,
                        general: {...settings.general, dateFormat: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>تنسيق الوقت</Label>
                    <Select 
                      value={settings.general.timeFormat}
                      onValueChange={(value: '12h' | '24h') => setSettings({
                        ...settings,
                        general: {...settings.general, timeFormat: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 ساعة (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 ساعة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  إعدادات الأمان
                </CardTitle>
                <CardDescription>سياسات كلمة المرور والحماية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">سياسة كلمة المرور</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>الحد الأدنى للأحرف</Label>
                      <Input 
                        type="number"
                        value={settings.security.passwordPolicy.minLength}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordPolicy: {
                              ...settings.security.passwordPolicy,
                              minLength: parseInt(e.target.value)
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>انتهاء الصلاحية (أيام)</Label>
                      <Input 
                        type="number"
                        value={settings.security.passwordPolicy.expiryDays}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordPolicy: {
                              ...settings.security.passwordPolicy,
                              expiryDays: parseInt(e.target.value)
                            }
                          }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: 'requireUppercase', label: 'يتطلب أحرف كبيرة' },
                      { key: 'requireLowercase', label: 'يتطلب أحرف صغيرة' },
                      { key: 'requireNumbers', label: 'يتطلب أرقام' },
                      { key: 'requireSpecialChars', label: 'يتطلب رموز خاصة' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-2">
                        <Label>{item.label}</Label>
                        <Switch 
                          checked={settings.security.passwordPolicy[item.key as keyof typeof settings.security.passwordPolicy] as boolean}
                          onCheckedChange={(checked) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              passwordPolicy: {
                                ...settings.security.passwordPolicy,
                                [item.key]: checked
                              }
                            }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-semibold">إعدادات الجلسة</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>مهلة الجلسة (دقائق)</Label>
                      <Input 
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: {...settings.security, sessionTimeout: parseInt(e.target.value)}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الحد الأقصى لمحاولات تسجيل الدخول</Label>
                      <Input 
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: {...settings.security, maxLoginAttempts: parseInt(e.target.value)}
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label>المصادقة الثنائية</Label>
                      <p className="text-sm text-muted-foreground">تفعيل المصادقة بخطوتين</p>
                    </div>
                    <Select 
                      value={settings.security.twoFactorAuth}
                      onValueChange={(value: 'disabled' | 'optional' | 'required') => setSettings({
                        ...settings,
                        security: {...settings.security, twoFactorAuth: value}
                      })}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disabled">معطل</SelectItem>
                        <SelectItem value="optional">اختياري</SelectItem>
                        <SelectItem value="required">إلزامي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label>سجل التدقيق</Label>
                      <p className="text-sm text-muted-foreground">تسجيل جميع العمليات</p>
                    </div>
                    <Switch 
                      checked={settings.security.auditLogging}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        security: {...settings.security, auditLogging: checked}
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations */}
          {activeSection === 'integrations' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  التكاملات
                </CardTitle>
                <CardDescription>ربط النظام مع الخدمات الحكومية والأنظمة الأخرى</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'gosi', name: 'التأمينات الاجتماعية (GOSI)', field: 'subscriberNumber', fieldLabel: 'رقم المشترك' },
                  { key: 'mol', name: 'وزارة العمل', field: 'establishmentNumber', fieldLabel: 'رقم المنشأة' },
                  { key: 'muqeem', name: 'مقيم', field: 'username', fieldLabel: 'اسم المستخدم' },
                  { key: 'mudad', name: 'مدد', field: 'organizationId', fieldLabel: 'رقم المنظمة' },
                ].map((integration) => (
                  <div key={integration.key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          settings.integrations[integration.key as keyof typeof settings.integrations] &&
                          (settings.integrations[integration.key as keyof typeof settings.integrations] as {enabled: boolean}).enabled
                            ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Link className={`h-5 w-5 ${
                            settings.integrations[integration.key as keyof typeof settings.integrations] &&
                            (settings.integrations[integration.key as keyof typeof settings.integrations] as {enabled: boolean}).enabled
                              ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{integration.name}</h4>
                          <Badge variant={
                            settings.integrations[integration.key as keyof typeof settings.integrations] &&
                            (settings.integrations[integration.key as keyof typeof settings.integrations] as {enabled: boolean}).enabled
                              ? 'default' : 'secondary'
                          }>
                            {settings.integrations[integration.key as keyof typeof settings.integrations] &&
                            (settings.integrations[integration.key as keyof typeof settings.integrations] as {enabled: boolean}).enabled
                              ? 'مفعل' : 'غير مفعل'}
                          </Badge>
                        </div>
                      </div>
                      <Switch 
                        checked={
                          settings.integrations[integration.key as keyof typeof settings.integrations] 
                            ? (settings.integrations[integration.key as keyof typeof settings.integrations] as {enabled: boolean}).enabled 
                            : false
                        }
                      />
                    </div>
                    {settings.integrations[integration.key as keyof typeof settings.integrations] &&
                     (settings.integrations[integration.key as keyof typeof settings.integrations] as {enabled: boolean}).enabled && (
                      <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                        <div className="space-y-2">
                          <Label>{integration.fieldLabel}</Label>
                          <Input placeholder={`أدخل ${integration.fieldLabel}`} />
                        </div>
                        <div className="flex items-end gap-2">
                          <Button variant="outline">
                            <RefreshCw className="h-4 w-4 ms-2" />
                            مزامنة الآن
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Roles & Permissions */}
          {activeSection === 'roles' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      الأدوار والصلاحيات
                    </CardTitle>
                    <CardDescription>إدارة أدوار المستخدمين وصلاحياتهم</CardDescription>
                  </div>
                  <Button onClick={() => setIsRoleDialogOpen(true)}>
                    <Plus className="h-4 w-4 ms-2" />
                    دور جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{role.name}</h4>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">{role.usersCount} مستخدم</Badge>
                        {role.isSystem && <Badge variant="outline">نظام</Badge>}
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 ms-1" />
                          تعديل
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leave Types */}
          {activeSection === 'leaves' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      أنواع الإجازات
                    </CardTitle>
                    <CardDescription>إدارة أنواع الإجازات وسياساتها</CardDescription>
                  </div>
                  <Button onClick={() => setIsLeaveTypeDialogOpen(true)}>
                    <Plus className="h-4 w-4 ms-2" />
                    نوع إجازة جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveTypes.map((leaveType) => (
                    <div key={leaveType.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          leaveType.isActive ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Calendar className={`h-5 w-5 ${
                            leaveType.isActive ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{leaveType.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{leaveType.annualEntitlement} يوم سنوياً</span>
                            <span>•</span>
                            <span>{leaveType.isPaid ? 'مدفوعة' : 'غير مدفوعة'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={leaveType.isActive ? 'default' : 'secondary'}>
                          {leaveType.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                        <Switch 
                          checked={leaveType.isActive}
                          onCheckedChange={(checked) => {
                            setLeaveTypes(leaveTypes.map(lt => 
                              lt.id === leaveType.id ? {...lt, isActive: checked} : lt
                            ));
                          }}
                        />
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Workflows */}
          {activeSection === 'workflows' && (
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
                  <Button>
                    <Plus className="h-4 w-4 ms-2" />
                    سير عمل جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
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
                          <Button variant="outline" size="sm">تعديل</Button>
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
                                {step.approverType === 'direct-manager' ? 'المدير المباشر' :
                                 step.approverType === 'department-head' ? 'مدير القسم' :
                                 step.approverType === 'hr' ? 'الموارد البشرية' : step.approverType}
                              </span>
                            </div>
                            {index < workflow.steps.length - 1 && (
                              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Backup Settings */}
          {activeSection === 'backup' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  النسخ الاحتياطي
                </CardTitle>
                <CardDescription>إعدادات النسخ الاحتياطي التلقائي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label>النسخ الاحتياطي التلقائي</Label>
                    <p className="text-sm text-muted-foreground">تفعيل النسخ الاحتياطي الدوري</p>
                  </div>
                  <Switch 
                    checked={settings.backup.autoBackup}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      backup: {...settings.backup, autoBackup: checked}
                    })}
                  />
                </div>
                {settings.backup.autoBackup && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>التكرار</Label>
                        <Select 
                          value={settings.backup.frequency}
                          onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSettings({
                            ...settings,
                            backup: {...settings.backup, frequency: value}
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">يومياً</SelectItem>
                            <SelectItem value="weekly">أسبوعياً</SelectItem>
                            <SelectItem value="monthly">شهرياً</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>مدة الاحتفاظ (أيام)</Label>
                        <Input 
                          type="number"
                          value={settings.backup.retentionDays}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {...settings.backup, retentionDays: parseInt(e.target.value)}
                          })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label>تضمين المرفقات</Label>
                        <p className="text-sm text-muted-foreground">نسخ الملفات والمستندات</p>
                      </div>
                      <Switch 
                        checked={settings.backup.includeAttachments}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          backup: {...settings.backup, includeAttachments: checked}
                        })}
                      />
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-muted-foreground">آخر نسخة احتياطية</p>
                          <p className="font-medium">
                            {settings.backup.lastBackup 
                              ? new Date(settings.backup.lastBackup).toLocaleString('ar-SA')
                              : 'لم يتم بعد'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">النسخة التالية</p>
                          <p className="font-medium">
                            {settings.backup.nextBackup 
                              ? new Date(settings.backup.nextBackup).toLocaleString('ar-SA')
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <Button variant="outline">
                  <Database className="h-4 w-4 ms-2" />
                  إنشاء نسخة احتياطية الآن
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  إعدادات الإشعارات
                </CardTitle>
                <CardDescription>تكوين قنوات الإشعارات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'emailEnabled', label: 'البريد الإلكتروني', icon: '📧' },
                  { key: 'smsEnabled', label: 'الرسائل النصية', icon: '📱' },
                  { key: 'pushEnabled', label: 'إشعارات الدفع', icon: '🔔' },
                ].map((channel) => (
                  <div key={channel.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{channel.icon}</span>
                      <Label>{channel.label}</Label>
                    </div>
                    <Switch 
                      checked={settings.notifications[channel.key as keyof typeof settings.notifications] as boolean}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: {...settings.notifications, [channel.key]: checked}
                      })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Localization Settings */}
          {activeSection === 'localization' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  اللغة والتنسيق
                </CardTitle>
                <CardDescription>إعدادات اللغة والتقويم</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>اللغة الافتراضية</Label>
                    <Select 
                      value={settings.localization.defaultLanguage}
                      onValueChange={(value: 'ar' | 'en') => setSettings({
                        ...settings,
                        localization: {...settings.localization, defaultLanguage: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>نوع التقويم</Label>
                    <Select 
                      value={settings.localization.calendarType}
                      onValueChange={(value: 'gregorian' | 'hijri' | 'both') => setSettings({
                        ...settings,
                        localization: {...settings.localization, calendarType: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gregorian">ميلادي</SelectItem>
                        <SelectItem value="hijri">هجري</SelectItem>
                        <SelectItem value="both">كلاهما</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
