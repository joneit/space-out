window.onload = function() {
    var BLACK = 0, WHITE = 0xffffff, GOLD = 0xc8c876, BLUE = 0x761ec8;
    var PI_OVER_2 = Math.PI / 2, PI_OVER_4 = Math.PI / 4, PI_OVER_8 = Math.PI / 8;

    var width = window.innerWidth;
    var height = window.innerHeight;

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    var body = document.querySelector('body').appendChild(renderer.domElement);

    var floppers = [];
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
        group.rotation.y -= clock.getDelta() / 20;

        floppers.forEach(function(flopper, i) {
            flopper.rotation.z = PI_OVER_8 + PI_OVER_8 * Math.sin(i * PI_OVER_4 + 2.5 * clock.getElapsedTime());
        });

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
        camera.position.y = 45;
        camera.position.z = 220;
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

        for (var x = -9; x <= 9; ++x)
            for (var z = -19; z <= 19; ++z)
                group.add(getFlopper(15 * x, 0, 10 * z));

        return group;

        function getFlopper(x, y, z) {
            var group = new THREE.Group();
            var flopper = getLever(9, 1, 3, 4.5, 0.5, 0);
            floppers.push(flopper);
            group.add(flopper);
            group.add(getLever(3, 1, 3, -1.5, 0.5, 0));
            group.position.x = x;
            group.position.y = y;
            group.position.z = z;
            return group;
        }

        function getLever(X, Y, Z, dx, dy, dz) {
            var geometry = new THREE.BoxGeometry(X, Y, Z);
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(dx, dy, dz));
            var lever = new THREE.Mesh(geometry, material);
            return lever;
        }
    }
};