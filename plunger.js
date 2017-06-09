window.onload = function() {
    var BLACK = 0, WHITE = 0xffffff, GOLD = 0xd8c876, BLUE = 0x761ec8;
    var PI_TIMES_2 = Math.PI * 2, PI_OVER_2 = Math.PI / 2, PI_OVER_4 = Math.PI / 4, PI_OVER_8 = Math.PI / 8;

    var width = window.innerWidth;
    var height = window.innerHeight;

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    var body = document.querySelector('body').appendChild(renderer.domElement);

    var plungers = [];
    var group = getGroup();
    group.add(getGround());

    var scene = new THREE.Scene;
    var camera = getCamera();
    scene.add(group);
    scene.add(camera);
    scene.add(getSkyBox());
    scene.add(getLight());

    var clock = new THREE.Clock(false);
    var running;
    function render() {
        renderer.render(scene, camera);
        group.rotation.y -= clock.getDelta() / 5;

        // plungers.forEach(function(plunger, i) {
        //     plunger.forEach(function(tube, i) {
        //         if (i) {
        //             rotation.z = PI_OVER_8 + PI_OVER_8 * Math.sin(i * PI_OVER_4 + 2.5 * clock.getElapsedTime());
        //         }
        //     });
        // });

        if (running) requestAnimationFrame(render);
    }

    window.runMe = function(run) {
        running = run;
        clock[run ? 'start' : 'stop']();
        if (run) render();
    };

    runMe(true);

    function getLight() {
        var pointLight = new THREE.PointLight(WHITE);
        pointLight.position.set(0, 300, 200);
        return pointLight;
    }

    function getSkyBox() {
        var geometry = new THREE.BoxGeometry(10000, 10000, 10000);
        var material = new THREE.MeshBasicMaterial({
            color: BLACK,
            side: THREE.BackSide
        });
        return new THREE.Mesh(geometry, material);
    }

    function getCamera() {
        var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
        camera.position.y = 150;
        camera.position.z = 150;
        camera.lookAt(group.position);
        return camera;
    }

    function getGround() {
        var geometry = new THREE.CircleGeometry(200, 30);
        var ground = new THREE.Object3D();

        ground.add(new THREE.LineSegments(
            geometry,
            new THREE.LineBasicMaterial( {
                color: WHITE,
                transparent: true,
                opacity: 0.5
            } )
        ) );

        ground.add( new THREE.Mesh(
            geometry,
            new THREE.MeshLambertMaterial({ color: 0x4155be })
        ) );


        ground.rotation.x = -Math.PI / 2;
        return ground;
    }

    function getGroup() {
        var group = new THREE.Group();
        var columnBSP = getFlutedTubeBSP(12, 96, 15);

        material = new THREE.MeshLambertMaterial({ color: GOLD });

        for (x = -3; x <= 3; ++x) {
            group.add(getPlunger(x * 36, 24, 0));
        }

        return group;

        function getPlunger(x, y, z) {
            var mesh = columnBSP.toMesh(material);
            mesh.applyMatrix(new THREE.Matrix4().makeTranslation(x, y, z));
            return mesh;
        }

        function getTube(r, height, radiusSegments, dx, dy, dz) {
            var geometry = new THREE.CylinderGeometry(r, r, height, radiusSegments);
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(dx, dy, dz));
            return new THREE.Mesh(geometry, material);
        }

        function getFlutedTubeBSP(r, height, flutes, dx, dy, dz) {
            var geometry = new THREE.CylinderGeometry(r, r, height, 15);
            var mesh = new THREE.Mesh(geometry);
            var BSP = new ThreeBSP(mesh);

            var flute = new THREE.CylinderGeometry(.15 * r, .15 * r, height, 25);
            r *= 1.03;
            for (var th = 0; th < 2 * Math.PI; th += PI_TIMES_2 / flutes) {
                var x = r * Math.cos(th), z = r * Math.sin(th);
                flute.applyMatrix(new THREE.Matrix4().makeTranslation(x, 0, z));
                BSP = BSP.subtract(new ThreeBSP(new THREE.Mesh(flute)));
                flute.applyMatrix(new THREE.Matrix4().makeTranslation(-x, 0, -z));
            }

            return BSP;
        }
    }
};