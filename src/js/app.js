var DRONE; //Global  namespace
/** Copyright 2019 by Vinh T. Nguyen
 *  Loading map_xml and drone model
 *  Save result to preload.result.{map, model}
 */
!function (e) {
    const t = Backbone.Model.extend({
        init: function () {
            this.result = {};
            this.texture = {};
            this._queue = new createjs.LoadQueue();
            this._queue.on('complete', this._onComplete, this);
            this._queue.on('fileload', this._onFileLoad, this);
            this._queue.on('progress', this._onProgress, this);
            this._queue.loadManifest([
                {id: "model", src: "./src/assets/model/model.json"},
                {id: "map", src: "./src/assets/model/map_data.xml"},
                {id: "particle1", src: "./src/assets/images/particle1.png", type: createjs.Types.IMAGE},
                {id: "particle2", src: "./src/assets/images/particle2.png"},
                {id: "hex", src: "./src/assets/images/hex.png"}
            ]);
        },
        _onProgress: function (e) {
            let progress = Math.round(e.loaded * 100);
            $('#percentile').html(`LOAD  ${progress} %`)
        },
        _onFileLoad: function (e) {
            let n = e.item.id;
            this.result[n] = e.result;
            if (e.item.type === createjs.Types.IMAGE) {
                let textureLoader = new THREE.TextureLoader();
                let sprite = textureLoader.load(e.item.src);
                this.texture[n] = sprite;
            }
            ;
        },
        _onComplete: function () {
            this.trigger('complete');
        }
    });
    e.Preload = t;
    e.preload = new t();
}(DRONE || (DRONE = {}));
/**
 * Construct Shaders: fragment shader and vertex shader
 */
