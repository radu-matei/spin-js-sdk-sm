//@ts-ignore
import * as spinSqlite from "fermyon:spin/sqlite@2.0.0";
function createSqliteConnection(connection) {
    return {
        execute: (statement, parameters) => {
            let santizedParams = convertToWitTypes(parameters);
            return connection.execute(statement, santizedParams);
        }
    };
}
export const Sqlite = {
    open: (label) => {
        return createSqliteConnection(spinSqlite.Connection.open(label));
    },
    openDefault: () => {
        return createSqliteConnection(spinSqlite.Connection.open("default"));
    }
};
export const valueInteger = (value) => {
    return { tag: "integer", val: value };
};
export const valueReal = (value) => {
    return { tag: "real", val: value };
};
export const valueText = (value) => {
    return { tag: "text", val: value };
};
export const valueBlob = (value) => {
    return { tag: "blob", val: value };
};
export const valueNull = () => {
    return { tag: "null" };
};
function convertToWitTypes(parameters) {
    let sanitized = [];
    for (let k of parameters) {
        if (typeof (k) === "object") {
            sanitized.push(k);
            continue;
        }
        if (typeof (k) === "number") {
            isFloat(k) ? sanitized.push(valueReal(k)) : sanitized.push(valueInteger(k));
            continue;
        }
        if (typeof (k) === "bigint") {
            sanitized.push(valueInteger(k));
            continue;
        }
        if (typeof (k) === "string") {
            sanitized.push(valueText(k));
            continue;
        }
        if (k === null) {
            sanitized.push(valueNull());
            continue;
        }
        if (k instanceof Uint8Array) {
            sanitized.push(valueBlob(k));
            continue;
        }
    }
    return sanitized;
}
function isFloat(number) {
    return number % 1 !== 0;
}
