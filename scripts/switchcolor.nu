#!/usr/bin/env nu

let color = (hyprpicker -n)
let is_light = (gsettings get org.gnome.desktop.interface color-scheme | str contains "light")

def main [] {
  if ($is_light) {
    matugen color hex $color --mode light
    gsettings set org.gnome.desktop.interface gtk-theme ''
    gsettings set org.gnome.desktop.interface gtk-theme adw-gtk3
    # "exec-once = hyprctl setcursor Bibata-Modern-Classic 24" | save -a $"($env.XDG_CACHE_HOME)/colors/hyprland/colors.conf" 
  } else {
    matugen color hex $color --mode dark
    gsettings set org.gnome.desktop.interface gtk-theme ''
    gsettings set org.gnome.desktop.interface gtk-theme adw-gtk3-dark
    # "exec-once = hyprctl setcursor Bibata-Modern-Ice 24" | save -a $"($env.XDG_CACHE_HOME)/colors/hyprland/colors.conf" 
  }
  swaync-client --reload-css -sw
  sh $"($env.HOME)/.local/bin/shell-colors"
  killall -SIGUSR1 helix
}
