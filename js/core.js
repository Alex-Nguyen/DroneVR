//TO DO
//Rotate object in closer direction
//Manually control object

var __extends = this && this.__extends || function (e, t) {
    function n() {
        this.constructor = e;
    }

    for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
    e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}, createjs;
var DRONE;

/*
Loading assets and sve it to DRONE.preload.result.model
drone model = DRONE.preload.result.model.drone
propellerleft = DRONE.preload.result.model.propeller_left,
propellerright= DRONE.preload.result.model.propeller_right,
 */
!function (e) {
    var t = function (e) {
        function t() {
            var t = this;
            e.apply(this, arguments), this._onFileLoad = function (e) {
                var n = e.item.id;
                t.result[n] = e.result, e.item.type == createjs.Types.IMAGE && (t.texture[n] = new THREE.Texture(e.result));
            }, this._onComplete = function () {
                t.trigger("complete");
                $('#notification').html('Data is loaded!');

            };
        }

        return __extends(t, e), t.prototype.load = function () {
            $('#notification').html('Loading assets...');
            this.result = {}, this.texture = {}, this._queue = new createjs.LoadQueue(), this._queue.setMaxConnections(4),
                this._queue.addEventListener("complete", this._onComplete), this._queue.addEventListener("fileload", this._onFileLoad),
                this._queue.loadManifest(t.MANIFEST, !0);
        }, t.MANIFEST = [{
            src: "assets/model/model.json",
            id: "model",
            type: createjs.Types.JSON
        }], t;
    }(Backbone.Model);
    e.Preload = t, e.preload = new t();
}(DRONE || (DRONE = {}));

!function (e) {
    var t;
    !function (e) {
        function t(e, t) {
            void 0 === t && (t = "");
            var n, r, o;
            for (r = e.concat(), o = r.length, n = 0; n < o; n++) r[n] = "change:" + t + r[n];
            return r.join(" ");
        }

        function n(e, t) {
            void 0 === t && (t = "");
            var n, r, o;
            for (r = e.concat(), o = r.length, n = 0; n < o; n++) r[n] = t + r[n];
            return r.join(" ");
        }

        function r(e, t, n) {
            var r = 1 - n;
            return chroma.gl(e[0] * r + t[0] * n, e[1] * r + t[1] * n, e[2] * r + t[2] * n).hex();
        }

        function o(e, t, n, r) {
            var o = 1 - r;
            n.x = e[0] * o + t[0] * r, n.y = e[1] * o + t[1] * r, n.z = e[2] * o + t[2] * r;
        }

        function i(e, t) {
            var n = chroma(e).gl();
            t.x = n[0], t.y = n[1], t.z = n[2];
        }

        function a(e, t) {
            var n = chroma(e).alpha(t).gl();
            return new THREE.Vector4(n[0], n[1], n[2], n[3]);
        }

        function s(e) {
            var t = chroma(e).gl();
            return new THREE.Vector3(t[0], t[1], t[2]);
        }

        e.joinChangeNames = t, e.joinNames = n, e.colorTransform = r, e.colorTransformToVector4 = o,
            e.setRGBToVector4 = i, e.rgbaToVector4 = a, e.rgbToVector3 = s;
    }(t = e.C || (e.C = {}));
}(DRONE || (DRONE = {}));

!function (e) {
    var t;
    !function (e) {
        e.basic_quad = ["precision highp float;", "attribute vec3 position;", "attribute vec2 uv;", "varying vec2 vUv;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "void main(void) {", "    vUv = uv;", "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );", "}"].join("\n");
    }(t = e.vert || (e.vert = {}));
}(DRONE || (DRONE = {}));

!function (e) {
    var t;
    !function (e) {
        e.basic_color = ["precision highp float;", "attribute vec3 position;", "varying vec4 vColor;", "varying vec3 vPosition;", "varying vec3 vWorldPosition;", "uniform vec4 rgba;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat4 modelMatrix;", "uniform vec3 cameraPosition;", "void main(void) {", "    vPosition = position;", "    vec4 worldPosition = modelMatrix * vec4(position, 1.0 );", "    vWorldPosition = worldPosition.xyz;", "    vColor = rgba;", "    gl_Position = projectionMatrix * viewMatrix * worldPosition;", "}"].join("\n");
    }(t = e.vert || (e.vert = {}));
}(DRONE || (DRONE = {}));

!function (e) {
    var t;
    !function (e) {
        e.basic_color = ["precision highp float;", "varying vec4 vColor;", "varying vec4 vPosition;", "void main(void) {", "    if (vColor.a <= 0.0) discard;", "    gl_FragColor = vColor;", "}"].join("\n");
    }(t = e.frag || (e.frag = {}));
}(DRONE || (DRONE = {}));

!function (e) {
    var t;
    !function (e) {
        e.drone_face = ["precision highp float;", "#ifndef PI", "#define PI 3.141592653589793", "#endif", "#ifndef PI_2", "#define PI_2 6.283185307179586", "#endif", "#ifndef PI_HARF", "#define PI_HARF 1.5707963267948966", "#endif", "#ifndef PI_QUARTER", "#define PI_QUARTER 0.7853981633974483", "#endif", "mat3 rotateY(float rad) {", "    float c = cos(rad);", "    float s = sin(rad);", "    return mat3(", "        c, 0.0, s,", "        0.0, 1.0, 0.0,", "        -s, 0.0, c", "    );", "}", "const vec3 P1 = vec3(-0.0115, 0.019, -0.0199);", "const vec3 P2 = vec3(0.0115, 0.019, -0.0199);", "const vec3 P3 = vec3(0.023, 0.019, 0.0);", "const vec3 P4 = vec3(0.0115, 0.019, 0.0199);", "const vec3 P5 = vec3(-0.0115, 0.019, 0.0199);", "const vec3 P6 = vec3(-0.023, 0.019, 0.0);", "const float PI_60 = PI / 3.0;", "const vec3 ZERO = vec3(0.0, 0.0, 0.0);", "attribute vec3 position;", "attribute float num;", "attribute float propeller;", "varying vec4 vColor;", "varying vec4 vPosition;", "uniform vec4 rgba;", "uniform float time;", "uniform float shakeSpeed;", "uniform float shakeHeight;", "uniform float rotation;", "uniform vec3 offsetL;", "uniform vec3 offsetR;", "uniform float opacityL;", "uniform float opacityR;", "uniform vec3 offsetScaleL;", "uniform vec3 offsetScaleR;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat4 modelMatrix;", "uniform mat4 matrix;", "void main(void) {", "    vec3 pos = position;", "    vec4 c = rgba;", "    bool visible = true;", "    if (num == 1.0) {", "        if (opacityL == 0.0) {", "            visible = false;", "        } else {", "            c.a *= opacityL;", "        }", "    } else if (num == 2.0) {", "        if (opacityR == 0.0) {", "            visible = false;", "        } else {", "             c.a *= opacityR;", "         }", "    }", "    if (visible) {", "        if (propeller == 1.0) {", "            pos = rotateY(rotation + PI_60) * pos;", "            pos += P1;", "        }", "        if (propeller == 2.0) {", "            pos = rotateY(-rotation - PI_60) * pos;", "            pos += P2;", "        }", "        if (propeller == 3.0) {", "            pos = rotateY(rotation) * pos;", "            pos += P3;", "        }", "        if (propeller == 4.0) {", "            pos = rotateY(-rotation + PI_60) * pos;", "            pos += P4;", "        }", "        if (propeller == 5.0) {", "            pos = rotateY(rotation - PI_60) * pos;", "            pos += P5;", "        }", "        if (propeller == 6.0) {", "            pos = rotateY(-rotation) * pos;", "            pos += P6;", "        }", "        pos = (matrix * vec4(pos, 1.0)).xyz;", "        if (num == 1.0) {", "            pos += offsetL;", "        }", "        if (num == 2.0) {", "            pos += offsetR;", "        }", "        float num3 = num / 3.0;", "        pos.xy += vec2(", "            0.00025 * shakeHeight * sin(shakeSpeed * 1.5 + num3),", "            0.002 * shakeHeight * sin(shakeSpeed * 9.0 + num3)) * sin((shakeSpeed * 3.0 + num3) * PI_2", "        );", "    } else {", "        pos = ZERO;", "    }", "    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);", "    vec4 viewPisition = viewMatrix * worldPosition;", "    vColor = c;", "    vPosition = worldPosition;", "    gl_Position = projectionMatrix * viewPisition;", "}"].join("\n");
    }(t = e.vert || (e.vert = {}));
}(DRONE || (DRONE = {}));

