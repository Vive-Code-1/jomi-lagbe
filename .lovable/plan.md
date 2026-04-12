

## "Add Listing" পেজ তৈরি — ফুল ফাংশনাল মাল্টি-স্টেপ ফর্ম

### যা তৈরি হবে

রেফারেন্স ডিজাইন অনুযায়ী একটি ৪-স্টেপ "Add Listing" পেজ তৈরি হবে যেখানে লগইন করা ইউজাররা নিজেদের জমি বিক্রির বিজ্ঞাপন দিতে পারবে।

### ৪টি স্টেপ

1. **Basic Info** — Land Type, Ownership Type, Total Size, Expected Price, Description
2. **Location** — Division, District, Road Width, Detail Address (bn/en)
3. **Media** — ইমেজ URL যোগ করা (একাধিক), Title (bn/en)
4. **Payment** — প্যাকেজ সিলেক্ট (Standard/Premium), সামারি দেখানো, সাবমিট

### ডিজাইন

- প্রগ্রেস স্টেপার (১-৪ নম্বরযুক্ত সার্কেল + কানেকটিং লাইন)
- বাম পাশে ফর্ম ক্যানভাস (white card, shadow)
- ডান পাশে Ad Pricing সাইডবার (sticky, Standard ও Premium প্যাকেজ তথ্য `ad_packages` টেবিল থেকে)
- ফর্মের নিচে Bento Info Grid (Authenticity + Premium Reach কার্ড)
- Heritage Modernist ডিজাইন: `bg-surface`, `primary` কালার, `headline-font`

### ফাংশনালিটি

- লগইন না থাকলে `/auth` পেজে রিডাইরেক্ট
- ফর্ম ভ্যালিডেশন (প্রতিটি স্টেপে)
- স্টেপ ৪-এ সাবমিট করলে `lands` টেবিলে ডাটা ইনসার্ট + `payments` টেবিলে পেমেন্ট রেকর্ড তৈরি
- `ad_packages` থেকে প্যাকেজ ডাটা ফেচ করে সাইডবারে দেখানো
- সফল সাবমিশনে toast + হোমপেজে রিডাইরেক্ট

### ডাটাবেস পরিবর্তন

`lands` টেবিলে নতুন কলাম দরকার নেই — বিদ্যমান স্কিমা যথেষ্ট। তবে `lands` টেবিলে একটি `user_id` কলাম যোগ করতে হবে যেন কে লিস্টিং করেছে তা ট্র্যাক করা যায়। এবং RLS পলিসি যোগ করতে হবে যেন authenticated ইউজাররা নিজেদের ল্যান্ড ইনসার্ট করতে পারে।

### ফাইল পরিবর্তন

1. **`src/pages/AddListing.tsx`** — নতুন পেজ তৈরি (মাল্টি-স্টেপ ফর্ম + সাইডবার)
2. **`src/App.tsx`** — `/add-listing` রাউট যোগ
3. **`src/components/Navbar.tsx`** — "Add Listing" বাটন যোগ (ডান পাশে, `bg-primary` স্টাইল)
4. **`src/lib/i18n.tsx`** — Add Listing সম্পর্কিত ট্রান্সলেশন কী যোগ
5. **Database migration** — `lands` টেবিলে `user_id` কলাম + RLS পলিসি (authenticated ইউজার নিজের ল্যান্ড ইনসার্ট করতে পারবে)

### টেকনিক্যাল ডিটেইলস

- `useState` দিয়ে `currentStep` (1-4) ম্যানেজ
- প্রতিটি স্টেপের ডাটা একটি single state অবজেক্টে
- `ad_packages` থেকে `useQuery` দিয়ে প্যাকেজ ফেচ
- সাবমিশনে `supabase.from('lands').insert(...)` + `supabase.from('payments').insert(...)`
- `useAuth` হুক দিয়ে লগইন চেক

