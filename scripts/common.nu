#!/usr/bin/env nu

export def switch-shell-theme [] {
    ls /dev/pts/ | where name =~ '\d' | each { |file|
        cat $"($env.XDG_CACHE_HOME)/colors/shell" | save --append $file.name
    }
}
