/**
 * 
 * 
 */
/** @param @param {import(".").NS } ns **/
export async function main(ns) {
    let kill = ns.args[0] ?? 0;
    if (kill == 1){
        for (let i =0;i<25;i++){
            ns.killall('chad-'+i);
            }
            return ;
    }
    for (let i =0;i<25;i++){
        let freeRam = ns.getServerMaxRam('chad-'+i) - ns.getServerUsedRam('chad-'+i);
        ns.exec('BitBurner-scripts/weakenloop.js','chad-'+i,Math.floor(freeRam/1.75),'joesguns');
        }
}