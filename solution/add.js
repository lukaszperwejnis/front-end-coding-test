export const add = (...args) => args.reduce((current, accu) => {
    if (isNaN(current)) {
        throw (`Argument: ${current} is not a number`);
    }

    return accu + current;
}, 0);
