

## ন্যাভবার অ্যাক্টিভ লিঙ্ক ফিক্স ও পেজ স্ক্রল-টু-টপ

### সমস্যা ১: হোম সবসময় সিলেক্ট দেখায়
বর্তমানে Home লিঙ্কে হার্ডকোড করা অ্যাক্টিভ স্টাইল আছে (`text-primary font-bold border-b-2 border-secondary`), আর বাকি লিঙ্কগুলোতে শুধু ইনঅ্যাক্টিভ স্টাইল। রাউট অনুযায়ী ডাইনামিক হচ্ছে না।

### সমস্যা ২: পেজ নিচ থেকে শুরু হয়
নেভিগেশনে scroll-to-top নেই, তাই আগের পেজের স্ক্রল পজিশন থেকেই যায়।

### সমাধান

**`src/components/Navbar.tsx`:**
- `Link` এর বদলে `NavLink` (react-router-dom থেকে) ব্যবহার করা হবে
- `NavLink` এর `className` ফাংশন দিয়ে `isActive` চেক করে অ্যাক্টিভ স্টাইল দেওয়া হবে
- অ্যাক্টিভ: `text-primary font-bold border-b-2 border-secondary`
- ইনঅ্যাক্টিভ: `text-on-surface-variant font-medium hover:text-primary`
- Home রাউটে `end` প্রপ দেওয়া হবে যেন শুধু `/` তে ম্যাচ করে

**`src/App.tsx`:**
- একটি `ScrollToTop` কম্পোনেন্ট যোগ করা হবে যা `useLocation` + `useEffect` দিয়ে প্রতিটি রাউট চেঞ্জে `window.scrollTo(0, 0)` করবে

### ফাইল পরিবর্তন
- `src/components/Navbar.tsx` — `NavLink` দিয়ে অ্যাক্টিভ লিঙ্ক ডাইনামিক করা (ডেস্কটপ + মোবাইল)
- `src/App.tsx` — `ScrollToTop` কম্পোনেন্ট যোগ