!function (e) {
    const t = {};
    t.vert = {};
    t.vert.basic_quad = ["precision highp float;", "attribute vec3 position;", "attribute vec2 uv;", "varying vec2 vUv;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "void main(void) {", "    vUv = uv;", "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );", "}"].join("\n");
    t.vert.basic_color = ["precision highp float;", "attribute vec3 position;", "varying vec4 vColor;", "varying vec3 vPosition;", "varying vec3 vWorldPosition;", "uniform vec4 rgba;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat4 modelMatrix;", "uniform vec3 cameraPosition;", "void main(void) {", "    vPosition = position;", "    vec4 worldPosition = modelMatrix * vec4(position, 1.0 );", "    vWorldPosition = worldPosition.xyz;", "    vColor = rgba;", "    gl_Position = projectionMatrix * viewMatrix * worldPosition;", "}"].join("\n");
    t.vert.drone_face = ["precision highp float;", "#ifndef PI", "#define PI 3.141592653589793", "#endif", "#ifndef PI_2", "#define PI_2 6.283185307179586", "#endif", "#ifndef PI_HARF", "#define PI_HARF 1.5707963267948966", "#endif", "#ifndef PI_QUARTER", "#define PI_QUARTER 0.7853981633974483", "#endif", "mat3 rotateY(float rad) {", "    float c = cos(rad);", "    float s = sin(rad);", "    return mat3(", "        c, 0.0, s,", "        0.0, 1.0, 0.0,", "        -s, 0.0, c", "    );", "}", "const vec3 P1 = vec3(-0.0115, 0.019, -0.0199);", "const vec3 P2 = vec3(0.0115, 0.019, -0.0199);", "const vec3 P3 = vec3(0.023, 0.019, 0.0);", "const vec3 P4 = vec3(0.0115, 0.019, 0.0199);", "const vec3 P5 = vec3(-0.0115, 0.019, 0.0199);", "const vec3 P6 = vec3(-0.023, 0.019, 0.0);", "const float PI_60 = PI / 3.0;", "const vec3 ZERO = vec3(0.0, 0.0, 0.0);", "attribute vec3 position;", "attribute float num;", "attribute float propeller;", "varying vec4 vColor;", "varying vec4 vPosition;", "uniform vec4 rgba;", "uniform float time;", "uniform float shakeSpeed;", "uniform float shakeHeight;", "uniform float rotation;", "uniform vec3 offsetL;", "uniform vec3 offsetR;", "uniform float opacityL;", "uniform float opacityR;", "uniform vec3 offsetScaleL;", "uniform vec3 offsetScaleR;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat4 modelMatrix;", "uniform mat4 matrix;", "void main(void) {", "    vec3 pos = position;", "    vec4 c = rgba;", "    bool visible = true;", "    if (num == 1.0) {", "        if (opacityL == 0.0) {", "            visible = false;", "        } else {", "            c.a *= opacityL;", "        }", "    } else if (num == 2.0) {", "        if (opacityR == 0.0) {", "            visible = false;", "        } else {", "             c.a *= opacityR;", "         }", "    }", "    if (visible) {", "        if (propeller == 1.0) {", "            pos = rotateY(rotation + PI_60) * pos;", "            pos += P1;", "        }", "        if (propeller == 2.0) {", "            pos = rotateY(-rotation - PI_60) * pos;", "            pos += P2;", "        }", "        if (propeller == 3.0) {", "            pos = rotateY(rotation) * pos;", "            pos += P3;", "        }", "        if (propeller == 4.0) {", "            pos = rotateY(-rotation + PI_60) * pos;", "            pos += P4;", "        }", "        if (propeller == 5.0) {", "            pos = rotateY(rotation - PI_60) * pos;", "            pos += P5;", "        }", "        if (propeller == 6.0) {", "            pos = rotateY(-rotation) * pos;", "            pos += P6;", "        }", "        pos = (matrix * vec4(pos, 1.0)).xyz;", "        if (num == 1.0) {", "            pos += offsetL;", "        }", "        if (num == 2.0) {", "            pos += offsetR;", "        }", "        float num3 = num / 3.0;", "        pos.xy += vec2(", "            0.00025 * shakeHeight * sin(shakeSpeed * 1.5 + num3),", "            0.002 * shakeHeight * sin(shakeSpeed * 9.0 + num3)) * sin((shakeSpeed * 3.0 + num3) * PI_2", "        );", "    } else {", "        pos = ZERO;", "    }", "    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);", "    vec4 viewPisition = viewMatrix * worldPosition;", "    vColor = c;", "    vPosition = worldPosition;", "    gl_Position = projectionMatrix * viewPisition;", "}"].join("\n");
    t.vert.drone_wire = ["precision highp float;", "#ifndef PI", "#define PI 3.141592653589793", "#endif", "#ifndef PI_2", "#define PI_2 6.283185307179586", "#endif", "#ifndef PI_HARF", "#define PI_HARF 1.5707963267948966", "#endif", "#ifndef PI_QUARTER", "#define PI_QUARTER 0.7853981633974483", "#endif", "mat3 rotateY(float rad) {", "    float c = cos(rad);", "    float s = sin(rad);", "    return mat3(", "        c, 0.0, s,", "        0.0, 1.0, 0.0,", "        -s, 0.0, c", "    );", "}", "const vec3 P1 = vec3(-0.0115, 0.019, -0.0198);", "const vec3 P2 = vec3(0.0115, 0.019, -0.0198);", "const vec3 P3 = vec3(0.023, 0.019, 0.0);", "const vec3 P4 = vec3(0.0115, 0.019, 0.0198);", "const vec3 P5 = vec3(-0.0115, 0.019, 0.0198);", "const vec3 P6 = vec3(-0.023, 0.019, 0.0);", "const float PI_60 = PI / 3.0;", "const vec3 ZERO = vec3(0.0, 0.0, 0.0);", "attribute vec3 position;", "attribute float num;", "attribute float propeller;", "varying vec4 vColor;", "uniform vec4 rgba;", "uniform float time;", "uniform float shakeSpeed;", "uniform float shakeHeight;", "uniform float rotation;", "uniform vec3 offsetL;", "uniform vec3 offsetR;", "uniform vec3 offsetScaleL;", "uniform vec3 offsetScaleR;", "uniform float opacityL;", "uniform float opacityR;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat4 modelMatrix;", "uniform mat4 matrix;", "void main(void) {", "    vec3 pos = position;", "    vec4 c = rgba;", "    bool visible = true;", "    if (num == 1.0) {", "        if (opacityL == 0.0) {", "            visible = false;", "        } else {", "            c.a *= opacityL;", "        }", "    } else if (num == 2.0) {", "        if (opacityR == 0.0) {", "            visible = false;", "        } else {", "             c.a *= opacityR;", "         }", "    }", "    if (visible) {", "        if (propeller == 1.0) {", "            pos = rotateY(rotation + PI_60) * pos;", "            pos += P1;", "        }", "        if (propeller == 2.0) {", "            pos = rotateY(-rotation - PI_60) * pos;", "            pos += P2;", "        }", "        if (propeller == 3.0) {", "            pos = rotateY(rotation) * pos;", "            pos += P3;", "        }", "        if (propeller == 4.0) {", "            pos = rotateY(-rotation + PI_60) * pos;", "            pos += P4;", "        }", "        if (propeller == 5.0) {", "            pos = rotateY(rotation - PI_60) * pos;", "            pos += P5;", "        }", "        if (propeller == 6.0) {", "            pos = rotateY(-rotation) * pos;", "            pos += P6;", "        }", "        pos = (matrix * vec4(pos, 1.0)).xyz;", "        if (num == 1.0) {", "            pos += offsetL;", "        }", "        if (num == 2.0) {", "            pos += offsetR;", "        }", "        float num3 = num / 3.0;", "        pos.xy += vec2(", "            0.00025 * shakeHeight * sin(shakeSpeed * 1.5 + num3),", "            0.002 * shakeHeight * sin(shakeSpeed * 9.0 + num3)) * sin((shakeSpeed * 3.0 + num3) * PI_2", "        );", "    } else {", "        pos = ZERO;", "    }", "    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);", "    vec4 viewPisition = viewMatrix * worldPosition;", "    vColor = c;", "    gl_Position = projectionMatrix * viewPisition;", "}"].join("\n");

    t.frag = {};
    t.frag.basic_color = ["precision highp float;", "varying vec4 vColor;", "varying vec4 vPosition;", "void main(void) {", "    if (vColor.a <= 0.0) discard;", "    gl_FragColor = vColor;", "}"].join("\n");
    t.frag.drone_face = ["#extension GL_OES_standard_derivatives : enable", "precision highp float;", "const vec3 LIGHT1 = vec3(0.0, 1.0, 0.0);", "const vec3 LIGHT2 = vec3(0.0, 0.8320502943378437, -0.5547001962252291);", "const vec3 LIGHT_COLOR = vec3(1.0);", "varying vec4 vColor;", "varying vec4 vPosition;", "uniform vec3 lightColor;", "void main(void) {", "    if (vColor.a <= 0.0) discard;", "    vec3 dx = dFdx(vPosition.xyz);", "    vec3 dy = dFdy(vPosition.xyz);", "    vec3 n = normalize(cross(normalize(dx), normalize(dy)));", "    vec4 rgba = vColor;", "    float diff;", "    diff = clamp(dot(n, LIGHT1), 0.1, 1.0);", "    rgba.rgb = mix(rgba.rgb, lightColor, diff);", "    if (rgba.a <= 0.0) discard;", "    gl_FragColor = rgba;", "}"].join("\n");

    e.Shaders = t;
}(DRONE || (DRONE = {}));

/**
 * Construct the drone model
 * To get this model => access to its container
 * To simulate wings rotation => activate the _onDraw function
 */
