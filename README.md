# คลังสื่อการเรียนรู้ครูแหวน

เว็บ React + TypeScript + Vite + Tailwind CSS สำหรับ GitHub Pages ใช้ Supabase เป็นฐานข้อมูล ระบบเข้าสู่ระบบแอดมิน และพื้นที่เก็บภาพปก JPG

เวอร์ชันนี้รันได้โดยไม่ต้องใช้ ChatGPT Sites, Cloudflare Worker หรือฐานข้อมูล D1

## 1. รันในเครื่อง

ติดตั้ง Node.js รุ่น 22.18 ขึ้นไป (แนะนำ Node.js 22 LTS รุ่นล่าสุด) จาก https://nodejs.org

เปิด Terminal ในโฟลเดอร์โปรเจกต์แล้วรัน:

```sh
npm ci
```

คัดลอกไฟล์ `.env.example` เป็น `.env`:

```sh
# macOS / Linux / Git Bash
cp .env.example .env

# Windows Command Prompt
copy .env.example .env
```

เปิด `.env` และใส่ข้อมูล Supabase ของคุณ:

```dotenv
VITE_SUPABASE_URL=https://jlotcsfxxzschktwczkm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=ใส่-publishable-key-ของคุณ
VITE_SUPABASE_MEDIA_TABLE=media
```

ใช้ **Publishable key** ที่ขึ้นต้นด้วย `sb_publishable_` เท่านั้น ไม่ใช้ service-role key หรือ secret key ในตัวแปรที่ขึ้นต้นด้วย `VITE_` เพราะ Vite จะนำค่าเหล่านี้ไปไว้ใน JavaScript ของเว็บไซต์

เริ่มรัน:

```sh
npm run dev
```

เปิด URL ที่ Terminal แสดง เช่น http://localhost:5173

หน้าแอดมิน: http://localhost:5173/#/admin

## 2. เตรียม Supabase

หากใช้โปรเจกต์เดิมที่สร้าง `media`, `admin_users` และ bucket `media-covers` แล้ว ไม่ต้องสร้างซ้ำ

สำหรับโปรเจกต์ใหม่:

1. เปิด Supabase → SQL Editor และรันไฟล์ `supabase/schema.sql`
2. ไป Authentication → Users → Add user → Create new user
3. กรอกอีเมล/รหัสผ่านและเปิด Auto Confirm User หากมี
4. คัดลอก User UID แล้วแทนค่าในไฟล์ `supabase/add-admin.sql` จากนั้นรันคำสั่งนั้นใน SQL Editor
5. ใช้อีเมล/รหัสผ่านบัญชีดังกล่าวเข้าสู่หน้าแอดมิน

สิทธิ์ข้อมูลถูกควบคุมด้วย Supabase RLS: ผู้ชมอ่านสื่อได้ และเฉพาะบัญชีใน `admin_users` เพิ่ม แก้ไข ลบ และอัปโหลดภาพได้ ไม่ควรปิด RLS

Supabase Auth SDK จัดการเซสชันและต่ออายุ token ให้อัตโนมัติ ไม่มีระบบคุกกี้แอดมินจากโฮสต์เดิม ส่วนภาพและรายการสื่ออยู่ใน Supabase เดิม ไม่ได้รวมข้อมูลบัญชีผู้ใช้หรือข้อมูลเซสชันในไฟล์ ZIP

## 3. นำขึ้น GitHub และเปิด GitHub Pages

1. สร้าง repository บน GitHub เช่น `kruwaen-library` (บัญชี GitHub Free ควรใช้ Public หากจะใช้ Pages ฟรี)
2. อัปโหลด **ไฟล์และโฟลเดอร์ที่อยู่ภายในโปรเจกต์** ไปที่ราก repository ให้เห็น `package.json` และ `index.html` ที่หน้าแรก ไม่อัปโหลดไฟล์ ZIP ทั้งก้อน และตรวจว่ามี `.github/workflows/deploy.yml` ด้วย
3. ไป **Settings → Secrets and variables → Actions → Variables → New repository variable** แล้วเพิ่ม:

   | ชื่อตัวแปร | ค่า |
   | --- | --- |
   | `VITE_SUPABASE_URL` | URL โปรเจกต์ Supabase ของคุณ |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable key ที่ขึ้นต้นด้วย `sb_publishable_` |

