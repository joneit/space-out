window.onload = function() {
    var BLACK = 0, WHITE = 0xffffff, GOLD = 0xc8c876, BLUE = 0x761ec8;

    var width = window.innerWidth;
    var height = window.innerHeight;

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    var body = document.querySelector('body').appendChild(renderer.domElement);

    var scene = new THREE.Scene;
    var group, camera;
    scene.add(group = getGroup());
    scene.add(camera = getCamera());
    scene.add(getSkyBox());
    scene.add(getLight());

    var clock = new THREE.Clock;
    function render() {
        renderer.render(scene, camera);
        group.rotation.y -= clock.getDelta() / 5;
        requestAnimationFrame(render);
    }

    render();

    function getLight() {
        var pointLight = new THREE.PointLight(WHITE);
        pointLight.position.set(0, 300, 200);
        return pointLight;
    }

    function getSkyBox() {
        var skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
        var skyboxMaterial = new THREE.MeshBasicMaterial({
            color: BLACK,
            side: THREE.BackSide
        });
        return new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    }

    function getCamera() {
        var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
        camera.position.y = 70;
        camera.position.z = 180;
        camera.lookAt(group.position);
        return camera;
    }

    function getGroup() {
        var group = new THREE.Group();
        group.rotation.y = Math.PI * 45 / 180;

        var cubeMaterial = {
            true: new THREE.MeshLambertMaterial({ color: GOLD }),
            false: new THREE.MeshLambertMaterial({ color: BLUE })
        };

        var R = 40;

        for (var x = -R; x <= R; x += 10)
            for (var y = -R; y <= R; y += 10)
                for (var z = -R; z <= R; z += 10)
                    //if (Math.abs(x) === R || Math.abs(y) === R || Math.abs(z) === R)
                    addCube(x, y, z);

        return group;

        function addCube(x, y, z) {
            var color =
                Math.abs(x) === R &&
                Math.abs(y) === R &&
                Math.abs(z) === R;
            
            group.add(getCube(x, y, z, color));
        }

        function getCube(x, y, z, color) {
            var geometry = new THREE.BoxGeometry(7, 7, 7);
            var cube = new THREE.Mesh(geometry, cubeMaterial[color]);

            cube.position.x = x;
            cube.position.y = y;
            cube.position.z = z;

            return cube;
        }

    }
};