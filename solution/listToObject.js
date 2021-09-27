import { getDeepClone, isObject } from "./utils";

export const listToObject = (value) => value.reduce((acc, {name, value}) => {

    return {
        ...acc,
        [name]: isObject(value) ? getDeepClone(value) : value
    }
}, {});
