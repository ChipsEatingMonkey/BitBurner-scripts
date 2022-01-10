/**
 * 
 * asumes host server hast maxRam = 2**20;
 */
/** @param @param {import(".").NS } ns **/
export async function main(ns) {
    
    let serverList = ["n00dles","foodnstuff","sigma-cosmetics","joesguns","hong-fang-tea","harakiri-sushi","iron-gym","darkweb","chad-0","nectar-net","CSEC","zer0","max-hardware","neo-net","silver-helix","omega-net","phantasy","comptek","netlink","johnson-ortho","crush-fitness","avmnite-02h","the-hub","summit-uni","zb-institute","I.I.I.I","rothman-uni","syscore","catalyst","millenium-fitness","alpha-ent","lexo-corp","rho-construction","aevum-police","aerocorp","galactic-cyber","global-pharm","snap-fitness","omnia","unitalife","deltaone","defcomm","solaris","icarus","univ-energy","zeus-med","taiyang-digital","nova-med","infocomm","zb-def","microdyne","titan-labs","applied-energetics","run4theh111z","fulcrumtech","stormtech","vitalife","helios","4sigma","omnitek","kuai-gong",".","blade","b-and-a","nwo","powerhouse-fitness","clarkinc","megacorp","fulcrumassets","ecorp","The-Cave"];
    //let growableServerList = myFilter(ns,serverList,hasMoneyAndCanGrow);
    let growableServerList = serverList.filter(serv => hasMoneyAndCanGrow(ns, serv));
    ns.tprint(serverList.length);
    ns.tprint(growableServerList.length);
}
/** @param @param {import(".").NS } ns **/
function hasMoneyAndCanGrow(ns, target){
    return (ns.getServerMaxMoney(target) > 0 && ns.getServerGrowth(target) > 0);
}
/** @param @param {import(".").NS } ns **/
// function myFilter(ns, serverList, func){
//     let res = [];
//     for (let server of serverList){
//         if (hasMoneyAndCanGrow(ns, server)){
//             res.push(server);
//         }
//     }
//     return res;
// }

