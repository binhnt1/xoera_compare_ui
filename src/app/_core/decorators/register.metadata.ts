import "reflect-metadata";
import { TableEx } from "./table.decorator";
import { ObjectEx } from "./object.decorator";
var REGISTRY_METADATA_CLASS = new Map<string, TableEx>();
var REGISTRY_METADATA_PROPERTY = new Map<string, Map<string, ObjectEx>>();

export function registerClass(decorator: TableEx) {
    if (!REGISTRY_METADATA_CLASS.has(decorator.className)) {
        REGISTRY_METADATA_CLASS.set(decorator.className, decorator);
    }
}

export function getMetadataClass(target: string): TableEx {
    return REGISTRY_METADATA_CLASS.get(target);
}

export function getMetadataProperties(target: string): ObjectEx[] {
    let result: ObjectEx[] = [],
        map = REGISTRY_METADATA_PROPERTY.get(target);
    if (map) {
        for (let value of map.values()) {
            result.push(value);
        }
        return result;
    }
    return null;
}

export function getMetadataProperty(target: string, property: string): ObjectEx {
    let map = REGISTRY_METADATA_PROPERTY.get(target);
    if (map) return map.get(property);
    return null;
}

export function registerProperty(target: string, property: string, decorator: ObjectEx) {
    let map: Map<string, any>;
    if (REGISTRY_METADATA_PROPERTY.has(target)) {
        map = REGISTRY_METADATA_PROPERTY.get(target);
    } else {
        map = new Map<string, any>();
        REGISTRY_METADATA_PROPERTY.set(target, map);
    }
    if (!map.has(property)) map.set(property, decorator);
}