4. ไป **Settings → Pages → Build and deployment → Source** เลือก **GitHub Actions**
5. ไปแท็บ **Actions → Deploy to GitHub Pages → Run workflow** แล้วเลือก branch `main` หรือ push การเปลี่ยนแปลงเข้า `main`
6. เมื่อ workflow ขึ้นสีเขียว เปิด URL จากงาน Deploy หรือ Settings → Pages

ตัวอย่าง URL:

```text
https://YOUR_USERNAME.github.io/kruwaen-library/
https://YOUR_USERNAME.github.io/kruwaen-library/#/admin
```

ระบบตั้งค่า path ตามชื่อ repository ให้อัตโนมัติ และใช้ `#/admin` เพื่อให้รีเฟรชหน้าแอดมินบน GitHub Pages ได้โดยไม่เกิด 404

หากตั้งชื่อ branch เป็นชื่ออื่น ให้เปลี่ยน `branches: [main]` ใน `.github/workflows/deploy.yml` ให้ตรงกัน

การเปิด repository เป็น Public ทำให้คนอื่นเห็นซอร์สโค้ด ส่วน GitHub Pages เป็นหน้าเว็บสำหรับผู้ชม การจัดการสื่อยังต้องผ่านบัญชี Supabase และ RLS

## 4. วิธีใช้คลังสื่อ

- ค้นหาและกรองสื่อตามวิชา ระดับชั้น และประเภท
- แอดมินอัปโหลดภาพปก JPG (.jpg/.jpeg) ไม่เกิน 20 MB
- สื่อแนบเป็นลิงก์: เกมใช้ปุ่ม **เล่นเกม**, วิดีโอใช้ **ดูวิดีโอ**, ใบงาน/สไลด์ใช้ **ดาวน์โหลดสื่อ**
- ตั้งค่าการแชร์ของลิงก์ปลายทางให้ผู้ชมเปิดดูได้ด้วย
- กดหัวใจเพื่อบันทึกสื่อที่ชอบไว้ในอุปกรณ์
- ชื่อผู้พัฒนา: นางสาวปรารถนา สุวรรณพันธ์

## 5. ตรวจสอบก่อนเผยแพร่

```sh
npm test
npm run build
npm run preview
```

ไฟล์พร้อมเผยแพร่อยู่ใน `dist/` แต่ไม่ต้อง commit `dist/` เมื่อใช้ GitHub Actions

หากเปลี่ยนตัวแปร `VITE_` ต้อง build ใหม่หรือรัน workflow ใหม่ เพราะค่าเหล่านี้ถูกใส่ลงในไฟล์เว็บตอน build

## โครงสร้างหลัก

```text
src/App.tsx                  หน้าผู้ใช้และแอดมิน
src/components/              ส่วนประกอบหน้าจอ
src/components/ui/           คอมโพเนนต์ UI รวมภาพส่วนหัว 3 มิติ
src/lib/api-core.ts          การอ่าน/จัดการสื่อและการเข้าสู่ระบบ
src/lib/supabase.ts          ตั้งค่า Supabase client
src/styles.css               รูปแบบเว็บไซต์
public/hero/                 ภาพส่วนหัวทั้ง 6 ภาพ
supabase/schema.sql          ตาราง สิทธิ์ RLS และพื้นที่ภาพปก
tests/                       ชุดทดสอบ
.github/workflows/deploy.yml  ระบบเผยแพร่ GitHub Pages
```

ถ้าอัปโหลดภาพแล้วแจ้งไม่มีสิทธิ์ ให้ตรวจว่า User UID อยู่ใน `admin_users` และนโยบาย Storage ของ `media-covers` ถูกสร้างครบตาม `schema.sql`
