

## এডমিন প্রোফাইল ফিক্স — ৩টি সমস্যা ও সমাধান

### মূল সমস্যা চিহ্নিত

**১. প্রোফাইল পিকচার আপলোড ব্যর্থ হচ্ছে:**
Storage RLS policy চেক করে: `(auth.uid())::text = (storage.foldername(name))[1]` — অর্থাৎ ফাইল পাথের **প্রথম ফোল্ডার** অবশ্যই ইউজারের ID হতে হবে। কিন্তু কোডে পাথ `avatars/${user.id}.ext` — এখানে প্রথম ফোল্ডার `avatars`, ইউজার ID নয়। তাই আপলোড RLS দ্বারা ব্লক হচ্ছে।

**২. নাম আপডেট — `as any` cast অপ্রয়োজনীয়:**
`avatar_url` ইতোমধ্যে types.ts এ আছে, তাই `as any` cast সরিয়ে দিলে type safety ভালো হবে। তবে নাম আপডেট কাজ করা উচিত — RLS ঠিক আছে। সম্ভবত UI তে error দেখাচ্ছে না।

**৩. সাইডবারে প্রোফাইল ইমেজ ও নাম দেখানো:**
রেফারেন্স ইমেজে মার্ক করা জায়গায় সাইডবারের নিচে এডমিনের ছবি ও নাম দেখাতে হবে।

**৪. `aabeg01@gmail.com` ইতোমধ্যে admin:**
ডাটাবেসে এই ইউজার (ID: `8fb0e53d`) ইতোমধ্যে `user_roles` টেবিলে admin হিসেবে আছে। নতুন কিছু করার দরকার নেই।

### পরিবর্তন — `src/pages/Admin.tsx`

**১. Avatar upload path ফিক্স (line ~901):**
```
// আগে (ভুল):
const path = `avatars/${user.id}.${ext}`;

// পরে (সঠিক):
const path = `${user.id}/avatar.${ext}`;
```
এতে storage RLS policy pass করবে কারণ প্রথম ফোল্ডার = user ID।

**২. `as any` cast সরানো (line ~906):**
```tsx
// আগে:
await supabase.from('profiles').update({ avatar_url: avatarUrl } as any)
// পরে:
await supabase.from('profiles').update({ avatar_url: avatarUrl })
```

**৩. সাইডবারে এডমিন প্রোফাইল দেখানো:**
Admin কম্পোনেন্টে profiles query যোগ করে সাইডবারের নিচে (logout বাটনের উপরে) এডমিনের avatar ও নাম দেখানো হবে।

### ফাইল পরিবর্তন
1. **`src/pages/Admin.tsx`** — upload path ফিক্স, `as any` সরানো, সাইডবারে প্রোফাইল UI যোগ

