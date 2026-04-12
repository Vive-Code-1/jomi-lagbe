

## এডমিন ড্যাশবোর্ড টেস্ট রিপোর্ট ও ফিক্স প্ল্যান

### টেস্ট ফলাফল

**UI/সাইডবার — ঠিক আছে:**
- সাইডবার গাঢ় সবুজ ব্যাকগ্রাউন্ড ও সাদা টেক্সট স্পষ্ট দেখাচ্ছে
- সব ৫টি সেকশনে নেভিগেশন কাজ করছে
- অ্যাক্টিভ মেনু আইটেম হাইলাইট হচ্ছে
- "সাইট দেখুন" ও "লগআউট" বাটন আছে
- Empty state মেসেজ সব টেবিলে দেখাচ্ছে

**সমস্যা পাওয়া গেছে:**

1. **ডাটা লোড হচ্ছে না সঠিকভাবে** — ডাটাবেসে 11টি জমি, 2টি প্যাকেজ, 1টি প্রোফাইল আছে কিন্তু ড্যাশবোর্ডে 0 দেখাচ্ছে। কারণ: queries auth resolve হওয়ার আগেই চলে যাচ্ছে, অথবা RLS admin check-এ সমস্যা।

2. **Console Warning** — `PaymentsSection` ও `PackagesSection` কম্পোনেন্টে `forwardRef` ওয়ার্নিং আসছে। এগুলো function component কিন্তু ref পাস হচ্ছে।

3. **Query timing issue** — Admin পেজের সব query তখনই চলা উচিত যখন user authenticated ও admin হিসেবে verified। এখন `enabled` flag নেই।

### ফিক্স প্ল্যান — `src/pages/Admin.tsx`

1. **Query `enabled` flag যোগ করা** — সব useQuery তে `enabled: !!user && isAdmin` যোগ করা যাতে auth resolve হওয়ার পরেই data fetch হয়। এটি DashboardSection, ListingsSection, PaymentsSection, PackagesSection, UsersSection সব জায়গায় লাগবে। এজন্য `useAuth()` হুক প্রতিটি section component এ কল করতে হবে।

2. **forwardRef warning ফিক্স** — Admin component থেকে section component গুলো সরাসরি render হচ্ছে, ref pass হওয়ার ইস্যু নেই। তবে `Dialog` component এ `DialogTrigger` এর ভেতরে `Button` এ `asChild` ব্যবহারে সমস্যা হতে পারে — এটি চেক ও ফিক্স করা হবে।

3. **Dashboard stats count ফিক্স** — `HEAD` request count properly parse হচ্ছে কিনা verify করা। যদি না হয়, তাহলে `select('id')` দিয়ে count করা হবে HEAD এর বদলে।

### ফাইল পরিবর্তন
1. **`src/pages/Admin.tsx`** — সব section component এ `useAuth()` import ও `enabled` flag যোগ, forwardRef ইস্যু ফিক্স

