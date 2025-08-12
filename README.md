1:# HireGrade
2:
3:Grade resumes, rewrite to match a JD, generate cover letters, and manage billing.
4:
5:## Tech
6:- Next.js App Router, TypeScript
7:- Tailwind v4 (`@import "tailwindcss";`)
8:- Supabase (Auth, Postgres, Storage) with local stub mode if envs missing
9:- Stripe (Checkout + Billing Portal) with UI enabled but disabled buttons if envs missing
10:- OpenAI (gpt-4o-mini default)
11:- PostHog analytics
12:
13:## Getting Started
14:1. Copy envs
15:   ```bash
16:   cp .env.example .env.local
17:   ```
18:   Fill in keys. If envs are missing, the app runs in local stub mode:
19:   - Supabase: in-memory session and documents; banner indicates stub mode.
20:   - Stripe: pricing visible, checkout disabled with tooltip.
21:
22:2. Install and run
23:   ```bash
24:   bun install
25:   bun run dev
26:   # or npm run dev
27:   ```
28:   Open http://localhost:3000
29:
30:3. Tailwind v4 and PostCSS
31:   - `src/app/globals.css` must start with: `@import "tailwindcss";`
32:   - `postcss.config.mjs`:
33:     ```js
34:     /** @type {import('postcss-load-config').Config} */
35:     const config = { plugins: { "@tailwindcss/postcss": {} } };
36:     export default config;
37:     ```
38:
39:## Supabase
40:- Create a new project. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
41:
42:### SQL schema
43:```sql
44:create table profiles (
45:  user_id uuid primary key references auth.users(id) on delete cascade,
46:  plan text not null default 'free',
47:  credits int not null default 1,
48:  created_at timestamptz default now()
49:);
50:
51:create table resumes (
52:  id uuid primary key default gen_random_uuid(),
53:  user_id uuid references auth.users(id) on delete cascade,
54:  title text,
55:  file_url text,
56:  extracted_text text,
57:  created_at timestamptz default now()
58:);
59:
60:create table job_descriptions (
61:  id uuid primary key default gen_random_uuid(),
62:  user_id uuid references auth.users(id) on delete cascade,
63:  role text,
64:  company text,
65:  jd_text text,
66:  created_at timestamptz default now()
67:);
68:
69:create table analyses (
70:  id uuid primary key default gen_random_uuid(),
71:  user_id uuid references auth.users(id) on delete cascade,
72:  resume_id uuid references resumes(id) on delete set null,
73:  jd_id uuid references job_descriptions(id) on delete set null,
74:  scores jsonb,
75:  missing_keywords text[],
76:  recommendations text,
77:  created_at timestamptz default now()
78:);
79:
80:create table generated_docs (
81:  id uuid primary key default gen_random_uuid(),
82:  user_id uuid references auth.users(id) on delete cascade,
83:  type text,
84:  source_analysis uuid references analyses(id) on delete set null,
85:  content_md text,
86:  download_url text,
87:  created_at timestamptz default now()
88:);
89:
90:create table billing_events (
91:  id uuid primary key default gen_random_uuid(),
92:  user_id uuid references auth.users(id) on delete cascade,
93:  stripe_event jsonb,
94:  created_at timestamptz default now()
95:);
96:```
97:
98:### RLS
99:Enable RLS on each table and add:
100:```sql
101:alter table profiles enable row level security;
102:create policy "profiles self" on profiles for all using (auth.uid() = user_id);
103:
104:alter table resumes enable row level security;
105:create policy "resumes self" on resumes for all using (auth.uid() = user_id);
106:
107:alter table job_descriptions enable row level security;
108:create policy "jds self" on job_descriptions for all using (auth.uid() = user_id);
109:
110:alter table analyses enable row level security;
111:create policy "analyses self" on analyses for all using (auth.uid() = user_id);
112:
113:alter table generated_docs enable row level security;
114:create policy "docs self" on generated_docs for all using (auth.uid() = user_id);
115:
116:alter table billing_events enable row level security;
117:create policy "billing self" on billing_events for all using (auth.uid() = user_id);
118:```
119:
120:### Storage
121:- Create bucket: `resumes`. Policy to allow users to read/write their own files.
122:
123:## Stripe
124:- Create products/prices: One-time $19.99, Monthly $12.99, Annual $99.
125:- Checkout route: `/api/checkout`
126:- Webhook: `/api/stripe/webhook` returns 501 if env missing
127:
128:Local webhook:
129:```bash
130:stripe listen --forward-to localhost:3000/api/stripe/webhook
131:```
132:
133:## APIs
134:- POST `/api/analyze`: FormData { resume, jobText } → ATS-style scores + recommendations (stubbed)
135:- POST `/api/rewrite`: { resumeText, jobText, role? } → rewritten markdown + score boost + diff
136:- POST `/api/cover-letter`: { resumeText?, jobText, company, role } → cover letter markdown
137:- POST `/api/checkout`: { priceId } → Stripe URL (501 if Stripe env missing)
138:- POST `/api/stripe/webhook` → updates credits/plan (501 if env missing)
139:
140:## Analytics
141:- Set `NEXT_PUBLIC_POSTHOG_KEY` to enable.
142:
143:## Deploy (Vercel)
144:- Add env vars in Vercel project settings.
145:- Build command: `next build`
146:- Ensure webhook URL is accessible publicly.
147:
148:## Roadmap
149:- Wire Supabase real client and auth flows (Google OAuth + magic link).
150:- Implement file parsing via `pdf-parse` and `mammoth` on the server.
151:- Implement OpenAI prompts for grader explanation, resume rewrite, and cover letter.
152:- Stripe Checkout + Billing Portal full integration and plan/credits updates.
