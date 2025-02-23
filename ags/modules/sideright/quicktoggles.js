const { GLib } = imports.gi;
// import { OpenEmojiPicker } from "../../apps/emoji/main.js";
// import Gio from 'gi://Gio';
// import Shell from 'gi://Shell';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Network from 'resource:///com/github/Aylur/ags/service/network.js';
const { execAsync, exec } = Utils;
import { BluetoothIndicator, NetworkIndicator } from '../.commonwidgets/statusicons.js';
import { setupCursorHover } from '../.widgetutils/cursorhover.js';
import { MaterialIcon } from '../.commonwidgets/materialicon.js';
import { sidebarOptionsStack } from './sideright.js';

export const ToggleIconWifi = (props = {}) => Widget.Button({
    className: 'txt-small sidebar-iconbutton',
    tooltipText: 'Wifi | Right-click to configure',
    onClicked: () => Network.toggleWifi(),
    onSecondaryClick: () => {
        sidebarOptionsStack.focusName('Wifi networks')
    },
    child: NetworkIndicator(),
    setup: (self) => {
        setupCursorHover(self);
        self.hook(Network, button => {
            button.toggleClassName('sidebar-button-active', [Network.wifi?.internet, Network.wired?.internet].includes('connected'))
            button.tooltipText = (`${Network.wifi?.ssid} | Right-click to configure` || 'Unknown');
        });
    },
    ...props,
});

export const ToggleIconBluetooth = (props = {}) => Widget.Button({
    className: 'txt-small sidebar-iconbutton',
    tooltipText: 'Bluetooth | Right-click to configure',
    onClicked: () => {
        const status = Bluetooth?.enabled;
        if (status)
            exec('rfkill block bluetooth');
        else
            exec('rfkill unblock bluetooth');
    },
    onSecondaryClickRelease: () => {
        sidebarOptionsStack.focusName('Bluetooth')
        // execAsync(['bash', '-c', `${userOptions.apps.bluetooth}`]).catch(print);
        // closeEverything();
    },
    child: BluetoothIndicator(),
    setup: (self) => {
        setupCursorHover(self);
        self.hook(Bluetooth, button => {
            button.toggleClassName('sidebar-button-active', Bluetooth?.enabled)
        });
    },
    ...props,
});

export const ToggleIconConservation = (props = {}) => Widget.Button({
    attribute: {
        enabled: false,
    },
    className: 'txt-small sidebar-iconbutton',
    tooltipText: 'Conservation Mode',
    onClicked: (self) => {
        // function _auto_dev_discovery(search_path){
        //         let mod_path = Gio.file_new_for_path(search_path);
        //
        //         let walker = mod_path.enumerate_children(
        //             'standard::name',
        //             Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS,
        //             null);
        //
        //         let child = null;
        //         let found = null;
        //         while ((child = walker.next_file(null))) {
        //             if (child.get_is_symlink() && child.get_name().startsWith('VPC2004')) {
        //                 // ideapad_device_ids[] from the kernel module ideapad_acpi.c
        //                 found = _auto_dev_discovery(`${search_path}/${child.get_name()}`);
        //             } else if (child.get_name() == 'conservation_mode') {
        //                 found = `${search_path}/${child.get_name()}`;
        //             }
        //             // Stop as soon as the device is found.
        //             if (found !== null) break;
        //         }
        //
        //         return found;
        //     }
        // const sysfs_path = '/sys/bus/platform/drivers/ideapad_acpi';
        const sys_conservation = '/sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode';
        self.attribute.enabled = !self.attribute.enabled;
        self.toggleClassName('sidebar-button-active', self.attribute.enabled);
        let state = self.attribute.enabled ? '1' : '0';
        Utils.exec(`/bin/sh -c 'echo ${state} | sudo tee ${sys_conservation} >/dev/null'`);
    },
    child: MaterialIcon('energy_savings_leaf', 'norm'),
    setup: (self) => {
                setupCursorHover(self);
                const sys_conservation = '/sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode';
                self.attribute.enabled = Utils.readFile(sys_conservation) == true;
                self.toggleClassName('sidebar-button-active', self.attribute.enabled);
            },

    ...props,
});