!function (e) {
    var t;
    !function (e) {
        e.drone_face = ["#extension GL_OES_standard_derivatives : enable", "precision highp float;", "const vec3 LIGHT1 = vec3(0.0, 1.0, 0.0);", "const vec3 LIGHT2 = vec3(0.0, 0.8320502943378437, -0.5547001962252291);", "const vec3 LIGHT_COLOR = vec3(1.0);", "varying vec4 vColor;", "varying vec4 vPosition;", "uniform vec3 lightColor;", "void main(void) {", "    if (vColor.a <= 0.0) discard;", "    vec3 dx = dFdx(vPosition.xyz);", "    vec3 dy = dFdy(vPosition.xyz);", "    vec3 n = normalize(cross(normalize(dx), normalize(dy)));", "    vec4 rgba = vColor;", "    float diff;", "    diff = clamp(dot(n, LIGHT1), 0.1, 1.0);", "    rgba.rgb = mix(rgba.rgb, lightColor, diff);", "    if (rgba.a <= 0.0) discard;", "    gl_FragColor = rgba;", "}"].join("\n");
    }(t = e.frag || (e.frag = {}));
}(DRONE || (DRONE = {}));


!function (e) {
    var t;
    !function (e) {
        e.drone_wire = ["precision highp float;", "#ifndef PI", "#define PI 3.141592653589793", "#endif", "#ifndef PI_2", "#define PI_2 6.283185307179586", "#endif", "#ifndef PI_HARF", "#define PI_HARF 1.5707963267948966", "#endif", "#ifndef PI_QUARTER", "#define PI_QUARTER 0.7853981633974483", "#endif", "mat3 rotateY(float rad) {", "    float c = cos(rad);", "    float s = sin(rad);", "    return mat3(", "        c, 0.0, s,", "        0.0, 1.0, 0.0,", "        -s, 0.0, c", "    );", "}", "const vec3 P1 = vec3(-0.0115, 0.019, -0.0198);", "const vec3 P2 = vec3(0.0115, 0.019, -0.0198);", "const vec3 P3 = vec3(0.023, 0.019, 0.0);", "const vec3 P4 = vec3(0.0115, 0.019, 0.0198);", "const vec3 P5 = vec3(-0.0115, 0.019, 0.0198);", "const vec3 P6 = vec3(-0.023, 0.019, 0.0);", "const float PI_60 = PI / 3.0;", "const vec3 ZERO = vec3(0.0, 0.0, 0.0);", "attribute vec3 position;", "attribute float num;", "attribute float propeller;", "varying vec4 vColor;", "uniform vec4 rgba;", "uniform float time;", "uniform float shakeSpeed;", "uniform float shakeHeight;", "uniform float rotation;", "uniform vec3 offsetL;", "uniform vec3 offsetR;", "uniform vec3 offsetScaleL;", "uniform vec3 offsetScaleR;", "uniform float opacityL;", "uniform float opacityR;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat4 modelMatrix;", "uniform mat4 matrix;", "void main(void) {", "    vec3 pos = position;", "    vec4 c = rgba;", "    bool visible = true;", "    if (num == 1.0) {", "        if (opacityL == 0.0) {", "            visible = false;", "        } else {", "            c.a *= opacityL;", "        }", "    } else if (num == 2.0) {", "        if (opacityR == 0.0) {", "            visible = false;", "        } else {", "             c.a *= opacityR;", "         }", "    }", "    if (visible) {", "        if (propeller == 1.0) {", "            pos = rotateY(rotation + PI_60) * pos;", "            pos += P1;", "        }", "        if (propeller == 2.0) {", "            pos = rotateY(-rotation - PI_60) * pos;", "            pos += P2;", "        }", "        if (propeller == 3.0) {", "            pos = rotateY(rotation) * pos;", "            pos += P3;", "        }", "        if (propeller == 4.0) {", "            pos = rotateY(-rotation + PI_60) * pos;", "            pos += P4;", "        }", "        if (propeller == 5.0) {", "            pos = rotateY(rotation - PI_60) * pos;", "            pos += P5;", "        }", "        if (propeller == 6.0) {", "            pos = rotateY(-rotation) * pos;", "            pos += P6;", "        }", "        pos = (matrix * vec4(pos, 1.0)).xyz;", "        if (num == 1.0) {", "            pos += offsetL;", "        }", "        if (num == 2.0) {", "            pos += offsetR;", "        }", "        float num3 = num / 3.0;", "        pos.xy += vec2(", "            0.00025 * shakeHeight * sin(shakeSpeed * 1.5 + num3),", "            0.002 * shakeHeight * sin(shakeSpeed * 9.0 + num3)) * sin((shakeSpeed * 3.0 + num3) * PI_2", "        );", "    } else {", "        pos = ZERO;", "    }", "    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);", "    vec4 viewPisition = viewMatrix * worldPosition;", "    vColor = c;", "    gl_Position = projectionMatrix * viewPisition;", "}"].join("\n");
    }(t = e.vert || (e.vert = {}));
}(DRONE || (DRONE = {}));

