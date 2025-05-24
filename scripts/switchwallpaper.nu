#!/usr/bin/env nu

let wallpaper_folder = "/usr/share/wallpapers/" #choose wallpaper folder; and don't remove the trailing slash
let image = (zenity --width 1200 --height 800 --file-selection --title="Choose a Wallpaper" --filename $wallpaper_folder)
let is_light = (gsettings get org.gnome.desktop.interface color-scheme | str contains "light")

def main [] {
  if ($is_light) {
    matugen image $image --mode light
    gsettings set org.gnome.desktop.interface gtk-theme ''
    gsettings set org.gnome.desktop.interface gtk-theme adw-gtk3
    # "exec-once = hyprctl setcursor Bibata-Modern-Classic 24" | save -a $"($env.XDG_CACHE_HOME)/colors/hyprland/colors.conf" 
    open /etc/greetd/regreet.toml | upsert background.path $"($image)" | save -f /etc/greetd/regreet.toml
  } else {
    matugen image $image  --mode dark
    gsettings set org.gnome.desktop.interface gtk-theme ''
    gsettings set org.gnome.desktop.interface gtk-theme adw-gtk3-dark
    # "exec-once = hyprctl setcursor Bibata-Modern-Ice 24" | save -a $"($env.XDG_CACHE_HOME)/colors/hyprland/colors.conf" 
    open /etc/greetd/regreet.toml | upsert background.path $"($image)" | save -f /etc/greetd/regreet.toml
  }
  swaync-client --reload-css -sw
  sh $"($env.HOME)/.local/bin/shell-colors"
  killall -SIGUSR2 btop and killall -SIGUSR1 helix
}