export const HyprToggleIcon = async (icon, name, hyprlandConfigValue, props = {}) => {
    try {
        return Widget.Button({
            className: 'txt-small sidebar-iconbutton',
            tooltipText: `${name}`,
            onClicked: (button) => {
                // Set the value to 1 - value
                Utils.execAsync(`hyprctl -j getoption ${hyprlandConfigValue}`).then((result) => {
                    const currentOption = JSON.parse(result).int;
                    execAsync(['bash', '-c', `hyprctl keyword ${hyprlandConfigValue} ${1 - currentOption} &`]).catch(print);
                    button.toggleClassName('sidebar-button-active', currentOption == 0);
                }).catch(print);
            },
            child: MaterialIcon(icon, 'norm', { hpack: 'center' }),
            setup: button => {
                button.toggleClassName('sidebar-button-active', JSON.parse(Utils.exec(`hyprctl -j getoption ${hyprlandConfigValue}`)).int == 1);
                setupCursorHover(button);
            },
            ...props,
        })
    } catch {
        return null;
    }
}
//
// export const TouchpadToggle = (props = {}) => Widget.Button({
//     attribute: {
//         enabled: false,
//     },
//     className: 'txt-small sidebar-iconbutton',
//     tooltipText: 'Disable Touchpad',
//     onClicked: (self) => {
//         self.attribute.enabled = !self.attribute.enabled;
//         self.toggleClassName('sidebar-button-active', self.attribute.enabled);
//         if (self.attribute.enabled) Utils.execAsync("hyprctl -r keyword '$LAPTOP_TP_ENABLED' true");
//         else Utils.execAsync("hyprctl -r keyword '$LAPTOP_TP_ENABLED' false");
//     },
//     child: MaterialIcon('touchpad_mouse', 'norm'),
//     setup: (self) => {
//         setupCursorHover(self);
//         self.attribute.enabled = !self.attribute.enabled;
//         self.toggleClassName('sidebar-button-active', self.attribute.enabled);
//     },
//     ...props,
// });

//
export const ModuleNightLight = (props = {}) => Widget.Button({
    attribute: {
        enabled: false,
    },
    className: 'txt-small sidebar-iconbutton',
    tooltipText: 'Night Light',
    onClicked: (self) => {
        self.attribute.enabled = !self.attribute.enabled;
        self.toggleClassName('sidebar-button-active', self.attribute.enabled);
        if (self.attribute.enabled) Utils.execAsync('wlsunset -l 35.88 -L 2.75');
        else Utils.execAsync('killall wlsunset');
    },
    child: MaterialIcon('nightlight', 'norm'),
    setup: (self) => {
        setupCursorHover(self);
        self.attribute.enabled = exec('pgrep wlsunset');
        self.toggleClassName('sidebar-button-active', self.attribute.enabled);
    },
    ...props,
});

// export const ModuleInvertColors = async (props = {}) => {
//     try {
//         const Hyprland = (await import('resource:///com/github/Aylur/ags/service/hyprland.js')).default;
//         return Widget.Button({
//             className: 'txt-small sidebar-iconbutton',
//             tooltipText: 'Color inversion',
//             onClicked: (button) => {
//                 // const shaderPath = JSON.parse(exec('hyprctl -j getoption decoration:screen_shader')).str;
//                 Hyprland.messageAsync('j/getoption decoration:screen_shader')
//                     .then((output) => {
//                         const shaderPath = JSON.parse(output)["str"].trim();
//                         if (shaderPath != "[[EMPTY]]" && shaderPath != "") {
//                             execAsync(['bash', '-c', `hyprctl keyword decoration:screen_shader '[[EMPTY]]'`]).catch(print);
//                             button.toggleClassName('sidebar-button-active', false);
//                         }
//                         else {
//                             Hyprland.messageAsync(`j/keyword decoration:screen_shader ${GLib.get_home_dir()}/.config/hypr/shaders/invert.frag`)
//                                 .catch(print);
//                             button.toggleClassName('sidebar-button-active', true);
//                         }
//                     })
//             },
//             child: MaterialIcon('invert_colors', 'norm'),
//             setup: setupCursorHover,
//             ...props,
//         })
//     } catch {
//         return null;
//     };
// }