//Drone model section
!function (e) {
    var t = function () {
        function t() {
            var t = this;
            this._onDraw = function (n, r) {
                var o, i, a;
                i = 650 * r;
                t.uniformsFace.rotation.value += i,
                    t.uniformsWire.rotation.value += i;

            }
        }

        return t.prototype.init = function () {
            this.container = new THREE.Object3D();
            this.initGeometry(),
                this.initFace(),
                this.initWire(),
                this.container.scale.set(100, 100, 100),
                this.container.position.set(0, 28, 0),
                e.sceneManager.on("draw", this._onDraw);
        }, t.prototype.updateNavController = function () {
            let speed = 0.08;
            let rotatespeed = 0.01;
            e.droneController.get('navMouseLeftClicked') === true ? this.onMoveLeft(speed) : null;
            e.droneController.get('navMouseRightClicked') === true ? this.onMoveRight(speed) : null;
            e.droneController.get('navMouseTopClicked') === true ? this.onMoveUp(speed) : null;
            e.droneController.get('navMouseBottomClicked') === true ? this.onMoveDown(speed) : null;
            e.droneController.get('navMouseForwardClicked') === true ? this.onMoveForward(speed) : null;
            e.droneController.get('navMouseBackwardClicked') === true ? this.onMoveBackward(speed) : null;
            e.droneController.get('rotMouseLeftClicked') === true ? this.onRotateLeft(rotatespeed) : null;
            e.droneController.get('rotMouseRightClicked') === true ? this.onRotateRight(rotatespeed) : null;
            e.droneController.get('rotMouseTopClicked') === true ? this.onRotateUp(rotatespeed) : null;
            e.droneController.get('rotMouseBottomClicked') === true ? this.onRotateDown(rotatespeed) : null;
            e.sceneManager.updateCamera();

        }, t.prototype.onRotateLeft = function (speed) {

            this.container.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), speed);


        }, t.prototype.onRotateRight = function (speed) {
            this.container.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -speed);
        }, t.prototype.onRotateUp = function (speed) {
            this.container.rotation.x += speed;
        }, t.prototype.onRotateDown = function (speed) {
            this.container.rotation.x -= speed;
        }

            , t.prototype.onMoveForward = function (speed) {
            let direction = new THREE.Vector3();
            this.container.getWorldDirection(direction);
            this.container.position.add(direction.multiplyScalar(speed));


        }, t.prototype.onMoveBackward = function (speed) {
            let direction = new THREE.Vector3();
            this.container.getWorldDirection(direction);
            this.container.position.add(direction.multiplyScalar(-speed));
        }
            , t.prototype.onMoveLeft = function (speed) {
            let direction = new THREE.Vector3();
            this.container.getWorldDirection(direction);
            let directionRight = THREE.Vector3();
            directionRight = direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
            this.container.position.add(directionRight.multiplyScalar(speed));

        }, t.prototype.onMoveUp = function (speed) {
            this.container.position.y += speed;
            e.sceneManager.set({droneAltitude: this.container.position.y});
        },
            t.prototype.onMoveDown = function (speed) {
                this.container.position.y -= speed;
                e.sceneManager.set({droneAltitude: this.container.position.y});
            },
            t.prototype.onMoveRight = function (speed) {
                let direction = new THREE.Vector3();
                this.container.getWorldDirection(direction);
                let directionRight = THREE.Vector3();
                directionRight = direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
                this.container.position.add(directionRight.multiplyScalar(-speed));
            },
            t.prototype.initGeometry = function () {
                var t = e.preload.result.model.drone,
                    n = e.preload.result.model.propeller_left,
                    r = e.preload.result.model.propeller_right,
                    o = new THREE.BufferGeometry(),
                    i = new THREE.BufferGeometry(),
                    a = new THREE.BufferGeometry();

                o.addAttribute("position", new THREE.BufferAttribute(new Float32Array(t.v), 3)),
                    i.addAttribute("position", new THREE.BufferAttribute(new Float32Array(n.v), 3)),
                    a.addAttribute("position", new THREE.BufferAttribute(new Float32Array(r.v), 3)),
                    o.setIndex(new THREE.BufferAttribute(new Uint32Array(t.fv), 1)), i.setIndex(new THREE
                    .BufferAttribute(new Uint32Array(n.fv), 1)),
                    a.setIndex(new THREE.BufferAttribute(new Uint32Array(r.fv), 1)), o.computeVertexNormals(),
                    i.computeVertexNormals(), a.computeVertexNormals();
                var s = -.01;
                o.translate(0, s, 0), i.translate(0, s, 0), a.translate(0, s, 0), this.geometryFace = this
                    .createGeometryFace({
                        vBody: o.attributes.position.array,
                        vPropellerL: i.attributes.position.array,
                        vPropellerR: a.attributes.position.array,
                        iBody: t.fv,
                        iPropellerL: n.fv,
                        iPropellerR: r.fv
                    }), this.geometryWire = this.createGeometryWire({
                    vBody: new THREE.EdgesGeometry(o).attributes.position.array,
                    vPropellerL: new THREE.EdgesGeometry(i).attributes.position.array,
                    vPropellerR: new THREE.EdgesGeometry(a).attributes.position.array
                });

            },
            t.prototype.createGeometryFace = function (e) {
                var t, n, r, o, i, a, s, c, l, f;
                for (a = 4, i = (e.vBody.length + 3 * e.vPropellerL.length + 3 * e.vPropellerR.length) / 3,
                         l = new Float32Array(i * a), i = e.iBody.length + 3 * e.iPropellerL.length + 3 * e
                    .iPropellerR.length,
                         f = new Uint32Array(i), i = e.vBody.length / 3, t = 0; t < i; t++) r = t * a, o = 3 * t,
                    l[r + 0] = e.vBody[o + 0], l[r + 1] = e.vBody[o + 1], l[r + 2] = e.vBody[o + 2],
                    l[r + 3] = 0;
                for (i = e.iBody.length, t = 0; t < i; t++) f[t] = e.iBody[t];
                for (s = e.vBody.length / 3, i = e.vPropellerL.length / 3, n = 0; n < 3; n++)
                    for (t = 0; t < i; t++) r = (t + n * i + s) * a,
                        o = 3 * t, l[r + 0] = e.vPropellerL[o + 0], l[r + 1] = e.vPropellerL[o + 1], l[r + 2] =
                        e.vPropellerL[o + 2],
                        l[r + 3] = 2 * n + 1;
                for (c = e.iBody.length, i = e.iPropellerL.length, n = 0; n < 3; n++) {
                    for (t = 0; t < i; t++) r = t + n * i + c, f[r] = e.iPropellerL[t] + s;
                    s += e.vPropellerL.length / 3;
                }
                for (s = (e.vBody.length + 3 * e.vPropellerL.length) / 3, i = e.vPropellerR.length / 3,
                         n = 0; n < 3; n++)
                    for (t = 0; t < i; t++) r = (t + n * i + s) * a, o = 3 * t, l[r + 0] = e.vPropellerR[o + 0],
                        l[r + 1] = e.vPropellerR[o + 1], l[r + 2] = e.vPropellerR[o + 2], l[r + 3] = 2 * n + 2;
                for (c = e.iBody.length + 3 * e.iPropellerL.length, i = e.iPropellerR.length, n = 0; n <
                3; n++) {
                    for (t = 0; t < i; t++) r = t + n * i + c, f[r] = e.iPropellerR[t] + s;
                    s += e.vPropellerR.length / 3;
                }
                var u, h, v;
                return u = 3, h = new THREE.InstancedBufferGeometry(), h.maxInstancedCount = u,
                    h.setIndex(new THREE.BufferAttribute(new Uint32Array(f), 1)), v = new THREE
                    .InterleavedBuffer(l, a),
                    h.addAttribute("position", new THREE.InterleavedBufferAttribute(v, 3, 0)), h.addAttribute(
                    "propeller", new THREE.InterleavedBufferAttribute(v, 1, 3)),
                    h.addAttribute("num", new THREE.InstancedBufferAttribute(new Float32Array([0, 1, 2]), 1,
                        true)),
                    h.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 999), h;
            },
            t.prototype.createGeometryWire = function (e) {
                var t, n, r, o, i, a, s, c;
                for (a = 4, i = (e.vBody.length + 3 * e.vPropellerL.length + 3 * e.vPropellerR.length) / 3,
                         c = new Float32Array(i * a), i = e.vBody.length / 3, t = 0; t < i; t++) r = t * a,
                    o = 3 * t, c[r + 0] = e.vBody[o + 0], c[r + 1] = e.vBody[o + 1], c[r + 2] = e.vBody[o + 2],
                    c[r + 3] = 0;
                for (s = e.vBody.length / 3, i = e.vPropellerL.length / 3, n = 0; n < 3; n++)
                    for (t = 0; t < i; t++) r = (t + n * i + s) * a,
                        o = 3 * t, c[r + 0] = e.vPropellerL[o + 0], c[r + 1] = e.vPropellerL[o + 1], c[r + 2] =
                        e.vPropellerL[o + 2],
                        c[r + 3] = 2 * n + 1;
                for (s = (e.vBody.length + 3 * e.vPropellerL.length) / 3, i = e.vPropellerR.length / 3,
                         n = 0; n < 3; n++)
                    for (t = 0; t < i; t++) r = (t + n * i + s) * a, o = 3 * t, c[r + 0] = e.vPropellerR[o + 0],
                        c[r + 1] = e.vPropellerR[o + 1], c[r + 2] = e.vPropellerR[o + 2], c[r + 3] = 2 * n + 2;
                var l, f, u;
                return l = 3, f = new THREE.InstancedBufferGeometry(), f.maxInstancedCount = l,
                    u = new THREE.InterleavedBuffer(c, a), f.addAttribute("position", new THREE
                    .InterleavedBufferAttribute(u, 3, 0)),
                    f.addAttribute("propeller", new THREE.InterleavedBufferAttribute(u, 1, 3)), f.addAttribute(
                    "num", new THREE.InstancedBufferAttribute(new Float32Array([0, 1, 2]), 1, true)),
                    f.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 999), f;
            },
            t.prototype.initFace = function () {
                var t = {
                        rgba: {
                            type: "v4",
                            value: e.C.rgbaToVector4(e.S.COLOR.droneFace, .75)
                        },
                        lightColor: {
                            type: "v3",
                            value: e.C.rgbToVector3(e.S.COLOR.droneFaceLight)
                        },
                        time: {
                            type: "f",
                            value: 0
                        },
                        shakeSpeed: {
                            type: "f",
                            value: 0
                        },
                        shakeHeight: {
                            type: "f",
                            value: 0
                        },
                        rotation: {
                            type: "f",
                            value: 0
                        },
                        offsetL: {
                            type: "v3",
                            value: new THREE.Vector3(0, 0, 0)
                        },
                        offsetR: {
                            type: "v3",
                            value: new THREE.Vector3(0, 0, 0)
                        },
                        offsetScaleL: {
                            type: "v3",
                            value: new THREE.Vector3(1, 1, 1)
                        },
                        offsetScaleR: {
                            type: "v3",
                            value: new THREE.Vector3(1, 1, 1)
                        },
                        opacityL: {
                            type: "f",
                            value: 1
                        },
                        opacityR: {
                            type: "f",
                            value: 1
                        },
                        matrix: {
                            type: "m4",
                            value: new THREE.Matrix4().identity()
                        }
                    },
                    n = new THREE.RawShaderMaterial({
                        fragmentShader: e.frag.drone_face,
                        vertexShader: e.vert.drone_face,
                        blending: THREE.NormalBlending,
                        uniforms: t,
                        transparent: !0,
                        depthTest: !0
                    }),
                    r = new THREE.Mesh(this.geometryFace, n);
                this.meshFace = r, this.materialFace = r.material, this.uniformsFace = r.material.uniforms,
                    this.container.add(r);
            },
            t.prototype.initWire = function () {
                var t = {
                        rgba: {
                            type: "v4",
                            value: e.C.rgbaToVector4(e.S.COLOR.droneWire, .55)
                        },
                        time: {
                            type: "f",
                            value: 0
                        },
                        shakeSpeed: {
                            type: "f",
                            value: 0
                        },
                        shakeHeight: {
                            type: "f",
                            value: 0
                        },
                        rotation: {
                            type: "f",
                            value: 0
                        },
                        offsetL: {
                            type: "v3",
                            value: new THREE.Vector3(0, 0, 0)
                        },
                        offsetR: {
                            type: "v3",
                            value: new THREE.Vector3(0, 0, 0)
                        },
                        offsetScaleL: {
                            type: "v3",
                            value: new THREE.Vector3(1, 1, 1)
                        },
                        offsetScaleR: {
                            type: "v3",
                            value: new THREE.Vector3(1, 1, 1)
                        },
                        opacityL: {
                            type: "f",
                            value: 1
                        },
                        opacityR: {
                            type: "f",
                            value: 1
                        },
                        matrix: {
                            type: "m4",
                            value: new THREE.Matrix4().identity()
                        }
                    },
                    n = new THREE.RawShaderMaterial({
                        fragmentShader: e.frag.basic_color,
                        vertexShader: e.vert.drone_wire,
                        blending: THREE.NormalBlending,
                        uniforms: t,
                        transparent: !0,
                        depthTest: !0
                    });
                n.linewidth = 1.5, n.linecap = "round", n.linejoin = "round";

                var r = new THREE.LineSegments(this.geometryWire, n);

                this.meshWire = r, this.materialWire = this.meshWire.material,
                    this.uniformsWire = r.material.uniforms,
                    this.container.add(r);
            }, t;
    }();
    e.Drone = new t();
}(DRONE || (DRONE = {}));

