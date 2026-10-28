# Book Shelf

কাঠের তাকে সাজানো আপনার নিজের বইয়ের অ্যাপ। বই থাকে Google Drive-এ, তাকের হিসাব, দাগ, নোট আর বুকমার্ক থাকে Firebase-এ। তাই ল্যাপটপ আর মোবাইলে একই তাক দেখবেন।

## কী কী আছে

- **তাক:** কাঠের তাক, বইয়ের পিঠ (Spines) অথবা মলাট (Covers) দেখার দুই ধরন। প্রতিটা তাক ডানে-বামে সরে। উপরের স্লাইডার বা দুই আঙুলে বই ছোট-বড় করা যায়।
- **বিভাগ ও ট্যাগ:** Drive-এর প্রতিটা সাবফোল্ডার নিজে থেকেই একটা বিভাগ হয়। নতুন বিভাগ ও রঙিন ট্যাগ (Viva, OSPE, Long case…) যোগ, নাম বদল, মুছে ফেলা আর ক্রম বদলানো যায়।
- **খোঁজা:** উপরের খোঁজার ঘরে নাম, লেখক, বিভাগ, আপনার নোট ও হাইলাইট, আর বইয়ের ভেতরের লেখা একসাথে খোঁজে।
- **পড়ার জায়গা:** হাইলাইট (৫ রঙ), নিচে দাগ, কেটে দেওয়া, কলম, হাইলাইটার, পাতায় লেখা, নোট, রাবার, আগের অবস্থায় ফেরা। দিন, Sepia, Eye care, Dusk আর Night মোড। পাতা নিচে নামিয়ে বা এক পাতা করে পড়া। সূচিপত্র, বুকমার্ক, পাতায় যাওয়া, বইয়ের ভেতরে খোঁজা।
- **Word, Excel, PowerPoint:** Word আর Excel সরাসরি খোলে। PowerPoint আর পুরোনো Word ফাইল Google Drive PDF বানিয়ে দেয়, তখন সেগুলোতেও দাগানো যায়।
- **দাগানো কপি:** More → “Save a marked copy” দিলে দাগ আর নোটসহ নতুন একটা PDF আপনার Drive-এ বইয়ের পাশেই রাখা হয়। মূল ফাইল বদলায় না।
- **নোটবুক:** সব বইয়ের সব হাইলাইট, নোট আর বুকমার্ক এক জায়গায়।
- **পড়ার হিসাব:** কত মিনিট পড়লেন, কয়দিন টানা পড়ছেন, কোন বই কতটা শেষ হলো।

## ধাপ ১: GitHub-এ তোলা

1. GitHub-এ নতুন একটা repository বানান, যেমন `bookshelf`।
2. এই ফোল্ডারের সব ফাইল আপলোড করুন (`index.html`, `config.js`, `sw.js`, `manifest.json`, `demo-data.js`, `icons/`, `lib/`)।
3. **Settings → Pages → Branch: main / root → Save**।
4. কিছুক্ষণ পর `https://<আপনার-নাম>.github.io/bookshelf/` খুললে অ্যাপ চলবে।

`config.js` পূরণ না করা পর্যন্ত অ্যাপ শুধু ওই যন্ত্রেই বই রাখে, উদাহরণের বই দিয়ে সব দেখে নিতে পারবেন।

## ধাপ ২: Firebase (নতুন প্রজেক্ট)

নতুন Gmail-এ যে Firebase প্রজেক্ট খুলেছেন, সব কাজ সেটাতেই হবে। Firebase আর Google Cloud দুই জায়গাতেই উপরের ডানদিকে ওই নতুন Gmail দিয়ে ঢুকেছেন কিনা আগে দেখে নিন।

1. **Google লগইন চালু করুন:** Firebase → **Build → Authentication → Get started → Sign-in method → Google → Enable**। Project support email দিয়ে **Save**।
2. **ঠিকানা অনুমোদন:** Authentication → **Settings → Authorized domains → Add domain** → `shishir163.github.io`।
3. **ডেটাবেস:** **Build → Firestore Database → Create database** → **Production mode** → location `asia-south1` (Mumbai)।
4. **Rules:** Firestore → **Rules** ট্যাবে পুরো লেখা মুছে নিচেরটা বসিয়ে **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

5. **অ্যাপের তথ্য নিন:** **Project settings (চাকা চিহ্ন) → General → Your apps → Web (`</>`)** → নাম দিন (যেমন `bookshelf`) → **Register app**। যে `firebaseConfig` দেখাবে, সেখান থেকে `apiKey`, `authDomain`, `projectId`, `appId` কপি করে `config.js`-এর `firebase` অংশে বসান।

## ধাপ ৩: Google Drive চালু করা

