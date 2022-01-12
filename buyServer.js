
/**
 * 
 */

/** @param @param {import(".").NS } ns **/
 export async function main(ns) {
    // run buyServer.js 4 1
    let money = ns.getPlayer().money;
    let ram = 2;
    let maxRam = 2**20;
    let buy = ns.args[1] ?? 0;
    let nbr = ns.args[0] ?? 0;
    let buyAll = ns.args[2]?? 0;
    if (buyAll == 1){
        for (let i = 0; i < 25; i++){
            ns.purchaseServer('chad-' + i, maxRam);
        }
        ns.tprint("all chads online ");
        return;
    }
    while (money > ns.getPurchasedServerCost(ram *2)){
        ram *= 2;
    }
    if (buy == 1){
        if (!ns.serverExists('chad-' + nbr)){
            ns.purchaseServer('chad-' + nbr, Math.min(ram,maxRam));
            ns.tprint("new chad with TB RAM : ", ram/1000);
        }
    }
    else {
        ns.tprint("could afford Server with TB RAM: ", ram/1000, " at cost in bil: ",ns.getPurchasedServerCost(ram)/1000000000, " use this 2 buy it run buyServer.js 4 1");
    }
    
}