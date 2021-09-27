export const add = (...args) => args.reduce((current, accu) => {
    if (isNaN(current)) {
        throw new Error(`Argument: ${current} is not a number`);
    }

    return accu + current;
}, 0);
