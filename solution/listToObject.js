import { cloneObject, isObject } from "./utils";

export const listToObject = (value) => value.reduce((acc, {name, value}) => {

    return {
        ...acc,
        [name]: isObject(value) ? cloneObject(value) : value
    }
}, {});