!function (e) {
    let t = Backbone.Model.extend({
        defaults: {
            COLOR: {
                droneFace: '#008bec',
                droneFaceLight: 27135,
                droneWire: 57855
            },
            COLOR_GL: {
                face: chroma(1704021).gl(),
                faceLight: chroma(1245246).gl(),
                wire: chroma('33cc00').gl(),
                wireLight: chroma('33cc00').gl()
            }
        },
        initialize: function () {
            this._onDraw = this._onDraw.bind(this);
        },
        init: function () {
            this.container = new THREE.Object3D();
            this.container.scale.set(50, 50, 50);
            this.initGeometry();
            this.initFace();
            this.initWire();
            e.AnimationController.on('draw', this._onDraw);
        },
        initGeometry: function () {
            var t = e.preload.result.model.drone,
                n = e.preload.result.model.propeller_left,
                r = e.preload.result.model.propeller_right,
                o = new THREE.BufferGeometry(),
                i = new THREE.BufferGeometry(),
                a = new THREE.BufferGeometry();
            o.addAttribute("position", new THREE.BufferAttribute(new Float32Array(t.v), 3)),
                i.addAttribute("position", new THREE.BufferAttribute(new Float32Array(n.v), 3)),
                a.addAttribute("position", new THREE.BufferAttribute(new Float32Array(r.v), 3)),
                o.setIndex(new THREE.BufferAttribute(new Uint32Array(t.fv), 1)),
                i.setIndex(new THREE.BufferAttribute(new Uint32Array(n.fv), 1)),
                a.setIndex(new THREE.BufferAttribute(new Uint32Array(r.fv), 1)),
                o.computeVertexNormals(),
                i.computeVertexNormals(),
                a.computeVertexNormals();
            var s = -.01;

            o.translate(0, s, 0),
                i.translate(0, s, 0),
                a.translate(0, s, 0),
                this.geometryFace = this._createGeometryFace({
                    vBody: o.attributes.position.array,
                    vPropellerL: i.attributes.position.array,
                    vPropellerR: a.attributes.position.array,
                    iBody: t.fv,
                    iPropellerL: n.fv,
                    iPropellerR: r.fv
                }),
                this.geometryWire = this._createGeometryWire({
                    vBody: new THREE.EdgesGeometry(o).attributes.position.array,
                    vPropellerL: new THREE.EdgesGeometry(i).attributes.position.array,
                    vPropellerR: new THREE.EdgesGeometry(a).attributes.position.array
                });
        },
        initFace: function () {
            const t = {
                    rgba: {
                        type: "v4",
                        value: e.Utility.rgbaToVector4(this.get('COLOR').droneFace, .75)
                    },
                    lightColor: {
                        type: "v3",
                        value: e.Utility.rgbToVector3(this.get('COLOR').droneFaceLight)
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
                    fragmentShader: e.Shaders.frag.drone_face,
                    vertexShader: e.Shaders.vert.drone_face,
                    blending: THREE.NormalBlending,
                    uniforms: t,
                    transparent: !0,
                    depthTest: !0,

                }),
                r = new THREE.Mesh(this.geometryFace, n);
            this.meshFace = r, this.materialFace = r.material, this.uniformsFace = r.material.uniforms,
                this.container.add(r);
        },
        initWire: function () {
            let t = {
                    rgba: {
                        type: "v4",
                        value: e.Utility.rgbaToVector4(this.get('COLOR').droneWire, .55)
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
                    fragmentShader: e.Shaders.frag.basic_color,
                    vertexShader: e.Shaders.vert.drone_wire,
                    blending: THREE.NormalBlending,
                    uniforms: t,
                    transparent: !0,
                    depthTest: !0,
                });
            n.linewidth = 1.5,
                n.linecap = "round",
                n.linejoin = "round";
            const r = new THREE.LineSegments(this.geometryWire, n);

            this.meshWire = r,
                this.materialWire = this.meshWire.material,
                this.uniformsWire = r.material.uniforms,
                this.container.add(r);
        },
        _onDraw: function (time, deltaTime) {
            let i = 65 * deltaTime;
            this.uniformsFace.rotation.value += i;
            this.uniformsWire.rotation.value += i;
        },
        _createGeometryFace: function (e) {
            let t, n, r, o, i, a, s, c, l, f;
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
            let u, h, v;
            return u = 3,
                h = new THREE.InstancedBufferGeometry(),
                h.maxInstancedCount = u,
                h.setIndex(new THREE.BufferAttribute(new Uint32Array(f), 1)),
                v = new THREE.InterleavedBuffer(l, a),
                h.addAttribute("position", new THREE.InterleavedBufferAttribute(v, 3, 0)),
                h.addAttribute("propeller", new THREE.InterleavedBufferAttribute(v, 1, 3)),
                h.addAttribute("num", new THREE.InstancedBufferAttribute(new Float32Array([0, 1, 2]), 1,
                    true)),
                h.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 999), h;
        },
        _createGeometryWire: function (e) {
            let t, n, r, o, i, a, s, c;
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
            return l = 3,
                f = new THREE.InstancedBufferGeometry(),
                f.maxInstancedCount = l,
                u = new THREE.InterleavedBuffer(c, a),
                f.addAttribute("position", new THREE.InterleavedBufferAttribute(u, 3, 0)),
                f.addAttribute("propeller", new THREE.InterleavedBufferAttribute(u, 1, 3)),
                f.addAttribute("num", new THREE.InstancedBufferAttribute(new Float32Array([0, 1, 2]), 1, true)),
                f.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 999), f;
        }
    });
    e.droneModel = new t();
}(DRONE || (DRONE = {}));

!function (e) {
    let t = Backbone.Model.extend({
        defaults:{
            paths:null,
            isPathReady:false,
            currentIndex:0,
            currentPaths:null,
            currentPathIndex:0
        },
        init:function(){
            let _procededPaths = this.get('paths');
            let _tempPaths =[];
            _procededPaths.forEach(p=>{
                    if(p.paths.length >0){
                        _tempPaths.push(p);
                    }
            });
            _tempPaths.shift();
            this.set({paths:_tempPaths});
            let firstPath = this.get('paths')[this.get('currentIndex')];
            this.set({currentPaths:firstPath});
            this.set({isPathReady:true})
        },
        getNext:function () {
            //If last point => first update
            let currentPathIndex = this.get('currentPathIndex');
            let currentIndex = this.get('currentIndex');
            let paths = this.get('currentPaths');
            if(paths.paths===null){
                return null
            }
            if(paths.paths.length===0||currentPathIndex===paths.paths.length){
                    currentIndex +=1;
                currentPathIndex =0;
                if(currentIndex ===this.get('paths').length){
                    console.log("End of road")
                    return null;
                }
                let currentPaths = this.get('paths')[currentIndex];
                this.set({currentIndex:currentIndex});
                this.set({currentPathIndex:currentPathIndex});
                this.set({currentPaths:currentPaths});
                return this.getNext();
            }
            if(this.get('isPathReady')){
                let currentValue = this.get('currentPaths').paths[currentPathIndex];
                let point = new THREE.Vector3();
                if(this.get('currentPaths').paths.length===0) {return this.getNext();}
                else{
                    point.x = currentValue[0];
                    point.y = currentValue[1];
                    point.z = currentValue[2];
                    point.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.5 * Math.PI);
                    currentPathIndex+=1;
                    this.set({currentPathIndex:currentPathIndex});
                }

                return point;

            }
        }
        
    });
    e.PathController = new t();
}(DRONE || (DRONE = {}));

