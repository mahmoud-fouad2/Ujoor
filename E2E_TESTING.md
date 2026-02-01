# 🧪 اختبار E2E كامل للنظام

## 🎯 البيئة
- **URL:** https://ujoor.onrender.com
- **Admin:** admin@admin.com / 123456

---

## 📋 سيناريو الاختبار الكامل

### 1️⃣ **تسجيل الدخول (Web Dashboard)**

```bash
# تسجيل دخول Admin
curl -X POST https://ujoor.onrender.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@admin.com",
    "password": "123456"
  }'
```

**النتيجة المتوقعة:**
```json
{
  "user": {
    "id": "...",
    "email": "admin@admin.com",
    "role": "SUPER_ADMIN",
    "firstName": "Super",
    "lastName": "Admin"
  }
}
```

---

### 2️⃣ **Mobile App - Login**

```bash
# تسجيل دخول من التطبيق
curl -X POST https://ujoor.onrender.com/api/mobile/auth/login \
  -H "Content-Type: application/json" \
  -H "x-device-id: TEST-DEVICE-001" \
  -H "x-device-platform: android" \
  -H "x-device-name: Samsung Galaxy S21" \
  -H "x-app-version: 1.0.0" \
  -d '{
    "email": "admin@admin.com",
    "password": "123456"
  }'
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "admin@admin.com",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "SUPER_ADMIN"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "rt_xxxxx",
  "expiresIn": 86400
}
```

**احفظ الـ `accessToken` للاستخدام في الطلبات التالية!**

---

### 3️⃣ **التحقق من الجلسة (Profile)**

```bash
# استبدل YOUR_TOKEN بالـ accessToken من الخطوة السابقة
curl -X GET https://ujoor.onrender.com/api/mobile/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-device-id: TEST-DEVICE-001"
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "admin@admin.com",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "SUPER_ADMIN"
  }
}
```

---

### 4️⃣ **إنشاء موظف جديد**

```bash
curl -X POST https://ujoor.onrender.com/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-device-id: TEST-DEVICE-001" \
  -d '{
    "firstName": "محمد",
    "lastName": "أحمد",
    "email": "mohamed.ahmed@company.com",
    "phone": "+966501234567",
    "nationalId": "1234567890",
    "dateOfBirth": "1990-01-15",
    "gender": "MALE",
    "nationality": "SA",
    "hireDate": "2024-01-01",
    "employmentType": "FULL_TIME",
    "contractType": "PERMANENT",
    "salary": 8000,
    "salaryCurrency": "SAR"
  }'
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "employee": {
    "id": "clx...",
    "employeeCode": "EMP-00001",
    "firstName": "محمد",
    "lastName": "أحمد",
    "email": "mohamed.ahmed@company.com",
    "status": "ACTIVE"
  }
}
```

**احفظ `employee.id` للخطوة التالية!**

---

### 5️⃣ **تسجيل حضور (Check-in)**

```bash
curl -X POST https://ujoor.onrender.com/api/mobile/attendance \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-device-id: TEST-DEVICE-001" \
  -d '{
    "action": "CHECK_IN",
    "location": {
      "lat": 24.7136,
      "lng": 46.6753,
      "accuracy": 10
    },
    "notes": "وصلت في الموعد"
  }'
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "record": {
    "id": "...",
    "employeeId": "...",
    "date": "2026-02-01",
    "checkInTime": "2026-02-01T08:30:00Z",
    "checkInLocation": {
      "lat": 24.7136,
      "lng": 46.6753
    },
    "status": "PRESENT"
  }
}
```

---

### 6️⃣ **تسجيل انصراف (Check-out)**

```bash
curl -X POST https://ujoor.onrender.com/api/mobile/attendance \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-device-id: TEST-DEVICE-001" \
  -d '{
    "action": "CHECK_OUT",
    "location": {
      "lat": 24.7136,
      "lng": 46.6753,
      "accuracy": 12
    },
    "notes": "انتهى العمل"
  }'
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "record": {
    "id": "...",
    "checkOutTime": "2026-02-01T17:00:00Z",
    "totalHours": 8.5,
    "status": "PRESENT"
  }
}
```

