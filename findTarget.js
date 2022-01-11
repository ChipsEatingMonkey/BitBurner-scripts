/**
 * 
 * asumes host server hast maxRam = 2**20;
 */
/** @param @param {import(".").NS } ns **/
export async function main(ns) {
    
    let serverList = ["n00dles","foodnstuff","sigma-cosmetics","joesguns","hong-fang-tea","harakiri-sushi","iron-gym","darkweb","nectar-net","CSEC","zer0","max-hardware","neo-net","silver-helix","omega-net","phantasy","comptek","netlink","johnson-ortho","crush-fitness","avmnite-02h","the-hub","summit-uni","zb-institute","I.I.I.I","rothman-uni","syscore","catalyst","millenium-fitness","alpha-ent","lexo-corp","rho-construction","aevum-police","aerocorp","galactic-cyber","global-pharm","snap-fitness","omnia","unitalife","deltaone","defcomm","solaris","icarus","univ-energy","zeus-med","taiyang-digital","nova-med","infocomm","zb-def","microdyne","titan-labs","applied-energetics","run4theh111z","fulcrumtech","stormtech","vitalife","helios","4sigma","omnitek","kuai-gong",".","blade","b-and-a","nwo","powerhouse-fitness","clarkinc","megacorp","fulcrumassets","ecorp","The-Cave"];
    //let growableServerList = myFilter(ns,serverList,hasMoneyAndCanGrow);
    let growableServerList = serverList.filter(serv => hasMoneyAndCanGrow(ns, serv));
    let growableServerObj = [];
    serverList.forEach(e => growableServerObj.push(ns.getServer(e)));
    ns.tprint(growableServerObj.length);
    let max = 0;
    growableServerObj =growableServerObj.filter(e => {
        if (e.requiredHackingSkill > ns.getHackingLevel()){
            return false;
        }
        
        if (ns.hackAnalyzeChance(e.hostname)* e.moneyMax * e.serverGrowth > max){
            max = ns.hackAnalyzeChance(e.hostname)* e.moneyMax * e.serverGrowth /100000000 ;
            ns.tprint('max for target: ',e.hostname, " ", max);
        }
        return true;
       });
}
/** @param @param {import(".").NS } ns **/
function hasMoneyAndCanGrow(ns, target){
    return (ns.getServerMaxMoney(target) > 0 && ns.getServerGrowth(target) > 0);
}


