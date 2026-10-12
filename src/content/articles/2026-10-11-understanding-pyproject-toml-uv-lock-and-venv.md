---
title: "Understanding pyproject.toml, uv.lock, and .venv: How uv Manages Python Projects"
date: 2026-10-11T20:55:00+07:00
summary: "Demystifying the foundational triad that makes modern Python projects structured, reproducible, and portable across machines. Learn how configuration, lockfiles, and virtual environments work together under the hood."
category: "Software Engineering"
image: "/assets/img/articles/uv-project-internals.jpg"
tags:
  - "Python"
  - "uv"
  - "Project Management"
  - "Dependency Management"
  - "Software Engineering"
featured: true
featuredOrder: 6
series:
  name: "Modern Python Tooling with uv"
  part: 2
draft: false
---

In our previous walkthrough, we explored how **uv** simplifies the Python developer experience—from installing isolated Python runtimes to creating projects, declaring dependencies, and executing code without manual virtual environment activations. Commands like `uv init`, `uv add requests`, and `uv run main.py` make bootstrapping feel effortless.

Yet, as projects grow from simple one-off scripts into production-grade systems, a natural architectural question arises: **What is actually happening under the hood?**

Why does uv create both a `pyproject.toml` file and a `uv.lock` file? What lives inside the `.venv/` directory, and why can't we simply copy it over to a teammate's computer? Understanding how these three building blocks interact is the difference between blindly hoping an environment works and confidently architecting reproducible software.

---

## 1. High-Level Mental Model: Three Components, Three Distinct Responsibilities

Before diving into configuration files, it helps to ground our mental model in clear responsibilities. Each of these three artifacts addresses a fundamentally different phase of the software lifecycle:

| Component | Nature | Primary Responsibility | Real-World Analogy |
| :--- | :--- | :--- | :--- |
| **`pyproject.toml`** | Human-authored configuration | Declares project metadata and broad dependency constraints | An architectural blueprint or bill of materials |
| **`uv.lock`** | Machine-generated lockfile | Records the exact resolved versions, sources, and hashes | A stamped receipt detailing every specific part purchased |
| **`.venv/`** | Machine-specific directory | Houses the local Python interpreter and installed binaries | The physical workshop where parts are assembled |

None of these replace the others. Rather, they form an orderly downstream pipeline:

```text
┌─────────────────────────┐
│     pyproject.toml      │  (Declared requirements & version constraints)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│         uv.lock         │  (Resolved dependency tree & cryptographic hashes)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│         .venv/          │  (Local virtual environment with installed wheels)
└────────────┬────────────┘
             │
             ▼
     Python Application Runs
```

Whenever you run an operational command, uv inspects this pipeline. If your lockfile is out of date relative to your configuration, or your `.venv/` does not match your lockfile, uv automatically reconciles the differences before invoking your interpreter.

---

## 2. Demystifying `pyproject.toml`: The Project Manifest

