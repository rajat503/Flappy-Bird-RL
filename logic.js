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
    i = 0;
    this.y=ARENA_HEIGHT/2;
    this.height=BIRD_HEIGHT;
    this.width=BIRD_WIDTH;
    var goUp = function(bird) {
        setTimeout(function() {
            bird.y-=0.1;
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
        this.y+=2;
        if(this.y>ARENA_HEIGHT-BIRD_HEIGHT)
            this.y=ARENA_HEIGHT-BIRD_HEIGHT;
    }
}

function World() {
    this.pipes=[];
    this.pipes.push(new Pipe(ARENA_WIDTH, 400));
    this.pipes.push(new Pipe(ARENA_WIDTH+DISTANCE_BETWEEN_PIPES, 450));
    this.pipes.push(new Pipe(ARENA_WIDTH+2*DISTANCE_BETWEEN_PIPES, 350));
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
    this.bird.flap();
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
}

$(document).ready(function() {
    var world=new World();

    p=document.createElementNS(SVG, "rect");
    p.setAttribute("x", 335);
    p.setAttribute("y", world.bird.y);
    p.setAttribute("height", world.bird.height);
    p.setAttribute("width", world.bird.width);
    p.setAttribute("class", "bird");
    p.setAttribute("fill", "red");

    $('.arena').append(p);

    for(i=0;i<world.pipes.length;i++) {
        p=document.createElementNS(SVG, "rect");
        p.setAttribute("x", world.pipes[i].x);
        p.setAttribute("y", 0);
        p.setAttribute("height", world.pipes[i].y);
        p.setAttribute("width", PIPE_WIDTH);
        p.setAttribute("class", "p"+i);
        $('.arena').append(p);

        p=document.createElementNS(SVG, "rect");
        p.setAttribute("x", world.pipes[i].x);
        p.setAttribute("y", world.pipes[i].y+PIPE_GAP);
        p.setAttribute("height", ARENA_HEIGHT-world.pipes[i].y-PIPE_GAP);
        p.setAttribute("width", PIPE_WIDTH);
        p.setAttribute("class", "pl"+i);
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
});
