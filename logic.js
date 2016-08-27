function Pipe(x, y) {
    this.width = 50;
    this.x = x;
    this.y = y;
}

function Bird() {
    i = 0;
    this.y=10;
    this.height=50;
    this.width=50;
    var goUp = function(bird) {
        setTimeout(function() {
            bird.y+=0.1;
            i++;
            console.log(bird.y);
            if(i<10)
                goUp(bird);
            else
                i = 0;
        }, 50);
    }
    this.flap = function() {
        goUp(this);
    }
    this.goDown = function() {
        this.y-=0.1;
        if(this.y<0)
            this.y=0
    }
}

function World() {
    this.pipes=[];
    this.pipes.push(new Pipe(500, 50));
    this.pipes.push(new Pipe(700, 30));
    this.pipes.push(new Pipe(900, 100));
    console.log(this.pipes);
    world_referece=this;

    pipe_interval=setInterval(function() {
        for(i=0;i<world_referece.pipes.length;i++) {
            if(world_referece.pipes[i].x+world_referece.pipes[i].width <= 0) {
                world_referece.pipes[i].x = 500;
                world_referece.pipes[i].y = parseInt(Math.random() * (500 - 190) + 190);
            }
            world_referece.pipes[i].x-=1;
            console.log(world_referece.pipes[i]);
        }
    }, 10);

    // var bird=new Bird();
    // bird.flap();
    // setInterval(function() {
    //     if(bird.y>0) {
    //         bird.goDown();
    //         console.log(bird.y);
    //     }
    //     else {
    //         clearInterval(this)
    //         clearInterval(pipe_interval)
    //     }
    // }, 100);
}
// var world=new World();

$(document).ready(function() {
    var SVG="http://www.w3.org/2000/svg";
    var PIPE_GAP=50;
    var ARENA_HEIGHT=720;
    var ARENA_WIDTH=1080;
    var world=new World();
    for(i=0;i<world.pipes.length;i++) {
        p=document.createElementNS(SVG, "rect");
        p.setAttribute("x", world.pipes[i].x);
        p.setAttribute("y", 0);
        p.setAttribute("height", world.pipes[i].y);
        p.setAttribute("width", world.pipes[i].width);
        p.setAttribute("class", "p"+i);
        $('.arena').append(p);

        p=document.createElementNS(SVG, "rect");
        p.setAttribute("x", world.pipes[i].x);
        p.setAttribute("y", world.pipes[i].y+PIPE_GAP);
        p.setAttribute("height", ARENA_HEIGHT-world.pipes[i].y-PIPE_GAP);
        p.setAttribute("width", world.pipes[i].width);
        p.setAttribute("class", "pl"+i);
        $('.arena').append(p);
    }

    setInterval(function(){
        for(i=0;i<world.pipes.length;i++) {
            class_name=".p"+i;
            $(class_name).attr("x", world.pipes[i].x);
            $(class_name).attr("y", 0);
            $(class_name).attr("height", world.pipes[i].y);

            class_name=".pl"+i;
            $(class_name).attr("x", world.pipes[i].x);
            $(class_name).attr("y", world.pipes[i].y+PIPE_GAP);
            $(class_name).attr("height", ARENA_HEIGHT-world.pipes[i].y-PIPE_GAP);

        }
    }, 0);
    // var element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    // element.setAttribute("x", "500");
    // element.setAttribute("y", "500");
    // element.setAttribute("height", "50");
    // element.setAttribute("width", "50");
    // element.setAttribute("class", "rect1");
    // $('.arena').append(element);
});
//
// setInterval(function() {
//     var old_x = parseInt($('.rect1').attr('x'));
//     $('.rect1').attr('x', old_x-1);
//     if(old_x<=0) {
//         $('.rect1').remove();
//     }
// }, 5);
