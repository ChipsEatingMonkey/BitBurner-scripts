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
/** @param @param {import(".").NS } ns **/
 export async function main(ns) {

    let host = ns.args[0] ?? ns.getHostname();
    let target = ns.args[1] ?? 'n00dles';
    let playerlvl = ns.args[2]?? ns.getHackingLevel();
    let runCount = ns.args[3]?? 0;
    let batchCountPrev = ns.args[4]?? 0;
    let playerMoney = ns.args[5] ?? ns.getPlayer().money;
    let w1 = ns.args[6] ?? 0;
    let w2 = ns.args[7] ?? 0;
    let g = ns.args[8] ?? 0;
    let h = ns.args[9] ?? 0;
    runCount += 1;
    //ns.formulas.hacking.hackExp
    
    ns.disableLog("ALL");
    ns.enableLog("print");
    let moneyMade = ns.getPlayer().money - playerMoney;
    playerMoney =  ns.getPlayer().money;
    let minSec = ns.getServerMinSecurityLevel(target);
    let nowSec = ns.getServerSecurityLevel(target);

    let maxMoney = ns.getServerMaxMoney(target);
    let nowMoney = ns.getServerMoneyAvailable(target);
    let freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
    let secDiff = nowSec - minSec;

    if (!isPrimed(ns, target)){
        ns.tprint('server ', target ,' not primed anymore');
    }
    ns.tprint('last run made in mil :',moneyMade/1000000);
    if (secDiff > 0){
        ns.tprint("secDiff found on: ", target, "T: ", Math.ceil(secDiff/0.05));
        callWeaken(host, target, Math.ceil(secDiff/0.05), ns);
        ns.asleep(50);
    }
    let moneyAsPartial = nowMoney / maxMoney;
    if (moneyAsPartial != 1){
        let growthAmount = 1 / moneyAsPartial;
        let growthThreads = ns.growthAnalyze(target, growthAmount);
        ns.tprint("missing money found found on: ", target,"T: ",growthThreads);
        callGrow(host, target, Math.max(growthThreads,1), ns);
        ns.asleep(50);
    }

    
    let ramPerThread = 1.75;
    if (playerlvl != ns.getHackingLevel()){
        ns.tprint("player lvled up!, gain lvl: ",  ns.getHackingLevel() - playerlvl);
        playerlvl = ns.getHackingLevel();
    }



    // one formulas are unlocked hackExp(server, player)
    let playerHackLvl = ns.getHackingLevel();
    
    // these change everytime the playerhacklvl changes
    let weakenTime = ns.getWeakenTime(target);
    let growTime = ns.getGrowTime(target);
    let hackTime = ns.getHackTime(target);

    let bestThreads = [0,0,0,0,0];
    if (w1 == 0){
        bestThreads = calculateBatch(ns, target, freeRam);
    }
    else{
        bestThreads[0] = w1;
        bestThreads[1] = w2;
        bestThreads[2] = g;
        bestThreads[3] = h;
        bestThreads[4] = w1 + w2 + g + h;
    }

    let bufferTime = 10;
    ns.tprint("hackTime: ",hackTime);
    ns.tprint("bestThreads: ", bestThreads);
    let batchCount = 0;
    if (batchCountPrev == 0){
        batchCount = Math.min(Math.floor(hackTime/bufferTime),Math.floor(freeRam/ (ramPerThread*bestThreads[4])));// ns.args[4] ?? 100; //
    }
    else {
        batchCount = Math.min(batchCountPrev, Math.floor(freeRam/ (ramPerThread*bestThreads[4])));
    }
    // if (batchCountPrev > batchCount){
    //     ns.tprint("prev Batchcount was higher -> hackTime got lower");
    //     ns.tprint("sleeping here for a sec to see impact ");
    //     ns.asleep(1000);
    // }
    // if (batchCountPrev < batchCount && batchCountPrev != 0){
    //     batchCount = batchCountPrev;
    // }
    
    //batchCount *= 2;
    //if (batchCount > weakenTime /20){
    //    batchCount = Math.floor(weakenTime /20);
   // }
    
    //let batchCount = 4684;//(weakenTime * 0.9) / bufferTime; // needs check if server can handle that
    ns.tprint("batchCount: ",batchCount);
    let batchTime = 4* bufferTime;
    let startTimes = [bufferTime,3*bufferTime , 2*bufferTime +(weakenTime-growTime), weakenTime - hackTime];  //w, w ,g h
    

    
    
    //if (maxMoney / (maxMoney -nowMoney) > ns.growthAnalyze)
  
    //let moneyAsPartial = nowMoney / maxMoney ;
    // moneyAP * gA = 1
    //let growthAmount = 1 / moneyAsPartial;
    // if (ns.growthAnalyze(target, growthAmount)  >= batchCount)
    // {
    //     if (bestThreads[3] >= 2) {
    //         ns.tprint("increasing growcalls at cost of hackingcalls");
    //         bestThreads[3] -= 1;
    //         bestThreads[2] += 1;
    //         }
        
    // }
    let start = Date.now();
    let timeExecution = 0;
    for (let batch = 0; batch < batchCount; batch++){
        timeExecution = Date.now() - start;
        setTimeout(callWeaken, (startTimes[0]+ batch*batchTime)-timeExecution,host, target , bestThreads[0], ns);
        setTimeout(callWeaken, (startTimes[1]+ batch*batchTime)-timeExecution,host, target , bestThreads[1], ns);
        setTimeout(callGrow, (startTimes[2]+ batch*batchTime)-timeExecution,host, target , bestThreads[2], ns); 
        setTimeout(callHack, (startTimes[3]+ batch*batchTime)-timeExecution,host, target , bestThreads[3], ns);

       // ns.print("callHack, GOING OFF: ", Math.floor(hackTime +startTimes[3]+ batch*batchTime)%1000);
       // ns.print("callWeaken, GOING OFF: ", Math.floor(weakenTime +(startTimes[0]+ batch*batchTime))%1000);
       // ns.print("callGrow, GOING OFF: ", Math.floor(growTime +startTimes[2]+ batch*batchTime)%1000);
       // ns.print("callWeaken, GOING OFF: ",Math.floor(weakenTime + startTimes[1]+ batch*batchTime)%1000);
    }
    timeExecution = Date.now() - start;
    console.log("execution time was: ",timeExecution);
    let timeFirstFunctionCallHits = hackTime +startTimes[3]+ batchCount*batchTime //not optimised the old way
    //let timeFirstFunctionCallHits = startTimes[3] + hackTime; // not working ?? 
    // setTimeout(callBatchmaster, timeFirstFunctionCallHits +bufferTime,ns, host, target,playerlvl); // calling itself after run
    await ns.asleep(timeFirstFunctionCallHits +bufferTime*2);
    ns.tprint("starting batchmaster again ps: ", ns.exec('BitBurner-scripts/remotebatchmaster.js',ns.getHostname(), 1,host , target,playerlvl,runCount,batchCount,playerMoney, bestThreads[0], bestThreads[1], bestThreads[2], bestThreads[3] ));
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
    else{ 
        ns.tprint(" ");
        ns.tprint("server primed");
    }
    return true;
}

