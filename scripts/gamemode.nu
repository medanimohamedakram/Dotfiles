#!/usr/bin/env nu

let gamemode = (hyprctl getoption animations:enabled | str contains '1')

def main [] {
  if ($gamemode) {
    hyprctl --batch "
        keyword animations:enabled 0;
        keyword decoration:shadow:enabled 0;
        keyword decoration:blur:enabled 0;
        keyword general:gaps_in 0;
        keyword general:gaps_out 0;
        keyword general:border_size 1;
        keyword decoration:rounding 0"
        exit
  } else {
    hyprctl reload
  }
}
