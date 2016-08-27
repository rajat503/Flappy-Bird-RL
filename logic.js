var SVG="http://www.w3.org/2000/svg";
var PIPE_WIDTH=70;
var PIPE_GAP=150;
var ARENA_HEIGHT=720;
var ARENA_WIDTH=1080;
var BIRD_WIDTH=40;
var BIRD_HEIGHT=40;
var DISTANCE_BETWEEN_PIPES=380;
var UPPER_LIMIT=ARENA_HEIGHT*0.75;
var LOWER_LIMIT=ARENA_HEIGHT*0.25;

function Pipe(x, y) {
    this.x = x;
    this.y = y;
}

function Bird() {
    this.i = 0;
    this.y=ARENA_HEIGHT/2;
    this.height=BIRD_HEIGHT;
    this.width=BIRD_WIDTH;
    var goUp = function(bird) {
        setTimeout(function() {
            if(bird.y>=10)
                bird.y-=10;
            else
                bird.y=0
            bird.i=bird.i+1;
            console.log(bird.y);
            if(bird.i<4)
                goUp(bird);
        }, 5);
    }
    this.flap = function() {
        goUp(this);
    }
    this.goDown = function() {
        this.y+=1;
        if(this.y>ARENA_HEIGHT-BIRD_HEIGHT)
            this.y=ARENA_HEIGHT-BIRD_HEIGHT;
    }
}

function World() {
    this.gameover=0;
    this.pipes=[];
    this.pipes.push(new Pipe(ARENA_WIDTH, ARENA_HEIGHT/2+BIRD_HEIGHT));
    this.pipes.push(new Pipe(ARENA_WIDTH+DISTANCE_BETWEEN_PIPES, ARENA_HEIGHT/2-BIRD_HEIGHT));
    this.pipes.push(new Pipe(ARENA_WIDTH+2*DISTANCE_BETWEEN_PIPES, ARENA_HEIGHT/2+BIRD_HEIGHT));
    console.log(this.pipes);
    world_reference=this;

    pipe_interval=setInterval(function() {
        for(i=0;i<world_reference.pipes.length;i++) {
            if(world_reference.pipes[i].x+PIPE_WIDTH <= 0) {
                world_reference.pipes[i].x = ARENA_WIDTH;
                world_reference.pipes[i].y = parseInt(Math.random()*(UPPER_LIMIT-LOWER_LIMIT)+LOWER_LIMIT);
            }
            world_reference.pipes[i].x-=2;
            console.log(world_reference.pipes[i]);
        }
    }, 10);

    this.bird=new Bird();

    setInterval(function() {
        if(world_reference.bird.y<ARENA_HEIGHT-BIRD_HEIGHT) {
            world_reference.bird.goDown();
            console.log(world_reference.bird.y);
        }
        else {
            clearInterval(this)
            clearInterval(pipe_interval)
        }
    }, 10);

    setInterval(function() {
        if(Math.round(world_reference.bird.y)>=ARENA_HEIGHT-BIRD_HEIGHT-1) {
            world_reference.gameover=1;
            alert("Game Over");
            clearInterval();
        }
    }, 10);

}

$(document).ready(function() {
    var world=new World();

    p=document.createElementNS(SVG, "rect");
    p.setAttribute("x", ARENA_WIDTH*0.4);
    p.setAttribute("y", world.bird.y);
    p.setAttribute("height", world.bird.height);
    p.setAttribute("width", world.bird.width);
    p.setAttribute("class", "bird");
    p.setAttribute("fill", "black");

    $('.arena').append(p);

    for(i=0;i<world.pipes.length;i++) {
        p=document.createElementNS(SVG, "rect");
        p.setAttribute("x", world.pipes[i].x);
        p.setAttribute("y", 0);
        p.setAttribute("height", world.pipes[i].y);
        p.setAttribute("width", PIPE_WIDTH);
        p.setAttribute("class", "p"+i);
        p.setAttribute("fill", "green");
        $('.arena').append(p);

        p=document.createElementNS(SVG, "rect");
        p.setAttribute("x", world.pipes[i].x);
        p.setAttribute("y", world.pipes[i].y+PIPE_GAP);
        p.setAttribute("height", ARENA_HEIGHT-world.pipes[i].y-PIPE_GAP);
        p.setAttribute("width", PIPE_WIDTH);
        p.setAttribute("class", "pl"+i);
        p.setAttribute("fill", "green");
        $('.arena').append(p);
    }

    setInterval(function(){
        $('.bird').attr("y", world.bird.y);

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

    $('body').keyup(function(e){
        if(e.keyCode == 32) {
            if(world.gameover==0) {
                world.bird.flap();
                world.bird.i=0;
            }
        }
    });
});
