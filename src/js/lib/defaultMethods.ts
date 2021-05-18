
export class DefaultMethodsStrategy {
    scene: any;
    view: any;
    unit_collection: any;
    constructor(props) {
        this.scene = props.scene;
        this.view = props.view;
        this.unit_collection = props.unit_collection;
    }
    // моментальный перевод
    moveTo(person, coord) {
        // тут нужна проаверка на лучшее место для удара
        person.setCoord(coord.x, coord.y);
        this.unit_collection.updateElement(person);
        this.scene.renderElement(person);
        //
    }

    // получить ближайшего союзника лучника
    findNearestArchers(unit) {
        //плохо, нужно это объединить и оптимизировать
        let min = 1000,
            nearArcher = undefined,
            tmp_x,
            tmp_y,
            tmp_min = 1000;
        this.unit_collection.getCollection().forEach((element) => {
            if (element.person.evil && !element.isNotDied() && element.person.class == 'archer') {
                // console.log();

                tmp_x = unit.person.x - element.person.x;
                tmp_y = unit.person.y - element.person.y;

                tmp_min = Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y);
                if (min > tmp_min && (unit.x != element.x || unit.y != element.y)) {
                    min = tmp_min;
                    nearArcher = element;
                }
            }
        });
        // console.log("findNearestEnemies=>", unit, nearEnemies);
        return nearArcher;
    }
    getDistanceBetweenUnits(unit1, unit2) {
        let tmp_x = unit1.person.x - unit2.person.x;
        let tmp_y = unit1.person.y - unit2.person.y;

        return Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y);
    }
    findNearestEnemies(unit) {
        let min = 1000,
            nearEnemies = undefined,
            tmp_min = 1000;

        // this.unit_collection.getCollection().forEach((element) => {
        //     if (!element.person.evil && !element.isNotDied()) {
        //         tmp_min = this.getDistanceBetweenUnits(unit, element)
        //         if (min > tmp_min) {
        //             min = tmp_min;
        //             nearEnemies = element;
        //         }
        //     }
        // });
        this.unit_collection.getUserCollection().forEach((element) => {

            tmp_min = this.getDistanceBetweenUnits(unit, element)
            if (min > tmp_min) {
                min = tmp_min;
                nearEnemies = element;
            }

        });
        return nearEnemies;
    }
    //указывает на лучшую  точку
    deleteExcessCoord(cahceCoord = []) {

        return cahceCoord.filter((elem) => {
            if (elem.x >= 0 && elem.x < 11) {
                if (elem.y >= 0 && elem.y < 6) {
                    if (this.unit.x == elem.x && this.unit.y == elem.y) {
                        return elem;
                    }
                    if (this.unit_collection.checkFreeCoord({ x: elem.x, y: elem.y })) {
                        return elem;
                    }
                }
            }
        });
    }
    getNeighbors = (coord, type = "figter") => {
        let res = [];

        res = this.getPointsField(coord, 2);

        res.push({ x: this.unit.x, y: this.unit.y });
        return res;
    }
    //проверка на то что эта точка новая
    checkCameFromEmpty(cameFrom, point) {
        let res = true;
        cameFrom.forEach((element) => {
            if (element.x == point.x && element.y == point.y) {
                res = false;
            }
        });
        return res;
    }
    // type предназначен для того, что бы лучше выбирать точкки для  лучника
    heuristic(a, b, type) {
        let res = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        switch (type) {
            case "archer":
                // console.log("archer =>>> ", a, b, Math.abs(a.x - b.x));
                if (Math.abs(a.x - b.x) < 4) {
                    res += 10;
                    if (Math.abs(a.x - b.x) < 3) {
                        res += 10;
                    }
                    if (Math.abs(a.x - b.x) < 2) {
                        res += 40;
                    }
                } else {
                    if (Math.abs(a.x - b.x) > 4) {
                        res += Math.abs(a.x - b.x) + 10;
                    }
                }
                if (Math.abs(a.x - b.x) < 1) {
                    res += 0.5;
                }
                if (Math.abs(a.y - b.y) < 2) {
                    res += Math.abs(a.y - b.y);
                }
                if (Math.abs(a.y - b.y) < 3) {
                    res += Math.abs(a.y - b.y) + 5;
                }
                if (Math.abs(a.y - b.y) >= 3) {
                    res += Math.abs(a.y - b.y) + 10;
                }

                break;
            default:
                // if (a.x == b.x || a.y == b.y) {
                //     res += 1;
                // }
                // if (Math.abs(a.x - b.x) > 3) {
                res += Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
                // }
                break;
        }

        // if (b.x == 0 || b.y == 0) {
        //     res += 1;
        // }
        return res;
    }
    heuristicSecurityArcher(a, b, type, near_archer) {
        //a - куда нужно, b - возможные варианты
        let res = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        res += Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        // if()
        // console.log("heuristicSecurityArcher", a, b, near_archer);
        if (b.x == near_archer.x) {
            res += 20;
        }

        if (b.y == near_archer.y) {
            res += 20;
        }
        if (b.x == a.x && b.y == a.y) {
            res -= 60;
        }


        return res;
    }
    heuristicCarefully(a, b, type, enemies_near_3) {
        let res = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        switch (type) {
            case "archer":

                if (Math.abs(a.x - b.x) < 4) {
                    res += 10;
                    if (Math.abs(a.x - b.x) < 3) {
                        res += 10;
                    }
                    if (Math.abs(a.x - b.x) < 2) {
                        res += 40;
                    }
                } else {
                    if (Math.abs(a.x - b.x) > 4) {
                        res += Math.abs(a.x - b.x) + 10;
                    }
                }
                if (Math.abs(a.x - b.x) < 1) {
                    res += 0.5;
                }

                // if (Math.abs(a.y - b.y) < 3) {
                //     res += 10;
                // }
                if (a.x == b.x) {
                    res -= 10;
                }
                if (a.y == b.y) {
                    res -= 10;
                }
                if (a.x == b.x && Math.abs(a.y - b.y) > 3) {
                    res -= 10;
                }
                if (a.x == b.x && Math.abs(a.y - b.y) > 2) {
                    res -= 20;
                }
                if (a.x == b.x && Math.abs(a.y - b.y) > 1) {
                    res -= 40;
                }

                if (Math.abs(a.y - b.y) < 2) {
                    res += Math.abs(a.y - b.y);
                }
                if (Math.abs(a.y - b.y) < 3) {
                    res += Math.abs(a.y - b.y) + 5;
                }
                if (Math.abs(a.y - b.y) >= 3) {
                    res += Math.abs(a.y - b.y) + 10;
                }
                break;
            default:
                res += Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
                // if ()
                enemies_near_3.forEach(elem => {

                    if (Math.abs(elem.y - b.y) < 2 && Math.abs(elem.x - b.x) < 2) {

                        res += 1;
                    }
                    // }
                });
                // если есть возможность идти но не идется
                // if (Math.abs(b.y - this.unit.y) < 3 && Math.abs(b.x - this.unit.x) < 3) {

                //     if (Math.abs(b.y - this.unit.y) >= 0 && Math.abs(b.x - this.unit.x) >= 0) {
                //         res += 3;
                //     }
                // }

                break;
        }
        return res;
    }
    checkArcherPosition(enemie) {
        // провеяет что бы персонаж старался не находиться на линии удара лучника если атакуеть
        let res = { point: {}, result: false }
        if (Math.abs(enemie.x - this.unit.x) < 2) {

            if (this.checkFreePointsArcher({ x: enemie.x, y: enemie.y - 1 })) {
                res.result = true;
                res.point = { x: enemie.x, y: enemie.y - 1 }
                return res;
            }
            if (this.checkFreePointsArcher({ x: enemie.x, y: enemie.y + 1 })) {
                res.result = true;
                res.point = { x: enemie.x, y: enemie.y + 1 }
                return res;
            }
        } else {
            if (Math.abs(enemie.y - this.unit.y) < 2) {
                if (this.checkFreePointsArcher({ x: enemie.x - 1, y: enemie.y })) {
                    res.result = true;

                    res.point = { x: enemie.x - 1, y: enemie.y }
                    return res;
                }
                if (this.checkFreePointsArcher({ x: enemie.x + 1, y: enemie.y })) {
                    res.result = true;
                    res.point = { x: enemie.x + 1, y: enemie.y }
                    return res;
                }
            }
        }

        return res;
    }
    // автоматический путь к задангным координатам без учета возможных опасностей
    moveAutoStepStupid = (unit, obj2go, type = "fighter") => {
        // нужн окак то придумать, что бы можно было обходить препятствия и строить оптимальный путь

        // хранит путь до точки

        let pointsNear, res = { findEnime: false, enemie: obj2go, type: type };
        // console.log("obj2go \n", obj2go);
        let current = { id: 0, x: unit.person.x, y: unit.person.y }, came_from = {},
            frontier: any = [],//граница
            cost_so_far = [],
            new_cost, priority, bestPoint, coefProximity = type == "archer" ? 1 : 2;

        came_from[0] = NaN;
        cost_so_far[0] = 0;
        // console.log("unit =======>>>>  ", unit);
        pointsNear = this.getNeighbors({ x: unit.person.x, y: unit.person.y }, type);
        pointsNear = this.deleteExcessCoord(pointsNear);
        if (!obj2go.hasOwnProperty("domPerson")) {
            pointsNear.push({
                x: unit.x,
                y: unit.y
            });
        }
        pointsNear.forEach((next, index, arr) => {
            next.id = unit.person.x + unit.person.y + index;
            new_cost = cost_so_far[current.id] + 1;
            if (cost_so_far.indexOf(next.id) == -1 || new_cost < cost_so_far[next.id]) {
                cost_so_far[next.id] = new_cost;
                // priority = this.heuristic({ x: nearEnemie.person.x, y: nearEnemie.person.y }, next);

                priority = this.heuristic({ x: obj2go.x, y: obj2go.y }, next, type);
                frontier.push({ next: next, priority: priority });
                came_from[next.id] = current;
            }
        });

        bestPoint = frontier[0];
        // frontier = this.shuffle(frontier);
        // console.log("frontier points=> ", frontier);
        frontier.forEach(element => {

            if (element.priority <= bestPoint.priority) {
                // что бы искал пути, конечно это не панацея в более сложных ситуация фигурка будет тупить
                if (type == "archer") {
                    bestPoint = element;
                } else {
                    // написать по нормальному!!!!!

                    bestPoint = element;
                }
            }
        });
        if (frontier.length > 0) {
            this.moveTo(unit, bestPoint.next);
        }
        // console.log("\n frontier", frontier);
        current = { id: 0, x: unit.person.x, y: unit.person.y };

        // console.log("After MOve moveAutoStepStupid=>>>>>>>>>>>>in !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", current, bestPoint, coefProximity, this.checkEnemieNear(current, enemie, coefProximity), frontier);

        res.findEnime = this.checkEnemieNear(current, obj2go, coefProximity);
        if (res.findEnime) {
            unit.removePrevPoint();
        }
        return res;

    }
    moveCarefully = (unit, obj2go, type, cache = {}) => {

        // console.log("moveCarefully unit", unit);
        var pointsNear, res = { findEnime: false, enemie: obj2go, type: type };
        var current = { id: 0, x: unit.person.x, y: unit.person.y }, came_from = {},
            frontier: any = [],//граница
            cost_so_far = [],
            new_cost, priority, bestPoint, coefProximity = type == "archer" ? 1 : 2;
        came_from[0] = NaN;
        cost_so_far[0] = 0;
        pointsNear = this.getNeighbors({ x: unit.person.x, y: unit.person.y }, type);
        pointsNear = this.deleteExcessCoord(pointsNear);
        if (!obj2go.hasOwnProperty("domPerson")) {
            pointsNear.push({
                x: unit.x,
                y: unit.y
            });
        }
        var enemies_near_3;

        if (cache.hasOwnProperty("enemies_near_3")) {
            enemies_near_3 = cache.enemies_near_3;
        } else {
            enemies_near_3 = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 3);
        }
        pointsNear.forEach((next, index, arr) => {
            next.id = unit.person.x + unit.person.y + index;
            new_cost = cost_so_far[current.id] + 1;

            if (cost_so_far.indexOf(next.id) == -1 || new_cost < cost_so_far[next.id]) {
                cost_so_far[next.id] = new_cost;
                switch (type) {
                    case "fighter":
                        priority = this.heuristic({ x: obj2go.x, y: obj2go.y }, next, type, enemies_near_3);
                        break;
                    case "securityArcher":
                        priority = this.heuristicSecurityArcher({ x: obj2go.x, y: obj2go.y }, next, type, obj2go.near_archer);
                        break;
                    default:
                        priority = this.heuristicCarefully({ x: obj2go.x, y: obj2go.y }, next, type, enemies_near_3);
                        break;
                }


                frontier.push({ next: next, priority: priority });
                came_from[next.id] = current;
            }
        });

        bestPoint = frontier[0];

        // frontier = this.shuffle(frontier);
        frontier.forEach(element => {

            if (element.priority <= bestPoint.priority) {
                bestPoint = element;

            }
        });
        // console.log("frontier, bestPoint", frontier, bestPoint);
        if (frontier.length > 0) {
            this.moveTo(unit, bestPoint.next);
        }
        current = { id: 0, x: unit.person.x, y: unit.person.y };
        res.findEnime = this.checkEnemieNear(current, obj2go, coefProximity);
        if (res.findEnime) {
            unit.removePrevPoint();
        }
        return res;

    }
    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }
    checkEnemieNear(current, enemie, coefProximity) {
        //&&  !enemie.isNotDied()
        // console.log(current.x, "  -,  111", enemie.x, " || ", current.y - enemie.y, "coefProximity", coefProximity);
        return Math.abs(current.x - enemie.x) < coefProximity && Math.abs(current.y - enemie.y) < coefProximity;
    }
    // проверяет  обстановку вокруг лучника, если враг рядом, то передается координаты врага
    checkFreePointsArcher(points, type = "fighter") {
        let res = { free: true, deleteLastPoint: false, runAway: false };

        this.unit_collection.getCollection().forEach((unit) => {
            for (let i = 0; i < points.length; i++) {

                if (points[i].x < 0 || points[i].x > 11) {
                    res.free = false;
                }
                if (points[i].y < 0 || points[i].y > 5) {
                    res.free = false;
                }
                if (unit.x == points[i].x && points[i].y == unit.y) {
                    //FIX ME удалил, хрен знает зачем это было сделанно
                    // if (!(type == "archer" && i == points.length - 1)) {\c
                    // console.log("!!!!!!!!!!!!!!!!!!!", unit, this.unit, this.unit.x != unit.x, this.unit.y != unit.y);
                    if (this.unit.person.id != unit.person.id) {
                        if (!unit.person.evil && Math.abs(unit.x - points[i].x) < 3) {

                            res.runAway = true;
                        }

                        res.free = false;

                    } else {
                        res.deleteLastPoint = true;
                    }

                }
            }


        });
        // console.log("\n\n answer checkFreePointsArcher", res);
        return res;
    }
    // получить валидные точки вокруг, с определенным диапазоном
    getPointsField(coord_unit, field_step) {
        let cache_points = [];
        // console.log("coord_unit", coord_unit);

        for (let i = -field_step; i < field_step + 1; i++) {
            for (let j = -field_step; j < field_step + 1; j++) {
                // console.log({ x: coord_unit.x + i, y: coord_unit.y + j });
                // if (coord_unit.y + j == 5)
                //     console.log(coord_unit.x + i, coord_unit.y + j);
                cache_points.push({ x: coord_unit.x + i, y: coord_unit.y + j });
            }
        }
        cache_points = this.deleteExcessCoord(cache_points);
        return cache_points;
        // console.log("cache_points", cache_points);
    }
    // получить всех врагов какойто либбо области
    getEnemyInField(coord_unit, field_step) {
        // console.log("this.unit_collection.getUse\n\n\n\n", this.unit_collection.getUserCollection());
        // var points_near = this.getPointsField(coord_unit, field_step);
        return this.unit_collection.getUserCollection().filter(elem => {
            // console.log("\n\nelem", elem);
            if (this.checkEnemieNear(coord_unit, elem, field_step) && elem.person.health > 10) {
                return elem;
            }
        });
    }
    randomInteger(min, max) {
        // получить случайное число от (min-0.5) до (max+0.5)
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }
    getNearFriendsUnit(unit, cacheUnits) {
        var coord_min = {
            x: cacheUnits[0].x,
            y: cacheUnits[0].y
        }, hypotenuse_min, hypotenuse_elem;
        //FIX ME если придется добавлять препятствие, то этот кусок кода нужно бюудет переписывать
        // тк данные будут невалидные
        cacheUnits.forEach(elem => {
            if (unit.x != elem.x && unit.y != elem.y) {
                hypotenuse_min = coord_min.x * coord_min.x + coord_min.y * coord_min.y;
                hypotenuse_elem = elem.x * elem.x + elem.y * elem.y;
                if (hypotenuse_elem < hypotenuse_min) {
                    coord_min.x = elem.x;
                    coord_min.y = elem.y;
                }
            }
        });
        return coord_min;
    }
}
