-- สร้างบัญชีใน Authentication → Users ก่อน
-- แทน UUID ตัวอย่างด้านล่างด้วย User UID จริง แล้วรันใน SQL Editor
insert into public.admin_users (user_id)
values ('00000000-0000-0000-0000-000000000000')
on conflict (user_id) do nothing;
