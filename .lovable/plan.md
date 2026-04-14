

## WhatsApp Live Chat Button যোগ করা

### কী করা হবে
সাইটের নিচে ডান কোণায় একটি ফ্লোটিং WhatsApp বাটন যোগ করা হবে যেটিতে ক্লিক করলে সরাসরি WhatsApp চ্যাট ওপেন হবে।

### ফাইল পরিবর্তন

**১. নতুন ফাইল: `src/components/WhatsAppButton.tsx`**
- ফ্লোটিং বাটন (fixed, bottom-right corner)
- WhatsApp আইকন সহ pulse অ্যানিমেশন
- হোভারে টুলটিপ ("Chat with us")
- ক্লিক করলে `https://wa.me/8801791208768` ওপেন হবে (Contact পেজের নম্বর)
- GSAP দিয়ে entry bounce অ্যানিমেশন
- মোবাইল ও ডেস্কটপ রেসপন্সিভ

**২. `src/App.tsx`** — WhatsAppButton কম্পোনেন্ট গ্লোবালি যোগ করা হবে

### টেকনিক্যাল ডিটেইল
- WhatsApp green (`#25D366`) ব্যাকগ্রাউন্ড কালার
- CSS `animate-pulse` রিং ইফেক্ট দিয়ে দৃষ্টি আকর্ষণ
- `z-index: 40` যাতে Navbar-এর নিচে কিন্তু বাকি সবের উপরে থাকে
- `target="_blank"` দিয়ে নতুন ট্যাবে WhatsApp ওপেন হবে

