#!/usr/bin/env nu

use ~/.config/nushell/bareeq.nu *

let wallpaper_folder = "/usr/share/wallpapers/" #choose wallpaper folder; and don't remove the trailing slash
let image_name = (sh -c $'for a in ($wallpaper_folder)*; do printf "img:%s\n" "$a"; done | wofi -dmenu -W 90% -w 6 -L 2 -D image_size=264 -D hide_search=true -D orientation=horizontal -I -s wall.css')
let image = $image_name | parse "img:{image}" | get image
let is_light = (gsettings get org.gnome.desktop.interface color-scheme | str contains "light")

def main [] {
  if ($is_light) {
    matugen image ...$image --mode light
    gsettings set org.gnome.desktop.interface gtk-theme ''
    gsettings set org.gnome.desktop.interface gtk-theme adw-gtk3
    # "exec-once = hyprctl setcursor Bibata-Modern-Classic 24" | save -a $"($env.XDG_CACHE_HOME)/colors/hyprland/colors.conf" 
  } else {
    matugen image ...$image  --mode dark
    gsettings set org.gnome.desktop.interface gtk-theme ''
    gsettings set org.gnome.desktop.interface gtk-theme adw-gtk3-dark
    # "exec-once = hyprctl setcursor Bibata-Modern-Ice 24" | save -a $"($env.XDG_CACHE_HOME)/colors/hyprland/colors.conf" 
  }
  open /etc/greetd/regreet.toml | upsert background.path $"($image)" | save -f /etc/greetd/regreet.toml
  swaync-client --reload-css -sw
  switch-shell-theme | ignore
  do -i { pkill -USR2 btop }
  do -i { pkill -USR1 helix }
}
