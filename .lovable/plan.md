

## মালিকের তথ্য আনলক পেমেন্ট সিস্টেম

### সারসংক্ষেপ
৪৯৯ টাকায় ১০টি জমির মালিকের তথ্য আনলক করার সম্পূর্ণ ফাংশনাল সিস্টেম তৈরি। ইউজার বিকাশ/নগদে পেমেন্ট করবে, অ্যাডমিন ভেরিফাই করবে, তারপর ইউজার তার ড্যাশবোর্ড থেকে মালিকের তথ্য দেখতে পাবে।

### ডাটাবেস পরিবর্তন

**১. নতুন টেবিল: `unlock_packages`** — আনলক প্যাকেজ কনফিগারেশন
- `id`, `name_bn`, `name_en`, `price` (499), `unlock_count` (10), `is_active`, `created_at`

**২. নতুন টেবিল: `unlock_purchases`** — ইউজারের কেনা প্যাকেজ ট্র্যাক
- `id`, `user_id`, `package_id`, `total_unlocks` (10), `used_unlocks` (0), `status` (pending/active/expired), `payment_method_id`, `sender_number`, `sender_transaction_id`, `created_at`

**৩. `contact_unlocks` টেবিল আপডেট** — `purchase_id` কলাম যোগ (কোন প্যাকেজ থেকে আনলক হয়েছে)

**RLS পলিসি:**
- `unlock_packages`: সবাই দেখতে পারবে, অ্যাডমিন ম্যানেজ করবে
- `unlock_purchases`: ইউজার নিজের ডাটা দেখবে/ইনসার্ট করবে, অ্যাডমিন সব দেখবে/আপডেট করবে
- `contact_unlocks`: বিদ্যমান পলিসি রাখা + purchase_id সাপোর্ট

### ফাইল পরিবর্তন

**১. `src/pages/LandDetail.tsx`** — আনলক বাটন ক্লিক করলে:
- লগইন না থাকলে → `/auth` এ রিডাইরেক্ট
- ইউজারের active purchase আছে ও used < total → সরাসরি আনলক (contact_unlocks এ ইনসার্ট, used_unlocks +1)
- Active purchase নেই → পেমেন্ট ডায়ালগ ওপেন:
  - প্যাকেজ তথ্য দেখাবে: "৪৯৯ টাকায় ১০টি জমির মালিকের নম্বর পাবেন"
  - বিকাশ/নগদ কার্ড (payment_methods থেকে)
  - সেন্ডার নাম্বার ও ট্রানজেকশন আইডি ইনপুট
  - সাবমিট করলে `unlock_purchases` এ ইনসার্ট (status: pending)
  - টোস্ট: "পেমেন্ট ভেরিফিকেশন চলছে, অনুমোদন পেলে আনলক করতে পারবেন"

**২. `src/pages/UserDashboard.tsx`** — নতুন ট্যাব "আনলক তথ্য":
- ইউজারের unlock_purchases তালিকা (status সহ)
- কতটি ব্যবহার হয়েছে / কতটি বাকি আছে progress bar
- আনলক করা জমিগুলোর তালিকা (contact_unlocks + lands join) — মালিকের নাম, ফোন, ঠিকানা দেখাবে

**৩. `src/pages/Admin.tsx`** — "আনলক পেমেন্ট" সেকশন যোগ:
- pending unlock_purchases তালিকা
- Approve বাটন → status = active করবে
- Reject বাটন → status = rejected

**৪. `src/lib/i18n.tsx`** — নতুন translation keys যোগ

### ফ্লো
```text
ইউজার "মালিকের নম্বর আনলক করুন" ক্লিক
  ├─ লগইন নেই → /auth
  ├─ Active package আছে (used < total) → সরাসরি আনলক → তথ্য দেখায়
  └─ Active package নেই → পেমেন্ট ডায়ালগ
       ├─ বিকাশ/নগদ সিলেক্ট
       ├─ সেন্ডার নম্বর + TxID দিয়ে সাবমিট
       ├─ unlock_purchases এ pending ইনসার্ট
       └─ অ্যাডমিন approve → status = active
            └─ ইউজার আবার ক্লিক → আনলক হয়
```

### ফাইল তালিকা
1. **Database migration** — `unlock_packages`, `unlock_purchases` টেবিল + `contact_unlocks` আপডেট + RLS
2. **`src/pages/LandDetail.tsx`** — পেমেন্ট ডায়ালগ + আনলক লজিক
3. **`src/pages/UserDashboard.tsx`** — "আনলক তথ্য" ট্যাব যোগ
4. **`src/pages/Admin.tsx`** — আনলক পেমেন্ট approve/reject সেকশন
5. **`src/lib/i18n.tsx`** — নতুন translations

