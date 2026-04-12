

## ৪টি সমস্যা সমাধান

### সমস্যা বিশ্লেষণ

1. **ক্যারোসেল** — বর্তমানে Embla `Autoplay` delay-ভিত্তিক (থেমে থেমে যাচ্ছে)। CSS marquee-style continuous scroll দরকার। বাম/ডান নেভ আইকন রিমুভ করতে হবে।
2. **"সব ক্যাটেগরি"** — ড্রপডাউনের placeholder টেক্সট পরিবর্তন করে "জমির ধরন নির্বাচন করুন" / "Select Land Type" করতে হবে।
3. **ইমেজ শো হচ্ছে না** — ডেটাবেসে images কলামে `/demo/land1.jpg` এসব fake path আছে। এগুলো বাস্তব URL দিয়ে আপডেট করতে হবে (Unsplash/পাবলিক ইমেজ)।
4. **বগুড়ায় জমি নেই** — বগুড়া লোকেশনে কিছু ডেমো জমি ইনসার্ট করতে হবে।

### ধাপসমূহ

1. **ক্যারোসেল → CSS Infinite Scroll**
   - Embla Carousel + Autoplay রিমুভ করে CSS `@keyframes` marquee animation ব্যবহার করা হবে
   - রিভিউ কার্ডগুলো দুইবার duplicate করে seamless infinite loop তৈরি হবে
   - `CarouselPrevious` ও `CarouselNext` সম্পূর্ণ রিমুভ
   - একটি নির্দিষ্ট স্পিডে (30-40s duration) বাম থেকে ডানে ক্রমাগত মুভ করবে

2. **ক্যাটেগরি placeholder ফিক্স**
   - `<option value="">` এর টেক্সট পরিবর্তন: "জমির ধরন নির্বাচন করুন" / "Select Land Type"

3. **ইমেজ ফিক্স (DB Migration)**
   - বিদ্যমান ৬টি জমির images কলাম আপডেট করে real Unsplash/পাবলিক ইমেজ URL দেওয়া হবে
   - বাংলাদেশের জমি/প্লট সম্পর্কিত ইমেজ

4. **বগুড়ায় ডেমো জমি (DB Migration)**
   - ৩-৪টি নতুন জমি ইনসার্ট: location_bn "বগুড়া", location_en "Bogura"
   - বিভিন্ন land_type (residential, agriculture, commercial)
   - real ইমেজ URL সহ

### ফাইল পরিবর্তন

- **`src/pages/Index.tsx`** — ক্যারোসেল সেকশন CSS marquee-তে রূপান্তর, ক্যাটেগরি placeholder পরিবর্তন
- **`src/index.css`** — `@keyframes marquee` animation যোগ
- **DB Migration** — বিদ্যমান জমির ইমেজ আপডেট + বগুড়ায় নতুন জমি ইনসার্ট

