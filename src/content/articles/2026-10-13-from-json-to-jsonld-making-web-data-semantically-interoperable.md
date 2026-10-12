---
title: "From JSON to JSON-LD: Making Web Data Semantically Interoperable"
date: 2026-10-13T09:00:00+07:00
summary: "Learn how ordinary JSON becomes Linked Data through context, identifiers, and shared vocabularies—with practical examples in Python and RDFLib."
category: "Semantic Web"
image: "/assets/img/articles/from-json-to-jsonld.jpg"
tags:
  - "Semantic Web"
  - "JSON-LD"
  - "RDF"
  - "Linked Data"
  - "Knowledge Graphs"
  - "Python"
  - "RDFLib"
  - "Data Interoperability"
featured: true
featuredOrder: 1
series:
  name: "Semantic Web & Knowledge Graphs"
  part: 4
draft: false
---

JSON is ubiquitous across modern software engineering. Web APIs return JSON payloads, microservices exchange JSON messages, and distributed data pipelines rely on JSON objects to transfer state between disparate systems.

Developers favor JSON because its syntax is lightweight, human-readable, and supported out-of-the-box by nearly every programming language. You parse an object, access its fields via dot notation, and consume its values without cognitive friction.

Yet underneath this syntactic simplicity lies a fundamental architectural challenge: **When two independent applications exchange JSON, do they actually understand the data in the same way?**

Consider a digital library catalog recording information about a book:

```json
{
  "id": "book-1",
  "title": "Understanding Knowledge Graphs",
  "author": "Alya Pratama",
  "publisher": "Example Press",
  "publicationDate": "2024-04-12"
}
```

Now imagine another partner repository exposing the same entity with slightly different field names:

```json
{
  "record_id": "BK-104",
  "book_name": "Understanding Knowledge Graphs",
  "creator": "Alya Pratama",
  "publisher_name": "Example Press",
  "year": 2024
}
```

Both JSON documents describe the exact same real-world concept. A human engineer reading both payloads immediately recognizes the correlation.

However, an automated ingestion system cannot infer this equivalence without custom, brittle translation code. The machine does not know whether `title` and `book_name` signify identical concepts, whether `author` and `creator` carry equivalent semantic meaning, or whether `publicationDate` and `year` represent compatible temporal granularities.

JSON itself provides no native mechanism to associate local field keys with universal, unambiguous definitions. While JSON Schema and OpenAPI contracts provide validation constraints, they remain siloed within individual APIs rather than linking to global conceptual frameworks.

This is where **JSON-LD** (*JavaScript Object Notation for Linked Data*) becomes indispensable.

JSON-LD extends standard JSON with standardized conventions for declaring global identifiers, expressing relationships, and binding local field keys to shared vocabularies. It transforms familiar JSON into first-class **Linked Data** and **RDF Graphs**.

In this guide, we will examine how ordinary JSON transforms into JSON-LD step-by-step. We will dissect its core keywords (`@context`, `@id`, `@type`, and `@graph`), parse JSON-LD into an in-memory RDF graph using Python and RDFLib, execute SPARQL queries against it, and serialize the resulting triples back into Turtle.

---

## 1. JSON vs. JSON-LD: What Is the Difference?

Before diving into syntax, let us clarify the conceptual boundary.

Standard **JSON** is purely a **syntactic serialization format**. It models data using objects, arrays, key-value pairs, strings, numbers, booleans, and null values.

```json
{
  "title": "Understanding Knowledge Graphs",
  "author": "Alya Pratama"
}
```

A JSON parser inspects this string and produces an in-memory dictionary. However, the parser has no knowledge that `author` denotes a biological creator, nor does it recognize whether `"Alya Pratama"` is a persistent human entity or just an arbitrary character sequence.

