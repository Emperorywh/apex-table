/**
 * 深拷贝
 * @param target 
 * @returns 
 */
export const apexDeepClone = (target: any) => {
    let result: any;
    if (typeof target === 'object') {
        if (Array.isArray(target)) {
            result = [];
            target.forEach(item => {
                result.push(apexDeepClone(item));
            });
        } else if (target === null) {
            result = null;
        } else if (target.constructor === RegExp || target.constructor === Date) {
            result = target;
        } else {
            result = {};
            Object.keys(target).forEach(item => {
                result[item] = apexDeepClone(target[item]);
            });
        }
    } else {
        result = target;
    }
    return result;
}