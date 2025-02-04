#!/bin/bash
set -eu

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

# shellcheck disable=SC2034
OLD_VERSION="$1"
NEW_VERSION="$2"

sed -i -e 's/^version = .*$/version = '"$NEW_VERSION/" setup.cfg

echo "New version: $NEW_VERSION"