[console.cloud.google.com](https://console.cloud.google.com) খুলুন। উপরে প্রজেক্টের নামের জায়গায় নতুন Firebase প্রজেক্টটাই বেছে নিন (নাম একই থাকে)।

1. **Drive API:** **APIs & Services → Library** → “Google Drive API” খুঁজে **Enable**।
2. **Consent screen:** **APIs & Services → OAuth consent screen** (নতুন নাম Google Auth Platform)। প্রথমবার হলে **Get started** চেপে অ্যাপের নাম `Book Shelf`, নিজের ইমেইল দিন, Audience **External** বেছে শেষ করুন।
3. **Test users:** **Audience → Test users → Add users**। এখানে **যে Gmail-এ আপনার বইগুলো আছে** সেটা যোগ করুন (যেমন `shishir.mmc163@gmail.com`)। প্রজেক্ট অন্য Gmail-এ খোলা হলেও লগইন হবে বইয়ের Gmail দিয়ে।
4. **Drive অনুমতি:** **Data access → Add or remove scopes** → `.../auth/drive` টিক দিয়ে **Update → Save**।
5. **Client ID:** **APIs & Services → Credentials** → “Web client (auto created by Google Service)” খুলুন। **Authorized JavaScript origins**-এ `https://shishir163.github.io` যোগ করে **Save**। একই পাতার **Client ID** কপি করে `config.js`-এর `googleClientId`-এ বসান।
6. বদলানো `config.js` GitHub-এ আপলোড করুন। বদল চালু হতে কয়েক মিনিট লাগতে পারে।

**কিছু জানার কথা**
- `config.js`-এর মানগুলো গোপন কিছু নয়, GitHub-এ খোলা থাকলেও সমস্যা নেই। আপনার তথ্য Rules দিয়ে সুরক্ষিত, শুধু আপনি লগইন করে দেখতে পারবেন।
- পরীক্ষামূলক (Testing) অবস্থায় Google প্রায় সাত দিন পর পর আবার অনুমতি চাইতে পারে। একবার চাপলেই হবে।
- বিনা মূল্যের Firebase-এ দিনে ৫০,০০০ বার পড়া যায়। কয়েকশো বই থাকলেও এর অনেক নিচে থাকবে।

## ধাপ ৪: প্রথমবার চালানো

1. অ্যাপ খুলে **Sign in with Google**। বইয়ের Gmail বেছে নিন। Google “Google hasn't verified this app” লিখলে **Advanced → Go to Book Shelf (unsafe)** চেপে Drive দেখার অনুমতি দিন। অ্যাপটা আপনার নিজের, তাই এটা স্বাভাবিক।
2. **Choose Drive folder** → বইয়ের মূল ফোল্ডারটা খুলে **Use** চাপুন। ভেতরের Anaesthesia, Medicine, Physiology ইত্যাদি সাবফোল্ডার বিভাগ হয়ে যাবে।
3. বইগুলো তাকে আসবে, মলাট ধীরে ধীরে তৈরি হবে।
4. Settings → **Find details for all** চাপলে অনলাইন থেকে লেখক, প্রকাশক, বছর আর সুন্দর মলাট আসবে। কোনো বই ভুল এলে বইয়ের পাতায় **Find details online** দিয়ে ঠিক সংস্করণ বেছে নিন।
5. মোবাইলে: Safari → Share → **Add to Home Screen**। Android-এ Chrome মেনু → **Install app**।

ল্যাপটপে একই ঠিকানা খুলে একই Google অ্যাকাউন্টে লগইন করলে একই তাক দেখবেন।

## জেনে রাখা ভালো

- Drive-এ নতুন বই রাখলে অ্যাপ খোলার সময় নিজেই খুঁজে নেয়। সাথে সাথে চাইলে **+ → Check for new books**।
- Google-এর অনুমতি প্রতি ঘণ্টায় নবায়ন হয়। মাঝে মাঝে বই খুলতে গেলে ছোট একটা Google জানালা এসে চলে যাবে, এটাই স্বাভাবিক।
- একবার খোলা বই যন্ত্রে রেখে দেওয়া হয় (Settings-এ জায়গা ঠিক করা যায়), তাই পরের বার দ্রুত খোলে আর ইন্টারনেট ছাড়াও পড়া যায়। কোনো বই সবসময় রাখতে চাইলে বইয়ের পাতায় **Keep on this device**।
- বইয়ের ভেতরে খোঁজা যায় সেই বইগুলোতে, যেগুলো এই যন্ত্রে অন্তত একবার খোলা হয়েছে। সব বই একসাথে তৈরি করতে Settings → **Make all books searchable** (Wi-Fi-তে করুন)।
- অ্যাপ বদলালে `index.html`-এর `APP_VERSION` আর `sw.js`-এর `VERSION` বাড়িয়ে দিন, তাহলে মোবাইল নতুনটা নেবে।
