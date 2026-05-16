
## 6. Add a freshness / recency rule for temporally sensitive queries

### Why

7.md says:

* generic queries should not automatically require the newest result,
* but recency can matter within the rating when the user is likelier to want newer information,
* more explicit temporal wording would matter more.  

Your concept guide already recognizes **temporal positioning** like vintage vs modern, but it does not seem to explicitly articulate **freshness / recency** as a query-sensitivity dimension. 

### Suggested addition

Under **Requirement-weight heuristics** or **Query Meaning**:

> **Freshness / recency / currentness.**
> Treat recency as rating-relevant when the query explicitly asks for the latest, newest, current, this-year, or otherwise time-sensitive version of a product or product information.
>
> For generic queries with no temporal signal, do not assume only the most recent version can satisfy the user; however, a clearly outdated result may still lower confidence or position within a band when currentness is reasonably implied by the product context.

### Benefit

Useful for:

* `latest iPhone`,
* `2026 planner`,
* `current Kindle model`,
* `newest AirPods`,
* `best gaming laptop 2026`,
* or any temporally sensitive info/product query.
