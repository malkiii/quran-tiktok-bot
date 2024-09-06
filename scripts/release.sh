#!/usr/bin/env sh

ROOT_DIR="$(dirname $(dirname "$0"))"
NEW_VERSION="$(node -pe "require('$ROOT_DIR/package.json').version")"

# Create and push a new tag
git tag $NEW_VERSION && git push --tags

# Create a new release on GitHub
gh release create $NEW_VERSION --generate-notes