**JSON-LD** bridges this semantic gap by defining formal mapping rules between JSON keys and globally dereferenceable concepts. Formalized as a [W3C Recommendation (JSON-LD 1.1)](https://www.w3.org/TR/json-ld11/), JSON-LD provides a pragmatic on-ramp to Linked Data for Web APIs without discarding familiar JSON syntax.

<figure class="my-8">
  <img src="/assets/img/articles/json-to-jsonld-semantic-bridge.svg" alt="Diagram showing the transition from ordinary JSON to Linked Data via the @context bridge" class="w-full rounded-xl" />
  <figcaption class="mt-3 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
    How ordinary JSON transforms into Linked Data: The @context mapping layer binds arbitrary local field keys to globally unique IRIs, promoting string values into typed graph nodes and edges.
  </figcaption>
</figure>

### 1.1. Comparing the Two Representations

**Ordinary JSON:**

```json
{
  "title": "Understanding Knowledge Graphs",
  "author": "Alya Pratama"
}
```

**JSON-LD:**

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "title": "schema:name",
    "author": {
      "@id": "schema:author",
      "@type": "@id"
    }
  },
  "@id": "https://example.org/book1",
  "@type": "schema:Book",
  "title": "Understanding Knowledge Graphs",
  "author": "https://example.org/person1"
}
```

Notice that the second document remains **100% valid JSON**. Any legacy JSON library can parse it without errors. However, a semantic processor now understands:
* **`@context`**: The formal dictionary mapping local terms to unambiguous IRIs.
* **`@id`**: The persistent global IRI identifying this book entity (`https://example.org/book1`).
* **`@type`**: The ontological class of this entity (`schema:Book`).
* **`title`**: Maps directly to `<https://schema.org/name>`.
* **`author`**: Maps to `<https://schema.org/author>`, where `@type: "@id"` explicitly instructs processors to treat the value as an **entity node reference** rather than a flat string.

Formally, given a JSON document $J$ with key set $\mathcal{K}$ and values $\mathcal{V}$, the context $\mathcal{C}$ defines a mapping function:

$$
\mathcal{C}: \mathcal{K} \to \mathcal{I} \cup (\mathcal{I} \times \mathcal{M})
$$

where $\mathcal{I}$ is the universe of Internationalized Resource Identifiers (IRIs) and $\mathcal{M}$ represents semantic coercion metadata (such as `@type: "@id"` or language tags). The processor then expands the document into an RDF graph $\mathcal{G} \subset \mathcal{I} \times \mathcal{I} \times (\mathcal{I} \cup \mathcal{L})$:

$$
\operatorname{expand}(J, \mathcal{C}) \implies \mathcal{G}
$$

---

## 2. Conceptual Model: Entities as Connected Nodes

In our domain model, we want to represent three distinct resources:
1. **A Book**: `ex:book1`
2. **An Author**: `ex:person1`
3. **A Publisher**: `ex:publisher1`

Rather than embedding the author and publisher as ephemeral strings inside the book record, we treat them as independent nodes in a knowledge graph:

<figure class="my-8">
  <img src="/assets/img/articles/jsonld-resource-nodes-model.svg" alt="Resource Nodes and Directed Relationships Diagram: Book, Author, and Publisher" class="w-full rounded-xl" />
  <figcaption class="mt-3 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
    Entities represented as independent resource nodes with explicit identifiers (@id) connected by directed semantic predicates.
  </figcaption>
</figure>

This structural separation is vital: an external research catalog can reference `ex:person1` to list scholarly articles without duplicating personal metadata.

---

## 3. Demystifying `@context`: The Engine of JSON-LD

If you remember only one keyword from JSON-LD, remember **`@context`**.

The context defines the mapping rules that translate application-specific JSON properties into global IRIs.

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "title": "schema:name",
    "author": "schema:author"
  }
}
```

This snippet declares three core mappings:
1. `"schema": "https://schema.org/"`: Defines a namespace prefix.
2. `"title": "schema:name"`: Maps `title` to `<https://schema.org/name>`.
3. `"author": "schema:author"`: Maps `author` to `<https://schema.org/author>`.

### 3.1. Why Use IRIs Instead of Property Names?

Suppose Company A and Company B both define an API returning a `status` field:
* In Company A’s pipeline, `status` indicates whether an invoice was approved.
* In Company B’s pipeline, `status` indicates warehouse stock availability.

By binding `status` to distinct IRIs:
* `https://company-a.com/vocab/invoiceStatus`
* `https://company-b.com/vocab/inventoryStatus`

Any data integration engine can ingest both payloads into a unified data lake without collision or semantic ambiguity.

### 3.2. Why Schema.org?

