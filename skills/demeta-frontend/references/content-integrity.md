# Content integrity and claim ledger

Design polish must never manufacture trust.

## Claim ledger

Record every factual or proof-bearing statement with:

```json
{
  "id": "claim-response-time",
  "text": "Callbacks within one business day",
  "status": "verified | user_supplied | placeholder",
  "source": "path, URL, or user brief reference",
  "sourceType": "authoritative-url | first-party-document | first-party-data | user-brief",
  "scope": "where the claim appears",
  "notes": "expiry, jurisdiction, or qualification"
}
```

Statuses:

- `verified`: supported by a current authoritative source inspected in this task; both `source` and `sourceType` are required.
- `user_supplied`: explicitly supplied/approved by the user; do not silently strengthen it.
- `placeholder`: proposed copy awaiting evidence or approval. Render it visibly as placeholder in drafts.

Never invent:

- customer or partner logos;
- testimonials, names, portraits, ratings, awards, or press quotes;
- certifications, memberships, credentials, compliance, or legal status;
- revenue, customer counts, success rates, time saved, response times, outcomes, or comparisons;
- prices, availability, locations, guarantees, refunds, delivery windows, or product capabilities;
- medical, legal, financial, environmental, safety, or performance claims.

Production/verified output fails if any proof-bearing claim remains `placeholder`.

## Copy rules

- Use exact action language: `Book a condition survey`, not `Get started`.
- Keep terms consistent across headline, buttons, form, toast, and confirmation.
- Separate evocative art direction from factual statements.
- Label fictional showcase data and invented organizations clearly.
- Do not use generated faces as implied customers, staff, patients, experts, or endorsers.
- Avoid fake UI data that resembles live or verified evidence; mark demonstration data.
- For regulated subjects, prefer supplied/authoritative wording and retain necessary qualifiers.

## Missing facts

Infer art direction, hierarchy, and medium. Do not infer operational facts. When a required fact is absent:

1. use a conspicuous placeholder in a draft;
2. record it in the claim ledger;
3. keep it out of a production/verified claim;
4. ask only when the missing fact blocks a meaningful decision or release.
