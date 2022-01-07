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

    //ns.disableLog("ALL");
    let minSec = ns.getServerMinSecurityLevel(target);
    let nowSec = ns.getServerSecurityLevel(target);

    let maxMoney = ns.getServerMaxMoney(target);
    let nowMoney = ns.getServerMoneyAvailable(target);

    let freeRam = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname());
    let threadRam = 1.75;

    //ns.enableLog("print");

    // one formulas are unlocked hackExp(server, player)
    let playerHackLvl = ns.getHackingLevel();
    let batchTime = 50;
    // these change everytime the playerhacklvl changes
    let weakenTime = ns.getWeakenTime(target);
    let growTime = ns.getGrowTime(target);
    let hackTime = ns.getHackTime(target);
    let startTimes = [batchTime, batchTime +(weakenTime-growTime),3*batchTime, weakenTime - hackTime - batchTime];  //w, w ,g h

    let maxLoop = Math.floor(freeRam/ (1.75*4));
    maxLoop = 1;
    ns.tprint("Batches: ",maxLoop);
    for (let cycle = 0; cycle < maxLoop; cycle++){
        setTimeout(callWeaken, startTimes[0]+ cycle*batchTime,target , 1, ns);
        ns.print("callWeaken, starttime: ", startTimes[0]+ cycle*batchTime);

        setTimeout(callWeaken, startTimes[1]+ cycle*batchTime,target , 1, ns);
        ns.print("callWeaken, starttime: ", startTimes[1]+ cycle*batchTime);

        setTimeout(callGrow, startTimes[2]+ cycle*batchTime,target , 1, ns); 
        ns.print("callGrow, starttime: ", startTimes[2]+ cycle*batchTime);

        setTimeout(callHack, startTimes[3]+ cycle*batchTime,target , 1, ns);
        ns.print("callHack, starttime: ", startTimes[3]+ cycle*batchTime);
    }
    setTimeout(callWeaken, startTimes[0]+ batchTime*maxLoop,target , 1, ns);
    await ns.asleep(3*maxLoop*weakenTime);
}

function callWeaken(target, threads, ns){
    ns.exec('BitBurner-scripts/weaken.js',ns.getHostname(), threads, target);
}
function callGrow(target, threads, ns){
    ns.exec('BitBurner-scripts/grow.js',ns.getHostname(), threads, target);
}
function callHack(target, threads, ns){
    ns.exec('BitBurner-scripts/hack.js',ns.getHostname(), threads, target);
}