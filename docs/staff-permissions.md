# Staff section permissions

Admins assign permissions in **Administration → Users → select a user → Staff
section permissions**, then Save. Permissions can also be selected when creating
an invitation; activation copies them to the new account.

| Level | Staff access |
| --- | --- |
| No access | Hidden in the admin; no drafts, previews, history or private records |
| View | Read records, drafts, previews and version history; no changes |
| Modify | View, create and edit all records in that section, and submit drafts |

Access applies to the whole section, regardless of who created a record. There
are no per-author or individual-record assignments. Approved public content stays
publicly readable even by someone without access to its admin section.

## Available sections

| Permission | Records covered |
| --- | --- |
| Blog | Posts and categories |
| Media library | Images, alternative text, captions and attribution |
| Careers | Jobs and recruitment settings; dictionary viewing |
| Recruitment | Applications, private CV downloads and hiring history |
| Company details | Company Settings global |
| Page SEO | Page SEO global |
| Internal FAQs | Backend-only questions and answers |
| Announcements | Site-wide announcements |
| Legal pages | Privacy policy and terms documents |

Modify does not override existing restrictions. Only admins publish, unpublish,
permanently delete eligible content, manage reference dictionaries, manage users
and invitations, or configure private recruitment notification recipients. Private
CV uploads/metadata remain admin-managed; recruitment staff may download CVs.
Application creation remains through the public form. Recruitment Modify permits
operational status, notes and assignment changes; hiring history is read-only.

View includes private information within the assigned section. Grant Recruitment
View only to colleagues authorised to see applicant details and download CVs.
Assignments require an active colleague with Recruitment access. The existing
user directory still shows staff only their own profile, so admins assign other
colleagues.

## Example: blog editor

Set Blog to **Modify** and Media library to **View** to let someone create or edit
any article/category and select approved images. Set Media library to **Modify**
if they should also upload and submit new images. Other sections can stay at
No access. New images and categories need admin approval before article publication.
Without Media access, public approved images stay readable but private media and
the admin library remain restricted.

The review process remains Save Draft → select in-review → Save Draft → admin
review/publish. Editing a submitted article invalidates its submission. Editing a
published article keeps its approved version live until a replacement is approved.
See [blog editing](blog-editing.md).

## Existing accounts and rollout

Apply the staff-section-permissions migration before running this code against an
existing database. It adds permission fields to users and invitations, with No
access defaults. **Existing staff and pending invitations do not retain broad
access automatically.** An admin must assign the appropriate sections. Admins
retain full access independently of these fields.

Permission changes revoke the affected user's sessions. Ask them to sign in again
and reload the admin after an assignment changes. Staff may read their own
permissions but cannot change them, their role, or account activation status.
Restrictions are enforced by Payload access functions and workflow hooks, not
only by hiding navigation links. Public pages continue to read approved content.

Current deployment decisions: Supabase PostgreSQL is selected; filesystem uploads
remain in use. R2 and T12 production acceptance are deferred. This feature does
not migrate storage or provision production services.