/**
 * Main scene
 */
!function (e) {
    let t = Backbone.Model.extend({
            defaults: {
                longitude: "-101.875", latitude: "33.5845",
                zoom: 15,
                offline: true,
                width: 1024,
                height: 512,
                depth: 60,
                width_segment: 30,
                height_segment: 16,
                depth_segment: 3,
                showMatrixWorld: true,
                dronePos: new THREE.Vector3(0, 0, 0),
                numberOfTargets: 4,
                currentPoint: null
            },

            init: function () {
                this.container = new THREE.Group();
                this.targetContainer = new THREE.Group();
                this.on('buildings:ready', this.addBuildings);
                this.on('matrix:draw', this.initMatrixWorld);
                this.on('cocoSsd:start', this.initCoCoSsd);
                this.on('matrixData:ready', this.initRandomTarget);
                this.on('target:ready', this.initPaths);
                this.on('paths:ready', this.startAnimation);
                this.on('camera:followDrone', this.registerCamToDrone);
                this.scene = new THREE.Scene();
                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e3);
                this.camera.position.z = 15;
                this.camera.position.y = 8;
                this.camera.lookAt(0, 0, 0);
                this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: !0});
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                $('#three').append(this.renderer.domElement);

                this.addPlane();
                this.droneClone = this.addDrone();
                this.initOSM();
                this.container.add(this.targetContainer);
                this.container.rotation.x = -0.5 * Math.PI;
                this.scene.add(this.container);
                e.AnimationController.registerAnimation(this.renderer, this.scene, this.camera);
                createjs.Tween.get(this.droneClone.position).to({x: 0, y: 8, z: 0}, 3000);

                //Register navigation controller
                e.AnimationController.on('draw', this.updateNavController, this);

            },
            updateNavController: function () {
                let speed = 0.08;
                let rotatespeed = 0.01;
                e.layOut.get('navMouseLeftClicked') === true ? this.onMoveLeft(speed) : null;
                e.layOut.get('navMouseRightClicked') === true ? this.onMoveRight(speed) : null;
                e.layOut.get('navMouseTopClicked') === true ? this.onMoveUp(speed) : null;
                e.layOut.get('navMouseBottomClicked') === true ? this.onMoveDown(speed) : null;
                e.layOut.get('navMouseForwardClicked') === true ? this.onMoveForward(speed) : null;
                e.layOut.get('navMouseBackwardClicked') === true ? this.onMoveBackward(speed) : null;
                e.layOut.get('rotMouseLeftClicked') === true ? this.onRotateLeft(rotatespeed) : null;
                e.layOut.get('rotMouseRightClicked') === true ? this.onRotateRight(rotatespeed) : null;
                e.layOut.get('rotMouseTopClicked') === true ? this.onRotateUp(rotatespeed) : null;
                e.layOut.get('rotMouseBottomClicked') === true ? this.onRotateDown(rotatespeed) : null;
            },
            onMoveRight: function (speed) {
                let direction = new THREE.Vector3();
                this.droneClone.getWorldDirection(direction);
                let directionRight = direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
                this.droneClone.position.add(directionRight.multiplyScalar(-speed));
                this.set({dronePos: this.droneClone.position});
                this.trigger('dronePos:update');
            },
            onMoveLeft: function (speed) {
                let direction = new THREE.Vector3();
                this.droneClone.getWorldDirection(direction);
                let directionRight = direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
                this.droneClone.position.add(directionRight.multiplyScalar(speed));
                this.set({dronePos: this.droneClone.position});
                this.trigger('dronePos:update');
            },
            onMoveUp: function (speed) {
                this.droneClone.position.y += speed;
                this.set({dronePos: this.droneClone.position});
                this.trigger('dronePos:update');
            },
            onMoveDown: function (speed) {
                this.droneClone.position.y -= speed;
                this.set({dronePos: this.droneClone.position});
                this.trigger('dronePos:update');
            },
            onMoveForward: function (speed) {
                let direction = new THREE.Vector3();
                this.droneClone.getWorldDirection(direction);
                this.droneClone.position.add(direction.multiplyScalar(speed));
                this.set({dronePos: this.droneClone.position});
                this.trigger('dronePos:update');
            },
            onMoveBackward: function (speed) {
                let direction = new THREE.Vector3();
                this.droneClone.getWorldDirection(direction);
                this.droneClone.position.add(direction.multiplyScalar(-speed));
                this.set({dronePos: this.droneClone.position});
                this.trigger('dronePos:update');
            },
            onRotateLeft: function (speed) {
                this.droneClone.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), speed);
            },
            onRotateRight: function (speed) {
                this.droneClone.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -speed);
            },
            onRotateUp: function (rotatespeed) {
            },
            onRotateDown: function (rotatespeed) {
            },
            registerCamToDrone: function () {
                e.AnimationController.on('draw', this.cameraFollowDrone, this);
            },
            cameraFollowDrone: function () {
                let relativeCameraOffset = new THREE.Vector3(0, 0.03, -0.05);
                var cameraOffset = relativeCameraOffset.applyMatrix4(
                    this.droneClone.matrixWorld
                );

                // this.camera.position.x = cameraOffset.x;
                // this.camera.position.y = cameraOffset.y;
                // this.camera.position.z = cameraOffset.z;
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.camera.lookAt(this.droneClone.position);
                // this.camera.lookAt(this.droneClone);
                this.camera.position.lerp(cameraOffset, 0.05);

            },
            startAnimation: function () {
                this.trigger('camera:followDrone');
                this.set({currentPoint:e.PathController.getNext()})
                this.initQuaternion(this.get('currentPoint'));
                e.AnimationController.on('draw', this.animateRotation, this);
            },
            pauseAnimation: function () {
                e.AnimationController.off('draw', this.animateRotation);
                e.AnimationController.off('draw', this.animateTranslation);

            },
            resumeAnimation: function () {
                this.startAnimation();
            },
            animateRotation: function () {
                    if (this.droneClone.quaternion.angleTo(this.get('quaternion')) < 0.1) {
                        e.AnimationController.off('draw', this.animateRotation);
                        this.startPos = new THREE.Vector3();
                        this.startPos.copy(this.droneClone.position);
                        e.AnimationController.on('draw', this.animateTranslation, this);
                    }
                    this.droneClone.quaternion.rotateTowards(this.get('quaternion'), 0.05);
            },
            animateTranslation: function () {

                let target = this.get('currentPoint');

                if (target != null) {
                    let speed = 0.5;
                    let distance = this.droneClone.position.distanceTo(target)
                    let dronePos = new THREE.Vector3();
                    let targetPos = new THREE.Vector3();
                    targetPos.copy(target);
                    dronePos.copy(this.droneClone.position);
                    let direction = targetPos.sub(dronePos).normalize();
                    if (distance < 0.5) {
                        let nextPoint = e.PathController.getNext();
                        this.set({currentPoint:nextPoint})
                        if (nextPoint !=null) {
                            this.initQuaternion(nextPoint);
                            e.AnimationController.on('draw', this.animateRotation, this);
                            e.AnimationController.off('draw', this.animateTranslation);
                        } else {
                            e.AnimationController.off('draw', this.animateTranslation);
                        }


                    } else {
                        this.droneClone.position.add(direction.multiplyScalar(speed));
                        this.set({dronePos: this.droneClone.position});
                        this.trigger('dronePos:update');
                        e.AnimationController.set({droneAltitude: this.droneClone.position})
                    }
                } else {
                    console.log("Completed!")
                    e.AnimationController.off('draw', this.animateTranslation);
                }
            },
            initQuaternion: function (target) {
                let cloneTarget = new THREE.Vector3();
                cloneTarget.copy(target);
                let quaternion = new THREE.Quaternion();
                let m4 = new THREE.Matrix4();
                let position = new THREE.Vector3();
                position.copy(this.droneClone.position);
                if (cloneTarget.y < position.y || cloneTarget.y > position.y) cloneTarget.y = position.y;
                m4.lookAt(cloneTarget, position, new THREE.Vector3(0, 1, 0));
                quaternion.setFromRotationMatrix(m4);
                this.set({quaternion: quaternion})
            },
            addPlane: function () {
                let img = `https://api.mapbox.com/styles/v1/mapbox/light-v9/static/${
                    this.get('longitude')
                    },${this.get('latitude')},${this.get('zoom')},0,0/${
                    this.get('width')
                    }x${
                    this.get('height')
                    }?access_token=pk.eyJ1IjoidmluaG50IiwiYSI6ImNqb2VqdXZvaDE4cnkzcG80dXkxZzlhNWcifQ.G6sZ1ukp_DhiSmCvgKblVQ`;
                let pl_texture = new THREE.TextureLoader().load(img);
                let pl_material = new THREE.MeshBasicMaterial({
                    map: pl_texture,
                    transparent: true,
                    opacity: 0.3
                });

                let pl_geometry = new THREE.PlaneGeometry(1024, 512);
                var pl_mesh = new THREE.Mesh(pl_geometry, pl_material);
                pl_mesh.name = "plane";
                this.container.add(pl_mesh);
                return pl_mesh;
            },
            addBuildings: function () {
                let buildings = this.buildings;
                let CENTER_LON = this.get('longitude'),
                    CENTER_LAT = this.get('latitude'),
                    zoom = this.get('zoom');
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
                let buildingC = new THREE.Group();
                for (let building of buildings) {
                    let shape = new THREE.Shape();
                    building.node.forEach((node, index) => {
                        let x = mercatorX(parseFloat(node.lon)) - cx;
                        let y = cy - mercatorY(parseFloat(node.lat));
                        index === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
                    });
                    let default_height = 10;
                    building.tags.forEach(tag => {
                        if (tag.k === "building:levels") {
                            default_height *= tag.v;
                        } else if (tag.k === "building:height") {
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
                    let shapeMat = new THREE.LineBasicMaterial({
                        color: 0xffffff,
                        // transparent: true
                    });
                    let shapeMesh = new THREE.Line(shapeGeo, shapeMat);
                    shapeGeo.computeBoundingBox();
                    buildingC.add(shapeMesh);
                }
                this.buildings = buildingC;
                this.container.add(buildingC);
                this.trigger('matrix:draw');

            },
            addDrone: function () {
                let droneClone = e.droneModel.container.clone();
                droneClone.position.copy(this.get('dronePos'));
                this.scene.add(droneClone);
                return droneClone

            },
            initOSM: function () {
                let t = this;
                const _extract = (osm) => {
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
                };
                const _extractN = (xmls, nodes) => {
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
                };
                const _extractB = (ways) => {
                    let buildings = [];
                    ways.forEach(way => {
                        way.tags.forEach(tag => {
                            if (tag.k.includes("building")) {
                                buildings.push(way);
                            }
                        });
                    });
                    return buildings;
                };

                this.getOSM()
                    .then(response => response.text())
                    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
                    .then(data => {
                        let _data = _extract(data);
                        let waysXML = _data.ways;
                        let nodes = _data.nodes;
                        let ways = _extractN(waysXML, nodes);
                        let buildings = _extractB(ways);
                        t.buildings = buildings;
                        t.trigger('buildings:ready');
                    });
            },
            async initCoCoSsd() {
                const model = await cocoSsd.load();
                this.model = await model;
            },
            async getOSM() {
                let url = "./src/assets/model/map_data.xml";
                return await fetch(url);

            },
            initMatrixWorld: function () {
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
                                let iswalkable = 0;
                                let neighbours = [];
                                let currentIndex = w + h * width + d * height * width;
                                let _left = w === 0 ? null : currentIndex - 1;
                                let _right = w + 1 === width ? null : currentIndex + 1;
                                let _top =
                                    h === 0 ? null : w + (h - 1) * width + d * height * width;
                                let _bottom =
                                    h + 1 === height ?
                                        null :
                                        w + (h + 1) * width + d * height * width;
                                let _down =
                                    d === 0 ? null : w + h * width + (d - 1) * width * height;
                                let _up =
                                    d + 1 === depth ?
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

                                let objects = e.mainScene.buildings;
                                for (let i = 0; i < objects.children.length; i++) {
                                    let bbox = new THREE.Box3().setFromObject(objects.children[i]);
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
                                    n_neighbours: iswalkable === 0 ? neighbours : []
                                });
                            }
                            _h.push(m);
                        }
                        matrix.push(_h);
                    }
                    return matrix;
                };
                let matrix = create3Dmatrix(
                    this.get('width_segment'),
                    this.get('height_segment'),
                    this.get('depth_segment'),
                    this.get('width'),
                    this.get('height'),
                    this.get('depth')
                );
                this.set({matrixData: matrix});
                this.trigger('matrixData:ready');
                return matrix;
            },
            initRandomTarget: function () {

                const count = this.get('numberOfTargets');
                const getRandom = (min, max) => {
                    return Math.random() * (max - min) + min;
                };
                let _geometry = new THREE.BufferGeometry();
                let _vertices = new Float32Array(count * 3);
                for (let i = 0; i < count; i++) {

                    let targetGeo = new THREE.SphereBufferGeometry(0.5, 10, 10);
                    let targetMat = new THREE.MeshBasicMaterial({
                        transparent: true,
                        opacity: 0,
                    });
                    let target = new THREE.Mesh(targetGeo, targetMat);
                    target.name = "target";
                    let posR = new THREE.Vector3(getRandom(-300, 300), getRandom(-200, 200), getRandom(10, 40));
                    let grid = this.world3DtoGrid(posR, this.get('width_segment'),
                        this.get('height_segment'),
                        this.get('depth_segment'),
                        this.get('width'),
                        this.get('height'),
                        this.get('depth'));
                    let n = this.get('matrixData')[grid.zGrid][grid.yGrid][grid.xGrid];
                    target.position.set(
                        n.x_3D,
                        n.y_3D,
                        n.z_3D,
                    );
                    _vertices[i * 3] = n.x_3D;
                    _vertices[i * 3 + 1] = n.y_3D;
                    _vertices[i * 3 + 2] = n.z_3D;

                    this.targetContainer.add(target);

                }
                _geometry.addAttribute('position', new THREE.BufferAttribute(_vertices, 3));
                let _material = new THREE.PointsMaterial({
                    blending: THREE.AdditiveBlending,
                    transparent: true,
                    size: 8,
                    map: e.preload.texture.particle1,
                    opacity: 0.5,
                    depthTest: false

                });
                let mesh = new THREE.Points(_geometry, _material);
                this.container.add(mesh);
                this.trigger('target:ready');

            },
            initPaths: function () {
                let DronePos = new THREE.Vector3();
                DronePos.copy(this.droneClone.position);
                DronePos.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.5 * Math.PI);
                //Check if target is not empty
                if (this.buildings.children.length > 0) {
                    //convert drone position to node index
                    let droneIndex = this.world3DtoNode(DronePos);
                    let targets = this.targetContainer.children.map(t => {
                        return t.position
                    });
                    console.log(targets)
                    targets.unshift(DronePos);
                    console.log(targets)
                    let _paths = this.travelingSaleMan(droneIndex, targets);
                    if (_paths.length > 0) {


                        let temp = [];
                        let normalPaths =[];
                        _paths.forEach(p => {
                            if (p.paths.length > 0) {
                                p.paths.forEach(path => {
                                    let v3 = new THREE.Vector3(path[0], path[1], path[2])
                                    v3.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.5 * Math.PI);
                                    normalPaths.push(v3)
                                });
                                if (p.paths.length > 1) {//Check redundant path
                                    let v0 = new THREE.Vector3(p.paths[0][0], p.paths[0][1], p.paths[0][2]);
                                    let v1 = new THREE.Vector3(p.paths[p.paths.length - 1][0], p.paths[p.paths.length - 1][1], p.paths[p.paths.length - 1][2]);
                                    let distance = v1.distanceTo(v0);
                                    let dirNormalize = v1.clone().sub(v0).normalize();
                                    let raycaster = new THREE.Raycaster(v0, dirNormalize);
                                    let intersects = raycaster.intersectObjects(this.buildings.children);
                                    // debugger;
                                    if (intersects.length > 0) {
                                        if (intersects[0].distance > distance) {
                                            console.log('Intesected..  but distance is greater than normal')
                                            v0.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.5 * Math.PI);
                                            v1.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.5 * Math.PI);
                                            temp.push(v0)
                                            temp.push(v1)
                                        } else {
                                            console.log('Intesected..  but distance is smaller than normal')
                                            p.paths.forEach(path => {
                                                let v3 = new THREE.Vector3(path[0], path[1], path[2])
                                                v3.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.5 * Math.PI);
                                                temp.push(v3)
                                            })
                                        }

                                    } else {
                                        console.log('No intersect - create shortcut')
                                        v0.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.5 * Math.PI);
                                        v1.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.5 * Math.PI);
                                        temp.push(v0)
                                        temp.push(v1)
                                    }


                                } else {
                                    p.paths.forEach(path => {
                                        let v3 = new THREE.Vector3(path[0], path[1], path[2])
                                        v3.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.5 * Math.PI);
                                        temp.push(v3)
                                    })
                                }

                            }

                        });

                        let lmaterial = new THREE.LineBasicMaterial({
                            color: 0x0000ff
                        });
                        let lNormalmaterial = new THREE.LineBasicMaterial({
                            color: 0xff0000
                        });
                        var lgeometry = new THREE.Geometry();
                        temp.forEach(d=>{
                            lgeometry.vertices.push(d)
                        });

                        var lnormalGeo = new THREE.Geometry();
                        normalPaths.forEach(d=>{
                            lnormalGeo.vertices.push(d)
                        });

                        let line = new THREE.Line(lgeometry, lmaterial);
                        let lineNormal = new THREE.Line(lnormalGeo, lNormalmaterial);
                        this.scene.add(line);
                        this.scene.add(lineNormal);
                        this.set({animationPoints: temp});
                        this.set({savedPath: _paths});
                        e.PathController.set({paths:_paths});
                        e.PathController.init();
                        this.trigger('paths:ready')

                        //
                    }
                }
            },
            initNodes: function () {
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
            },
            travelingSaleMan: function (curPosIndex, targets) {
                let srcIndex = curPosIndex;
                let paths = [];
                let finder = new PF.AStarFinder({
                    heuristic: PF.Heuristic.euclidean
                });
                let targetClone = JSON.parse(JSON.stringify(targets));
                const self = this;
                returnMinPath(srcIndex, targetClone);

                function returnMinPath(currentIndex, targets) {
                    if (targets.length === 0) {
                        return;
                    }
                    let _paths = [];
                    targets.forEach((t, i) => {
                        let nodes = self.initNodes();
                        let targetIndex = self.world3DtoNode(t);
                        let _path = finder.findPath(nodes[currentIndex], nodes[targetIndex], nodes);
                        _paths.push(
                            {
                                from: currentIndex,
                                fromNode: nodes[currentIndex],
                                to: targetIndex,
                                toNode: nodes[targetIndex],
                                paths: _path,
                                index: i
                            }
                        )
                    });
                    let min = _paths.reduce((prev, current) => {
                        return (prev.paths.length < current.paths.length) ? prev : current
                    });
                    paths.push(min);
                    targets.splice(min.index, 1);
                    returnMinPath(min.to, targets);
                }

                return paths;
            },
            world3DtoNode: function (pos) {
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
            },
            world3DtoGrid: function (position,
                                     width,
                                     height,
                                     depth,
                                     w_width,
                                     w_height,
                                     w_depth) {
                let pos = JSON.parse(JSON.stringify(position));
                pos.x += w_width / 2;
                pos.y = w_height / 2 - pos.y;
                let cor = {};
                cor.xGrid = Math.round((pos.x / w_width) * width);
                cor.yGrid = Math.round((pos.y / w_height) * height);
                cor.zGrid = Math.round((pos.z / w_depth) * depth);
                return cor;
            },
            getNodeIndex: function (w, h, d, width, height) {
                return w + h * width + d * width * height;
            }
        })
    ;
    e.mainScene = new t();
}(DRONE || (DRONE = {}));