!function (e) {

}(DRONE || (DRONE = {}));
!function (e) {
    var t;
    !function (e) {
        e.drone_face = ["#extension GL_OES_standard_derivatives : enable", "precision highp float;",
            "const vec3 LIGHT1 = vec3(0.0, 1.0, 0.0);",
            "const vec3 LIGHT2 = vec3(0.0, 0.8320502943378437, -0.5547001962252291);",
            "const vec3 LIGHT_COLOR = vec3(1.0);", "varying vec4 vColor;", "varying vec4 vPosition;",
            "uniform vec3 lightColor;", "void main(void) {", "    if (vColor.a <= 0.0) discard;",
            "    vec3 dx = dFdx(vPosition.xyz);", "    vec3 dy = dFdy(vPosition.xyz);",
            "    vec3 n = normalize(cross(normalize(dx), normalize(dy)));", "    vec4 rgba = vColor;",
            "    float diff;", "    diff = clamp(dot(n, LIGHT1), 0.1, 1.0);",
            "    rgba.rgb = mix(rgba.rgb, lightColor, diff);", "    if (rgba.a <= 0.0) discard;",
            "    gl_FragColor = rgba;", "}"
        ].join("\n");
    }(t = e.frag || (e.frag = {}));
}(DRONE || (DRONE = {}));
!function (e) {
    var t;
    !function (e) {
        e.drone_face = ["precision highp float;", "#ifndef PI", "#define PI 3.141592653589793", "#endif",
            "#ifndef PI_2", "#define PI_2 6.283185307179586", "#endif", "#ifndef PI_HARF",
            "#define PI_HARF 1.5707963267948966", "#endif", "#ifndef PI_QUARTER",
            "#define PI_QUARTER 0.7853981633974483", "#endif", "mat3 rotateY(float rad) {",
            "    float c = cos(rad);", "    float s = sin(rad);", "    return mat3(", "        c, 0.0, s,",
            "        0.0, 1.0, 0.0,", "        -s, 0.0, c", "    );", "}",
            "const vec3 P1 = vec3(-0.0115, 0.019, -0.0199);",
            "const vec3 P2 = vec3(0.0115, 0.019, -0.0199);",
            "const vec3 P3 = vec3(0.023, 0.019, 0.0);", "const vec3 P4 = vec3(0.0115, 0.019, 0.0199);",
            "const vec3 P5 = vec3(-0.0115, 0.019, 0.0199);", "const vec3 P6 = vec3(-0.023, 0.019, 0.0);",
            "const float PI_60 = PI / 3.0;", "const vec3 ZERO = vec3(0.0, 0.0, 0.0);",
            "attribute vec3 position;", "attribute float num;", "attribute float propeller;",
            "varying vec4 vColor;", "varying vec4 vPosition;", "uniform vec4 rgba;", "uniform float time;",
            "uniform float shakeSpeed;", "uniform float shakeHeight;", "uniform float rotation;",
            "uniform vec3 offsetL;", "uniform vec3 offsetR;", "uniform float opacityL;",
            "uniform float opacityR;", "uniform vec3 offsetScaleL;", "uniform vec3 offsetScaleR;",
            "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat4 modelMatrix;",
            "uniform mat4 matrix;", "void main(void) {", "    vec3 pos = position;", "    vec4 c = rgba;",
            "    bool visible = true;", "    if (num == 1.0) {", "        if (opacityL == 0.0) {",
            "            visible = false;", "        } else {", "            c.a *= opacityL;", "        }",
            "    } else if (num == 2.0) {", "        if (opacityR == 0.0) {",
            "            visible = false;",
            "        } else {", "             c.a *= opacityR;", "         }", "    }",
            "    if (visible) {",
            "        if (propeller == 1.0) {", "            pos = rotateY(rotation + PI_60) * pos;",
            "            pos += P1;", "        }", "        if (propeller == 2.0) {",
            "            pos = rotateY(-rotation - PI_60) * pos;", "            pos += P2;", "        }",
            "        if (propeller == 3.0) {", "            pos = rotateY(rotation) * pos;",
            "            pos += P3;", "        }", "        if (propeller == 4.0) {",
            "            pos = rotateY(-rotation + PI_60) * pos;", "            pos += P4;", "        }",
            "        if (propeller == 5.0) {", "            pos = rotateY(rotation - PI_60) * pos;",
            "            pos += P5;", "        }", "        if (propeller == 6.0) {",
            "            pos = rotateY(-rotation) * pos;", "            pos += P6;", "        }",
            "        pos = (matrix * vec4(pos, 1.0)).xyz;", "        if (num == 1.0) {",
            "            pos += offsetL;", "        }", "        if (num == 2.0) {",
            "            pos += offsetR;", "        }", "        float num3 = num / 3.0;",
            "        pos.xy += vec2(", "            0.00025 * shakeHeight * sin(shakeSpeed * 1.5 + num3),",
            "            0.002 * shakeHeight * sin(shakeSpeed * 9.0 + num3)) * sin((shakeSpeed * 3.0 + num3) * PI_2",
            "        );", "    } else {", "        pos = ZERO;", "    }",
            "    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);",
            "    vec4 viewPisition = viewMatrix * worldPosition;", "    vColor = c;",
            "    vPosition = worldPosition;", "    gl_Position = projectionMatrix * viewPisition;", "}"
        ].join("\n");
    }(t = e.vert || (e.vert = {}));
}(DRONE || (DRONE = {}));

