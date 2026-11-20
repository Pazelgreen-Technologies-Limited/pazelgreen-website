# Legal pages and SEO

Legal Pages contains two fixed identities: privacy-policy and terms-of-service.
Create the missing identity once, then keep editing that document. Identities
cannot change after creation and approved content must not be deleted; unpublish
when necessary. The existing footer links open `/privacy-policy` and
`/terms-of-service`.

Staff enter a title, restricted rich-text body, effective date and optional SEO
title/description. The editor supports headings, paragraphs, emphasis, lists and
safe links. Uploads, arbitrary embeds and HTML are excluded. Submit for review;
an admin publishes the unchanged submission only after company/legal approval.
There is no default or automatically generated policy copy. Until publication,
the public page returns not found with noindex; a draft is never a public fallback.

Enter Effective Date as a valid calendar date in `YYYY-MM-DD`; it has no timezone.
It is displayed information, not an activation schedule. Publication
makes the approved version available immediately. Change the date only as approved
by the policy owner. Version history retains prior revisions and reviewer details.
Editing approved content preserves the previous public body, date and SEO until
the replacement is approved. Copy historical text into a new draft rather than
restoring a version to bypass review.

Use the authenticated Preview action to view a saved draft at
`/legal/preview/<id>`. Admin or staff Legal pages View/Modify access is required; previews are noindex,
private/no-store and no-referrer. The normal public URL always reads approved
content, including for signed-in editors and `?preview=true` requests.

SEO on the legal document owns its page title and description. Empty SEO fields
use the document title and a short page-purpose description, never draft text.
Blog/job detail SEO remains on those documents. Static public routes and the Blog
and Careers listings use Page SEO; homepage content editing remains excluded.
Metadata is rendered by the server from the last approved publication. Search
engines can choose different text in results.

The recruitment notice and its retention approval are configured separately in
Recruitment Settings. A published general privacy policy does not automatically
enable applications or replace the exact recruitment notice acknowledged by a
candidate. Both company-approved legal copy and recruitment policy are launch
dependencies. The request-time sitemap includes only approved legal documents;
withdrawal removes them without rebuilding. Production launch-wide SEO checks
remain in the [T12 checklist](../.planning/t12-checklist.md).

Staff need the corresponding section permission to view drafts or modify records.
Admins assign access per section; publication remains admin-only. See
[staff permissions](staff-permissions.md).
