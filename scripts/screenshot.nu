#!/usr/bin/env nu

let now = (^date +'%d-%m-%Y::%T')
# let area = (slurp $SLURP_ARGS)

def main [] {
  grim -t jpeg -q 100 -g $"(slurp)" $"Pictures/Screenshots/ScreenshotFrom(($now)).jpeg"
  match (notify-send -a Screenshot -A "open=Open Image" -i $"($env.HOME)/Pictures/Screenshots/ScreenshotFrom(($now)).jpeg" "Screenshot" $"Saved at ~/Pictures/Screenshots/ScreenshotFrom(($now)).jpeg") {
    "open" => {
      xdg-open $"($env.HOME)/Pictures/Screenshots/ScreenshotFrom(($now)).jpeg"
      },
    _ => exit
  }
}
