

## আনলক কাউন্ট ফিক্স + প্যাকেজ শেষ হলে নোটিশ

### মূল সমস্যা
`unlock_purchases` টেবিলে শুধু অ্যাডমিন UPDATE করতে পারে। তাই যখন ইউজার আনলক করে, `used_unlocks` increment হচ্ছে না (0 থেকে যাচ্ছে)।

### সমাধান

**১. Database Migration:**
- ইউজার নিজের `unlock_purchases` এর `used_unlocks` আপডেট করতে পারবে এমন RLS policy যোগ
- অথবা আরও নিরাপদভাবে: একটি `increment_used_unlocks(purchase_id uuid)` security definer function তৈরি করা যেটা চেক করবে purchase owner কিনা, তারপর increment করবে

**২. `src/pages/LandDetail.tsx` ফিক্স:**
- `directUnlock` mutation এ raw update এর বদলে DB function কল করা
- আনলকের পর সব সংশ্লিষ্ট query invalidate করা (dashboard ট্যাবও)
- প্যাকেজের সব আনলক শেষ হলে (used >= total) payment dialog এ নোটিশ দেখানো: "আপনার ১০টি আনলক শেষ হয়েছে। আরো জমির মালিকের তথ্য দেখতে আবার প্যাকেজ ক্রয় করুন।"

**৩. `src/pages/UserDashboard.tsx` ফিক্স:**
- `used_unlocks` ছাড়াও `contact_unlocks` count থেকে সঠিক সংখ্যা দেখানো (backup)
- প্যাকেজ শেষ হলে "আরো জমির মালিকের তথ্য দেখতে আবার ক্রয় করুন" নোটিশ দেখানো
- `my-unlock-purchases` query থেকে `as any` সরানো

### ফাইল তালিকা
1. **Database migration** — `increment_used_unlocks` function + user update policy
2. **`src/pages/LandDetail.tsx`** — DB function কল, exhausted notice
3. **`src/pages/UserDashboard.tsx`** — সঠিক কাউন্ট + exhausted notice

