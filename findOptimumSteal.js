/** @param @param {import(".").NS } ns **/
 export async function main(ns) {
    
    let target = ns.args[0] ?? 'n00dles';
    let limitedRam = ns.args[1] ?? 2000000;
    let maxThreads = Math.floor (limitedRam / 1.75);
    let moneyMax = ns.getServerMaxMoney(target);

    let hackThreads = 1;
    let growThreads = 1;
    let weakenThreads1 = 1;
    let weakenThreads2 = 1;
    let bestDollarPerThread = 1;
    let bestStealPerBatch = 1;
    let bestThreads = [0,0,0,0];
    let dollarPerThread = 0;
    let secToDestroy = 0;
    let threadSum = 0;

    let moneyStolen = 0;
    let tmp  = 0;
    if (!isPrimed(ns, target)){
        ns.tprint('not primed, returning...');
        return;
    }
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
        }
        hackThreads++;
    }

    ns.tprint("target: ", target);
    ns.tprint("weakenTime in sec is: ",ns.getWeakenTime(target)/1000);
    ns.tprint("Best dollar per Thread: ", bestDollarPerThread);
    ns.tprint("Best dollar per Thread per WeakenTime: ", bestDollarPerThread/ns.getWeakenTime(target));
    ns.tprint("Money Stolen: ", bestStealPerBatch);
    ns.tprint("threads needed: (w, w, g, h) ", bestThreads);
}

function isPrimed(ns, target){
    let minSec = ns.getServerMinSecurityLevel(target);
    let nowSec = ns.getServerSecurityLevel(target);

    let maxMoney = ns.getServerMaxMoney(target);
    let nowMoney = ns.getServerMoneyAvailable(target);
    if (minSec-nowSec != 0 || maxMoney -nowMoney != 0)
    {
        ns.print("server not primed anymore");
        if (nowSec -minSec > 20){
            ns.tprint("server security is over 20 out of range");
        }
        return false;
    }
    else ns.tprint("server primed");
    return true;
}