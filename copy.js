/**
 * 
 * 
 */
/** @param @param {import(".").NS } ns **/
export async function main(ns) {
    
    let target = ns.args[0] ?? 'n00dles';
    let chadAll = ns.args[1] ?? 0;
    let folder = '/BitBurner-scripts/';
    let scripts = [folder+'weaken.js', folder+'grow.js', folder+'hack.js',folder+'prime.js', folder+'weakenloop.js'];
    if (chadAll == 1){
        for (let i = 0; i < 25; i++){
            await ns.scp(scripts, 'home', 'chad-'+i);
        }
        return;
    }
    await ns.scp(scripts, 'home', target);
}