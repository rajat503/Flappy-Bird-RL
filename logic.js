function Pipe(x, y) {
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
            this.   y=0
    }
}

var bird=new Bird();
bird.flap();
setInterval(function() {
    if(bird.y>0) {
        bird.goDown();
        console.log(bird.y);
    }
    else {
        clearInterval(this)
    }
}, 100);

function World() {
    var pipes;
    var currentBird;
}


var p1=new Pipe(10,10);
console.log(p1)


//
// $(document).ready(function() {
//     var element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//     element.setAttribute("x", "500");
//     element.setAttribute("y", "500");
//     element.setAttribute("height", "50");
//     element.setAttribute("width", "50");
//     element.setAttribute("class", "rect1");
//     $('.arena').append(element);
// });
//
// setInterval(function() {
//     var old_x = parseInt($('.rect1').attr('x'));
//     $('.rect1').attr('x', old_x-1);
//     if(old_x<=0) {
//         $('.rect1').remove();
//     }
// }, 5);
