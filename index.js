const field = document.getElementById('field')
let mobsize = 20
let playerInfo = {
    player:0,
    x:innerWidth/2,
    y:innerHeight/2,
    height:50,
    width:25,
    moveAnim:0,
    moveVector:[{x:0,y:0}],
    playerSpeed:5,
    isReloading:false,
    reloadTime:1000,
    damage:1,
}
let mouse = { 
    x:0,
    y:0,
}
let playerGunInfo = {
    playerGun:0,
    gunX:0,
    gunY:0,
    gunAngle:0,
} 
let bulletInfo = {
    bulletCount:0,
    bulletSpeed:10,
    bulletLife:5000,
}
let enemys = [
    {
        type:'zombie',
        hp:5,
        damage:10,
        attackSpeed:1000,
        angle:0,
        x:0,
        y:0,
        leftSin:0,
        topCos:0,
        speed:3,
    }
]
let levelEnemys = []

function detect(bullet,id){
    for(let x = 0;x<levelEnemys.length;x++){
        if(parseInt(bullet.style.left) + 2.5 >= parseInt(levelEnemys[x].mobObj.style.left)
        && parseInt(bullet.style.left) <= parseInt(levelEnemys[x].mobObj.style.left) + mobsize
        && parseInt(bullet.style.top) + 2.5 >= parseInt(levelEnemys[x].mobObj.style.top) 
        && parseInt(bullet.style.top) <= parseInt(levelEnemys[x].mobObj.style.top) + mobsize  ){
            cancelAnimationFrame(id)
            bullet.remove()
            damage(x)
            levelEnemys[x].mobObj.style.backgroundColor = 'red'
            setTimeout(function(){color(levelEnemys[x].mobObj)}, 120);
                
            return
        }
    }
}
function color(mob){
    mob.style.backgroundColor = 'aqua'
}
function damage(index){
    console.log(levelEnemys[index].hp)
    levelEnemys[index].hp = levelEnemys[index].hp - playerInfo.damage
    if(levelEnemys[index].hp <= 0){
        levelEnemys[index].mobObj.remove()
        levelEnemys.splice(index, 1);
        console.log(levelEnemys)
    }else{
        return
    }
}
document.addEventListener('keyup',keyUp)
document.addEventListener('keydown',keyPress)
document.addEventListener('click',(e) => {
    if(playerInfo.isReloading === false){
        let startReloadTime = new Date().getTime()
        playerInfo.isReloading = true
        reload(startReloadTime,'')
        
        const bullet = document.createElement('div')
        bullet.classList.add('bullet')
        field.append(bullet)
    
        mathGun()
        bullet.style.left = playerGunInfo.gunX + Math.cos(playerGunInfo.gunAngle) + 'px'
        bullet.style.top = playerGunInfo.gunY + Math.sin(playerGunInfo.gunAngle) + 'px'
        
        moveBullet(bullet,playerGunInfo.gunAngle,parseInt(bullet.style.left),parseInt(bullet.style.top))
    }else{
        return 'Перезарядка'
    }
})

function reload(startTime,animId){
    let currentTime = new Date().getTime()
    if(currentTime - startTime > playerInfo.reloadTime){
        playerInfo.isReloading = false
        cancelAnimationFrame(animId)
        bulletInfo.bulletCount++
    }else{
        let anim_id = requestAnimationFrame(()=>{reload(startTime,anim_id)})
    }
}
function moveBullet(bullet,angle,left,top){
    left += Math.sin(angle)*bulletInfo.bulletSpeed;
    bullet.style.left = left + 'px';
    top += - Math.cos(angle)*bulletInfo.bulletSpeed;
    bullet.style.top = top + 'px';
    
    let anim_id = requestAnimationFrame(()=>{moveBullet(bullet,angle,left,top)})
    detect(bullet,anim_id)
    bulletCordsDeath(anim_id,bullet)
}
function bulletCordsDeath(anim,bullet){
    if(Math.abs(parseInt(bullet.style.left)) > bulletInfo.bulletLife || Math.abs(parseInt(bullet.style.top)) > bulletInfo.bulletLife ){
        cancelAnimationFrame(anim)
        bullet.remove()
        bulletInfo.bulletCount--
    }
}
document.addEventListener(onload,load())
document.addEventListener('mousemove',(e)=>{
    mouse.x = e.pageX
    mouse.y = e.pageY
    mathGun()
})
function mathGun(){
    if(    playerInfo.x - 10 > mouse.x 
        || playerInfo.x + playerInfo.width + 10 < mouse.x
        || playerInfo.y - 10 > mouse.y
        || playerInfo.y + playerInfo.height + 10 < mouse.y){

        let gunInfo = playerGunInfo.playerGun.getBoundingClientRect();
        playerGunInfo.gunX = (gunInfo.left + gunInfo.right) / 2;
        playerGunInfo.gunY = (gunInfo.top + gunInfo.bottom) / 2;
        playerGunInfo.gunAngle = - Math.atan2(playerGunInfo.gunX - mouse.x, playerGunInfo.gunY - mouse.y );
        playerGunInfo.playerGun.style.transform = `rotate(${playerGunInfo.gunAngle}rad)`;
    }
}

