#!/usr/bin/env bash

# check if no arguments
if [ $# -eq 0 ]; then
    echo "Usage: colorgen.sh /path/to/image (--apply)"
    exit 1
fi

colormodefile="$HOME/.cache/ags/user/colormode.txt"
lightdark="dark"
transparency="opaque"
materialscheme="scheme-content"
# terminalscheme="$HOME/.config/ags/scripts/templates/terminal/scheme-base.json"
# material_colors="$HOME/.cache/ags/user/generated/material_colors.scss"

if [ ! -f $colormodefile ]; then
    echo "dark" > $colormodefile
    echo "opaque" >> $colormodefile
    echo "scheme-content" >> $colormodefile
elif [[ $(wc -l < $colormodefile) -ne 3 || $(wc -w < $colormodefile) -ne 3 ]]; then
    echo "dark" > $colormodefile
    echo "opaque" >> $colormodefile
    echo "scheme-content" >> $colormodefile
else
    lightdark=$(sed -n '1p' $colormodefile)
    transparency=$(sed -n '2p' $colormodefile)
    materialscheme=$(sed -n '3p' $colormodefile)
    if [ "$materialscheme" = "monochrome" ]; then
      terminalscheme="$HOME/.config/ags/scripts/templates/terminal/scheme-monochrome.json"
    fi
fi


cd $HOME/.config/ags/scripts/
if [[ "$1" = "#"* ]]; then # this is a color
    matugen color hex "$1" \
    --mode "$lightdark" --type "$materialscheme"
    
    if [ "$2" = "--apply" ]; then
        cp "$HOME"/.cache/ags/user/generated/material_colors.scss "$HOME/.config/ags/scss/_material.scss"
        color_generation/applycolor.sh
    fi
  else  
     matugen image "$1" \
    --mode "$lightdark" --type "$materialscheme"

    if [ "$lightdark" = "light" ]; then
      sed -i "s/<darkmode>/\$darkmode: False;/" $HOME/.cache/ags/user/generated/material_colors.scss
    else
      sed -i "s/<darkmode>/\$darkmode: True;/" $HOME/.cache/ags/user/generated/material_colors.scss

    fi

    if [ "$transparency" = "opaque" ]; then
        sed -i "s/<transparent>/\$transparent: False;/" $HOME/.cache/ags/user/generated/material_colors.scss
    else
        sed -i "s/<transparent>/\$transparent: True;/" $HOME/.cache/ags/user/generated/material_colors.scss
    fi

    if [ "$2" = "--apply" ]; then
        cp "$HOME"/.cache/ags/user/generated/material_colors.scss "$HOME/.config/ags/scss/_material.scss"
        color_generation/applycolor.sh
    fi
fi
