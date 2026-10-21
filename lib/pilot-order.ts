export type Stage = "offer" | "deposit" | "onboarding" | "balance" | "approval" | "complete";
export type Action = "accept" | "deposit_test" | "onboard" | "balance_test" | "approve";
export type Order = {
 stage: Stage;
 termsAccepted: boolean;
 depositVerified: boolean;
 onboardingComplete: boolean;
 balanceVerified: boolean;
 publicationApproved: boolean;
};
export const PRICE = 590;
export const DEPOSIT = 295;
export const BALANCE = PRICE - DEPOSIT;
export const INITIAL: Order = {stage:"offer",termsAccepted:false,depositVerified:false,onboardingComplete:false,balanceVerified:false,publicationApproved:false};
export function transition(current:Order,action:Action):Order {
 switch(action){
 case "accept":
   if(current.stage!=="offer" || !current.termsAccepted) throw new Error("Hyväksy ehdot ennen jatkamista.");
   return {...current,stage:"deposit"};
 case "deposit_test":
   if(current.stage!=="deposit") throw new Error("Ennakkomaksuvaihe ei ole avoinna.");
   return {...current,stage:"onboarding",depositVerified:true};
 case "onboard":
   if(current.stage!=="onboarding" || !current.depositVerified) throw new Error("Ennakkomaksun vahvistus puuttuu.");
   return {...current,stage:"balance",onboardingComplete:true};
 case "balance_test":
   if(current.stage!=="balance" || !current.onboardingComplete) throw new Error("Onboarding on kesken.");
   return {...current,stage:"approval",balanceVerified:true};
 case "approve":
   if(current.stage!=="approval" || !current.balanceVerified) throw new Error("Loppumaksun vahvistus puuttuu.");
   return {...current,stage:"complete",publicationApproved:true};
 }
}
