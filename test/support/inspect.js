import {inspect} from 'util';
import Bimap from '../../lib/bimap';

export function inspectGraph(graph) {
    function toLiteralRecursive(scope) {
        let accumulator = {};

        Object.keys(scope).forEach(key => {
            if (scope[key] instanceof Bimap) {
                accumulator[key] = scope[key].toLiteral();
            } else {
                accumulator[key] = toLiteralRecursive(scope[key]);
            }
        });

        return accumulator;
    }

    console.log(inspect(toLiteralRecursive(graph._graph), {depth: null}));
}