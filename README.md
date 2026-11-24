# คลังสื่อการเรียนรู้ครูแหวน — GitHub + Vercel

โปรเจกต์ React + Vite + TypeScript + Supabase พร้อมวิชาประวัติศาสตร์และหน้าที่พลเมือง และข้อมูลติดต่อผู้พัฒนาที่อัปเดตแล้ว

## อัปเดต GitHub repository เดิม

อัปโหลดไฟล์และโฟลเดอร์ที่อยู่ภายใน ZIP ไว้ที่หน้าหลักของ repository ให้ `package.json`, `index.html`, `src/` และ `public/` อยู่ระดับเดียวกัน ไม่อัปโหลด `.env`, `node_modules` หรือ `dist`

## เพิ่มสองรายวิชาใน Supabase เดิม

1. เปิด Supabase → SQL Editor → New query
2. คัดลอกเนื้อหาจาก `supabase/add-history-civics.sql` แล้วกด Run
3. คำสั่งนี้เปลี่ยนเฉพาะรายวิชาที่อนุญาต ไม่ลบข้อมูลสื่อเดิม และไม่เปลี่ยนสิทธิ์ RLS

การอัปโหลดไฟล์ SQL ไป GitHub ไม่ได้รันคำสั่งในฐานข้อมูลให้อัตโนมัติ

หากสร้าง Supabase ใหม่ทั้งหมด ให้รัน `supabase/schema.sql` ก่อน จากนั้นสร้างผู้ใช้ใน Authentication → Users แล้วกำหนดสิทธิ์ด้วย `supabase/add-admin.sql` โดยแทน UUID ตัวอย่างด้วย User UID จริง

## เผยแพร่บน Vercel

1. เข้า Vercel แล้ว Import GitHub repository นี้
2. เลือก Framework **Vite**, Root Directory เป็นรากโปรเจกต์, Build Command `npm run build`, Output Directory `dist`
3. ตั้งค่า Environment Variables:

| Key | Value |
| --- | --- |
| VITE_SUPABASE_URL | https://jlotcsfxxzschktwczkm.supabase.co |
| VITE_SUPABASE_PUBLISHABLE_KEY | Publishable key ของคุณที่ขึ้นต้นด้วย sb_publishable_ |
| VITE_SUPABASE_MEDIA_TABLE | media |

ใช้เฉพาะ Publishable key ไม่ใช้ service-role หรือ secret key ในตัวแปร VITE_ เพราะตัวแปรเหล่านี้จะอยู่ในไฟล์หน้าเว็บ

4. กด Deploy หากเชื่อม Vercel ไว้แล้ว เมื่อ Commit เข้า branch ที่เชื่อมไว้ Vercel จะ deploy ใหม่อัตโนมัติ
5. หน้าแอดมิน: `https://ชื่อเว็บ.vercel.app/#/admin` ใช้อีเมลและรหัสผ่าน Supabase ที่มี User UID อยู่ใน admin_users

ไม่ต้องเปิด GitHub Pages หรือเพิ่ม workflow ของ Pages สำหรับการเผยแพร่ผ่าน Vercel

## รันในเครื่อง

ใช้ Node.js 22.18 ขึ้นไป

```sh
npm ci
```

คัดลอก `.env.example` เป็น `.env` แล้วกรอก Supabase Publishable key จากนั้น:

```sh
npm run dev
```

เปิดลิงก์ localhost ที่ Terminal แสดง และเปิดหน้าต่าง Terminal ค้างไว้ระหว่างใช้งาน

## ตรวจสอบ

```sh
npm test
npm run build
```

ตัวเว็บใช้ Supabase โดยตรง ไม่ต้องใช้ ChatGPT Sites หรือ Cloudflare D1 ข้อมูลสื่อและภาพปกอยู่ใน Supabase เดิม

## ฟีเจอร์

- ค้นหาตาม 10 รายวิชา ระดับชั้น และประเภทสื่อ
- เกมแสดงปุ่มเล่นเกม วิดีโอแสดงดูวิดีโอ ใบงาน/สไลด์แสดงดาวน์โหลดสื่อ โดยเปิดลิงก์ที่แอดมินแนบ
- อัปโหลดภาพปก JPG ไม่เกิน 20 MB
- เก็บสื่อที่ชอบไว้ในอุปกรณ์
- เข้าสู่ระบบแอดมินด้วย Supabase Auth และตรวจสิทธิ์ด้วย RLS

ชื่อผู้พัฒนา : นางสาวปรารถนา สุวรรณพันธ์

โรงเรียนบ้านโพนก้างปลาโนนสมบูรณ์ สังกัดสพป.สกลนคร เขต 1

ติดต่อ Line ID : deutscheistmeister

Facebook : Prattana Suwannapan
