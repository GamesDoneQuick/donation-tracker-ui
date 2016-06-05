import freeze from './freeze';

export function sortByDateField(objects, field = 'date') {
    return Object.keys(objects).sort((a, b) => {
        a = new Date(objects[a][field]);
        b = new Date(objects[b][field]);
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        }
        return 0;

    }).map(k => [k, objects[k]]);
}

export { freeze };
export default {
    freeze,
    sortByDateField,
};
