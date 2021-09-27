import { getDeepClone, isObject } from "./utils";

export const objectToList = (value) => Object.keys(value).reduce((acc, currentKey) => {
    const currentValue = value[currentKey];

    return [
        ...acc,
        {
            name: currentKey,
            value: isObject(currentValue) ? getDeepClone(currentValue) : currentValue
        }
    ];
}, []);