!function (e) {
    var t;
    !function (e) {
        e.drone_wire = ["precision highp float;", "#ifndef PI", "#define PI 3.141592653589793", "#endif",
            "#ifndef PI_2", "#define PI_2 6.283185307179586", "#endif", "#ifndef PI_HARF",
            "#define PI_HARF 1.5707963267948966", "#endif", "#ifndef PI_QUARTER",
            "#define PI_QUARTER 0.7853981633974483", "#endif", "mat3 rotateY(float rad) {",
            "    float c = cos(rad);", "    float s = sin(rad);", "    return mat3(", "        c, 0.0, s,",
            "        0.0, 1.0, 0.0,", "        -s, 0.0, c", "    );", "}",
            "const vec3 P1 = vec3(-0.0115, 0.019, -0.0198);",
            "const vec3 P2 = vec3(0.0115, 0.019, -0.0198);",
            "const vec3 P3 = vec3(0.023, 0.019, 0.0);", "const vec3 P4 = vec3(0.0115, 0.019, 0.0198);",
            "const vec3 P5 = vec3(-0.0115, 0.019, 0.0198);", "const vec3 P6 = vec3(-0.023, 0.019, 0.0);",
            "const float PI_60 = PI / 3.0;", "const vec3 ZERO = vec3(0.0, 0.0, 0.0);",
            "attribute vec3 position;", "attribute float num;", "attribute float propeller;",
            "varying vec4 vColor;", "uniform vec4 rgba;", "uniform float time;",
            "uniform float shakeSpeed;",
            "uniform float shakeHeight;", "uniform float rotation;", "uniform vec3 offsetL;",
            "uniform vec3 offsetR;", "uniform vec3 offsetScaleL;", "uniform vec3 offsetScaleR;",
            "uniform float opacityL;", "uniform float opacityR;", "uniform mat4 projectionMatrix;",
            "uniform mat4 viewMatrix;", "uniform mat4 modelMatrix;", "uniform mat4 matrix;",
            "void main(void) {", "    vec3 pos = position;", "    vec4 c = rgba;",
            "    bool visible = true;",
            "    if (num == 1.0) {", "        if (opacityL == 0.0) {", "            visible = false;",
            "        } else {", "            c.a *= opacityL;", "        }", "    } else if (num == 2.0) {",
            "        if (opacityR == 0.0) {", "            visible = false;", "        } else {",
            "             c.a *= opacityR;", "         }", "    }", "    if (visible) {",
            "        if (propeller == 1.0) {", "            pos = rotateY(rotation + PI_60) * pos;",
            "            pos += P1;", "        }", "        if (propeller == 2.0) {",
            "            pos = rotateY(-rotation - PI_60) * pos;", "            pos += P2;", "        }",
            "        if (propeller == 3.0) {", "            pos = rotateY(rotation) * pos;",
            "            pos += P3;", "        }", "        if (propeller == 4.0) {",
            "            pos = rotateY(-rotation + PI_60) * pos;", "            pos += P4;", "        }",
            "        if (propeller == 5.0) {", "            pos = rotateY(rotation - PI_60) * pos;",
            "            pos += P5;", "        }", "        if (propeller == 6.0) {",
            "            pos = rotateY(-rotation) * pos;", "            pos += P6;", "        }",
            "        pos = (matrix * vec4(pos, 1.0)).xyz;", "        if (num == 1.0) {",
            "            pos += offsetL;", "        }", "        if (num == 2.0) {",
            "            pos += offsetR;", "        }", "        float num3 = num / 3.0;",
            "        pos.xy += vec2(", "            0.00025 * shakeHeight * sin(shakeSpeed * 1.5 + num3),",
            "            0.002 * shakeHeight * sin(shakeSpeed * 9.0 + num3)) * sin((shakeSpeed * 3.0 + num3) * PI_2",
            "        );", "    } else {", "        pos = ZERO;", "    }",
            "    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);",
            "    vec4 viewPisition = viewMatrix * worldPosition;", "    vColor = c;",
            "    gl_Position = projectionMatrix * viewPisition;", "}"
        ].join("\n");
    }(t = e.vert || (e.vert = {}));
}(DRONE || (DRONE = {}));
!function (e) {
    var t;
    !function (e) {
        e.CITY_SCALE = 50, e.COLOR = {
            sky: 133177,
            skyLight: 16800,
            face: 1704021,
            faceLight: 1245246,
            wire: 480968,
            wireLight: 38399,
            point: 38655,
            particle1: 30719,
            particle2: 4784105,
            particle3: 16776136,
            wind1: 65475,
            wind2: 3542623,
            wind3: 11353596,
            road: 42239,
            route: 16777215,
            rain: 11197951,
            mist: 16777215,
            flash: 15790320,
            dark: 0,
            birdFace: 538706,
            birdFaceLight: 2007807,
            birdWire: 12315647,
            droneFace: 2878,
            droneFaceLight: 27135,
            droneWire: 57855
        }, e.COLOR_GL = {
            sky: chroma(e.COLOR.sky).gl(),
            skyLight: chroma(e.COLOR.skyLight).gl(),
            face: chroma(e.COLOR.face).gl(),
            faceLight: chroma(e.COLOR.faceLight).gl(),
            wire: chroma('33cc00').gl(),
            wireLight: chroma('33cc00').gl()
        };
    }(t = e.S || (e.S = {}));
}(DRONE || (DRONE = {}));

!function (e) {
    var t;
    !function (e) {
        function t(e, t) {
            void 0 === t && (t = "");
            var n, r, o;
            for (r = e.concat(), o = r.length, n = 0; n < o; n++) r[n] = "change:" + t + r[n];
            return r.join(" ");
        }

        function n(e, t) {
            void 0 === t && (t = "");
            var n, r, o;
            for (r = e.concat(), o = r.length, n = 0; n < o; n++) r[n] = t + r[n];
            return r.join(" ");
        }

        function r(e, t, n) {
            var r = 1 - n;
            return chroma.gl(e[0] * r + t[0] * n, e[1] * r + t[1] * n, e[2] * r + t[2] * n).hex();
        }

        function o(e, t, n, r) {
            var o = 1 - r;
            n.x = e[0] * o + t[0] * r, n.y = e[1] * o + t[1] * r, n.z = e[2] * o + t[2] * r;
        }

        function i(e, t) {
            var n = chroma(e).gl();
            t.x = n[0], t.y = n[1], t.z = n[2];
        }

        function a(e, t) {
            var n = chroma(e).alpha(t).gl();
            return new THREE.Vector4(n[0], n[1], n[2], n[3]);
        }

        function s(e) {
            var t = chroma(e).gl();
            return new THREE.Vector3(t[0], t[1], t[2]);
        }

        e.joinChangeNames = t, e.joinNames = n, e.colorTransform = r, e.colorTransformToVector4 = o,
            e.setRGBToVector4 = i, e.rgbaToVector4 = a, e.rgbToVector3 = s;
    }(t = e.C || (e.C = {}));
}(DRONE || (DRONE = {}));

!function (e) {
    var t;
    !function (e) {
        e.basic_color = ["precision highp float;", "attribute vec3 position;", "varying vec4 vColor;",
            "varying vec3 vPosition;", "varying vec3 vWorldPosition;", "uniform vec4 rgba;",
            "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat4 modelMatrix;",
            "uniform vec3 cameraPosition;", "void main(void) {", "    vPosition = position;",
            "    vec4 worldPosition = modelMatrix * vec4(position, 1.0 );",
            "    vWorldPosition = worldPosition.xyz;", "    vColor = rgba;",
            "    gl_Position = projectionMatrix * viewMatrix * worldPosition;", "}"
        ].join("\n");
    }(t = e.vert || (e.vert = {}));
}(DRONE || (DRONE = {}));

!function (e) {
    var t;
    !function (e) {
        e.basic_color = ["precision highp float;", "varying vec4 vColor;", "varying vec4 vPosition;",
            "void main(void) {", "    if (vColor.a <= 0.0) discard;", "    gl_FragColor = vColor;", "}"
        ].join("\n");
    }(t = e.frag || (e.frag = {}));
}(DRONE || (DRONE = {}));

//Scene Manager section
!function (e) {
    class t extends Backbone.Model {
        constructor() {
            super();
        }

        updateCamera = () => {
            if (this.get('cameraMode') == "globalView") {
                this.camera.position.y = 450;
                this.camera.lookAt(0, 0, 0);
            } else {
                let relativeCameraOffset = new THREE.Vector3(0, 0.03, -0.05);
                var cameraOffset = relativeCameraOffset.applyMatrix4(
                    e.Drone.container.matrixWorld
                );

                this.camera.position.x = cameraOffset.x;
                this.camera.position.y = cameraOffset.y;
                this.camera.position.z = cameraOffset.z;
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.camera.lookAt(e.Drone.container.position);


            }

        }

        init() {


            this.on('change:cameraMode', this.updateCamera);

            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e3);
            this.camera.position.z = 3;
            this.camera.position.y = 2;
            this.camera.lookAt(0, 0, 0);


            this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: !0});
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.time = 0;
            document.body.appendChild(this.renderer.domElement);
            e.Drone.init();

            this.scene.add(e.Drone.container);
            e.environment.init();
            e.environment.container.rotation.x = -0.5 * Math.PI;
            this.scene.add(e.environment.container);

            this.set({cameraMode: 'thirdPersonView'});
            this.set({droneAltitude: e.Drone.container.position.y});

            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.maxDelta = 1 / 15 * 1e3;
            createjs.Ticker.addEventListener("tick", this._onRAF);

        }

        _onWindowResize = () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        _onRAF = (t) => {
            let r = t.delta / 1e3;
            this.time += r;
            this.trigger("draw", this.time, r);
            e.Drone.updateNavController();
            this.renderer.render(this.scene, this.camera);
        }

    }

    e.sceneManager = new t();
}(DRONE || (DRONE = {}));


