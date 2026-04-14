

## Vercel-এ Google Login 404 সমস্যা ফিক্স

### সমস্যা
`lovable.auth.signInWithOAuth("google")` ফাংশনটি `/~oauth/initiate` পাথে রিডাইরেক্ট করে — এটি শুধুমাত্র Lovable হোস্টিং (`*.lovable.app`) এ কাজ করে। Vercel-এ এই পাথ নেই, তাই 404 আসছে।

### সমাধান
`handleGoogleLogin` ফাংশনে হোস্টনেম চেক করা হবে। Lovable হোস্টিং-এ থাকলে `lovable.auth.signInWithOAuth` ব্যবহার হবে, অন্যথায় (Vercel বা অন্য কোনো হোস্টিং) Supabase-এর নেটিভ `supabase.auth.signInWithOAuth` ব্যবহার হবে।

### ফাইল পরিবর্তন

**`src/pages/Auth.tsx`** — `handleGoogleLogin` আপডেট:
```typescript
const isLovableHost = window.location.hostname.endsWith('.lovable.app');

if (isLovableHost) {
  // Lovable managed OAuth
  const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
  // ... existing handling
} else {
  // Supabase native OAuth (Vercel / custom domain)
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
  return; // browser redirects
}
```

### গুরুত্বপূর্ণ
Vercel-এ Google OAuth কাজ করতে হলে Lovable Cloud-এর Authentication Settings-এ নিজের Google OAuth Client ID ও Secret সেট করতে হবে (অথবা managed credentials ব্যবহার করতে হবে)। এছাড়া Google Cloud Console-এ Vercel ডোমেইন (`jomi-lagbe.vercel.app`) কে authorized redirect URL-এ যোগ করতে হবে।

### ফাইল তালিকা
1. **`src/pages/Auth.tsx`** — dual OAuth logic (Lovable vs Supabase native)