---

### 7️⃣ **استعراض سجل الحضور**

```bash
curl -X GET "https://ujoor.onrender.com/api/mobile/attendance?date=2026-02-01" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-device-id: TEST-DEVICE-001"
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "records": [
    {
      "id": "...",
      "date": "2026-02-01",
      "checkInTime": "2026-02-01T08:30:00Z",
      "checkOutTime": "2026-02-01T17:00:00Z",
      "totalHours": 8.5,
      "status": "PRESENT"
    }
  ]
}
```

---

### 8️⃣ **تقديم طلب إجازة**

```bash
curl -X POST https://ujoor.onrender.com/api/leave-requests \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-device-id: TEST-DEVICE-001" \
  -d '{
    "leaveTypeId": "ANNUAL",
    "startDate": "2026-02-10",
    "endDate": "2026-02-14",
    "reason": "إجازة سنوية",
    "totalDays": 5
  }'
```

---

### 9️⃣ **Recruitment - إنشاء وظيفة جديدة**

```bash
curl -X POST https://ujoor.onrender.com/api/recruitment/job-postings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-device-id: TEST-DEVICE-001" \
  -d '{
    "title": "مطور Full Stack",
    "description": "نبحث عن مطور ويب محترف",
    "status": "OPEN",
    "jobType": "FULL_TIME",
    "experienceLevel": "MID",
    "minSalary": 8000,
    "maxSalary": 15000,
    "currency": "SAR",
    "location": "الرياض",
    "remote": false,
    "benefits": ["تأمين صحي", "مكافآت سنوية"],
    "expiresAt": "2026-03-31"
  }'
```

---

### 🔟 **تحديث ملف التعريف**

```bash
curl -X PATCH https://ujoor.onrender.com/api/mobile/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-device-id: TEST-DEVICE-001" \
  -d '{
    "phone": "+966501234999",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

---

## 🔄 **Refresh Token**

عندما ينتهي الـ `accessToken` (بعد 24 ساعة):

```bash
curl -X POST https://ujoor.onrender.com/api/mobile/auth/refresh \
  -H "Content-Type: application/json" \
  -H "x-device-id: TEST-DEVICE-001" \
  -d '{
    "refreshToken": "rt_xxxxx"
  }'
```

---

## 🚪 **تسجيل الخروج**

```bash
curl -X POST https://ujoor.onrender.com/api/mobile/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-device-id: TEST-DEVICE-001"
```

---

## ✅ **Health Check**

تحقق من صحة النظام:

```bash
curl -X GET https://ujoor.onrender.com/api/health
```

**النتيجة المتوقعة:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-01T...",
  "database": "connected",
  "version": "1.0.0"
}
```

---

## 🔧 **Notes للاختبار**

### استبدال Token في جميع الطلبات:
```bash
# احفظ Token في متغير
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# استخدمه في الطلبات
curl -H "Authorization: Bearer $TOKEN" ...
```

### اختبار من Windows PowerShell:
```powershell
$TOKEN = "eyJhbGciOiJIUzI1NiIs..."

Invoke-RestMethod -Uri "https://ujoor.onrender.com/api/mobile/auth/profile" `
  -Headers @{
    "Authorization" = "Bearer $TOKEN"
    "x-device-id" = "TEST-DEVICE-001"
  }
```

---

## 📊 **Dashboard Web Testing**

افتح المتصفح:
1. `https://ujoor.onrender.com/login`
2. سجل دخول بـ `admin@admin.com` / `123456`
3. تصفح:
   - `/dashboard` - الصفحة الرئيسية
   - `/dashboard/employees` - قائمة الموظفين
   - `/dashboard/attendance` - سجلات الحضور
   - `/dashboard/recruitment` - نظام التوظيف
   - `/dashboard/settings` - الإعدادات
