

## এডমিন ড্যাশবোর্ড ফিক্স — রুট কজ ও সমাধান

### মূল সমস্যা
`user_roles` টেবিল সম্পূর্ণ খালি — কোনো ইউজারকে admin রোল অ্যাসাইন করা হয়নি। এর ফলে:
1. `isAdmin` সবসময় `false` — তাই `enabled: !!user && isAdmin` সব query বন্ধ রাখছে (লিস্টিং দেখাচ্ছে না)
2. RLS policy `has_role(auth.uid(), 'admin')` ফেইল করছে — তাই INSERT/UPDATE/DELETE কাজ করছে না (জমি/প্যাকেজ এড হচ্ছে না)

### সমাধান

**১. Database Migration — Admin role assign + Demo data seed:**
```sql
-- Admin role assign
INSERT INTO user_roles (user_id, role) 
VALUES ('8fb0e53d-4091-45ef-90a6-371606f8ccbe', 'admin');

-- Demo payments
INSERT INTO payments (user_id, payment_type, amount, status) VALUES ...

-- Demo lands already exist (11 records)
-- Demo packages already exist (2 records)  
-- Demo reviews already exist (5 records)
```

**২. `src/pages/Admin.tsx` — Insert bug fix:**
- Land insert এ `user_id: user?.id` এবং `land_type: 'residential'` যোগ করা — এখন এগুলো missing থাকায় কিছু edge case এ সমস্যা হতে পারে
- Package insert এ validation যোগ — `name_bn` ও `name_en` খালি থাকলে error দেখানো
- সব mutation error handler এ proper Bengali error message

### ফাইল পরিবর্তন
1. **Database migration** — user_roles এ admin assign + demo payments seed
2. **`src/pages/Admin.tsx`** — land insert এ user_id/land_type যোগ, validation উন্নতি

