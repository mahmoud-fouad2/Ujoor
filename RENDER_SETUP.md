# 🚀 إعداد المشروع على Render

## 🔴 مهم جداً: إنشاء حساب Super Admin

### الطريقة 1: إعداد المتغيرات قبل النشر (الأسهل)

في **Render Dashboard → Environment Variables**، أضف:

```env
SUPER_ADMIN_EMAIL=admin@admin.com
SUPER_ADMIN_PASSWORD=123456
SUPER_ADMIN_FORCE=1
```

⚠️ **`SUPER_ADMIN_FORCE=1`** مهم جداً! بدونه لن يتم إنشاء حساب إذا كان هناك مستخدمين آخرين.

---

### الطريقة 2: تشغيل السكريبت يدوياً (بعد النشر)

إذا كان المشروع منشور بالفعل ولم يتم إنشاء super admin:

**في Render Dashboard:**

1. اذهب إلى **Shell** (Terminal)
2. شغل الأمر:

```bash
node scripts/db-create-admin.mjs
```

أو:

```bash
SUPER_ADMIN_FORCE=1 node scripts/ensure-super-admin.mjs
```

---

## ✅ التحقق من نجاح الإنشاء

### 1. افتح Shell في Render

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findUnique({ where: { email: 'admin@admin.com' } })
  .then(u => console.log(u ? 'Super Admin exists!' : 'NOT FOUND'))
  .finally(() => prisma.\$disconnect());
"
```

### 2. أو استخدم Prisma Studio

```bash
npx prisma studio
```

---

## 🧪 اختبار تسجيل الدخول

### اختبار Web Dashboard

افتح المتصفح:
```
https://ujoor.onrender.com/login
```

البيانات:
- Email: `admin@admin.com`
- Password: `123456`

### اختبار Mobile API

```bash
curl -X POST https://ujoor.onrender.com/api/mobile/auth/login \
  -H "Content-Type: application/json" \
  -H "x-device-id: TEST-001" \
  -H "x-device-platform: android" \
  -H "x-device-name: Test Device" \
  -H "x-app-version: 1.0.0" \
  -d '{"email":"admin@admin.com","password":"123456"}'
```

**إذا نجح،** سترى رد مثل:
```json
{
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "rt_...",
    "user": {
      "id": "...",
      "email": "admin@admin.com",
      "firstName": "Super",
      "lastName": "Admin",
      "role": "SUPER_ADMIN"
    }
  }
}
```

**إذا فشل** مع `Invalid credentials`:
- Super admin غير موجود أو الباسورد خاطئ
- تحتاج تشغيل `db-create-admin.mjs`

---

## 🔐 إنشاء Super Admin الآن!

لأن الاختبار فشل بـ `Invalid credentials`، معناه إما:

### السيناريو 1: الحساب غير موجود

**الحل:** شغل هذا في Render Shell:

```bash
export SUPER_ADMIN_EMAIL="admin@admin.com"
export SUPER_ADMIN_PASSWORD="123456"
node scripts/db-create-admin.mjs
```

### السيناريو 2: الباسورد مختلف

**الحل:** أعد تعيين الباسورد:

```bash
export SUPER_ADMIN_EMAIL="admin@admin.com"
export SUPER_ADMIN_PASSWORD="123456"
node scripts/db-create-admin.mjs
```

(السكريبت `db-create-admin.mjs` يحدّث الباسورد حتى لو كان الحساب موجود)

---

## 📋 Render Environment Variables - Complete List

```env
# ===== Node & Deployment =====
NODE_VERSION=20
DATABASE_URL=[من Render Postgres]

# ===== Auth Secrets =====
NEXTAUTH_SECRET=[يولده Render تلقائياً أو: openssl rand -base64 32]
NEXTAUTH_URL=https://ujoor.onrender.com
NEXT_PUBLIC_APP_URL=https://ujoor.onrender.com

# ===== Super Admin Bootstrap =====
SUPER_ADMIN_EMAIL=admin@admin.com
SUPER_ADMIN_PASSWORD=123456
SUPER_ADMIN_FORCE=1

# ===== Mobile JWT =====
MOBILE_JWT_SECRET=[openssl rand -base64 32]
MOBILE_REFRESH_TOKEN_SECRET=[openssl rand -base64 32]

# ===== Cloudflare R2 =====
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-key
R2_SECRET_ACCESS_KEY=your-secret
R2_BUCKET_NAME=ujoor
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com

# ===== Optional: Sentry =====
SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456

# ===== Optional: reCAPTCHA =====
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le...
RECAPTCHA_SECRET_KEY=6Le...
```

---

## 🔄 بعد إضافة المتغيرات

1. **حفظ** Environment Variables
2. **Manual Deploy** (أو انتظر auto-deploy)
3. راقب **Logs** للتأكد من نجاح `ensure-super-admin`
4. جرب تسجيل الدخول

---

## 🐛 Troubleshooting

### "Invalid credentials" عند Login

**السبب:** Super admin غير موجود أو password خاطئ

**الحل:**
```bash
# في Render Shell
export SUPER_ADMIN_EMAIL="admin@admin.com"
export SUPER_ADMIN_PASSWORD="123456"
node scripts/db-create-admin.mjs
```

### "Account is temporarily locked"

**السبب:** محاولات login فاشلة متكررة (rate limiting)

**الحل:**
```bash
# في Render Shell
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.update({
  where: { email: 'admin@admin.com' },
  data: { failedLoginAttempts: 0, lockedUntil: null }
}).then(() => console.log('Unlocked')).finally(() => p.\$disconnect());
"
```

### Database connection fails

**السبب:** `DATABASE_URL` خاطئ أو Database غير جاهز

**الحل:**
- تأكد من `DATABASE_URL` في Environment Variables
- تأكد من نسخ **Internal Database URL** من Postgres
- جرب Manual Deploy مرة أخرى

---

## 🎯 الخطوات السريعة (Quick Fix)

**إذا كان المشروع منشور الآن ولا تستطيع الدخول:**

1. افتح **Render Dashboard → Shell**
2. شغل:
```bash
cat > /tmp/fix-admin.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash('123456', 12);
  const user = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      password: passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      lockedUntil: null
    },
    create: {
      email: 'admin@admin.com',
      password: passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      permissions: []
    }
  });
  console.log('Fixed:', user.email);
}

main().finally(() => prisma.$disconnect());
EOF

node /tmp/fix-admin.js
```

3. الآن جرب تسجيل الدخول!

---

## ✅ النتيجة النهائية

بعد التأكد من إنشاء super admin، يمكنك:

✅ الدخول إلى Dashboard: `https://ujoor.onrender.com/login`
✅ استخدام Mobile API للبصمة
✅ إنشاء موظفين جدد
✅ تسجيل حضور/انصراف
✅ إدارة كامل النظام

---

## 📞 لو ما زال لا يعمل

شارك معي:
- صورة من **Render Logs** (آخر 50 سطر)
- نتيجة تشغيل:
```bash
node scripts/db-create-admin.mjs
```
