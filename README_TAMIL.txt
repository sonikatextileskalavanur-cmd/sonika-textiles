SONIKA TEXTILES V3 – பயன்பாட்டு வழிமுறை
====================================

இந்த package-ல் உள்ளவை:
1. index.html        – முக்கிய website
2. styles.css        – முழு design / mobile responsive
3. site.js           – products, category, WhatsApp, settings load
4. admin.html        – product photo upload + website settings admin page
5. admin.js          – admin login/upload/update logic
6. config.js         – Supabase URL + Anon Key மட்டும் இங்கே சேர்க்க வேண்டும்
7. supabase.sql      – database/security setup
8. CNAME             – sonikatextiles.com

முக்கியம்:
- Backend connect செய்யாமல் இருந்தாலும் website demo products-உடன் open ஆகும்.
- அடிக்கடி photo/product add செய்ய வேண்டுமென்றால் Supabase backend connect செய்ய வேண்டும்.
- Service Role Key-ஐ website code-ல் எந்த நிலையிலும் போட வேண்டாம்.
- Browser-ல் பயன்படுத்துவது Supabase Project URL + ANON/PUBLISHABLE key மட்டும்.

BACKEND SETUP (ஒருமுறை மட்டும்)
------------------------------
1. https://supabase.com சென்று account உருவாக்கவும்.
2. New Project உருவாக்கவும்.
3. SQL Editor > New query > supabase.sql முழுவதையும் paste செய்து Run செய்யவும்.
4. Authentication > Users பகுதியில் admin email/password user உருவாக்கவும்.
5. Project Settings / API பகுதியில்:
   - Project URL
   - anon public / publishable key
   இரண்டையும் copy செய்யவும்.
6. config.js திறந்து:
   supabaseUrl: "YOUR PROJECT URL"
   supabaseAnonKey: "YOUR ANON KEY"
   என்று paste செய்யவும்.

WEBSITE UPLOAD – GITHUB PAGES
-----------------------------
1. பழைய website files-ஐ repository-ல் replace செய்யவும்.
2. இந்த folder-ல் உள்ள எல்லா files-ஐ repository root-க்கு upload செய்யவும்.
3. Settings > Pages > Deploy from branch > main > /(root)
4. Custom Domain: sonikatextiles.com
5. CNAME file-ஐ delete செய்ய வேண்டாம்.

ADMIN பயன்படுத்துவது
-------------------
Website live ஆனபின்:
https://sonikatextiles.com/admin.html

Login செய்து:
- Product Name
- Category
- Price / Offer
- Description
- Photo
சேர்த்து Upload & Add Product அழுத்தவும்.

Website Settings பகுதியில்:
- Phone
- WhatsApp
- Email
- GSTIN
- Address
- Facebook
- Instagram
- Google Maps
- Announcement
அனைத்தையும் code edit செய்யாமல் update செய்யலாம்.

PHOTO SIZE
----------
சிறந்த வேகம் பெற 1200px-க்கு குறைவான JPG/WebP photo பயன்படுத்தவும்.
ஒவ்வொரு photo 5MB-க்கு கீழ் இருக்க வேண்டும்.

SECURITY
--------
- admin.html public URL என்றாலும் login இல்லாமல் மாற்றம் செய்ய முடியாது.
- RLS policies supabase.sql-ல் கொடுக்கப்பட்டுள்ளது.
- உங்கள் admin password-ஐ யாருக்கும் கொடுக்க வேண்டாம்.
