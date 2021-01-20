import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/OBJLoader2.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/MTLLoader.js';
import {MtlObjBridge} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/FBXLoader.js';

function main(){

    var protector;
    var character = {};
    var animationMixer;
    var enemyMixer;
    var city;
    var enemy = {};
    var enemyCharacter;
    var animation;
    var trashes=[];

    var canvas = document.getElementById("canvas");
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100000);
    var renderer = new THREE.WebGLRenderer({canvas,antialias:true});
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type= THREE.PCFSoftShadowMap;


    renderer.setSize(window.innerWidth,window.innerHeight);

    window.addEventListener("resize",(event)=>{
        console.log("resize");
        let width = window.innerWidth;
        let height = window.innerHeight;
        renderer.setSize(width,height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
    });

    document.body.appendChild(renderer.domElement);
    




    var clock = new THREE.Clock();

   
    



    //object loading

    //skybox
    var textureLoader = new THREE.CubeTextureLoader();
    var texture = textureLoader.load(
        [
            "./Assets/skybox/right.jpg",
            "./Assets/skybox/left.jpg",
            "./Assets/skybox/up.jpg",
            "./Assets/skybox/down.jpg",
            "./Assets/skybox/back.jpg",
            "./Assets/skybox/front.jpg"
        ]
    );
    scene.background=texture;


    //skybox



    //plane
    /*var shapeGeometry1 = new THREE.PlaneBufferGeometry(500,500);
    //create material(color or texture)

    /!*let materials = [
        new THREE.MeshStandardMaterial({color: 0x898888}),
        new THREE.MeshStandardMaterial({color: 0x898888}),
        new THREE.MeshStandardMaterial({color: 0x898888}),
        new THREE.MeshStandardMaterial({color: 0x898888}),
        new THREE.MeshStandardMaterial({map:new THREE.TextureLoader().load("./Assets/grass.png")}),
        new THREE.MeshStandardMaterial({color: 0x898888})
    ];*!/

    var mat1 = new THREE.MeshStandardMaterial({color:0X278400});
    var plane = new THREE.Mesh(shapeGeometry1,mat1);
    plane.rotation.x = Math.PI * -0.5;
    plane.position.set(0,0,0);
    //scene.add(plane);*/




    //grass

    var groundMesh	= new THREEx.GrassGround({
        width		: 500,	// the width of the mesh, default to 1
        height		: 500, 	// the height of the mesh, default to 1
        segmentsW	: 1,	// the number of segment in the width, default to 1
        segmentsH	: 1,	// the number of segment in the height, default to 1
        repeatX		: 500,	// the number of time the texture is repeated in X, default to 1
        repeatY		: 500,	// the number of time the texture is repeated in Y, default to 1
        anisotropy	: 16,	// the anisotropy applied to the texture, default to 16
    });
    scene.add(groundMesh);
    groundMesh.receiveShadow=true;
    console.log(groundMesh);




    //shadow settings
    /*plane.receiveShadow = true;
    firstCube.castShadow=true;
    secondCube.castShadow=true;*/


    camera.position.set(0,27,46);

    //ambient
    var ambientLight = new THREE.AmbientLight(0XFFFFFF,0.5);
    ambientLight.position.set(0,10,0);
    scene.add(ambientLight);


    //light
    var light = new THREE.DirectionalLight(0xFFFFFF,1.3,250);
    light.position.set(50,100,0);
    light.target.position.set(0,0,0);
    light.castShadow=true;

    light.shadow.mapSize.width=2048;
    light.shadow.mapSize.height=2048;

    light.shadow.camera.left=-150;
    light.shadow.camera.right=150;
    light.shadow.camera.top=150;
    light.shadow.camera.bottom=-150;
    
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 800; // default
    scene.add(light);

   /* const helper = new THREE.CameraHelper( light.shadow.camera );
    scene.add( helper );
*/

    //Fog
    //scene.fog = new THREE.Fog("white",1,10);

    const loader = new GLTFLoader();
    loadCharacter(loader);
    loadEnemy(loader);

    function loadCharacter(loader){
        loader.load("./Assets/Protector/protector.glb",(gltf)=>{
            console.log("timmy");
            console.log(gltf);
            animationMixer = new THREE.AnimationMixer(gltf.scene);



            character["idle"] = {
                clip:gltf.animations[0],
                action:animationMixer.clipAction(gltf.animations[0])
            }





            scene.add(gltf.scene);
            protector=gltf.scene;
            protector.position.set(-5,0,5);

            //control
            protector.add(camera);
            camera.position.set(0,3,-8);

        },(xhr)=>{
            if((xhr.loaded/xhr.total*100) === 100 ){
                console.log("character loaded");
                loadAnimations(loader);
            }
        });
    }
    function loadAnimations(loader){
        //walking
        loader.load("./Assets/Protector/protectorWalking.glb",(gltf)=>{
            character["walking"] = {
                clip:gltf.animations[0],
                action:animationMixer.clipAction(gltf.animations[0])
            };
        },(xhr1)=>{
            if(xhr1.loaded/xhr1.total*100 === 100){
                //point
                loader.load("./Assets/Protector/protectorTelekinesis.glb",(gltf)=>{
                    character["point"] = {
                        clip:gltf.animations[0],
                        action:animationMixer.clipAction(gltf.animations[0])
                    };
                },(xhr2)=>{
                    if(xhr2.loaded/xhr2.total*100 === 100){
                        //spell
                        loader.load("./Assets/Protector/protectorSpell.glb",(gltf)=>{
                            character["spell"] = {
                                clip:gltf.animations[0],
                                action:animationMixer.clipAction(gltf.animations[0])
                            };
                        },(xhr3)=>{
                            if(xhr3.loaded/xhr3.total*100 === 100){
                                //walkBack
                                loader.load("./Assets/Protector/protectorWalkBack.glb",(gltf)=>{
                                    character["walkBack"] = {
                                        clip:gltf.animations[0],
                                        action:animationMixer.clipAction(gltf.animations[0])
                                    };
                                },(xhr4)=>{
                                    console.log(xhr4.loaded/xhr4.total*100);
                                    if(xhr4.loaded/xhr4.total*100 === 100){
                                        console.log(character);
                                        setTimeout(() => {
                                            setUpAnimations();
                                            castShadowCharacters(protector);
                                            }, 2000);

                                    }
                                });
                            }
                        });
                    }
                });

            }
        });




    }


    function loadEnemyAnimations(loader){
        loader.load("./Assets/Enemy/defeated.glb",(gltf)=>{
            enemy["defeated"] = {
                clip:gltf.animations[0],
                action:enemyMixer.clipAction(gltf.animations[0])
            };


        },(xhr)=>{
            console.log(xhr.loaded/xhr.total*100);
            if(xhr.loaded/xhr.total*100 === 100){
                setTimeout(() => {
                    setUpEnemyAnimations();
                    castShadowCharacters(enemyCharacter);
                }, 3000);
            }
        });

    }
    function loadEnemy(loader){
        loader.load("./Assets/Enemy/enemy.glb",(gltf)=>{
            scene.add(gltf.scene);
            enemyMixer = new THREE.AnimationMixer(gltf.scene);



            enemy["idle"] = {
                clip:gltf.animations[0],
                action:enemyMixer.clipAction(gltf.animations[0])
            }



            scene.add(gltf.scene);

            enemyCharacter=gltf.scene;
            enemyCharacter.position.set(-120,0,44);
            enemyCharacter.rotation.y=Math.PI/1.7;
            enemyCharacter.scale.x=15;
            enemyCharacter.scale.y=15;
            enemyCharacter.scale.z=15;

        },(xhr)=>{
            if((xhr.loaded/xhr.total*100) === 100 ){
                console.log("enemy loaded");
                loadEnemyAnimations(loader);
            }
        });
    }

    function  setUpEnemyAnimations(){
        console.log(enemy);

        enemy["idle"].action.play();
        enemy["idle"].action.enabled=false;
        enemy["defeated"].action.play();
        enemy["defeated"].action.enabled=false;
        enemy["idle"].action.enabled=true;
    }
    function setUpAnimations(){
        character["idle"].action.play();
        character["idle"].action.enabled=false;

        character["walking"].action.play();
        character["walking"].action.enabled=false;
        character["point"].action.play();
        character["point"].action.enabled=false;
        character["spell"].action.play();
        character["spell"].action.enabled=false;
        character["walkBack"].action.play();
        character["walkBack"].action.enabled=false;
        character["idle"].action.enabled=true;
    }


    function castShadowHandler(city,protector,enemyCharacter){
        city.castShadow=true;

        for(let i=0;i<city.children.length;i++){
            city.children[i].castShadow=true;
            for(let k=0;k<city.children[i].children.length;k++){
                city.children[i].children[k].castShadow=true;
            }
        }
    }

    function castShadowCharacters(object){
        object.castShadow=true;
        object.children[0].castShadow=true;
        object.children[0].children[1].castShadow=true;
    }


    function cityLoader(loader){
        loader.load("./Assets/city/city.glb",(gltf)=>{
            console.log("city");
            console.log(gltf);
            scene.add(gltf.scene);
            city = gltf.scene;
        },(xhr)=>{
            if((xhr.loaded/xhr.total*100) === 100 ){
                console.log("city loaded");
                setTimeout(() => { castShadowHandler(city); }, 2000);

            }
        });
    }
    function createRecycleBin(){
        let geo1 = new THREE.BoxGeometry(0.05,4,2);
        let materials = [
            new THREE.MeshStandardMaterial({map:new THREE.TextureLoader().load("./Assets/recycle.png")}),
            new THREE.MeshStandardMaterial({color: 0x1F1E1E}),
            new THREE.MeshStandardMaterial({color: 0x1F1E1E}),
            new THREE.MeshStandardMaterial({color: 0x1F1E1E}),
            new THREE.MeshStandardMaterial({color: 0x1F1E1E}),
            new THREE.MeshStandardMaterial({color: 0x1F1E1E})
        ];
        let recycleBin = new THREE.Mesh(geo1,materials);
        recycleBin.position.set(10,0,0);


        let geo2 = new THREE.BoxGeometry(2,4,0.05);
        let mat2 = new THREE.MeshStandardMaterial({color: 0x1F1E1E});
        let shape2  = new THREE.Mesh(geo2,mat2);
        shape2.position.set(-1,0,1);
        recycleBin.add(shape2);

        let geo3 = new THREE.BoxGeometry(2,4,0.05);
        let mat3 = new THREE.MeshStandardMaterial({color: 0x1F1E1E});
        let shape3  = new THREE.Mesh(geo3,mat3);
        shape3.position.set(-1,0,-1);
        recycleBin.add(shape3);


        let geo4 = new THREE.BoxGeometry(0.05,4,2);
        let mat4 = new THREE.MeshStandardMaterial({color: 0x1F1E1E});
        let shape4  = new THREE.Mesh(geo4,mat4);
        shape4.position.set(-2,0,0);
        recycleBin.add(shape4);

        let geo5 = new THREE.BoxGeometry(2,0.05,2);
        let mat5 = new THREE.MeshStandardMaterial({color: 0x1F1E1E});
        let shape5  = new THREE.Mesh(geo5,mat5);
        shape5.position.set(-1,-2,0);
        recycleBin.add(shape5);


        recycleBin.scale.x=0.2;
        recycleBin.scale.y=0.2;
        recycleBin.scale.z=0.2;

        return recycleBin;
    }
    function createBottle(){
        //cylinder
        let cylinderGeometry = new THREE.CylinderGeometry( 4, 4, 15, 64 );
        let cylinderMaterial = new THREE.MeshLambertMaterial( {color: 0x45c7f7} );
        let bottle = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
        bottle.position.set(-6,0,1);

        let coneGeometry = new THREE.ConeGeometry( 4, 8, 64 );
        let coneMaterial = new THREE.MeshLambertMaterial( {color: 0x45c7f7} );
        let cone = new THREE.Mesh( coneGeometry, coneMaterial );
        bottle.add(cone);
        cone.position.set(0,11.5,0);


        let bottleCapGeometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        let bottleCapMaterial = new THREE.MeshLambertMaterial( {color: 0x0a40d3} );
        let bottleCap = new THREE.Mesh( bottleCapGeometry, bottleCapMaterial );
        bottleCap.scale.x = 0.1;
        bottleCap.scale.y = 0.1;
        bottleCap.scale.z = 0.1;
        bottle.add(bottleCap);
        bottleCap.position.set(0,15,0);



        let geo1 = new THREE.CylinderGeometry( 4.0001, 4.0001, 8, 64 );
        let mat1 = new THREE.MeshLambertMaterial( {color: 0xe2e2e2} );
        let shape1 = new THREE.Mesh( geo1, mat1 );
        bottle.add(shape1);





        bottle.scale.x = 0.05;
        bottle.scale.y = 0.05;
        bottle.scale.z = 0.05;

        return bottle;
    }
    function createCigaretteBox(){
        var cigaretteBoxGeometry = new THREE.BoxGeometry(1,4,2);
        var cigaretteBoxMaterial = new THREE.MeshLambertMaterial({color:0xc9cee5, wireframe:false});
        var cigaretteBox = new THREE.Mesh(cigaretteBoxGeometry,cigaretteBoxMaterial);
        cigaretteBox.position.set(-9,0,0);


        var geo1 = new THREE.BoxGeometry(1.35,0.01,0.01);
        var mat1 = new THREE.MeshLambertMaterial({color:0x6e7587, wireframe:false});
        var shape1 = new THREE.Mesh(geo1,mat1);
        shape1.position.set(0,1.2,-1);
        shape1.rotation.z = 45/60;
        cigaretteBox.add(shape1);


        var geo2 = new THREE.BoxGeometry(1.35,0.01,0.01);
        var mat2 = new THREE.MeshLambertMaterial({color:0x6e7587, wireframe:false});
        var shape2 = new THREE.Mesh(geo2,mat2);
        shape2.position.set(0,1.2,1);
        shape2.rotation.z = 45/60;
        cigaretteBox.add(shape2);


        var geo3 = new THREE.BoxGeometry(0.01,0.01,2);
        var mat3 = new THREE.MeshLambertMaterial({color:0x6e7587, wireframe:false});
        var shape3 = new THREE.Mesh(geo3,mat3);
        shape3.position.set(-0.5,0.73,0);
        cigaretteBox.add(shape3);


        var geo4 = new THREE.BoxGeometry(0.01,0.15,0.15);
        var mat4 = new THREE.MeshLambertMaterial({color:0x8e895f, wireframe:false});
        var shape4 = new THREE.Mesh(geo4,mat4);
        shape4.position.set(-0.5,1.6,0);
        shape4.rotation.x = 45/60;
        cigaretteBox.add(shape4);

        var geo41 = new THREE.BoxGeometry(0.01,0.15,0.15);
        var mat41 = new THREE.MeshLambertMaterial({color:0x8e895f, wireframe:false});
        var shape41 = new THREE.Mesh(geo41,mat41);
        shape41.position.set(-0.5,1.4,-0.3);
        shape41.rotation.x = 45/60;
        cigaretteBox.add(shape41);

        var geo42 = new THREE.BoxGeometry(0.01,0.15,0.15);
        var mat42 = new THREE.MeshLambertMaterial({color:0x8e895f, wireframe:false});
        var shape42 = new THREE.Mesh(geo42,mat42);
        shape42.position.set(-0.5,1.4,0.3);
        shape42.rotation.x = 45/60;
        cigaretteBox.add(shape42);



        var geo5 = new THREE.BoxGeometry(0.01,0.01,2);
        var mat5 = new THREE.MeshLambertMaterial({color:0x000000, wireframe:false});
        var shape5 = new THREE.Mesh(geo5,mat5);
        shape5.position.set(-0.5,-1,0);
        cigaretteBox.add(shape5);



        var geo6 = new THREE.BoxGeometry(0.01,0.01,2);
        var mat6 = new THREE.MeshLambertMaterial({color:0x000000, wireframe:false});
        var shape6 = new THREE.Mesh(geo6,mat6);
        shape6.position.set(-0.5,-1.99,0);
        cigaretteBox.add(shape6);


        var geo7 = new THREE.BoxGeometry(0.01,1,0.01);
        var mat7 = new THREE.MeshLambertMaterial({color:0x000000, wireframe:false});
        var shape7 = new THREE.Mesh(geo7,mat7);
        shape7.position.set(-0.5,-1.5,0.999);
        cigaretteBox.add(shape7);


        var geo8 = new THREE.BoxGeometry(0.01,1,0.01);
        var mat8 = new THREE.MeshLambertMaterial({color:0x000000, wireframe:false});
        var shape8 = new THREE.Mesh(geo8,mat8);
        shape8.position.set(-0.5,-1.5,-0.999);
        cigaretteBox.add(shape8);


        var geo9 = new THREE.BoxGeometry(0.01,0.8,0.7);
        var mat9 = new THREE.MeshLambertMaterial({color:0x4671d6, wireframe:false});
        var shape9 = new THREE.Mesh(geo9,mat9);
        shape9.position.set(-0.5,0,0);
        cigaretteBox.add(shape9);


        cigaretteBox.scale.x = 0.1;
        cigaretteBox.scale.y = 0.1;
        cigaretteBox.scale.z = 0.1;

        return cigaretteBox;
    }
    function createCanister(){
        let cylinderGeometry = new THREE.CylinderGeometry( 5, 5, 15, 64 );
        let cylinderMaterial = new THREE.MeshLambertMaterial( {color: 0Xc4071a} );
        let canister = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
        canister.position.set(-8,0,0);


        let geo1 = new THREE.CylinderGeometry( 3.5, 5, 2, 64 );
        let mat1 = new THREE.MeshLambertMaterial( {color: 0Xc4071a} );
        let shape1 = new THREE.Mesh( geo1, mat1 );
        shape1.position.set(0,8.5,0);
        canister.add(shape1);


        let geo2 = new THREE.CylinderGeometry( 5, 4, 1, 64 );
        let mat2 = new THREE.MeshLambertMaterial( {color: 0Xc4071a} );
        let shape2 = new THREE.Mesh( geo2, mat2 );
        shape2.position.set(0,-8,0);
        canister.add(shape2);


        let geo3 = new THREE.TorusGeometry( 3.2, 0.5, 20, 100 );
        let mat3 = new THREE.MeshLambertMaterial( { color: 0x9b9394 } );
        let shape3 = new THREE.Mesh( geo3, mat3 );
        shape3.rotation.x = Math.PI/2;
        shape3.position.set(0,9.5,0);
        canister.add(shape3);

        let geo4 = new THREE.TorusGeometry( 3.7, 0.5, 20, 100 );
        let mat4 = new THREE.MeshLambertMaterial( { color: 0x9b9394 } );
        let shape4 = new THREE.Mesh( geo4, mat4 );
        shape4.rotation.x = Math.PI/2;
        shape4.position.set(0,-8.5,0);
        canister.add(shape4);

        let geo6 = new THREE.CircleGeometry( 2.8, 32 );
        let mat6 = new THREE.MeshLambertMaterial( { color: 0xada4a5 } );
        mat6.side=THREE.DoubleSide;
        let shape6 = new THREE.Mesh( geo6, mat6 );
        shape6.position.set(0,9.5999,0);
        shape6.rotation.x = Math.PI/2;
        canister.add(shape6);


        let geo7 = new THREE.CircleGeometry( 3.3, 32 );
        let mat7 = new THREE.MeshLambertMaterial( { color: 0xada4a5 } );
        mat7.side=THREE.DoubleSide;
        let shape7 = new THREE.Mesh( geo7, mat7 );
        shape7.position.set(0,-8.59999,0);
        shape7.rotation.x = Math.PI/2;
        canister.add(shape7);


        let geo8 = new THREE.CircleGeometry( 0.4, 32 );
        let mat8 = new THREE.MeshLambertMaterial( { color: 0x5b5a5a } );
        mat8.side=THREE.DoubleSide;
        let shape8 = new THREE.Mesh( geo8, mat8);
        shape8.position.set(0,9.6,1);
        shape8.rotation.x = Math.PI/2;
        canister.add(shape8);

        canister.scale.x = 0.0198765;
        canister.scale.y = 0.0198765;
        canister.scale.z = 0.0198765;
        return canister;
    }


    /*var bottle = createBottle();
    var cigaretteBox = createCigaretteBox();
    var canister = createCanister();
    var recycleBin = createRecycleBin();
    cityLoader(loader);
    scene.add(recycleBin);
    scene.add(bottle);
    scene.add(cigaretteBox);
    scene.add(canister);*/

    cityLoader(loader);
    generateGarbage(10);




    //pick helper
    class PickHelper {
        constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
        }
        pick(normalizedPosition, scene, camera) {


            // cast a ray through the frustum
            this.raycaster.setFromCamera(normalizedPosition, camera);
            // get the list of objects the ray intersected
            const intersectedObjects = this.raycaster.intersectObjects(scene.children);

            if (intersectedObjects.length) {

                console.log(intersectedObjects[0]);
                console.log(intersectedObjects[0].object);
                console.log(intersectedObjects[0].object.geometry);
                console.log(intersectedObjects[0].object.geometry.type);
                if(intersectedObjects[0].object.geometry.type !== "PlaneGeometry"){
                    this.pickedObject = intersectedObjects[0].object;

                    return this.pickedObject;
                }
                // pick the first object. It's the closest one

            }
            return null;
        }
    }

    //drag Controls

    const pickPosition = {x: 0, y: 0};
    clearPickPosition();

    function getCanvasRelativePosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * canvas.width  / rect.width,
            y: (event.clientY - rect.top ) * canvas.height / rect.height,
        };
    }

    function setPickPosition(event) {
        const pos = getCanvasRelativePosition(event);
        pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
        pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
    }

    function clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }

    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);



    //RayCaster
    var possibleIntersects = [];



    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseMove(event){
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    function rayCasterHandler(rayCaster,mouse,camera,scene){
        rayCaster.setFromCamera(mouse,camera);
        const intersects = rayCaster.intersectObjects(possibleIntersects,true);
        /* for(let i=0;i<intersects.length;i++){
             console.log(intersects[i].object);
         }*/
        if(intersects.length>0){
            console.log(intersects[0]);
        }

    }
    var pickHelper = new PickHelper();
    var pickedObject;
    window.addEventListener("mousemove",onMouseMove,false);
    window.addEventListener("click",(event) => {
        pickedObject=pickHelper.pick(pickPosition, scene, camera);
    });
    //RayCaster

    document.addEventListener("keydown",(event)=>{
        //key pressed
        var xSpeed = 0.8;
        var ySpeed = 0.8;
        var zSpeed = 0.8;
        if(pickedObject){
            if(event.key === "ArrowUp"){
                pickedObject.position.z -= zSpeed;
            }else if(event.key === "ArrowDown"){
                pickedObject.position.z += zSpeed;
            }else if(event.key === "ArrowLeft"){
                pickedObject.position.x -= xSpeed;
            }else if(event.key === "ArrowRight"){
                pickedObject.position.x += xSpeed;
            }
            else if(event.key === "q"){
                pickedObject.position.y -= ySpeed;
            }else if(event.key === "e"){
                pickedObject.position.y += ySpeed;
            }
        }
    });

    //pickhelper




    //load sound
    /*const listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    const sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( "./sound/sound.ogg", function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 5 );
        sound.play();
    });*/





    function generateGarbage(numberOfTrashes){

        for(let i=0;i<numberOfTrashes;i++){


            let trash;
            let number = Math.floor(Math.random() * 3) + 1;
            if(number === 1){
                trash = createCanister();
            }else if(number === 2){
                trash = createCigaretteBox();
            }else if(number === 3){
                trash = createBottle();
            }


            let xValue;
            let zValue;


            //for x
            let posOrNegativeX = Math.floor(Math.random() * 2) + 1;
            if(posOrNegativeX===1){
                xValue = Math.floor(Math.random()*70)+1;
            }else if(posOrNegativeX===2){
                xValue = -(Math.floor(Math.random()*70)+1);
            }

            //for z
            let posOrNegativeZ = Math.floor(Math.random() * 2) + 1;
            if(posOrNegativeZ===1){
                zValue = Math.floor(Math.random()*70)+1;
            }else if(posOrNegativeZ===2){
                zValue = -(Math.floor(Math.random()*70)+1);
            }


            trash.rotation.z=-Math.PI/2;
            trash.position.set(xValue,0.1,zValue);


            trashes.push(trash);
            scene.add(trash);
        }



    }






    var upFlag = false;
    var downFlag = false;
    var leftFlag = false;
    var rightFlag = false;
    





    function addArrowHelper(pointVector,baseVector,length,color){
        var arrowHelper = new THREE.ArrowHelper(pointVector,baseVector,length,color);  
        scene.add(arrowHelper);
        return arrowHelper;
    }

    /*document.addEventListener("keydown",(event)=>{
        if(event.key == "c"){
            var directionVector = camera.getWorldDirection(new THREE.Vector3());
            var vector = new THREE.Vector3(0,0,camera.getWorldDirection(new THREE.Vector3()).z);
            var tempVector = new THREE.Vector3(-5,5,0);
            addArrowHelper(directionVector,tempVector,5,0x30e5d9);
            monkey.castShadow=true;
            monkey.children[0].castShadow=true;
            monkey.children[1].castShadow=true;
            monkey.children[2].castShadow=true;
            knight.castShadow=true;
            knight.children[0].castShadow=true;
            zombie.castShadow=true;
            zombie.children[0].castShadow=true;
            zombie.children[0].children[0].castShadow=true;
            zombie.children[0].children[1].castShadow=true;


            //walking animation
            walking.enabled=false;


            //walking animation

            console.log(zombie);
            console.log(knight);
            console.log(monkey);
            console.log(plane);
            console.log(firstCube);
            console.log(light);
        }
       
    });*/
    window.addEventListener("keydown",(e)=>{
        if(e.key=="g"){
            character["idle"].action.play();
            character["walking"].action.play();
            character["walking"].action.enabled=false;
            character["point"].action.play();
            character["point"].action.enabled=false;
            character["spell"].action.play();
            character["spell"].action.enabled=false;
            character["walkBack"].action.play();
            character["walkBack"].action.enabled=false;
        }
        else if(e.key =="w"){
            //play walking
            upFlag=true;
            character["idle"].action.enabled=false;
            character["walking"].action.enabled=true;

        }/*else if(e.key =="n"){
            //play point
            character["idle"].action.enabled=false;
            character["walking"].action.enabled=false;
            character["point"].action.enabled=true;
            character["spell"].action.enabled=false;
            character["walkBack"].action.enabled=false;
        }else if(e.key =="m"){
            //play spell
            character["idle"].action.enabled=false;
            character["walking"].action.enabled=false;
            character["point"].action.enabled=false;
            character["spell"].action.enabled=true;
            character["walkBack"].action.enabled=false;
        }*/else if(e.key =="s"){
            //play walkback
            downFlag=true;
            character["idle"].action.enabled=false;
            character["walkBack"].action.enabled=true;
        }else if(e.key === "a"){
            leftFlag=true;
        }else if(e.key === "d"){
            rightFlag=true;
        }else if(e.key === "l"){
            console.log(protector.position);
        }
    });

    window.addEventListener("keyup",(e)=>{
        if(e.key =="w"){
            //play walking
            upFlag=false;
            character["walking"].action.enabled=false;
            character["idle"].action.enabled=true;
        }else if(e.key =="s"){
            //play walkback
            downFlag=false;
            character["walkBack"].action.enabled=false;
            character["idle"].action.enabled=true;
        }else if(e.key === "a"){
            leftFlag=false;
        }else if(e.key === "d"){
            rightFlag=false;
        }
    });





    function characterUpdate(character){
        if(character){
            let vector = new THREE.Vector3(0,2.5,0);
            vector.add(character.position);
            camera.lookAt(vector);
        }
    }




    //game animations or logic
    var update = function()
    {



        characterUpdate(protector);



        let delta = clock.getDelta();
        //animation try
        if(animationMixer){
            animationMixer.update(delta);
        }
        if(enemyMixer){
            enemyMixer.update(delta);
        }


    
    //object movement
            let factor = 0.025;
            let distance = 4*factor;
            if(upFlag){
                protector.translateZ(distance);
            }if(downFlag){
                protector.translateZ(-distance);
            }if(rightFlag){
                protector.rotation.y-=factor;
            }if(leftFlag){
                protector.rotation.y+=factor;
            }/*if(!upFlag && !downFlag){
                if(character["walking"].action){
                    character["walking"].action.enabled=false;
                }
                if(character["walkBack"].action){
                    character["walkBack"].action.enabled=false;
                }

                character["walkBack"].action.enabled=false;
                if(!character["idle"].action.enabled){
                    character["idle"].action.enabled=true;
                }


            }*/



    };


    //draw scene
    var render = function()
    {
        renderer.render(scene,camera);
    };



    //run game loop (update, render, repeat)
    var gameLoop = function(now)
    {
        update();
        animation = requestAnimationFrame(gameLoop);
        render();
        
    };

    
    animation = requestAnimationFrame(gameLoop);
    }

    main();