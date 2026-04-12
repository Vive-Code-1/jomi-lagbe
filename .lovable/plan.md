

## প্যাকেজ তৈরি ও পেমেন্ট ফিচার

### সমস্যা
`ad_packages` টেবিলে কোনো ডাটা নেই, তাই Step 4 এ প্যাকেজ দেখাচ্ছে না।

### পরিবর্তন

**১. Database Migration — ২টি প্যাকেজ সিড করা:**
- **Standard Listing** — ৳৫০০, ৩০ দিন, ৫টি ছবি (সাধারণ)
- **Premium Boost** — ৳১০,০০০, ৬০ দিন, ফিচার্ড + হোমপেজে দেখাবে

```sql
INSERT INTO ad_packages (name_bn, name_en, price, duration, is_featured) VALUES
('সাধারণ তালিকা', 'Standard Listing', 5500, 30, false),
('প্রিমিয়াম বুস্ট', 'Premium Boost', 10000, 60, true);
```

**২. `src/pages/AddListing.tsx` — প্যাকেজ কার্ড UI উন্নত:**
- রেফারেন্স ডিজাইন অনুযায়ী প্যাকেজ কার্ডে ফিচার লিস্ট দেখানো (Valid for X days, Up to 5 photos, Featured on Home Page)
- "BEST VALUE" ব্যাজ Premium প্যাকেজে
- সাইডবারে Subtotal দেখানো (রেফারেন্স ইমেজ অনুযায়ী)

**৩. পেমেন্ট ফ্লো — UddoktaPay ইন্টিগ্রেশন:**
প্রজেক্টে আগে থেকেই UddoktaPay পেমেন্ট গেটওয়ে ব্যবহার হচ্ছে। একটি Edge Function তৈরি হবে:
- `create-payment` Edge Function — প্যাকেজ সিলেক্ট করে "বিজ্ঞাপন প্রকাশ করুন" ক্লিক করলে UddoktaPay checkout URL তৈরি করবে
- পেমেন্ট সফল হলে `payments` টেবিলে status `completed` হবে এবং `lands` টেবিলে লিস্টিং অ্যাক্টিভ হবে
- `verify-payment` Edge Function — UddoktaPay callback হ্যান্ডেল করবে

তবে UddoktaPay API key সেটআপ দরকার হবে। যদি API key না থাকে, তাহলে আপাতত "পেমেন্ট সিস্টেম শীঘ্রই আসছে" মেসেজ দেখাবে এবং ফ্রি-তে লিস্টিং সাবমিট করতে দেবে।

### ফাইল পরিবর্তন
1. **Database migration** — `ad_packages` এ ২টি প্যাকেজ ইনসার্ট
2. **`src/pages/AddListing.tsx`** — প্যাকেজ কার্ড UI আপডেট (ফিচার লিস্ট, BEST VALUE ব্যাজ, Subtotal সাইডবার)

