

## Lottie Animation যোগ করার পরিকল্পনা

### পদ্ধতি
`lottie-react` প্যাকেজ ইনস্টল করে LottieFiles থেকে ফ্রি JSON অ্যানিমেশন URL ব্যবহার করা হবে। যেখানে যেখানে স্ট্যাটিক আইকন আছে সেখানে Lottie অ্যানিমেশন দিয়ে replace করা হবে।

### কোথায় কোথায় Lottie যোগ হবে

| জায়গা | বর্তমান | Lottie অ্যানিমেশন |
|--------|---------|-------------------|
| **404 NotFound পেজ** | শুধু টেক্সট | 404 ক্যারেক্টার অ্যানিমেশন |
| **Index — How It Works** | স্ট্যাটিক Upload/SearchCheck আইকন | বিক্রেতা: ডকুমেন্ট আপলোড অ্যানিমেশন, ক্রেতা: সার্চ অ্যানিমেশন |
| **Index — Stats সেকশন** | স্ট্যাটিক Shield/Users/Headphones আইকন | Security shield, community, support অ্যানিমেশন |
| **Index — Loading state** | পালস div | সুন্দর লোডিং স্পিনার Lottie |
| **About — Bento Grid আইকন** | স্ট্যাটিক ShieldCheck/Map/CreditCard/Headphones | ভেরিফাইড, ম্যাপ, পেমেন্ট, সাপোর্ট অ্যানিমেশন |
| **Contact — তথ্য কার্ড আইকন** | Phone/Mail/MapPin আইকন | ফোন রিং, ইমেইল ফ্লাই, লোকেশন পিন অ্যানিমেশন |
| **Auth পেজ** | কোনো ভিজ্যুয়াল নেই | লগইন/সিকিউরিটি অ্যানিমেশন |
| **Empty states** | সব পেজে শুধু টেক্সট | "No data" / "Empty" অ্যানিমেশন |

### টেকনিক্যাল বিবরণ
- `lottie-react` প্যাকেজ ইনস্টল
- `src/components/LottieAnimation.tsx` — reusable wrapper (lazy load JSON via URL)
- LottieFiles CDN থেকে ফ্রি অ্যানিমেশন JSON URL ব্যবহার (কোনো API key লাগবে না)
- প্রতিটি অ্যানিমেশন `loop`, `autoplay`, সাইজ কন্ট্রোল prop সহ
- `prefers-reduced-motion` রেসপেক্ট করবে

### ফাইল তালিকা
1. **package.json** — `lottie-react` ইনস্টল
2. **`src/components/LottieAnimation.tsx`** — Reusable Lottie wrapper
3. **`src/pages/NotFound.tsx`** — 404 Lottie অ্যানিমেশন
4. **`src/pages/Index.tsx`** — How It Works, Stats, Loading state-এ Lottie
5. **`src/pages/About.tsx`** — Bento grid আইকনে Lottie
6. **`src/pages/Contact.tsx`** — তথ্য কার্ডে Lottie
7. **`src/pages/Auth.tsx`** — লগইন পেজে Lottie

