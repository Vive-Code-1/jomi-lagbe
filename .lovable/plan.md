

## Contact ফর্ম ডাটা সংগ্রহ + তথ্য আপডেট

### পরিবর্তনসমূহ

**১. Database — `contact_messages` টেবিল তৈরি:**
```sql
CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
-- RLS: anyone can insert, admin can read
```

**২. `src/pages/Contact.tsx` আপডেট:**
- ফোন নাম্বার `01791208768` এ পরিবর্তন
- ইমেইল `support@webogrowth.com` এ পরিবর্তন
- `handleSubmit` এ Supabase `contact_messages` টেবিলে ডাটা ইনসার্ট করা (setTimeout সরিয়ে)

**৩. `src/components/Footer.tsx` আপডেট:**
- কপিরাইট টেক্সট: `© 2024 জমি লাগবে। সর্বস্বত্ব সংরক্ষিত। Webogrowth` — "Webogrowth" এ `https://webogrowth.com/` লিংক যোগ

**৪. `src/pages/Admin.tsx` আপডেট:**
- Section type এ `'contacts'` যোগ
- সাইডবারে "যোগাযোগ বার্তা" মেনু আইটেম যোগ (MessageSquare আইকন ইতোমধ্যে import আছে)
- নতুন সেকশনে `contact_messages` টেবিল থেকে ডাটা দেখানো — নাম, ইমেইল, বিষয়, বার্তা, তারিখ, read/unread টগল

### ফাইল পরিবর্তন
1. **Database migration** — `contact_messages` টেবিল + RLS
2. **`src/pages/Contact.tsx`** — নাম্বার/ইমেইল আপডেট + Supabase ইনসার্ট
3. **`src/components/Footer.tsx`** — Webogrowth লিংক যোগ
4. **`src/pages/Admin.tsx`** — contacts সেকশন যোগ