[`pyproject.toml`](https://peps.python.org/pep-0621/) is the official packaging standard across the modern Python ecosystem. It serves as the single source of truth for your project's high-level requirements.

### 2.1 Where Does It Live?

In any uv project, `pyproject.toml` sits at the root directory:

```text
belajar-uv/
├── .python-version
├── pyproject.toml       <-- Project manifest
├── uv.lock
├── src/
│   └── belajar_uv/
└── README.md
```

### 2.2 Anatomical Breakdown of `pyproject.toml`

When you initialize a project and add a library like `requests`, your `pyproject.toml` will look similar to this:

```toml
[project]
name = "belajar-uv"
version = "0.1.0"
description = "Learning Python project management with uv"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "requests>=2.31.0",
]
```

Let's dissect each key:

- **`name`:** The distribution package name. This identifier is used if you publish your package or install it in editable mode.
- **`version`:** The current semantic version of your project (`MAJOR.MINOR.PATCH`).
- **`description`:** A human-readable one-liner explaining the project's purpose.
- **`requires-python = ">=3.12"`:** Specifies the allowable Python runtime range. Notice the `>=` operator: this does *not* strictly limit you to Python 3.12.0; it declares that any Python release at 3.12 or newer is acceptable, provided your code and third-party libraries support it.
- **`dependencies`:** Lists your direct, top-level requirements. The entry `"requests>=2.31.0"` specifies a *constraint*, not a fixed version. It informs the package manager: *"Give me the newest safe version of `requests` that satisfies at least 2.31.0."*

### 2.3 Managing Dependencies Cleanly

While you can edit `pyproject.toml` by hand, in day-to-day work you should use uv's CLI primitives:

```bash
# Add a new dependency to the manifest and sync the environment
uv add pandas

# Remove a dependency and prune it from the environment
uv remove pandas
```

Using `uv add` ensures that your declared dependency is immediately resolved against existing packages, verified for compatibility, and recorded without formatting errors.

---

## 3. Demystifying `uv.lock`: Deterministic Reproducibility

If `pyproject.toml` already declares our dependencies, why do we need `uv.lock`?

Consider this common scenario: you specify `"requests>=2.31.0"` in your project today. The resolver selects version `2.32.3`. Six months later, a teammate clones your repository, runs an install without a lockfile, and gets version `2.33.0`—which might introduce an upstream regression or alter an internal API. 

Even worse are **transitive dependencies**. `requests` depends on `urllib3`, `certifi`, `idna`, and `charset-normalizer`. If any of those sub-dependencies publish a breaking release, two developers working on identical code can experience completely different runtime behaviors.

### 3.1 What Lives Inside `uv.lock`?

`uv.lock` records the complete, concrete state of your dependency graph:

1. **Exact Pinned Versions:** No broad ranges; every package (both direct and transitive) is pinned to an exact release.
2. **Cryptographic Hashes:** SHA-256 digests for each package archive to prevent tampering or corrupted downloads.
3. **Cross-Platform Wheel Metadata:** Records which binary wheels belong to Windows, macOS, or Linux, allowing a single lockfile to be safely checked in and shared across diverse operating systems.

Because `uv.lock` is a generated artifact containing thousands of lines of machine-optimized TOML, **you should never edit it by hand**.

### 3.2 Key Lockfile Commands

uv provides dedicated commands to inspect and update lockfiles:

```bash
# Resolve and record all dependencies into uv.lock without touching .venv/
uv lock

# Check whether uv.lock is currently in sync with pyproject.toml
uv lock --check

# Explicitly upgrade locked dependencies within the bounds of pyproject.toml
uv lock --upgrade
```

> **Rule of Thumb:** For standalone scripts and applications (APIs, data processing pipelines, web apps), **always commit `uv.lock` to Git**. This ensures that every developer and CI/CD runner operates against the exact same code down to every sub-dependency.

---

## 4. Demystifying `.venv/`: The Local Virtual Environment

The third piece of the puzzle is `.venv/`. Unlike `pyproject.toml` and `uv.lock` (which are text configuration files), `.venv/` is an actual folder on your file system containing compiled binaries, Python interpreter symlinks, and installed site-packages.

### 4.1 Why Virtual Environments Are Essential

If you install packages into your computer's global Python environment, you quickly run into version collisions. Project A might require `scikit-learn 1.2`, while Project B requires `scikit-learn 1.5`. Virtual environments solve this by giving each project an isolated directory sandbox:

```text
workspace/
├── project-a/
│   ├── .venv/            <-- Contains scikit-learn 1.2
│   └── pyproject.toml
└── project-b/
    ├── .venv/            <-- Contains scikit-learn 1.5
    └── pyproject.toml
```

### 4.2 Anatomy of `.venv/`

The internal layout of `.venv/` varies slightly depending on your operating system:

```text
# On Windows:
.venv/
├── Lib/
│   └── site-packages/   <-- Installed wheels (requests, urllib3, etc.)
├── Scripts/
│   ├── python.exe       <-- Project interpreter
│   └── Activate.ps1     <-- Shell activation script
└── pyvenv.cfg           <-- Base Python runtime pointer

# On macOS & Linux:
.venv/
├── bin/
│   ├── python           <-- Symlink to interpreter
│   └── activate         <-- Bash/Zsh activation script
├── lib/
│   └── python3.12/
│       └── site-packages/
└── pyvenv.cfg
```

### 4.3 Why `.venv/` Must NEVER Be Committed to Version Control

It is tempting for beginners to think: *"If I want my teammate to have my environment, why not just commit `.venv/` to Git?"*

Doing so will immediately break their setup for several reasons:
1. **Hardcoded Paths:** Files like `pyvenv.cfg` and internal shell scripts contain absolute paths to your local user directory (e.g., `C:\Users\mreko\...`).
2. **Platform Incompatibility:** Binary `.dll` and `.pyd` files built for Windows cannot execute on macOS or Linux.
3. **Repository Bloat:** Virtual environments contain thousands of compiled files, causing Git repositories to balloon to hundreds of megabytes.

Instead, ensure `.venv/` is listed in your `.gitignore`:

```text
.venv/
__pycache__/
*.pyc
```

Let uv recreate `.venv/` on the destination machine in seconds using `uv sync`.

---

## 5. Demystifying `.python-version` vs. `requires-python`

When you initialize a project using `uv init --python 3.12 my-app`, uv creates both a `.python-version` file and sets `requires-python` in `pyproject.toml`. Developers often confuse these two:

```text
.python-version
3.12
```

vs.

```toml
# pyproject.toml
[project]
requires-python = ">=3.12"
```

Here is the distinction:
- **`.python-version`** is a *user-level pin*. It instructs uv: *"Whenever I am inside this folder, please select Python 3.12 as my active interpreter."*
- **`requires-python`** is an *architectural constraint*. It tells anyone building or packaging the project: *"This application requires Python 3.12 or newer to run safely."*

---

## 6. Hands-On: The Triad in Action

Let's test these concepts hands-on inside a project directory.

### Step 1: Verify the Configuration
Open `pyproject.toml` and confirm your dependencies:

```toml
[project]
name = "belajar-uv"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "requests>=2.31.0",
]
```

### Step 2: Validate the Lockfile
Run a quick health check on the lockfile:

```bash
uv lock --check
```

If the lockfile is up to date with your manifest, uv exits cleanly with code 0.

### Step 3: Perform an Exact Sync
Run:

```bash
uv sync
```

By default, `uv sync` performs an **exact sync**. This means uv not only installs missing packages, but also aggressively removes any extraneous packages in `.venv/` that are not declared in `uv.lock`. This guarantees that your environment never accumulates "ghost" packages from previous experiments.

### Step 4: Visualize the Dependency Tree
To see both direct and transitive dependencies clearly, run:

```bash
uv tree
```

Output:

```text
belajar-uv v0.1.0
└── requests v2.32.3
    ├── certifi v2024.8.30
    ├── charset-normalizer v3.4.0
    ├── idna v3.10
    └── urllib3 v2.2.3
```

Notice how `uv tree` shows you the complete hierarchy of packages supporting `requests`:

| Package | Nature | Resolved Version | Functional Purpose |
| :--- | :--- | :--- | :--- |
| **`requests`** | Direct | `2.32.3` | User-declared HTTP client library |
| **`certifi`** | Transitive | `2024.8.30` | Curated Mozilla CA bundle for SSL verification |
| **`charset-normalizer`** | Transitive | `3.4.0` | Character encoding detector for HTTP responses |
| **`idna`** | Transitive | `3.10` | Internationalized Domain Names in Applications (RFC 5891) |
| **`urllib3`** | Transitive | `2.2.3` | Low-level HTTP connection pooling and thread safety |

### Step 5: Execute the Code
Now execute your script:

```bash
uv run main.py
```

`uv run` checks your lockfile, ensures `.venv/` matches, and runs your program in a fraction of a second.

---

## 7. Porting Projects Across Different Computers

When transferring a project to a new machine or continuous integration (CI) server:

1. **Only share the manifest and code:**
   - `pyproject.toml`
   - `uv.lock`
   - `.python-version`
   - `src/` and application files
2. **On the new machine, run:**

```bash
# Clone the repository
git clone https://github.com/your-username/my-project.git
cd my-project

# Synchronize strictly against the checked-in lockfile
uv sync --locked

# Run your application
uv run main.py
```

The `--locked` flag is especially valuable in CI/CD pipelines: it forces uv to fail immediately if someone modified `pyproject.toml` without updating `uv.lock`, preventing unintended dependency drift in production builds.

---

## 8. Common Pitfalls to Avoid

1. **Committing `pyproject.toml` but ignoring `uv.lock`:**  
   Without a lockfile, different team members can end up with different sub-dependency versions. For application development, always check in `uv.lock`.
2. **Attempting to commit `.venv/`:**  
   Virtual environments are platform-specific artifacts. Always allow uv to construct `.venv/` locally via `uv sync`.
3. **Bypassing the project manifest with loose package installs:**  
   Avoid using random global tools to install packages. Always use `uv add <package>` so every library is properly tracked in `pyproject.toml` and locked in `uv.lock`.
4. **Manually editing `uv.lock`:**  
   Manual edits risk corrupting dependency resolution graphs and checksums. Use `uv lock` or `uv lock --upgrade` to make adjustments.
5. **Forgetting that `uv sync` prunes undeclared packages:**  
   If you manually install a package without declaring it in `pyproject.toml`, the next `uv sync` will delete it. Keep your manifest accurate!

---

## 9. Comprehensive Comparison Summary

| Attribute | `pyproject.toml` | `uv.lock` | `.venv/` |
| :--- | :--- | :--- | :--- |
| **File Type** | Human-readable TOML configuration | Machine-generated TOML lockfile | File system directory |
| **Primary Audience** | Developers and packaging tools | Package managers (uv) and CI runners | Local operating system & Python interpreter |
| **Contains** | High-level requirements & metadata | Pinned package versions, hashes, platform wheels | Executable binaries & installed site-packages |
| **Target of Version Control?** | **Yes** (Always commit) | **Yes** (Recommended for apps) | **No** (Always in `.gitignore`) |
| **Portable Across Platforms?** | Yes | Yes (uv lockfiles are universal) | No (Platform & path specific) |
| **Primary Commands** | `uv add`, `uv remove` | `uv lock`, `uv lock --upgrade` | `uv sync`, `uv run` |

---

## Wrapping Up

Understanding the roles of `pyproject.toml`, `uv.lock`, and `.venv/` elevates your Python workflow from ad-hoc scripting to robust software engineering. 

By treating `pyproject.toml` as your intent, `uv.lock` as your guarantee, and `.venv/` as your disposable local engine, you can build, collaborate on, and deploy Python applications with complete peace of mind.

---

### References & Documentation
- [uv Documentation — Project Concepts](https://docs.astral.sh/uv/concepts/projects/)
- [uv Documentation — Dependency Management](https://docs.astral.sh/uv/concepts/dependencies/)
- [uv Documentation — Locking & Syncing](https://docs.astral.sh/uv/concepts/projects/sync/)
- [PEP 621 — Storing Project Metadata in `pyproject.toml`](https://peps.python.org/pep-0621/)
