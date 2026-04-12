

## হোমপেজ সার্চ ফিল্টার রেফারেন্স ইমেজ অনুযায়ী আপডেট

### রেফারেন্স ইমেজ বিশ্লেষণ

ইমেজে ৩টি ফিল্টার ফিল্ড + ১টি সার্চ বাটন দেখা যাচ্ছে:
1. **LOCATION** — `Where are you looking?` (লোকেশন ড্রপডাউন/ইনপুট)
2. **LAND TYPE** — `All Categories` (ড্রপডাউন: Residential, Commercial, Agriculture, Industrial)
3. **BUDGET RANGE** — `Min - Max BDT` (বাজেট রেঞ্জ ইনপুট)
4. **Search Land** বাটন (সবুজ, ডানপাশে)

### ডেটাবেস পরিবর্তন

বর্তমানে `lands` টেবিলে কোনো `land_type` বা `category` কলাম নেই। এটি যোগ করতে হবে:

- `lands` টেবিলে `land_type` কলাম যোগ (text, default 'residential')
- বিদ্যমান ডেমো জমিগুলোতে বিভিন্ন ক্যাটেগরি সেট করা

### ফাইল পরিবর্তন

1. **DB Migration** — `lands` টেবিলে `land_type` কলাম যোগ
2. **`src/pages/Index.tsx`** — সার্চবার ৩ ফিল্ডে আপডেট:
   - Location (জেলা ড্রপডাউন — বিদ্যমান)
   - Land Type (নতুন ক্যাটেগরি ড্রপডাউন: আবাসিক, বাণিজ্যিক, কৃষি, শিল্প)
   - Budget Range (Min-Max BDT ইনপুট)
   - সবগুলো query param হিসেবে Listings পেজে পাস হবে
   - ডিজাইন: সাদা/ক্রিম ব্যাকগ্রাউন্ড, ভার্টিকাল ডিভাইডার, আইকন সহ — রেফারেন্স ইমেজ অনুযায়ী
3. **`src/pages/Listings.tsx`** — নতুন `landType` ফিল্টার state ও ফিল্টারিং লজিক যোগ, URL param থেকে ইনিশিয়ালাইজ

### টেকনিক্যাল ডিটেইলস

- ক্যাটেগরি ভ্যালু: `residential`, `commercial`, `agriculture`, `industrial`
- বাজেট রেঞ্জ: দুটি ইনপুট (min/max) একটি ফিল্ডে, ড্যাশ দিয়ে আলাদা
- সার্চবার স্টাইল: `bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-xl`, ভেতরে ৩টি সেকশন `border-r` দিয়ে আলাদা
- ডেমো ডেটা আপডেট: ৬টি জমিতে বিভিন্ন `land_type` সেট

