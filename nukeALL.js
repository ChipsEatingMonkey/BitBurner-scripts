
/**
 * 
 * 
 */
/** @param @param {import(".").NS } ns **/
export async function main(ns) {
    
    let serverlist = ["n00dles","foodnstuff","sigma-cosmetics","joesguns","hong-fang-tea","harakiri-sushi","iron-gym","darkweb","chad-0","nectar-net","CSEC","zer0","max-hardware","neo-net","silver-helix","omega-net","phantasy","comptek","netlink","johnson-ortho","crush-fitness","avmnite-02h","the-hub","summit-uni","zb-institute","I.I.I.I","rothman-uni","syscore","catalyst","millenium-fitness","alpha-ent","lexo-corp","rho-construction","aevum-police","aerocorp","galactic-cyber","global-pharm","snap-fitness","omnia","unitalife","deltaone","defcomm","solaris","icarus","univ-energy","zeus-med","taiyang-digital","nova-med","infocomm","zb-def","microdyne","titan-labs","applied-energetics","run4theh111z","fulcrumtech","stormtech","vitalife","helios","4sigma","omnitek","kuai-gong",".","blade","b-and-a","nwo","powerhouse-fitness","clarkinc","megacorp","fulcrumassets","ecorp","The-Cave"];

    for (let server of serverlist){
        ns.brutessh(server);
        ns.ftpcrack(server);
        ns.httpworm(server);
        ns.sqlinject(server);
        ns.relaysmtp(server);
        ns.nuke(server);
    }
}