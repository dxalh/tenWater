/**
 * 游戏类，控制游戏的分数，状态，游戏容器，提供开始和结束等功能
 *  因为当前游戏只有一个，Game这个代表了游戏的对象同时只会存在一个，不需要有多
 *  所以：我们采用单例的模式来设计这个Game对象
 * 
 *  在js中我们可以直接通过对象字面量的方式来创建一个单例对象，而不需要通过class（构造函数）来创建
 */
import WaterPolo from './WaterPolo.js'
import Bullet from './Bullet.js'

export default {
    //水量,默认10当water我0时，表示游戏结束
    water:10,
    wrap:null,
    txt:null,
    allWater:null,
    isBtn:true,
    //保存游戏中所有小水球对象
    waterPolos:[],
    //保存游戏中所有的子弹
    bullets:[],
    
    /**
     * 开始游戏
     * 调用的时候，游戏会初始化，
     * 
     */
    start() {
        //处理一些程序中的逻辑错误
        if(this.wrap === null) throw new Error('请设置游戏的容器')
        this.txt.innerHTML = this.water;
        this.allWater.style.height = 300 + 'px';
        //使用传统面向过程的一宗方式来创建水球
        for(let i=0;i<36;i++) {  
        //     //创建结构div,img
        //     let div = document.createElement('div');
        //     div.classList.add('water-polo');
        //     let img =document.createElement('img');
        //     img.src = "img/1.png";
        //     div.appendChild(img);
        //     this.wrap.appendChild(div);

          // 使用面向对象的方式
        //   let waterPolo = new WaterPolo(Math.floor(Math.random()*5));
        //一个类内部只关注有那些特性（属性，方法），按时一些非自身的逻辑我们就不在内部实现，
        // 而是通过类对外提供的方法或事件来实现
          let waterPolo = new WaterPolo(Math.floor(Math.random()*5));
          this.waterPolos.push(waterPolo);
          waterPolo.draw(this.wrap);
          waterPolo.onclick = () => {
              if(this.isBtn ) {
                  if(waterPolo.level == 4 ){
                    this.isBtn=false;
                  }
               
                if(this.water>0 ) {
                    
                    this.water--;
                    this.allWater.style.height =30*this.water + 'px';
                    waterPolo.levelUp();
                   
                    this.txt.innerHTML = this.water;
                  }
              }
             
           
          }
          waterPolo.onBoom = () => {
            //   左
            let bulletLeft = new Bullet('left',3);

            this.bullets.push(bulletLeft);
            bulletLeft.draw(this.wrap);
            bulletLeft.setPosition(waterPolo.left-50,waterPolo.top);
            bulletLeft.onmove = () => {
                this.bulletMove(waterPolo,bulletLeft);

            }
            // 右
            let bulletRight = new Bullet('right',3);
            this.bullets.push(bulletRight);
            bulletRight.draw(this.wrap);
            bulletRight.setPosition(waterPolo.left+50,waterPolo.top);
            bulletRight.onmove = () => {
                this.bulletMove(waterPolo,bulletRight);
            }
             // 上
             let bulletTop = new Bullet('top',3);
             this.bullets.push(bulletTop);
             bulletTop.draw(this.wrap);
             bulletTop.setPosition(waterPolo.left,waterPolo.top-50);
             bulletTop.onmove = () => {
                 this.bulletMove(waterPolo,bulletTop);
             }
              // 下
              let bulletBottom = new Bullet('bottom',3);
              this.bullets.push(bulletBottom);
              bulletBottom.draw(this.wrap);
              bulletBottom.setPosition(waterPolo.left,waterPolo.top+50);
              bulletBottom.onmove = () => {
                  this.bulletMove(waterPolo,bulletBottom);
              }
          }
           
        }

        


      
    },
    bulletMove(waterPolo,bullet) {
         //碰撞检测
                //排除发射子弹的元素与level=0的元素
        //子弹移动
        let waterPolos =this.waterPolos.filter(wp => {
            return wp != waterPolo && wp.level >0 
        })
        let wp = bullet.collision(waterPolos);
        if(wp) {
            //若碰撞，销毁
            bullet.destory();
            //被被碰撞的水滴变大
            wp.levelUp();
            
            this.bullets = this.bullets.filter(bu => bu != bullet);
        }
        if(bullet.left<-bullet.width || bullet.left>this.wrap.offsetWidth ||bullet.top<-bullet.height ||bullet.top > this.wrap.offsetHeight) {
            bullet.destory();
            this.bullets = this.bullets.filter(bu => bu != bullet);
        }
        if(this.bullets.length == 0 ){
            this.isBtn=true;
            let wps = this.waterPolos.filter(wp => wp.level != 0);
            if(wps.length !=0 && this.water === 0 ) {
                alert('游戏结束');
                this.wrap.innerHTML = '';
                this.water =10;
                this.start();
            }
            if(wps.length === 0 && this.water >=0) {
                alert("进入下一关");
                this.wrap.innerHTML = '';
                this.water =10;
                this.start();
            }
        }
    }
};

 