// export const ModuleRawInput = async (props = {}) => {
//     try {
//         const Hyprland = (await import('resource:///com/github/Aylur/ags/service/hyprland.js')).default;
//         return Widget.Button({
//             className: 'txt-small sidebar-iconbutton',
//             tooltipText: 'Raw input',
//             onClicked: (button) => {
//                 Hyprland.messageAsync('j/getoption input:accel_profile')
//                     .then((output) => {
//                         const value = JSON.parse(output)["str"].trim();
//                         if (value != "[[EMPTY]]" && value != "") {
//                             execAsync(['bash', '-c', `hyprctl keyword input:accel_profile '[[EMPTY]]'`]).catch(print);
//                             button.toggleClassName('sidebar-button-active', false);
//                         }
//                         else {
//                             Hyprland.messageAsync(`j/keyword input:accel_profile flat`)
//                                 .catch(print);
//                             button.toggleClassName('sidebar-button-active', true);
//                         }
//                     })
//             },
//             child: MaterialIcon('mouse', 'norm'),
//             setup: setupCursorHover,
//             ...props,
//         })
//     } catch {
//         return null;
//     };
// }

export const ModuleIdleInhibitor = (props = {}) => Widget.Button({ // TODO: Make this work
    attribute: {
        enabled: false,
    },
    className: 'txt-small sidebar-iconbutton',
    tooltipText: 'Keep system awake',
    onClicked: (self) => {
        self.attribute.enabled = !self.attribute.enabled;
        self.toggleClassName('sidebar-button-active', self.attribute.enabled);
        if (self.attribute.enabled) 
        execAsync('vigiland');
        else Utils.execAsync('killall vigiland').catch(print);
    },
    child: MaterialIcon('coffee', 'norm'),
    setup: (self) => {
        setupCursorHover(self);
        self.attribute.enabled = exec('pgrep vigiland');
        self.toggleClassName('sidebar-button-active', self.attribute.enabled);
    },
    ...props,
});

export const ModuleEditIcon = (props = {}) => Widget.Button({ // TODO: Make this work
    ...props,
    className: 'txt-small sidebar-iconbutton',
    onClicked: () => {
        execAsync(['bash', '-c', 'XDG_CURRENT_DESKTOP="gnome" gnome-control-center', '&']);
        App.closeWindow('sideright');
    },
    child: MaterialIcon('edit', 'norm'),
    setup: button => {
        setupCursorHover(button);
    }
})

export const ModuleReloadIcon = (props = {}) => Widget.Button({
    ...props,
    className: 'txt-small sidebar-iconbutton',
    tooltipText: 'Reload Environment config',
    onClicked: () => {
        execAsync(['bash', '-c', 'hyprctl reload || swaymsg reload &']);
        App.closeWindow('sideright');
    },
    child: MaterialIcon('refresh', 'norm'),
    setup: button => {
        setupCursorHover(button);
    }
})

export const ModuleSettingsIcon = (props = {}) => Widget.Button({
    ...props,
    className: 'txt-small sidebar-iconbutton',
    tooltipText: 'Open Settings',
    onClicked: () => {
        // OpenEmojiPicker();
        execAsync(['bash', '-c', `${userOptions.apps.settings}`, '&']);
        App.closeWindow('sideright');
    },
    child: MaterialIcon('settings', 'norm'),
    setup: button => {
        setupCursorHover(button);
    }
})

export const ModulePowerIcon = (props = {}) => Widget.Button({
    ...props,
    className: 'txt-small sidebar-iconbutton',
    tooltipText: 'Session',
    onClicked: () => {
        closeEverything();
        Utils.timeout(1, () => App.openWindow('session'));
    },
    child: MaterialIcon('power_settings_new', 'norm'),
    setup: button => {
        setupCursorHover(button);
    }
})



