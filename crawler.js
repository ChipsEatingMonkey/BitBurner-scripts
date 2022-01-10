/**
 * 
 * 
 */
/** @param @param {import(".").NS } ns **/
export async function main(ns) {
    
    let serverList =['home'];
    let resultList = scanServer(ns, serverList);
    ns.tprint(resultList);
}


function scanServer(ns,connectionList){

    for (let server of connectionList){
        let list = ns.scan(server);
        for (let s of list){
            if (!connectionList.includes(s)){
                connectionList.push(s);
            }
        }
    }
    return connectionList;

}