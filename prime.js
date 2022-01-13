
/**
 * 
 *
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
/** @param {import(".").NS } ns **/
 export async function main(ns) {
    let target = ns.args[0] ?? 'n00dles';
    let loopAll = ns.args[1] ?? 0;
    let serverList = ["foodnstuff","sigma-cosmetics","joesguns","hong-fang-tea","harakiri-sushi","iron-gym","darkweb","nectar-net","CSEC","zer0","max-hardware","neo-net","silver-helix","omega-net","phantasy","comptek","netlink","johnson-ortho","crush-fitness","avmnite-02h","the-hub","summit-uni","zb-institute","I.I.I.I","rothman-uni","syscore","catalyst","millenium-fitness","alpha-ent","lexo-corp","rho-construction","aevum-police","aerocorp","galactic-cyber","global-pharm","snap-fitness","omnia","unitalife","deltaone","defcomm","solaris","icarus","univ-energy","zeus-med","taiyang-digital","nova-med","infocomm","zb-def","microdyne","titan-labs","applied-energetics","run4theh111z","fulcrumtech","stormtech","vitalife","helios","4sigma","omnitek","kuai-gong",".","blade","b-and-a","nwo","powerhouse-fitness","clarkinc","megacorp","fulcrumassets","ecorp","The-Cave"];

    if (loopAll == 1){
        for (let serv of serverList){
          ns.exec('/BitBurner-scipts.js', ns.getHostname(), 1, serv);
        }
        return;
    }
    await primeServer(ns, target);

}
/** @param {import(".").NS } ns **/
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

async function primeServer(ns, target){
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
            await ns.asleep(50);
            freeRam = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname());
            if (maxMoney - nowMoney != 0){ // use extra Ram to grow if needed
                ns.exec('BitBurner-scripts/grow.js',ns.getHostname(), calculateGrowThreads(ns, target, freeRam, maxMoney, nowMoney), target);
            }
            await ns.sleep(ns.getWeakenTime(target)); 
        }
        else if (maxMoney - nowMoney != 0){
            ns.print("money to grow is: ", maxMoney - nowMoney);
            let gT= calculateGrowThreads(ns, target, freeRam, maxMoney, nowMoney);
            ns.exec('BitBurner-scripts/grow.js',ns.getHostname(), gT, target);
            await ns.asleep(50);
            freeRam = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname());
            
            ns.exec('BitBurner-scripts/weaken.js',ns.getHostname(),Math.min( gT, Math.floor(freeRam/1.75)), target);
            await ns.sleep(ns.getWeakenTime(target)); 
        }
        else{
            isPrimed = true;
            ns.tprint('primed target: ', target);
        }
    }
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