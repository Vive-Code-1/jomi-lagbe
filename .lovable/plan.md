

## পেমেন্ট মেথড কার্ড না দেখানোর সমস্যা ও সমাধান

### সমস্যা চিহ্নিত
Step 4 এ প্যাকেজ সিলেক্ট করার পরেও বিকাশ/নগদ পেমেন্ট কার্ড দেখাচ্ছে না, যদিও:
- ডাটাবেসে ২টি payment method আছে (বিকাশ ও নগদ)
- API 200 রিটার্ন করছে
- কোডে রেন্ডারিং লজিক সঠিক আছে

### সম্ভাব্য কারণ
`supabase.from('payment_methods' as any)` — এই `as any` cast টাইপ সিস্টেমকে বিভ্রান্ত করতে পারে। যদিও `payment_methods` টেবিল types ফাইলে আছে, `as any` ব্যবহারে Supabase client সঠিকভাবে response parse নাও করতে পারে। এছাড়া, useQuery error হলে UI তে কোনো ফিডব্যাক নেই।

### সমাধান

**`src/pages/AddListing.tsx` ফিক্স:**

1. **`as any` সরানো** — `payment_methods` টেবিল types এ আছে, তাই cast অপ্রয়োজনীয়:
```tsx
// আগে:
const { data, error } = await supabase.from('payment_methods' as any).select('*').eq('is_active', true);
return data as any[];

// পরে:
const { data, error } = await supabase.from('payment_methods').select('*').eq('is_active', true);
return data;
```

2. **Error logging যোগ** — query error ধরতে:
```tsx
const { data: paymentMethods, error: pmError } = useQuery({...});
// console.log for debugging
```

3. **Fallback UI** — যদি paymentMethods লোড না হয় তাহলে একটি লোডিং/এরর মেসেজ দেখানো

### ফাইল পরিবর্তন
1. **`src/pages/AddListing.tsx`** — `as any` সরানো, proper typing, error handling যোগ

