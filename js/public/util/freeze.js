export default function freeze(obj) {
    const propNames = Object.getOwnPropertyNames(obj);

    propNames.forEach(function(name) {
        const prop = obj[name];

        if (typeof prop == 'object' && prop !== null)
            freeze(prop);
    });

    return Object.freeze(obj);
}
