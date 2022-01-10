/**
 * 
 * 
 */
/** @param @param {import(".").NS } ns **/
export async function main(ns) {
    
    let target = ns.args[0];
    let folder = '/BitBurner-scripts/';
    let scripts = [folder+'weaken.js', folder+'grow.js', folder+'hack.js',folder+'prime.js'];

    ns.scp(scripts, 'home', target);
    ns.tprint("hello");
}