/**
 * Intro scene with a drone
 */
!function (e) {
    let t = Backbone.Model.extend({
        init: function () {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e3);
            this.camera.position.z = 5;
            this.camera.position.y = 2;
            this.camera.lookAt(0, 0, 0);
            this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: !0});
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            $('#three').append(this.renderer.domElement);

            //this.scene.add(e.droneModel.container);
            this.droneClone = e.droneModel.container.clone();
            this.droneClone1 = e.droneModel.container.clone();
            this.droneClone2 = e.droneModel.container.clone();
            this.droneClone.position.set(-3, 0, 3);
            this.droneClone1.position.set(3, 0, 3);
            this.droneClone2.position.set(0, 3, 3);
            this.scene.add(this.droneClone);
            this.scene.add(this.droneClone1);
            this.scene.add(this.droneClone2);
            this.removeDrone = this.removeDrone.bind(this);
            createjs.Tween.get(this.droneClone.position).to({x: 0, y: 0, z: 0}, 3000).call(this.removeDrone);
            createjs.Tween.get(this.droneClone1.position).to({x: 0, y: 0, z: 0}, 3000);
            createjs.Tween.get(this.droneClone2.position).to({x: 0, y: 0, z: 0}, 3000);
            e.AnimationController.registerAnimation(this.renderer, this.scene, this.camera);
        },
        removeDrone: function () {
            this.scene.remove(this.droneClone1);
            this.scene.remove(this.droneClone2);
            e.layOut.init();
        },
        _addCube: function () {
            let geometry = new THREE.BoxGeometry(1, 1, 1);
            let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
            let cube = new THREE.Mesh(geometry, material);
            this.scene.add(cube);
            return cube;
        }
    });
    e.introScene = new t();
}(DRONE || (DRONE = {}));

