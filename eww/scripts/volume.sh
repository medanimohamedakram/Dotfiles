#!/bin/bash
 

wpctl get-volume @DEFAULT_AUDIO_SINK@ | rg -o MUTED || wpctl get-volume @DEFAULT_AUDIO_SINK@ | rg -o "[+-]?([0-9]*[.])?[0-9]+" | awk '{ print $0 * 100 }'

pactl subscribe | rg --line-buffered "on sink" | while read -r _; do
wpctl get-volume @DEFAULT_AUDIO_SINK@ | rg -o MUTED || wpctl get-volume @DEFAULT_AUDIO_SINK@ | rg -o "[+-]?([0-9]*[.])?[0-9]+" | awk '{ print $0 * 100 }'
done
