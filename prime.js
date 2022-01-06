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
    let isPrimed = false;

    ns.enableLog("print");
    while (!isPrimed){
        /**** TO DO: function caculateThreads that determines how many threads should be started */
        nowSec = ns.getServerSecurityLevel(target);
        nowMoney = ns.getServerMoneyAvailable(target);

        isPrimed = (nowSec - minSec == 0 && maxMoney - nowMoney == 0);

        if (nowSec - minSec != 0){
            ns.print("sec to destroy is: ", nowSec - minSec);
            ns.exec('BitBurner-scripts/weaken.js',ns.getHostname(), calculateWeakenThreads(freeRam, minSec, nowSec), target);
            await ns.sleep(ns.getWeakenTime(target) + 100); //added Buffer
            ns.print("after weaken sec to destroy is: ", nowSec - minSec);
        }
        else if (maxMoney - nowMoney != 0){
            ns.print("money to grow is: ", maxMoney - nowMoney);
            ns.exec('BitBurner-scripts/grow.js',ns.getHostname(), calculateGrowThreads(ns, target, freeRam, maxMoney, nowMoney), target);
            await ns.sleep(ns.getGrowTime(target)+ 100);
            ns.print("after money to grow is: ", maxMoney - nowMoney);
        }
        else{
            isPrimed = true;
            ns.print('primed target: ', target);
        }
    }
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

    return Math.ceil(Math.min(maxThreads, (secDiff/0.05)));
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
    return Math.ceil(Math.min(maxThreads, growthThreads));
}