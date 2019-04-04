import Backbone from 'backbone';
import createjs from 'createjs-module';
import _ from 'underscore';
import * as THREE from 'three';

var __extends = this && this.__extends || function (e, t) {
    function n() {
        this.constructor = e;
    }

    for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
    e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
};
var DRONE;

!function (e) {
    var t = function (e) {
        function t() {
            e.apply(this, arguments);
        }

        return __extends(t, e), t.prototype.defaults = function () {
            return {
                longitude: 0,
                latitude: 0,
                zoom: 0,
                mapboxAPI: 0,
                isStart: !1
            };
        }, t;
    }(Backbone.Model);
    e.globalConfiguration = new t();
}(DRONE || (DRONE = {}));


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
                $('#notification').hide();
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
    var t = function (t) {
        function n() {
            var n = this;
            t.apply(this, arguments), this.cameraLookAt = {
                x: 0,
                y: 0,
                z: 0
            }, this._onRatio = function () {

            }, this._onResize = function () {

            }, this._onRAF = function (t) {


                var r = t.delta / 1e3;
                n.time += r, n.trigger("draw", n.time, r),
                    // e.sceneManager.camera.lookAt(n.cameraLookAt),
                    // e.sceneManager.camera.updateProjectionMatrix(),
                    n.renderer.render(n.scene, n.camera);

            }, this._onChangeIsStart = function () {
                console.log("Going here...");
                e.globalConfiguration.get("isStart") ? createjs.Ticker.addEventListener("tick", n._onRAF) : createjs.Ticker.removeEventListener("tick", n._onRAF);
            };
        }

        return __extends(n, t), n.prototype.init = function () {
            this.renderer = new THREE.WebGLRenderer({
                antialias: !0,
                alpha: !1,
                canvas: document.getElementById("three")
            }),

                this.renderer.setClearColor(0xffffff, 1),
                this.scene = new THREE.Scene(),
                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e3),
                this.camera.position.z = 5,
                this.time = 0,
                this.geometry = new THREE.BoxGeometry(3, 3, 3),
                this.material = new THREE.MeshBasicMaterial({color: 0xff0000}),
                this.cube = new THREE.Mesh(this.geometry, this.material),
                this.scene.add(this.cube),
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            e.globalConfiguration.on("change:isStart", this._onChangeIsStart),
                this._onRatio(), this._onResize();

        }, n;
    }(Backbone.Model);
    e.sceneManager = new t();
}(DRONE || (DRONE = {}));


!function (e) {
    var t = function () {
        function t() {
            var t = this;
            this._onPreload = function () {
                createjs.Tween.get(t).wait(100).call(t._onPreload2);
            }, this._onPreload2 = function () {
                console.log("Data is loaded! Initialize scene");

                e.sceneManager.init();
                e.globalConfiguration.set({isStart: true});
            };
        }

        return t.prototype.init = function (t) {
            e.preload.on("complete", this._onPreload), e.preload.load();
        }, t;
    }();
    e.index = new t();
}(DRONE || (DRONE = {}));
DRONE.index.init();