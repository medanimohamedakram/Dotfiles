#!/bin/sh

state="$(gsettings get org.gnome.desktop.peripherals.touchpad send-events)"
if [[ "$state" == "'disabled'" ]]; then
  gsettings set org.gnome.desktop.peripherals.touchpad send-events enabled
else 
  gsettings set org.gnome.desktop.peripherals.touchpad send-events disabled
fi
