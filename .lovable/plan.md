

## ২টি পরিবর্তন — ইমেজ আপলোড ফিচার ও ন্যাভবার আপডেট

### ১. ন্যাভবার থেকে "এড প্যাকেজ" মেনু সরানো

**`src/components/Navbar.tsx`:**
- ডেস্কটপ ও মোবাইল উভয় মেনু থেকে `/packages` NavLink সরিয়ে ফেলা হবে
- "বিজ্ঞাপন দিন" (Add Listing) বাটন ন্যাভ লিঙ্কের সাথে সেন্টারে দেখানো হবে (লগইন থাকলে)

### ২. ইমেজ আপলোড ফিচার (URL এর বদলে ফাইল আপলোড)

**Database Migration:**
- `land-images` নামে একটি public storage bucket তৈরি
- RLS পলিসি: authenticated ইউজাররা আপলোড করতে পারবে, সবাই দেখতে পারবে

**`src/pages/AddListing.tsx`:**
- Step 3 (Media) সেকশনে URL ইনপুট ফিল্ড সরিয়ে ফাইল আপলোড UI দেওয়া হবে
- ড্র্যাগ-এন্ড-ড্রপ এরিয়া + "ছবি নির্বাচন করুন" বাটন
- আপলোড করা ছবির প্রিভিউ থাম্বনেইল দেখানো হবে (X বাটন দিয়ে রিমুভ)
- সর্বোচ্চ ৫টি ছবি, প্রতিটি সর্বোচ্চ 5MB
- আপলোড লজিক: `supabase.storage.from('land-images').upload(...)` → public URL পেয়ে `formData.images` অ্যারেতে সেভ
- `FormData` এর `images` ফিল্ড আগের মতোই string URL অ্যারে থাকবে, শুধু সোর্স হবে storage

### ফাইল পরিবর্তন
1. **Database migration** — `land-images` storage bucket + RLS policies
2. **`src/pages/AddListing.tsx`** — URL ইনপুট → ফাইল আপলোড UI + Supabase Storage integration
3. **`src/components/Navbar.tsx`** — `/packages` লিঙ্ক সরানো

