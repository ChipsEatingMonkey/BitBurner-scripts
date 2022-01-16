/** @param {NS} ns **/
/**
 * 
 * @param {ns} gameobject
 * @argument {string} target
 *  * recives one argument {target}: 
 *      target: the server to grow 
 */
/** @param {import(".").NS } ns */
 export async function main(ns) {
    let target = ns.args[0];
   await ns.grow(target);
}