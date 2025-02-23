var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ConfigService_instances, _a, _ConfigService_config, _ConfigService_config_file, _ConfigService_onChange;
const { GLib } = imports.gi;
export const default_config = {
    always_show_battery: false,
    show_taskbar: true,
    show_battery_percent: true,
    weather: "",
    weather_location_id: ""
};
Utils.exec(["mkdir", "-p", `${GLib.get_home_dir()}/.config/ags_config/`]);
const config_file = `${GLib.get_home_dir()}/.config/ags_config/conf.json`;
if (Utils.readFile(config_file).length < 2) {
    Utils.writeFileSync(JSON.stringify(default_config), config_file);
}
class ConfigService extends Service {
    get config() {
        return __classPrivateFieldGet(this, _ConfigService_config, "f");
    }
    set config(conf) {
        Utils.writeFile(JSON.stringify(conf), __classPrivateFieldGet(this, _ConfigService_config_file, "f")).catch(print);
    }
    set_value(key, value) {
        this.config = Object.assign(Object.assign({}, this.config), { [key]: value });
    }
    constructor() {
        super();
        _ConfigService_instances.add(this);
        _ConfigService_config.set(this, default_config);
        _ConfigService_config_file.set(this, config_file);
        const config_file = __classPrivateFieldGet(this, _ConfigService_config_file, "f");
        Utils.monitorFile(config_file, () => __classPrivateFieldGet(this, _ConfigService_instances, "m", _ConfigService_onChange).call(this));
        __classPrivateFieldGet(this, _ConfigService_instances, "m", _ConfigService_onChange).call(this);
    }
    connect(event = "config-changed", callback) {
        return super.connect(event, callback);
    }
}
_a = ConfigService, _ConfigService_config = new WeakMap(), _ConfigService_config_file = new WeakMap(), _ConfigService_instances = new WeakSet(), _ConfigService_onChange = function _ConfigService_onChange() {
    Utils.readFileAsync(__classPrivateFieldGet(this, _ConfigService_config_file, "f")).then((out) => {
        __classPrivateFieldSet(this, _ConfigService_config, Object.assign(Object.assign({}, default_config), JSON.parse(out)), "f");
        this.emit("changed");
        this.notify("config");
        this.emit("config-changed", __classPrivateFieldGet(this, _ConfigService_config, "f"));
    });
};
(() => {
    Service.register(_a, {
        "config-changed": ["jsobject"]
    }, {
        config: ["jsobject", "rw"]
    });
})();
const service = new ConfigService();
export default service;