[Schema.org](https://schema.org/) is a collaborative, community-driven vocabulary used by millions of websites and search engines (including Google, Microsoft, and Yahoo) to describe real-world entities:

| Term | Category | Semantic Purpose |
| :--- | :--- | :--- |
| **`schema:Book`** | Class | Identifies a published written creative work. |
| **`schema:Person`** | Class | Identifies an individual human being. |
| **`schema:Organization`** | Class | Identifies a formal institution, corporation, or publisher. |
| **`schema:name`** | Property | Denotes the human-readable primary name or title. |
| **`schema:author`** | Property | Relates a creative work to its authoring creator. |
| **`schema:publisher`** | Property | Relates a publication to its releasing organization. |
| **`schema:datePublished`** | Property | Records the official publication date. |

---

## 4. Understanding `@id`: Assigning Global Identity

The `@id` keyword provides an explicit, persistent identifier for a resource node.

```json
{
  "@id": "https://example.org/book1",
  "@type": "schema:Book",
  "title": "Understanding Knowledge Graphs"
}
```

Titles are inherently non-unique: multiple books can share the title *"Data Structures"*, and titles may change across localized translations. An `@id` anchors the resource as a distinct mathematical entity:

$$
\text{Identifier} \neq \text{Name}
$$

* **Identifier**: `https://example.org/person1` (The entity node)
* **Name**: `"Alya Pratama"` (A literal attribute describing that node)

While HTTP IRIs do not strictly have to resolve to live Web pages, adhering to W3C Linked Data principles by making them dereferenceable enables applications to fetch additional entity metadata via HTTP GET.

---

## 5. Understanding `@type`: Explicit Classification

The `@type` keyword classifies a resource under an ontological concept:

```json
{
  "@id": "https://example.org/book1",
  "@type": "schema:Book"
}
```

In the RDF triple model, `@type` maps directly to the standard predicate `rdf:type` (`http://www.w3.org/1999/02/22-rdf-syntax-ns#type`):

$$
(\langle\text{https://example.org/book1}\rangle, \operatorname{rdf:type}, \langle\text{https://schema.org/Book}\rangle)
$$

Do not confuse `@type` with an arbitrary JSON property named `"type"`. In ordinary JSON, `"type": "Book"` is merely a string. In JSON-LD, `@type` is a semantic instruction recognized by standard reasoners and triple stores.

---

## 6. A First Complete JSON-LD Document

Let us synthesize these concepts into a standalone document named `book.jsonld`:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "title": "schema:name",
    "author": {
      "@id": "schema:author",
      "@type": "@id"
    }
  },
  "@id": "https://example.org/book1",
  "@type": "schema:Book",
  "title": "Understanding Knowledge Graphs",
  "author": "https://example.org/person1"
}
```

<figure class="my-8">
  <img src="/assets/img/articles/jsonld-context-expansion-process.svg" alt="JSON-LD Expansion and RDF Triple Generation Diagram" class="w-full rounded-xl" />
  <figcaption class="mt-3 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
    How the JSON-LD processor resolves compact keys through @context rules into explicit, unambiguous semantic triples.
  </figcaption>
</figure>

### The Magic of `@type: "@id"`

Pay close attention to the definition of `author`:

```json
"author": {
  "@id": "schema:author",
  "@type": "@id"
}
```

The directive `@type: "@id"` instructs the JSON-LD parser:
> *"When you encounter the value of `author`, do not treat it as a string literal. Treat it as the IRI identifier of another resource node."*

Consequently, the parser generates a **directed relationship between two resources**:

$$
\langle\text{https://example.org/book1}\rangle \xrightarrow{\text{schema:author}} \langle\text{https://example.org/person1}\rangle
$$

Without `@type: "@id"`, the value would be parsed as an ordinary text literal:

$$
\langle\text{https://example.org/book1}\rangle \xrightarrow{\text{schema:author}} \text{"https://example.org/person1"}
$$

---

## 7. A Multi-Entity Catalog Using `@graph`

In realistic applications, an API payload describes multiple interconnected resources in a single response. We use the `@graph` keyword to encapsulate multiple top-level entity nodes.

Create a file named `books.jsonld`:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "title": {
      "@id": "schema:name",
      "@language": "en"
    },
    "name": "schema:name",
    "author": {
      "@id": "schema:author",
      "@type": "@id"
    },
    "publisher": {
      "@id": "schema:publisher",
      "@type": "@id"
    },
    "datePublished": {
      "@id": "schema:datePublished",
      "@type": "http://www.w3.org/2001/XMLSchema#date"
    },
    "keywords": "schema:keywords",
    "givenName": "schema:givenName",
    "familyName": "schema:familyName"
  },
  "@graph": [
    {
      "@id": "https://example.org/book1",
      "@type": "schema:Book",
      "title": "Understanding Knowledge Graphs",
      "author": "https://example.org/person1",
      "publisher": "https://example.org/publisher1",
      "datePublished": "2024-04-12",
      "keywords": [
        "RDF",
        "JSON-LD",
        "Knowledge Graphs"
      ]
    },
    {
      "@id": "https://example.org/person1",
      "@type": "schema:Person",
      "name": "Alya Pratama",
      "givenName": "Alya",
      "familyName": "Pratama"
    },
    {
      "@id": "https://example.org/publisher1",
      "@type": "schema:Organization",
      "name": "Example Press"
    }
  ]
}
```

### Architectural Highlights of this Structure:

1. **Language Tagging**: `"title": { "@id": "schema:name", "@language": "en" }` automatically attaches the `@en` language tag to book titles.
2. **Type Coercion**: `"datePublished": { "@id": "schema:datePublished", "@type": "http://www.w3.org/2001/XMLSchema#date" }` parses ISO strings into typed `xsd:date` literals.
3. **Graph Arrays**: The array in `"keywords": ["RDF", "JSON-LD", "Knowledge Graphs"]` produces three independent triples sharing the subject and predicate:

$$
\forall k \in \{\text{"RDF"}, \text{"JSON-LD"}, \text{"Knowledge Graphs"}\}, \quad (s, \text{schema:keywords}, k) \in \mathcal{G}
$$

---

## 8. Converting JSON-LD into RDF with Python & RDFLib

Now, let us parse this document into an in-memory RDF knowledge graph, traverse it, and serialize it back to Turtle.

### Step 1: Initialize Project with `uv`

```bash
uv init --bare --python 3.12 jsonld-tutorial
cd jsonld-tutorial
uv add rdflib
```

### Step 2: Implement `main.py`

Create `main.py` with the following code:

```python
from pathlib import Path
from rdflib import Graph, Namespace

BASE_DIR = Path(__file__).resolve().parent
JSONLD_FILE = BASE_DIR / "books.jsonld"

SCHEMA = Namespace("https://schema.org/")
EX = Namespace("https://example.org/")


def main() -> None:
    graph = Graph()

    # 1. Parse JSON-LD into an RDF Graph
    graph.parse(str(JSONLD_FILE), format="json-ld")
    print(f"Triples loaded: {len(graph)}")

    # 2. Traverse Graph via Python API
    book = EX.book1
    title = next(graph.objects(book, SCHEMA.name), None)
    author = next(graph.objects(book, SCHEMA.author), None)
    publisher = next(graph.objects(book, SCHEMA.publisher), None)

    author_name = (
        next(graph.objects(author, SCHEMA.name), None)
        if author is not None
        else None
    )
    publisher_name = (
        next(graph.objects(publisher, SCHEMA.name), None)
        if publisher is not None
        else None
    )

    print("\nBook Information:")
    print("-----------------")
    print(f"Title     : {title}")
    print(f"Author    : {author_name} (IRI: {author})")
    print(f"Publisher : {publisher_name} (IRI: {publisher})")

    # 3. Serialize Graph to Turtle
    output_file = BASE_DIR / "books-output.ttl"
    graph.serialize(destination=str(output_file), format="turtle")
    print(f"\nGraph serialized to: {output_file.name}")


if __name__ == "__main__":
    main()
```

### Step 3: Run the Script

```bash
uv run main.py
```

**Expected Output:**

```text
Triples loaded: 14

Book Information:
-----------------
Title     : Understanding Knowledge Graphs
Author    : Alya Pratama (IRI: https://example.org/person1)
Publisher : Example Press (IRI: https://example.org/publisher1)

Graph serialized to: books-output.ttl
```

RDFLib successfully parsed the 14 triples from the JSON-LD document. The author and publisher were accurately instantiated as connected node entities.

---

## 9. Querying JSON-LD Data with SPARQL

Because JSON-LD maps directly to the RDF data model, we can execute standardized SPARQL queries against it without modification.

Append the following query execution to `main.py`:

```python
sparql_query = """
PREFIX schema: <https://schema.org/>

SELECT ?title ?authorName ?publisherName
WHERE {
  <https://example.org/book1> schema:name ?title ;
                              schema:author ?author ;
                              schema:publisher ?publisher .
  ?author schema:name ?authorName .
  ?publisher schema:name ?publisherName .
}
"""

print("\nSPARQL Query Results:")
print("---------------------")
for row in graph.query(sparql_query):
    print(f"Title     : {row.title}")
    print(f"Author    : {row.authorName}")
    print(f"Publisher : {row.publisherName}")
```

Run again:

```bash
uv run main.py
```

Output:

```text
SPARQL Query Results:
---------------------
Title     : Understanding Knowledge Graphs
Author    : Alya Pratama
Publisher : Example Press
```

Notice that the query logic is **serialization-agnostic**. The query engine does not care whether the data originated from Turtle, N-Triples, or JSON-LD.

---

## 10. Serializing to Turtle: Verifying Triples

Inspect the generated `books-output.ttl` file:

```turtle
@prefix ex: <https://example.org/> .
@prefix schema: <https://schema.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:book1 a schema:Book ;
    schema:name "Understanding Knowledge Graphs"@en ;
    schema:author ex:person1 ;
    schema:publisher ex:publisher1 ;
    schema:datePublished "2024-04-12"^^xsd:date ;
    schema:keywords "JSON-LD",
        "Knowledge Graphs",
        "RDF" .

ex:person1 a schema:Person ;
    schema:name "Alya Pratama" ;
    schema:familyName "Pratama" ;
    schema:givenName "Alya" .

ex:publisher1 a schema:Organization ;
    schema:name "Example Press" .
```

Both representations encode the **identical mathematical graph**. Developers can exchange JSON-LD over HTTP while semantic engines process Turtle and SPARQL downstream.

---

## 11. Advanced JSON-LD: Shared Remote Contexts & `@vocab`

### 11.1. Referencing Remote Contexts

In enterprise production architectures, inline `@context` declarations can add unnecessary payload bloat. JSON-LD allows referencing an external, versioned context document via URL:

```json
{
  "@context": "https://example.org/contexts/books-v1.jsonld",
  "@id": "https://example.org/book1",
  "@type": "schema:Book",
  "title": "Understanding Knowledge Graphs"
}
```

> [!WARNING]
> Remote contexts introduce runtime network dependencies and potential SSRF security vulnerabilities if untrusted documents are parsed. In secure environments, always configure your parser with a local cache or schema catalog.

### 11.2. Default Vocabulary with `@vocab`

If your document primarily uses terms from a single ontology, you can set `@vocab`:

```json
{
  "@context": {
    "@vocab": "https://schema.org/"
  },
  "@id": "https://example.org/book1",
  "@type": "Book",
  "name": "Understanding Knowledge Graphs"
}
```

Every unmapped key automatically expands with the prefix `<https://schema.org/>`. However, exercise caution: unexpected keys will also be coerced into that namespace.

---

## 12. Common JSON-LD Pitfalls

| Mistake | Manifestation | Correction |
| :--- | :--- | :--- |
| **Omitting `@type: "@id"`** | A resource IRI string is parsed as a flat text literal rather than a directed relationship edge. | Explicitly configure `"prop": { "@id": "vocab:prop", "@type": "@id" }` in `@context`. |
| **Confusing `@type` with `"type"`** | Custom JSON key `"type"` remains uninterpreted without semantic meaning. | Use keyword `@type` to declare formal ontological class membership. |
| **Assuming Array Order in RDF** | Arrays `["A", "B"]` generate independent unordered triples. | Use `@list` explicitly if sequence indexing is semantically meaningful. |
| **Using Local Colliding IDs** | `"@id": "1"` leads to merge collisions when combining datasets. | Always use globally unique, domain-scoped URIs (e.g. `https://my-app.com/books/1`). |

---

## 13. When Should You Adopt JSON-LD?

* **Use Standard JSON** when services reside entirely within a single team's boundary, have fixed schemas, and require maximum raw serialization speed.
* **Adopt JSON-LD** when:
  * Exposing public REST APIs that participate in the broader Web of Data.
  * Feeding enterprise Knowledge Graphs from disparate internal microservices.
  * Embedding Rich Snippets in HTML via `<script type="application/ld+json">` for Google and Bing indexing.
  * Building RAG (Retrieval-Augmented Generation) knowledge pipelines for AI agents.

---

## Conclusion & Next Steps

JSON-LD delivers the best of both worlds: the universal developer ergonomics of JSON combined with the structural power of the Semantic Web and Knowledge Graphs.

By introducing a standardized `@context`, global `@id` identifiers, and ontological `@type` classifications, you transform static data payloads into an interoperable, globally queryable graph.

---

## References & Further Reading

* [W3C — JSON-LD 1.1 Specification](https://www.w3.org/TR/json-ld11/)
* [JSON-LD Playground — Interactive Validator](https://www.json-ld.org/playground/)
* [Schema.org — Official Community Vocabulary](https://schema.org/)
* [RDFLib — Official Python Documentation](https://rdflib.readthedocs.io/en/stable/)
* [W3C — RDF 1.1 Concepts and Abstract Syntax](https://www.w3.org/TR/rdf11-concepts/)
