/** @param {NS} ns **/
/**
 * 
 * @param {ns} gameobject
 * @argument {string} target
 *  * recives one argument {target}: 
 *      target: the server to grow
 */
 export async function main(ns) {
    let target = ns.args[0];
   await ns.grow(target);
}