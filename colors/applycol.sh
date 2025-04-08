#!/usr/bin/env bash
apply_term() {

  for file in /dev/pts/*; do
    if [[ $file =~ ^/dev/pts/[0-9]+$ ]]; then
      cat shell/ayu-dark >"$file"
    fi
  done
}

apply_term &