function callWeaken(host, target, threads, ns){
    if (ns.exec('BitBurner-scripts/weaken.js',host, threads, target) == 0){
        ns.tprint("cant start weaken");
    }
}
function callGrow(host, target, threads, ns){
    if (ns.exec('BitBurner-scripts/grow.js',host, threads, target) == 0){
        ns.tprint("cant start grow");
    }
}
function callHack(host, target, threads, ns){
    if (ns.exec('BitBurner-scripts/hack.js',host, threads, target) == 0){
        ns.tprint("cant start hack");
    }
}
function callBatchmaster(ns, host, target,playerlvl, runCount){
    ns.tprint("starting batchmaster again ps: ", ns.exec('BitBurner-scripts/remotebatchmaster.js',ns.getHostname(), 1,host , target,playerlvl,runCount ));
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
        tmp = moneyStolen * maxThreads / threadSum  ;
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
    ns.tprint("||||||||||||||||||||||||||||||||||||||||| ");
    ns.tprint("threads needed: (w, w, g, h) ", bestThreads);
    ns.tprint("||||||||||||||||||||||||||||||||||||||||| ");
    return bestThreads;
}

function calculateWeakenThreads(freeRam, minSec, nowSec){
    /**
     * argument {int} freeRam
     * argument {int} minSec : minimum security of the server
     * argument {int} nowSec : current security of the server 
     * 
     * calculates the amount of Threads needed to reach minimum security with one call of weaken.
     * If not enough Ram is available it will do the most threads possible
     */

    let maxThreads = Math.floor(freeRam / 1.75);
    let secDiff = nowSec - minSec;
    return Math.max(1,Math.ceil(Math.min(maxThreads, (secDiff/0.05))));
}

function calculateGrowThreads(ns, target, freeRam, maxMoney, nowMoney){
    /**
   * argument {gameobject} ns : gameobject to call functions from
   * argument {String} target : target server as String
   * argument {int} freeRam  : usable ram of host server
   * argument {int} maxMoney : maximum money the server can hold
   * argument {int} nowMoney : available money on the server now
   * 
   * calculates the amount of Threads needed to reach maximum money with one call of grow.
   * If not enough Ram is available it will do the most threads possible
   */

  let maxThreads = Math.floor(freeRam / 1.75);
  let missingMoneyAsPartial = nowMoney / maxMoney;

  //     missingMoneyAsPartial * growthAmount  = 1 | / missingMoneyAsPartial
  // <=> growthAmount = 1 / missingMoneyAsPartial;

  let growthAmount = 1 / missingMoneyAsPartial;
  let growthThreads = ns.growthAnalyze(target, growthAmount);
  return Math.max(Math.ceil(Math.min(maxThreads, growthThreads)),1);
}