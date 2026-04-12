

## ৩টি সমস্যা সমাধান

### ১. ক্যাটেগরি ড্রপডাউনে বাম প্যাডিং
- `select` এলিমেন্টের `option` গুলোতে `pl-3` বা inline style `paddingLeft` যোগ — তবে native `<option>` এ CSS সীমিত, তাই `select` এলিমেন্টেই `pl-2` প্যাডিং যোগ করা হবে।

### ২. ৩টি সেকশনের ব্যাকগ্রাউন্ড আলাদা করা
বর্তমানে Reviews + Stats + FAQ সব `bg-surface-container-low`:
- **Reviews সেকশন** (ক্যারোসেল): `bg-surface-container-low` → রাখা হবে
- **Stats সেকশন** (১০০%, ৫০হাজার+, নিরাপদ, ২৪/৭): আলাদা `section` হিসেবে বের করে `bg-surface` দেওয়া হবে
- **FAQ সেকশন**: `bg-surface-container` দেওয়া হবে

### ৩. Stats সেকশন কার্ড + হোভার + সেন্টার
- Stats grid কে Reviews সেকশন থেকে আলাদা `section` এ নিয়ে আসা
- প্রতিটি stat আইটেমকে কার্ড স্টাইল দেওয়া: `shadow-sm border border-outline-variant/20`
- হোভার ইফেক্ট: `hover:shadow-lg hover:-translate-y-1 transition-all duration-300`
- গ্রিড সেন্টার অ্যালাইন: `max-w-4xl mx-auto` দিয়ে মিডেল অ্যালাইন

### ফাইল পরিবর্তন
- **`src/pages/Index.tsx`** — select প্যাডিং, Stats আলাদা section, কার্ড স্টাইল, FAQ ব্যাকগ্রাউন্ড পরিবর্তন

