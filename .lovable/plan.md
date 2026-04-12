

## এডমিন ড্যাশবোর্ড — সম্পূর্ণ রিডিজাইন

রেফারেন্স ডিজাইনের মতো প্রিমিয়াম সাইডবার-ভিত্তিক ড্যাশবোর্ড তৈরি হবে যেখানে সাইটের সব কন্টেন্ট ম্যানেজ করা যাবে।

### লেআউট

```text
┌──────────────┬──────────────────────────────────┐
│ Admin Portal │  Dashboard Overview              │
│ Estate Mgmt  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│              │  │Land│ │Ads │ │Earn│ │Inq │   │
│ ■ Dashboard  │  └────┘ └────┘ └────┘ └────┘   │
│ ■ My Listings│                                  │
│ ■ Payments   │  Recent Activities Table         │
│ ■ Ad Packages│                                  │
│ ■ Users      │                                  │
│ ■ Settings   │                                  │
└──────────────┴──────────────────────────────────┘
```

### সাইডবার মেনু ও ফিচার

**1. Dashboard (ড্যাশবোর্ড)**
- Stats কার্ড: Total Listings, Active Ads, Total Earnings (৳), New Inquiries
- Recent Activities টেবিল (সাম্প্রতিক লিস্টিং ও পেমেন্ট)

**2. My Listings (সব লিস্টিং ম্যানেজ)**
- সকল জমির তালিকা — সার্চ ও ফিল্টার সহ
- প্রতিটি লিস্টিং Edit / Delete / Toggle Featured / Toggle Status (active/inactive)
- নতুন লিস্টিং যোগ করার ডায়লগ (ইমেজ আপলোড সহ)

**3. Payments (পেমেন্ট)**
- সব পেমেন্টের তালিকা — status, amount, date
- Payment status ফিল্টার

**4. Ad Packages (এড প্যাকেজ ম্যানেজ)**
- বর্তমান প্যাকেজ দেখা, এডিট, ডিলিট
- নতুন প্যাকেজ যোগ (নাম, দাম, duration, featured toggle)

**5. Users (ইউজার ম্যানেজমেন্ট)**
- profiles টেবিল থেকে সব ইউজারের তালিকা
- ইউজারকে admin role দেওয়া/সরানো

### ডিজাইন
- Heritage Modernist থিম — `surface` (#fbfbe2) ব্যাকগ্রাউন্ড, `primary` (#004B23) সাইডবার
- No-border নীতি — background color shifts দিয়ে সেকশন আলাদা
- Navbar/Footer লুকানো `/admin` রাউটে (Auth পেজের মতো ফুলস্ক্রিন)

### ফাইল পরিবর্তন
1. **`src/pages/Admin.tsx`** — সম্পূর্ণ রিরাইট: সাইডবার + মাল্টি-সেকশন ড্যাশবোর্ড
2. **`src/App.tsx`** — `/admin` রাউটে Navbar/Footer হাইড
3. **Database migration** — profiles টেবিলে admin query এর জন্য কোনো নতুন টেবিল দরকার নেই (বিদ্যমান `user_roles` ও `profiles` ব্যবহার হবে)

