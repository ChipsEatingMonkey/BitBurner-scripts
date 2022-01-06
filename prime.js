/** @param {NS} ns **/
/**
 * 
 * @param {ns} gameobject
 * @argument {String} target
 * recives one argument {target}: 
 *      target: the server to prime
 * 
 * lowering securitiy to minimum and grow available money to max.
 * Calculates needed threads and takes into account available Ram.
 * 
 * Requirements: 
 *        ./weaken.js
 *        ./grow.js
 */
 export async function main(ns) {
    
    let target = ns.args[0] ?? 'n00dles';

    let minSec = ns.getServerMinSecurityLevel(target);
    let nowSec = ns.getServerSecurityLevel(target);

    let maxMoney = ns.getServerMaxMoney(target);
    let nowMoney = ns.getServerMoneyAvailable(target);

    let freeRam = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname());
    let threadRam = 1.75;
    let isPrimed = false;
    while (!isPrimed){
        /**** TO DO: function caculateThreads that determines how many threads should be started */
        nowSec = ns.getServerSecurityLevel(target);
        nowMoney = ns.getServerMoneyAvailable(target);

        isPrimed = (nowSec - minSec == 0 && maxMoney - nowMoney == 0);

        if (nowSec - minSec != 0){
            ns.exec('BitBurner-scripts/weaken.js',ns.getHostname(), Math.floor(freeRam/threadRam), target);
           await ns.sleep(ns.getWeakenTime(target));
        }
        else if (maxMoney - nowMoney != 0){
            ns.exec('BitBurner-scripts/grow.js',ns.getHostname(), Math.floor(freeRam/threadRam), target);
           await ns.sleep(ns.getGrowTime(target));
        }
        else{
            isPrimed = true;
            ns.print('primed target: ', target);
        }
    }
}