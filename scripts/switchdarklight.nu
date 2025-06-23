#!/usr/bin/env nu

use ~/.config/nushell/bareeq.nu *

let image = (swww query | str replace "image: " "\nimage: " | lines | last | parse "image: {image}" | get image)
let is_dark = (gsettings get org.gnome.desktop.interface color-scheme | str contains "dark")

def main [] {
  if ($is_dark) {
    matugen image ...$image --mode light
    gsettings set org.gnome.desktop.interface color-scheme prefer-light
    gsettings set org.gnome.desktop.interface gtk-theme adw-gtk3
    gsettings set org.gnome.desktop.interface icon-theme Papirus-Light
    # gsettings set org.gnome.desktop.interface cursor-theme Bibata-Modern-Classic
    # hyprctl setcursor Bibata-Modern-Classic 24 | ignore
    # "exec-once = hyprctl setcursor Bibata-Modern-Classic 24" | save -a $"($env.XDG_CACHE_HOME)/colors/hyprland/colors.conf" 
  } else {
    matugen image ...$image  --mode dark
    gsettings set org.gnome.desktop.interface color-scheme prefer-dark
    gsettings set org.gnome.desktop.interface gtk-theme adw-gtk3-dark
    gsettings set org.gnome.desktop.interface icon-theme Papirus-Dark
    # gsettings set org.gnome.desktop.interface cursor-theme Bibata-Modern-Ice
    # hyprctl setcursor Bibata-Modern-Ice 24 | ignore
    # "exec-once = hyprctl setcursor Bibata-Modern-Ice 24" | save -a $"($env.XDG_CACHE_HOME)/colors/hyprland/colors.conf" 
  }
  swaync-client --reload-css -sw
  switch-shell-theme | ignore
  do -i { pkill -USR2 btop }
  do -i { pkill -USR1 helix }
  do -i { pkill -USR2 sherlock }
}
