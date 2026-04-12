

## ইউজার ড্যাশবোর্ড + ম্যানুয়াল পেমেন্ট সিস্টেম

### ১. ইউজার ড্যাশবোর্ড (নতুন পেজ)

**`src/pages/UserDashboard.tsx`** — নতুন পেজ তৈরি:
- লগইন করা ইউজার তার সব জমি লিস্টিং দেখতে পাবে (`lands` টেবিল থেকে `user_id = auth.uid()`)
- প্রতিটি লিস্টিংয়ের পাশে স্ট্যাটাস ব্যাজ: `pending` (হলুদ), `active` (সবুজ/verified), `rejected` (লাল)
- পেমেন্ট হিস্ট্রি সেকশন — ইউজারের নিজের পেমেন্ট ও তাদের স্ট্যাটাস দেখাবে
- সিম্পল সাইডবার বা ট্যাব লেআউট: "আমার বিজ্ঞাপন" | "পেমেন্ট" 

**`src/App.tsx`** — `/dashboard` রাউট যোগ  
**`src/components/Navbar.tsx`** — লগইন থাকলে "ড্যাশবোর্ড" লিংক যোগ

### ২. ম্যানুয়াল পেমেন্ট সিস্টেম

**Database migration — `payment_methods` টেবিল:**
```sql
CREATE TABLE payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method_name text NOT NULL,        -- 'বিকাশ', 'নগদ', 'রকেট'
  account_number text NOT NULL,     -- '01XXXXXXXXX'
  payment_type text NOT NULL DEFAULT 'send_money', -- 'send_money' | 'cash_out'
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- RLS: admin can manage, everyone can view active
```

**`payments` টেবিলে নতুন কলাম:**
```sql
ALTER TABLE payments ADD COLUMN sender_number text;
ALTER TABLE payments ADD COLUMN sender_transaction_id text;
ALTER TABLE payments ADD COLUMN payment_method_id uuid;
```

**এডমিন ড্যাশবোর্ড — নতুন সেকশন "পেমেন্ট মেথড":**
- এডমিন বিকাশ/নগদ/রকেট নাম্বার যোগ, এডিট, ডিলিট করতে পারবে
- প্রতিটি মেথডে: নাম, নাম্বার, টাইপ (সেন্ড মানি/ক্যাশ আউট), Active toggle
- Admin Section type এ `'payment-methods'` যোগ

**AddListing পেজ — Step 4 আপডেট:**
- প্যাকেজ সিলেক্ট করার পর **পেমেন্ট মেথড কার্ড** দেখাবে (ছবির মার্ক করা এরিয়া)
- প্রতিটি মেথড কার্ড-স্টাইলে: লোগো/নাম, নাম্বার, টাইপ (সেন্ড মানি/ক্যাশ আউট)
- ইনপুট ফিল্ড: "আপনার নাম্বার" + "ট্রানজেকশন আইডি"
- সাবমিটের সময় এই তথ্য `payments` টেবিলে সেভ হবে

### ৩. লিস্টিং স্ট্যাটাস ফ্লো
- ইউজার জমি সাবমিট করলে `status = 'pending'` সেট হবে (বর্তমানে `active`)
- এডমিন ড্যাশবোর্ড থেকে `pending → active` (verified) বা `rejected` করতে পারবে
- পাবলিক Listings পেজে শুধু `active` স্ট্যাটাসের জমি দেখাবে (ইতোমধ্যে আছে)

### ফাইল পরিবর্তন
1. **Database migration** — `payment_methods` টেবিল + `payments` কলাম যোগ + RLS
2. **`src/pages/UserDashboard.tsx`** — নতুন ইউজার ড্যাশবোর্ড পেজ
3. **`src/pages/Admin.tsx`** — "পেমেন্ট মেথড" সেকশন যোগ, লিস্টিং স্ট্যাটাস pending সাপোর্ট
4. **`src/pages/AddListing.tsx`** — Step 4 এ পেমেন্ট মেথড কার্ড + sender info ইনপুট
5. **`src/App.tsx`** — `/dashboard` রাউট
6. **`src/components/Navbar.tsx`** — ড্যাশবোর্ড লিংক

