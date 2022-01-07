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
    let batchTime = 5;
    // these change everytime the playerhacklvl changes
    let weakenTime = ns.getWeakenTime(target);
    let growTime = ns.getGrowTime(target);
    let hackTime = ns.getHackTime(target);
    let startTimes = [batchTime,3*batchTime , 2*batchTime +(weakenTime-growTime), weakenTime - hackTime];  //w, w ,g h

    let maxLoop = Math.floor(freeRam/ (1.75*4));
    ns.print("Batches: ",maxLoop);
    await ns.sleep(550);
    for (let cycle = 0; cycle < maxLoop; cycle++){
        setTimeout(callWeaken, startTimes[0]+ cycle*batchTime*4,target , 1, ns);
        setTimeout(callWeaken, startTimes[1]+ cycle*batchTime*4,target , 1, ns);
        setTimeout(callGrow, startTimes[2]+ cycle*batchTime*4,target , 1, ns); 
        setTimeout(callHack, startTimes[3]+ cycle*batchTime*4,target , 1, ns);

        ns.print("callHack, GOING OFF: ", Math.floor(hackTime +startTimes[3]+ cycle*batchTime*4)%1000);
        ns.print("callWeaken, GOING OFF: ", Math.floor(weakenTime +(startTimes[0]+ cycle*batchTime*4))%1000);
        ns.print("callGrow, GOING OFF: ", Math.floor(growTime +startTimes[2]+ cycle*batchTime*4)%1000);
        ns.print("callWeaken, GOING OFF: ",Math.floor(weakenTime + startTimes[1]+ cycle*batchTime*4)%1000);
    }
    setTimeout(callBatchmaster, hackTime +startTimes[3]+ maxLoop*batchTime*4 +500,ns, target); // calling itself after run
    await ns.asleep(hackTime +startTimes[3]+ maxLoop*batchTime*4 +1000);
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
function callBatchmaster(ns, target){
    ns.print("starting batchmaster again ps: ", ns.exec('BitBurner-scripts/batchmaster.js',ns.getHostname(), 1, target));
}