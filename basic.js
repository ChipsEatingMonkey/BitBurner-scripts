/** @param {import(".").NS } ns **/
export async function main(ns) {
    let host = ns.args[0];
    let target = ns.args[1];
    let freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
    while (true) {
        if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
            callWeaken(host, target, Math.floor(freeRam/ 1.75), ns)
            await ns.asleep(ns.getWeakenTime(target));
        } else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
            callGrow(host, target, Math.floor(freeRam/ 1.75), ns)
            await ns.asleep(ns.getGrowTime(target));
        } else {
            callHack(host, target, Math.floor(freeRam/ 1.75), ns)
            await ns.asleep(ns.getHackTime(target));
        }
       await ns.sleep(1000);
    }
}

function callWeaken(host, target, threads, ns){
    if (ns.exec('weaken.js',host, threads, target) == 0){
        ns.tprint("cant start weaken");
    }
}
function callGrow(host, target, threads, ns){
    if (ns.exec('grow.js',host, threads, target) == 0){
        ns.tprint("cant start grow");
    }
}
function callHack(host, target, threads, ns){
    if (ns.exec('hack.js',host, threads, target) == 0){
        ns.tprint("cant start hack");
    }
}