
import { SmartAgro } from "../globalstrategies/globalSmartAgro";
import { DistanceAgro } from "../globalstrategies/globalDistanceAgro";
import { ProtectArchers } from "../globalstrategies/globalProtectArchers";

// export const cacheGlobalAI = [SmartAgro];
export const cacheGlobalAI = [ProtectArchers, DistanceAgro, SmartAgro];