/** @param {NS} ns **/
/**
 * 
 * @param {gameobject} ns
 * @argument {String} target
 * recives two argument {host, target}:
 *      host: the server hacking
 *      target: the server to hack
 * 
 * Fires batches of w,w,g,h on target to get the
 * maximum amout of $ out of the available threads
 * 
 * Requirements:
 *        ./weaken.js
 *        ./grow.js
 *        ./hack.js
 */
 export async function main(ns) {

    let host = ns.args[0] ?? ns.getHostname();
    let target = ns.args[1] ?? 'n00dles';
    let batchTime = 50;

    //ns.disableLog("ALL");
    let minSec = ns.getServerMinSecurityLevel(target);
    let nowSec = ns.getServerSecurityLevel(target);

    let maxMoney = ns.getServerMaxMoney(target);
    let nowMoney = ns.getServerMoneyAvailable(target);

    let freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
    let threadRam = 1.75;

    //ns.enableLog("print");

    // one formulas are unlocked hackExp(server, player)
    let playerHackLvl = ns.getHackingLevel();
    
    // these change everytime the playerhacklvl changes
    let weakenTime = ns.getWeakenTime(target);
    let growTime = ns.getGrowTime(target);
    let hackTime = ns.getHackTime(target);
    let startTimes = [batchTime,3*batchTime , 2*batchTime +(weakenTime-growTime), weakenTime - hackTime];  //w, w ,g h
    let bestThreads = calculateBatch(ns, target, freeRam);

    let maxLoop = Math.floor(freeRam/ (1.75*bestThreads[4]));
    ns.print("Batches: ",maxLoop);
    for (let cycle = 0; cycle < maxLoop; cycle++){
        setTimeout(callWeaken, startTimes[0]+ cycle*batchTime*4,host, target , bestThreads[0], ns);
        setTimeout(callWeaken, startTimes[1]+ cycle*batchTime*4,host, target , bestThreads[1], ns);
        setTimeout(callGrow, startTimes[2]+ cycle*batchTime*4,host, target , bestThreads[2], ns); 
        setTimeout(callHack, startTimes[3]+ cycle*batchTime*4,host, target , bestThreads[3], ns);

        ns.print("callHack, GOING OFF: ", Math.floor(hackTime +startTimes[3]+ cycle*batchTime*4)%1000);
        ns.print("callWeaken, GOING OFF: ", Math.floor(weakenTime +(startTimes[0]+ cycle*batchTime*4))%1000);
        ns.print("callGrow, GOING OFF: ", Math.floor(growTime +startTimes[2]+ cycle*batchTime*4)%1000);
        ns.print("callWeaken, GOING OFF: ",Math.floor(weakenTime + startTimes[1]+ cycle*batchTime*4)%1000);
    }
    setTimeout(callBatchmaster, hackTime +startTimes[3]+ maxLoop*batchTime*4 +batchTime,ns, host, target); // calling itself after run
    await ns.asleep(hackTime +startTimes[3]+ maxLoop*batchTime*4 +batchTime*2);
}

function callWeaken(host, target, threads, ns){
    ns.exec('BitBurner-scripts/weaken.js',host, threads, target);
}
function callGrow(host, target, threads, ns){
    ns.exec('BitBurner-scripts/grow.js',host, threads, target);
}
function callHack(host, target, threads, ns){
    ns.exec('BitBurner-scripts/hack.js',host, threads, target);
}
function callBatchmaster(ns, host, target){
    ns.print("starting batchmaster again ps: ", ns.exec('BitBurner-scripts/remotebatchmaster.js',ns.getHostname(), 1,host , target));
}

function calculateBatch(ns,target, limitedRam) {
    
    let maxThreads = Math.floor(limitedRam / 1.75);
    let moneyMax = ns.getServerMaxMoney(target);

    let hackThreads = 1;
    let growThreads = 1;
    let weakenThreads1 = 1;
    let weakenThreads2 = 1;
    let bestDollarPerThread = 1;
    let bestStealPerBatch = 1;
    let bestThreads = [0,0,0,0,0];
    let dollarPerThread = 0;
    let secToDestroy = 0;
    let threadSum = 0;

    let moneyStolen = 0;
    let tmp  = 0;

    while (ns.hackAnalyze(target) * hackThreads < 1){
        moneyStolen = ns.hackAnalyze(target) * hackThreads * moneyMax;
        secToDestroy =  ns.hackAnalyzeSecurity(hackThreads);
        weakenThreads1 = Math.ceil(secToDestroy/0.05);
        // Math:  (1 - ns.hackAnalyze(target) * hackThreads) * growthAmount = 1
        // <=> grothAmount = 1 / (1 - ns.hackAnalyze(target) * hackThreads)
        growThreads = Math.ceil(ns.growthAnalyze(target, 1 / (1 - ns.hackAnalyze(target) * hackThreads)))
        secToDestroy = ns.growthAnalyzeSecurity(growThreads);
        weakenThreads2 = Math.ceil(secToDestroy/0.05);
        threadSum = hackThreads + growThreads + weakenThreads2 + weakenThreads1;
        if (threadSum > maxThreads){
            break;
        }
        tmp = moneyStolen / threadSum ;
        if (tmp > bestDollarPerThread){
            bestDollarPerThread = tmp;
            bestStealPerBatch = moneyStolen;
            bestThreads[0] = weakenThreads1;
            bestThreads[1] = weakenThreads2;
            bestThreads[2] = growThreads;
            bestThreads[3] = hackThreads;
            bestThreads[4] = threadSum;

        }
        hackThreads++;
    }
    ns.print("||||||||||||||||||||||||||||||||||||||||| ");
    ns.print("threads needed: (w, w, g, h) ", bestThreads);
    ns.print("||||||||||||||||||||||||||||||||||||||||| ");
    return bestThreads;
}