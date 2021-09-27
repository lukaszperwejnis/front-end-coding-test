import { getFormattedDate, isObject } from "./utils";

const DESERIALIZE_SEPARATOR = '_';
const TIME_FORMAT_PREFIX = 't:'

export function deserialize(value) {
    try {
        return Object.keys(value).reduce((acc, currentKey) => {
            if (!isDeserializable(currentKey)) {
                return {
                    ...acc,
                    [currentKey]: value[currentKey]
                }
            }

            const currentValue = value[currentKey];
            const { containerName, index, fieldName } = getContainerNameIndexAndFieldNameFromKey(currentKey);
            const container = acc[containerName];
            const elementByGivenIndex = container ? container[index] : null;

            if (!container) {
                const newContainer = [];
                newContainer[index] = {
                    [fieldName]: getDeserializedValue(currentValue)
                }

                return {
                    ...acc,
                    [containerName]: newContainer
                }
            }

            if (elementByGivenIndex) {
                container[index] = {
                    ...elementByGivenIndex,
                    [fieldName]: getDeserializedValue(currentValue)
                }

                return {
                    ...acc,
                    [containerName]: [...container]
                }
            }

            container[index] = {
                [fieldName]: getDeserializedValue(currentValue)
            }

            return {
                ...acc,
                [containerName]: [...container]
            }
        }, {});
    } catch (error) {
        console.error(`deserialize: ${error}`);
    }
}

function isDeserializable(value) {
    const hasValidSeparator = value.includes(DESERIALIZE_SEPARATOR);
    const [parentNameWithIndex, fieldName] = value.split(DESERIALIZE_SEPARATOR);
    const hasValidFormat = Boolean(parentNameWithIndex && fieldName);
    const hasValidIndex = !isNaN(Number(parentNameWithIndex[parentNameWithIndex.length - 1]));

    return [
        hasValidSeparator,
        hasValidFormat,
        hasValidIndex
    ].every(Boolean);
}

function getContainerNameIndexAndFieldNameFromKey(key) {
    const [containerNameWithIndex, fieldName] = key.split(DESERIALIZE_SEPARATOR);

    // TODO
    // for tests assumptions where index is always with one digit
    // in the future could be improved by checking type of ending key name
    return {
        containerName: containerNameWithIndex.slice(0, containerNameWithIndex.length - 1),
        index: containerNameWithIndex[containerNameWithIndex.length - 1],
        fieldName
    };
}

function getDeserializedValue(value) {
    switch (true) {
        case isObject(value) && !Array.isArray(value):
            return deserialize(value);
        case typeof value === 'string' && value.includes(TIME_FORMAT_PREFIX):
            return getDeserializedDateValue(value);
        default:
            return value;
    }

}

function getDeserializedDateValue(value) {
    const parsedDate = Number(value.slice(TIME_FORMAT_PREFIX.length, value.length));

    if (isNaN(parsedDate)) {
        throw new Error(`Given date is invalid: ${value}`);
    }

    return getFormattedDate(parsedDate);
}
