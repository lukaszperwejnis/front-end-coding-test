function isObject(value) {
    return typeof value === 'object' && value !== null;
}

function cloneObject(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch (error) {
        console.error(`listToObject: ${error}`);
    }
}

function getFormattedDate(value) {
    const date = new Date(value);
    const year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return day + '/' + month + '/' + year;
}

export { isObject, cloneObject, getFormattedDate };
