-- รันใน Supabase → SQL Editor → New query → Run
-- เพิ่มรายวิชาที่อนุญาต โดยไม่ลบหรือแก้ไขข้อมูลสื่อเดิม
begin;
alter table public.media drop constraint if exists media_subject_check;
alter table public.media add constraint media_subject_check
  check (subject in (
    'ภาษาไทย', 'คณิตศาสตร์', 'วิทยาศาสตร์', 'ภาษาอังกฤษ',
    'สังคมศึกษา', 'ศิลปะ', 'การงานอาชีพ', 'สุขศึกษา',
    'ประวัติศาสตร์', 'หน้าที่พลเมือง'
  ));
commit;
