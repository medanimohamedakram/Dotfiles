#!/bin/bash

no_error() {
    pkill checkvolume.sh
    ~/.config/eww/scripts/checkvolume.sh &
}

error() {
    ~/.config/eww/scripts/checkvolume.sh &
}

no_error || error


case $1 in
--up)
  wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+
  ;;
--down)
  wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-
  ;;
--toggle)
  wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle
  ;;
esac