//Construct environment
!function (e) {
    class t extends Backbone.Model {
        constructor() {
            super();
            this.container = new THREE.Group();
            this.buildingContainer = new THREE.Group();
            this.buildingContainer.name = 'building';
            this.matrixContainer = new THREE.Group();
            this.matrixContainer.name = 'matrix';
            this.targetContainer = new THREE.Group();
            this.targetContainer.name = 'targetContainer';
            this.position =0;
        }

        getNodeIndex = (w, h, d, width, height) => {
            return w + h * width + d * width * height;
        };
        world3DtoGrid = (position,
                         width,
                         height,
                         depth,
                         w_width,
                         w_height,
                         w_depth) => {
            let pos = JSON.parse(JSON.stringify(position));
            pos.x += w_width / 2;
            pos.y = w_height / 2 - pos.y;
            let cor = {};
            cor.xGrid = Math.round((pos.x / w_width) * width);
            cor.yGrid = Math.round((pos.y / w_height) * height);
            cor.zGrid = Math.round((pos.z / w_depth) * depth);
            return cor;
        }
        world3DtoNode = pos => {
            let targetGridIndex = this.world3DtoGrid(
                pos,
                this.get('width_segment'),
                this.get('height_segment'),
                this.get('depth_segment'),
                this.get('width'),
                this.get('height'),
                this.get('depth')
            );
            return this.getNodeIndex(
                targetGridIndex.xGrid,
                targetGridIndex.yGrid,
                targetGridIndex.zGrid,
                this.get('width_segment'),
                this.get('height_segment')
            );
        };
        animateRotation = () => {
            if(this.get('animationPoints').length >0){

                if(e.Drone.container.quaternion.angleTo(this.get('quaternion')) <0.1){
                    e.sceneManager.off('draw', this.animateRotation);
                    this.startPos = new THREE.Vector3();
                    this.startPos.copy(e.Drone.container.position);
                    e.sceneManager.on('draw', this.animateTranslation);
                }
                e.Drone.container.quaternion.rotateTowards(this.get('quaternion'), 0.01);

            }


        }

        animateTranslation = () => {


            let target = this.get('animationPoints');
            if(target.length >0){
               let speed = 0.5;
                let distance = e.Drone.container.position.distanceTo(target[0])
                let dronePos = new THREE.Vector3();
                let targetPos = new THREE.Vector3();
                targetPos.copy(target[0]);
                dronePos.copy(e.Drone.container.position);
                let direction = targetPos.sub(dronePos).normalize();
                if(distance <0.5){
                    target.shift();

                    this.set({animationPoints:target});
                    if(target.length >0){
                        this.initQuaternion(target[0]);
                        e.sceneManager.on('draw', this.animateRotation);
                        e.sceneManager.off('draw', this.animateTranslation);
                    }
                   else{
                        e.sceneManager.off('draw', this.animateTranslation);
                    }


                }
                else{
                    e.Drone.container.position.add(direction.multiplyScalar(speed));
                    e.sceneManager.set({droneAltitude:e.Drone.container.position.y})
                }
            }
            else{
                console.log("Completed!")
                e.sceneManager.off('draw', this.animateTranslation);
            }



        }
        initQuaternion=(target)=>{
            let cloneTarget = new THREE.Vector3();
            cloneTarget.copy(target);
            let quaternion = new THREE.Quaternion();
            let m4 = new THREE.Matrix4();
            let position = new THREE.Vector3();
            position.copy(e.Drone.container.position);
            if(cloneTarget.y < position.y) cloneTarget.y = position.y;
            m4.lookAt(cloneTarget, position, new THREE.Vector3(0,1,0));
            quaternion.setFromRotationMatrix(m4);
            this.set({quaternion:quaternion})
        }
        initAnimation = (flag=true) => {
            if(flag===true){
                if(this.get('animationPoints').length >0){
                    this.initQuaternion(this.get('animationPoints')[0]);
                    e.sceneManager.on('draw', this.animateRotation);


                }
            }
            else{

                e.sceneManager.off('draw', this.animateRotation);


            }

        }
        travelingSaleMan = (curPosIndex, targets) => {
            let srcIndex = curPosIndex;
            let paths = [];
            let finder = new PF.AStarFinder({
                heuristic: PF.Heuristic.euclidean
            });

             let targetClone = JSON.parse(JSON.stringify(targets));
            var self = this;
            returnMinPath(srcIndex,targetClone);

            function returnMinPath(currentIndex, targets) {
                if(targets.length ==0){
                    return;
                }
                let _paths=[];
                targets.forEach((t,i)=>{
                    let nodes = self.initNodes();
                    let targetIndex = self.world3DtoNode(t);
                    let _path = finder.findPath(nodes[currentIndex], nodes[targetIndex], nodes);
                    _paths.push(
                        {
                            from: currentIndex,
                            to: targetIndex,
                            paths: _path,
                            index: i
                        }
                    )
                })
                let min = _paths.reduce((prev, current)=>{
                    return (prev.paths.length < current.paths.length) ? prev : current
                });
                paths.push(min);
                targets.splice(min.index, 1);
                returnMinPath(min.to, targets);

            }
            return paths;
        }
        initPaths = () => {

            let DronePos = new THREE.Vector3();
            DronePos.copy(e.Drone.container.position);
            DronePos.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.5 * Math.PI);
            //Check if target is not empty
            if (this.targetContainer.children.length > 0) {
                let finder = new PF.AStarFinder({
                    heuristic: PF.Heuristic.euclidean
                });
                //convert drone position to node index
                let droneIndex = this.world3DtoNode(DronePos);
                let targets = this.targetContainer.children.map(t=> {return t.position})
                let _paths = this.travelingSaleMan(droneIndex, targets);
                console.log(_paths);
                if (_paths.length > 0) {
                    let lmaterial = new THREE.LineBasicMaterial({
                        color: 0x0000ff
                    });
                    let temp =[];
                    let lgeometry = new THREE.Geometry();
                    _paths.forEach(p => {
                       if(p.paths.length >0){
                           p.paths.forEach(path=>{
                               let v3 = new THREE.Vector3(path[0], path[1], path[2])
                               lgeometry.vertices.push(new THREE.Vector3(path[0], path[1], path[2]));
                               v3.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.5 * Math.PI);
                               temp.push(v3)
                           })
                       }

                    });
                    let line = new THREE.Line(lgeometry, lmaterial);
                    this.container.add(line);
                    // let catmul = new THREE.CatmullRomCurve3(temp);
                    // catmul.getPoints(300);
                    this.set({animationPoints:temp});
                    this.initAnimation();
                //
                }
            }


        }
        initRandomTarget = (count) => {
            const clamp = (val, min, max) => {
                return Math.min(Math.max(min, val), max);
            };

            const getRandom = (min, max) => {
                return Math.random() * (max - min) + min;
            };
            for (let i = 0; i < count; i++) {
                let targetGeo = new THREE.BoxGeometry(10, 10, 10);
                let targetMat = new THREE.MeshBasicMaterial({
                    color: 0x00ff00
                });
                let target = new THREE.Mesh(targetGeo, targetMat);
                target.name = "target";
                target.position.set(
                    getRandom(-300, 300),
                    getRandom(-200, 200),
                    getRandom(10, 40)
                );
                this.targetContainer.add(target);
            }


        };

        init() {
            this.initConfig();
            this.initPlane();
            this.initOSM();
            this.initRandomTarget(5);

            this.container.add(this.targetContainer);



        }

        _updateMatrix = () => {
            console.log('Matrix is updated!')
        }
        updateNodes = (mat, currentNodes) => {
            let curr = currentNodes;

            mat.forEach((height, d) => {
                height.forEach((width, h) => {
                    width.forEach((element, w) => {
                        let index =
                            w + h * width.length + d * height.length * width.length;
                        if (element.walkable === 0) {
                            //Go to its neighbours
                            element.n_neighbours.forEach(n => {
                                //Check if the neighbour index is walkable
                                if (
                                    mat[curr[n].zGrid][curr[n].yGrid][curr[n].xGrid]
                                        .walkable === 0
                                ) {
                                    curr[index].neighbors.push(curr[n]);
                                }
                            });
                        }
                    });
                });
            });
            return curr;
        }
        projectMatrix = matrix => {
            let nodes = [];
            matrix.forEach((height, d) => {
                height.forEach((width, h) => {
                    width.forEach((element, w) => {
                        let index =
                            w + h * width.length + d * height.length * width.length;
                        let node = new PF.Node(
                            parseFloat(element.x_3D),
                            parseFloat(element.y_3D),
                            parseFloat(element.z_3D),
                        );
                        node.index = index;
                        node.xGrid = parseInt(element.x);
                        node.yGrid = parseInt(element.y);
                        node.zGrid = parseInt(element.z);
                        nodes.push(node);
                    });
                });
            });
            return nodes;
        }
        initMatrixWorld = (width = 30, height = 16, depth = 3, w_world = 1024, h_world = 512, d_world = 60) => {
            const create3Dmatrix = (width,
                                    height,
                                    depth,
                                    w_world,
                                    h_world,
                                    d_world) => {
                let matrix = [];
                for (let d = 0; d < depth; d++) {
                    let _h = [];
                    for (let h = 0; h < height; h++) {
                        let m = [];
                        for (let w = 0; w < width; w++) {
                            let iswalkable =0;
                            let neighbours = [];
                            let currentIndex = w + h * width + d * height * width;
                            let _left = w == 0 ? null : currentIndex - 1;
                            let _right = w + 1 == width ? null : currentIndex + 1;
                            let _top =
                                h == 0 ? null : w + (h - 1) * width + d * height * width;
                            let _bottom =
                                h + 1 == height ?
                                    null :
                                    w + (h + 1) * width + d * height * width;
                            let _down =
                                d == 0 ? null : w + h * width + (d - 1) * width * height;
                            let _up =
                                d + 1 == depth ?
                                    null :
                                    w + h * width + (d + 1) * width * height;

                            let _rightTop = null;
                            if (_right != null && _top != null) {
                                _rightTop = _top + 1;
                            }
                            let _rightTopUp = null;
                            if (_right != null && _top != null && _up != null) {
                                _rightTopUp =
                                    w + (h - 1) * width + (d + 1) * width * height + 1;
                            }

                            let _rightTopDown = null;
                            if (_right != null && _top != null && _down != null) {
                                _rightTopDown =
                                    w + (h - 1) * width + (d - 1) * width * height + 1;
                            }
                            let _rightBottom = null;
                            if (_right != null && _bottom != null) {
                                _rightBottom = _bottom + 1;
                            }
                            let _rightBottomUp = null;
                            if (_right != null && _bottom != null && _up != null) {
                                _rightBottomUp =
                                    w + (h + 1) * width + (d + 1) * width * height + 1;
                            }
                            let _rightBottomDown = null;
                            if (_right != null && _bottom != null && _down != null) {
                                _rightBottomDown =
                                    w + (h + 1) * width + (d - 1) * width * height + 1;
                            }
                            let _leftTop = null;
                            if (_left != null && _top != null) {
                                _leftTop = _top - 1;
                            }
                            let _leftTopUp = null;
                            if (_left != null && _top != null && _up != null) {
                                _leftTopUp =
                                    w + (h - 1) * width + (d + 1) * width * height - 1;
                            }
                            let _leftTopDown = null;
                            if (_left != null && _top != null && _down != null) {
                                _leftTopDown =
                                    w + (h - 1) * width + (d - 1) * width * height - 1;
                            }
                            let _leftBottom = null;
                            if (_left != null && _bottom != null) {
                                _leftBottom = _bottom - 1;
                            }
                            let _leftBottomUp = null;
                            if (_left != null && _bottom != null && _up != null) {
                                _leftBottomUp =
                                    w + (h + 1) * width + (d + 1) * width * height - 1;
                            }
                            let _leftBottomDown = null;
                            if (_left != null && _bottom != null && _down != null) {
                                _leftBottomDown =
                                    w + (h + 1) * width + (d - 1) * width * height - 1;
                            }
                            if (_left != null) neighbours.push(_left);
                            if (_right != null) neighbours.push(_right);
                            if (_top != null) neighbours.push(_top);
                            if (_bottom != null) neighbours.push(_bottom);
                            if (_up != null) neighbours.push(_up);
                            if (_down != null) neighbours.push(_down);
                            if (_rightTop != null) neighbours.push(_rightTop);
                            if (_rightTopUp != null) neighbours.push(_rightTopUp);
                            if (_rightTopDown != null) neighbours.push(_rightTopDown);
                            if (_rightBottom != null) neighbours.push(_rightBottom);
                            if (_rightBottomUp != null) neighbours.push(_rightBottomUp);
                            if (_rightBottomDown != null) neighbours.push(_rightBottomDown);

                            if (_leftTop != null) neighbours.push(_leftTop);
                            if (_leftTopUp != null) neighbours.push(_leftTopUp);
                            if (_leftTopDown != null) neighbours.push(_leftTopDown);
                            if (_leftBottom != null) neighbours.push(_leftBottom);
                            if (_leftBottomUp != null) neighbours.push(_leftBottomUp);
                            if (_leftBottomDown != null) neighbours.push(_leftBottomDown);

                            let objects = e.sceneManager.scene.getObjectByName("building");
                           // console.log(objects)
                            for (let i = 0; i < objects.children.length; i++) {
                                var bbox = new THREE.Box3().setFromObject(objects.children[i]);
                                // console.log(bbox);

                                if (
                                    bbox.containsPoint({
                                        x: w * (w_world / width) - w_world / 2,
                                        y: h_world / 2 - h * (h_world / height),
                                        z: d * (d_world / depth)
                                    })
                                ) {
                                    iswalkable = 1;
                                    break;
                                }
                            }

                            m.push({
                                x: w,
                                y: h,
                                z: d,
                                x_2D: w * (w_world / width),
                                y_2D: h * (h_world / height),
                                z_2D: d * (d_world / depth),
                                x_3D: w * (w_world / width) - w_world / 2,
                                y_3D: h_world / 2 - h * (h_world / height),
                                z_3D: d * (d_world / depth),
                                walkable: iswalkable, //true and 1 =false
                                nodeIndex: w + h * width + d * height * width,
                                n_left: _left,
                                n_right: _right,
                                n_top: _top,
                                n_bottom: _bottom,
                                n_up: _up,
                                n_down: _down,
                                n_neighbours: iswalkable ==0?neighbours:[]
                            });
                        }
                        _h.push(m);
                    }
                    matrix.push(_h);
                }
                return matrix;
            };

            let matrix = create3Dmatrix(
                width,
                height,
                depth,
                w_world,
                h_world,
                d_world
            );
           return matrix;
            // let nodes = this.projectMatrix(matrix);
            // this.set({matrixData: matrix})
            // this.on('change:matrixData', this._updateMatrix)
            // var self = this;
            // nodes.forEach(node => {
            //     var objects = e.sceneManager.scene.getObjectByName("building");
            //     let material = new THREE.MeshBasicMaterial({
            //         color: 0xff0000
            //     });
            //     for (let i = 0; i < objects.children.length; i++) {
            //         var bbox = new THREE.Box3().setFromObject(objects.children[i]);
            //         // console.log(bbox);
            //
            //         if (
            //             bbox.containsPoint({
            //                 x: node.x,
            //                 y: node.y,
            //                 z: node.z
            //             })
            //         ) {
            //             material = new THREE.MeshBasicMaterial({
            //                 color: 0xffff00,
            //                 wireframe: true
            //             });
            //             //Place some obstacles at given cells
            //             let myMatrix = self.get('matrixData')
            //             myMatrix[node.zGrid][node.yGrid][node.xGrid].walkable = 1;
            //             self.set({matrixData: myMatrix});
            //             self.trigger('change:matrixData');
            //             break;
            //         }
            //     }
            //
            //     let geometry = new THREE.BoxGeometry(1, 1, 1);
            //
            //     let cube = new THREE.Mesh(geometry, material);
            //     cube.name = "grid";
            //     cube.position.x = node.x;
            //     cube.position.y = node.y;
            //     cube.position.z = node.z;
            //     self.matrixContainer.add(cube);
            //
            // });
            // this.container.add(this.matrixContainer);
            // nodes = this.updateNodes(matrix, nodes);
            // this.nodes = nodes;
            //this.initPaths();

        }
        drawBuilding = (buildings, CENTER_LON, CENTER_LAT, zoom) => {

            const deg2rad = deg => {
                return deg * (Math.PI / 180);
            };
            const mercatorY = lat => {
                lat = deg2rad(lat);
                return (
                    (256 / Math.PI) *
                    Math.pow(2, zoom) *
                    (Math.PI - Math.log(Math.tan(Math.PI / 4 + lat / 2)))
                );
            };
            const mercatorX = lon => {
                lon = deg2rad(lon);
                return (256 / Math.PI) * Math.pow(2, zoom) * (lon + Math.PI);
            };
            const cx = mercatorX(parseFloat(CENTER_LON));
            const cy = mercatorY(parseFloat(CENTER_LAT));

            for (let building of buildings) {
                let shape = new THREE.Shape();
                building.node.forEach((node, index) => {

                    let x = mercatorX(parseFloat(node.lon)) - cx;
                    let y = cy - mercatorY(parseFloat(node.lat));
                    index == 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
                });
                let default_height = 10;
                building.tags.forEach(tag => {
                    if (tag.k == "building:levels") {
                        default_height *= tag.v;
                    } else if (tag.k == "building:height") {
                        default_height = tag.v;
                    }
                });
                let shapeGeo = new THREE.ExtrudeBufferGeometry(shape, {
                    steps: 1,
                    depth: default_height,
                    bevelEnabled: false,
                    bevelThickness: 1,
                    bevelSize: 1,
                    bevelSegments: 1
                });
                let shapeMat = new THREE.MeshBasicMaterial({
                    color: "#993333",
                    opacity: 1,
                    wireframe: true
                });
                let shapeMesh = new THREE.Mesh(shapeGeo, shapeMat);
                shapeGeo.computeBoundingBox();
                this.buildingContainer.add(shapeMesh);
            }
            this.container.add(this.buildingContainer);
            this.set({matrixData: this.initMatrixWorld()});//matrix data is ready
            this.initPaths();

        }
        initNodes =()=>{
            let matrix = this.get('matrixData');
            let nodes = [];
            //create nodes first
            matrix.forEach((height, d) => {
                height.forEach((width, h) => {
                    width.forEach((element, w) => {
                        let index =
                            w + h * width.length + d * height.length * width.length;
                        let node = new PF.Node(
                            parseFloat(element.x_3D),
                            parseFloat(element.y_3D),
                            parseFloat(element.z_3D),
                        );
                        node.index = index;
                        node.xGrid = parseInt(element.x);
                        node.yGrid = parseInt(element.y);
                        node.zGrid = parseInt(element.z);
                        nodes.push(node);
                    });
                });
            });
            //update nodes neighbours
            matrix.forEach((height, d) => {
                height.forEach((width, h) => {
                    width.forEach((element, w) => {
                        let index =
                            w + h * width.length + d * height.length * width.length;
                        if (element.walkable === 0) {
                            //Go to its neighbours
                            element.n_neighbours.forEach(n => {
                                //Check if the neighbour index is walkable
                                if (
                                    matrix[nodes[n].zGrid][nodes[n].yGrid][nodes[n].xGrid]
                                        .walkable === 0
                                ) {
                                    nodes[index].neighbors.push(nodes[n]);
                                }
                            });
                        }
                    });
                });
            });

            return nodes;
        }
        initOSM() {
            var sefl = this;
            this.getOSM()
                .then(response => response.text())
                .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
                .then(data => {
                    let _data = sefl.extractNodesandWays(data);
                    let waysXML = _data.ways;
                    let nodes = _data.nodes;
                    let ways = sefl.extractNodes(waysXML, nodes);
                    let buildings = sefl.extractBuildings(ways);
                    sefl.drawBuilding(buildings,
                        sefl.get('longitude'),
                        sefl.get('latitude'),
                        sefl.get('zoom'));
                });
        }

        extractNodes = (xmls, nodes) => {
            let waysObj = [];
            xmls.forEach(xml => {
                let wayId = xml.getAttribute("id");
                let node = [];
                xml.querySelectorAll("nd").forEach(nd => {
                    let ref = nd.getAttribute("ref");
                    let lat = nodes[ref].lat;
                    let lon = nodes[ref].lon;
                    node.push({
                        ref,
                        lat,
                        lon
                    });
                });
                let tags = [];
                xml.querySelectorAll("tag").forEach(tag => {
                    let k = tag.getAttribute("k");
                    let v = tag.getAttribute("v");
                    tags.push({
                        k,
                        v
                    });
                });
                waysObj.push({
                    wayId,
                    node,
                    tags
                });
            });
            return waysObj;
        }
        extractBuildings = (ways) => {
            let buildings = [];
            ways.forEach(way => {
                way.tags.forEach(tag => {
                    if (tag.k.includes("building")) {
                        buildings.push(way);
                    }
                });
            });
            return buildings;
        }
        extractNodesandWays = (osm) => {
            let nodes = {};
            osm.querySelectorAll("node").forEach(n => {
                nodes[n.getAttribute("id")] = {
                    lat: n.getAttribute("lat"),
                    lon: n.getAttribute("lon")
                };
            });
            let ways = osm.querySelectorAll("way");
            return {
                nodes,
                ways
            };
        }
        showMatrix = () => {
            let status = this.get('showMatrixWorld')
            this.container.getObjectByName('matrix').visible = status;
        };

        initConfig() {
            this.set({
                longitude: "-101.875", latitude: "33.5845",
                zoom: 15,
                offline: true,
                width: 1024,
                height: 512,
                depth: 60,
                width_segment: 30,
                height_segment: 16,
                depth_segment: 3,
                showMatrixWorld: true
            });
            this.on('change:showMatrixWorld', this.showMatrix)
        }

        initPlane() {
            let img = `https://api.mapbox.com/styles/v1/mapbox/light-v9/static/${
                this.get('longitude')
                },${this.get('latitude')},${this.get('zoom')},0,0/${
                this.get('width')
                }x${
                this.get('height')
                }?access_token=pk.eyJ1IjoidmluaG50IiwiYSI6ImNqb2VqdXZvaDE4cnkzcG80dXkxZzlhNWcifQ.G6sZ1ukp_DhiSmCvgKblVQ`;
            let pl_texture = new THREE.TextureLoader().load(img);
            let pl_material = new THREE.MeshBasicMaterial({
                map: pl_texture
            });

            let pl_geometry = new THREE.PlaneGeometry(1024, 512);
            var pl_mesh = new THREE.Mesh(pl_geometry, pl_material);
            pl_mesh.name = "plane";
            this.container.add(pl_mesh);
        }

        async getOSM() {
            let url = "assets/model/map_data.xml";
            return await fetch(url);
        }
    }

    e.environment = new t();
}(DRONE || (DRONE = {}));

