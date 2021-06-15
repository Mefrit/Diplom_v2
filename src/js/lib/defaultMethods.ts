export class DefaultMethodsStrategy {
    scene: any;
    view: any;
    unit_collection: any;
    global_cache: any;
    unit: any;
    constructor(props) {
        this.scene = props.scene;
        this.view = props.view;
        this.unit_collection = props.unit_collection;
        this.global_cache = props.global_cache;
        this.unit = props.unit;
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
            if (element.person.evil && !element.isNotDied() && element.person.class == "archer") {
                tmp_x = unit.person.x - element.person.x;
                tmp_y = unit.person.y - element.person.y;
                tmp_min = Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y);
                if (min > tmp_min && (unit.x != element.x || unit.y != element.y)) {
                    min = tmp_min;
                    nearArcher = element;
                }
            }
        });
        return nearArcher;
    }
    // getDistanceBetweenUnits(unit1, unit2) {
    //     // }
    //     let tmp_x, tmp_y;
    //     if (unit1.hasOwnProperty("person") && unit2.hasOwnProperty("person")) {
    //         tmp_x = unit1.person.x - unit2.person.x;
    //         tmp_y = unit1.person.y - unit2.person.y;
    //     } else {
    //         tmp_x = unit1.x - unit2.x;
    //         tmp_y = unit1.y - unit2.y;
    //     }

    //     return Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y);
    // }
    getDistanceBetweenUnits(unit1, unit2) {
        // }
        let tmp_x, tmp_y;
        // if (unit1.hasOwnProperty("person") && unit2.hasOwnProperty("person")) {
        //     tmp_x = unit1.person.x - unit2.person.x;
        //     tmp_y = unit1.person.y - unit2.person.y;
        // } else {
        tmp_x = unit1.x - unit2.x;
        tmp_y = unit1.y - unit2.y;
        // }
        // console.log(
        //     "tmp_x",
        //     tmp_x,
        //     tmp_y,
        //     Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y),
        //     unit1.person.x,
        //     "-",
        //     unit2.x,
        //     "yyyyyyyy",
        //     unit1.y,
        //     "-",
        //     unit2.person.y,
        //     "!!!!!!!!!!!!!",
        //     unit1,
        //     unit2
        // );
        return Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y);
    }
    deleteBusyEnemies(cache_enemies, units_purpose) {
        let find = false;

        return cache_enemies.filter((enemies) => {
            units_purpose.forEach((elem) => {
                if (elem.enemie.person.id == enemies.person.id) {
                    find = true;
                }
            });
            // Может сломатьбся
            // if (find && this.unit.person.id != enemies ) {
            if (find) {
                find = false;
                return find;
            }
            return true;
        });
    }
    checkEnemyInCache(id_person, cache_busy_enemies) {
        return cache_busy_enemies.filter((element) => {
            if (element.id == id_person && !!element.enemie) {
                return element.enemie;
            }
        });
    }
    findNearestEnemies(unit, cache_busy_enemies = []) {
        let min = 1000,
            nearEnemies = undefined,
            tmp_min = 1000;
        let enemy_in_cache = this.checkEnemyInCache(unit.person.id, cache_busy_enemies);

        if (enemy_in_cache.length > 0) {
            return enemy_in_cache[0];
        }

        let unit_collection = this.unit_collection.getUserCollection();

        // можно 2м 1го бить, но это нужно чекать, но лучники выбирают уникально, если они рядом
        if (cache_busy_enemies.length > 0 && this.isArchers(unit)) {
            unit_collection = this.deleteBusyEnemies(unit_collection, cache_busy_enemies);
        }

        unit_collection.forEach((element) => {
            tmp_min = this.getDistanceBetweenUnits(unit, element);

            if (min > tmp_min) {
                min = tmp_min;

                nearEnemies = element;
            } else {
                if (typeof nearEnemies == "undefined") {
                    nearEnemies = element;
                }
            }
        });

        return nearEnemies;
    }
    checkFreeCoordWalls(cache, unit) {
        let result = false;
        cache.forEach((element) => {
            if (element.x == unit.x && element.y == unit.y) {
                result = true;
            }
        });
        return result;
    }
    //указывает на лучшую  точку
    deleteExcessCoord(cahceCoord = []) {
        // console.log("this.scene", this.scene.get("wall_locks"));
        let wall_blocks = this.scene.get("wall_blocks"),
            water_blocks = this.scene.get("water_blocks");
        return cahceCoord.filter((elem) => {
            if (elem.x >= 0 && elem.x < 12) {
                if (elem.y >= 0 && elem.y < 8) {
                    if (this.unit.x == elem.x && this.unit.y == elem.y) {
                        return elem;
                    }
                    // console.log(this.checkFreeCoordWalls(wall_blocks, elem));
                    if (
                        this.unit_collection.checkFreeCoord({ x: elem.x, y: elem.y }) &&
                        !this.checkFreeCoordWalls(wall_blocks, elem) &&
                        !this.checkFreeCoordWalls(water_blocks, elem)
                    ) {
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
    };
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
    heuristic(a, b, type, enemies = []) {
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
                enemies_near_3.forEach((elem) => {
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
    checkArchersPosition() {
        let archers = this.unit_collection.getAiArchers(),
            result = false;
        archers.forEach((archer) => {
            if (archer.x == this.unit.x || this.unit.y == archer.y) {
                if (this.getDistanceBetweenUnits(this.unit, archer) < 4) {
                    result = true;
                }
            }
        });
        return result;
    }
    deleteExistPointIfArcherNear(points, enemie) {
        let archers = this.unit_collection.getAiArchers(),
            result = true;
        return points.filter((point) => {
            result = true;
            archers.forEach((archer) => {
                if (archer.x == point.x || point.y == archer.y) {
                    if (this.getDistanceBetweenUnits(point, archer) < 4) {
                        result = false;
                    }
                }
            });
            if (result) {
                if (parseInt(this.getDistanceBetweenUnits(point, enemie).toFixed(0)) <= 1.2) {
                    return {
                        point,
                    };
                }
            }
        });
    }
    checkArcherPosition(enemie) {
        // провеяет что бы персонаж старался не находиться на линии удара лучника если атакуеть
        let res = { point: { x: enemie.x - 1, y: enemie.y }, result: false },
            points = [],
            min_count = 1000,
            count_enemy = 0,
            tmp_res;

        if (parseInt(this.getDistanceBetweenUnits(this.unit, enemie).toFixed(0)) == 2) {
            points = this.getPointsField(this.unit, 1);
        } else {
            points = this.getPointsField(enemie, 1);
        }

        points = this.deleteExistPointIfArcherNear(points, enemie);

        if (points.length == 0) {
            res.result = false;
        } else {
            res.result = true;
        }
        points.forEach((elem) => {
            count_enemy = this.getEnemyInField(elem, 3).length;

            if (min_count > count_enemy) {
                res.point = elem;
                min_count = count_enemy;
            } else {
                if (min_count == count_enemy) {
                    if (this.getEnemyInField(elem, 2).length < this.getEnemyInField(res.point, 2).length) {
                        res.point = elem;
                    }
                }
            }
        });
        return res;
    }
    checkUnitNotStatyOnArhcersAtacke(unit, units_purpose, cache_archers) {
        // првоеряет по хорошему, что юнит не стоит на позиции атаки лучника
        let result = false;
        units_purpose.forEach((element) => {
            console.log("result", result);
        });
    }
    // автоматический путь к задангным координатам без учета возможных опасностей
    moveAutoStepStupid = (unit, obj2go, type = "fighter") => {
        // нужн окак то придумать, что бы можно было обходить препятствия и строить оптимальный путь

        // хранит путь до точки
        let pointsNear,
            res = { findEnime: false, enemie: obj2go, type: type };

        let current = { id: 0, x: unit.person.x, y: unit.person.y },
            came_from = {},
            frontier: any = [], //граница
            cost_so_far = [],
            new_cost,
            priority,
            bestPoint,
            coefProximity = type == "archer" ? 1 : 2;

        came_from[0] = NaN;
        cost_so_far[0] = 0;

        pointsNear = this.getNeighbors({ x: unit.person.x, y: unit.person.y }, type);
        pointsNear = this.deleteExcessCoord(pointsNear);

        if (!obj2go.hasOwnProperty("domPerson")) {
            pointsNear.push({
                x: unit.x,
                y: unit.y,
            });
        }
        if (type == "stupid" && this.getDistanceBetweenUnits(obj2go, unit) < 3) {
            pointsNear.push({
                x: obj2go.x,
                y: obj2go.y,
            });
        }
        pointsNear.forEach((next, index, arr) => {
            next.id = unit.person.x + unit.person.y + index;
            new_cost = cost_so_far[current.id] + 1;
            if (cost_so_far.indexOf(next.id) == -1 || new_cost < cost_so_far[next.id]) {
                cost_so_far[next.id] = new_cost;
                // priority = this.heuristic({ x: nearEnemie.person.x, y: nearEnemie.person.y }, next);

                priority = this.heuristic({ x: obj2go.x, y: obj2go.y }, next, type, []);
                frontier.push({ next: next, priority: priority });
                came_from[next.id] = current;
            }
        });

        bestPoint = frontier[0];
        // frontier = this.shuffle(frontier);
        frontier.forEach((element) => {
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
        current = { id: 0, x: unit.person.x, y: unit.person.y };

        res.findEnime = this.checkPersonNear(current, obj2go, coefProximity);
        if (res.findEnime) {
            unit.removePrevPoint();
        }
        return res;
    };
    isArchers(unit) {
        return unit.person.class == "archer";
    }
    moveCarefully = (unit, obj2go, type, cache: any = {}) => {
        var pointsNear,
            res = { findEnime: false, enemie: obj2go, type: type };
        var current = { id: 0, x: unit.person.x, y: unit.person.y },
            came_from = {},
            frontier: any = [], //граница
            cost_so_far = [],
            new_cost,
            priority,
            bestPoint,
            coefProximity = type == "archer" ? 1 : 2;
        came_from[0] = NaN;
        cost_so_far[0] = 0;
        pointsNear = this.getNeighbors({ x: unit.person.x, y: unit.person.y }, type);
        pointsNear = this.deleteExcessCoord(pointsNear);
        if (!obj2go.hasOwnProperty("domPerson")) {
            pointsNear.push({
                x: unit.x,
                y: unit.y,
            });
        }
        let enemies_near_3: any;

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
                        priority = this.heuristicSecurityArcher(
                            { x: obj2go.x, y: obj2go.y },
                            next,
                            type,
                            obj2go.near_archer
                        );
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
        frontier.forEach((element) => {
            if (element.priority <= bestPoint.priority) {
                bestPoint = element;
            }
        });

        if (frontier.length > 0) {
            this.moveTo(unit, bestPoint.next);
        }
        current = { id: 0, x: unit.person.x, y: unit.person.y };
        res.findEnime = this.checkPersonNear(current, obj2go, coefProximity);
        if (res.findEnime) {
            unit.removePrevPoint();
        }
        return res;
    };
    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }
    checkPersonNear(current, person, coefProximity) {
        return Math.abs(current.x - person.x) < coefProximity && Math.abs(current.y - person.y) < coefProximity;
    }
    // проверяет  обстановку вокруг лучника, если враг рядом, то передается координаты врага
    checkFreePointsArcher(points, type = "fighter", curent_unit = this.unit) {
        let res = { free: true, deleteLastPoint: false, runAway: false };
        //    alert("points"+ points+curent_unit.person.id);
        let wall_blocks = this.scene.get("wall_blocks");
        this.unit_collection.getCollection().forEach((unit) => {
            for (let i = 0; i < points.length; i++) {
                if (points[i].x < 0 || points[i].x > 11) {
                    res.free = false;
                }
                if (points[i].y < 0 || points[i].y > 8) {
                    res.free = false;
                }
                if (unit.x == points[i].x && points[i].y == unit.y) {
                    if (unit.person.id != curent_unit.person.id) {
                        // if (!unit.person.evil && Math.abs(unit.x - points[i].x) < 3) {
                        //     res.runAway = true;
                        // }

                        res.free = false;
                    } else {
                        res.deleteLastPoint = true;
                    }
                }
                // console.log(this.checkFreeCoordWalls(wall_blocks, points[i]));
                if (this.checkFreeCoordWalls(wall_blocks, points[i])) {
                    res.free = false;
                }
            }
        });
        if (this.getEnemyInField(curent_unit, 5).length > 0) {
            res.runAway = true;
        }

        return res;
    }
    getCoordForArcher(unit, enemie) {
        let res_check;
        if (Math.abs(unit.y - enemie.y) <= 2) {
            res_check = this.checkFreeWay2Atack(enemie, this.unit, "x");
            if (res_check.free) {
                return res_check.arrayPoit;
            }
        }
        if (enemie.y < 4) {
            return { x: enemie.x, y: 0 };
        } else {
            return { x: enemie.x, y: 7 };
        }
    }
    // получить валидные точки вокруг, с определенным диапазоном
    getPointsField(coord_unit, field_step) {
        let cache_points = [];

        for (let i = -field_step; i < field_step + 1; i++) {
            for (let j = -field_step; j < field_step + 1; j++) {
                cache_points.push({ x: coord_unit.x + i, y: coord_unit.y + j });
            }
        }
        cache_points = this.deleteExcessCoord(cache_points);
        return cache_points;
    }
    getCoordForAtackeForrwarArcher(unit, enemie, type = "default", free = true) {
        let friend_2 = this.getFriendsInField(unit, 2),
            enemy = this.findNearestEnemies(unit, []),
            coord = { x: enemie.x, y: enemie.y - 1 };

        friend_2.forEach((element) => {
            if (type == "StayForwardArcher") {
                if (element.x == unit.x || element.y == unit.y) {
                    if (
                        this.unit_collection.checkFreeCoord({ x: element.x + 1, y: element.y }) &&
                        this.getDistanceBetweenUnits({ x: element.x + 1, y: element.y }, enemy) > 1
                    ) {
                        coord = { x: element.x + 2, y: element.y };
                    } else {
                        if (
                            this.unit_collection.checkFreeCoord({ x: element.x, y: element.y + 1 }) &&
                            this.getDistanceBetweenUnits({ x: element.x, y: element.y + 1 }, enemy) > 1
                        ) {
                            coord = { x: element.x, y: element.y + 2 };
                        } else {
                            if (
                                this.unit_collection.checkFreeCoord({ x: element.x, y: element.y - 1 }) &&
                                this.getDistanceBetweenUnits({ x: element.x, y: element.y - 1 }, enemy) > 1
                            ) {
                                coord = { x: element.x, y: element.y - 2 };
                            }
                        }
                    }
                }
            }
        });
        return coord;
    }
    //выбрать более крутую позицию для атаки с учетом своих юнитов
    getCoordForAtacke(unit, enemie, type = "default", free = true) {
        // console.log(enemie);
        let friend_2 = this.getFriendsInField(unit, 2),
            enemy,
            res,
            coord = { x: enemie.x, y: enemie.y - 1 };

        if (free) {
            // if (enemie.x < unit.x) {
            //     coord = { x: enemie.x - 1, y: enemie.y };
            // } else {
            //     coord = { x: enemie.x + 1, y: enemie.y };
            // }
            coord = this.maxFreeLineForArcher(enemie, "x");
        } else {
            coord = this.maxFreeLineForArcher(enemie, "y");
            // if (enemie.y > 4) {
            //     coord = { x: enemie.x, y: 0 };
            // } else {
            //     coord = { x: enemie.x, y: 7 };
            // }
        }
        return coord;
    }
    maxFreeLineForArcher(coord, direction) {
        let arr_up = [],
            arr_down = [];

        if (direction == "y") {
            // console.log(
            //     "coord.ycoord.ycoord.ycoord.ycoord.ycoord.ycoord.ycoord.ycoord.ycoord.ycoord.ycoord.y",
            //     coord.y,
            //     coord.y >= 0
            // );
            for (let i = coord.y - 1; i >= 0; i--) {
                arr_up.push({ x: coord.x, y: i });
            }
            for (let i = coord.y + 1; i <= 8; i++) {
                arr_down.push({ x: coord.x, y: i });
            }
        } else {
            for (let i = 0; i < coord.x; i++) {
                arr_up.push({ x: i, y: coord.y });
            }
            for (let i = coord.x + 1; i <= 12; i++) {
                arr_down.push({ x: i, y: coord.y });
            }
        }

        arr_up = this.findFreeLine(arr_up);
        arr_down = this.findFreeLine(arr_down);
        console.log("a!!!!!!!!!!rr_up", arr_up, arr_down, coord.domPerson, direction);
        // arr_down = this.deleteExcessCoord(arr_arr_downup);
        // if (
        //     this.unit_collection.checkFreeCoord({ x: elem.x, y: elem.y }) &&
        //     !this.checkFreeCoordWalls(wall_blocks, elem)
        // ) {
        //     return elem;
        // }
        return arr_up.length > arr_down.length ? arr_up[arr_up.length - 1] : arr_down[arr_down.length - 1];
    }
    findFreeLine(cache) {
        let wall_blocks = this.scene.get("wall_blocks");
        let water_blocks = this.scene.get("water_blocks");
        let new_cache = [],
            find_closed_area = false;
        cache.forEach((elem, index, arr) => {
            if (
                this.unit_collection.checkFreeCoord({ x: elem.x, y: elem.y }) &&
                !this.checkFreeCoordWalls(wall_blocks, elem) &&
                !find_closed_area
            ) {
                if (index == arr.length - 1) {
                    if (!this.checkFreeCoordWalls(water_blocks, elem)) {
                        new_cache.push(elem);
                    }
                } else {
                    new_cache.push(elem);
                }
            } else {
                find_closed_area = true;
            }
        });
        return new_cache;
    }
    // получить всех врагов какойто либбо области
    // getEnemyInField(coord_unit, field_step) {
    //     return this.unit_collection.getUserCollection().filter((elem) => {
    //         if (this.checkPersonNear(coord_unit, elem, field_step) && elem.person.health > 10) {
    //             return elem;
    //         }
    //     });
    // }
    getEnemyInField(coord_unit, field_step) {
        return this.unit_collection.getUserCollection().filter((elem) => {
            if (this.getDistanceBetweenUnits(coord_unit, elem) < field_step) {
                return elem;
            }
        });
    }
    getFriendsInField(coord_unit, field_step) {
        return this.unit_collection.getAICollection().filter((elem) => {
            // console.log(coord_unit.domPerson, elem.domPerson, this.getDistanceBetweenUnits(coord_unit, elem));
            if (coord_unit.person.id != elem.person.id && this.getDistanceBetweenUnits(coord_unit, elem) < field_step) {
                return elem;
            }
        });
    }
    getArchersInField(coord_unit, field_step) {
        return this.unit_collection.getAICollection().filter((elem) => {
            if (elem.person.class == "archer") {
                if (this.checkPersonNear(coord_unit, elem, field_step)) {
                    return elem;
                }
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
                y: cacheUnits[0].y,
            },
            hypotenuse_min,
            hypotenuse_elem;
        //FIX ME если придется добавлять препятствие, то этот кусок кода нужно бюудет переписывать
        // тк данные будут невалидные
        cacheUnits.forEach((elem) => {
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
    checkFreeWay2Atack(enemie, unit = this.unit, direction = "x") {
        // показывает свободен ли путь для атаки из далека
        // direction - направление по которому будем атаковать
        let arrayPoit = [],
            sgn = enemie[direction] < unit[direction] ? -1 : 1,
            tmp,
            res = { free: false, arrayPoit: [], direction: direction, runAway: false },
            coefI;
        tmp = Math.abs(enemie[direction] - unit[direction]);

        if (tmp <= 4) {
            coefI = tmp;
        } else {
            return res;
        }
        for (let i = 1; i <= coefI - 1; i++) {
            tmp = direction == "x" ? { x: enemie.x - sgn * i, y: enemie.y } : { x: enemie.x, y: enemie.y - sgn * i };
            arrayPoit.push(tmp);
        }
        tmp = this.checkFreePointsArcher(arrayPoit, "archer", unit);

        res.free = tmp.free;
        res.runAway = tmp.runAway;
        if (tmp.deleteLastPoint) {
            arrayPoit.splice(arrayPoit.length - 1, 1);
        }
        res.arrayPoit = arrayPoit;

        return res;
    }
}
