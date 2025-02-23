const { GLib } = imports.gi;
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
const { Box, Button, EventBox, Label, Overlay, Revealer, Scrollable } = Widget;
const { execAsync, exec } = Utils;
import { AnimatedCircProg } from "../../.commonwidgets/cairo_circularprogress.js";
import { MaterialIcon } from '../../.commonwidgets/materialicon.js';
import { WWO_CODE, WEATHER_SYMBOL, NIGHT_WEATHER_SYMBOL } from '../../.commondata/weather.js';



const CUSTOM_MODULE_CONTENT_INTERVAL_FILE = `${GLib.get_home_dir()}/.cache/ags/user/scripts/custom-module-interval.txt`;
const CUSTOM_MODULE_CONTENT_SCRIPT = `${GLib.get_home_dir()}/.cache/ags/user/scripts/custom-module-poll.sh`;
const CUSTOM_MODULE_LEFTCLICK_SCRIPT = `${GLib.get_home_dir()}/.cache/ags/user/scripts/custom-module-leftclick.sh`;
const CUSTOM_MODULE_RIGHTCLICK_SCRIPT = `${GLib.get_home_dir()}/.cache/ags/user/scripts/custom-module-rightclick.sh`;
const CUSTOM_MODULE_MIDDLECLICK_SCRIPT = `${GLib.get_home_dir()}/.cache/ags/user/scripts/custom-module-middleclick.sh`;
const CUSTOM_MODULE_SCROLLUP_SCRIPT = `${GLib.get_home_dir()}/.cache/ags/user/scripts/custom-module-scrollup.sh`;
const CUSTOM_MODULE_SCROLLDOWN_SCRIPT = `${GLib.get_home_dir()}/.cache/ags/user/scripts/custom-module-scrolldown.sh`;



const BarGroup = ({ child }) => Box({
    className: 'bar-group-margin bar-sides',
    children: [
        Box({
            className: 'bar-group bar-group-standalone bar-group-pad-system',
            children: [child],
        }),
    ]
});

const BarResource = (name, icon, command, circprogClassName = 'bar-batt-circprog', textClassName = 'txt-onSurfaceVariant', iconClassName = 'bar-batt') => {
    const resourceCircProg = AnimatedCircProg({
        className: `${circprogClassName}`,
        vpack: 'center',
        hpack: 'center',
    });
    const resourceProgress = Box({
        homogeneous: true,
        children: [Overlay({
            child: Box({
                vpack: 'center',
                className: `${iconClassName}`,
                homogeneous: true,
                children: [
                    MaterialIcon(icon, 'small'),
                ],
            }),
            overlays: [resourceCircProg]
        })]
    });
    const resourceLabel = Label({
        className: `txt-smallie ${textClassName}`,
    });
    const widget = Button({
        onClicked: () => Utils.execAsync(['bash', '-c', `${userOptions.apps.taskManager}`]).catch(print),
        child: Box({
            className: `spacing-h-4 ${textClassName}`,
            children: [
                resourceProgress,
                resourceLabel,
            ],
            setup: (self) => self
                .poll(5000, () => execAsync(['bash', '-c', command])
                    .then((output) => {
                        resourceCircProg.css = `font-size: ${Number(output)}px;`;
                        resourceLabel.label = `${Math.round(Number(output))}%`;
                        widget.tooltipText = `${name}: ${Math.round(Number(output))}%`;
                    }).catch(print))
            ,
        })
    });
    return widget;
}
const TempResource = (name, icon, command, circprogClassName = 'bar-batt-circprog', textClassName = 'txt-onSurfaceVariant', iconClassName = 'bar-batt') => {
    const resourceCircProg = AnimatedCircProg({
        className: `${circprogClassName}`,
        vpack: 'center',
        hpack: 'center',
    });
    const resourceProgress = Box({
        homogeneous: true,
        children: [Overlay({
            child: Box({
                vpack: 'center',
                className: `${iconClassName}`,
                homogeneous: true,
                children: [
                    MaterialIcon(icon, 'small'),
                ],
            }),
            overlays: [resourceCircProg]
        })]
    });
    const resourceLabel = Label({
        className: `txt-smallie ${textClassName}`,
    });
    const widget = Button({
        onClicked: () => Utils.execAsync(['bash', '-c', `${userOptions.apps.taskManager}`]).catch(print),
        child: Box({
            className: `spacing-h-4 ${textClassName}`,
            children: [
                resourceProgress,
                resourceLabel,
            ],
            setup: (self) => self
                .poll(5000, () => execAsync('bash -c "LANG=C sensors k10temp-pci-00c3 | grep -oe \'+[[:digit:]]\+\'"')

                    .then((output) => {
                        resourceCircProg.css = `font-size: ${Number(output)}px;`;
                        resourceLabel.label = `${Math.round(Number(output))}%`;
                        widget.tooltipText = `${name}: ${Math.round(Number(output))}%`;
                    }).catch(print))
            ,
        })
    });
    return widget;
}

