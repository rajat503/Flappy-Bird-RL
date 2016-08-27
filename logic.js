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
var BIRD_X=ARENA_WIDTH*0.4

function Pipe(x, y) {
    this.x = x;
    this.y = y;
    this.scoreCountedFlag = 0;
}

function Bird() {
    this.down_velocity=1;
    this.upward_velocity=1;
    this.i = 0;
    this.y=ARENA_HEIGHT/2;
    this.height=BIRD_HEIGHT;
    this.width=BIRD_WIDTH;
    var goUp = function(bird) {
        setTimeout(function() {
            if(bird.y>=15)
                bird.y-=bird.upward_velocity;
            else
                bird.y=0
            bird.i=bird.i+1;
            bird.upward_velocity+=1;
            if(bird.i<10)
                goUp(bird);
            else {
                bird.upward_velocity=1;
            }
        }, 0);
    }
    this.flap = function() {
        this.down_velocity=1;
        this.i=0;
        goUp(this);
    }
    this.goDown = function() {
        this.y+=this.down_velocity;
        this.down_velocity+=0.05;
        if(this.y>ARENA_HEIGHT-BIRD_HEIGHT)
            this.y=ARENA_HEIGHT-BIRD_HEIGHT;
    }
}

function World() {
    this.score=0;
    this.gameover=0;
    this.pipes=[];
    this.pipes.push(new Pipe(ARENA_WIDTH, ARENA_HEIGHT/2+BIRD_HEIGHT));
    this.pipes.push(new Pipe(ARENA_WIDTH+DISTANCE_BETWEEN_PIPES, ARENA_HEIGHT/2-BIRD_HEIGHT));
    this.pipes.push(new Pipe(ARENA_WIDTH+2*DISTANCE_BETWEEN_PIPES, ARENA_HEIGHT/2+BIRD_HEIGHT));
    this.game_speed=0;
    world_reference=this;

    pipe_interval=setInterval(function() {
        for(i=0;i<world_reference.pipes.length;i++) {
            if(world_reference.pipes[i].x+PIPE_WIDTH <= 0) {
                world_reference.pipes[i].x = ARENA_WIDTH;
                world_reference.pipes[i].y = parseInt(Math.random()*(UPPER_LIMIT-LOWER_LIMIT)+LOWER_LIMIT);
                world_reference.pipes[i].scoreCountedFlag=0;
            }
            world_reference.game_speed=(Math.min(20, Math.max(10,world_reference.score)))/10.0;
            world_reference.pipes[i].x-=2;
        }
    }, 1);

    this.bird=new Bird();

    bird_interval=setInterval(function() {
        if(world_reference.bird.y<ARENA_HEIGHT-BIRD_HEIGHT) {
            world_reference.bird.goDown();
        }
        else {
            clearInterval(this)
            clearInterval(pipe_interval)
        }
    }, 10);

    scoreInterval=setInterval(function() {
        for(i=0;i<world_reference.pipes.length;i++) {
            if(world_reference.pipes[i].scoreCountedFlag == 0) {
                if(BIRD_X+BIRD_WIDTH >= world_reference.pipes[i].x && world_reference.pipes[i].y < world_reference.bird.y && world_reference.pipes[i].y+PIPE_GAP > world_reference.bird.y+BIRD_HEIGHT) {
                    world_reference.pipes[i].scoreCountedFlag = 1;
                    world_reference.score++;
                    console.log(world_reference.score);
                }
            }
        }
    }, 1);

    setInterval(function() {
        if(Math.round(world_reference.bird.y)>=ARENA_HEIGHT-BIRD_HEIGHT-1) {
            world_reference.gameover=1;
        }
        bx=BIRD_X;
        by=world_reference.bird.y;
        for(i=0;i<world_reference.pipes.length;i++) {
            px=world_reference.pipes[i].x;
            py=world_reference.pipes[i].y;
            if(!(bx+BIRD_WIDTH < px || bx > px+PIPE_WIDTH || (by > py && by+BIRD_HEIGHT < py+PIPE_GAP))) {
                world_reference.gameover=1;
            }
        }
        if(world_reference.gameover==1) {
            clearInterval(this);
            clearInterval(pipe_interval);
            clearInterval(bird_interval);
        }
    }, 1);

}

$(document).ready(function() {
    var world=new World();

    p=document.createElementNS(SVG, "rect");
    p.setAttribute("x", BIRD_X);
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

            $('.score').text("Score = "+world.score);
        }
    }, 0);

    // $('body').keyup(function(e){
    //     if(e.keyCode == 32) {
    //         if(world.gameover==0) {
    //             world.bird.flap();
    //             // world.bird.i=0;
    //         }
    //     }
    // });


    var env = {};
    env.getNumStates = function() { return 9; }
    env.getMaxNumActions = function() { return 2; }

    // create the DQN agent
    var spec = {}
    spec.update = 'qlearn'; // qlearn | sarsa
    spec.gamma = 0.9; // discount factor, [0, 1)
    spec.epsilon = 0.1; // initial epsilon for epsilon-greedy policy, [0, 1)
    spec.alpha = 0.1; // value function learning rate
    spec.experience_add_every = 10; // number of time steps before we add another experience to replay memory
    spec.experience_size = 5000; // size of experience replay memory
    spec.learning_steps_per_iteration = 20;
    spec.tderror_clamp = 1.0; // for robustness
    spec.num_hidden_units = 100 // number of neurons in hidden layer

    agent = new RL.DQNAgent(env, spec);

    setInterval(function(){
        s=[];
        current_score=0;
        for(i=0;i<world.pipes.length;i++){
            s.push(world.pipes[i].x);
            s.push(world.pipes[i].y);
        }
        s.push(world.bird.y);
        s.push(world.bird.upward_velocity);
        s.push(world.bird.down_velocity);


        var action = agent.act(s);
        // console.log(action);
        if(action==1)
            world.bird.flap();

        if(world.gameover==1){
            reward=-1000;
            world=new World();
            current_score=0;
        }
        else {
            reward=1
        }
        // else {
        //     if(world.score>current_score) {
        //         reward=10000*world.score;
        //         current_score=world.score;
        //     }
        //     else {
        //         reward=10;
        //     }
        // }
        console.log(reward);
        agent.learn(reward);
    }, 200);

});
