
/**
 * 
 */

/** @param @param {import(".").NS } ns **/
 export async function main(ns) {
    // run buyServer 4 1
    let money = ns.getPlayer().money;
    let ram = 2;
    let maxRam = 2**20;
    let buy = ns.args[1] ?? 0;
    while (money > ns.getPurchasedServerCost(ram *2)){
        ram *= 2;
    }
    if (buy == 1){
        ns.purchaseServer('Chad-' + ns.args[0], Math.min(ram,maxRam));
        ns.tprint("new Chad with RAM : ", ram);
    }
    else {
        ns.tprint("could afford Server with RAM: ", ram, " at cost in mil: ",ns.getPurchasedServerCost(ram/1000000), " use this 2 buy it run buyServer 4 1");
    }
    
}