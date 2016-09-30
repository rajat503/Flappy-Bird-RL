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
    this.velocity=1;
    this.y=ARENA_HEIGHT/2;
    this.height=BIRD_HEIGHT;
    this.width=BIRD_WIDTH;

    this.flap = function() {
        // console.log("in flap")
        if(this.y>10)
            this.y-=10
    }
    this.goDown = function() {
        this.y+=1.5
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

    this.shift_pipes = function () {
        for(i=0;i<world_reference.pipes.length;i++) {
            if(world_reference.pipes[i].x+PIPE_WIDTH <= 0) {
                world_reference.pipes[i].x = ARENA_WIDTH;
                world_reference.pipes[i].y = parseInt(Math.random()*(UPPER_LIMIT-LOWER_LIMIT)+LOWER_LIMIT);
                world_reference.pipes[i].scoreCountedFlag=0;
            }
            world_reference.game_speed=(Math.min(20, Math.max(10,world_reference.score)))/10.0;
            world_reference.pipes[i].x-=2;
        }
    }

    this.bird=new Bird();

    this.gravity = function() {
        if(world_reference.bird.y<ARENA_HEIGHT-BIRD_HEIGHT) {
            world_reference.bird.goDown();
        }
    }

    this.updateScore = function() {
        for(i=0;i<world_reference.pipes.length;i++) {
            if(world_reference.pipes[i].scoreCountedFlag == 0) {
                if(BIRD_X+BIRD_WIDTH >= world_reference.pipes[i].x && world_reference.pipes[i].y < world_reference.bird.y && world_reference.pipes[i].y+PIPE_GAP > world_reference.bird.y+BIRD_HEIGHT) {
                    world_reference.pipes[i].scoreCountedFlag = 1;
                    world_reference.score++;
                }
            }
        }
    }

    this.checkGameOver = function() {
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
    }

}

$(document).ready(function() {

    //create svg canvas
    var world=new World();
    p=document.createElementNS(SVG, "rect");

    //add bird to svg
    p.setAttribute("x", BIRD_X);
    p.setAttribute("y", world.bird.y);
    p.setAttribute("height", world.bird.height);
    p.setAttribute("width", world.bird.width);
    p.setAttribute("class", "bird");
    p.setAttribute("fill", "black");
    $('.arena').append(p);


    //add pipes to svg
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

    function updateSVG() {
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
    }
    updateSVG();

    var env = {};
    env.getNumStates = function() { return 3; }
    env.getMaxNumActions = function() { return 2; }

    // create the DQN agent
    var spec = {}
    spec.update = 'qlearn'; // qlearn | sarsa
    spec.gamma = 0.9; // discount factor, [0, 1)
    spec.epsilon = 0.1; // initial epsilon for epsilon-greedy policy, [0, 1)
    spec.alpha = 0.0001; // value function learning rate
    spec.experience_add_every = 5; // number of time steps before we add another experience to replay memory
    spec.experience_size = 5000; // size of experience replay memory
    spec.learning_steps_per_iteration = 10;
    spec.tderror_clamp = 1.0; // for robustness
    spec.num_hidden_units = 500 // number of neurons in hidden layer
    agent = new RL.DQNAgent(env, spec);
    closest_x =0;

    current_score=0;
    setInterval(function(){
        s=[];
        s.push(world.pipes[closest_x].x);
        s.push(world.pipes[closest_x].y);
        // s.push(world.pipes[(closest_x+1)%3].x);
        // s.push(world.pipes[(closest_x+1)%3].y);
        // s.push(world.pipes[(closest_x+2)%3].x);
        // s.push(world.pipes[(closest_x+2)%3].y);
        s.push(world.bird.y);

        var action = agent.act(s);

        if(action==1)
            world.bird.flap()

        world.shift_pipes();
        world.gravity();
        world.updateScore();
        world.checkGameOver();
        updateSVG();

        current_score=world.score;
        min_distance=10000;
        flag=1;
        for(i=0;i<world.pipes.length;i++) {
            if(world.pipes[i].x-BIRD_X > 0 && world.pipes[i].x-BIRD_X < min_distance )
            {
                closest_x = i;
                min_distance=world.pipes[i].x-BIRD_X;
            }
            if(world.bird.y>world.pipes[i].y && world.pipes[i].y+PIPE_GAP>world.bird.y && world.pipes[i].x<BIRD_X && world.pipes[i].x+PIPE_WIDTH>BIRD_X )
            {
                flag=0;
            }
        }
        if(flag==0)
        {
            reward=10*(current_score+1);
        }
        else {
            if(world.bird.y>world.pipes[closest_x].y && world.bird.y<world.pipes[closest_x].y+PIPE_GAP)
            {
                reward=2*(current_score+1);
            }
            else {
                reward=Math.abs((world.pipes[closest_x].y+PIPE_GAP/2)-world.bird.y)/-100
            }
        }

        if(world.gameover==1){
           reward=-10;
           delete world;
           world=new World();
           current_score=0;
       }
       reward=reward/10;
       console.log(agent.tderror);
       agent.learn(reward);
    }, 0);

});
