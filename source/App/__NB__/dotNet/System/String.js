if (!String.prototype.StartsWith) {
    String.prototype.StartsWith = function(value) {
        return this.slice(0, value.length) === value;
    };
    String.prototype.EndsWith = function(value) {
        return this.indexOf(value, this.length - value.length) !== -1;
    };
    String.prototype.Replace = function(oldValue, newValue) {
        oldValue = oldValue.replace(/\//g, "/");
        var res = new RegExp("\\" + oldValue, "g");
        if (res == null) return this;
        return this.replace(res, newValue).toString();
    };
    String.prototype.TrimStart = function(trimChars) {
        if (typeof trimChars == "undefined") trimChars = " ";
        var result = this;
        var index = result.indexOf(trimChars);
        while (index == 0) {
            result = result.substr(1);
            index = result.indexOf(trimChars);
        }
        return result.toString();
    };
    String.prototype.TrimEnd = function(trimChars) {
        if (typeof trimChars == "undefined") trimChars = " ";
        var result = this;
        var index = result.lastIndexOf(trimChars);
        while (index > -1 && index == result.length - 1) {
            result = result.substr(0, index);
            index = result.lastIndexOf(trimChars);
        }
        return result.toString();
    };
    String.prototype.Trim = function(trimChars) {
        var result = this.TrimStart(trimChars);
        result = result.TrimEnd(trimChars);
        return result.toString();
    };
    String.prototype.Contains = function(value) {
        return this.indexOf(value) > -1;
    };
    String.prototype.ConvertToCamelCase = function() {
        var input = this;
        var keyIndex = input.indexOf("-");
        while (keyIndex > -1) {
            var nextChar = input.charCodeAt(keyIndex + 1);
            if (nextChar) {
                if (nextChar > 96 && nextChar < 123) input = input.substr(0, keyIndex) + String.fromCharCode(nextChar - 32) + input.substr(keyIndex + 2); else input = input.substr(0, keyIndex) + input.substr(keyIndex + 1);
            } else {
                input = input.substr(0, keyIndex - 1);
            }
            keyIndex = input.indexOf("-");
        }
        return input.toString();
    };
    String.Format = function(string, args) {
        var result = string;
        if (arguments.length > 1) {
            if (arguments.length == 2 && typeof args == "object") {
                for (var key in args) {
                    if (args[key] != undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            } else {
                for (var i = 1; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        var reg = new RegExp("({)" + (i - 1) + "(})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
    };
    String.prototype.PadLeft = function(totalWidth, paddingChar) {
        var input = this;
        return (Array(totalWidth).join(paddingChar) + input).slice(-totalWidth);
    };
    String.prototype.PadRight = function(totalWidth, paddingChar) {
        var input = this;
        return (input + Array(totalWidth).join(paddingChar)).substr(0, totalWidth);
    };
}