function keyPress(e){
    if(e.keyCode === 87){
        playerInfo.moveVector[0].y = 1
    }else if(e.keyCode === 65){
        playerInfo.moveVector[0].x = -1
    }else if(e.keyCode === 83){
        playerInfo.moveVector[0].y = -1
    }else if(e.keyCode === 68){
        playerInfo.moveVector[0].x = 1
    }
}
function keyUp(e){
    // 87 - w 65 - a 83 - s 68 - d
    if(e.keyCode === 87){
        playerInfo.moveVector[0].y = 0
    }else if(e.keyCode === 65){
        playerInfo.moveVector[0].x = 0
    }else if(e.keyCode === 83){
        playerInfo.moveVector[0].y = 0
    }else if(e.keyCode === 68){
        playerInfo.moveVector[0].x = 0
    }
}

function move(){
    playerInfo.moveAnim = requestAnimationFrame(move)
    mathGun()
    if(playerInfo.moveVector[0].x === 1){
        playerInfo.x += playerInfo.playerSpeed
        playerInfo.player.style.left = playerInfo.x + 'px'
    }if(playerInfo.moveVector[0].x === -1){
        playerInfo.x -= playerInfo.playerSpeed
        playerInfo.player.style.left = playerInfo.x + 'px'
    }if(playerInfo.moveVector[0].y === 1){
        playerInfo.y -= playerInfo.playerSpeed
        playerInfo.player.style.top = playerInfo.y + 'px'
    }if(playerInfo.moveVector[0].y === -1){
        playerInfo.y += playerInfo.playerSpeed
        playerInfo.player.style.top = playerInfo.y + 'px'
    }
}
function createEnemys(){
    for(let i=0;i<4;i++){
        let randomMobNum = Math.floor(Math.random() * (0 - enemys.length) + enemys.length);
        
        const mob = document.createElement('div')
        mob.classList.add('mob')
        field.append(mob)
        let x = Math.floor(Math.random() * (1+mobsize - innerWidth-mobsize) + innerWidth-mobsize);
        let y = Math.floor(Math.random() * (1+mobsize - innerHeight-mobsize) + innerHeight-mobsize);
    
        mob.style.top = y + 'px'
        mob.style.left = x + 'px'
        mob.style.height = mobsize + 'px'
        mob.style.width = mobsize + 'px'
        levelEnemys.push({
            mobObj:mob,
            type:enemys[randomMobNum].type,
            hp:enemys[randomMobNum].hp,
            damage:enemys[randomMobNum].damage,
            attackSpeed:enemys[randomMobNum].attackSpeed,
            angle:0,
            x:0,
            y:0,
            leftSin:x,
            topCos:y,
            speed:enemys[randomMobNum].speed,
        })

    }
}
function load() {
    const player = document.createElement('div')
        player.classList.add('player')
        field.append(player)
        player.style.top = playerInfo.y + 'px'
        player.style.left = playerInfo.x + 'px'
        player.style.height = playerInfo.height + 'px'
        player.style.width = playerInfo.width + 'px'
        playerInfo.player = player
    const Gun = document.createElement('div')
        Gun.classList.add('playerGun')
        player.append(Gun)
        Gun.style.transform = 'rotate(' + 270 + 'deg)'
        playerGunInfo.playerGun = Gun
    const dulo = document.createElement('div')
        dulo.classList.add('dulo')
        Gun.append(dulo)
    const radius = document.createElement('div')
        radius.classList.add('radius')
        player.append(radius)
    move()
    createEnemys()
    trash()
}

function trash(){
    if(levelEnemys.length>0){
        for(i=0;i<levelEnemys.length;i++){
            let enemyInfo = levelEnemys[i].mobObj.getBoundingClientRect();
                levelEnemys[i].x = (enemyInfo.left + enemyInfo.right) / 2;
                levelEnemys[i].y = (enemyInfo.top + enemyInfo.bottom) / 2;
                levelEnemys[i].angle = - Math.atan2(levelEnemys[i].x - playerInfo.x - 12.5, levelEnemys[i].y - playerInfo.y - 25);
                levelEnemys[i].leftSin += Math.sin(levelEnemys[i].angle)*levelEnemys[i].speed;
                levelEnemys[i].mobObj.style.left = levelEnemys[i].leftSin + 'px';
                levelEnemys[i].topCos += - Math.cos(levelEnemys[i].angle)*levelEnemys[i].speed;
                levelEnemys[i].mobObj.style.top = levelEnemys[i].topCos + 'px';
        }
    }
    let anim_id = requestAnimationFrame(()=>{trash()})
}
