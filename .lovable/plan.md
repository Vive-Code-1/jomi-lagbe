

## এডমিন ড্যাশবোর্ড — ৫টি ফিচার আপডেট

### ১. ভাষা সুইচার (বাংলা/ইংরেজি)
টপ বারে একটি language toggle বাটন যোগ হবে যা `useI18n()` এর `setLang` কল করবে। বাংলা/EN আইকন বাটন।

### ২. এডমিন প্রোফাইল ও পাসওয়ার্ড সেকশন
সাইডবারে নতুন "Profile" মেনু আইটেম:
- প্রোফাইল পিকচার আপলোড (land-images বাকেটে `avatars/` ফোল্ডারে সেভ, profiles টেবিলে `avatar_url` কলাম যোগ — migration দরকার)
- পাসওয়ার্ড চেঞ্জ ফর্ম (`supabase.auth.updateUser({ password })`)
- নাম এডিট

### ৩. এডমিন কন্ট্রোল ম্যানেজমেন্ট
বর্তমান Listings/Packages/Users সেকশন ইতিমধ্যে CRUD সাপোর্ট করে। এটিকে আরো উন্নত করা হবে:
- Payments সেকশনে status আপডেট করার অপশন (pending → completed/failed) — migration দরকার: payments UPDATE RLS policy যোগ
- সব সেকশনে bulk action সাপোর্ট নয়, তবে প্রতিটি আইটেমে clear Edit/Delete বাটন নিশ্চিত করা

### ৪. ডামি ডাটা সিড
Database insert tool দিয়ে:
- ৩-৪টি ডামি জমি লিস্টিং
- ২-৩টি ডামি পেমেন্ট রেকর্ড
- এগুলো এডমিন প্যানেলে দেখা ও এডিট করা যাবে

### ৫. রিভিউ ম্যানেজমেন্ট ফিচার
নতুন `reviews` টেবিল তৈরি (migration):
```sql
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  land_id uuid REFERENCES public.lands(id) ON DELETE CASCADE,
  rating integer NOT NULL DEFAULT 5,
  comment text,
  reviewer_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
-- Admin full access + public read
```
- সাইডবারে "রিভিউ" মেনু আইটেম
- ডামি রিভিউ ডাটা ইনসার্ট (৪-৫টি)
- রিভিউ টেবিল: নাম, রেটিং (⭐), কমেন্ট, স্ট্যাটাস
- এডিট ডায়লগ ও ডিলিট বাটন

### Database Migration
1. `profiles` টেবিলে `avatar_url text` কলাম যোগ
2. `reviews` টেবিল তৈরি + RLS policies
3. `payments` টেবিলে admin UPDATE policy যোগ

### ফাইল পরিবর্তন
1. **`src/pages/Admin.tsx`** — ভাষা সুইচার, প্রোফাইল সেকশন, রিভিউ সেকশন, পেমেন্ট status এডিট যোগ
2. **Database migrations** — profiles avatar_url, reviews টেবিল, payments update policy
3. **Data inserts** — ডামি listings, payments, reviews

