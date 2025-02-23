"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default_config = void 0;
var GLib = imports.gi.GLib;
exports.default_config = {
    always_show_battery: false,
    show_taskbar: true,
    show_battery_percent: true,
    weather: "",
    weather_location_id: ""
};
Utils.exec(["mkdir", "-p", "".concat(GLib.get_home_dir(), "/.config/ags_config/")]);
var config_file = "".concat(GLib.get_home_dir(), "/.config/ags_config/conf.json");
if (Utils.readFile(config_file).length < 2) {
    Utils.writeFileSync(JSON.stringify(exports.default_config), config_file);
}
var ConfigService = /** @class */ (function (_super) {
    __extends(ConfigService, _super);
    function ConfigService() {
        var _this = _super.call(this) || this;
        _ConfigService_instances.add(_this);
        _ConfigService_config.set(_this, exports.default_config);
        _ConfigService_config_file.set(_this, config_file);
        var config_file = __classPrivateFieldGet(_this, _ConfigService_config_file, "f");
        Utils.monitorFile(config_file, function () { return __classPrivateFieldGet(_this, _ConfigService_instances, "m", _ConfigService_onChange).call(_this); });
        __classPrivateFieldGet(_this, _ConfigService_instances, "m", _ConfigService_onChange).call(_this);
        return _this;
    }
    Object.defineProperty(ConfigService.prototype, "config", {
        get: function () {
            return __classPrivateFieldGet(this, _ConfigService_config, "f");
        },
        set: function (conf) {
            Utils.writeFile(JSON.stringify(conf), __classPrivateFieldGet(this, _ConfigService_config_file, "f")).catch(print);
        },
        enumerable: false,
        configurable: true
    });
    ConfigService.prototype.set_value = function (key, value) {
        var _b;
        this.config = __assign(__assign({}, this.config), (_b = {}, _b[key] = value, _b));
    };
    ConfigService.prototype.connect = function (event, callback) {
        if (event === void 0) { event = "config-changed"; }
        return _super.prototype.connect.call(this, event, callback);
    };
    return ConfigService;
}(Service));
_a = ConfigService, _ConfigService_config = new WeakMap(), _ConfigService_config_file = new WeakMap(), _ConfigService_instances = new WeakSet(), _ConfigService_onChange = function _ConfigService_onChange() {
    var _this = this;
    Utils.readFileAsync(__classPrivateFieldGet(this, _ConfigService_config_file, "f")).then(function (out) {
        __classPrivateFieldSet(_this, _ConfigService_config, __assign(__assign({}, exports.default_config), JSON.parse(out)), "f");
        _this.emit("changed");
        _this.notify("config");
        _this.emit("config-changed", __classPrivateFieldGet(_this, _ConfigService_config, "f"));
    });
};
(function () {
    Service.register(_a, {
        "config-changed": ["jsobject"]
    }, {
        config: ["jsobject", "rw"]
    });
})();
var service = new ConfigService();
exports.default = service;
