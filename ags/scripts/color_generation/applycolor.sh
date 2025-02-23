#!/usr/bin/env bash

term_alpha=100 #Set this to < 100 make all your terminals transparent
# sleep 0 # idk i wanted some delay or colors dont get applied properly
if [ ! -d $HOME/.cache/ags/user/generated ]; then
    mkdir -p $HOME/.cache/ags/user/generated
fi
cd "$HOME/.config/ags" || exit

colornames=''
colorstrings=''
colorlist=()
colorvalues=()

# wallpath=$(swww query | head -1 | awk -F 'image: ' '{print $2}')
# wallpath_png="$HOME"'/.cache/ags/user/generated/hypr/lockscreen.png'
# convert "$wallpath" "$wallpath_png"
# wallpath_png=$(echo "$wallpath_png" | sed 's/\//\\\//g')
# wallpath_png=$(sed 's/\//\\\\\//g' <<< "$wallpath_png")

transparentize() {
  local hex="$1"
  local alpha="$2"
  local red green blue

  red=$((16#${hex:1:2}))
  green=$((16#${hex:3:2}))
  blue=$((16#${hex:5:2}))

  printf 'rgba(%d, %d, %d, %.2f)\n' "$red" "$green" "$blue" "$alpha"
}

# get_light_dark() {
#     lightdark=""
#     if [ ! -f $HOME/.cache/ags/user/colormode.txt ]; then
#         echo "" > $HOME/.cache/ags/user/colormode.txt
#     else
#         lightdark=$(sed -n '1p' $HOME/.cache/ags/user/colormode.txt)
#     fi
# }

apply_fuzzel() {
    # Check if scripts/templates/fuzzel/fuzzel.ini exists
    if [ ! -f "scripts/templates/fuzzel/fuzzel.ini" ]; then
        echo "Template file not found for Fuzzel. Skipping that."
        return
    fi
    # Copy template
    mkdir -p "$HOME"/.cache/ags/user/generated/fuzzel
    cp "scripts/templates/fuzzel/fuzzel.ini" "$HOME"/.cache/ags/user/generated/fuzzel/fuzzel.ini
    # Apply colors
    for i in "${!colorlist[@]}"; do
        sed -i "s/{{ ${colorlist[$i]} }}/${colorvalues[$i]#\#}/g" "$HOME"/.cache/ags/user/generated/fuzzel/fuzzel.ini
    done

    cp  "$HOME"/.cache/ags/user/generated/fuzzel/fuzzel.ini "$HOME"/.config/fuzzel/fuzzel.ini
}

apply_term() {
    # Check if terminal escape sequence template exists
    if [ ! -f "scripts/templates/terminal/sequences.txt" ]; then
        echo "Template file not found for Terminal. Skipping that."
        return
    fi
    # Copy template
    mkdir -p "$HOME"/.cache/ags/user/generated/terminal
    cp "scripts/templates/terminal/sequences.txt" $HOME/.cache/ags/user/generated/terminal/sequences.txt
    # Apply colors
    for i in "${!colorlist[@]}"; do
        sed -i "s/${colorlist[$i]} #/${colorvalues[$i]#\#}/g" $HOME/.cache/ags/user/generated/terminal/sequences.txt
    done

    sed -i "s/\$alpha/$term_alpha/g" $HOME/.cache/ags/user/generated/terminal/sequences.txt

    for file in /dev/pts/*; do
      if [[ $file =~ ^/dev/pts/[0-9]+$ ]]; then
        cat "$HOME"/.cache/ags/user/generated/terminal/sequences.txt > "$file"
      fi
    done
}

apply_hyprland() {
        cp $HOME/.cache/ags/user/generated/hypr/hyprland/colors.conf $HOME/.config/hypr/hyprland/colors.conf
}

apply_hyprlock() {
        cp "$HOME"/.cache/ags/user/generated/hypr/hyprlock.conf "$HOME"/.config/hypr/hyprlock.conf
}


apply_ags() {
    sass "$HOME"/.config/ags/scss/main.scss "$HOME"/.cache/ags/user/generated/style.css
    ags run-js 'openColorScheme.value = true; Utils.timeout(2000, () => openColorScheme.value = false);'
    ags run-js "App.resetCss(); App.applyCss('${HOME}/.cache/ags/user/generated/style.css');"
}

apply_gtk() { # Using gradience-cli
    lightdark=$(sed -n '1p' $HOME/.cache/ags/user/colormode.txt)
    # Set light/dark preference
    # And set GTK theme manually as Gradience defaults to light adw-gtk3
    # (which is unreadable when broken when you use dark mode)
    if [ "$lightdark" = "light" ]; then
        gsettings set org.gnome.desktop.interface gtk-theme 'adw-gtk3'
      echo 'sucess light'
        gsettings set org.gnome.desktop.interface color-scheme 'prefer-light'
        gsettings set org.gnome.desktop.interface cursor-theme 'Bibata-Modern-Classic'
        hyprctl setcursor Bibata-Modern-Classic 24
    else
        gsettings set org.gnome.desktop.interface gtk-theme 'adw-gtk3-dark'
        gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark'
        gsettings set org.gnome.desktop.interface cursor-theme 'Bibata-Modern-Ice'
      echo 'sucess dark'
        hyprctl setcursor Bibata-Modern-Ice 24
    fi
}

apply_term() {  
    lightdark=$(sed -n '1p' $HOME/.cache/ags/user/colormode.txt)
    # Set light/dark preference
    # And set GTK theme manually as Gradience defaults to light adw-gtk3
    # (which is unreadable when broken when you use dark mode)
    if [ "$lightdark" = "light" ]; then
        sed -i 's/Dark/Light/g' ~/.wezterm.lua
        sed -i 's/dark/light/g' ~/.config/zed/settings.json
    else
        sed -i 's/Light/Dark/g' ~/.wezterm.lua 
        sed -i 's/light/dark/g' ~/.config/zed/settings.json
    fi
}

 
apply_ags &
apply_hyprland &
apply_hyprlock &
apply_fuzzel &
apply_gtk &
apply_term &





