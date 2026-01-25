"use client";

import { useRef, useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Building2, Calendar, CreditCard,
  Shield, Edit, Save, X, Camera, FileText, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockEmployeeProfile, type EmployeeProfile } from '@/lib/types/self-service';

export default function MyProfileManager() {
  // TODO: Replace with API call + R2 for avatar
  const [profile, setProfile] = useState<EmployeeProfile>(mockEmployeeProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<EmployeeProfile>(mockEmployeeProfile);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = () => {
    // TODO: API call to save profile + upload avatar to R2
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const openAvatarPicker = () => {
    fileInputRef.current?.click();
  };

  const onAvatarSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 3 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null;
      if (!dataUrl) return;
      setEditedProfile((p) => ({ ...p, avatar: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">ملفي الشخصي</h1>
          <p className="text-muted-foreground">عرض وتعديل معلوماتك الشخصية</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 me-2" />
                إلغاء
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 me-2" />
                حفظ التغييرات
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 me-2" />
              تعديل البيانات
            </Button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute bottom-0 start-0 h-8 w-8 rounded-full"
                  onClick={openAvatarPicker}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarSelected}
              />
            </div>
            <div className="text-center sm:text-start flex-1">
              <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-muted-foreground">{profile.jobTitle}</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 sm:justify-start">
                <Badge variant="secondary">{profile.departmentName}</Badge>
                <Badge variant="outline">#{profile.employeeNumber}</Badge>
              </div>
            </div>
            <div className="text-center sm:text-start">
              <p className="text-sm text-muted-foreground">تاريخ الانضمام</p>
              <p className="font-medium">{new Date(profile.hireDate).toLocaleDateString('ar-SA')}</p>
              <p className="text-sm text-muted-foreground mt-2">المدير المباشر</p>
              <p className="font-medium">{profile.managerName || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
          <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
          <TabsTrigger value="bank">البيانات البنكية</TabsTrigger>
          <TabsTrigger value="documents">المستندات</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                المعلومات الشخصية
              </CardTitle>
              <CardDescription>البيانات الأساسية والشخصية</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>الاسم الأول (عربي)</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.firstName}
                    onChange={(e) => setEditedProfile({...editedProfile, firstName: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>الاسم الأخير (عربي)</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.lastName}
                    onChange={(e) => setEditedProfile({...editedProfile, lastName: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.lastName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>الاسم الأول (إنجليزي)</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.firstNameEn || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, firstNameEn: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.firstNameEn || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>الاسم الأخير (إنجليزي)</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.lastNameEn || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, lastNameEn: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.lastNameEn || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>تاريخ الميلاد</Label>
                {isEditing ? (
                  <Input 
                    type="date"
                    value={editedProfile.birthDate || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, birthDate: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">
                    {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('ar-SA') : '-'}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>الجنس</Label>
                {isEditing ? (
                  <Select 
                    value={editedProfile.gender}
                    onValueChange={(value: 'male' | 'female') => setEditedProfile({...editedProfile, gender: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">
                    {profile.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>الحالة الاجتماعية</Label>
                {isEditing ? (
                  <Select 
                    value={editedProfile.maritalStatus || ''}
                    onValueChange={(value: 'single' | 'married' | 'divorced' | 'widowed') => 
                      setEditedProfile({...editedProfile, maritalStatus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">أعزب</SelectItem>
                      <SelectItem value="married">متزوج</SelectItem>
                      <SelectItem value="divorced">مطلق</SelectItem>
                      <SelectItem value="widowed">أرمل</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">
                    {profile.maritalStatus === 'single' ? 'أعزب' : 
                     profile.maritalStatus === 'married' ? 'متزوج' : 
                     profile.maritalStatus === 'divorced' ? 'مطلق' : 'أرمل'}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>الجنسية</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.nationality || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, nationality: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.nationality || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>رقم الهوية</Label>
                <p className="text-sm font-medium p-2 bg-muted rounded flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  {profile.nationalId || '-'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Info Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                معلومات الاتصال
              </CardTitle>
              <CardDescription>بيانات التواصل والعنوان</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <p className="text-sm font-medium p-2 bg-muted rounded flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {profile.email}
                </p>
              </div>
              <div className="space-y-2">
                <Label>رقم الجوال</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {profile.phone}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Separator className="my-4" />
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  العنوان
                </h4>
              </div>
              <div className="space-y-2">
                <Label>الشارع</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.address?.street || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile, 
                      address: {...editedProfile.address, street: e.target.value}
                    })}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.address?.street || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>المدينة</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.address?.city || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile, 
                      address: {...editedProfile.address, city: e.target.value}
                    })}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.address?.city || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>الدولة</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.address?.country || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile, 
                      address: {...editedProfile.address, country: e.target.value}
                    })}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.address?.country || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>الرمز البريدي</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.address?.postalCode || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile, 
                      address: {...editedProfile.address, postalCode: e.target.value}
                    })}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.address?.postalCode || '-'}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Separator className="my-4" />
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  جهة اتصال الطوارئ
                </h4>
              </div>
              <div className="space-y-2">
                <Label>الاسم</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.emergencyContact?.name || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile, 
                      emergencyContact: {...editedProfile.emergencyContact!, name: e.target.value}
                    })}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.emergencyContact?.name || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>صلة القرابة</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.emergencyContact?.relationship || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile, 
                      emergencyContact: {...editedProfile.emergencyContact!, relationship: e.target.value}
                    })}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.emergencyContact?.relationship || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.emergencyContact?.phone || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile, 
                      emergencyContact: {...editedProfile.emergencyContact!, phone: e.target.value}
                    })}
                  />
                ) : (
                  <p className="text-sm font-medium p-2 bg-muted rounded">{profile.emergencyContact?.phone || '-'}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Info Tab */}
        <TabsContent value="bank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                البيانات البنكية
              </CardTitle>
              <CardDescription>معلومات الحساب البنكي لتحويل الراتب</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>اسم البنك</Label>
                <p className="text-sm font-medium p-2 bg-muted rounded">{profile.bankInfo?.bankName || '-'}</p>
              </div>
              <div className="space-y-2">
                <Label>رقم الحساب</Label>
                <p className="text-sm font-medium p-2 bg-muted rounded">{profile.bankInfo?.accountNumber || '-'}</p>
              </div>
              <div className="space-y-2">
                <Label>رقم الآيبان</Label>
                <p className="text-sm font-medium p-2 bg-muted rounded">{profile.bankInfo?.iban || '-'}</p>
              </div>
              <div className="space-y-2">
                <Label>رمز SWIFT</Label>
                <p className="text-sm font-medium p-2 bg-muted rounded">{profile.bankInfo?.swiftCode || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    لتحديث البيانات البنكية، يرجى التواصل مع قسم الموارد البشرية
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                المستندات
              </CardTitle>
              <CardDescription>الوثائق والمستندات الشخصية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'صورة الهوية', type: 'id', status: 'valid' },
                  { name: 'صورة جواز السفر', type: 'passport', status: 'expiring' },
                  { name: 'عقد العمل', type: 'contract', status: 'valid' },
                  { name: 'شهادات التدريب', type: 'certificate', status: 'valid' },
                ].map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{doc.name}</p>
                      <Badge variant={doc.status === 'valid' ? 'outline' : 'destructive'} className="text-xs mt-1">
                        {doc.status === 'valid' ? 'سارية' : 'تنتهي قريباً'}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">عرض</Button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <Camera className="h-4 w-4 me-2" />
                  رفع مستند جديد
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
