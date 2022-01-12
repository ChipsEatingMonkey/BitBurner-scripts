/**
 * 
 * 
 */
/** @param @param {import(".").NS } ns **/
export async function main(ns) {
    
    let target = ns.args[0] ?? 'n00dles';
    let chadAll = ns.args[1] ?? 1;
    let folder = '/BitBurner-scripts/';
    let scripts = [folder+'weaken.js', folder+'grow.js', folder+'hack.js',folder+'prime.js', folder+'weakenloop.js'];
    if (chadAll == 1){
        for (let i = 0; i < 25; i++){
            await ns.scp(scripts, 'home', 'chad-'+i);
        }
        return;
    }
    await ns.scp(scripts, 'home', target);

    while (loop > 1){
        await ns.scp(scripts, 'home','chad-'+loop);
        ns.exec(folder+'weakenloop.js','chad-'+loop,Math.floor((2**20)/1.75),'joesguns');
        loop--;
    }
}