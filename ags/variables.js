
const { Gdk, Gtk } = imports.gi;
import App from 'resource:///com/github/Aylur/ags/app.js'
import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
// import configuration from "./services/configuration.js";
const { exec, execAsync } = Utils;

Gtk.IconTheme.get_default().append_search_path(`${App.configDir}/assets/icons`);

// Global vars for external control (through keybinds)
export const showMusicControls = Variable(false, {})
export const showColorScheme = Variable(false, {})
globalThis['openMusicControls'] = showMusicControls;
globalThis['openColorScheme'] = showColorScheme;
globalThis['mpris'] = Mpris;

// Screen size
export const SCREEN_WIDTH = Number(exec(`bash -c "xrandr --current | grep '*' | uniq | awk '{print $1}' | cut -d 'x' -f1 | head -1" | awk '{print $1}'`));
export const SCREEN_HEIGHT = Number(exec(`bash -c "xrandr --current | grep '*' | uniq | awk '{print $1}' | cut -d 'x' -f2 | head -1" | awk '{print $1}'`));

// Mode switching
export const currentShellMode = Variable('normal', {}) // normal, focus
globalThis['currentMode'] = currentShellMode;
globalThis['cycleMode'] = () => {
    if (currentShellMode.value === 'normal') {
        currentShellMode.value = 'focus';
    } else {
        currentShellMode.value = 'normal';
    }
}

// // Window controls
const range = (length, start = 1) => Array.from({ length }, (_, i) => i + start);
globalThis['toggleWindowOnAllMonitors'] = (name) => {
    range(Gdk.Display.get_default()?.get_n_monitors() || 1, 0).forEach(id => {
        App.toggleWindow(`${name}${id}`);
    });
}
globalThis['closeWindowOnAllMonitors'] = (name) => {
    range(Gdk.Display.get_default()?.get_n_monitors() || 1, 0).forEach(id => {
        App.closeWindow(`${name}${id}`);
    });
}
globalThis['openWindowOnAllMonitors'] = (name) => {
    range(Gdk.Display.get_default()?.get_n_monitors() || 1, 0).forEach(id => {
        App.openWindow(`${name}${id}`);
    });
}

globalThis['closeEverything'] = () => {
    const numMonitors = Gdk.Display.get_default()?.get_n_monitors() || 1;
    for (let i = 0; i < numMonitors; i++) {
        App.closeWindow(`cheatsheet${i}`);
        App.closeWindow(`click2close${i}`);
    }
    App.closeWindow('sideleft');
    App.closeWindow('sideright');
    App.closeWindow('overview');
    App.closeWindow('session');
};

const GLib = imports.gi.GLib;
export const theme = Variable("dark");
export const main_color = Variable("#000000");
export const current_wallpaper = Variable(`${GLib.get_home_dir()}/dotfiles/wallpapers/default.png`);
// @ts-expect-error
// export const weather = Variable({ no_data: true });
// const reload = () => {
//     if (configuration.config.weather != "" && configuration.config.weather_location_id != "")
//         Utils.execAsync(`${App.configDir}/scripts/weather.sh weather ${configuration.config.weather} ${configuration.config.weather_location_id}`)
//             .then((out) => {
//             weather.setValue(JSON.parse(out));
//         })
//             .catch(print);
// };
// Utils.interval(15000, reload);
// configuration.connect("changed", reload);
export const idle_inhibitor = Variable(false);
export const cur_uptime = Variable("error");
Utils.interval(5000, () => {
    Utils.execAsync(`${App.configDir}/scripts/system.sh --uptime`)
        .then((out) => cur_uptime.setValue(out))
        .catch(print);
});
export const night_light = Variable(false);
export const bluetooth_enabled = Variable("off", {
    poll: [1000, `${App.configDir}/scripts/bluetooth.sh --get`]
});
export const theme_settings = {
    color: Variable("none"),
    scheme: Variable("tonalSpot")
};
export const cpu_name = await Utils.execAsync(`${App.configDir}/scripts/system.sh --cpu-name`);
export const gpu_name = await Utils.execAsync(`${App.configDir}/scripts/system.sh --gpu-name`);
export const cpu_cores = await Utils.execAsync(`${App.configDir}/scripts/system.sh --cpu-cores`);
export const amount_of_ram = await Utils.execAsync(`${App.configDir}/scripts/system.sh --ram`);
export const kernel_name = await Utils.execAsync(`${App.configDir}/scripts/system.sh --kernel`);
export const hostname = await Utils.execAsync(`${App.configDir}/scripts/system.sh --hostname`);
export const current_os = await Utils.execAsync(`${App.configDir}/scripts/system.sh --os`);
export const custom_color_file = `${GLib.get_home_dir()}/dotfiles/.settings/custom-color`;
export const generation_scheme_file = `${GLib.get_home_dir()}/dotfiles/.settings/generation-scheme`;
export const color_scheme_file = `${GLib.get_home_dir()}/dotfiles/.settings/color-scheme`;
export const wallpaper_cache_file = `${GLib.get_home_dir()}/.cache/current_wallpaper`;
function readFiles() {
    Utils.readFileAsync(custom_color_file)
        .then((out) => {
        let _out = out;
        if (_out.startsWith("-")) {
            _out = _out.substring(1);
        }
        theme_settings.color.setValue(_out.trim());
    })
        .catch(print);
    Utils.readFileAsync(generation_scheme_file)
        .then((out) => {
        theme_settings.scheme.setValue(out);
    })
        .catch(print);
    Utils.readFileAsync(color_scheme_file)
        .then((out) => {
        theme.setValue(out.trim());
    })
        .catch((err) => { });
    Utils.readFileAsync(wallpaper_cache_file)
        .then((out) => {
        current_wallpaper.setValue(out.trim());
    })
        .catch((err) => {
        Utils.writeFileSync(current_wallpaper.value, wallpaper_cache_file);
    });
}
readFiles();
Utils.monitorFile(custom_color_file, () => {
    Utils.readFileAsync(custom_color_file)
        .then((out) => {
        let _out = out;
        if (_out.startsWith("-")) {
            _out = _out.substring(1);
        }
        theme_settings.color.setValue(_out.trim());
    })
        .catch((err) => { });
});
Utils.monitorFile(generation_scheme_file, () => {
    Utils.readFileAsync(generation_scheme_file)
        .then((out) => {
        theme_settings.scheme.setValue(out.trim());
    })
        .catch((err) => { });
});
Utils.monitorFile(color_scheme_file, () => {
    Utils.readFileAsync(color_scheme_file)
        .then((out) => {
        theme.setValue(out.trim());
    })
        .catch((err) => { });
});
Utils.monitorFile(wallpaper_cache_file, () => {
    Utils.readFileAsync(wallpaper_cache_file)
        .then((out) => {
        current_wallpaper.setValue(out);
    })
        .catch(print);
});