//Drone controller
!function (e) {
    class t extends Backbone.Model {

        init() {

            $(window).on('resize', this._onResize);// window resize
            $('#globalView').on('click', this._onGlobalView)
            $('#thirdPersonView').on('click', this._onThirdPersonView)
            $('#m-top').on('mousedown', this._navTopMouseDown)
            $('#m-top').on('mouseup', this._navTopMouseUp)
            $('#m-forward').on('mousedown', this._navTopFMouseDown)
            $('#m-forward').on('mouseup', this._navTopFMouseUp)
            $('#m-backward').on('mousedown', this._navTopBMouseDown)
            $('#m-backward').on('mouseup', this._navTopBMouseUp)
            $('#m-bottom').on('mousedown', this._navBottomMouseDown)
            $('#m-bottom').on('mouseup', this._navBottomMouseUp)
            $('#m-left').on('mousedown', this._navLeftMouseDown)
            $('#m-left').on('mouseup', this._navLeftMouseUp)
            $('#m-right').on('mousedown', this._navRightMouseDown)
            $('#m-right').on('mouseup', this._navRightMouseUp)
            $('#m-center').on('mousedown', this._navCenterMouseDown)

            $('#r-top').on('mousedown', this._rotTopMouseDown)
            $('#r-top').on('mouseup', this._rotTopMouseUp)
            $('#r-bottom').on('mousedown', this._rotBottomMouseDown)
            $('#r-bottom').on('mouseup', this._rotBottomMouseUp)
            $('#r-left').on('mousedown', this._rotLeftMouseDown)
            $('#r-left').on('mouseup', this._rotLeftMouseUp)
            $('#r-right').on('mousedown', this._rotRightMouseDown)
            $('#r-right').on('mouseup', this._rotRightMouseUp)

            e.sceneManager.on('change:droneAltitude', this._updateAltitude)


        }

        _updateAltitude = () => {

            $('#altitude').html(' ' + e.sceneManager.get('droneAltitude').toFixed(2) + ' meters');
        }
        _onThirdPersonView = () => {
            e.sceneManager.set({cameraMode: 'thirdPersonView'})
        }
        _onGlobalView = () => {
            e.sceneManager.set({cameraMode: 'globalView'})
        }
        _rotRightMouseDown = () => {
            this.set({rotMouseRightClicked: true});

        }
        _rotRightMouseUp = () => {
            this.set({rotMouseRightClicked: false});
        }
        _rotLeftMouseDown = () => {
            this.set({rotMouseLeftClicked: true});
        }
        _rotLeftMouseUp = () => {
            this.set({rotMouseLeftClicked: false});
        }
        _rotTopMouseDown = () => {
            this.set({rotMouseTopClicked: true});
        }
        _rotTopMouseUp = () => {
            this.set({rotMouseTopClicked: false});
        }
        _rotBottomMouseDown = () => {
            this.set({rotMouseBottomClicked: true});
        }
        _rotBottomMouseUp = () => {
            this.set({rotMouseBottomClicked: false});
        }
        _navTopBMouseDown = () => {
            this.set({navMouseBackwardClicked: true});
        }
        _navTopBMouseUp = () => {
            this.set({navMouseBackwardClicked: false});
        }
        _navTopFMouseDown = () => {
            this.set({navMouseForwardClicked: true});
        }
        _navTopFMouseUp = () => {
            this.set({navMouseForwardClicked: false});
        }
        _navTopMouseUp = () => {
            this.set({navMouseTopClicked: false});
        }
        _navBottomMouseUp = () => {
            this.set({navMouseBottomClicked: false});
        }
        _navLeftMouseUp = () => {
            this.set({navMouseLeftClicked: false});
        }
        _navRightMouseUp = () => {
            this.set({navMouseRightClicked: false});
        }
        _navBottomMouseDown = () => {
            this.set({navMouseBottomClicked: true});

        }
        _navLeftMouseDown = () => {
            this.set({navMouseLeftClicked: true});

        }
        _navRightMouseDown = () => {
            this.set({navMouseRightClicked: true});

        }
        _navCenterMouseDown = () => {
            this.set({navMouseCenterClicked: true});
            e.environment.initAnimation(false);
        }
        _navTopMouseDown = () => {
            this.set({navMouseTopClicked: true});

        }
        _onResize = () => {
            e.sceneManager._onWindowResize();
        }
    }

    e.droneController = new t();
}(DRONE || (DRONE = {}));
!function (e) {
    var t = function () {
        function t() {
            var t = this;
            this._onPreload = function () {
                createjs.Tween.get(t).wait(100).call(t._onPreload2);
            }, this._onPreload2 = function () {

                e.sceneManager.init();
                e.droneController.init();
                $('#notification').hide();
            };
        }

        return t.prototype.init = function (t) {
            e.preload.on("complete", this._onPreload), e.preload.load();
        }, t;
    }();
    e.index = new t();
}(DRONE || (DRONE = {}));

DRONE.index.init();