const switchToRelativeWorkspace = async (self, num) => {
    try {
        const Hyprland = (await import('resource:///com/github/Aylur/ags/service/hyprland.js')).default;
        Hyprland.messageAsync(`dispatch workspace ${num > 0 ? '+' : ''}${num}`).catch(print);
    } catch {
        execAsync([`${App.configDir}/scripts/sway/swayToRelativeWs.sh`, `${num}`]).catch(print);
    }
}
const SystemResourcesOrCustomModule = () => {
        // Check if ~/.cache/ags/user/scripts/custom-module-poll.sh exists
        if (GLib.file_test(CUSTOM_MODULE_CONTENT_SCRIPT, GLib.FileTest.EXISTS)) {
            const interval = Number(Utils.readFile(CUSTOM_MODULE_CONTENT_INTERVAL_FILE)) || 5000;
            return BarGroup({
                child: Button({
                    child: Label({
                        className: 'txt-smallie txt-onSurfaceVariant',
                        useMarkup: true,
                        setup: (self) => Utils.timeout(1, () => {
                            self.label = exec(CUSTOM_MODULE_CONTENT_SCRIPT);
                            self.poll(interval, (self) => {
                                const content = exec(CUSTOM_MODULE_CONTENT_SCRIPT);
                                self.label = content;
                            })
                        })
                    }),
                    onPrimaryClickRelease: () => execAsync(CUSTOM_MODULE_LEFTCLICK_SCRIPT).catch(print),
                    onSecondaryClickRelease: () => execAsync(CUSTOM_MODULE_RIGHTCLICK_SCRIPT).catch(print),
                    onMiddleClickRelease: () => execAsync(CUSTOM_MODULE_MIDDLECLICK_SCRIPT).catch(print),
                    onScrollUp: () => execAsync(CUSTOM_MODULE_SCROLLUP_SCRIPT).catch(print),
                    onScrollDown: () => execAsync(CUSTOM_MODULE_SCROLLDOWN_SCRIPT).catch(print),
                })
            });
        } else return BarGroup({
            child: Box({
                children: [
                    Revealer({
                        revealChild: true,
                        transition: 'crossfade',
                        transitionDuration: userOptions.animations.durationLarge,
                        child: Box({
                            className: 'spacing-h-10 margin-right-5',
                            children: [
                                BarResource('RAM Usage', 'memory_alt', `LANG=C free | awk '/^Mem/ {printf("%.2f\\n", ($3/$2) * 100)}'`,
                                    'bar-ram-circprog', 'bar-ram-txt', 'bar-ram-icon'),
                                TempResource('Temperature', 'thermostat', `LANG=C sensors k10temp-pci-00c3 | grep -oe '+[[:digit:]]\+'| awk '{print $2)}'`,
                                    'bar-swap-circprog', 'bar-swap-txt', 'bar-swap-icon'),
                                BarResource('CPU Usage', 'memory', `LANG=C top -bn1 | grep Cpu | sed 's/\\,/\\./g' | awk '{print $2}'`,
                                    'bar-cpu-circprog', 'bar-cpu-txt', 'bar-cpu-icon'),
                            ]
                        })
                        
                    })
                ],
            })
        });
    }


export default () => {
        return EventBox({
        onScrollUp: (self) => switchToRelativeWorkspace(self, -1),
        onScrollDown: (self) => switchToRelativeWorkspace(self, +1),
        child: Box({
            className: 'spacing-h-5',
            children: [

 // BarGroup({
 //            child: Box({
 //                hexpand: true,
 //                hpack: 'center',
 //                className: 'spacing-h-4 txt-onSurfaceVariant',
 //                children: [
 //                    MaterialIcon('device_thermostat', 'small'),
 //                    Label({
 //                        label: 'Weather',
 //                    })
 //                ],
 //                setup: (self) => self.poll(900000, async (self) => {
 //                    const WEATHER_CACHE_PATH = WEATHER_CACHE_FOLDER + '/wttr.in.txt';
 //                    const updateWeatherForCity = (city) => execAsync(`curl https://wttr.in/${city.replace(/ /g, '%20')}?format=j1`)
 //                        .then(output => {
 //                            const weather = JSON.parse(output);
 //                            Utils.writeFile(JSON.stringify(weather), WEATHER_CACHE_PATH)
 //                                .catch(print);
 //                            const weatherCode = weather.current_condition[0].weatherCode;
 //                            const weatherDesc = weather.current_condition[0].weatherDesc[0].value;
 //                            const temperature = weather.current_condition[0].temp_C;
 //                            const feelsLike = weather.current_condition[0].FeelsLikeC;
 //                            const weatherSymbol = WEATHER_SYMBOL[WWO_CODE[weatherCode]];
 //                            self.children[0].label = weatherSymbol;
 //                            self.children[1].label = `${temperature}℃ • Feels like ${feelsLike}℃`;
 //                            self.tooltipText = weatherDesc;
 //                        }).catch((err) => {
 //                           try { // Read from cache
 //                                const weather = JSON.parse(
 //                                    Utils.readFile(WEATHER_CACHE_PATH)
 //                                );
 //                                const weatherCode = weather.current_condition[0].weatherCode;
 //                                const weatherDesc = weather.current_condition[0].weatherDesc[0].value;
 //                                const temperature = weather.current_condition[0].temp_C;
 //                                const feelsLike = weather.current_condition[0].FeelsLikeC;
 //                                const weatherSymbol = WEATHER_SYMBOL[WWO_CODE[weatherCode]];
 //                                self.children[0].label = weatherSymbol;
 //                                self.children[1].label = `${temperature}℃ • Feels like ${feelsLike}℃`;
 //                                self.tooltipText = weatherDesc;
 //                            } catch (err) {
 //                                print(err);
 //                            }
 //                        });
 //                    if (userOptions.weather.city != '' && userOptions.weather.city != null) {
 //                        updateWeatherForCity(userOptions.weather.city.replace(/ /g, '%20'));
 //                    }
 //                    else {
 //                        Utils.execAsync('curl ipinfo.io')
 //                            .then(output => {
 //                                return JSON.parse(output)['city'].toLowerCase();
 //                            })
 //                            .then(updateWeatherForCity)
 //                            .catch(print)
 //                    }
 //                }),
 //            })
 //        }),
                  SystemResourcesOrCustomModule(),
                    ]
        })
    });
}
