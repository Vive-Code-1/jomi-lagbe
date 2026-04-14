

## সাইটে অ্যানিমেশন যোগ করার পরিকল্পনা

### পদ্ধতি
GSAP (GreenSock Animation Platform) ইনস্টল করে একটি কাস্টম `useScrollAnimation` হুক এবং reusable `AnimatedSection` কম্পোনেন্ট তৈরি করা হবে। এরপর সকল পেজে scroll-reveal, hover, এবং stagger অ্যানিমেশন যোগ করা হবে।

### ফাইল পরিবর্তন

**১. প্যাকেজ ইনস্টল:** `gsap` npm প্যাকেজ

**২. নতুন ফাইল: `src/hooks/useScrollAnimation.ts`**
- GSAP ScrollTrigger ব্যবহার করে scroll-based fade-in, slide-up, slide-left/right অ্যানিমেশন
- `useGSAP` হুক যা ref এ অ্যানিমেশন অ্যাটাচ করে

**৩. নতুন ফাইল: `src/components/AnimatedSection.tsx`**
- Reusable wrapper কম্পোনেন্ট — `direction` (up/left/right/fade), `delay`, `stagger` props
- যেকোনো সেকশনকে wrap করলেই scroll অ্যানিমেশন পাবে

**৪. `src/pages/Index.tsx` আপডেট:**
- Hero text: staggered fade-in (শিরোনাম → সাবটাইটেল → সার্চবার)
- Categories: stagger slide-up (প্রতিটি কার্ড ০.১৫s ডিলে)
- Latest Listings: scroll-triggered fade-up
- How It Works: left/right slide-in
- Reviews, Stats, FAQ, CTA: scroll-triggered fade-up
- সার্চ বাটন: active:scale-95 → GSAP bounce effect

**৫. `src/components/LandCard.tsx` আপডেট:**
- হোভারে কার্ড slightly lift + shadow increase (GSAP)
- ইমেজ hover scale ইতোমধ্যে আছে, সেটা রাখা হবে

**৬. `src/pages/About.tsx` আপডেট:**
- Hero section: left content slide-in, right image fade-in
- Bento grid cards: staggered scroll reveal
- Stats counter: scroll-triggered number count-up animation

**৭. `src/pages/Contact.tsx` আপডেট:**
- Contact info cards ও form: scroll-triggered fade-up

**৮. `src/components/Navbar.tsx` আপডেট:**
- পেজ লোডে navbar slide-down animation
- মোবাইল মেনু open/close: GSAP stagger animation

**৯. `src/components/Footer.tsx` আপডেট:**
- Scroll-triggered fade-up কলাম by কলাম

**১০. `src/index.css` আপডেট:**
- `.gsap-hidden { opacity: 0; }` initial state class যোগ

### টেকনিক্যাল বিবরণ
- GSAP ScrollTrigger plugin রেজিস্টার হবে একবার (main.tsx বা হুকে)
- সব অ্যানিমেশন `will-change: transform` ব্যবহার করবে পারফরম্যান্সের জন্য
- মোবাইলে `prefers-reduced-motion` মিডিয়া কুয়েরি রেসপেক্ট করবে
- Cleanup: useEffect return এ GSAP kill করবে

### ফাইল তালিকা
1. **package.json** — `gsap` ইনস্টল
2. **`src/hooks/useScrollAnimation.ts`** — GSAP ScrollTrigger হুক
3. **`src/components/AnimatedSection.tsx`** — Reusable animated wrapper
4. **`src/index.css`** — initial hidden state
5. **`src/pages/Index.tsx`** — সব সেকশনে অ্যানিমেশন
6. **`src/components/LandCard.tsx`** — hover animation
7. **`src/pages/About.tsx`** — scroll animations
8. **`src/pages/Contact.tsx`** — scroll animations
9. **`src/components/Navbar.tsx`** — entry animation
10. **`src/components/Footer.tsx`** — scroll animation

