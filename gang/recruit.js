/**
 * 
 * recruit all andis and train them
 */
/** @param @param {import("../.").NS } ns **/
export async function main(ns) {

    let memberList = ns.gang.getMemberNames();
    let andiNbr = 0;
    while (memberList.includes('andi-'+ andiNbr)){
        andiNbr++;
    }
    
    while (ns.gang.canRecruitMember()){
        let memberName = 'andi-' + andiNbr++;
        ns.gang.recruitMember(memberName);
        ns.gang.setMemberTask(memberName, "Train Combat");
    }
    ns.tprint("number of andis in gang is now: ",andiNbr);
}