/**
 * Utility section to convert color
 */
!function (e) {
    class t {
        rgbaToVector4(e, t) {
            let n = chroma(e).alpha(t).gl();
            return new THREE.Vector4(n[0], n[1], n[2], n[3]);
        }

        rgbToVector3(e) {
            let t = chroma(e).gl();
            return new THREE.Vector3(t[0], t[1], t[2]);
        }

        setRGBToVector4(e, t) {
            let n = chroma(e).gl();
            t.x = n[0], t.y = n[1], t.z = n[2];
        }

        colorTransformToVector4(e, t, n, r) {
            let o = 1 - r;
            n.x = e[0] * o + t[0] * r, n.y = e[1] * o + t[1] * r, n.z = e[2] * o + t[2] * r;
        }

        colorTransform(e, t, n) {
            let r = 1 - n;
            return chroma.gl(e[0] * r + t[0] * n, e[1] * r + t[1] * n, e[2] * r + t[2] * n).hex();
        }

        joinNames(e, t) {
            void 0 === t && (t = "");
            let n, r, o;
            for (r = e.concat(), o = r.length, n = 0; n < o; n++) r[n] = t + r[n];
            return r.join(" ");
        }

        joinChangeNames(e, t) {
            void 0 === t && (t = "");
            let n, r, o;
            for (r = e.concat(), o = r.length, n = 0; n < o; n++) r[n] = "change:" + t + r[n];
            return r.join(" ");
        }

    }

    e.Utility = new t();
}(DRONE || (DRONE = {}));
/**
 * This function allows user to register what to render on canvas
 * Inputs: renderer, scene, camera
 */
