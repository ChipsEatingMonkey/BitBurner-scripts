/** @param {NS} ns **/
/**
 * 
 * @param {gameobject} ns
 * @argument {String} target
 * recives one argument {target}: 
 *      target: the server to prime.
 * 
 * Primes target server =>
 *          - minimum server security
 *          - maximum server money 
 * 
 * Requirements: 
 *        ./weaken.js
 *        ./grow.js
 */
 export async function main(ns) {
    
    let target = ns.args[0] ?? 'n00dles';

    ns.disableLog("ALL");
    let minSec = ns.getServerMinSecurityLevel(target);
    let nowSec = ns.getServerSecurityLevel(target);

    let maxMoney = ns.getServerMaxMoney(target);
    let nowMoney = ns.getServerMoneyAvailable(target);

    let freeRam = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname());
    let threadRam = 1.75;
    ns.exec('BitBurner-scripts/prime.js',ns.getHostname(), 1, target);

    ns.enableLog("print");

    // one formulas are unlocked hackExp(server, player)
    let playerHackLvl = ns.getHackingLevel();
    setTimeout(callWeaken,); 
    let batchTime = 100;
    // these change everytime the playerhacklvl changes
    let weakenTime = ns.getWeakenTime(target);
    let growTime = ns.getGrowTime(target);
    let hackTime = ns.getHackTime(target);
    let startTimes = [batchTime, batchTime +(weakenTime-growTime),3*batchTime, weakenTime - hackTime - batchTime];  //w, w ,g h

    for (let cycle = 0; cycle < 100; cycle++){
        setTimeout(callWeaken, startTimes[0]+ cycle*batchTime,target , 1); 
        setTimeout(callWeaken, startTimes[1]+ cycle*batchTime,target , 1); 
        setTimeout(callGrow, startTimes[2]+ cycle*batchTime,target , 1); 
        setTimeout(callHack, startTimes[3]+ cycle*batchTime,target , 1); 
    }
}

function callWeaken(target, threads){
    ns.exec('BitBurner-scripts/weaken.js',ns.getHostname(), threads, target);
}
function callGrow(target, threads){
    ns.exec('BitBurner-scripts/grow.js',ns.getHostname(), threads, target);
}
function callHack(target, threads){
    ns.exec('BitBurner-scripts/hack.js',ns.getHostname(), threads, target);
}