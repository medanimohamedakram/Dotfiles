#!/usr/bin/env nu

# for a in *; do echo -en "$a\0icon\x1f$a\n" ; done | rofi -dmenu -show-icons -theme selector ## this is for choosing images instead of zenity just switch to nu script not bash
let wallpaper_folder = "/usr/share/wallpapers/" #choose wallpaper folder; and don't remove the trailing slash
let image = (zenity --width 1200 --height 800 --file-selection --title="Choose a Wallpaper" --filename $wallpaper_folder)
let is_light = (gsettings get org.gnome.desktop.interface color-scheme | str contains "light")

def main [] {
  if ($is_light) {
    matugen image $image --mode light
    gsettings set org.gnome.desktop.interface gtk-theme ''
    gsettings set org.gnome.desktop.interface gtk-theme adw-gtk3
    # "exec-once = hyprctl setcursor Bibata-Modern-Classic 24" | save -a $"($env.XDG_CACHE_HOME)/colors/hyprland/colors.conf" 
  } else {
    matugen image $image  --mode dark
    gsettings set org.gnome.desktop.interface gtk-theme ''
    gsettings set org.gnome.desktop.interface gtk-theme adw-gtk3-dark
    # "exec-once = hyprctl setcursor Bibata-Modern-Ice 24" | save -a $"($env.XDG_CACHE_HOME)/colors/hyprland/colors.conf" 
  }
  open /etc/greetd/regreet.toml | upsert background.path $"($image)" | save -f /etc/greetd/regreet.toml
  swaync-client --reload-css -sw
  sh $"($env.HOME)/.local/bin/shell-colors"
  do -i { pkill -USR2 btop }
  do -i { pkill -USR1 helix }
  do -i {
    magick $image -strip -resize 120% -gravity center -extent 800 -quality 100 $"($env.XDG_CACHE_HOME)/wall/wall.quad"
    magick $image -strip -resize 1000 -gravity center -extent 1000 -quality 100 $"($env.XDG_CACHE_HOME)/wall/wall.thmb"
    magick $image -strip -thumbnail 500x500^ -gravity center -extent 500x500 $"($env.XDG_CACHE_HOME)/wall/wall.sqre"
    magick $image -strip -scale 10% -blur 0x3 -resize 100% $"($env.XDG_CACHE_HOME)/wall/wall.blur"
  }
}
