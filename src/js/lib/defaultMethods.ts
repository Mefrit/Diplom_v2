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
            tmp_min = 1000,
            min_friends_aroun = 0,
            friends;
        this.unit_collection.getCollection().forEach((element) => {
            if (element.person.evil && !element.isNotDied() && element.person.class == "archer") {
                tmp_x = unit.person.x - element.person.x;
                tmp_y = unit.person.y - element.person.y;
                tmp_min = Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y);

                if (min > tmp_min && (unit.x != element.x || unit.y != element.y)) {
                    min_friends_aroun = min = tmp_min;
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
        tmp_x = unit1.x - unit2.x;
        tmp_y = unit1.y - unit2.y;
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
            if (parseInt(element.x) == parseInt(unit.x) && parseInt(element.y) == parseInt(unit.y)) {
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
        let res = Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
            archers = this.unit_collection.getAiArchers();
        switch (type) {
            case "archer":
                res += 10 * this.getEnemyInField(b, 2);
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
                if (a.y == b.y && a.x == b.x) {
                    res -= 1000;
                }
                break;

            default:
                // if (a.x == b.x || a.y == b.y) {
                //     res += 1;
                // }
                // if (Math.abs(a.x - b.x) > 3) {

                archers.forEach((element) => {
                    if (this.getEnemyInField(element, 4).length > 3) {
                        if (element.x == b.x || element.y == b.y) {
                            res += 5;
                        }
                    } else {
                        if (element.x == b.x || element.y == b.y) {
                            res += 10;
                        }
                    }
                });

                res += Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
                res += Math.round(this.getDistanceBetweenUnits(a, b));
                if (a.y == b.y && a.x == b.x) {
                    res -= 1000;
                }
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
    checkNearArchersPosition() {
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
                    // if (this.getDistanceBetweenUnits(point, archer) < 5) {
                    result = false;
                    // }
                }
            });
            if (result && point) {
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
            count_enemy = 0;

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
        units_purpose.forEach((element) => {});
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
        pointsNear = this.deleteExcessCoord(pointsNear);
        pointsNear.forEach((next, index, arr) => {
            next.id = unit.person.x + unit.person.y + index;
            new_cost = cost_so_far[current.id] + 1;
            if (cost_so_far.indexOf(next.id) == -1 || new_cost < cost_so_far[next.id]) {
                cost_so_far[next.id] = new_cost;
                priority = this.heuristic({ x: obj2go.x, y: obj2go.y }, next, type, []);
                frontier.push({ next: next, priority: priority });
                came_from[next.id] = current;
            }
        });

        bestPoint = frontier[0];
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
        if (!curent_unit) {
            return res;
        }
        let wall_blocks = this.scene.get("wall_blocks");
        this.unit_collection.getCollection().forEach((unit) => {
            if (!unit.isNotDied()) {
                for (let i = 0; i < points.length; i++) {
                    if (points[i].x < 0 || points[i].x > 11) {
                        console.log("!1");
                        res.free = false;
                    }
                    if (points[i].y < 0 || points[i].y > 8) {
                        console.log("!2");
                        res.free = false;
                    }
                    if (unit.x == points[i].x && points[i].y == unit.y && curent_unit.hasOwnProperty("person")) {
                        if (unit.person.id != curent_unit.person.id) {
                            console.log("!3");
                            res.free = false;
                        } else {
                            res.deleteLastPoint = true;
                        }
                    }
                    if (this.checkFreeCoordWalls(wall_blocks, points[i])) {
                        console.log("!4");
                        res.free = false;
                    }
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
        let coord_x,
            coord_y,
            is_y = 0,
            is_x = 0,
            res,
            coord = { x: enemie.x - 4, y: enemie.y };

        // free &&
        if (!is_y && !is_x) {
            coord_x = this.maxFreeLineForArcher(enemie, "x");
            coord_y = this.maxFreeLineForArcher(enemie, "y");

            is_y += this.getDistanceBetweenUnits(coord_y, enemie) * 2;
            is_x += this.getDistanceBetweenUnits(coord_x, enemie) * 2;
            // console.log("coord1", coord_x, coord_y, is_x, is_y);
            is_x -= this.getDistanceBetweenUnits(coord_x, unit);
            is_y -= this.getDistanceBetweenUnits(coord_y, unit);
            // console.log("coord2", coord_x, coord_y, is_x, is_y, this.getEnemyInField(coord_x, 3), this.getEnemyInField(coord_y, 32));
            is_x -= parseInt(this.getEnemyInField(coord_x, 4).length) * 2;
            is_y -= parseInt(this.getEnemyInField(coord_y, 4).length) * 2;
            // console.log("coord_x", coord_x, "coord_y", coord_y);
            if (coord_y.empty_arr) {
                is_y -= 1000;
            }
            if (coord_x.empty_arr) {
                is_x -= 1000;
            }
            if (is_y > is_x) {
                coord = coord_y;
            } else {
                coord = coord_x;
            }
            // if (Math.abs(Math.round(is_y) - Math.round(is_x)) <= 3) {
            //     if (this.getEnemyInField(coord_y, 4) > this.getEnemyInField(coord_x, 4)) {
            //         coord = coord_y;
            //     } else {
            //         coord = coord_x;
            //     }
            // }

            console.log(
                "coord",
                is_y,
                is_x,
                "\ncoord=>",
                coord,
                " | ",
                coord_x,
                coord_y,
                "\n getEnemyInField",
                this.getEnemyInField(coord, 3),
                enemie.domPerson,
                this.unit.domPerson,
                "getDistanceBetweenUnits",
                this.getDistanceBetweenUnits(coord, enemie)
            );
        }
        if (this.getEnemyInField(coord, 3) > 3 || this.getDistanceBetweenUnits(coord, enemie) <= 1) {
            // if(this.checkFree)
            return { x: enemie.x - 4, y: enemie.y };
        } else {
            return coord;
        }
    }
    maxFreeLineForArcher(coord, direction) {
        let arr_up = [],
            arr_down = [];

        if (direction == "y") {
            for (let i = coord.y - 1; i >= 0; i--) {
                if (arr_up.length < 4) arr_up.push({ x: coord.x, y: i });
            }
            for (let i = coord.y + 1; i < 8; i++) {
                if (arr_down.length < 4) arr_down.push({ x: coord.x, y: i });
            }
        } else {
            for (let i = coord.x - 1; i >= 0; i--) {
                if (arr_up.length < 4) {
                    arr_up.push({ x: i, y: coord.y });
                }
            }
            for (let i = coord.x + 1; i < 12; i++) {
                if (arr_down.length < 4) arr_down.push({ x: i, y: coord.y });
            }
        }
        console.log("!!!!!!!!11111111 direction", direction, arr_up, arr_down, this.unit.domPerson);
        arr_up = this.findFreeLine(arr_up, coord);
        arr_down = this.findFreeLine(arr_down, coord);
        console.log("!!!!!!!!1222222direction", direction, arr_up, arr_down, this.unit.domPerson);
        // if (arr_up.length == 0 && arr_down.length == 0) {
        //     for (let i = coord.y - 1; i >= 0; i--) {
        //         if (arr_up.length < 4) arr_up.push({ x: coord.x, y: i });
        //     }
        //     for (let i = coord.y + 1; i < 8; i++) {
        //         if (arr_down.length < 4) arr_down.push({ x: coord.x, y: i });
        //     }
        // }
        let tmp_up = this.getPointNearEnemy(arr_up, coord),
            tmp_down = this.getPointNearEnemy(arr_down, coord);
        // if (direction == "y")

        if (arr_down.length == 0) {
            tmp_down.empty_arr = true;
        } else {
            tmp_down.empty_arr = false;
        }
        if (arr_up.length == 0) {
            tmp_up.empty_arr = true;
        } else {
            tmp_up.empty_arr = false;
        }
        // console.log(
        //     "!!!!!!!!!!!!!!!!!!!!!!!!!!direction ",
        //     direction,
        //     "    ",
        //     tmp_up,
        //     tmp_down,
        //     Math.abs(arr_up.length - arr_down.length) < 3 && arr_down.length > 2 && arr_up.length > 2
        // );
        if (Math.abs(arr_up.length - arr_down.length) < 2 && arr_down.length > 2 && arr_up.length > 2) {
            return this.getDistanceBetweenUnits(tmp_down, this.unit) < this.getDistanceBetweenUnits(tmp_up, this.unit)
                ? tmp_down
                : tmp_up;
        } else {
            // console.log(
            //     " arr_up.length > arr_down.l",
            //     arr_up,
            //     arr_down,
            //     direction,
            //     arr_up.length > arr_down.length,
            //     this.getPointNearEnemy(arr_up, coord),
            //     this.getPointNearEnemy(arr_down, coord)
            // );
            // // let tmp_up = this.getPointNearEnemy(arr_up, coord),
            //     tmp_down = this.getPointNearEnemy(arr_down, coord);
            // if (arr_down.length == 0) {
            //     tmp_down.empty_arr = true;
            // } else {
            //     tmp_down.empty_arr = false;
            // }
            // if (arr_up.length == 0) {
            //     tmp_down.empty_arr = true;
            // } else {
            //     tmp_down.empty_arr = false;
            // }
            return arr_up.length > arr_down.length ? tmp_up : tmp_down;
        }
    }
    // maxFreeLineForArcher2(coord, direction) {
    //     let arr_up = [],
    //         arr_down = [];

    //     if (direction == "y") {
    //         for (let i = coord.y - 1; i >= 0; i--) {
    //             if (arr_up.length < 4) arr_up.push({ x: coord.x, y: i });
    //         }
    //         for (let i = coord.y + 1; i < 8; i++) {
    //             if (arr_down.length < 4) arr_down.push({ x: coord.x, y: i });
    //         }
    //     } else {
    //         for (let i = coord.x - 1; i >= 0; i--) {
    //             if (arr_up.length < 4) {
    //                 arr_up.push({ x: i, y: coord.y });
    //             }
    //         }
    //         for (let i = coord.x + 1; i < 12; i++) {
    //             if (arr_down.length < 4) arr_down.push({ x: i, y: coord.y });
    //         }
    //     }
    //     // console.log("!!!!!!!!11111111 direction", direction, this.unit.domPerson, arr_up, arr_down);
    //     arr_up = this.findFreeLine(arr_up, coord);
    //     arr_down = this.findFreeLine(arr_down, coord);

    //     let tmp_up = this.getPointNearEnemy(arr_up, coord),
    //         tmp_down = this.getPointNearEnemy(arr_down, coord);
    //     // if (direction == "y")

    //     if (arr_down.length == 0) {
    //         tmp_down.empty_arr = true;
    //     } else {
    //         tmp_down.empty_arr = false;
    //     }
    //     if (arr_up.length == 0) {
    //         tmp_up.empty_arr = true;
    //     } else {
    //         tmp_up.empty_arr = false;
    //     }
    //     // console.log(
    //     //     "!!!!!!!!!!!!!!!!!!!!!!!!!!direction ",
    //     //     direction,
    //     //     "    ",
    //     //     arr_up,
    //     //     arr_down,
    //     //     tmp_up,
    //     //     tmp_down,
    //     //     Math.abs(arr_up.length - arr_down.length) < 3 && arr_down.length > 2 && arr_up.length > 2
    //     // );
    //     if (Math.abs(arr_up.length - arr_down.length) < 2 && arr_down.length > 2 && arr_up.length > 2) {
    //         return this.getDistanceBetweenUnits(tmp_down, this.unit) < this.getDistanceBetweenUnits(tmp_up, this.unit)
    //             ? tmp_down
    //             : tmp_up;
    //     } else {
    //         return arr_up.length > arr_down.length ? tmp_up : tmp_down;
    //     }
    // }
    getPointNearEnemy(cache, enemy) {
        let result = cache[cache.length - 1],
            max = 0,
            distance,
            water_blocks = this.scene.get("water_blocks");
        // console.log("\ngetPointNearEnemy", cache);
        if (cache.length == 0 || !cache) {
            if (enemy.x > 4) {
                return { x: enemy.x - 3, y: enemy.y };
            } else {
                if (enemy.y > 4) {
                    if (!this.checkFreeCoordWalls(water_blocks, { x: enemy.x, y: enemy.y - 4 })) {
                        return { x: enemy.x, y: enemy.y - 4 };
                    }
                    return { x: enemy.x, y: enemy.y - 3 };
                } else {
                    if (!this.checkFreeCoordWalls(water_blocks, { x: enemy.x, y: enemy.y + 4 })) {
                        return { x: enemy.x, y: enemy.y + 4 };
                    }
                    return { x: enemy.x, y: enemy.y + 4 };
                }
            }
        }
        cache.forEach((element) => {
            if (element.x == enemy.x || enemy.y == element.y) {
                distance = this.getDistanceBetweenUnits(element, enemy);

                if (distance >= max && distance <= 4 && !this.checkFreeCoordWalls(water_blocks, element)) {
                    max = distance;
                    result = element;
                }
            }
        });
        return result;
    }
    findFreeLine(cache, start_point) {
        // свободную линию от лучника!!!! а не dele
        let wall_blocks = this.scene.get("wall_blocks");
        let water_blocks = this.scene.get("water_blocks");
        let new_cache = [],
            i = 1,
            find_closed_area = false;
        // cache.push()
        if (cache.length > 1) {
            if (this.getDistanceBetweenUnits(cache[0], start_point) <= 1) {
                cache = [...cache].reverse();
            }
        }

        while (true) {
            cache = cache.filter((elem, index, arr) => {
                if (
                    (this.unit_collection.checkFreeCoord(elem) || (this.unit.x == elem.x && this.unit.y == elem.y)) &&
                    !find_closed_area
                ) {
                    // console.log(elem, i, this.checkFreeCoordWalls(wall_blocks, elem));
                    if (this.getDistanceBetweenUnits(elem, start_point) <= i) {
                        if (this.checkFreeCoordWalls(wall_blocks, elem)) {
                            console.log("\n\n find_closed_area 1 ", elem);
                            find_closed_area = true;
                        } else {
                            if (!this.checkFreeCoordWalls(new_cache, elem)) new_cache.push(elem);
                        }

                        return false;
                    } else {
                        return true;
                    }

                    // }
                } else {
                    // if (!(this.unit.x == elem.x && this.unit.y == elem.y)) {
                    //     console.log("\n\n find_closed_area 222", elem, this.unit_collection.checkFreeCoord(elem));
                    //     find_closed_area = true;
                    // } else {
                    //     new_cache.push(elem);
                    // }
                    if (this.unit.x == elem.x && this.unit.y == elem.y) {
                        console.log("\n\n find_closed_area 222", elem, this.unit_collection.checkFreeCoord(elem));
                        find_closed_area = true;
                    } else {
                        if (!this.checkFreeCoordWalls(new_cache, elem) && this.unit_collection.checkFreeCoord(elem))
                            new_cache.push(elem);
                    }
                    return true;
                }
            });
            if (find_closed_area) {
                break;
            }
            i++;
            if (i == 15) {
                break;
            }
        }
        if (new_cache.length > 0) {
            let last_point = new_cache[new_cache.length - 1];
            // console.log("last_point", last_point, new_cache);
            if (
                this.checkFreeCoordWalls(water_blocks, last_point) ||
                (!this.unit_collection.checkFreeCoord(last_point) &&
                    this.unit.x != last_point.x &&
                    this.unit.y != last_point.y)
            ) {
                console.log(
                    "pop!!!!!!!!!!!!!!!!!!",
                    last_point,

                    !this.unit_collection.checkFreeCoord(last_point),
                    this.checkFreeCoordWalls(water_blocks, last_point),
                    this.checkFreeCoordWalls(water_blocks, last_point) ||
                        !this.unit_collection.checkFreeCoord(last_point)
                );
                new_cache.pop();
            }
        }

        // console.log("new_cache=======>>>>>>>> ", " ==>  ", JSON.stringify(new_cache), start_point);
        // cache.forEach((elem, index, arr) => {
        //     // if (
        //     //     this.unit_collection.checkFreeCoord({ x: elem.x, y: elem.y }) &&
        //     //     !this.checkFreeCoordWalls(wall_blocks, elem) &&
        //     //     !find_closed_area
        //     // ) {
        //     //     if (index == arr.length - 1) {
        //     //         if (!this.checkFreeCoordWalls(water_blocks, elem)) {
        //     //             new_cache.push(elem);
        //     //         }
        //     //     } else {
        //     //         new_cache.push(elem);
        //     //     }
        //     // } else {
        //     //     if (elem.x != this.unit.x && elem.y != this.unit.x) {
        //     //         find_closed_area = true;
        //     //     } else {
        //     //         new_cache.push(elem);
        //     //     }
        //     // }
        // });
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
        let real_unit = coord_unit.hasOwnProperty("perosn") ? true : false;
        return this.unit_collection.getAICollection().filter((elem) => {
            if (this.getDistanceBetweenUnits(coord_unit, elem) < field_step) {
                if (real_unit) {
                    if (coord_unit.person.id != elem.person.id) return elem;
                } else {
                    return elem;
                }
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
    getGetPointFarFromEnemie(unit, enemie) {
        let point_1 = { x: enemie.x, y: enemie.y },
            point_2 = { x: enemie.x, y: enemie.y };
        if (enemie.x > 5) {
            point_1.x = enemie.x - 4;
        } else {
            point_1.x = enemie.x + 4;
        }

        if (enemie.y > 3) {
            point_2.y = enemie.y - 4;
        } else {
            point_2.y = enemie.y + 4;
        }
        if (enemie.y == 3 || enemie.y == 4) {
            if (
                this.getDistanceBetweenUnits({ x: enemie.x, y: enemie.y + 4 }, this.unit) >
                this.getDistanceBetweenUnits({ x: enemie.x, y: enemie.y - 4 }, this.unit)
            ) {
                point_2.y = 0;
            } else {
                point_2.y = 7;
            }
        }
        let count_enemy_1 = this.getEnemyInField(point_1, 3);
        let count_enemy_2 = this.getEnemyInField(point_2, 3);
        let dist_1 = this.getDistanceBetweenUnits(point_1, this.unit);
        let dist_2 = this.getDistanceBetweenUnits(point_2, this.unit);
        // console.log("dist_1, dist_2", dist_1, dist_2, point_1, point_2, enemie.domPerson);
        if (this.getEnemyInField(point_1, 2).length < 2 && this.getEnemyInField(point_2, 2).length < 2) {
            if (Math.round(Math.abs(dist_1 - dist_2)) <= 2) {
                return this.getFriendsInField(point_1, 3) > this.getFriendsInField(point_2, 3) ? point_1 : point_2;
            }
            return dist_1 < dist_2 ? point_1 : point_2;
        } else {
            return count_enemy_2.length > count_enemy_1.length ? point_1 : point_2;
        }
    }
    tryAtakeArcher(resCheck, enemie) {
        let pointPosition,
            xLineCondition,
            yLineCondition,
            res = { pointPosition: [], result: true };
        if (resCheck.arrayPoit.length > 0) {
            pointPosition = resCheck.arrayPoit[resCheck.arrayPoit.length - 1];
            res.pointPosition = pointPosition;
            // враги на линии
            xLineCondition = enemie.x == this.unit.x && pointPosition.x == this.unit.x;
            yLineCondition = enemie.y == this.unit.y && pointPosition.y == this.unit.y;
        } else {
            xLineCondition = false;
            yLineCondition = false;
        }

        if (yLineCondition || xLineCondition || resCheck.arrayPoit.length == 0) {
            if (Math.abs(this.unit.x - enemie.x) >= Math.abs(this.unit.y - enemie.y)) {
                // поиск атаки по горизонтале
                if (Math.abs(this.unit.x - enemie.x) < 3 && !this.unit.moveAction) {
                    this.moveAutoStepStupid(this.unit, enemie, "archer");
                } else {
                    if (Math.abs(this.unit.y - enemie.y) < 3 && this.unit.y != enemie.y && !this.unit.moveAction) {
                        this.moveAutoStepStupid(this.unit, enemie, "archer");
                    }
                }
                if (enemie.x == this.unit.x || enemie.y == this.unit.y) {
                    this.atakeArcher(enemie);
                } else {
                    res.result = false;
                }
            } else {
                // поиск атаки по вертикали
                let new_x, new_y;
                if (!this.unit.moveAction) {
                    if (enemie.person.y < 3) {
                        this.moveCarefully(this.unit, { x: enemie.person.x, y: 8 }, "fighter", {});
                    } else {
                        this.moveCarefully(this.unit, { x: enemie.person.x, y: 0 }, "fighter", {});
                    }
                }
                if (enemie.x == this.unit.x || enemie.y == this.unit.y) {
                    this.atakeArcher(enemie);
                } else {
                    res.result = false;
                }
            }
            // проверка на тикать от сюда
        } else {
            res.result = false;
        }
        return res;
    }
    atakeArcher(enemie) {
        this.unit.stopAnimation("default_archer");
        this.unit.playAnimation("atacke_archer");

        // animation.stop();
        setTimeout(() => {
            this.unit.stopAnimation("atacke_archer");
            this.unit.playAnimation("default_archer");
        }, 800);
        this.view.contactPersonsView(enemie.domPerson, enemie.image, this.unit.person.damage);
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
    checkFreeWay2Atack(enemie, unit = this.unit, direction = "x", all_linne = false) {
        // показывает свободен ли путь для атаки из далека
        // direction - направление по которому будем атаковать
        let arrayPoit = [],
            sgn = enemie[direction] < unit[direction] ? -1 : 1,
            tmp,
            res = { free: false, arrayPoit: [], direction: direction, runAway: false },
            coefI;
        tmp = Math.abs(enemie[direction] - unit[direction]);

        if (tmp <= 4 || all_linne) {
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
