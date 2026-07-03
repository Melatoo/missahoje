import os

artifacts_dir = r"c:\Users\Melato\Documents\missahoje\_bmad-output\implementation-artifacts"
diff_path = os.path.join(artifacts_dir, "current_diff.diff")
spec_path = os.path.join(artifacts_dir, "1-2-inicializacao-do-mapa-e-geolocalizacao.md")

with open(diff_path, "r", encoding="utf-16") as f:
    diff_content = f.read()

with open(spec_path, "r", encoding="utf-8") as f:
    spec_content = f.read()

blind_hunter_prompt = f"""
You are the Blind Hunter. Your task is to perform an adversarial code review on the provided diff. You have no access to the project, no context, and no spec. Your goal is to find bugs, anti-patterns, security issues, performance problems, and maintainability concerns in the diff itself.

## Diff

```diff
{diff_content}
```
"""

edge_case_hunter_prompt = f"""
You are the Edge Case Hunter. Your task is to review the following diff and identify edge cases, boundary conditions, and unhandled states. You have read access to the project (you can use your tools to read files if needed, but the primary focus is the diff).

## Diff

```diff
{diff_content}
```
"""

acceptance_auditor_prompt = f"""
You are an Acceptance Auditor. Review this diff against the spec and context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

## Spec

```markdown
{spec_content}
```

## Diff

```diff
{diff_content}
```
"""

with open(os.path.join(artifacts_dir, "prompt-blind-hunter.md"), "w", encoding="utf-8") as f:
    f.write(blind_hunter_prompt)

with open(os.path.join(artifacts_dir, "prompt-edge-case-hunter.md"), "w", encoding="utf-8") as f:
    f.write(edge_case_hunter_prompt)

with open(os.path.join(artifacts_dir, "prompt-acceptance-auditor.md"), "w", encoding="utf-8") as f:
    f.write(acceptance_auditor_prompt)

print("Prompt files generated.")
