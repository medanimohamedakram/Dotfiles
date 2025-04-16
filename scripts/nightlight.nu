#!/usr/bin/env nu

let temp = (hyprctl hyprsunset temperature)

def main [] {
  if (($temp | into int) == 6000) {
    print '{"text": "0", "alt": "day", "tooltip": "", "class": "day"}'
  } else {
    print '{"text": "1", "alt": "night", "tooltip": "", "class": "night"}'
  }
}
