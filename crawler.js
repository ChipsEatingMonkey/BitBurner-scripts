/**
 * 
 * 
 */
/** @param @param {import(".").NS } ns **/
export async function main(ns) {
    
    let serverList =['home'];
    let resultList = scanServer(ns, serverList);
    while (resultList.lenght > serverList.length){
        serverList = resultList;
        resultList = scanServer(ns, serverList);
    }
    ns.tprint(resultList);
}


function scanServer(ns,connectionList){
    let isDeadEnd = true;

    for (let server of connectionList){
        let list = ns.scan(server);
        for (let s of list){
            if (!connectionList.includes(s)){
                connectionList.push(s);
                isDeadEnd = false;
            }
        }
    }
    return connectionList;

}