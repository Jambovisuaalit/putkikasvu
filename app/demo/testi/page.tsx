import type {Metadata} from "next";
import OrderFlow from "./order-flow";
export const metadata:Metadata={title:"Testidemo | Putkikasvu",description:"Koko Putkikasvu-tilauspolun turvallinen maksuton testaus.",robots:{index:false,follow:false,noarchive:true}};
export default function Page(){return <OrderFlow/>}
