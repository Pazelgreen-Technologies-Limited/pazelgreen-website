# T12 launch decisions and acceptance checklist

Status: deferred by the user on 2026-11-19; company answers and production verification remain pending. This document is the
answer sheet for T12, not permission to publish unapproved content or purchase
services. Answer the numbered items in chat or fill the Answer cells. `Pending`
is acceptable; empty blog/careers is an explicit option. Never include passwords,
tokens, database URLs, recipient lists or applicant information here. Configure
private recipients/accounts in the CMS and credentials in deployment secrets.

## Answers needed from the company

| ID | Question | Answer |
| --- | --- | --- |
| 1 | What public domain should the live website use? Is there existing hosting/domain access we should use, and through which provider? Give provider names only. | Pending |
| 2 | Do you have production hosting, PostgreSQL, SMTP and persistent file storage already? Name available services, or ask for researched options and give a monthly budget/currency. Current code needs a Node server and persistent public/private mounts; ephemeral hosting needs an additional adapter. | Pending |
| 3 | What are the verified public company email, phone, address, department contacts, working hours/closed days, timezone and social links? Explicitly mark optional items to omit. | Pending |
| 4 | Supply the complete department and position code lists as code → name. Confirm employment types Direct=D, Contract=C, Internship=I, or specify corrections before launch adverts are issued. TE/DH remain examples until confirmed. | Pending |
| 5 | Should the blog launch empty or with supplied approved articles? For each article provide title, body, excerpt, author, category, image/alt text and confirmation of usage rights. | Pending |
| 6 | Should careers launch empty or with actual vacancies? For each vacancy provide title, department/position/employment codes, location/arrangement, summary, responsibilities, requirements, optional pay and deadline/timezone. | Pending |
| 7 | Supply approved privacy policy and terms, titles/effective dates, and approver sign-off; or request draft documents for company/legal review. Drafts cannot be treated as approved policy. | Pending |
| 8 | Will applications be enabled at launch? If yes, supply approved recruitment notice/version, retention duration in days, and deletion/legal-hold/backup-expiry procedure. If no, confirm recruitment stays disabled. | Pending |
| 9 | Confirm private recruitment recipients will be entered in Recruitment Delivery and the production sending domain/address will be verified. Provide only configuration status here; enter recipient addresses privately in the CMS. | Pending |
| 10 | Who owns content approval, user administration and technical operations (roles/team names suffice)? Who handles delivery alerts, backups, recovery and retention reviews? | Pending |
| 11 | What maximum data loss and outage are acceptable? Specify backup frequency/retention and recovery objectives, or request a proposed policy for approval. Confirm alignment with recruitment retention/legal holds. | Pending |
| 12 | For unbuilt marketing links, should we hide them for launch or map each to an existing page? Routes: /team, /pagex, /market-intelligence, /supply-chain, /quality-control, /analytics, /get-started, /demo, /join-us/signup, /join-us/volunteer, /join-us/partnerships. New pages remain outside scope. | Pending |
| 13 | Are any site-wide announcements needed at launch? Supply approved message, optional link, priority and start/end dates with timezone, or say none. Confirm optional static-page search titles/descriptions or accept current defaults. | Pending |
| 14 | Confirm the release approver and target launch window. Contact-form delivery/newsletters remain outside scope; confirm how their existing UI should be presented at launch if they remain inactive. | Pending |

## Work to complete after answers

Check only after evidence exists. Company answers alone do not pass deployment tests.

- [ ] Record scope decisions in task.md/progress.md; keep new feature requests separate.
- [ ] Provision the approved production services and protected staging environment;
  configure HTTPS, supported runtime, database TLS, stable secrets and persistent
  separate public/private storage. No credentials committed.
- [ ] Configure initial admin securely if needed; preserve existing accounts;
  verify initial password change, invitation/reset delivery and access removal.
- [ ] Enter verified company settings, final dictionaries and supplied launch content
  through review; approve legal documents and static/document SEO. Check public pages
  from a signed-out browser and ensure no fallback/example data is mistaken for approval.
- [ ] Resolve navigation decisions and verify resulting links on mobile/desktop;
  keep unbuilt routes out of the sitemap and record remaining exclusions.
- [ ] If recruitment launches, publish approved notice/version/retention, configure
  private recipients, verify sending domain, ingress limits and minute scheduler.
  If postponed, verify forms stay disabled and record the deferred acceptance work.
- [ ] Apply/rehearse release migrations, production storage permissions and persistence
  across restart/redeploy; preserve counters and reference immutability.
- [ ] Verify real HTTPS anonymous/staff/admin permissions, approved-versus-draft reads,
  protected previews, private CV download denial, metadata, robots and sitemap origin.
- [ ] With artificial test data only, verify durable application/reference creation,
  safe retry, real candidate/staff delivery, SMTP failure/recovery and schedule/deadline
  behavior. Remove acceptance data under the agreed procedure; never reset counters.
- [ ] Configure monitoring and demonstrate alerts for worker/service failures and
  backlog; confirm assigned responders and escalation channels.
- [ ] Verify encrypted off-host database/files backups and isolated restore rehearsal;
  record recovery point/time and checks in restricted evidence, without personal data.
- [ ] Train the assigned editors/admins with the operations/topic guides; confirm
  review workflow, account deactivation and retention/legal-hold handling.
- [ ] Run final release checks, record actual evidence, obtain company launch sign-off,
  then mark T12 complete in task.md and progress.md. Deployment alone is not approval.

Use [CMS operations](../docs/cms-operations.md) for the technical acceptance procedures.
Infrastructure may require account access or paid provisioning approval. Such steps
will be made concrete for review when the provider choices are known.
