---
title: "From a Python Script to a Real Project: A Practical Workflow with uv"
date: 2026-10-11T21:28:00+07:00
summary: "Learn how to transform a scrappy Python script into a structured, maintainable, and testable CLI application using uv. We build Text Inspector from the ground up with modular code, CLI entry points, and automated pytest suites."
category: "Software Engineering"
image: "/assets/img/articles/python-project-workflow.jpg"
tags:
  - "Python"
  - "uv"
  - "Software Engineering"
  - "Python Development"
  - "Test Automation"
draft: false
---

Writing a Python script is effortless. You open a text editor, write a few lines of code, run `python main.py`, and watch the console print your output. For quick calculations, data exploration, or single-file automations, this simplicity is Python's greatest asset.

However, real-world software rarely stays small. As requirements expand, that innocent script begins accumulating new responsibilities: validating file formats, parsing command-line flags, pulling in third-party libraries, and handling edge cases. Before long, you find yourself staring at an unruly 500-line monolith where business calculations are tangled with file I/O and terminal printing. When something breaks, there are no automated tests to catch it—and passing the script to a colleague often ends with the dreaded *"it works on my machine"* response.

Transitioning from an ad-hoc script to a maintainable software project does not require heavy enterprise frameworks. Instead, it requires four foundational habits: **separating concerns**, **structuring packages cleanly**, **managing isolated dependencies**, and **writing automated tests**.