!function (e) {
    let t = Backbone.Model.extend({
        defaults: {
            camera: null,
            scene: null,
            renderer: null
        },
        initialize: function () {
            this.time = 0;
            this._onRAF = this._onRAF.bind(this);
            $(window).on('resize', this._onWindowResize.bind(this));
        },
        registerAnimation: function (_renderer, _scene, _camera) {
            this.set({renderer: _renderer, scene: _scene, camera: _camera});
            createjs.Ticker.addEventListener('tick', this._onRAF, false);
        },
        unregisterAnimation: function () {
            createjs.Ticker.removeEventListener('tick', this._onRAF);
            this.set({renderer: null, scene: null, camera: null});
            $('#three').html(null)
        },
        _onRAF: function (t) {
            if (this.get('renderer')) {
                let r = t.delta / 1e2;
                this.time += r;
                this.trigger('draw', this.time, r);
                this.get('renderer').render(this.get('scene'), this.get('camera'));
            }

        },
        _onWindowResize: function () {
            this.get('renderer').setSize(window.innerWidth, window.innerHeight);
            this.get('renderer').setPixelRatio(window.devicePixelRatio);
            this.get('camera').aspect = window.innerWidth / window.innerHeight;
            this.get('camera').updateProjectionMatrix();
        }
    });
    e.AnimationController = new t();
}(DRONE || (DRONE = {}));

