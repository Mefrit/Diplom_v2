import { SmartAgro } from "../globalstrategies/globalSmartAgro";
import { DistanceAgro } from "../globalstrategies/globalDistanceAgro";
import { ProtectArchers } from "../globalstrategies/globalProtectArchers";
import { UndercoverArcherAttack } from "../globalstrategies/globalUndercoverArcherAttack";
// import{BaitStrategy} from "../globalstrategies/globalBaitStrategy";
export const cacheGlobalAI = [
    DistanceAgro, // стратегия основанная на дистанционных атаках
    ProtectArchers, // стратегия поведения при защите юнитов дальнего боя
    SmartAgro, // атакующая стратегия
    UndercoverArcherAttack, // атакующая стратегия используящая дистанционные атаки при сближении противников
    // BaitStrategy, // стратегия приманки
];
// export const cacheGlobalAI = [SmartAgro];