In this hands-on guide, we will build a complete command-line utility called **Text Inspector** using Python and [uv](https://docs.astral.sh/uv/). Text Inspector will ingest a document and report statistical metrics: character counts, total words, distinct vocabulary size, sentence counts, and frequency distributions. 

Along the way, we will cover:
- Scaffolding a standalone application package with `uv init --app`.
- Adopting the clean `src` layout.
- Decoupling computational logic from presentation layers.
- Declaring executable entry points in `pyproject.toml`.
- Managing development-only tools like `pytest` with `uv add --dev`.
- Verifying code behavior through unit tests.
- Packing and reproducing the application cleanly across machines.

---

## 1. What Makes a Script Different from a Project?

To write maintainable code, it helps to understand what fundamentally separates a single-file script from a well-structured project.

In a traditional script (`main.py`), all concerns live in the same scope:

```text
main.py
  ├── Reads command-line arguments
  ├── Opens and validates files on disk
  ├── Parses text strings and computes metrics
  ├── Formats and prints terminal tables
  └── Catches unexpected runtime crashes
```

When all these responsibilities are coupled together, testing a single calculation requires running the entire script against a live file on disk. Furthermore, importing that calculation into another script is virtually impossible without executing the whole file.

A structured application separates these distinct responsibilities into isolated modules:

```text
text-inspector/
├── src/
│   └── text_inspector/
│       ├── __init__.py        # Package marker & metadata
│       ├── analysis.py        # Pure computation engine (no I/O, no CLI)
│       └── cli.py             # User interface, argument parsing & console I/O
├── tests/
│   └── test_analysis.py       # Automated unit tests
├── pyproject.toml             # Project manifest & entry point definitions
├── uv.lock                    # Cryptographically pinned dependencies
└── README.md                  # Operational documentation
```

### Why the `src` Layout?

Notice that our application code is placed inside `src/text_inspector/` rather than loose files in the project root. 

This convention—known in the Python packaging community as the **`src` layout**—prevents accidental imports. When your modules sit directly in the root directory, running Python inside that folder can trick the interpreter into importing local source files rather than installed package distributions. The `src` layout guarantees that tests run against the true packaged application, mirroring production behavior.

---

## 2. Initializing the Application with uv

Rather than manually stitching folders together, let's use `uv` to scaffold an application project.

### Step 1: Verify uv is Ready
Open your terminal (PowerShell, zsh, or bash) and check your installed version:

```bash
uv --version
```

### Step 2: Initialize an Application Package
Run:

```bash
uv init --app text-inspector
cd text-inspector
```

The `--app` flag tells uv that we are building an end-user application (with an executable entry point) rather than a reusable open-source library. uv scaffolds the project with a Git repository, standard `.gitignore`, and configuration files:

```text
text-inspector/
├── .git/
├── .gitignore
├── .python-version
├── pyproject.toml
├── README.md
└── src/
    └── text_inspector/
        └── __init__.py
```

### Step 3: Add Development Dependencies
Our core text analysis utility will use Python's rich standard library (`re`, `collections`, `pathlib`, `argparse`). However, during development, we want an automated test runner. 

Add **pytest** as a development dependency:

```bash
uv add --dev pytest
```

Notice the `--dev` flag. This separates development tooling from runtime requirements in `pyproject.toml`:

```toml
[dependency-groups]
dev = [
    "pytest>=8.3.0",
]
```

When users or servers install the application in production, they won't download test runners they don't need.

---

## 3. Project Architecture & File Plan

Here is our target directory layout:

```text
text-inspector/
├── src/
│   └── text_inspector/
│       ├── __init__.py
│       ├── analysis.py       # Pure domain logic
│       └── cli.py            # User interface & terminal orchestration
├── tests/
│   └── test_analysis.py      # pytest test suite
├── sample.txt                # Sample input file
├── pyproject.toml
├── uv.lock
└── README.md
```

Let's implement each component in logical sequence.

---

## 4. Building the Core Logic: `analysis.py`

One of the most important architectural rules in software engineering is: **keep your core calculations independent of user interfaces**.

Our text analysis engine should not know—or care—whether text was typed into a terminal, read from a file, sent via an HTTP POST request, or supplied by a unit test. It accepts a raw string and returns computed metrics.

Inside `src/text_inspector/`, create `analysis.py`:

```python
import re
from collections import Counter
from typing import TypedDict


class TextStats(TypedDict):
    characters: int
    words: int
    unique_words: int
    sentences: int
    most_common: list[tuple[str, int]]


WORD_PATTERN = re.compile(r"\b[\w'-]+\b", flags=re.UNICODE)


def analyze_text(text: str) -> TextStats:
    """Calculate core statistical metrics for a supplied text string."""
    words = WORD_PATTERN.findall(text.lower())
    sentence_parts = [
        part for part in re.split(r"[.!?]+", text) if part.strip()
    ]

    return {
        "characters": len(text),
        "words": len(words),
        "unique_words": len(set(words)),
        "sentences": len(sentence_parts),
        "most_common": Counter(words).most_common(5),
    }
```

### Breaking Down the Implementation:

1. **`TypedDict`:** Providing `TextStats` gives full type-hinting support to downstream callers without the overhead of heavy object models.
2. **`WORD_PATTERN`:** The compiled regular expression `\b[\w'-]+\b` extracts word tokens, gracefully handling contractions (e.g., `don't`) and hyphenated terms (e.g., `real-world`), with `re.UNICODE` support.
3. **Case Normalization (`text.lower()`):** Guarantees that `"Python"` and `"python"` are recognized as the same word.
4. **Distinct Vocabulary (`set(words)`):** Converting the word list to a Python set automatically removes duplicates, giving us the unique vocabulary size.
5. **Sentence Boundary Splitting:** Uses regex character classes `[.!?]+` to slice text into sentences while filtering out empty whitespace fragments.
6. **Frequency Distribution (`Counter`):** `collections.Counter(words).most_common(5)` calculates frequency counts in $O(N)$ time and returns the top 5 occurrences.

Notice that this module contains **zero `print()` statements** and **zero filesystem access**. It is 100% deterministic, testable, and reusable.

---

## 5. Building the Interface: `cli.py`

Now that our computation engine is complete, we can build the user-facing CLI module.

Inside `src/text_inspector/`, create `cli.py`:

```python
import argparse
from pathlib import Path

from .analysis import analyze_text


def build_parser() -> argparse.ArgumentParser:
    """Configure command-line flags and positional arguments."""
    parser = argparse.ArgumentParser(
        prog="text-inspector",
        description="Analyze a text file and report key statistical metrics.",
    )
    parser.add_argument(
        "file",
        type=Path,
        help="Path to the target text file to inspect.",
    )
    return parser


def main() -> None:
    """Entry point for the command-line application."""
    parser = build_parser()
    args = parser.parse_args()

    target_file: Path = args.file

    if not target_file.is_file():
        parser.error(f"Target path is not a valid file: {target_file}")

    try:
        text = target_file.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        parser.error(f"Failed to read file '{target_file}': {exc}")

    stats = analyze_text(text)

    # Formatted Console Presentation
    print("\nText Analysis Report")
    print("=" * 32)
    print(f"Characters   : {stats['characters']}")
    print(f"Words        : {stats['words']}")
    print(f"Unique Words : {stats['unique_words']}")
    print(f"Sentences    : {stats['sentences']}")
    print("\nTop 5 Most Common Words:")
    if not stats["most_common"]:
        print("  (No words detected)")
    else:
        for word, count in stats["most_common"]:
            print(f"  • {word:<12} : {count}")
    print("=" * 32 + "\n")


if __name__ == "__main__":
    main()
```

### Key CLI Design Patterns:
- **`pathlib.Path` Integration:** By setting `type=Path`, `argparse` automatically converts string arguments into cross-platform filesystem paths.
- **Fail-Fast Error Handling:** Before attempting to process data, the CLI checks `target_file.is_file()` and wraps file reading in explicit exception handlers for encoding or permission issues.
- **Strict Separation of Concerns:** Notice how `main()` merely reads the file and forwards `text` directly to `analyze_text(text)`. It delegates the math and focuses solely on user presentation.

---

## 6. Configuring the CLI Entry Point

Now let's wire up our application so users can run it directly as a command instead of having to type `python src/text_inspector/cli.py`.

Open `pyproject.toml`. Under the `[project.scripts]` table, define the console entry point:

```toml
[project.scripts]
text-inspector = "text_inspector.cli:main"
```

This tells the Python packaging standard: *"Whenever the command `text-inspector` is invoked, execute the `main()` function inside the `text_inspector.cli` module."*

Next, clean up `src/text_inspector/__init__.py`. Replace any placeholder boilerplate with a clean package docstring:

```python
"""Text Inspector: A modular text analytics application."""

__version__ = "0.1.0"
```

---

## 7. Verifying with Sample Data

In your project root, create a sample test file named `sample.txt`:

```text
Python is powerful. Python is practical!
```

Ensure the file is saved with UTF-8 encoding.

Now, synchronize your environment and execute the application:

```bash
# Synchronize virtual environment with declared project metadata
uv sync

# Run the registered command entry point
uv run text-inspector sample.txt
```

You should see clean terminal output:

```text
Text Analysis Report
================================
Characters   : 40
Words        : 6
Unique Words : 4
Sentences    : 2

Top 5 Most Common Words:
  • python       : 2
  • is           : 2
  • powerful     : 1
  • practical    : 1
================================
```

*(Note: Depending on your text editor, saving `sample.txt` with a trailing newline will yield 41 characters. Both are expected).*

---

## 8. Writing Automated Unit Tests with pytest

A manual test proves that our code ran once on a single sample file. It does not prove that the system handles edge cases, empty files, or mixed punctuation.

Because we isolated `analyze_text` into a pure function, we can test it thoroughly without opening a terminal prompt or reading files from disk.

Create a `tests/` directory at the project root, and add `test_analysis.py`:

```python
from text_inspector.analysis import analyze_text


def test_analyze_text_basic_counts():
    text = "Python is powerful. Python is practical!"
    stats = analyze_text(text)

    assert stats["characters"] == 40
    assert stats["words"] == 6
    assert stats["unique_words"] == 4
    assert stats["sentences"] == 2
    assert stats["most_common"] == [
        ("python", 2),
        ("is", 2),
        ("powerful", 1),
        ("practical", 1),
    ]


def test_analyze_text_empty_string():
    stats = analyze_text("")

    assert stats == {
        "characters": 0,
        "words": 0,
        "unique_words": 0,
        "sentences": 0,
        "most_common": [],
    }


def test_analyze_text_case_insensitivity():
    text = "Python python PYTHON"
    stats = analyze_text(text)

    assert stats["words"] == 3
    assert stats["unique_words"] == 1
    assert stats["most_common"] == [("python", 3)]


def test_analyze_text_contractions_and_punctuation():
    text = "Don't repeat yourself! Isn't clean code great? Yes."
    stats = analyze_text(text)

    assert stats["sentences"] == 3
    assert "don't" in [w for w, _ in stats["most_common"]]
```

### Running the Test Suite
Execute the tests through `uv run`:

```bash
uv run pytest -v
```

Output:

```text
============================= test session starts =============================
platform win32 -- Python 3.12.x, pytest-8.3.x
collected 4 items

tests/test_analysis.py::test_analyze_text_basic_counts PASSED             [ 25%]
tests/test_analysis.py::test_analyze_text_empty_string PASSED             [ 50%]
tests/test_analysis.py::test_analyze_text_case_insensitivity PASSED       [ 75%]
tests/test_analysis.py::test_analyze_text_contractions_and_punctuation PASSED [100%]

============================== 4 passed in 0.04s ==============================
```

Because `analysis.py` is decoupled from terminal printing, all 4 comprehensive tests execute in **40 milliseconds**. If we ever decide to wrap this logic in a FastAPI web service or desktop GUI later, our test suite remains 100% valid.

---

## 9. Documenting the Project

A project is incomplete without clear operational documentation. Replace `README.md` at the project root with concise developer instructions:

````markdown
# Text Inspector

A modular, testable command-line application for analyzing text documents.

## Features
- Total character and token counts.
- Unique vocabulary detection.
- Sentence boundary heuristic estimation.
- Top-5 word frequency ranking.

## Installation & Setup
Clone the repository and synchronize the environment:

```bash
uv sync
```

## Running the Application
Inspect any UTF-8 text file:

```bash
uv run text-inspector sample.txt
```

## Running Tests
Execute the automated test suite:

```bash
uv run pytest -v
```
````

---

## 10. Architectural Responsibility Matrix

Let's review the role of each file in this workflow:

| File / Directory | Layer | Purpose |
| :--- | :--- | :--- |
| `src/text_inspector/analysis.py` | Domain / Logic | Computes statistics from strings. Contains zero I/O or CLI code. |
| `src/text_inspector/cli.py` | Presentation / UI | Parses CLI flags, validates files, invokes analysis, and prints output. |
| `src/text_inspector/__init__.py` | Package Marker | Defines module boundary and version identifier. |
| `tests/test_analysis.py` | Verification | Ensures computational correctness across edge cases. |
| `pyproject.toml` | Manifest | Declares project metadata, dependencies, and CLI entry points. |
| `uv.lock` | Determinism | Locks exact package hashes for cross-machine reproducibility. |
| `.venv/` | Runtime | Disposable local environment containing installed wheels. |
| `sample.txt` | Fixture | Sample document used for manual verification. |

---

## 11. Version Control & Packaging Validation

### 11.1 Verify `.gitignore`
Inspect your `.gitignore` to ensure machine-specific state is excluded:

```text
.venv/
__pycache__/
*.py[cod]
.pytest_cache/
dist/
```

### 11.2 Validate the Build Distribution
Before committing or publishing, verify that your project packages cleanly:

```bash
uv build
```

This compiles standard `.tar.gz` source archives and `.whl` binary wheels into `dist/`.

---

## 12. Reproducing on Another Machine

When a teammate clones your repository, getting up to speed requires only two commands:

```bash
# Recreate the exact environment from the lockfile
uv sync --locked

# Verify behavior
uv run pytest
uv run text-inspector sample.txt
```

Because `uv.lock` is cross-platform, this workflow functions identically across Windows, macOS, and Linux without manual virtual environment configuration.

---

## 13. Common Gotchas & Troubleshooting

1. **`text-inspector: command not found`:**  
   Ensure you ran `uv sync` after adding the `[project.scripts]` entry in `pyproject.toml`.
2. **`ModuleNotFoundError: No module named 'text_inspector'`:**  
   Verify that your code lives under `src/text_inspector/` and contains `__init__.py`. Run commands from the project root.
3. **`pytest` fails to collect tests:**  
   Confirm test files follow the `test_*.py` naming convention and reside in `tests/`.
4. **Lockfile out of sync:**  
   If you modified dependencies directly in `pyproject.toml`, run `uv lock` to synchronize `uv.lock` before executing `uv sync --locked`.

---

## Summary

Building production software in Python is not about writing needlessly complex abstractions—it is about **discipline and clarity**:

1. **Keep business logic pure:** Isolate domain calculations from terminal input, file reading, and web requests.
2. **Embrace the `src` layout:** Prevent import side-effects and structure packages for packaging.
3. **Declare entry points in `pyproject.toml`:** Turn internal functions into user-facing commands.
4. **Partition dependencies:** Use `--dev` for test runners, keeping runtime dependencies lean.
5. **Lock everything with uv:** Achieve reliable, one-command reproducibility on any workstation or CI runner.

With this workflow in your toolkit, scaling from a 10-line prototype to a full-fledged production service becomes a natural, predictable process.

---

### References & Further Reading
- [Astral uv — Working on Projects](https://docs.astral.sh/uv/guides/projects/)
- [Python Packaging Guide — src Layout vs. Flat Layout](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/)
- [pytest Documentation](https://docs.pytest.org/en/stable/)
- [PEP 621 — Project Metadata in pyproject.toml](https://peps.python.org/pep-0621/)
