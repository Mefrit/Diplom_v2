define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DragonAnimationUpdate = void 0;
    function rotate(pos, angle) {
        var a = (angle / 180) * Math.PI;
        var ca = Math.cos(a);
        var sa = Math.sin(a);
        var x = pos.x * ca - pos.y * sa;
        var y = pos.x * sa + pos.y * ca;
        pos.x = x;
        pos.y = y;
    }
    function lerp(y1, y2, total, t) {
        return ((y2 - y1) / total) * t + y1;
    }
    var DragonAnimationUpdate = (function () {
        function DragonAnimationUpdate(data, images, name_elem, unit) {
            var _this = this;
            this.drawHealth = function (ctx, unit) {
                var img;
                ctx.moveTo(20, 10);
                ctx.lineWidth = 65;
                if (typeof unit != "undefined") {
                    if (unit.getHealth() <= 10) {
                        ctx.strokeStyle = "red";
                        _this.killUnit(_this.unit);
                        ctx.clearRect(0, 0, 1000, 1000);
                    }
                    else {
                        ctx.strokeStyle = "#5db96a";
                    }
                }
                else {
                    _this.killUnit(_this.unit);
                }
                ctx.lineTo(unit.getHealth() * 10, 20);
                ctx.stroke();
            };
            this.images = images;
            this.playing = false;
            this.data = data;
            this.name_elem = name_elem;
            this.canvas = null;
            this.unit = unit;
            this.damage = 10;
            this.die = false;
        }
        DragonAnimationUpdate.prototype.updateCanvas = function (canvas) {
            this.canvas = canvas;
        };
        DragonAnimationUpdate.prototype.getObject = function (name, list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].name == name) {
                    return list[i];
                }
            }
            return false;
        };
        DragonAnimationUpdate.prototype.getBoneState = function (bone) {
            var st = { x: 0, y: 0, skX: 0, skY: 0 };
            if (bone.transform) {
                st.x += bone.transform.x || 0;
                st.y += bone.transform.y || 0;
                st.skX += bone.transform.skX || 0;
                st.skY += bone.transform.skY || 0;
            }
            if (bone._transform) {
                st.x += bone._transform.x || 0;
                st.y += bone._transform.y || 0;
                st.skX += bone._transform.skX || 0;
                st.skY += bone._transform.skY || 0;
            }
            return st;
        };
        DragonAnimationUpdate.prototype.getGlobalPos = function (bone) {
            var bones = this.data.armature[0].bone;
            if (bone.parent) {
                var parentBone = this.getObject(bone.parent, bones);
                var parentPos = this.getGlobalPos(parentBone);
                var pos = this.getBoneState(bone);
                rotate(pos, parentPos.skX);
                pos.skX += parentPos.skX;
                pos.x += parentPos.x;
                pos.y += parentPos.y;
                return pos;
            }
            return this.getBoneState(bone);
        };
        DragonAnimationUpdate.prototype.getImagePosition = function (name, pos) {
            var slots = this.data.armature[0].slot;
            var bones = this.data.armature[0].bone;
            var obj = this.getObject(name, slots);
            var parentBone = this.getObject(obj.parent, bones);
            var parentPos = this.getGlobalPos(parentBone);
            var _pos = { x: pos.x, y: pos.y, skX: (pos.skX || 0) + parentPos.skX, z: obj.z };
            rotate(_pos, parentPos.skX);
            _pos.x += parentPos.x;
            _pos.y += parentPos.y;
            return _pos;
        };
        DragonAnimationUpdate.prototype.getFrameIndex = function (frames, frame) {
            var sum = 0;
            for (var i = 0; i < frames.length; i++) {
                sum += frames[i].duration;
                if (sum > frame) {
                    return [i, sum];
                }
            }
            return 0;
        };
        DragonAnimationUpdate.prototype.interpolate = function (a, b, total, time) {
            var result = { skX: 0, skY: 0, x: 0, y: 0 };
            for (var i in result) {
                if (result.hasOwnProperty(i)) {
                    result[i] = lerp(a[i] || 0, b[i] || 0, total, time);
                }
            }
            return result;
        };
        DragonAnimationUpdate.prototype.setTransform = function (target, values) {
            if (!target._transform) {
                target._transform = {};
            }
            for (var i in values) {
                if (values.hasOwnProperty(i)) {
                    target._transform[i] = values[i];
                }
            }
        };
        DragonAnimationUpdate.prototype.play = function () {
            var _this = this;
            this.playing = true;
            var animation = this.data.armature[0].animation[0];
            var boneList = this.data.armature[0].bone;
            var duration = animation.duration;
            var bones = animation.bone;
            var fps = this.data.frameRate;
            var frame = 0;
            var timeBegin = Date.now();
            if (this.canvas == null) {
                this.canvas = document.getElementById("canvas_" + this.name_elem);
            }
            else {
            }
            var playFrames = function () {
                if (!_this.playing) {
                    return;
                }
                var time = Date.now();
                var frame = Math.floor(((time - timeBegin) / 1000) * fps);
                if (frame >= duration) {
                    timeBegin = time;
                    frame = 0;
                }
                bones.forEach(function (bone) {
                    var name = bone.name;
                    var boneObject = _this.getObject(name, boneList);
                    var frames = bone.frame;
                    var _a = _this.getFrameIndex(frames, frame), index = _a[0], sum = _a[1];
                    var stateBegin = frames[index].transform;
                    if (index + 1 < frames.length) {
                        var stateEnd = frames[index + 1].transform;
                        var stateTime = _this.interpolate(stateBegin, stateEnd, frames[index].duration * fps, (((time - timeBegin) / 1000) * fps - (sum - frames[index].duration)) * fps);
                        _this.setTransform(boneObject, stateTime);
                    }
                    else {
                        _this.setTransform(boneObject, stateBegin);
                    }
                });
                var slot = _this.data.armature[0].skin[0].slot;
                _this.showSkin(slot);
                requestAnimationFrame(playFrames);
            };
            requestAnimationFrame(playFrames);
        };
        DragonAnimationUpdate.prototype.killUnit = function (unit) {
            if (!this.die) {
                this.die = true;
                this.playing = false;
                if (unit.person.evil && unit.person.class == "fighter") {
                    unit.playAnimation("die_fighter");
                    setTimeout(function () {
                        unit.stopAnimation("die_fighter");
                        setTimeout(function () {
                            unit.domPerson.classList.add("person-die");
                        }, 560);
                    }, 810);
                }
                if (unit.person.evil && unit.person.class == "archer") {
                    unit.playAnimation("evil_archer_die");
                    setTimeout(function () {
                        unit.stopAnimation("evil_archer_die");
                        setTimeout(function () {
                            unit.domPerson.classList.add("person-die");
                        }, 560);
                    }, 750);
                }
                if (!unit.person.evil && unit.person.class == "archer") {
                    unit.playAnimation("elf_archer_die");
                    setTimeout(function () {
                        unit.stopAnimation("elf_archer_die");
                        setTimeout(function () {
                            unit.domPerson.classList.add("person-die");
                        }, 760);
                    }, 710);
                }
                if (!unit.person.evil && unit.person.class == "fighter") {
                    unit.playAnimation("elf_fighter_die");
                    setTimeout(function () {
                        unit.stopAnimation("elf_fighter_die");
                        setTimeout(function () {
                            unit.domPerson.classList.add("person-die");
                        }, 760);
                    }, 660);
                }
            }
        };
        DragonAnimationUpdate.prototype.showSkin = function (slot) {
            var _this = this;
            slot = slot.reverse();
            var arrCanvas = [], ctx, obj;
            slot.forEach(function (item, i) {
                obj = item.display[0];
                arrCanvas.push({
                    img: _this.images[obj.name].node,
                    pos: _this.getImagePosition(obj.name, obj.transform),
                });
            });
            if (this.canvas != null) {
                this.canvas.width = 1250;
                this.canvas.height = 1400;
                ctx = this.canvas.getContext("2d");
                arrCanvas.sort(function (elem1, elem2) {
                    if (elem1.pos.z > elem2.pos.z) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                });
                ctx.clearRect(0, 0, 2000, 1000);
                this.drawHealth(ctx, this.unit);
                arrCanvas.forEach(function (elem) {
                    ctx.save();
                    ctx.translate(elem.pos.x + 590, elem.pos.y + 840);
                    ctx.rotate((elem.pos.skX * Math.PI) / 180);
                    ctx.drawImage(elem.img, -elem.img.width / 2, -elem.img.height / 2);
                    ctx.restore();
                });
            }
        };
        DragonAnimationUpdate.prototype.show = function () {
            var slot = this.data.armature[0].skin[0].slot;
            this.showSkin(slot);
        };
        DragonAnimationUpdate.prototype.playText = function () { };
        DragonAnimationUpdate.prototype.stop = function () {
            this.playing = false;
        };
        return DragonAnimationUpdate;
    }());
    exports.DragonAnimationUpdate = DragonAnimationUpdate;
});
