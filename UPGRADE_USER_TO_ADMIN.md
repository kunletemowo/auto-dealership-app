# How to Upgrade a User to Admin

The app treats a user as admin if **either**:

- `profiles.role = 'admin'`, or  
- there is a row in `user_roles` with `user_id` and `role = 'admin'`.

Use **Option A** to create the first admin (no existing admin). Use **Option B** to promote users from the app when you already have at least one admin.

---

## Option A: First admin (via Supabase)

Use this when there are no admins yet (e.g. new project or you can’t open `/admin/users`).

### 1. Get the user’s email

Use the email of the account that should become admin (e.g. `testuser@gmail.com`).

### 2. Run SQL in Supabase

1. Open **Supabase Dashboard** → **SQL Editor**.
2. Open **CREATE_FIRST_ADMIN.sql** in your project.
3. In that script, set the email (around line 18):
   - Change `target_email TEXT := 'testuser@gmail.com';` to the actual email.
4. Run the full script (Execute).

The script will:

- Find the user in `auth.users` by email.
- Insert/update `user_roles` with `role = 'admin'`.
- Set `profiles.role = 'admin'` for that user.

### 3. (Optional) Get user ID first, then set admin

If you prefer to set admin by user ID:

1. **Supabase Dashboard** → **Authentication** → **Users**.
2. Find the user and copy their **User UID**.
3. **SQL Editor** – run (replace `USER_ID_HERE` with that UUID):

```sql
-- Set in user_roles
INSERT INTO user_roles (user_id, role, assigned_at)
VALUES ('USER_ID_HERE', 'admin', NOW())
ON CONFLICT (user_id) DO UPDATE SET role = 'admin', updated_at = NOW();

-- Set in profiles (app checks this first)
UPDATE profiles SET role = 'admin' WHERE id = 'USER_ID_HERE';
```

### 4. Confirm

- Log in as that user, then open **/admin/users** (or use the **Admin** link in the header if it appears).
- Or run the verification query from **CREATE_FIRST_ADMIN.sql** to see admins in `user_roles` and `profiles`.

---

## Option B: Promote users from the app (when you already have an admin)

Use this when at least one admin already exists and you can open **/admin/users**.

1. **Log in** as an admin user.
2. Go to **Admin** in the header → **Users** (or open **/admin/users**).
3. Find the user (search by name/email if the list is long).
4. In the **Role** section for that user, click **Admin**.
5. The app will call `updateUserRole`, which updates the **user_roles** table. If your project keeps **profiles.role** in sync (e.g. via trigger or **SYNC_ADMIN_ROLES_TO_PROFILES.sql**), run that sync so `profiles.role` is also `'admin'` and the app’s “profiles first” admin check works everywhere.

---

## If the Admin link or /admin/users doesn’t show

- The app decides “is admin?” from **profiles.role** first, then **user_roles**.
- Ensure the user has `role = 'admin'` in **profiles** and/or **user_roles** (Option A or sync script).
- Sign out and sign back in so the session is fresh; the admin check runs again.
- See **ADMIN_ACCESS_TROUBLESHOOTING.md** for more checks.

---

## Summary

| Situation | What to do |
|-----------|------------|
| No admin exists yet | Use **Option A**: run **CREATE_FIRST_ADMIN.sql** in Supabase (after setting the correct email or user ID). |
| An admin already exists | Use **Option B**: log in as admin → **Admin** → **Users** → set the user’s role to **Admin**. |
| Only `user_roles` updated (e.g. via app) | Run **SYNC_ADMIN_ROLES_TO_PROFILES.sql** or ensure your trigger updates **profiles.role** so both stay in sync. |
