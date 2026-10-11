---
title: "Getting Started with uv: A Practical Guide to Python Environments from Scratch"
date: 2026-10-11T20:30:00+07:00
summary: "Say goodbye to wrestling with Python versions, virtual environments, and slow dependency resolvers. Here is a step-by-step walkthrough for configuring uv, structuring projects, and running Python code seamlessly."
category: "Software Engineering"
image: "/assets/img/articles/uv-python-guide.jpg"
tags:
  - "Python"
  - "uv"
  - "Developer Tools"
  - "Environment Management"
  - "DevOps"
draft: false
---

If you have spent any significant amount of time in the Python ecosystem, you have likely run into the classic environment dilemma: a script runs flawlessly on your laptop, but falls apart on a colleague's workstation because of mismatched minor versions or conflicting package requirements. Over the years, the community responded with an assortment of dedicated tools—`pyenv` for managing Python runtimes, `virtualenv` or `venv` for isolated environments, and `pip-tools` or `poetry` for locking dependencies. While these tools solved real problems, juggling three or four separate utilities across multiple projects often feels fragmented and needlessly slow.

Enter **uv**, an extremely fast Python package and project manager developed by Astral (the team behind Ruff). Written in Rust, uv brings these disjointed workflows together into a single, cohesive command-line interface. 

In this guide, we will walk through setting up uv from scratch, managing Python versions without touching your system PATH, initializing a standardized project, managing dependencies, and running code reliably.

---

## 1. What Exactly is uv?

At its core, **uv** is an all-in-one toolchain for Python development. Rather than replacing Python itself, uv manages everything *around* your Python workflow:

- **Python Runtime Management:** Automatically downloads, installs, and switches between specific Python versions (e.g., 3.10, 3.12, 3.13) without needing external tools like `pyenv`.
- **Ultra-Fast Dependency Resolution:** Resolves and installs packages orders of magnitude faster than conventional `pip`, caching wheels globally to save both time and disk space.
- **Automatic Virtual Environments:** Creates isolated environments per project and synchronizes them transparently whenever your dependency list changes.
- **Ephemeral Script Execution:** Runs scripts directly through `uv run` without requiring you to manually activate or deactivate virtual environments in your shell.
- **Deterministic Lockfiles:** Generates a cross-platform `uv.lock` file so your teammates and CI pipelines install identical dependency trees down to the byte.