/**
 * Layout manager
 */
!function (e) {
    class t extends Backbone.Model {
        init() {
            this.set({
                navMouseCenterClicked: false//Default auto
            });
            this.on('change:navMouseCenterClicked', this.onChangeStartStop);
            e.mainScene.on('paths:ready', this.updateSpinner, this);
            e.mainScene.on('dronePos:update', this._updateAltitude, this);
            e.PathController.on('change:isPathReady', this.generateSVG, this);
            e.PathController.on('change:currentIndex', this.updateLine, this);
            this.on('currentPath:ready', this.updateLine);
            let svg = d3.select("#altitude-container")
                .append("svg")
                .attr("width", 50)
                .attr("height", 210);
            this.scale = d3.scaleLinear()
                .domain([0, 60])
                .range([180, 0]);
            var y_axis = d3.axisRight()
                .ticks(5)
                .scale(this.scale);
            svg.append("g")
                .attr("transform", "translate(0, 10)")
                .call(y_axis);
            svg.append('line')
                .attr('x1', 0)
                .attr('y1', 172)
                .attr('x2', 30)
                .attr('y2', 172)
                .style('stroke', 'red')
                .attr('id', 'line-altitude')
            svg.append('text')
                .attr('x', 0)
                .attr('y', 210)
                .text("Altitude");


            $('.radar').fadeIn(2000);
            $('#controller').fadeIn(2000);
            $('#altitude-container').fadeIn(2000);

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
            $('#m-center').on('click', this._navCenterMouseDown)

            $('#r-top').on('mousedown', this._rotTopMouseDown)
            $('#r-top').on('mouseup', this._rotTopMouseUp)
            $('#r-bottom').on('mousedown', this._rotBottomMouseDown)
            $('#r-bottom').on('mouseup', this._rotBottomMouseUp)
            $('#r-left').on('mousedown', this._rotLeftMouseDown)
            $('#r-left').on('mouseup', this._rotLeftMouseUp)
            $('#r-right').on('mousedown', this._rotRightMouseDown)
            $('#r-right').on('mouseup', this._rotRightMouseUp)
        }

        animateLine = () => {

        };
        generateSVG =()=>{
            let filtered = e.PathController.get('paths');
            console.log(filtered)
            let dist = 0;
            filtered.map(d => {
                let v0 = new THREE.Vector3(d.fromNode.x, d.fromNode.y, d.fromNode.z);
                let v1 = new THREE.Vector3(d.toNode.x, d.toNode.y, d.toNode.z);
                dist += v0.distanceTo(v1);
                d.distance = dist;
            });
            this.set({paths: filtered});
            this.trigger('currentPath:ready')
            let scaler = d3.scaleLinear()
                .domain([0, dist])
                .range([0, 430]);

            let paths = d3.select("#paths")
                .append("svg")
                .attr("width", 450)
                .attr("height", 30);
            paths.append('line')
                .attr('x1', 4)
                .attr('y1', 10)
                .attr('x2', () => {
                    return scaler(filtered[filtered.length - 1].distance)
                })
                .attr('y2', 10)
                .attr('stroke', '#ffffff')
                .attr('stroke-width', '1px');
            paths.append('circle')
                .attr('r',2)
                .attr('cx',4)
                .attr('cy',10)
                .attr('stroke', '#fff')
                .attr('stroke-width', 1)
                .attr('fill', '#0874a2')
            paths.selectAll('.circle')
                .data(filtered)
                .enter()
                .append('circle')
                .attr('r', 8)
                .attr('cx', d => {
                    return scaler(d.distance)
                })
                .attr('cy', 10)
                .attr('stroke', '#fff')
                .attr('stroke-width', 1)
                .attr('fill', '#0874a2')
                .attr('class','circle')
                .attr('id', function (d,i) {
                    return 'goal'+i;
                })
        }
        updateLine = () => {
            let index = e.PathController.get('currentIndex');
            console.log(index)
            $(`circle#goal${index-1}`).attr('fill','#fff')
        };
        updateSpinner = () => {
            $('#m-center').find('i').addClass('fa-spin');


        };
        _updateAltitude = () => {
            let y = e.mainScene.get('dronePos');
            $('#line-altitude').attr('y1', this.scale(y.y) + 10).attr('y2', this.scale(y.y) + 10);

        }
        onChangeStartStop = () => {
            let flag = this.get('navMouseCenterClicked');
            flag === true ? e.mainScene.pauseAnimation() : e.mainScene.resumeAnimation();
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
        _navCenterMouseDown = (e) => {
            e.preventDefault();
            let flag = this.get('navMouseCenterClicked');
            flag !== true ? $('#m-center').find('i').removeClass('fa-spin') : $('#m-center').find('i').addClass('fa-spin');
            $('#m-center').attr('title', `Click to ${flag === true ? "STOP" : "RESUME"} animation`)
            this.set({navMouseCenterClicked: !flag});
        }
        _navTopMouseDown = () => {
            this.set({navMouseTopClicked: true});

        }

    }

    e.layOut = new t();
}(DRONE || (DRONE = {}));

/**
 * This is the main part of the Drone simulator
 */
!function (e) {
    const t = Backbone.Model.extend({
        init: function () {
            e.preload.on('complete', this.preload, this);
            e.preload.init();
            this.on('loaded', this.introS)
        },
        preload: function () {
            /**
             * Init drone for use in both scene
             */
            var t = this;
            $('#loader').fadeOut(1000, function () {
                e.droneModel.init();
                t.introS();
            });

        },
        introS: function () {
            /**
             * Prerequisite: Drone must be available first
             */
            e.introScene.init();
            var t = this;
            createjs.Tween.get(t).wait(5000).call(t.mainS.bind(this))

        },
        mainS: function () {
            /**
             * Unload all previous scene
             */
            e.AnimationController.unregisterAnimation();
            e.mainScene.init();
        }

    });
    e.index = new t();
}(DRONE || (DRONE = {}));

DRONE.index.init();