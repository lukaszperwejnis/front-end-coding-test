export const deserialize = (obj) => {
    try {
        return Object.keys(obj).reduce((acc, currentKey) => {
            if (!isDeserializable(currentKey)) {
                return {
                    ...acc,
                    [currentKey]: obj[currentKey]
                }
            }


            const currentValue = obj[currentKey];
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
};


const DESERIALIZABLE_SEPARATOR = '_';
const TIME_FORMAT_PREFIX = 't:'

function isDeserializable(value) {
    const hasValidSeparator = value.includes(DESERIALIZABLE_SEPARATOR);
    const [parentNameWithIndex, fieldName] = value.split(DESERIALIZABLE_SEPARATOR);
    const hasValidFormat = Boolean(parentNameWithIndex && fieldName);
    const hasValidIndex = !isNaN(Number(parentNameWithIndex[parentNameWithIndex.length - 1]));

    return [
        hasValidSeparator,
        hasValidFormat,
        hasValidIndex
    ].every(Boolean);
}

function getContainerNameIndexAndFieldNameFromKey(key) {
    const [containerNameWithIndex, fieldName] = key.split(DESERIALIZABLE_SEPARATOR);
    // TODO
    // for tests assumptions where index is always with one digit
    // in the future could be improved by checking type of ending key name
    return {
        containerName: containerNameWithIndex.slice(0, containerNameWithIndex.length - 1),
        index: containerNameWithIndex[containerNameWithIndex.length - 1],
        fieldName
    };
}

function getDeserializedValue(field) {
    const isObject = typeof field === 'object' && !Array.isArray(field) && field !== null;
    switch (true) {
        case isObject:
            return deserialize(field);
        case typeof field === 'string' && field.includes(TIME_FORMAT_PREFIX):
            return deserializeTimeValue(field);
        default:
            return field;
    }

}

function deserializeTimeValue(value) {
    const parsedDate = Number(value.slice(TIME_FORMAT_PREFIX.length, value.length));

    if (isNaN(parsedDate)) {
        throw Error(`Given date is invalid: ${value}`);
    }

    return new Intl.DateTimeFormat('en-US').format(parsedDate)
}
