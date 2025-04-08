-- Pull in the wezterm API
local wezterm = require 'wezterm'

-- This table will hold the configuration.
local config = {}

-- In newer versions of wezterm, use the config_builder which will
-- help provide clearer error messages
if wezterm.config_builder then
  config = wezterm.config_builder()
end

-- This is where you actually apply your config choices

-- For example, changing the color scheme:
config.color_scheme = 'Edge Dark (base16)'
config.window_decorations = "NONE"
config.default_cursor_style = 'SteadyUnderline'
config.hide_tab_bar_if_only_one_tab = true
config.initial_cols = 100
config.initial_rows = 30
config.hide_mouse_cursor_when_typing = false
config.window_close_confirmation = 'NeverPrompt'
config.enable_wayland = true
config.font = wezterm.font('CaskaydiaCove Nerd Font')
-- config.harfbuzz_features = { 'zero', 'cv17', 'ss05', 'ss03', 'cv16', 'cv31', 'cv30', 'ss09', 'cv25', 'cv26', 'cv32', 'cv27', 'cv28', 'ss06', 'ss07', }


-- and finally, return the configuration to wezterm
return config