For detailed design notes and benchmark figures, check out the [official uv documentation](https://docs.astral.sh/uv/).

---

## 2. Prerequisites

Before we start installing anything, ensure you have:

1. A computer running **Windows 10/11**, **macOS**, or modern **Linux**.
2. An active internet connection to pull runtimes and packages.
3. Access to a terminal: **PowerShell** on Windows, or **Terminal** (zsh/bash) on macOS and Linux.
4. Your favorite text editor or IDE (Visual Studio Code, PyCharm, or Neovim).

> **Do I need Python pre-installed on my machine?**  
> **No.** One of the cleanest advantages of uv is that it can download and manage standalone, pre-built Python binaries directly from Astral's upstream builds. If you already have Python installed, uv will happily detect it, but starting with a clean machine is completely fine.

---

## 3. Installing uv on Your System

### A. Windows (PowerShell)

On modern Windows, the most straightforward approach is using the Windows Package Manager (`winget`):

```powershell
winget install --id astral-sh.uv -e
```

If `winget` is not configured on your system, you can use the official PowerShell standalone installer:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Once the installer finishes, **close and reopen PowerShell** so your updated environment variables take effect.

---

### B. macOS

If you use Homebrew:

```bash
brew install uv
```

Alternatively, use the official shell script:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

### C. Linux

Run the official standalone installer:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

*(If `curl` is missing, install it via your distribution's package manager, e.g., `sudo apt install curl`).*

For full installation flags and alternative package managers, refer to the [uv installation guide](https://docs.astral.sh/uv/getting-started/installation/).

---

## 4. Verifying the Installation

Open a fresh terminal window and check whether the binary is in your executable path:

```bash
uv --version
```

You should see output indicating the installed version:

```text
uv 0.5.x (or newer)
```

To view available top-level commands, run:

```bash
uv --help
```

> **Troubleshooting: Command Not Recognized?**  
> If your terminal reports that `uv` cannot be found, close all open terminal windows and relaunch your shell. On Windows, verify that `%USERPROFILE%\.cargo\bin` or `%LOCALAPPDATA%\uv` is included in your user `PATH` environment variable.

---

## 5. Installing Python Versions Through uv

Now let's grab a clean Python runtime. We will install **Python 3.12** for this tutorial:

```bash
uv python install 3.12
```

uv automatically fetches a portable, optimized Python 3.12 distribution. To inspect what versions are installed or available upstream, run:

```bash
uv python list
```

This command prints a table of local Python installations alongside remote versions ready for download. You never have to worry about polluting your machine's global operating system interpreter again.

---

## 6. Creating Your First Project

Let's initialize a new project called `belajar-uv` (or any name you prefer) locked to Python 3.12:

```bash
uv init --python 3.12 belajar-uv
```

Navigate into your newly created directory:

```bash
cd belajar-uv
```

Let's inspect the files uv produced:

```text
belajar-uv/
├── .git/
├── .gitignore
├── .python-version
├── README.md
├── pyproject.toml
└── src/
    └── belajar_uv/
        └── __init__.py
```

Here is a breakdown of what each generated file and directory does:

| File or Directory | Role / Layer | Functional Purpose |
| :--- | :--- | :--- |
| **`pyproject.toml`** | Project Manifest | Stores project metadata, required Python runtime constraints, and declared dependencies. |
| **`.python-version`** | Version Pin | Pins the default Python release intended for this workspace. |
| **`src/belajar_uv/`** | Application Package | Houses the importable application source code using the modern `src` layout. |
| **`.venv/`** | Environment Sandbox | The isolated virtual environment containing the Python interpreter and installed packages. |
| **`uv.lock`** | Deterministic Lockfile | Tracks exact package versions and cryptographic hashes across your entire dependency graph. |
| **`README.md`** | Documentation | Provides human-readable overview and operational instructions for the project. |
| **`.gitignore`** | Version Control | Ensures machine-specific state (like `.venv/` and caches) remains excluded from Git. |

---

## 7. Running Code Without Manual Environment Activation

Before writing custom code, let's test the default application entry point generated by the template:

```bash
uv run belajar-uv
```

Your terminal should output:

```text
Hello from belajar-uv!
```

### What happened behind the scenes?

When you ran `uv run`, uv performed several tasks in milliseconds:
1. It inspected `pyproject.toml` and `.python-version`.
2. It ensured a compatible `.venv` existed with the right Python interpreter.
3. It resolved any required internal packages and executed the application inside that isolated environment.

You did not have to run `python -m venv .venv`, navigate into `Scripts/`, or source an activation script.

---

## 8. Adding Dependencies to Your Project

Most real-world scripts rely on third-party libraries. Suppose our project needs `requests` for making HTTP calls.

Add it to the project using `uv add`:

```bash
uv add requests
```

### Why `uv add` instead of `pip install requests`?

Running bare `pip install` only puts files into your current active virtualenv without recording them in your project manifesto. If you push that code to Git, the next developer has no idea which libraries are needed.

In contrast, `uv add`:
1. Adds `requests` directly under `dependencies` in `pyproject.toml`.
2. Computes the entire transitive dependency tree (e.g., `urllib3`, `certifi`, `idna`, `charset-normalizer`).
3. Updates `uv.lock` with cryptographic hashes.
4. Synchronizes your local `.venv` automatically.

---

## 9. Writing and Executing Custom Code

Now let's write a simple script that imports `requests` and verifies our environment setup.

In the root of your project directory (`belajar-uv/`), create a file named `main.py`:

```python
import requests

def main() -> None:
    print("Python script successfully executed with uv!")
    print(f"Installed requests version: {requests.__version__}")

if __name__ == "__main__":
    main()
```

Your directory structure will now look like this:

```text
belajar-uv/
├── .python-version
├── .venv/
├── main.py
├── pyproject.toml
├── src/
│   └── belajar_uv/
│       └── __init__.py
└── uv.lock
```

Run your new script using `uv run`:

```bash
uv run main.py
```

Output:

```text
Python script successfully executed with uv!
Installed requests version: 2.32.x
```

Because `uv add requests` was run earlier, uv immediately recognizes `requests` as a registered project dependency and launches Python with full access to it.

---

## 10. Key Commands in the Daily uv Workflow

Here is a quick reference table of essential uv commands:

| Command | Purpose |
| :--- | :--- |
| `uv --version` | Checks the currently installed uv version |
| `uv python install <ver>` | Installs a specific Python version (e.g., `3.12`, `3.11`) |
| `uv python list` | Lists all available and locally installed Python runtimes |
| `uv init <project-name>` | Scaffolds a new Python project structure |
| `uv add <package>` | Declares a dependency and updates `pyproject.toml` & `uv.lock` |
| `uv remove <package>` | Removes a dependency from the project configuration |
| `uv sync` | Reconciles your virtual environment with declared lockfile dependencies |
| `uv run <script.py>` | Runs a script or binary within the project environment |
| `uv lock` | Regenerates or updates `uv.lock` without altering `.venv` |

### Understanding `add`, `sync`, and `run`

- **`uv add`** changes your project's intent by adding new requirements.
- **`uv sync`** ensures your filesystem (`.venv`) accurately mirrors your project's declared state.
- **`uv run`** is an operational command: it validates that the environment is up to date, then runs your command.

---

## 11. Do You Ever Need to Manually Activate the Virtual Environment?

Generally, **no**. Using `uv run` for all commands is faster and prevents common mistakes (like running scripts in the wrong terminal tab where the environment was never activated).

However, if you are using an IDE extension or need interactive terminal access, you can still activate the virtual environment manually whenever you want:

**On Windows (PowerShell):**
```powershell
.\.venv\Scripts\Activate.ps1
```

**On macOS & Linux:**
```bash
source .venv/bin/activate
```

Once activated, your terminal prompt will display `(belajar-uv)`, and regular `python main.py` calls will resolve against the virtual environment's interpreter.

---

## 12. Sharing and Reproducing Projects Across Machines

One of the biggest wins of moving to uv is deterministic reproducibility. When sharing your project via GitHub or transferring it to a new server:

### Files to Commit to Git:
- `pyproject.toml`
- `uv.lock`
- `.python-version`
- Application source code (`src/`, `main.py`, tests, etc.)

### Files to NEVER Commit (`.gitignore`):
- `.venv/` (virtual environments are machine-specific and should never be checked into version control)

### Setting Up on the Target Machine:
On any other computer with uv installed, reproducing the entire workspace is a one-liner:

```bash
# Clone the repository and enter directory
git clone https://github.com/your-username/belajar-uv.git
cd belajar-uv

# Synchronize dependencies exactly as pinned in uv.lock
uv sync

# Run your code
uv run main.py
```

uv reads `uv.lock`, automatically fetches Python 3.12 if it is missing, installs the exact package versions, and has you running in seconds.

---

## 13. Common Troubleshooting & Practical Tips

### 1. `uv` is not recognized as an internal or external command
Close and reopen your terminal. If the issue persists, inspect your system environment variables and verify that uv's install folder is added to `PATH`.

### 2. PowerShell blocks the virtualenv activation script
If running `Activate.ps1` produces an `ExecutionPolicy` error, do not lower your entire system security policy. Simply use `uv run main.py` instead—it bypasses shell script execution entirely.

### 3. `ModuleNotFoundError: No module named '...'`
You likely imported a library in your Python code that has not been recorded in `pyproject.toml`. Run `uv add <package-name>`, then re-run with `uv run`.

### 4. The first installation seems slightly slower
During initial execution, uv downloads the standalone Python binary and package wheels over your network. Subsequent runs use Astral's global content-addressable cache, making environment creation virtually instantaneous.

---

## Summary & Next Steps

Setting up Python environments used to be a frustrating rite of passage for newcomers and a recurring annoyance for seasoned engineers. By unifying Python version management, dependency resolution, lockfile synchronization, and environment execution into a single, blazing-fast tool, **uv** significantly raises the standard for developer experience.

With the foundational workflow covered here, you are ready to expand into more complex setups—such as running [FastAPI](https://fastapi.tiangolo.com/) microservices, orchestrating data pipelines with pandas and polars, or managing PyTorch environments for machine learning models.

---

### References & Further Reading
- [Official uv Documentation — Getting Started](https://docs.astral.sh/uv/getting-started/installation/)
- [Managing Python Versions with uv](https://docs.astral.sh/uv/guides/install-python/)
- [Project Management Guide in uv](https://docs.astral.sh/uv/guides/projects/)
- [Understanding `uv run`](https://docs.astral.sh/uv/concepts/projects/run/)
