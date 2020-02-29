const aFrame = require('aframe');

class aFrameObj{
    constructor(params){
        this.element = document.getElementById(params.id);
    }

    __setAttribute__(params){
        this.element.setAttribute(params.attrName,params.attr);
    }

    getPosition(){
        return this.element.object3D.position;
    }

    moveObject({newPos=getPosition(), dur="1500", easing="linear"} = {}){
        this.__setAttribute__({
            attrName:"animation",
            attr:"property: position; to:"+newPos.x+" "+newPos.y+" "+newPos.z+"; dur: "+dur+"easing: "+easing
        });
    }
    
}

const box = new aFrameObj({id:"cube"});

box.moveObject({
    newPos:{
        x:-4,
        y:3,
        z:-6
    },
    dur:"2000"
});