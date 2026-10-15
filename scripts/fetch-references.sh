#!/usr/bin/env bash
# Clone the upstream reference repos used as study material for this skill.
# They are gitignored. Re-run safely; existing clones are skipped.
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p references
cd references

repos=(
  howseen-ai/claude-motion-design
  echris6/motion-video-kit
  iart-ai/motion-design-skills
  iart-ai/webgl-animation-skills
  iart-ai/javascript-animation-skills
)

for r in "${repos[@]}"; do
  n=$(basename "$r")
  if [ -d "$n/.git" ]; then
    echo "skip   $n"
    continue
  fi
  git clone --depth 1 --quiet "https://github.com/$r.git" "$n" && echo "cloned $n"
done

echo
echo "Reference material is in references/ — see CREDITS.md for licences."
