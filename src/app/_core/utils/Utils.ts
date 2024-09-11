export class Utils {

    static isObject(value: any): boolean {
        return value !== null && typeof value === 'object';
    }

    static isString(value: any): boolean {
        return typeof value === 'string';
    }

    static isNumber(value: any): boolean {
        return typeof value === 'number';
    }

    static isBoolean(value: any): boolean {
        return typeof value === 'boolean';
    }

    static isFunction(value: any): boolean {
        return typeof value === 'function';
    }

    static objectEmpty(value: any): boolean {
        return Object.keys(value).length === 0;
    }

    static isNullOrUndefined(value: any): boolean {
        return value === null || value === undefined;
    }

    static isUndefined(value: any): boolean {
        return value === undefined;
    }

    static isNull(value: any): boolean {
        return value === null;
    }

    static generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    static convertToLowercaseWithUnderscores(str: string): string {
        return str.toLowerCase().replace(/ /g, '_');
    }

    static cloneObject(object: unknown) {
        return JSON.parse(JSON.stringify(object));
    }

    static getObjectOrArrayType(value: unknown) {
        if (value === null) {
            return null;
        }
        if (typeof value === 'object' && value.constructor === Object) return 'object';
        if (Array.isArray(value)) return 'array';
        return 'not an object or array';
    }
}
