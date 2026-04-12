

## হোমপেজে ক্লায়েন্ট রিভিউ ক্যারোসেল ও FAQ সেকশন যোগ

### যা করা হবে

1. **ক্লায়েন্ট রিভিউ ক্যারোসেল** — বর্তমান Trust সেকশনের টেস্টিমোনিয়ালগুলো একটি ইনফিনিটি অটো-স্ক্রল ক্যারোসেলে রূপান্তর করা হবে। আরও ৪-৫টি ডেমো রিভিউ যোগ হবে। `embla-carousel` (যা ইতোমধ্যে ইনস্টল আছে) + `autoplay` plugin ব্যবহার করে ইনফিনিট লুপ স্ক্রল করবে।

2. **FAQ সেকশন** — CTA সেকশনের আগে একটি FAQ সেকশন যোগ হবে। ৬টি প্রশ্ন-উত্তর — বামে ৩টি, ডানে ৩টি (2-column grid)। Accordion স্টাইলে প্রতিটি প্রশ্নে ক্লিক করলে উত্তর দেখাবে।

### ফাইল পরিবর্তন

**`src/pages/Index.tsx`:**
- Trust সেকশনে রিভিউ কার্ডগুলো `Carousel` + `CarouselContent` + `CarouselItem` এ wrap করা
- `embla-carousel-autoplay` plugin যোগ করে infinite loop + auto-scroll
- ৬-৮টি ডেমো রিভিউ ডেটা array তৈরি (বাংলা ও ইংরেজি)
- CTA এর আগে নতুন FAQ সেকশন — `Accordion` কম্পোনেন্ট ব্যবহার করে 2-column grid এ ৬টি FAQ
- বাংলা/ইংরেজি দুই ভাষায় FAQ কনটেন্ট

**`package.json`:**
- `embla-carousel-autoplay` ডিপেন্ডেন্সি ইনস্টল

### টেকনিক্যাল ডিটেইলস

- ক্যারোসেল: `Autoplay({ delay: 4000, stopOnInteraction: false })` + `loop: true`
- FAQ: shadcn `Accordion` কম্পোনেন্ট, `grid grid-cols-1 md:grid-cols-2 gap-6` লেআউট
- রিভিউ কার্ড ডিজাইন: বর্তমান Heritage Modernist থিম অনুসরণ, ৫-স্টার রেটিং, নাম, উপাধি সহ

