window.onload = function() {
    var BLACK = 0, WHITE = 0xffffff, GOLD = 0xc8c876, BLUE = 0x761ec8;
    var PI_OVER_2 = Math.PI / 2, PI_OVER_4 = Math.PI / 4, PI_OVER_8 = Math.PI / 8;

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
        camera.position.y = 80;
        camera.position.z = 50;
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

        material = new THREE.MeshLambertMaterial({ color: BLUE });

        group.add(getPlunger(5, 0, 0, 0));
        // for (var x = -9; x <= 9; ++x)
        //     for (var z = -19; z <= 19; ++z)
        //         group.add(getFlopper(15 * x, 0, 10 * z));

        return group;

        function getPlunger(n, x, y, z) {
            var group = new THREE.Group();
            var plunger = Array(n);
            for (var i = n; i--;) {
                group.add(plunger[i] = getFlutedTube(3 + i, 32, 8 + 2 * i, 0, 8, 0));
                break;
            }
            plungers.push(plunger);
            group.position.x = x;
            group.position.y = y;
            group.position.z = z;
            // group.rotation.z = 1;
            return group;
        }

        function getTube(radius, height, radiusSegments, dx, dy, dz) {
            var geometry = new THREE.CylinderGeometry(radius, radius, height, radiusSegments);
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(dx, dy, dz));
            return new THREE.Mesh(geometry, material);
        }

        function getFlutedTube(radius, height, flutes, dx, dy, dz) {
            var group = new THREE.Group();
            var geometry = new THREE.CylinderGeometry(radius, radius, height, 48);
            group.add(new THREE.Mesh(geometry, material));

            var fluteGroup = new THREE.Group();
            for(var th = 0; th < 2 * Math.PI; th += Math.PI / 7.5) {
                var flute = new THREE.CylinderGeometry(.175 * radius, .175 * radius, height, 12);
                flute.applyMatrix(new THREE.Matrix4().makeTranslation(1.07 * radius * Math.cos(th), 0, 1.07 * radius * Math.sin(th)));
                fluteGroup.add(new THREE.Mesh(flute, new THREE.MeshLambertMaterial({ color: GOLD })));
            }

            group.add(fluteGroup);
            group.applyMatrix(new THREE.Matrix4().makeTranslation(dx, dy, dz));
            return group;
        }
    }
};